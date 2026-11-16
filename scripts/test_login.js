import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  const email = 'vinaykumard45678@gmail.com';
  const passwords = ['6Tha3see@123', '6tha3see@123'];
  
  for (const pw of passwords) {
    console.log(`Trying sign in with ${email} / ${pw}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pw
    });
    
    if (error) {
      console.log(`Failed with password ${pw}:`, error.message);
    } else {
      console.log(`SUCCESSFUL SIGN IN with ${pw}! User ID:`, data.user?.id);
      console.log('User metadata:', data.user?.user_metadata);
      
      // Check profiles
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      console.log('Profile record in DB:', prof, 'Error:', profErr?.message);
      return;
    }
  }
}

testAuth();
