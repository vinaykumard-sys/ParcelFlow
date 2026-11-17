import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const apkPath = path.resolve('public/downloads/android/ParcelFlow.apk');
execSync(`& "${jarExe}" xf "${apkPath}" classes.dex`, { cwd: 'test_dex_fix', shell: 'powershell' });
const buf = fs.readFileSync('test_dex_fix/classes.dex');

const stringIdsSize = buf.readUInt32LE(0x38);
const stringIdsOff = buf.readUInt32LE(0x3c);
const strings = [];
for (let i = 0; i < stringIdsSize; i++) {
  const off = buf.readUInt32LE(stringIdsOff + i * 4);
  let pos = off;
  while (buf[pos] & 0x80) pos++;
  pos++;
  let end = pos;
  while (buf[end] !== 0) end++;
  strings.push(buf.toString('utf8', pos, end));
}

function compareModifiedUtf8(s1, s2) {
  const l1 = s1.length;
  const l2 = s2.length;
  const min = Math.min(l1, l2);
  for (let i = 0; i < min; i++) {
    const c1 = s1.charCodeAt(i);
    const c2 = s2.charCodeAt(i);
    if (c1 !== c2) return c1 - c2;
  }
  return l1 - l2;
}

let violations = 0;
for (let i = 0; i < strings.length - 1; i++) {
  const cmp = compareModifiedUtf8(strings[i], strings[i + 1]);
  if (cmp >= 0) {
    console.log(`ORDER VIOLATION in ParcelFlow DEX at [${i}] vs [${i + 1}]:`);
    console.log(`  [${i}]: "${strings[i]}" (${strings[i].charCodeAt(0)})`);
    console.log(`  [${i + 1}]: "${strings[i + 1]}" (${strings[i + 1].charCodeAt(0)})`);
    violations++;
  }
}
console.log('Total violations in ParcelFlow DEX:', violations);
