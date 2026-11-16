import fs from 'fs';

const adminClient = fs.readFileSync('admin-dashboard/src/services/supabase_client.ts', 'utf8');
const lines = adminClient.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('isAdmin') || l.includes('role ===') || l.includes('profiles')) {
    console.log(`${idx + 1}: ${l.trim()}`);
  }
});
