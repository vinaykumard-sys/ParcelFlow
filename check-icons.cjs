const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) res.push(...walk(p));
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) res.push(p);
  }
  return res;
}

const allFiles = walk('src');
const cjs = require('./node_modules/lucide-react/dist/cjs/lucide-react.js');
const lucideKeys = new Set(Object.keys(cjs));

let missingCount = 0;
for (const f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g);
  for (const m of matches) {
    const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
    for (const n of names) {
      const clean = n.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
      if (!lucideKeys.has(clean)) {
        console.log('MISSING in', f, ':', clean);
        missingCount++;
      }
    }
  }
}
console.log('Check finished. Total missing:', missingCount);
