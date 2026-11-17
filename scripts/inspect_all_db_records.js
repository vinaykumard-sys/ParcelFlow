import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: '6Tha3see@123'
  });

  if (authError) {
    console.error('Sign in error:', authError.message);
    return;
  }
  console.log('Authenticated as:', authData.user.email, 'UID:', authData.user.id);

  const tables = ['profiles', 'residents', 'staff', 'packages', 'deliveries', 'societies', 'parcelflow_lockers', 'lockers'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.log(`Table ${table} error:`, error.message);
    } else {
      console.log(`Table ${table} count: ${data.length}`);
      if (data.length > 0) {
        console.log(`  Items in ${table}:`, JSON.stringify(data, null, 2));
      }
    }
  }
}

inspect();
