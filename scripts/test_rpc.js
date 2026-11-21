import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRpc() {
  await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });

  console.log('Testing is_super_admin RPC...');
  const { data: isSuper, error: err1 } = await supabase.rpc('is_super_admin');
  console.log('is_super_admin result:', isSuper, 'error:', err1?.message);

  console.log('Testing promote_user_to_admin RPC...');
  const { data: promo, error: err2 } = await supabase.rpc('promote_user_to_admin', {
    target_email: 'vinaykumard45678@gmail.com',
    target_role: 'SUPER_ADMIN'
  });
  console.log('promote_user_to_admin result:', promo, 'error:', err2?.message);
}

testRpc();
