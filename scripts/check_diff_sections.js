import fs from 'fs';

const buf = fs.readFileSync('classes.dex');
const origApk = 'C:\\Users\\Vinay\\Downloads\\HeatShield-AI-v1.0.0.apk';
import { execSync } from 'child_process';
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
execSync(`& "${jarExe}" xf "${origApk}" classes.dex`, { cwd: 'scripts', shell: 'powershell' });
const origBuf = fs.readFileSync('scripts/classes.dex');
fs.unlinkSync('scripts/classes.dex');

for (let i = 0x20; i < Math.min(buf.length, origBuf.length); i++) {
  if (buf[i] !== origBuf[i]) {
    // print in chunks
    let start = i;
    while (i < buf.length && buf[i] !== origBuf[i]) i++;
    console.log(`Diff at 0x${start.toString(16)} - 0x${i.toString(16)} (${i - start} bytes):`);
    console.log(`  ORIG: "${origBuf.slice(start, i).toString('utf8')}"`);
    console.log(`  CURR: "${buf.slice(start, i).toString('utf8')}"`);
  }
}
