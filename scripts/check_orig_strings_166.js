import fs from 'fs';

const origApk = 'C:\\Users\\Vinay\\Downloads\\HeatShield-AI-v1.0.0.apk';
import { execSync } from 'child_process';
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
execSync(`& "${jarExe}" xf "${origApk}" classes.dex`, { cwd: 'scripts', shell: 'powershell' });
const origBuf = fs.readFileSync('scripts/classes.dex');
fs.unlinkSync('scripts/classes.dex');

const origStringIdsSize = origBuf.readUInt32LE(0x38);
const origStringIdsOff = origBuf.readUInt32LE(0x3c);
const origStrings = [];
for (let i = 0; i < origStringIdsSize; i++) {
  const off = origBuf.readUInt32LE(origStringIdsOff + i * 4);
  let pos = off;
  while (origBuf[pos] & 0x80) pos++;
  pos++;
  let end = pos;
  while (origBuf[end] !== 0) end++;
  origStrings.push(origBuf.toString('utf8', pos, end));
}

for (let i = 164; i <= 170; i++) {
  console.log(`[${i}] "${origStrings[i]}"`);
}
