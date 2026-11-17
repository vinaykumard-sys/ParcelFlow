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

export const FALLBACK_PARCELS: EnrichedParcel[] = [
  {
    id: '71111111-1111-1111-1111-111111111111',
    tracking_number: 'PF-8921-IN',
    carrier_name: 'Amazon',
    courier_tracking_id: 'AMZN-IN-88912903',
    courier_phone: '+91 91234 56789',
    courier_rider_name: 'Mohan Lal',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    apartment_id: 'f1010001-0000-0000-0000-000000000001',
    resident_id: 'e1111111-1111-1111-1111-111111111111',
    storage_location_id: '10000002-0000-0000-0000-000000000008',
    status: 'SCHEDULED',
    description: 'Wireless Bluetooth Noise-Cancelling Headphones',
    category: 'ELECTRONICS',
    weight_kg: 0.9,
    dimensions: { length: 22, width: 16, height: 9 },
    is_fragile: true,
    is_perishable: false,
    received_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    received_by_staff_id: 'c1111111-1111-1111-1111-111111111111',
    handover_at: null,
    handed_over_by_staff_id: null,
    photo_url: null,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    resident: {
      id: 'e1111111-1111-1111-1111-111111111111',
      user_id: 'd1111111-1111-1111-1111-111111111111',
      society_id: 'a1111111-1111-1111-1111-111111111111',
      apartment_id: 'f1010001-0000-0000-0000-000000000001',
      is_primary: true,
      emergency_contact: '+91 98860 99991',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'd1111111-1111-1111-1111-111111111111',
        auth_user_id: null,
        email: 'arjun.kumar@gmail.com',
        phone: '+91 98860 12345',
        full_name: 'Arjun Kumar',
        role: 'RESIDENT',
        avatar_url: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      apartment: {
        id: 'f1010001-0000-0000-0000-000000000001',
        society_id: 'a1111111-1111-1111-1111-111111111111',
        tower: 'Tower A',
        floor: 4,
        unit_number: 'A-402',
        intercom_number: '1402',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
    apartment: {
      id: 'f1010001-0000-0000-0000-000000000001',
      society_id: 'a1111111-1111-1111-1111-111111111111',
      tower: 'Tower A',
      floor: 4,
      unit_number: 'A-402',
      intercom_number: '1402',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    storage_location: {
      id: '10000002-0000-0000-0000-000000000008',
      society_id: 'a1111111-1111-1111-1111-111111111111',
      zone: 'Hub Alpha',
      rack: 'Rack A',
      shelf: 'Shelf A-08',
      compartment_type: 'MEDIUM',
      is_occupied: true,
      current_parcel_id: '71111111-1111-1111-1111-111111111111',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: '72222222-2222-2222-2222-222222222222',
    tracking_number: 'PF-8922-IN',
    carrier_name: 'Blue Dart',
    courier_tracking_id: 'BLUD-99120019',
    courier_phone: '+91 92345 67890',
    courier_rider_name: 'Sunil Kumar',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    apartment_id: 'f1010002-0000-0000-0000-000000000002',
    resident_id: 'e2222222-2222-2222-2222-222222222222',
    storage_location_id: '10000001-0000-0000-0000-000000000002',
    status: 'READY_FOR_PICKUP',
    description: 'Designer Leather Jacket & Apparel',
    category: 'CLOTHING',
    weight_kg: 1.4,
    dimensions: { length: 35, width: 25, height: 8 },
    is_fragile: false,
    is_perishable: false,
    received_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    received_by_staff_id: 'c1111111-1111-1111-1111-111111111111',
    handover_at: null,
    handed_over_by_staff_id: null,
    photo_url: null,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];
