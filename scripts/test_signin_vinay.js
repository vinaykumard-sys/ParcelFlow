import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });

  if (error) {
    console.log('Sign in error:', error.message);
  } else {
    console.log('SUCCESS! Logged in as:', data.user.email);
    console.log('User id:', data.user.id);
    
    // Now fetch profile as authenticated user
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();
      
    console.log('Profile:', profile, 'Profile error:', profErr?.message);
  }
}

testSignIn();
