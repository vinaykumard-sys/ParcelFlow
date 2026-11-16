import pg from 'pg';
const { Client } = pg;
const PROJECT_REF = 'czhxktgdrhdflmfmvggx';

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'us-east-1',
  'us-west-1',
  'us-east-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-southeast-2',
  'sa-east-1',
  'ca-central-1'
];

async function findRegion() {
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    const client = new Client({
      host: host,
      port: 6543,
      database: 'postgres',
      user: `postgres.${PROJECT_REF}`,
      password: 'test',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3500
    });
    try {
      await client.connect();
    } catch (err) {
      if (err.message.includes('password authentication failed') || err.message.includes('FATAL:  password')) {
        console.log(`\n>>> FOUND MATCHING REGION! Host: ${host} -> User recognized! <<<`);
        return host;
      } else if (err.message.includes('tenant') || err.message.includes('not found')) {
        // tenant not in this region
        process.stdout.write(`.`);
      } else {
        console.log(`\n${r}: ${err.message}`);
      }
      try { await client.end(); } catch(_) {}
    }
  }
  console.log('\nCould not determine pooler host.');
  return null;
}

findRegion();
