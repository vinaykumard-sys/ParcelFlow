import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });

  const res1 = await supabase
    .from('parcels')
    .select('id, tracking_number, storage_locations(rack, shelf)')
    .limit(1);
  console.log('Query without !storage_location_id:', res1.error?.message);

  const res2 = await supabase
    .from('parcels')
    .select('id, tracking_number, storage_locations!storage_location_id(rack, shelf)')
    .limit(1);
  console.log('Query with !storage_location_id:', res2.error?.message, res2.data);
}

testQuery();
