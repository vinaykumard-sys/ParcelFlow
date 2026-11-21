import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAllProfiles() {
  // First sign in as vinay (admin) so we have full read access
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });
  
  if (authErr) {
    console.error('Admin auth failed:', authErr.message);
    return;
  }
  
  console.log('Logged in as Admin. Fetching all profiles in DB...');
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
  console.log('Profiles in DB:', profiles?.length, profiles);
  
  const { data: residents, error: resErr } = await supabase.from('residents').select('*');
  console.log('Residents in DB:', residents?.length, residents);

  const { data: staff, error: staffErr } = await supabase.from('staff').select('*');
  console.log('Staff in DB:', staff?.length, staff);
}

checkAllProfiles();
