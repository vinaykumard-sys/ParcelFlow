import fs from 'fs';
import path from 'path';

const PROJECT_REF = 'czhxktgdrhdflmfmvggx';

async function executeViaManagementApi(token) {
  if (!token) {
    console.error('Error: Supabase Access Token (sbp_...) is required.');
    process.exit(1);
  }

  const sqlPath = path.join(process.cwd(), 'database', '00_PARCELFLOW_ALL_IN_ONE.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log(`Executing SQL via Supabase Management API for project ${PROJECT_REF}...`);
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Management API Error (${res.status}):`, errorText);
    process.exit(1);
  }

  const result = await res.json();
  console.log('SQL Execution Success! Result:', result);
}

const token = process.argv[2] || process.env.SUPABASE_ACCESS_TOKEN;
executeViaManagementApi(token).catch(e => {
  console.error('Execution Failed:', e.message);
  process.exit(1);
});
