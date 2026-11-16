import fs from 'fs';

const content = fs.readFileSync('database/schema.sql', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('society_id')) {
    console.log(`${idx + 1}: ${l.trim()}`);
  }
});
