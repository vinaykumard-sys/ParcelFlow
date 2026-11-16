import fs from 'fs';

for (const f of ['AndroidManifest.xml', 'classes.dex', 'resources.arsc']) {
  if (fs.existsSync(f)) {
    const buf = fs.readFileSync(f);
    // Find ASCII strings
    let cur = '';
    const strings = [];
    for (let i = 0; i < buf.length; i++) {
      const b = buf[i];
      if (b >= 32 && b <= 126) {
        cur += String.fromCharCode(b);
      } else {
        if (cur.length >= 4) {
          strings.push(cur);
        }
        cur = '';
      }
    }
    console.log(`\n=== File: ${f} (found ${strings.length} strings) ===`);
    strings.filter(s => /heatshield|vercel|package|app|shield/i.test(s)).forEach(s => {
      console.log(' ', s);
    });
    strings.filter(s => /http(s)?:\/\//i.test(s)).forEach(s => {
      console.log(' URL:', s);
    });
  }
}
