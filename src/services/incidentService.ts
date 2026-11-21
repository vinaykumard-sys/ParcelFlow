// ============================================================================
// PARCELFLOW INCIDENT SERVICE (src/services/incidentService.ts)
// Damage evidence & incident management: photo reporting, status tracking,
// admin resolution board, and tamper-evident logging.
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { ParcelIncident, IncidentIssueType, IncidentStatus } from './types.ts';
import { logAuditEvent } from './auditService.ts';

const LOCAL_STORAGE_KEY = 'parcelflow_incidents';

let memoryIncidents: ParcelIncident[] = [];

function getLocalIncidents(): ParcelIncident[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return memoryIncidents;
}

function saveLocalIncidents(list: ParcelIncident[]): void {
  memoryIncidents = list;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
}

/**
 * Report a new incident (Damaged parcel, Wrong parcel, Missing parcel, etc.)
 * Supports multiple photo evidence attachments (base64 data URLs or storage URLs)
 */
export async function reportIncident(params: {
  societyId: string;
  parcelId?: string | null;
  reporterId?: string | null;
  reporterName?: string | null;
  reporterRole?: string;
  issueType: IncidentIssueType;
  description: string;
  photos: string[];
}): Promise<{ success: boolean; incident?: ParcelIncident; message: string }> {
  try {
    const payload = {
      society_id: params.societyId,
      parcel_id: params.parcelId || null,
      reporter_id: params.reporterId || null,
      reporter_name: params.reporterName || 'Security Staff',
      reporter_role: params.reporterRole || 'STAFF',
      issue_type: params.issueType,
      description: params.description.trim(),
      photos: params.photos || [],
      status: 'OPEN' as IncidentStatus,
      resolution_notes: null,
      resolved_at: null,
      resolved_by: null,
    };

    let incidentRecord: ParcelIncident | null = null;

    const { data, error } = await supabase
      .from('parcel_incidents')
      .insert(payload)
      .select()
      .maybeSingle();

    if (!error && data) {
      incidentRecord = data as ParcelIncident;
    } else {
      console.warn('Incident DB insert fallback:', error?.message);
      incidentRecord = {
        id: `inc-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const locals = getLocalIncidents();
      locals.unshift(incidentRecord);
      saveLocalIncidents(locals);
    }

    // Tamper-evident audit trail
    await logAuditEvent({
      societyId: params.societyId,
      action: 'SETTINGS_UPDATED',
      entityType: 'parcels',
      entityId: params.parcelId || incidentRecord.id,
      payload: {
        incident_id: incidentRecord.id,
        issue_type: params.issueType,
        photos_count: params.photos.length,
      },
    });

    return {
      success: true,
      incident: incidentRecord,
      message: 'Incident reported successfully with photo evidence',
    };
  } catch (err: any) {
    console.error('Failed to report incident:', err);
    return {
      success: false,
      message: err.message || 'Failed to submit incident report',
    };
  }
}

/**
 * Fetch all incidents, optionally filtered by society or parcel
 */
export async function getIncidents(societyId?: string, parcelId?: string): Promise<ParcelIncident[]> {
  try {
    let query = supabase
      .from('parcel_incidents')
      .select('*, parcel:parcel_id (*)')
      .order('created_at', { ascending: false });

    if (societyId) {
      query = query.eq('society_id', societyId);
    }
    if (parcelId) {
      query = query.eq('parcel_id', parcelId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as ParcelIncident[];
    }

    // Local fallback
    const locals = getLocalIncidents();
    return locals.filter(item => {
      if (societyId && item.society_id !== societyId) return false;
      if (parcelId && item.parcel_id !== parcelId) return false;
      return true;
    });
  } catch (err) {
    console.warn('getIncidents query note:', err);
    return getLocalIncidents();
  }
}

/**
 * Update incident status (e.g. UNDER_REVIEW, RESOLVED, DISMISSED) with resolution notes
 */
export async function updateIncidentStatus(
  incidentId: string,
  status: IncidentStatus,
  resolutionNotes?: string,
  resolverId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const isResolved = status === 'RESOLVED' || status === 'DISMISSED';
    const now = new Date().toISOString();

    const updatePayload: Record<string, any> = {
      status,
      resolution_notes: resolutionNotes || null,
      updated_at: now,
    };

    if (isResolved) {
      updatePayload.resolved_at = now;
      updatePayload.resolved_by = resolverId || null;
    }

    const { error } = await supabase
      .from('parcel_incidents')
      .update(updatePayload)
      .eq('id', incidentId);

    if (error) {
      console.warn('Incident update DB note:', error.message);
    }

    // Local storage sync
    const locals = getLocalIncidents();
    const updated = locals.map(i => (i.id === incidentId ? { ...i, ...updatePayload } : i));
    saveLocalIncidents(updated);

    return {
      success: true,
      message: `Incident marked as ${status}`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to update incident status',
    };
  }
}
