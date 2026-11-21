import fs from 'fs';
import crypto from 'crypto';

if (!fs.existsSync('test_dex_fix')) fs.mkdirSync('test_dex_fix', { recursive: true });

// Read classes.dex
const buf = fs.readFileSync('classes.dex');

function replaceExact(searchStr, replaceStr) {
  const sBuf = Buffer.from(searchStr, 'utf8');
  const rBuf = Buffer.from(replaceStr, 'utf8');
  if (sBuf.length !== rBuf.length) {
    throw new Error(`Length mismatch: ${sBuf.length} !== ${rBuf.length} ("${searchStr}" vs "${replaceStr}")`);
  }
  let idx = buf.indexOf(sBuf);
  if (idx === -1) {
    console.log(`Already replaced or not found: "${searchStr}"`);
    return;
  }
  rBuf.copy(buf, idx);
  console.log(`Replaced "${searchStr}" with "${replaceStr}" at 0x${idx.toString(16)}`);
}

// 1. User agent string (45 chars)
replaceExact(
  ' ParcelFlowApp/1.1.0 (Android; versionCode 4)',
  ' ParcelFlowApp/1.2.0 (Android; versionCode 5)'
);

// 2. JavaScript bridge string (137 chars)
replaceExact(
  "window.__PARCELFLOW_NATIVE_APP__ = true; window.__PARCELFLOW_NATIVE_VERSION__ = '1.1.0'; window.__PARCELFLOW_NATIVE_VERSION_CODE__ = 4;",
  "window.__PARCELFLOW_NATIVE_APP__ = true; window.__PARCELFLOW_NATIVE_VERSION__ = '1.2.0'; window.__PARCELFLOW_NATIVE_VERSION_CODE__ = 5;"
);

// Recompute SHA-1
const sha1 = crypto.createHash('sha1').update(buf.slice(32)).digest();
sha1.copy(buf, 12);
console.log('New SHA-1:', sha1.toString('hex'));

// Recompute Adler32
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

// Verify string pool sort order
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
function compareModifiedUtf8(s1, s2) {
  const l1 = s1.length, l2 = s2.length, min = Math.min(l1, l2);
  for (let i = 0; i < min; i++) {
    const c1 = s1.charCodeAt(i), c2 = s2.charCodeAt(i);
    if (c1 !== c2) return c1 - c2;
  }
  return l1 - l2;
}

for (let i = 0; i < strings.length - 1; i++) {
  if (compareModifiedUtf8(strings[i], strings[i + 1]) > 0) {
    console.error(`ORDER VIOLATION at [${i}] vs [${i + 1}]:`);
    console.error(`  [${i}]: "${strings[i]}"`);
    console.error(`  [${i + 1}]: "${strings[i + 1]}"`);
    sorted = false;
  }
}

console.log('>>> IS STRING POOL STRICTLY SORTED? <<<', sorted);
if (!sorted) throw new Error('String pool order violated!');

fs.writeFileSync('test_dex_fix/classes_fixed.dex', buf);
console.log('Successfully saved test_dex_fix/classes_fixed.dex!');
