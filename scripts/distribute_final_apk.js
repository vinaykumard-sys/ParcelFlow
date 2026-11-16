import fs from 'fs';
import path from 'path';

const src = 'uber_out/jar_packed-aligned-signed.apk';
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

// Clean up temporary build artifacts
if (fs.existsSync('jar_packed.apk')) fs.unlinkSync('jar_packed.apk');
if (fs.existsSync('uber_out')) fs.rmSync('uber_out', { recursive: true, force: true });
if (fs.existsSync('apk_temp')) fs.rmSync('apk_temp', { recursive: true, force: true });

console.log('Final APK distributed to all routes!');
