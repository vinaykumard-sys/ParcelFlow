import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
  console.log('Testing connection to Supabase...');
  
  // 1. Check societies
  const { data: societies, error: socErr } = await supabase.from('societies').select('*').limit(5);
  console.log('Societies:', { count: societies?.length, error: socErr?.message });
  
  // 2. Check profiles
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').limit(5);
  console.log('Profiles:', { count: profiles?.length, error: profErr?.message });
  
  // 3. Check parcels
  const { data: parcels, error: parcelErr } = await supabase.from('parcels').select('*').limit(5);
  console.log('Parcels:', { count: parcels?.length, error: parcelErr?.message });

  // 4. Check pilot_requests
  const { data: pilots, error: pilotErr } = await supabase.from('pilot_requests').select('*').limit(5);
  console.log('Pilot Requests:', { count: pilots?.length, error: pilotErr?.message });

  // 5. Check waitlist
  const { data: waitlist, error: waitErr } = await supabase.from('waitlist').select('*').limit(5);
  console.log('Waitlist:', { count: waitlist?.length, error: waitErr?.message });
}

checkDb();
