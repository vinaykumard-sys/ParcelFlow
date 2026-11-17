import fs from 'fs';
import { execSync } from 'child_process';

const origApk = 'C:\\Users\\Vinay\\Downloads\\HeatShield-AI-v1.0.0.apk';
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
if (!fs.existsSync('test_dex_fix')) fs.mkdirSync('test_dex_fix');
execSync(`& "${jarExe}" xf "${origApk}" classes.dex`, { cwd: 'test_dex_fix', shell: 'powershell' });
const buf = fs.readFileSync('test_dex_fix/classes.dex');

function replaceExact(searchStr, replaceStr) {
  const sBuf = Buffer.from(searchStr, 'utf8');
  const rBuf = Buffer.from(replaceStr, 'utf8');
  if (sBuf.length !== rBuf.length) {
    throw new Error(`Length mismatch: ${sBuf.length} !== ${rBuf.length} ("${searchStr}" vs "${replaceStr}")`);
  }
  let idx = buf.indexOf(sBuf);
  if (idx === -1) throw new Error(`Not found: "${searchStr}"`);
  rBuf.copy(buf, idx);
  console.log(`Replaced "${searchStr}" with "${replaceStr}" at 0x${idx.toString(16)}`);
}

// 1. User agent string (45 chars)
replaceExact(
  ' HeatShieldApp/1.1.0 (Android; versionCode 4)',
  ' ParcelFlowApp/1.1.0 (Android; versionCode 4)'
);

// 2. Splash title: String 18 between "F" and "I" (13 chars)
replaceExact(
  'HEATSHIELD AI',
  'HUBPARCELFLOW'
);

// 3. Exit toast string (38 chars)
replaceExact(
  'Press back again to exit HeatShield AI',
  'Press back again to exit ParcelFlow   '
);

// 4. Splash subtitle: String 85 between "SDK_INT" and "Theme_HeatShield" (36 chars)
replaceExact(
  'Smart Urban Heat Safety & Resilience',
  'Smart Urban Parcel & Locker Delivery'
);

// 5. JavaScript bridge string (137 chars)
replaceExact(
  "window.__HEATSHIELD_NATIVE_APP__ = true; window.__HEATSHIELD_NATIVE_VERSION__ = '1.1.0'; window.__HEATSHIELD_NATIVE_VERSION_CODE__ = 4;",
  "window.__PARCELFLOW_NATIVE_APP__ = true; window.__PARCELFLOW_NATIVE_VERSION__ = '1.1.0'; window.__PARCELFLOW_NATIVE_VERSION_CODE__ = 4;"
);

// Now recompute SHA-1 and Adler32 checksums
import crypto from 'crypto';

// SHA-1 is over offset 32 to end of file
const sha1 = crypto.createHash('sha1');
sha1.update(buf.slice(32));
const sha1Digest = sha1.digest();
sha1Digest.copy(buf, 12);
console.log('New SHA-1:', sha1Digest.toString('hex'));

// Adler32 is over offset 12 to end of file
function adler32(b, start) {
  let a = 1, c = 0;
  for (let i = start; i < b.length; i++) {
    a = (a + b[i]) % 65521;
    c = (c + a) % 65521;
  }
  return (c << 16) | a;
}
const checksum = adler32(buf, 12);
buf.writeUInt32LE(checksum >>> 0, 8);
console.log('New Adler32:', checksum.toString(16));

// NOW VERIFY STRING POOL SORT ORDER
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

let sorted = true;
for (let i = 0; i < strings.length - 1; i++) {
  if (strings[i].localeCompare(strings[i + 1]) > 0) {
    console.log(`ORDER VIOLATION at [${i}] vs [${i + 1}]:`);
    console.log(`  [${i}]: "${strings[i]}"`);
    console.log(`  [${i + 1}]: "${strings[i + 1]}"`);
    sorted = false;
  }
}
console.log('\n>>> IS STRING POOL STRICTLY SORTED? <<<', sorted);
fs.writeFileSync('test_dex_fix/classes_fixed.dex', buf);
