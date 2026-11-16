import fs from 'fs';

console.log('=== src/utils/supabase.ts ===');
console.log(fs.readFileSync('src/utils/supabase.ts', 'utf8'));

console.log('=== admin-dashboard/src/services/supabase_client.ts (partial) ===');
const adminClient = fs.readFileSync('admin-dashboard/src/services/supabase_client.ts', 'utf8');
console.log(adminClient.slice(0, 1500));
