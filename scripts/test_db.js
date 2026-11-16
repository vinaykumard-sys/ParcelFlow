import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://czhxktgdrhdflmfmvggx.supabase.co',
  'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K'
);

async function run() {
  const tables = [
    'societies',
    'apartments',
    'users',
    'profiles',
    'residents',
    'staff',
    'storage_locations',
    'parcels',
    'parcel_events',
    'pickup_slots',
    'pickup_bookings',
    'handover_tokens',
    'issues',
    'audit_logs',
    'notifications'
  ];

  console.log('--- SUPABASE TABLE STATUS CHECK ---');
  for (const t of tables) {
    try {
      const { data, error } = await sb.from(t).select('*').limit(3);
      if (error) {
        console.log(`[FAIL] ${t.padEnd(20)}: ${error.code} - ${error.message}`);
      } else {
        console.log(`[PASS] ${t.padEnd(20)}: OK (${data.length} rows returned)`);
      }
    } catch (e) {
      console.log(`[ERR ] ${t.padEnd(20)}: ${e.message}`);
    }
  }
}

run();
