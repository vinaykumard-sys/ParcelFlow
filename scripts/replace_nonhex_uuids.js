import fs from 'fs';
import path from 'path';

const map = {
  // Storage locations: s0000001 -> 10000001, s0000002 -> 10000002
  's0000001': '10000001',
  's0000002': '10000002',
  
  // Pickup slots: sl000001 -> 51000001
  'sl000001': '51000001',
  
  // Parcels: p1111111 -> 71111111, etc.
  'p1111111': '71111111',
  'p2222222': '72222222',
  'p3333333': '73333333',
  'p4444444': '74444444',
  
  // Tokens: t1111111 -> f1111111, etc.
  't1111111': 'f1111111',
  't2222222': 'f2222222',
  
  // Parcel events: ev000001 -> e0000001
  'ev000001': 'e0000001',
  
  // Notifications: n1111111 -> 91111111, n2222222 -> 92222222
  'n1111111': '91111111',
  'n2222222': '92222222',
  
  // Audit logs: al000001 -> a1000001
  'al000001': 'a1000001',
  
  // Issues: is000001 -> 15000001
  'is000001': '15000001',
  
  // App versions: v0000001 -> 00000001
  'v0000001': '00000001'
};

// Replace in database/seed.sql and any referenced code
function replaceInFile(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  for (const [from, to] of Object.entries(map)) {
    const regex = new RegExp(from, 'g');
    const matches = (text.match(regex) || []).length;
    if (matches > 0) {
      text = text.replace(regex, to);
      changes += matches;
    }
  }
  if (changes > 0) {
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`Updated ${filePath}: ${changes} replacements.`);
  }
}

// Target files to update
const targetFiles = [
  'database/seed.sql',
  'database/schema.sql',
  'database/auth_and_admin_setup.sql',
  'backend/types.ts',
  'backend/supabase_client.ts',
  'admin-dashboard/src/services/supabase_client.ts',
  'admin-dashboard/src/types/backend-types.ts'
];

for (const tf of targetFiles) {
  const p = path.join(process.cwd(), tf);
  if (fs.existsSync(p)) {
    replaceInFile(p);
  }
}

console.log('Replacements completed.');
