import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectMore() {
  await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });

  const tables = [
    'parcels',
    'parcel_events',
    'pickup_slots',
    'pickup_bookings',
    'handover_tokens',
    'storage_locations',
    'apartments',
    'towers',
    'audit_logs'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.log(`Table ${table} error:`, error.message);
    } else {
      console.log(`Table ${table} count: ${data.length}`);
      if (data.length > 0) {
        console.log(`  Sample 1 from ${table}:`, JSON.stringify(data[0], null, 2));
      }
    }
  }
}

inspectMore();
