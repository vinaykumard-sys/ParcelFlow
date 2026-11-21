import https from 'https';

function testUrl(url, headers = {}) {
  return new Promise((resolve) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });
  });
}

async function run() {
  const anonKey = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';
  
  console.log('--- 1. Testing /auth/v1/authorize?provider=google ---');
  const res1 = await testUrl(
    'https://czhxktgdrhdflmfmvggx.supabase.co/auth/v1/authorize?provider=google',
    { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
  );
  console.log('Status:', res1.statusCode);
  console.log('Body:', res1.body);

  console.log('--- 2. Testing /auth/v1/settings ---');
  const res2 = await testUrl(
    'https://czhxktgdrhdflmfmvggx.supabase.co/auth/v1/settings',
    { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
  );
  console.log('Status:', res2.statusCode);
  console.log('Body:', res2.body);
}

run();
