import fs from 'fs';
import path from 'path';

const src = 'signed_out/unaligned-aligned-signed.apk';
const dests = [
  'public/downloads/android/ParcelFlow.apk',
  'public/downloads/ParcelFlow.apk',
  'downloads/android/ParcelFlow.apk',
  'C:\\Users\\Vinay\\Downloads\\ParcelFlow.apk'
];

for (const dest of dests) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied to ${dest} (Size: ${fs.statSync(dest).size} bytes)`);
}

// Clean up temporary files
const toRemove = [
  'unaligned.apk',
  'aligned.apk',
  'ParcelFlow-final.apk',
  'ParcelFlow-dual-signed.apk',
  'test_manifest_order.apk',
  'test-v2-signed.apk',
  'key.pem',
  'key_pkcs8.pem',
  'cert.pem'
];

for (const f of toRemove) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('Removed temporary file:', f);
  }
}

if (fs.existsSync('signed_out')) {
  fs.rmSync('signed_out', { recursive: true, force: true });
}
if (fs.existsSync('apk_temp')) {
  fs.rmSync('apk_temp', { recursive: true, force: true });
}
console.log('All files distributed and cleanups finished!');
