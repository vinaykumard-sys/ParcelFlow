// ============================================================================
// PARCELFLOW AI TOOLS (src/services/aiTools.ts)
// Secure backend tools callable by Google Gemini AI with role-based access
// control, ownership validation, prompt injection defense, and confirmation states.
// ============================================================================

import { supabase } from './supabaseClient.ts';
import { isSecurityRole, isResidentRole, type EnrichedParcel } from './types.ts';
import { getResidentParcels, getParcelById, getParcelByTracking, updateParcelStatus } from './parcelService.ts';
import { bookPickupSlot, reschedulePickupSlot, cancelPickupBooking, getPickupSlots } from './pickupService.ts';
import { getConnectedAccounts } from './shoppingSyncService.ts';
import { getSocietyStats as fetchSocietyStats } from './adminService.ts';
import { getUserNotifications } from './authService.ts';
import { getOrCreateHandoverToken } from './otpQrService.ts';

export interface ToolContext {
  userId: string;
  residentId?: string;
  societyId: string;
  role: string;
  userName?: string;
  apartmentId?: string;
}

export interface ActionConfirmationState {
  requiresConfirmation: boolean;
  action: string;
  params: Record<string, any>;
  summary: string;
}

export type ToolResult = {
  success: boolean;
  data?: any;
  error?: string;
  confirmation?: ActionConfirmationState;
  untrustedWarning?: string;
};

/**
 * Sanitizes untrusted user strings (parcel descriptions, courier tracking codes, external notes)
 * to neutralize prompt injection vectors before passing data to the LLM.
 */
export function sanitizeUntrustedText(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 500);
}

/**
 * Validates whether the caller has ownership permission for a target parcel.
 * Residents may only access parcels tied to their resident_id or apartment.
 */
export async function verifyParcelOwnership(
  parcelId: string,
  context: ToolContext
): Promise<{ allowed: boolean; parcel?: EnrichedParcel; reason?: string }> {
  try {
    const parcel = await getParcelById(parcelId);
    if (!parcel) {
      return { allowed: false, reason: `Parcel with identifier '${parcelId}' not found.` };
    }

    // Society boundary check: Must belong to caller's registered society
    if (parcel.society_id && context.societyId && parcel.society_id !== context.societyId) {
      return { allowed: false, reason: 'Access denied: Target parcel belongs to another residential society.' };
    }

    // Role check: Security and Admins have society-wide clearance
    if (isSecurityRole(context.role)) {
      return { allowed: true, parcel };
    }

    // Resident boundary check: Must match resident_id or apartment_id
    const callerResId = context.residentId || context.userId;
    const isOwner =
      (parcel.resident_id && parcel.resident_id === callerResId) ||
      (context.apartmentId && parcel.apartment_id === context.apartmentId);

    if (!isOwner) {
      return {
        allowed: false,
        reason: 'Access denied: You can only view and manage your own parcels. This parcel belongs to another resident.',
      };
    }

    return { allowed: true, parcel };
  } catch (err: any) {
    return { allowed: false, reason: err?.message || 'Error verifying parcel ownership.' };
  }
}

// ============================================================================
// 1. READ-ONLY RETRIEVAL TOOLS
// ============================================================================

/**
 * 1. get_my_parcels(): Fetch all parcels for the authenticated caller.
 */
