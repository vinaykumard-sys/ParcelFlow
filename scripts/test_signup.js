import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignUp() {
  const email = 'vinaykumard45678@gmail.com';
  const password = '6Tha3see@123';
  
  console.log(`Attempting signUp for ${email}...`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Vinay Kumar',
        role: 'admin'
      }
    }
  });

  if (error) {
    console.log('SignUp error:', error.message);
  } else {
    console.log('SignUp result:', {
      id: data.user?.id,
      email: data.user?.email,
      confirmed_at: data.user?.confirmed_at,
      identities: data.user?.identities?.length
    });
    
    // Check if profile was created
    if (data.user?.id) {
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      console.log('Profile created by trigger:', prof, 'Error:', profErr?.message);
    }
  }
}

testSignUp();
