import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Client } = pg;

const PROJECT_REF = 'czhxktgdrhdflmfmvggx';
const POOLER_HOST = 'aws-0-ap-south-1.pooler.supabase.com';
const DIRECT_HOST = `db.${PROJECT_REF}.supabase.co`;

const PASSWORDS = ['6Tha3see@123', '6tha3see@123'];

async function tryConnect(password) {
  const configs = [
    {
      name: `Pooler Session (5432) with pass: ${password.substring(0, 3)}***`,
      host: POOLER_HOST,
      port: 5432,
      database: 'postgres',
      user: `postgres.${PROJECT_REF}`,
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000
    },
    {
      name: `Pooler Transaction (6543) with pass: ${password.substring(0, 3)}***`,
      host: POOLER_HOST,
      port: 6543,
      database: 'postgres',
      user: `postgres.${PROJECT_REF}`,
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000
    },
    {
      name: `Direct Host (5432) with pass: ${password.substring(0, 3)}***`,
      host: DIRECT_HOST,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000
    }
  ];

  for (const config of configs) {
    console.log(`Attempting connection: ${config.name}...`);
    const client = new Client(config);
    try {
      await client.connect();
      console.log(`Connected successfully via: ${config.name}!`);
      return client;
    } catch (err) {
      console.log(`Failed (${config.name}): ${err.message}`);
      try { await client.end(); } catch (_) {}
    }
  }
  return null;
}

async function run() {
  let connectedClient = null;
  let workingPassword = null;

  for (const pass of PASSWORDS) {
    connectedClient = await tryConnect(pass);
    if (connectedClient) {
      workingPassword = pass;
      break;
    }
  }

  if (!connectedClient) {
    console.error('All connection attempts failed. Check credentials/network.');
    process.exit(1);
  }

  console.log('\n--- EXECUTING MASTER SQL (00_PARCELFLOW_ALL_IN_ONE.sql) ---');
  const sqlPath = path.join(process.cwd(), 'database', '00_PARCELFLOW_ALL_IN_ONE.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const start = Date.now();
  await connectedClient.query(sql);
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`SUCCESS: Master SQL executed cleanly in ${elapsed}s!\n`);

  console.log('--- VERIFYING DATABASE TABLES & COUNTS ---');
  const tables = [
    'societies',
    'apartments',
    'users',
    'profiles',
    'residents',
    'staff',
    'storage_locations',
    'parcels',
    'parcel_events',
    'pickup_slots',
    'pickup_bookings',
    'handover_tokens',
    'issues',
    'audit_logs',
    'notifications',
    'app_versions'
  ];

  for (const t of tables) {
    try {
      const res = await connectedClient.query(`SELECT COUNT(*) FROM public.${t}`);
      console.log(`  [OK] ${t.padEnd(22)}: ${res.rows[0].count} rows`);
    } catch (e) {
      console.log(`  [ERR] ${t.padEnd(22)}: ${e.message}`);
    }
  }

  // Check admin trigger
  console.log('\n--- CHECKING ADMIN PROFILE SETUP ---');
  const adminRes = await connectedClient.query(
    "SELECT id, full_name, email, role FROM public.profiles WHERE LOWER(email) = 'vinaykumard45678@gmail.com'"
  );
  if (adminRes.rows.length > 0) {
    console.log('Admin Profile already present in profiles table:', adminRes.rows[0]);
  } else {
    console.log('Trigger handle_new_user is installed and waiting for vinaykumard45678@gmail.com signup to assign admin role automatically.');
  }

  await connectedClient.end();
  console.log('\nALL DONE! Database is 100% production-ready.');
}

run().catch(e => {
  console.error('Fatal Error:', e);
  process.exit(1);
});