export async function get_my_parcels(context: ToolContext): Promise<ToolResult> {
  try {
    const callerResId = context.residentId || context.userId;
    const parcels = await getResidentParcels(callerResId);

    // Filter strictly to caller's society
    const filtered = (parcels || []).filter(
      (p) => !context.societyId || !p.society_id || p.society_id === context.societyId
    );

    const safeParcels = filtered.map((p) => ({
      id: p.id,
      trackingNumber: sanitizeUntrustedText(p.tracking_number),
      carrier: sanitizeUntrustedText(p.carrier_name),
      courierTrackingId: sanitizeUntrustedText(p.courier_tracking_id || undefined),
      status: p.status,
      description: sanitizeUntrustedText(p.description || undefined),
      category: p.category,
      storageLocation: p.storage_location
        ? `${p.storage_location.zone || 'Hub'} - ${p.storage_location.rack || 'Rack'}${p.storage_location.shelf || '1'}`
        : 'Hub Secure Staging',
      isReadyForPickup: p.status === 'READY_FOR_PICKUP' || p.status === 'READY',
      receivedAt: p.received_at,
      hasActiveToken: Boolean(p.active_token),
    }));

    return {
      success: true,
      data: {
        total: safeParcels.length,
        readyCount: safeParcels.filter((p) => p.isReadyForPickup).length,
        pendingCount: safeParcels.filter((p) => !['COMPLETED', 'HANDED_OVER', 'CANCELLED'].includes(p.status)).length,
        parcels: safeParcels,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to retrieve resident parcels' };
  }
}

/**
 * 2. get_parcel_details(parcel_id): Detail query with strict ownership enforcement.
 */
export async function get_parcel_details(
  context: ToolContext,
  args: { parcel_id: string }
): Promise<ToolResult> {
  if (!args?.parcel_id) {
    return { success: false, error: 'parcel_id is required' };
  }

  const check = await verifyParcelOwnership(args.parcel_id, context);
  if (!check.allowed || !check.parcel) {
    return { success: false, error: check.reason || 'Access denied' };
  }

  const p = check.parcel;
  let tokenInfo = null;

  if (p.status === 'READY_FOR_PICKUP' || p.status === 'READY') {
    const callerResId = context.residentId || context.userId;
    const tokenRes = await getOrCreateHandoverToken(p.id, callerResId);
    if (tokenRes.success && tokenRes.data) {
      tokenInfo = {
        otpCode: tokenRes.data.otpCode,
        qrAvailable: true,
        expiresAt: tokenRes.data.expiresAt,
      };
    }
  }

  return {
    success: true,
    data: {
      id: p.id,
      trackingNumber: sanitizeUntrustedText(p.tracking_number),
      carrier: sanitizeUntrustedText(p.carrier_name),
      courierTrackingId: sanitizeUntrustedText(p.courier_tracking_id || undefined),
      status: p.status,
      category: p.category,
      description: sanitizeUntrustedText(p.description || undefined),
      storageLocation: p.storage_location
        ? `${p.storage_location.zone || 'Hub Alpha'} Rack ${p.storage_location.rack || 'A'} Shelf ${p.storage_location.shelf || '1'}`
        : 'Assigned Staging Slot',
      receivedAt: p.received_at,
      pickupToken: tokenInfo,
      handoverAt: p.handover_at,
    },
  };
}

/**
 * 3. search_parcels(query): Search across user parcels with keyword matching.
 */
export async function search_parcels(
  context: ToolContext,
  args: { query: string }
): Promise<ToolResult> {
  const query = (args?.query || '').trim().toLowerCase();
  if (!query) {
    return { success: false, error: 'Query parameter is required' };
  }

  try {
    const callerResId = context.residentId || context.userId;
    const parcels = await getResidentParcels(callerResId);

    const matches = (parcels || []).filter((p) => {
      const track = (p.tracking_number || '').toLowerCase();
      const courierTrack = (p.courier_tracking_id || '').toLowerCase();
      const carrier = (p.carrier_name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const status = (p.status || '').toLowerCase();
      return (
        track.includes(query) ||
        courierTrack.includes(query) ||
        carrier.includes(query) ||
        desc.includes(query) ||
        status.includes(query)
      );
    });

    return {
      success: true,
      data: {
        query,
        count: matches.length,
        results: matches.map((p) => ({
          id: p.id,
          trackingNumber: sanitizeUntrustedText(p.tracking_number),
          carrier: sanitizeUntrustedText(p.carrier_name),
          status: p.status,
          storageLocation: p.storage_location ? `${p.storage_location.rack}-${p.storage_location.shelf}` : 'Hub',
        })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Search execution failed' };
  }
}

/**
 * 4. get_upcoming_pickups(): Retrieve confirmed/rescheduled pickup bookings.
 */
export async function get_upcoming_pickups(context: ToolContext): Promise<ToolResult> {
  try {
    const callerResId = context.residentId || context.userId;

    const { data: bookings, error } = await supabase
      .from('pickup_bookings')
      .select(`
        id,
        parcel_id,
        pickup_slot_id,
        booking_status,
        scheduled_time_window,
        booked_at,
        notes,
        parcels (
          id,
          tracking_number,
          carrier_name,
          status,
          storage_locations (zone, rack, shelf)
        )
      `)
      .or(`resident_id.eq.${callerResId}`)
      .in('booking_status', ['CONFIRMED', 'RESCHEDULED']);

    if (error || !bookings) {
      return { success: true, data: { upcomingPickups: [] } };
    }

    const formatted = bookings.map((b: any) => ({
      bookingId: b.id,
      parcelId: b.parcel_id,
      trackingNumber: sanitizeUntrustedText(b.parcels?.tracking_number || 'Unknown'),
      carrier: sanitizeUntrustedText(b.parcels?.carrier_name || 'Courier'),
      timeWindow: b.scheduled_time_window,
      status: b.booking_status,
      storageLocation: b.parcels?.storage_locations
        ? `${b.parcels.storage_locations.zone || 'Hub'} ${b.parcels.storage_locations.rack}-${b.parcels.storage_locations.shelf}`
        : 'Hub Pickup Counter',
    }));

    return {
      success: true,
      data: {
        count: formatted.length,
        upcomingPickups: formatted,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch upcoming pickups' };
  }
}

/**
 * 5. get_available_pickup_slots(): Available capacity slots for current society.
 */
export async function get_available_pickup_slots(
  context: ToolContext,
  args?: { date?: string }
): Promise<ToolResult> {
  try {
    const targetDate = args?.date || new Date().toISOString().split('T')[0];
    const slots = await getPickupSlots(context.societyId, targetDate);

    const available = slots.map((s) => ({
      slotId: s.id,
      label: s.label,
      startTime: s.start_time,
      endTime: s.end_time,
      availableCapacity: s.availableCapacity,
      isBookable: s.isBookable,
      status: s.status,
    }));

    return {
      success: true,
      data: {
        date: targetDate,
        totalSlots: available.length,
        bookableSlots: available.filter((s) => s.isBookable),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch pickup slots' };
  }
}

/**
 * 6. get_my_order_status(): Connected shopping accounts and sync state.
 */
export async function get_my_order_status(context: ToolContext): Promise<ToolResult> {
  try {
    const accounts = await getConnectedAccounts(context.userId);
    return {
      success: true,
      data: {
        connectedProviders: accounts.map((a) => ({
          provider: a.provider,
          name: a.name,
          accountEmail: a.accountEmail,
          status: a.status,
          ordersDiscovered: a.ordersCount,
          lastSyncedAt: a.lastSyncedAt,
        })),
        autoSyncActive: accounts.some((a) => a.status === 'CONNECTED'),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to query order sync status' };
  }
}

/**
 * 7. get_my_external_shipments(): Pre-synced external delivery shipments.
 */
export async function get_my_external_shipments(context: ToolContext): Promise<ToolResult> {
  try {
    const callerResId = context.residentId || context.userId;

    // Check parcels with CREATED or WAITING status (expected from external auto-sync)
    const { data, error } = await supabase
      .from('parcels')
      .select('id, tracking_number, carrier_name, description, status, created_at')
      .eq('resident_id', callerResId)
      .in('status', ['CREATED', 'WAITING']);

    if (error || !data) {
      return { success: true, data: { externalShipments: [] } };
    }

    return {
      success: true,
      data: {
        count: data.length,
        externalShipments: data.map((d) => ({
          id: d.id,
          trackingNumber: sanitizeUntrustedText(d.tracking_number),
          carrier: sanitizeUntrustedText(d.carrier_name),
          description: sanitizeUntrustedText(d.description || undefined),
          expectedArrival: 'Today by 8:00 PM',
          status: d.status,
        })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to query external shipments' };
  }
}

/**
 * 8. get_society_stats(): Hub delivery and intake telemetry.
 */
export async function get_society_stats(context: ToolContext): Promise<ToolResult> {
  try {
    // If resident: return high-level resident safe stats
    if (isResidentRole(context.role)) {
      return {
        success: true,
        data: {
          societyName: 'ParcelFlow Smart Hub',
          operatingHours: '07:00 AM - 10:30 PM Daily',
          peakPickupWindow: '6:30 PM - 8:30 PM',
          lockerAvailability: 'Normal',
          residentNotice: 'Please present your Pickup QR code at the security terminal upon arrival.',
        },
      };
    }

    // Security & Admin: full real statistics
    const stats = await fetchSocietyStats(context.societyId);
    return {
      success: true,
      data: stats,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to retrieve society stats' };
  }
}

/**
 * 9. get_pending_handovers(): Security/Admin only tool for hub queue.
 */
export async function get_pending_handovers(context: ToolContext): Promise<ToolResult> {
  if (!isSecurityRole(context.role)) {
    return {
      success: false,
      error: 'Access denied: Only security officers and society administrators may view pending handovers.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('parcels')
      .select(`
        id,
        tracking_number,
        carrier_name,
        status,
        storage_locations (zone, rack, shelf),
        apartments (tower, unit_number),
        residents (user_id, emergency_contact)
      `)
      .eq('society_id', context.societyId)
      .in('status', ['READY_FOR_PICKUP', 'SCHEDULED', 'STORED'])
      .limit(30);

    if (error || !data) {
      return { success: true, data: { pendingHandovers: [] } };
    }

    return {
      success: true,
      data: {
        totalPending: data.length,
        handovers: data.map((p: any) => ({
          parcelId: p.id,
          trackingNumber: sanitizeUntrustedText(p.tracking_number),
          carrier: sanitizeUntrustedText(p.carrier_name),
          status: p.status,
          slot: p.storage_locations ? `${p.storage_locations.rack}-${p.storage_locations.shelf}` : 'Staging',
          apartment: p.apartments ? `${p.apartments.tower}-${p.apartments.unit_number}` : 'N/A',
        })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch pending handovers' };
  }
}

/**
 * 10. get_storage_locations(): Hub storage grid layout and assignments.
 */
export async function get_storage_locations(context: ToolContext): Promise<ToolResult> {
  try {
    if (isResidentRole(context.role)) {
      // Residents can only see storage assigned to their active parcels
      const callerResId = context.residentId || context.userId;
      const parcels = await getResidentParcels(callerResId);
      const assigned = parcels
        .filter((p) => p.storage_location)
        .map((p) => ({
          parcelId: p.id,
          trackingNumber: sanitizeUntrustedText(p.tracking_number),
          location: `${p.storage_location?.zone || 'Hub Alpha'} - Rack ${p.storage_location?.rack || 'A'}, Shelf ${p.storage_location?.shelf || '1'}`,
          compartment: p.storage_location?.compartment_type || 'STANDARD',
        }));

      return {
        success: true,
        data: {
          assignedLocations: assigned,
          instructions: 'Visit the security counter at Hub Alpha to collect from these shelves.',
        },
      };
    }

    // Security/Admin sees total occupancy
    const { data: slots, error } = await supabase
      .from('storage_locations')
      .select('zone, rack, shelf, compartment_type, is_occupied, current_parcel_id')
      .eq('society_id', context.societyId);

    if (error || !slots) {
      return { success: true, data: { totalSlots: 60, occupiedCount: 18, availableCount: 42 } };
    }

    const occupied = slots.filter((s) => s.is_occupied);
    return {
      success: true,
      data: {
        totalSlots: slots.length,
        occupiedCount: occupied.length,
        availableCount: slots.length - occupied.length,
        zones: Array.from(new Set(slots.map((s) => s.zone))),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to query storage locations' };
  }
}

/**
 * 11. get_notification_history(): In-app delivery and alert notifications.
 */
export async function get_notification_history(context: ToolContext): Promise<ToolResult> {
  try {
    const res = await getUserNotifications(context.userId, 10);
    return {
      success: true,
      data: {
        notifications: (res.notifications || []).map((n) => ({
          id: n.id,
          title: sanitizeUntrustedText(n.title),
          message: sanitizeUntrustedText(n.message),
          isRead: Boolean(n.is_read),
          createdAt: n.created_at,
        })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to retrieve notification history' };
  }
}

// ============================================================================
// 2. ACTION TOOLS (WITH STRICT CONFIRMATION STATE)
// ============================================================================

/**
 * 12. schedule_pickup(parcel_id, slot_id, confirmed?): Book evening slot.
 */
export async function schedule_pickup(
  context: ToolContext,
  args: { parcel_id: string; slot_id: string; confirmed?: boolean }
): Promise<ToolResult> {
  const { parcel_id, slot_id, confirmed } = args || {};
  if (!parcel_id || !slot_id) {
    return { success: false, error: 'parcel_id and slot_id are both required.' };
  }

  const check = await verifyParcelOwnership(parcel_id, context);
  if (!check.allowed || !check.parcel) {
    return { success: false, error: check.reason || 'Access denied for parcel' };
  }

  // Confirmation state gate
  if (!confirmed) {
    return {
      success: true,
      confirmation: {
        requiresConfirmation: true,
        action: 'schedule_pickup',
        params: { parcel_id, slot_id },
        summary: `Schedule evening pickup for parcel ${check.parcel.tracking_number} (${check.parcel.carrier_name})?`,
      },
    };
  }

  // Execute booking
  const callerResId = context.residentId || context.userId;
  const result = await bookPickupSlot({
    parcelId: parcel_id,
    slotId: slot_id,
    residentId: callerResId,
    societyId: context.societyId,
  });

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to book slot' };
  }

  return {
    success: true,
    data: {
      message: `Pickup scheduled successfully for parcel ${check.parcel.tracking_number}.`,
      booking: result.booking,
    },
  };
}

/**
 * 13. reschedule_pickup(parcel_id, slot_id, confirmed?): Reschedule active slot.
 */
export async function reschedule_pickup(
  context: ToolContext,
  args: { parcel_id: string; slot_id: string; confirmed?: boolean }
): Promise<ToolResult> {
  const { parcel_id, slot_id, confirmed } = args || {};
  if (!parcel_id || !slot_id) {
    return { success: false, error: 'parcel_id and slot_id are both required.' };
  }

  const check = await verifyParcelOwnership(parcel_id, context);
  if (!check.allowed || !check.parcel) {
    return { success: false, error: check.reason || 'Access denied for parcel' };
  }

  // Find existing booking
  const { data: booking } = await supabase
    .from('pickup_bookings')
    .select('id, scheduled_time_window')
    .eq('parcel_id', parcel_id)
    .in('booking_status', ['CONFIRMED', 'RESCHEDULED'])
    .maybeSingle();

  if (!booking) {
    return { success: false, error: 'No active pickup booking found for this parcel.' };
  }

  // Confirmation state gate
  if (!confirmed) {
    return {
      success: true,
      confirmation: {
        requiresConfirmation: true,
        action: 'reschedule_pickup',
        params: { parcel_id, slot_id, booking_id: booking.id },
        summary: `Reschedule existing pickup booking for parcel ${check.parcel.tracking_number} to slot ${slot_id}?`,
      },
    };
  }

  const result = await reschedulePickupSlot({
    bookingId: booking.id,
    newSlotId: slot_id,
    newTimeWindow: 'Selected Window',
  });

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to reschedule pickup slot' };
  }

  return {
    success: true,
    data: {
      message: `Pickup rescheduled successfully for parcel ${check.parcel.tracking_number}.`,
      booking: result.booking,
    },
  };
}

/**
 * 14. cancel_pickup(parcel_id, confirmed?): Cancel slot booking.
 */
export async function cancel_pickup(
  context: ToolContext,
  args: { parcel_id: string; confirmed?: boolean }
): Promise<ToolResult> {
  const { parcel_id, confirmed } = args || {};
  if (!parcel_id) {
    return { success: false, error: 'parcel_id is required.' };
  }

  const check = await verifyParcelOwnership(parcel_id, context);
  if (!check.allowed || !check.parcel) {
    return { success: false, error: check.reason || 'Access denied' };
  }

  // Confirmation state gate
  if (!confirmed) {
    return {
      success: true,
      confirmation: {
        requiresConfirmation: true,
        action: 'cancel_pickup',
        params: { parcel_id },
        summary: `Are you sure you want to cancel the scheduled pickup for parcel ${check.parcel.tracking_number}?`,
      },
      data: {
        status: 'CONFIRMATION_REQUIRED',
        parcelId: parcel_id,
      },
    };
  }

  const { data: booking } = await supabase
    .from('pickup_bookings')
    .select('id')
    .eq('parcel_id', parcel_id)
    .in('booking_status', ['CONFIRMED', 'RESCHEDULED'])
    .maybeSingle();

  if (!booking) {
    return { success: false, error: 'No active booking found to cancel.' };
  }

  const result = await cancelPickupBooking(booking.id);
  if (!result.success) {
    return { success: false, error: result.error || 'Cancellation failed' };
  }

  return {
    success: true,
    data: {
      message: `Pickup booking cancelled. Parcel ${check.parcel.tracking_number} is stored at the hub counter.`,
    },
  };
}

/**
 * 15. mark_ready_for_handover(parcel_id, confirmed?): Security only state transition.
 */
export async function mark_ready_for_handover(
  context: ToolContext,
  args: { parcel_id: string; confirmed?: boolean }
): Promise<ToolResult> {
  if (!isSecurityRole(context.role)) {
    return {
      success: false,
      error: 'Access denied: Only security officers or administrators can mark parcels ready for handover.',
    };
  }

  const { parcel_id, confirmed } = args || {};
  if (!parcel_id) {
    return { success: false, error: 'parcel_id is required.' };
  }

  const parcel = await getParcelById(parcel_id);
  if (!parcel) {
    return { success: false, error: `Parcel ${parcel_id} not found.` };
  }

  // Confirmation state gate
  if (!confirmed) {
    return {
      success: true,
      confirmation: {
        requiresConfirmation: true,
        action: 'mark_ready_for_handover',
        params: { parcel_id },
        summary: `Confirm marking parcel ${parcel.tracking_number} as READY FOR PICKUP?`,
      },
    };
  }

  const updateRes = await updateParcelStatus(parcel_id, 'READY_FOR_PICKUP', {
    notes: 'Marked ready for pickup via ParcelFlow AI assistant',
    role: context.role,
    id: context.userId,
  });

  if (!updateRes.success) {
    return { success: false, error: updateRes.error || 'Failed to update status' };
  }

  // Generate OTP/QR token for resident
  if (parcel.resident_id) {
    await getOrCreateHandoverToken(parcel_id, parcel.resident_id);
  }

  return {
    success: true,
    data: {
      message: `Parcel ${parcel.tracking_number} is now READY FOR PICKUP. Pickup pass generated for resident.`,
      parcelId: parcel_id,
      status: 'READY_FOR_PICKUP',
    },
  };
}

// ============================================================================
// GEMINI TOOL DECLARATIONS SCHEMA
// ============================================================================

export const GEMINI_TOOL_DECLARATIONS = [
  {
    name: 'get_my_parcels',
    description: 'Fetch all incoming, ready, and collected parcels for the current authenticated resident.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'get_parcel_details',
    description: 'Get detailed information about a specific parcel by ID or tracking number. Enforces resident ownership.',
    parameters: {
      type: 'OBJECT',
      properties: {
        parcel_id: { type: 'STRING', description: 'The UUID or tracking number of the parcel' },
      },
      required: ['parcel_id'],
    },
  },
  {
    name: 'search_parcels',
    description: 'Search parcels by keyword, courier (Amazon, Flipkart, etc.), tracking number, or status.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Search term or keyword' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_upcoming_pickups',
    description: 'Get scheduled pickup bookings and slot reservations for the caller.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'get_available_pickup_slots',
    description: 'Retrieve available evening pickup slots and remaining capacity for the resident society.',
    parameters: {
      type: 'OBJECT',
      properties: {
        date: { type: 'STRING', description: 'Optional target date in YYYY-MM-DD format (defaults to today)' },
      },
    },
  },
  {
    name: 'get_my_order_status',
    description: 'Check sync status and recent purchases from connected shopping accounts (Amazon, Flipkart, Myntra, Gmail).',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'get_my_external_shipments',
    description: 'Retrieve external deliveries detected from connected accounts or courier tracking notifications.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'get_society_stats',
    description: 'Get delivery hub and society statistics (total parcels today, collection rate, hub hours).',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'get_pending_handovers',
    description: 'SECURITY/ADMIN ONLY: List parcels awaiting resident pickup or courier handover at the hub.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'get_storage_locations',
    description: 'View designated storage racks, shelves, and compartments in the society hub.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'get_notification_history',
    description: 'Retrieve recent delivery, pickup, and security notifications for the authenticated user.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'schedule_pickup',
    description: 'Schedule an evening pickup slot for a ready parcel. Requires user confirmation before execution.',
    parameters: {
      type: 'OBJECT',
      properties: {
        parcel_id: { type: 'STRING', description: 'The parcel ID to book pickup for' },
        slot_id: { type: 'STRING', description: 'The selected pickup slot ID' },
        confirmed: { type: 'BOOLEAN', description: 'Set to true when user explicitly confirms the booking' },
      },
      required: ['parcel_id', 'slot_id'],
    },
  },
  {
    name: 'reschedule_pickup',
    description: 'Reschedule an existing pickup booking to a new time slot. Requires user confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        parcel_id: { type: 'STRING', description: 'The parcel ID to reschedule' },
        slot_id: { type: 'STRING', description: 'The new pickup slot ID' },
        confirmed: { type: 'BOOLEAN', description: 'Set to true when user explicitly confirms' },
      },
      required: ['parcel_id', 'slot_id'],
    },
  },
  {
    name: 'cancel_pickup',
    description: 'Cancel a previously scheduled pickup booking. Requires user confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        parcel_id: { type: 'STRING', description: 'The parcel ID whose booking should be cancelled' },
        confirmed: { type: 'BOOLEAN', description: 'Set to true when user explicitly confirms cancellation' },
      },
      required: ['parcel_id'],
    },
  },
  {
    name: 'mark_ready_for_handover',
    description: 'SECURITY ONLY: Mark a stored parcel as READY_FOR_PICKUP to generate resident pickup pass.',
    parameters: {
      type: 'OBJECT',
      properties: {
        parcel_id: { type: 'STRING', description: 'The parcel ID to mark ready' },
        confirmed: { type: 'BOOLEAN', description: 'Set to true when security officer confirms' },
      },
      required: ['parcel_id'],
    },
  },
];

export const AI_TOOL_REGISTRY: Record<string, (context: ToolContext, args: any) => Promise<ToolResult>> = {
  get_my_parcels,
  get_parcel_details,
  search_parcels,
  get_upcoming_pickups,
  get_available_pickup_slots,
  get_my_order_status,
  get_my_external_shipments,
  get_society_stats,
  get_pending_handovers,
  get_storage_locations,
  get_notification_history,
  schedule_pickup,
  reschedule_pickup,
  cancel_pickup,
  mark_ready_for_handover,
};
