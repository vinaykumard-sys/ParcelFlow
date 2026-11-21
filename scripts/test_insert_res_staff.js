import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertResident() {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });
  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }

  // Check if residents seed row can be inserted
  const res = {
    id: 'e1111111-1111-1111-1111-111111111111',
    user_id: 'd1111111-1111-1111-1111-111111111111',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    apartment_id: 'f1010001-0000-0000-0000-000000000001',
    is_primary: true
  };

  const { data, error } = await supabase.from('residents').insert([res]).select();
  console.log('Insert resident result:', { data, error });

  // Check staff
  const staff = {
    id: 'c1111111-1111-1111-1111-111111111111',
    user_id: 'b1111111-1111-1111-1111-111111111111',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    badge_number: 'STAFF-HUB-01',
    designation: 'Hub Supervisor',
    shift: 'Morning (07:00 - 15:00)',
    is_active: true
  };
  const { data: staffData, error: staffErr } = await supabase.from('staff').insert([staff]).select();
  console.log('Insert staff result:', { staffData, staffErr });
}

testInsertResident();
