// ============================================================================
// PARCELFLOW SUPABASE CLIENT (src/services/supabaseClient.ts)
// Core Supabase client instance with session persistence and credentials
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Society, EnrichedParcel } from './types.ts';

export const SUPABASE_URL: string =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://czhxktgdrhdflmfmvggx.supabase.co';

export const SUPABASE_ANON_KEY: string =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ============================================================================
// FALLBACK SEED DATA FOR DEMO & RESILIENCE
// ============================================================================

export const FALLBACK_SOCIETIES: Society[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Lakeview Residency',
    code: 'LVR-BLR',
    address: 'Outer Ring Road, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560103',
    total_towers: 3,
    total_flats: 450,
    hub_phone: '+91 80 4120 7801',
    hub_operating_hours: '06:30 AM - 11:30 PM',
    settings: { allow_courier_direct_gate: true, auto_notify_whatsapp: true, require_otp_handover: true },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Greenview Heights',
    code: 'GVH-BLR',
    address: '24th Main, Sector 1, HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560102',
    total_towers: 3,
    total_flats: 380,
    hub_phone: '+91 80 4120 7802',
    hub_operating_hours: '07:00 AM - 11:00 PM',
    settings: { allow_courier_direct_gate: true, auto_notify_whatsapp: true, require_otp_handover: true },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    name: 'Skyline Apartments',
    code: 'SKA-BLR',
    address: 'Sarjapur Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560035',
    total_towers: 4,
    total_flats: 520,
    hub_phone: '+91 80 4120 7803',
    hub_operating_hours: '07:00 AM - 10:30 PM',
    settings: { allow_courier_direct_gate: false, auto_notify_whatsapp: true, require_otp_handover: true },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    name: 'Maple Residency',
    code: 'MPR-BLR',
    address: 'Whitefield Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560066',
    total_towers: 2,
    total_flats: 240,
    hub_phone: '+91 80 4120 7804',
    hub_operating_hours: '07:30 AM - 10:00 PM',
    settings: { allow_courier_direct_gate: true, auto_notify_whatsapp: true, require_otp_handover: true },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const FALLBACK_PARCELS: EnrichedParcel[] = [];
