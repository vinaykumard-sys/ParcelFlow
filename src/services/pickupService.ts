// ============================================================================
// PARCELFLOW PICKUP SERVICE (src/services/pickupService.ts)
// Real Pickup Slot Windows, Capacity Counting, Slot Booking, Rescheduling,
// and Cancellation backed by Supabase tables
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { PickupSlot, PickupBooking } from './types.ts';
import { updateParcelStatus, addParcelTimelineEvent } from './parcelService.ts';

export interface PickupWindowDefinition {
  startTime: string; // '17:00'
  endTime: string;   // '17:30'
  label: string;     // '5:00 PM – 5:30 PM'
  defaultCapacity: number;
}

export const DEFAULT_EVENING_SLOTS: PickupWindowDefinition[] = [
  { startTime: '17:00:00', endTime: '17:30:00', label: '5:00 PM – 5:30 PM', defaultCapacity: 20 },
  { startTime: '18:00:00', endTime: '18:30:00', label: '6:00 PM – 6:30 PM', defaultCapacity: 25 },
  { startTime: '18:30:00', endTime: '19:00:00', label: '6:30 PM – 7:00 PM', defaultCapacity: 25 },
  { startTime: '19:00:00', endTime: '19:30:00', label: '7:00 PM – 7:30 PM', defaultCapacity: 30 },
  { startTime: '20:00:00', endTime: '20:30:00', label: '8:00 PM – 8:30 PM', defaultCapacity: 35 },
  { startTime: '21:00:00', endTime: '21:30:00', label: '9:00 PM – 9:30 PM', defaultCapacity: 20 },
];

export interface EnrichedPickupSlot extends PickupSlot {
  label: string;
  availableCapacity: number;
  isBookable: boolean;
}

/**
 * Format 24-hr time to 12-hr string
 */
