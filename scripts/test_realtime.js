import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealtime() {
  console.log('Testing Realtime channel connection...');
  const channel = supabase.channel('room-1');
  
  channel
    .on('broadcast', { event: 'test-event' }, (payload) => {
      console.log('Received broadcast payload:', payload);
    })
    .subscribe((status, err) => {
      console.log('Channel subscription status:', status, err);
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'test-event',
          payload: { message: 'Hello from Node!' }
        }).then((resp) => {
          console.log('Send broadcast response:', resp);
          setTimeout(() => {
            supabase.removeChannel(channel);
            process.exit(0);
          }, 1500);
        });
      }
    });
}

testRealtime();
