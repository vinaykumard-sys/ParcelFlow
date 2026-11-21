import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOtpAndSignup() {
  const email = 'vinaykumard45678@gmail.com';
  console.log('Testing signInWithOtp for vinay...');
  const { data: otpData, error: otpErr } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false
    }
  });
  console.log('OTP result:', otpData, 'error:', otpErr?.message);
}

testOtpAndSignup();
