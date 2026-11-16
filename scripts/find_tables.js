import fs from 'fs';
import path from 'path';

function searchInSrc(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== 'dist') {
      searchInSrc(full);
    } else if (e.isFile() && (e.name.endsWith('.ts') || e.name.endsWith('.tsx') || e.name.endsWith('.js'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('.from(\'profiles\')') || content.includes('.from("profiles")') || content.includes('.from(\'users\')') || content.includes('.from("users")')) {
        console.log(full);
      }
    }
  }
}

searchInSrc('src');
searchInSrc('admin-dashboard');
