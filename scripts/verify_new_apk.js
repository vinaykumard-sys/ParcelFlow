import { execSync } from 'child_process';
import fs from 'fs';

if (fs.existsSync('verify_temp')) fs.rmSync('verify_temp', { recursive: true, force: true });
fs.mkdirSync('verify_temp');

execSync('& "C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe" xf ..\\public\\downloads\\android\\ParcelFlow.apk', {
  cwd: 'verify_temp',
  shell: 'powershell'
});

for (const f of ['AndroidManifest.xml', 'classes.dex', 'resources.arsc']) {
  const p = `verify_temp/${f}`;
  if (fs.existsSync(p)) {
    const buf = fs.readFileSync(p);
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
    // Also check UTF-16LE
    for (let i = 0; i < buf.length - 1; i += 2) {
      const code = buf.readUInt16LE(i);
      if (code >= 32 && code <= 126) {
        cur += String.fromCharCode(code);
      } else {
        if (cur.length >= 4) {
          strings.push(cur);
        }
        cur = '';
      }
    }
    const matches = strings.filter(s => /heatshield/i.test(s));
    console.log(`File: ${f} -> HeatShield matches: ${matches.length}`);
    if (matches.length > 0) {
      console.log('Matches:', matches);
    }
    const parcelMatches = strings.filter(s => /parcelflow/i.test(s));
    console.log(`File: ${f} -> ParcelFlow matches: ${parcelMatches.length}`);
  }
}

// Clean up
fs.rmSync('verify_temp', { recursive: true, force: true });