export function formatTimeWindowLabel(startTime: string, endTime: string): string {
  function to12h(t: string): string {
    const parts = t.split(':');
    let hour = parseInt(parts[0], 10);
    const min = parts[1] || '00';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${min} ${ampm}`;
  }
  return `${to12h(startTime)} – ${to12h(endTime)}`;
}

/**
 * Fetch pickup slots with live capacity counting for a given society & date
 * Auto-provisions the evening windows if no slots are registered yet for the day
 */
export async function getPickupSlots(
  societyId: string,
  targetDate?: string
): Promise<EnrichedPickupSlot[]> {
  try {
    const dateStr = targetDate || new Date().toISOString().split('T')[0];

    // 1. Query existing slots in Supabase
    const { data: slots, error } = await supabase
      .from('pickup_slots')
      .select('*')
      .eq('society_id', societyId)
      .eq('slot_date', dateStr)
      .order('start_time', { ascending: true });

    if (error) {
      console.warn('Error querying pickup_slots:', error.message);
    }

    // 2. If slots exist in database, return enriched with capacity
    if (slots && slots.length > 0) {
      return slots.map((s) => {
        const available = Math.max(0, s.max_capacity - s.current_bookings_count);
        return {
          ...s,
          label: formatTimeWindowLabel(s.start_time, s.end_time),
          availableCapacity: available,
          isBookable: s.status === 'AVAILABLE' && available > 0,
        };
      });
    }

    // 3. Auto-seed default evening slots in database for this society & date
    try {
      const inserts = DEFAULT_EVENING_SLOTS.map((def) => ({
        society_id: societyId,
        slot_date: dateStr,
        start_time: def.startTime,
        end_time: def.endTime,
        max_capacity: def.defaultCapacity,
        current_bookings_count: 0,
        status: 'AVAILABLE',
      }));

      const { data: createdSlots, error: insertError } = await supabase
        .from('pickup_slots')
        .insert(inserts)
        .select();

      if (!insertError && createdSlots && createdSlots.length > 0) {
        return createdSlots.map((s) => ({
          ...s,
          label: formatTimeWindowLabel(s.start_time, s.end_time),
          availableCapacity: s.max_capacity,
          isBookable: true,
        }));
      }
    } catch (seedErr) {
      console.warn('Auto-seed pickup slots notice:', seedErr);
    }

    // Fallback in-memory representation if DB insert is restricted
    return DEFAULT_EVENING_SLOTS.map((def, idx) => ({
      id: `slot-local-${idx + 1}`,
      society_id: societyId,
      slot_date: dateStr,
      start_time: def.startTime,
      end_time: def.endTime,
      max_capacity: def.defaultCapacity,
      current_bookings_count: 0,
      status: 'AVAILABLE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      label: def.label,
      availableCapacity: def.defaultCapacity,
      isBookable: true,
    }));
  } catch (err: any) {
    console.error('Error in getPickupSlots:', err);
    return [];
  }
}

/**
 * Book a pickup slot with capacity validation and status synchronization
 */
export async function bookPickupSlot(params: {
  parcelId: string;
  residentId: string;
  slotId: string;
  timeWindow: string;
  notes?: string;
  societyId?: string;
}): Promise<{ success: boolean; booking?: PickupBooking; error?: string }> {
  try {
    const { parcelId, residentId, slotId, timeWindow, notes, societyId } = params;

    if (!parcelId || !residentId || !slotId) {
      return { success: false, error: 'Parcel ID, Resident ID, and Slot ID are required.' };
    }

    // 1. Check slot capacity in database
    const { data: slot, error: slotError } = await supabase
      .from('pickup_slots')
      .select('*')
      .eq('id', slotId)
      .maybeSingle();

    if (slotError) {
      console.warn('Error reading slot capacity:', slotError.message);
    }

    if (slot) {
      if (slot.status !== 'AVAILABLE' || slot.current_bookings_count >= slot.max_capacity) {
        return { success: false, error: 'The selected pickup slot is currently full. Please select another time window.' };
      }
    }

    // 2. Check for existing active booking for this parcel
    const { data: existingBooking } = await supabase
      .from('pickup_bookings')
      .select('id, pickup_slot_id, booking_status')
      .eq('parcel_id', parcelId)
      .in('booking_status', ['CONFIRMED', 'RESCHEDULED'])
      .maybeSingle();

    if (existingBooking) {
      // Re-route to reschedule
      return reschedulePickupSlot({
        bookingId: existingBooking.id,
        newSlotId: slotId,
        newTimeWindow: timeWindow,
        notes,
      });
    }

    // 3. Create booking record in pickup_bookings
    const now = new Date().toISOString();
    const { data: booking, error: bookingError } = await supabase
      .from('pickup_bookings')
      .insert([
        {
          society_id: societyId || slot?.society_id || null,
          parcel_id: parcelId,
          pickup_slot_id: slotId,
          resident_id: residentId,
          booking_status: 'CONFIRMED',
          scheduled_time_window: timeWindow,
          notes: notes || null,
          booked_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (bookingError) {
      console.warn('Supabase booking insert error:', bookingError.message);
      return { success: false, error: bookingError.message };
    }

    // 4. Increment slot count
    if (slot) {
      const newCount = slot.current_bookings_count + 1;
      const newStatus = newCount >= slot.max_capacity ? 'FULL' : 'AVAILABLE';
      await supabase
        .from('pickup_slots')
        .update({
          current_bookings_count: newCount,
          status: newStatus,
          updated_at: now,
        })
        .eq('id', slotId);
    }

    // 5. Update parcel status to SCHEDULED
    await updateParcelStatus(parcelId, 'SCHEDULED', {
      notes: `Resident scheduled pickup for evening window ${timeWindow}.`,
      role: 'RESIDENT',
      id: residentId,
    });

    // 6. Log audit record
    await supabase.from('audit_logs').insert([
      {
        society_id: societyId || slot?.society_id || null,
        user_id: residentId,
        action: 'PICKUP_BOOKED',
        entity_type: 'pickup_bookings',
        entity_id: booking?.id || null,
        payload: { parcel_id: parcelId, slot_id: slotId, time_window: timeWindow },
        created_at: now,
      },
    ]);

    return {
      success: true,
      booking: booking as PickupBooking,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to book pickup slot' };
  }
}

/**
 * Reschedule an existing pickup slot booking
 */
export async function reschedulePickupSlot(params: {
  bookingId: string;
  newSlotId: string;
  newTimeWindow: string;
  notes?: string;
}): Promise<{ success: boolean; booking?: PickupBooking; error?: string }> {
  try {
    const { bookingId, newSlotId, newTimeWindow, notes } = params;

    // 1. Fetch current booking
    const { data: booking, error: fetchError } = await supabase
      .from('pickup_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: 'Existing booking record not found.' };
    }

    const oldSlotId = booking.pickup_slot_id;
    const parcelId = booking.parcel_id;
    const now = new Date().toISOString();

    // 2. Validate new slot capacity
    if (newSlotId !== oldSlotId) {
      const { data: newSlot } = await supabase
        .from('pickup_slots')
        .select('*')
        .eq('id', newSlotId)
        .maybeSingle();

      if (newSlot && (newSlot.status !== 'AVAILABLE' || newSlot.current_bookings_count >= newSlot.max_capacity)) {
        return { success: false, error: 'The new pickup slot is already full.' };
      }

      // Decrement old slot count
      const { data: oldSlot } = await supabase
        .from('pickup_slots')
        .select('*')
        .eq('id', oldSlotId)
        .maybeSingle();

      if (oldSlot) {
        const decremented = Math.max(0, oldSlot.current_bookings_count - 1);
        await supabase
          .from('pickup_slots')
          .update({
            current_bookings_count: decremented,
            status: 'AVAILABLE',
            updated_at: now,
          })
          .eq('id', oldSlotId);
      }

      // Increment new slot count
      if (newSlot) {
        const incremented = newSlot.current_bookings_count + 1;
        await supabase
          .from('pickup_slots')
          .update({
            current_bookings_count: incremented,
            status: incremented >= newSlot.max_capacity ? 'FULL' : 'AVAILABLE',
            updated_at: now,
          })
          .eq('id', newSlotId);
      }
    }

    // 3. Update booking record
    const { data: updatedBooking, error: updateError } = await supabase
      .from('pickup_bookings')
      .update({
        pickup_slot_id: newSlotId,
        scheduled_time_window: newTimeWindow,
        booking_status: 'RESCHEDULED',
        notes: notes || booking.notes,
        updated_at: now,
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // 4. Log parcel timeline event
    await addParcelTimelineEvent(parcelId, {
      toStatus: 'SCHEDULED',
      fromStatus: 'SCHEDULED',
      description: `Pickup rescheduled to window: ${newTimeWindow}.`,
      actorId: booking.resident_id,
      actorRole: 'RESIDENT',
    });

    // 5. Audit log
    await supabase.from('audit_logs').insert([
      {
        society_id: booking.society_id,
        user_id: booking.resident_id,
        action: 'PICKUP_RESCHEDULED',
        entity_type: 'pickup_bookings',
        entity_id: bookingId,
        payload: { oldSlotId, newSlotId, newTimeWindow },
        created_at: now,
      },
    ]);

    return {
      success: true,
      booking: updatedBooking as PickupBooking,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to reschedule pickup slot' };
  }
}

/**
 * Cancel a scheduled pickup booking and release the slot capacity
 */
export async function cancelPickupBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: booking, error: fetchError } = await supabase
      .from('pickup_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: 'Booking record not found' };
    }

    const now = new Date().toISOString();

    // 1. Mark booking CANCELLED
    await supabase
      .from('pickup_bookings')
      .update({
        booking_status: 'CANCELLED',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled by resident',
        updated_at: now,
      })
      .eq('id', bookingId);

    // 2. Decrement slot count
    const { data: slot } = await supabase
      .from('pickup_slots')
      .select('*')
      .eq('id', booking.pickup_slot_id)
      .maybeSingle();

    if (slot) {
      const decremented = Math.max(0, slot.current_bookings_count - 1);
      await supabase
        .from('pickup_slots')
        .update({
          current_bookings_count: decremented,
          status: 'AVAILABLE',
          updated_at: now,
        })
        .eq('id', booking.pickup_slot_id);
    }

    // 3. Update parcel status back to STORED
    await updateParcelStatus(booking.parcel_id, 'STORED', {
      notes: reason ? `Pickup cancelled: ${reason}` : 'Pickup appointment cancelled by resident.',
      actorId: booking.resident_id,
      actorRole: 'RESIDENT',
    });

    // 4. Audit log
    await supabase.from('audit_logs').insert([
      {
        society_id: booking.society_id,
        user_id: booking.resident_id,
        action: 'PICKUP_CANCELLED',
        entity_type: 'pickup_bookings',
        entity_id: bookingId,
        payload: { reason },
        created_at: now,
      },
    ]);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to cancel booking' };
  }
}

/**
 * Get active booking for a parcel
 */
export async function getActiveBookingForParcel(parcelId: string): Promise<PickupBooking | null> {
  try {
    const { data, error } = await supabase
      .from('pickup_bookings')
      .select('*')
      .eq('parcel_id', parcelId)
      .in('booking_status', ['CONFIRMED', 'RESCHEDULED'])
      .order('booked_at', { ascending: false })
      .maybeSingle();

    if (error || !data) return null;
    return data as PickupBooking;
  } catch {
    return null;
  }
}

export const pickupService = {
  getPickupSlots,
  bookPickupSlot,
  reschedulePickupSlot,
  cancelPickupBooking,
  getActiveBookingForParcel,
  formatTimeWindowLabel,
  DEFAULT_EVENING_SLOTS,
};
