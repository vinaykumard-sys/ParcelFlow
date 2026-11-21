import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPostgresChanges() {
  const channel = supabase.channel('table-db-changes');
  let eventReceived = false;

  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'parcels' }, (payload) => {
    console.log('Received postgres_changes on parcels:', payload);
    eventReceived = true;
  });

  channel.subscribe(async (status) => {
    console.log('Status:', status);
    if (status === 'SUBSCRIBED') {
      console.log('Subscribed to postgres_changes!');
      setTimeout(() => {
        supabase.removeChannel(channel);
        console.log('Finished listening. postgres_changes supported?:', status === 'SUBSCRIBED');
        process.exit(0);
      }, 1500);
    }
  });
}

testPostgresChanges();
