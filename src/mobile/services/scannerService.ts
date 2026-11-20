// ============================================================================
// PARCELFLOW SCANNER SERVICE (src/mobile/services/scannerService.ts)
// Real device camera barcode & QR scanner backend validation, carrier detection,
// duplicate scan prevention against Supabase, and sound/haptic feedback
// ============================================================================

import { supabase, FALLBACK_PARCELS } from '../../services/supabaseClient';
import { useMobileStore } from './mobileState';

export type CourierCarrier = 'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  parcel?: {
    id: string;
    trackingNumber: string;
    carrierName: string;
    status: string;
    storageLocation: string;
    recipientName?: string;
    apartment?: string;
    receivedAt?: string;
  };
  message?: string;
}

export interface ParsedQrResult {
  raw: string;
  otp?: string;
  trackingNumber?: string;
  type: 'otp' | 'tracking' | 'json' | 'unknown';
}

/**
 * Sound feedback synthesizer via Web Audio API
 */
export function playScanChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Two-tone rising confirmation beep
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.setValueAtTime(1760, now + 0.08); // A6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    // AudioContext blocked or not supported
  }
}

/**
 * Warning buzzer tone on duplicate scan or error
 */
export function playErrorTone() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // Low buzz

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // AudioContext blocked
  }
}

/**
 * Tactile vibration feedback
 */
export function triggerScanHaptic() {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([60, 40, 60]);
    }
  } catch {
    // ignore
  }
}

export function triggerErrorHaptic() {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 80, 150]);
    }
  } catch {
    // ignore
  }
}

/**
 * Detects courier carrier from barcode format or tracking ID prefix
 */
export function detectCarrier(trackingNumber: string): CourierCarrier {
  const clean = trackingNumber.trim().toUpperCase();

  // Amazon: TBA..., AMZ..., 100..., 940..., or contains AMAZON
  if (clean.startsWith('TBA') || clean.startsWith('AMZ') || clean.startsWith('100') || clean.includes('AMAZON')) {
    return 'Amazon';
  }

  // Flipkart: FMPC..., FK..., OD..., MP0...
  if (clean.startsWith('FMPC') || clean.startsWith('FK') || clean.startsWith('OD') || clean.startsWith('MP0')) {
    return 'Flipkart';
  }

  // Myntra: MYN..., MY..., 137...
  if (clean.startsWith('MYN') || clean.startsWith('MY') || clean.startsWith('137')) {
    return 'Myntra';
  }

  // Blue Dart: BD..., WBN..., or 8-11 digits starting with 7
  if (clean.startsWith('BD') || clean.startsWith('WBN') || (/^7\d{7,10}$/.test(clean))) {
    return 'Blue Dart';
  }

  // Delhivery: DEL..., DL..., or 12-14 digits starting with 1, 2, or 3
  if (clean.startsWith('DEL') || clean.startsWith('DL') || (/^[123]\d{11,13}$/.test(clean))) {
    return 'Delhivery';
  }

  return 'Other';
}

/**
 * Parses resident QR code payload (handles JSON, prefixed tokens, or plain OTPs)
 */
export function parseQrPayload(qrText: string): ParsedQrResult {
  const raw = (qrText || '').trim();

  // Check if JSON
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const parsed = JSON.parse(raw);
      const otp = parsed.otp || parsed.code || parsed.handoverOtp || parsed.passCode;
      const tracking = parsed.trackingNumber || parsed.tracking || parsed.parcelId;
      return {
        raw,
        otp: otp ? String(otp).trim() : undefined,
        trackingNumber: tracking ? String(tracking).trim() : undefined,
        type: 'json',
      };
    } catch {
      // Not valid JSON, continue
    }
  }

  // Check if prefixed, e.g. PARCELFLOW:OTP:742916 or PF-VERIFY:742916
  const prefixMatch = raw.match(/^(?:PARCELFLOW|PF-VERIFY|OTP)[:\-_]([A-Za-z0-9\-_]+)$/i);
  if (prefixMatch) {
    const code = prefixMatch[1].trim();
    if (/^\d{4,8}$/.test(code)) {
      return { raw, otp: code, type: 'otp' };
    }
    return { raw, trackingNumber: code, type: 'tracking' };
  }

  // Check if plain 4 to 8 digit OTP
  if (/^\d{4,8}$/.test(raw)) {
    return { raw, otp: raw, type: 'otp' };
  }

  // Otherwise assume it's a tracking number / alphanumeric code
  return {
    raw,
    trackingNumber: raw,
    type: 'tracking',
  };
}

