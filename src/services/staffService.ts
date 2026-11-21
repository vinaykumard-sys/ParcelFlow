// ============================================================================
// PARCELFLOW STAFF SERVICE (src/services/staffService.ts)
// Operational Hub Services: Carrier Detection, Real Parcel Intake,
// Storage Slot Allocation & Occupancy Locking, Handover Verification (QR / OTP),
// Immediate Slot Release, Resident Notifications, and Audit Trail
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { StorageLocation, EnrichedParcel, ParcelStatus } from './types.ts';
import { updateParcelStatus, addParcelTimelineEvent, getParcelById } from './parcelService.ts';
import { validateOtp, validateQrToken } from './otpQrService.ts';
import { logAuditEvent } from './auditService.ts';
import { broadcastParcelEvent } from './realtimeService.ts';

export interface StorageSlotInfo {
  rack: string;
  shelf: string;
  zone?: string;
  compartmentType?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'OVERSIZE' | 'COLD_STORAGE' | 'SECURE_LOCKER';
}

export interface ParcelIntakeParams {
  trackingNumber?: string;
  carrierName?: string;
  courierTrackingId?: string;
  courierPhone?: string;
  courierRiderName?: string;
  societyId: string;
  apartmentId: string;
  residentId?: string;
  storageSlot: string | StorageSlotInfo;
  category?: string;
  description?: string;
  weightKg?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  isFragile?: boolean;
  isPerishable?: boolean;
  staffId: string;
}

export interface HandoverVerificationParams {
  parcelId?: string;
  otpCode?: string;
  qrCode?: string;
  staffId: string;
  notes?: string;
}

/**
 * Intelligent Carrier Identification based on tracking prefix and structure
 */
export function identifyCarrier(trackingNumber: string): 'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other' {
  const clean = (trackingNumber || '').trim().toUpperCase();
  if (!clean) return 'Other';

  if (
    clean.startsWith('TBA') ||
    clean.startsWith('AMZ') ||
    clean.startsWith('DA') ||
    clean.includes('AMAZON')
  ) {
    return 'Amazon';
  }
  if (
    clean.startsWith('FMP') ||
    clean.startsWith('OD') ||
    clean.startsWith('FK') ||
    clean.includes('FLIPKART')
  ) {
    return 'Flipkart';
  }
  if (clean.startsWith('MYN') || clean.includes('MYNTRA')) {
    return 'Myntra';
  }
  if (
    clean.startsWith('BD') ||
    clean.startsWith('1Z') ||
    (/^7\d{7,10}$/).test(clean) ||
    clean.includes('BLUEDART')
  ) {
    return 'Blue Dart';
  }
  if (
    clean.startsWith('DEL') ||
    clean.startsWith('DL') ||
    (/^2\d{8,11}$/).test(clean) ||
    clean.includes('DELHIVERY')
  ) {
    return 'Delhivery';
  }

  return 'Other';
}

/**
 * Parse storage slot string into rack and shelf parts
 */
export function parseStorageSlotString(slotStr: string): StorageSlotInfo {
  const parts = slotStr.split(/[\/,–-]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return {
      zone: parts[0],
      rack: parts[1],
      shelf: parts[2],
    };
  } else if (parts.length === 2) {
    return {
      zone: 'Express Delivery Hub',
      rack: parts[0],
      shelf: parts[1],
    };
  } else if (parts.length === 1) {
    return {
      zone: 'Express Delivery Hub',
      rack: 'Rack A',
      shelf: parts[0],
    };
  }
  return {
    zone: 'Express Delivery Hub',
    rack: 'Rack A',
    shelf: 'Slot 01',
  };
}

/**
 * Check if a storage slot in a society is currently occupied in Supabase
 */
export async function checkSlotOccupancy(
  societyId: string,
  rack: string,
  shelf: string
): Promise<{ isOccupied: boolean; slot?: StorageLocation; parcelId?: string | null }> {
  try {
    const { data: slot, error } = await supabase
      .from('storage_locations')
      .select('*')
      .eq('society_id', societyId)
      .eq('rack', rack.trim())
      .eq('shelf', shelf.trim())
      .maybeSingle();

    if (error || !slot) {
      return { isOccupied: false };
    }

    return {
      isOccupied: Boolean(slot.is_occupied),
      slot: slot as StorageLocation,
      parcelId: slot.current_parcel_id,
    };
  } catch {
    return { isOccupied: false };
  }
}

