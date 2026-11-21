import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTables() {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });
  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }
  console.log('Authenticated as:', auth.user.email, 'Role:', auth.user.role);

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
    'notifications',
    'audit_logs'
  ];

  for (const t of tables) {
    const { data, count, error } = await supabase.from(t).select('*', { count: 'exact' });
    if (error) {
      console.log(`Table [${t}]: ERROR ->`, error.message);
    } else {
      console.log(`Table [${t}]: ${data?.length} rows (count: ${count})`);
      if (data?.length > 0) {
        console.log(`   Sample:`, JSON.stringify(data[0]).slice(0, 120));
      }
    }
  }
}

inspectTables();