/**
 * Duplicate scan protection:
 * Queries Supabase database and local store.
 * If parcel already registered, halts creation and returns current location & status.
 */
export async function checkDuplicateParcel(
  trackingNumber: string,
  societyId?: string
): Promise<DuplicateCheckResult> {
  const cleanTracking = trackingNumber.trim();
  if (!cleanTracking) {
    return { isDuplicate: false };
  }

  try {
    // 1. Check live Supabase database
    let query = supabase
      .from('parcels')
      .select(`
        id,
        tracking_number,
        courier_tracking_id,
        carrier_name,
        status,
        created_at,
        storage_locations (
          zone,
          rack,
          shelf
        ),
        apartments (
          tower,
          unit_number
        ),
        residents:resident_id (
          full_name,
          phone
        )
      `)
      .or(`tracking_number.ilike.${cleanTracking},courier_tracking_id.ilike.${cleanTracking}`);

    if (societyId) {
      query = query.eq('society_id', societyId);
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) {
      const storageLoc = data.storage_locations
        ? `${data.storage_locations.rack || 'Rack'}, ${data.storage_locations.shelf || 'Shelf'} (${data.storage_locations.zone || 'Hub'})`
        : 'Hub Intake Staging';

      const residentInfo = data.residents ? (data.residents as any).full_name : undefined;
      const aptInfo = data.apartments
        ? `${data.apartments.tower || ''} - ${data.apartments.unit_number || ''}`.trim()
        : undefined;

      return {
        isDuplicate: true,
        parcel: {
          id: data.id,
          trackingNumber: data.tracking_number,
          carrierName: data.carrier_name || 'Courier',
          status: data.status || 'RECEIVED',
          storageLocation: storageLoc,
          recipientName: residentInfo,
          apartment: aptInfo,
          receivedAt: data.created_at,
        },
        message: `Parcel already registered! Currently in "${storageLoc}" with status "${data.status}".`,
      };
    }
  } catch (err) {
    console.warn('Supabase duplicate check query note:', err);
  }

  // 2. Check local MobileStore parcels cache
  try {
    const localParcels = useMobileStore.getState().parcels;
    const match = localParcels.find(
      (p) =>
        p.trackingNumber.toUpperCase() === cleanTracking.toUpperCase() ||
        (p.id && p.id.toUpperCase() === cleanTracking.toUpperCase())
    );

    if (match) {
      return {
        isDuplicate: true,
        parcel: {
          id: match.id,
          trackingNumber: match.trackingNumber,
          carrierName: match.carrier,
          status: match.status,
          storageLocation: match.storageLocation,
          recipientName: match.recipientName,
          apartment: `${match.tower} - ${match.flat}`,
          receivedAt: match.receivedAt,
        },
        message: `Parcel already registered! Currently in "${match.storageLocation}" with status "${match.status}".`,
      };
    }
  } catch {
    // ignore
  }

  // 3. Check fallback parcels
  try {
    const fallbackMatch = FALLBACK_PARCELS.find(
      (p) =>
        p.tracking_number.toUpperCase() === cleanTracking.toUpperCase() ||
        p.courier_tracking_id?.toUpperCase() === cleanTracking.toUpperCase()
    );

    if (fallbackMatch) {
      return {
        isDuplicate: true,
        parcel: {
          id: fallbackMatch.id,
          trackingNumber: fallbackMatch.tracking_number,
          carrierName: fallbackMatch.carrier_name,
          status: fallbackMatch.status,
          storageLocation: fallbackMatch.storage_location || 'Rack A - 01',
          recipientName: fallbackMatch.resident_name,
          apartment: fallbackMatch.apartment_unit,
          receivedAt: fallbackMatch.created_at,
        },
        message: `Parcel already registered! Currently in "${fallbackMatch.storage_location || 'Rack A - 01'}" with status "${fallbackMatch.status}".`,
      };
    }
  } catch {
    // ignore
  }

  return { isDuplicate: false };
}
