// ============================================================================
// PARCELFLOW PICKUP AUTHORIZATION SERVICE (src/services/pickupAuthorizationService.ts)
// Delegate & Family pickup permits: creation, security validation at handover,
// revocation, active/expired listing, and tamper-evident audit logging.
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { PickupAuthorization, AuthorizationStatus } from './types.ts';
import { logAuditEvent } from './auditService.ts';

const LOCAL_STORAGE_KEY = 'parcelflow_pickup_authorizations';

let memoryAuthorizations: PickupAuthorization[] = [];

/**
 * Helper to fetch authorizations stored locally in fallback mode
 */
function getLocalAuthorizations(): PickupAuthorization[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    // fallback to memory
  }
  return memoryAuthorizations;
}

function saveLocalAuthorizations(list: PickupAuthorization[]): void {
  memoryAuthorizations = list;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
}

/**
 * Generate 6-digit numeric OTP for security verification
 */
function generateAuthorizationOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create a new family / delegate pickup authorization
 */
export async function createPickupAuthorization(params: {
  resident_id: string;
  society_id: string;
  authorized_name: string;
  relationship: string;
  authorized_phone?: string;
  allowed_parcel_ids: string[];
  valid_until: string; // ISO String
  notes?: string;
}): Promise<{ success: boolean; authorization?: PickupAuthorization; message: string }> {
  try {
    const otp = generateAuthorizationOtp();
    const payload = {
      resident_id: params.resident_id,
      society_id: params.society_id,
      authorized_name: params.authorized_name.trim(),
      relationship: params.relationship.trim(),
      authorized_phone: params.authorized_phone?.trim() || null,
      allowed_parcel_ids: params.allowed_parcel_ids,
      valid_until: params.valid_until,
      is_active: true,
      status: 'ACTIVE' as AuthorizationStatus,
      otp_code: otp,
      notes: params.notes?.trim() || null,
    };

    let createdAuth: PickupAuthorization | null = null;

    const { data, error } = await supabase
      .from('pickup_authorizations')
      .insert(payload)
      .select()
      .maybeSingle();

    if (!error && data) {
      createdAuth = data as PickupAuthorization;
    } else {
      console.warn('Pickup authorization fallback creation:', error?.message);
      // Fallback for resilient offline/local simulation
      createdAuth = {
        id: `auth-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const locals = getLocalAuthorizations();
      locals.unshift(createdAuth);
      saveLocalAuthorizations(locals);
    }

    // Tamper-evident audit log
    await logAuditEvent({
      societyId: params.society_id,
      action: 'PICKUP_BOOKED',
      entityType: 'pickup_bookings',
      entityId: createdAuth.id,
      payload: {
        authorized_name: params.authorized_name,
        relationship: params.relationship,
        valid_until: params.valid_until,
        parcel_count: params.allowed_parcel_ids.length,
      },
    });

    return {
      success: true,
      authorization: createdAuth,
      message: `Pickup authorization granted for ${params.authorized_name}`,
    };
  } catch (err: any) {
    console.error('Failed to create pickup authorization:', err);
    return {
      success: false,
      message: err.message || 'Could not create pickup authorization',
    };
  }
}

/**
 * Fetch all authorizations created by a resident
 */
export async function getResidentAuthorizations(residentId: string): Promise<PickupAuthorization[]> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('pickup_authorizations')
      .select('*')
      .eq('resident_id', residentId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Check expiration status in-memory
      return data.map(item => {
        if (item.status === 'ACTIVE' && item.valid_until < now) {
          return { ...item, status: 'EXPIRED' as AuthorizationStatus, is_active: false };
        }
        return item;
      });
    }

    // Local fallback
    const locals = getLocalAuthorizations().filter(a => a.resident_id === residentId);
    return locals.map(item => {
      if (item.status === 'ACTIVE' && item.valid_until < now) {
        return { ...item, status: 'EXPIRED' as AuthorizationStatus, is_active: false };
      }
      return item;
    });
  } catch (err) {
    console.warn('getResidentAuthorizations error:', err);
    return [];
  }
}

/**
 * Revoke an active pickup authorization
 */
export async function revokePickupAuthorization(
  authorizationId: string,
  residentId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('pickup_authorizations')
      .update({
        is_active: false,
        status: 'REVOKED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', authorizationId);

    if (error) {
      console.warn('Revoke authorization DB note:', error.message);
    }

    // Update local storage
    const locals = getLocalAuthorizations();
    const updated = locals.map(item =>
      item.id === authorizationId ? { ...item, is_active: false, status: 'REVOKED' as AuthorizationStatus } : item
    );
    saveLocalAuthorizations(updated);

    return { success: true, message: 'Pickup authorization successfully revoked' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to revoke authorization' };
  }
}

/**
 * Validate authorization at Security handover desk
 * Validates that OTP or code is active, not expired, and covers the parcel
 */
export async function validateAuthorizationAtHandover(params: {
  otpOrCode: string;
  parcelId: string;
  staffId?: string;
}): Promise<{
  valid: boolean;
  authorization?: PickupAuthorization;
  message: string;
}> {
  const code = params.otpOrCode.trim();
  const now = new Date().toISOString();

  try {
    // 1. Search database
    const { data, error } = await supabase
      .from('pickup_authorizations')
      .select('*')
      .or(`otp_code.eq.${code},id.eq.${code}`)
      .eq('is_active', true)
      .maybeSingle();

    let record: PickupAuthorization | null = data as PickupAuthorization | null;

    if (!record) {
      // Check local storage fallback
      const locals = getLocalAuthorizations();
      record = locals.find(a => (a.otp_code === code || a.id === code) && a.is_active) || null;
    }

    if (!record) {
      return {
        valid: false,
        message: 'Invalid or revoked authorization code.',
      };
    }

    if (record.status !== 'ACTIVE' || record.valid_until < now) {
      return {
        valid: false,
        authorization: record,
        message: 'This authorization has expired or is no longer active.',
      };
    }

    if (record.allowed_parcel_ids.length > 0 && !record.allowed_parcel_ids.includes(params.parcelId)) {
      return {
        valid: false,
        authorization: record,
        message: `This authorization is not valid for parcel #${params.parcelId.substring(0, 8)}.`,
      };
    }

    // Mark authorization as used
    await supabase
      .from('pickup_authorizations')
      .update({
        status: 'USED',
        is_active: false,
        used_at: now,
        used_by_staff_id: params.staffId || null,
        updated_at: now,
      })
      .eq('id', record.id);

    return {
      valid: true,
      authorization: record,
      message: `Authorized for ${record.authorized_name} (${record.relationship})`,
    };
  } catch (err: any) {
    return {
      valid: false,
      message: err.message || 'Authorization verification failed',
    };
  }
}
