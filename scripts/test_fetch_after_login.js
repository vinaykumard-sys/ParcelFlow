import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetchAfterLogin() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });
  console.log('Signed in UID:', authData?.user?.id, 'Auth Error:', authErr?.message);

  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .maybeSingle();

  console.log('Profile data:', profile, 'Profile error:', profErr?.message);
}

testFetchAfterLogin();