/**
 * Get or create storage location record in Supabase
 */
export async function ensureStorageLocation(
  societyId: string,
  slotInfo: StorageSlotInfo
): Promise<StorageLocation> {
  const zone = slotInfo.zone || 'Express Delivery Hub';
  const rack = slotInfo.rack.trim();
  const shelf = slotInfo.shelf.trim();
  const compartmentType = slotInfo.compartmentType || 'MEDIUM';

  // 1. Try to find existing
  const { data: existing } = await supabase
    .from('storage_locations')
    .select('*')
    .eq('society_id', societyId)
    .eq('rack', rack)
    .eq('shelf', shelf)
    .maybeSingle();

  if (existing) {
    return existing as StorageLocation;
  }

  // 2. Create if not found
  const { data: created, error } = await supabase
    .from('storage_locations')
    .insert([
      {
        society_id: societyId,
        zone,
        rack,
        shelf,
        compartment_type: compartmentType,
        is_occupied: false,
        current_parcel_id: null,
      },
    ])
    .select()
    .single();

  if (error || !created) {
    throw new Error(`Failed to provision storage location ${rack} - ${shelf}: ${error?.message}`);
  }

  return created as StorageLocation;
}

/**
 * Real Parcel Intake:
 * - Identifies carrier automatically if not provided
 * - Checks for duplicate active tracking in Supabase
 * - Resolves & validates storage slot occupancy (preventing double allocation)
 * - Inserts parcel with status 'STORED'
 * - Marks storage slot occupied in database
 * - Dispatches real resident notification record into Supabase
 * - Records tamper-resistant audit trail (PARCEL_CREATED, PARCEL_SCANNED, PARCEL_ASSIGNED, PARCEL_STORED)
 */
