import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthFlows() {
  const testEmail = `parcelflow.user.${Date.now()}@gmail.com`;
  console.log(`Testing with valid gmail: ${testEmail}`);
  const r3 = await supabase.auth.signUp({
    email: testEmail,
    password: 'Password123!',
    options: {
      data: {
        full_name: 'ParcelFlow Test User',
        role: 'RESIDENT'
      }
    }
  });
  console.log('r3 sign up error:', r3.error?.message, 'session:', !!r3.data.session, 'user:', r3.data.user?.id);

  console.log('--- Testing Immediate Sign In ---');
  const r4 = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: 'Password123!'
  });
  console.log('r4 sign in error:', r4.error?.message, 'user:', r4.data.user?.id);
}

testAuthFlows();
