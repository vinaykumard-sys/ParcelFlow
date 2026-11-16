import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Client } = pg;

// Supabase project details
const PROJECT_REF = 'czhxktgdrhdflmfmvggx';
const DB_HOST = `db.${PROJECT_REF}.supabase.co`;
const POOLER_HOST = 'aws-0-ap-south-1.pooler.supabase.com';

async function executeSql(password) {
  if (!password) {
    console.error('Error: Database password is required as an argument or in DB_PASSWORD env.');
    process.exit(1);
  }

  const sqlPath = path.join(process.cwd(), 'database', '00_PARCELFLOW_ALL_IN_ONE.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log(`Connecting to Supabase PostgreSQL (${DB_HOST}:5432)...`);
  
  // Try direct connection first, fallback to pooler
  let client = new Client({
    host: DB_HOST,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    console.log('Connected successfully via direct connection!');
  } catch (err) {
    console.log(`Direct connection failed (${err.message}). Trying transaction pooler (${POOLER_HOST}:6543)...`);
    client = new Client({
      host: POOLER_HOST,
      port: 6543,
      database: 'postgres',
      user: `postgres.${PROJECT_REF}`,
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });
    await client.connect();
    console.log('Connected successfully via transaction pooler!');
  }

  console.log('Executing master SQL setup script (00_PARCELFLOW_ALL_IN_ONE.sql)...');
  const startTime = Date.now();
  await client.query(sql);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`SUCCESS: Master SQL executed successfully in ${duration}s!`);

  // Verify verification queries
  const societiesRes = await client.query('SELECT COUNT(*) FROM public.societies');
  const profilesRes = await client.query('SELECT COUNT(*) FROM public.profiles');
  const parcelsRes = await client.query('SELECT COUNT(*) FROM public.parcels');
  const staffRes = await client.query('SELECT COUNT(*) FROM public.staff');
  const residentsRes = await client.query('SELECT COUNT(*) FROM public.residents');

  console.log('--- VERIFICATION COUNTS ---');
  console.log('Societies:  ', societiesRes.rows[0].count);
  console.log('Profiles:   ', profilesRes.rows[0].count);
  console.log('Parcels:    ', parcelsRes.rows[0].count);
  console.log('Staff:      ', staffRes.rows[0].count);
  console.log('Residents:  ', residentsRes.rows[0].count);

  await client.end();
}

const pass = process.argv[2] || process.env.DB_PASSWORD;
executeSql(pass).catch(e => {
  console.error('Execution Failed:', e.message);
  process.exit(1);
});
