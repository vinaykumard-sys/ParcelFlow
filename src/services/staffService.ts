// ============================================================================
// PARCELFLOW STAFF SERVICE (src/services/staffService.ts)
// Operational Hub Services: Parcel Intake, Storage Slot Management,
// Occupancy Checking, and Handover Verification (QR / OTP)
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { StorageLocation, EnrichedParcel, ParcelStatus } from './types.ts';
import { updateParcelStatus, addParcelTimelineEvent, getParcelById } from './parcelService.ts';
import { validateOtp, validateQrToken } from './otpQrService.ts';

export interface StorageSlotInfo {
  rack: string;
  shelf: string;
  zone?: string;
  compartmentType?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'OVERSIZE' | 'COLD_STORAGE' | 'SECURE_LOCKER';
}

export interface ParcelIntakeParams {
  trackingNumber?: string;
  carrierName: string;
  courierTrackingId?: string;
  courierPhone?: string;
  courierRiderName?: string;
  societyId: string;
  apartmentId: string;
  residentId?: string;
  storageSlot: string | StorageSlotInfo; // e.g. "Tower B / Rack B / Slot 17" or { rack: "Rack B", shelf: "Slot 17" }
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
 * Parse storage slot string into rack and shelf parts
 * e.g. "Tower B / Rack B / Slot 17" -> { zone: "Tower B", rack: "Rack B", shelf: "Slot 17" }
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
      zone: 'Hub Alpha',
      rack: parts[0],
      shelf: parts[1],
    };
  } else if (parts.length === 1) {
    return {
      zone: 'Hub Alpha',
      rack: 'Rack A',
      shelf: parts[0],
    };
  }
  return {
    zone: 'Hub Alpha',
    rack: 'Rack A',
    shelf: 'Slot 01',
  };
}

/**
 * Check if a storage slot in a society is currently occupied
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
 * Get or create storage location record
 */
export async function ensureStorageLocation(
  societyId: string,
  slotInfo: StorageSlotInfo
): Promise<StorageLocation> {
  const zone = slotInfo.zone || 'Hub Alpha';
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
 * Parcel Intake:
 * Registers a new parcel at the society delivery hub, validates/assigns the storage slot,
 * updates occupancy, and records audit trail.
 */
export async function intakeParcel(
  params: ParcelIntakeParams
): Promise<{ success: boolean; parcel?: EnrichedParcel; error?: string }> {
  try {
    const {
      carrierName,
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

    if (!societyId || !apartmentId || !carrierName) {
      return { success: false, error: 'Society, apartment, and carrier name are required.' };
    }

    // 1. Resolve tracking number
    const trackingNumber =
      params.trackingNumber?.trim() ||
      `PF-${Math.floor(1000 + Math.random() * 9000)}-IN`;

    // 2. Check for duplicate active tracking
    const { data: existingParcel } = await supabase
      .from('parcels')
      .select('id, tracking_number, status')
      .eq('tracking_number', trackingNumber)
      .maybeSingle();

    if (existingParcel && !['COMPLETED', 'HANDED_OVER', 'CANCELLED'].includes(existingParcel.status)) {
      return { success: false, error: `Parcel with tracking ID ${trackingNumber} is already active in hub.` };
    }

    // 3. Resolve storage slot & check occupancy
    const slotInfo =
      typeof storageSlot === 'string'
        ? parseStorageSlotString(storageSlot)
        : storageSlot;

    const occupancy = await checkSlotOccupancy(societyId, slotInfo.rack, slotInfo.shelf);
    if (occupancy.isOccupied) {
      return {
        success: false,
        error: `Storage slot (${slotInfo.rack} / ${slotInfo.shelf}) is currently occupied by package ${occupancy.parcelId}. Please select an empty slot.`,
      };
    }

    const storageLocation = await ensureStorageLocation(societyId, slotInfo);

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
          resident_id: residentId || null,
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

    if (insertError) {
      console.warn('Failed to insert parcel:', insertError.message);
      return { success: false, error: insertError.message };
    }

    // 5. Mark storage slot occupied
    await supabase
      .from('storage_locations')
      .update({
        is_occupied: true,
        current_parcel_id: insertedParcel.id,
        updated_at: now,
      })
      .eq('id', storageLocation.id);

    // 6. Log parcel timeline event
    await addParcelTimelineEvent(insertedParcel.id, {
      toStatus: 'STORED',
      fromStatus: 'CREATED',
      description: `Received at hub by staff and placed into storage ${storageLocation.rack} / ${storageLocation.shelf}.`,
      actorId: staffId,
      actorRole: 'STAFF',
    });

    // 7. Log audit log
    await supabase.from('audit_logs').insert([
      {
        society_id: societyId,
        user_id: staffId,
        action: 'PARCEL_SCAN_IN',
        entity_type: 'parcels',
        entity_id: insertedParcel.id,
        payload: {
          tracking_number: trackingNumber,
          carrier: carrierName,
          storage_slot: `${storageLocation.rack} - ${storageLocation.shelf}`,
        },
        created_at: now,
      },
    ]);

    return {
      success: true,
      parcel: insertedParcel as EnrichedParcel,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to process parcel intake' };
  }
}

/**
 * Release an occupied storage slot when parcel is handed over or moved
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
 * Handover Verification (QR scan or OTP entry)
 * - Verifies token via OTP or QR
 * - Updates parcel status to HANDED_OVER
 * - Releases the storage slot
 * - Records audit trail in audit_logs
 */
export async function verifyHandover(
  params: HandoverVerificationParams
): Promise<{ success: boolean; parcel?: EnrichedParcel; message?: string; error?: string }> {
  try {
    const { parcelId, otpCode, qrCode, staffId, notes } = params;

    if (!qrCode && (!parcelId || !otpCode)) {
      return {
        success: false,
        error: 'Provide either optical QR scan data or both Parcel ID and OTP code.',
      };
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

    // 3. Update parcel status to HANDED_OVER and COMPLETED
    const { data: updatedParcel, error: parcelError } = await supabase
      .from('parcels')
      .update({
        status: 'HANDED_OVER',
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

    // 4. Release storage location rack slot
    if (currentParcel.storage_location_id) {
      await releaseStorageSlot(currentParcel.storage_location_id);
    }

    // 5. Log parcel timeline event
    await addParcelTimelineEvent(targetParcelId, {
      toStatus: 'HANDED_OVER',
      fromStatus: currentParcel.status,
      description: notes || 'Package successfully verified and handed over to resident.',
      actorId: staffId,
      actorRole: 'STAFF',
    });

    // 6. Record in audit_logs
    await supabase.from('audit_logs').insert([
      {
        society_id: currentParcel.society_id,
        user_id: staffId || null,
        action: 'HANDOVER_DISPATCHED',
        entity_type: 'parcels',
        entity_id: targetParcelId,
        payload: {
          tracking_number: currentParcel.tracking_number,
          verification_method: qrCode ? 'QR_SCAN' : 'OTP_CODE',
          token_code: verificationResult.tokenCode,
          storage_location_released: currentParcel.storage_location_id,
          notes,
        },
        created_at: now,
      },
    ]);

    return {
      success: true,
      parcel: (updatedParcel as EnrichedParcel) || currentParcel,
      message: `Package ${currentParcel.tracking_number} verified and handed over. Storage slot released.`,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Handover verification failed' };
  }
}

export const staffService = {
  checkSlotOccupancy,
  ensureStorageLocation,
  intakeParcel,
  releaseStorageSlot,
  verifyHandover,
  parseStorageSlotString,
};
