import fs from 'fs';
import crypto from 'crypto';

let dex = fs.readFileSync('apk_temp/classes.dex');

function replaceAscii(buf, searchStr, replaceStr) {
  const searchBuf = Buffer.from(searchStr, 'utf8');
  const replaceBuf = Buffer.from(replaceStr, 'utf8');
  if (searchBuf.length !== replaceBuf.length) {
    throw new Error(`Length mismatch for "${searchStr}": ${searchBuf.length} !== ${replaceBuf.length}`);
  }
  let count = 0;
  let idx = 0;
  while ((idx = buf.indexOf(searchBuf, idx)) !== -1) {
    replaceBuf.copy(buf, idx);
    idx += replaceBuf.length;
    count++;
  }
  return count;
}

function adler32(buf, offset = 0, len = buf.length) {
  let a = 1;
  let b = 0;
  const MOD_ADLER = 65521;
  for (let i = offset; i < offset + len; i++) {
    a = (a + buf[i]) % MOD_ADLER;
    b = (b + a) % MOD_ADLER;
  }
  return (b << 16) | a;
}

const replacements = [
  ['com/heatshield/ai', 'in/parcelflow/app'],
  ['com-heatshield-ai', 'in-parcelflow-app'],
  ['com.heatshield.ai', 'in.parcelflow.app'],
  ['HEATSHIELD AI', 'PARCELFLOW.IN'],
  ['Theme_HeatShield', 'Theme_ParcelFlow'],
  ['Press back again to exit HeatShield AI', 'Press back again to exit ParcelFlow   '],
  ['Smart Urban Heat Safety & Resilience', 'Smart Parcel Management & Locker Hub'],
  ['window.__HEATSHIELD_NATIVE_APP__ = true; window.__HEATSHIELD_NATIVE_VERSION__ = \'1.1.0\'; window.__HEATSHIELD_NATIVE_VERSION_CODE__ = 4;',
   'window.__PARCELFLOW_NATIVE_APP__ = true; window.__PARCELFLOW_NATIVE_VERSION__ = \'1.1.0\'; window.__PARCELFLOW_NATIVE_VERSION_CODE__ = 4;'],
  ['- HeatShieldApp/1.1.0 (Android; versionCode 4)', '- ParcelFlowApp/1.1.0 (Android; versionCode 4)']
];

for (const [from, to] of replacements) {
  const count = replaceAscii(dex, from, to);
  console.log(`Replaced "${from}" -> "${to}": count = ${count}`);
}

// Recompute SHA1
const sha1 = crypto.createHash('sha1').update(dex.slice(32)).digest();
sha1.copy(dex, 12);

// Recompute Adler32
const checksum = adler32(dex, 12, dex.length - 12) >>> 0;
dex.writeUInt32LE(checksum, 8);

fs.writeFileSync('apk_temp/classes.dex', dex);
console.log('Saved patched classes.dex with new Checksum:', checksum.toString(16), 'SHA1:', sha1.toString('hex'));
