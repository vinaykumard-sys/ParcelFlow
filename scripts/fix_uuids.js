import fs from 'fs';
import path from 'path';

const files = [
  'database/seed.sql',
  'database/schema.sql',
  'database/auth_and_admin_setup.sql'
];

let replacedCount = 0;
for (const rel of files) {
  const p = path.join(process.cwd(), rel);
  let content = fs.readFileSync(p, 'utf8');
  
  if (content.includes('bcccccccc-cccc-cccc-cccc-cccccccccccc')) {
    content = content.replace(/bcccccccc-cccc-cccc-cccc-cccccccccccc/g, 'bccccccc-cccc-cccc-cccc-cccccccccccc');
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Replaced in ${rel}`);
    replacedCount++;
  }
}

console.log(`Total replacements: ${replacedCount}`);
