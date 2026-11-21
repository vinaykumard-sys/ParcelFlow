import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

const clientA = createClient(supabaseUrl, supabaseAnonKey);
const clientB = createClient(supabaseUrl, supabaseAnonKey);

async function testRealtimeBroadcast() {
  let receivedA = false;
  let receivedB = false;

  const channelA = clientA.channel('society-ops-room');
  const channelB = clientB.channel('society-ops-room');

  channelB.on('broadcast', { event: 'parcel:intake' }, (payload) => {
    console.log('[Client B] Received parcel:intake event:', payload);
    receivedB = true;
  });

  channelA.on('broadcast', { event: 'pickup:collected' }, (payload) => {
    console.log('[Client A] Received pickup:collected event:', payload);
    receivedA = true;
  });

  await new Promise((resolve) => {
    let count = 0;
    const check = () => {
      count++;
      if (count === 2) resolve();
    };
    channelA.subscribe((s) => s === 'SUBSCRIBED' && check());
    channelB.subscribe((s) => s === 'SUBSCRIBED' && check());
  });

  console.log('Both channels SUBSCRIBED!');

  // Client A broadcasts parcel:intake
  await channelA.send({
    type: 'broadcast',
    event: 'parcel:intake',
    payload: { trackingNumber: 'PF-TEST-001', carrier: 'Amazon', slot: 'Shelf A-01' }
  });

  // Client B broadcasts pickup:collected
  await channelB.send({
    type: 'broadcast',
    event: 'pickup:collected',
    payload: { trackingNumber: 'PF-TEST-001', verifiedBy: 'STAFF-HUB-01' }
  });

  // Wait 1.5s for delivery
  await new Promise((r) => setTimeout(r, 1500));

  console.log('Test Broadcast Results:', { receivedA, receivedB });
  clientA.removeChannel(channelA);
  clientB.removeChannel(channelB);
  process.exit(receivedA && receivedB ? 0 : 1);
}

testRealtimeBroadcast();
