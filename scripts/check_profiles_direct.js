import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdminStatus() {
  console.log('Checking profiles table...');
  const { data: profs, error } = await supabase.from('profiles').select('*');
  console.log('Profiles in DB:', profs, 'Error:', error?.message);
}

checkAdminStatus();
