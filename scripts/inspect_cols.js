import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectCols() {
  const { data, error } = await supabase.from('societies').select('*').limit(1);
  console.log('Query result:', data, 'Error:', error?.message);
}

inspectCols();
