import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data, error } = await supabase.from('societies').insert([
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      name: 'Lakeview Residency',
      code: 'LKV-01',
      address: 'Plot 42, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      total_units: 320,
      occupied_units: 285,
      hub_phone: '+91 80 4123 4567',
      is_active: true
    }
  ]).select();

  console.log('Insert society result:', { data, error: error?.message });
}

testInsert();
