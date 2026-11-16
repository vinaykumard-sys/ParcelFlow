import fs from 'fs';
import path from 'path';

const results = [];

function search(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      search(fullPath);
    } else {
      // Check binary or text
      try {
        const buf = fs.readFileSync(fullPath);
        const str = buf.toString('utf8');
        if (/heatshield/i.test(str)) {
          // Find line numbers
          const lines = str.split('\n');
          lines.forEach((line, idx) => {
            if (/heatshield/i.test(line)) {
              results.push({
                file: path.relative(process.cwd(), fullPath),
                line: idx + 1,
                content: line.trim()
              });
            }
          });
        }
      } catch (_) {}
    }
  }
}

search(process.cwd());

console.log(`Found ${results.length} matches for "heatshield":`);
results.forEach(r => {
  console.log(`${r.file}:${r.line} -> ${r.content.substring(0, 150)}`);
});
