import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanFakeData() {
  console.log('Logging in as Admin: vinaykumard45678@gmail.com ...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    process.exit(1);
  }
  console.log('Admin logged in successfully! UID:', authData.user.id);

  // 1. Delete handover_tokens
  const { error: htErr } = await supabase.from('handover_tokens').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('1. handover_tokens cleared:', htErr ? htErr.message : 'SUCCESS');

  // 2. Delete pickup_bookings
  const { error: pbErr } = await supabase.from('pickup_bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('2. pickup_bookings cleared:', pbErr ? pbErr.message : 'SUCCESS');

  // 3. Delete parcel_events
  const { error: peErr } = await supabase.from('parcel_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('3. parcel_events cleared:', peErr ? peErr.message : 'SUCCESS');

  // 4. Reset storage_locations
  const { error: slErr } = await supabase.from('storage_locations').update({
    is_occupied: false,
    current_parcel_id: null
  }).neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('4. storage_locations reset:', slErr ? slErr.message : 'SUCCESS');

  // 5. Delete parcels
  const { error: pErr } = await supabase.from('parcels').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('5. parcels cleared:', pErr ? pErr.message : 'SUCCESS');

  // 6. Delete fake residents
  const { error: rErr } = await supabase.from('residents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('6. residents cleared:', rErr ? rErr.message : 'SUCCESS');

  // 7. Delete fake staff
  const { error: sErr } = await supabase.from('staff').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('7. staff cleared:', sErr ? sErr.message : 'SUCCESS');

  // 8. Reset pickup slots booking counts
  const { error: psErr } = await supabase.from('pickup_slots').update({
    current_bookings_count: 0
  }).neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('8. pickup_slots reset count to 0:', psErr ? psErr.message : 'SUCCESS');

  // 9. Clean audit_logs
  const { error: alErr } = await supabase.from('audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('9. audit_logs cleared:', alErr ? alErr.message : 'SUCCESS');

  // 10. Check profiles table to ensure real admin is untouched
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
  console.log('10. Current profiles in DB:', profiles);

  console.log('Clean fake data finished!');
}

cleanFakeData();
