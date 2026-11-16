import fs from 'fs';
import crypto from 'crypto';

// Adler32 implementation
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

// Test on current classes.dex
const dex = fs.readFileSync('apk_temp/classes.dex');
const currentChecksum = dex.readUInt32LE(8);
const currentSha1 = dex.slice(12, 32).toString('hex');

// Recompute SHA1 over bytes [32, dex.length]
const calcSha1 = crypto.createHash('sha1').update(dex.slice(32)).digest('hex');
// Recompute Adler32 over bytes [12, dex.length]
const calcChecksum = adler32(dex, 12, dex.length - 12) >>> 0;

console.log('Original Checksum:', currentChecksum.toString(16), 'Calculated:', calcChecksum.toString(16));
console.log('Original SHA1:', currentSha1, 'Calculated:', calcSha1);
console.log('Matches?', currentChecksum === calcChecksum && currentSha1 === calcSha1);
