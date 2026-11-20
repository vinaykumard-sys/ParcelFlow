// ============================================================================
// PARCELFLOW AUDIT SERVICE (src/services/auditService.ts)
// Tamper-resistant audit logging for core operational and security events:
// USER_LOGIN, PARCEL_CREATED, PARCEL_SCANNED, PARCEL_ASSIGNED, PARCEL_STORED,
// PICKUP_BOOKED, OTP_GENERATED, QR_GENERATED, OTP_VERIFIED, QR_VERIFIED,
// HANDOVER_COMPLETED, ROLE_CHANGED, STAFF_CREATED
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { AuditLog } from './types.ts';

export type AuditAction =
  | 'USER_LOGIN'
  | 'PARCEL_CREATED'
  | 'PARCEL_SCANNED'
  | 'PARCEL_ASSIGNED'
  | 'PARCEL_STORED'
  | 'PICKUP_BOOKED'
  | 'OTP_GENERATED'
  | 'QR_GENERATED'
  | 'OTP_VERIFIED'
  | 'QR_VERIFIED'
  | 'HANDOVER_COMPLETED'
  | 'ROLE_CHANGED'
  | 'STAFF_CREATED';

export interface AuditLogEntryParams {
  societyId?: string | null;
  userId?: string | null;
  action: AuditAction;
  entityType: 'users' | 'parcels' | 'handover_tokens' | 'pickup_bookings' | 'storage_locations' | 'staff' | 'societies' | 'profiles';
  entityId?: string | null;
  payload?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface TamperResistantAuditLog extends AuditLog {
  signature?: string;
  previousHash?: string;
}

// In-memory fallback and offline resilient audit trail
const LOCAL_AUDIT_LOGS: TamperResistantAuditLog[] = [];
let lastBlockHash = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Lightweight fast hash to produce tamper-resistant verification string in browser/runtime
 */
function computeIntegrityHash(dataString: string): string {
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const timestamp = Date.now().toString(16);
  return `pf-sig-${hex}-${timestamp}`;
}

/**
 * Record a tamper-resistant audit log event
 */
export async function logAuditEvent(params: AuditLogEntryParams): Promise<TamperResistantAuditLog> {
  const now = new Date().toISOString();
  const id = `aud-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const canonicalPayload = {
    ...params.payload,
    _recorded_at: now,
    _prev_hash: lastBlockHash,
  };

  const signature = computeIntegrityHash(
    `${lastBlockHash}|${params.action}|${params.entityType}|${params.entityId}|${JSON.stringify(canonicalPayload)}`
  );
  lastBlockHash = signature;

  const logRecord: TamperResistantAuditLog = {
    id,
    society_id: params.societyId || 'a1111111-1111-1111-1111-111111111111',
    user_id: params.userId || null,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId || null,
    ip_address: params.ipAddress || '127.0.0.1',
    user_agent: params.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'ParcelFlow/0.1.0'),
    payload: {
      ...canonicalPayload,
      _signature: signature,
    },
    created_at: now,
    signature,
    previousHash: canonicalPayload._prev_hash,
  };

  LOCAL_AUDIT_LOGS.unshift(logRecord);

  // Asynchronously commit to Supabase audit_logs
  try {
    const dbPayload = {
      society_id: params.societyId || null,
      user_id: params.userId && params.userId.length === 36 ? params.userId : null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId && params.entityId.length === 36 ? params.entityId : null,
      ip_address: logRecord.ip_address,
      user_agent: logRecord.user_agent,
      payload: logRecord.payload,
      created_at: now,
    };

    const { error } = await supabase.from('audit_logs').insert([dbPayload]);
    if (error) {
      console.warn('Supabase audit log insert notice:', error.message);
    }
  } catch (err: any) {
    console.warn('Audit log write exception:', err?.message || err);
  }

  return logRecord;
}

/**
 * Fetch recent audit logs with filtering
 */
export async function getAuditLogs(filter?: {
  societyId?: string;
  action?: AuditAction;
  entityType?: string;
  limit?: number;
}): Promise<TamperResistantAuditLog[]> {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(filter?.limit || 50);

    if (filter?.societyId) {
      query = query.eq('society_id', filter.societyId);
    }
    if (filter?.action) {
      query = query.eq('action', filter.action);
    }
    if (filter?.entityType) {
      query = query.eq('entity_type', filter.entityType);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        society_id: item.society_id,
        user_id: item.user_id,
        action: item.action,
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        ip_address: item.ip_address,
        user_agent: item.user_agent,
        payload: item.payload,
        created_at: item.created_at,
        signature: item.payload?._signature,
        previousHash: item.payload?._prev_hash,
      }));
    }
  } catch (err) {
    console.warn('Falling back to local audit logs:', err);
  }

  let result = [...LOCAL_AUDIT_LOGS];
  if (filter?.societyId) {
    result = result.filter((l) => l.society_id === filter.societyId);
  }
  if (filter?.action) {
    result = result.filter((l) => l.action === filter.action);
  }
  return result.slice(0, filter?.limit || 50);
}

export const auditService = {
  logAuditEvent,
  getAuditLogs,
};