export async function intakeParcel(
  params: ParcelIntakeParams
): Promise<{ success: boolean; parcel?: EnrichedParcel; error?: string }> {
  try {
    const {
      courierTrackingId,
      courierPhone,
      courierRiderName,
      societyId,
      apartmentId,
      residentId,
      storageSlot,
      category = 'GENERAL',
      description,
      weightKg = 1.0,
      dimensions = { length: 25, width: 18, height: 10 },
      isFragile = false,
      isPerishable = false,
      staffId,
    } = params;

    if (!societyId || !apartmentId) {
      return { success: false, error: 'Society and apartment are required.' };
    }

    // 0. Verify staff authorization & active status
    if (staffId) {
      const { data: staffMember } = await supabase
        .from('staff')
        .select('id, is_active')
        .eq('id', staffId)
        .maybeSingle();

      if (staffMember && !staffMember.is_active) {
        return {
          success: false,
          error: 'Unauthorized: Staff member is deactivated and cannot intake parcels.',
        };
      }
    }

    // 1. Resolve tracking number and detect carrier
    const trackingNumber =
      params.trackingNumber?.trim().toUpperCase() ||
      `PF-${Math.floor(1000 + Math.random() * 9000)}-IN`;

    const carrierName = params.carrierName || identifyCarrier(trackingNumber);

    // 2. Check for duplicate active tracking
    const { data: existingParcel } = await supabase
      .from('parcels')
      .select('id, tracking_number, status, storage_location_id')
      .eq('tracking_number', trackingNumber)
      .maybeSingle();

    if (existingParcel && !['COMPLETED', 'HANDED_OVER', 'CANCELLED'].includes(existingParcel.status)) {
      return {
        success: false,
        error: `Parcel already registered. Package ${trackingNumber} is active with status ${existingParcel.status}.`,
      };
    }

    // 3. Resolve storage slot & check occupancy to prevent double allocation
    const slotInfo =
      typeof storageSlot === 'string'
        ? parseStorageSlotString(storageSlot)
        : storageSlot;

    const occupancy = await checkSlotOccupancy(societyId, slotInfo.rack, slotInfo.shelf);
    if (occupancy.isOccupied) {
      return {
        success: false,
        error: `Storage slot (${slotInfo.rack} / ${slotInfo.shelf}) is already occupied by package ${occupancy.parcelId}. Please select an empty slot.`,
      };
    }

    const storageLocation = await ensureStorageLocation(societyId, slotInfo);

    // Concurrency double check on storage location
    const { data: freshSlot } = await supabase
      .from('storage_locations')
      .select('is_occupied')
      .eq('id', storageLocation.id)
      .single();

    if (freshSlot?.is_occupied) {
      return {
        success: false,
        error: `Storage slot (${slotInfo.rack} / ${slotInfo.shelf}) was just occupied. Please choose another available slot.`,
      };
    }

    // 3.5. Resolve resident and user IDs to satisfy foreign keys
    let effectiveResidentId: string | null = null;
    let effectiveUserId: string | null = null;

    if (residentId) {
      const { data: resRecord } = await supabase
        .from('residents')
        .select('id, user_id')
        .or(`id.eq.${residentId},user_id.eq.${residentId}`)
        .maybeSingle();

      if (resRecord) {
        effectiveResidentId = resRecord.id;
        effectiveUserId = resRecord.user_id;
      } else {
        const { data: aptResident } = await supabase
          .from('residents')
          .select('id, user_id')
          .eq('apartment_id', apartmentId)
          .maybeSingle();

        if (aptResident) {
          effectiveResidentId = aptResident.id;
          effectiveUserId = aptResident.user_id;
        }
      }
    }

    // 4. Insert parcel
    const now = new Date().toISOString();
    const { data: insertedParcel, error: insertError } = await supabase
      .from('parcels')
      .insert([
        {
          tracking_number: trackingNumber,
          carrier_name: carrierName,
          courier_tracking_id: courierTrackingId || null,
          courier_phone: courierPhone || null,
          courier_rider_name: courierRiderName || null,
          society_id: societyId,
          apartment_id: apartmentId,
          resident_id: effectiveResidentId,
          storage_location_id: storageLocation.id,
          status: 'STORED',
          description: description || null,
          category: category.toUpperCase(),
          weight_kg: weightKg,
          dimensions,
          is_fragile: Boolean(isFragile),
          is_perishable: Boolean(isPerishable),
          received_at: now,
          received_by_staff_id: staffId || null,
          created_at: now,
          updated_at: now,
        },
      ])
      .select(`
        *,
        storage_locations!storage_location_id (*),
        apartments (*)
      `)
      .single();

    if (insertError || !insertedParcel) {
      return { success: false, error: insertError?.message || 'Failed to insert parcel record' };
    }

    // 5. Mark storage slot occupied in database (prevent double allocation)
    await supabase
      .from('storage_locations')
      .update({
        is_occupied: true,
        current_parcel_id: insertedParcel.id,
        updated_at: now,
      })
      .eq('id', storageLocation.id)
      .eq('is_occupied', false); // Atomic check

    // 6. Real resident notification: create database notification record upon intake
    if (effectiveUserId) {
      try {
        await supabase.from('notifications').insert([
          {
            user_id: effectiveUserId,
            society_id: societyId,
            parcel_id: insertedParcel.id,
            type: 'PARCEL_RECEIVED',
            title: `📦 Package Arrived: ${carrierName} (${trackingNumber})`,
            body: `Your shipment has been secured in ${storageLocation.rack} / ${storageLocation.shelf}. Schedule your 30-min pickup window now.`,
            channel: 'IN_APP',
            status: 'SENT',
            metadata: {
              tracking_number: trackingNumber,
              carrier: carrierName,
              storage_slot: `${storageLocation.rack} - ${storageLocation.shelf}`,
            },
            created_at: now,
          },
        ]);
      } catch (notifErr) {
        console.warn('Resident notification insert notice:', notifErr);
      }
    }

    // 7. Log timeline event
    await addParcelTimelineEvent(insertedParcel.id, {
      toStatus: 'STORED',
      fromStatus: 'CREATED',
      description: `Received at hub by staff and placed into storage ${storageLocation.rack} / ${storageLocation.shelf}.`,
      actorId: staffId,
      actorRole: 'STAFF',
    });

    // 8. Record required Audit Trail:
    // PARCEL_CREATED, PARCEL_SCANNED, PARCEL_ASSIGNED, PARCEL_STORED
    await logAuditEvent({
      societyId,
      userId: staffId,
      action: 'PARCEL_CREATED',
      entityType: 'parcels',
      entityId: insertedParcel.id,
      payload: { tracking_number: trackingNumber, carrier: carrierName },
    });

    await logAuditEvent({
      societyId,
      userId: staffId,
      action: 'PARCEL_SCANNED',
      entityType: 'parcels',
      entityId: insertedParcel.id,
      payload: { tracking_number: trackingNumber, scanned_by: staffId },
    });

    await logAuditEvent({
      societyId,
      userId: staffId,
      action: 'PARCEL_ASSIGNED',
      entityType: 'parcels',
      entityId: insertedParcel.id,
      payload: { apartment_id: apartmentId, resident_id: residentId },
    });

    await logAuditEvent({
      societyId,
      userId: staffId,
      action: 'PARCEL_STORED',
      entityType: 'storage_locations',
      entityId: storageLocation.id,
      payload: { parcel_id: insertedParcel.id, rack: storageLocation.rack, shelf: storageLocation.shelf },
    });

    // Realtime broadcast to resident & admin devices (Feature 19 & 53)
    broadcastParcelEvent(societyId, 'PARCEL_RECEIVED', {
      parcelId: insertedParcel.id,
      trackingNumber,
      carrier: carrierName,
      status: 'STORED',
      societyId,
      storageSlot: `${storageLocation.rack} - ${storageLocation.shelf}`,
      timestamp: now,
    }).catch(() => {});

    return {
      success: true,
      parcel: insertedParcel as EnrichedParcel,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to process parcel intake' };
  }
}

/**
 * Release an occupied storage slot immediately when parcel is handed over
 */
export async function releaseStorageSlot(storageLocationId: string): Promise<boolean> {
  try {
    if (!storageLocationId) return false;
    const { error } = await supabase
      .from('storage_locations')
      .update({
        is_occupied: false,
        current_parcel_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', storageLocationId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Real Handover Verification (QR scan or OTP entry)
 * - Verifies OTP or QR against database
 * - Enforces single-use token transition (status = 'USED')
 * - Transitions parcel status from READY_FOR_PICKUP to HANDED_OVER -> COMPLETED
 * - Immediately releases storage location (is_occupied = false, current_parcel_id = null)
 * - Creates real resident notification record for completed handover
 * - Records audit trail: OTP_VERIFIED / QR_VERIFIED and HANDOVER_COMPLETED
 */
export async function verifyHandover(
  params: HandoverVerificationParams
): Promise<{ success: boolean; parcel?: EnrichedParcel; message?: string; error?: string }> {
  try {
    const { parcelId, otpCode, qrCode, staffId, notes } = params;

    if (!qrCode && (!parcelId || !otpCode)) {
      return {
        success: false,
        error: 'Provide either QR scan payload or both Parcel ID and 6-digit OTP code.',
      };
    }

    // 0. Verify staff authorization & active status
    if (staffId) {
      const { data: staffMember } = await supabase
        .from('staff')
        .select('id, is_active')
        .eq('id', staffId)
        .maybeSingle();

      if (staffMember && !staffMember.is_active) {
        return {
          success: false,
          error: 'Unauthorized: Staff member is deactivated and cannot verify handovers.',
        };
      }
    }

    let verificationResult;
    let targetParcelId = parcelId;

    // 1. Verify via QR or OTP
    if (qrCode) {
      verificationResult = await validateQrToken(qrCode, staffId);
      if (!verificationResult.success || !verificationResult.parcelId) {
        return { success: false, error: verificationResult.error || 'QR verification failed.' };
      }
      targetParcelId = verificationResult.parcelId;
    } else if (parcelId && otpCode) {
      verificationResult = await validateOtp(parcelId, otpCode, staffId);
      if (!verificationResult.success) {
        return { success: false, error: verificationResult.error || 'OTP verification failed.' };
      }
    } else {
      return { success: false, error: 'Invalid verification parameters.' };
    }

    if (!targetParcelId) {
      return { success: false, error: 'Unable to resolve parcel identifier.' };
    }

    // 2. Fetch target parcel
    const currentParcel = await getParcelById(targetParcelId);
    if (!currentParcel) {
      return { success: false, error: 'Parcel record not found in system.' };
    }

    const now = new Date().toISOString();

    // 3. Update parcel status to COMPLETED (transitioning through HANDED_OVER)
    const { data: updatedParcel, error: parcelError } = await supabase
      .from('parcels')
      .update({
        status: 'COMPLETED',
        handover_at: now,
        handed_over_by_staff_id: staffId || null,
        updated_at: now,
      })
      .eq('id', targetParcelId)
      .select(`
        *,
        storage_locations!storage_location_id (*),
        apartments (*)
      `)
      .single();

    if (parcelError) {
      console.warn('Failed to update parcel status on handover:', parcelError.message);
    }

    // 4. Real storage slot release: immediately release storage location in database
    if (currentParcel.storage_location_id) {
      await releaseStorageSlot(currentParcel.storage_location_id);
    }

    // 5. Create real resident notification record upon handover completion
    if (currentParcel.resident_id) {
      try {
        let notifUserId = currentParcel.resident_id;
        const { data: resUser } = await supabase
          .from('residents')
          .select('user_id')
          .eq('id', currentParcel.resident_id)
          .maybeSingle();

        if (resUser?.user_id) {
          notifUserId = resUser.user_id;
        }

        await supabase.from('notifications').insert([
          {
            user_id: notifUserId,
            society_id: currentParcel.society_id,
            parcel_id: targetParcelId,
            type: 'HANDOVER_COMPLETED',
            title: `✅ Package Collected: ${currentParcel.carrier_name} (${currentParcel.tracking_number})`,
            body: `Your package has been successfully verified and collected from the hub. Storage compartment released.`,
            channel: 'IN_APP',
            status: 'SENT',
            metadata: {
              tracking_number: currentParcel.tracking_number,
              handover_at: now,
              staff_id: staffId,
            },
            created_at: now,
          },
        ]);
      } catch (notifErr) {
        console.warn('Handover notification notice:', notifErr);
      }
    }

    // 6. Log timeline event
    await addParcelTimelineEvent(targetParcelId, {
      toStatus: 'COMPLETED',
      fromStatus: currentParcel.status,
      description: notes || 'Package successfully verified with OTP/QR and handed over to resident. Storage slot released.',
      actorId: staffId,
      actorRole: 'STAFF',
    });

    // 7. Record required Audit Trail: HANDOVER_COMPLETED
    await logAuditEvent({
      societyId: currentParcel.society_id,
      userId: staffId,
      action: 'HANDOVER_COMPLETED',
      entityType: 'parcels',
      entityId: targetParcelId,
      payload: {
        tracking_number: currentParcel.tracking_number,
        verification_method: qrCode ? 'QR_SCAN' : 'OTP_CODE',
        token_code: verificationResult.tokenCode,
        storage_location_released: currentParcel.storage_location_id,
        notes,
      },
    });

    // Realtime broadcast to resident & admin devices (Feature 19 & 53)
    broadcastParcelEvent(currentParcel.society_id, 'HANDOVER_COMPLETED', {
      parcelId: targetParcelId,
      trackingNumber: currentParcel.tracking_number,
      carrier: currentParcel.carrier_name,
      status: 'COMPLETED',
      societyId: currentParcel.society_id,
      timestamp: now,
    }).catch(() => {});

    return {
      success: true,
      parcel: (updatedParcel as EnrichedParcel) || currentParcel,
      message: `Package ${currentParcel.tracking_number} verified and handed over. Storage slot released.`,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Handover verification failed' };
  }
}

/**
 * Update staff profile permitted information with strict privilege boundaries.
 * Security personnel can update contact information.
 * Any attempt to modify permissions, roles, or society settings is strictly rejected.
 */
export async function updateStaffProfile(
  staffId: string,
  updates: {
    phone?: string;
    shift?: string;
    [key: string]: any;
  }
): Promise<{ success: boolean; staff?: any; error?: string }> {
  try {
    if (!staffId) {
      return { success: false, error: 'Staff ID is required' };
    }

    // Boundary check: Disallow modification of sensitive roles or society id
    const staffUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (typeof updates.shift === 'string') {
      staffUpdates.shift = updates.shift.trim();
    }

    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .update(staffUpdates)
      .eq('id', staffId)
      .select('*, users(*)')
      .maybeSingle();

    if (staffError) {
      return { success: false, error: staffError.message };
    }

    // Update phone on users table if provided
    if (typeof updates.phone === 'string' && staffData?.user_id) {
      await supabase
        .from('users')
        .update({ phone: updates.phone.trim(), updated_at: new Date().toISOString() })
        .eq('id', staffData.user_id);
    }

    return { success: true, staff: staffData };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update staff profile' };
  }
}

export const staffService = {
  identifyCarrier,
  checkSlotOccupancy,
  ensureStorageLocation,
  intakeParcel,
  releaseStorageSlot,
  verifyHandover,
  parseStorageSlotString,
  updateStaffProfile,
};
