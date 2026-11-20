import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const apkPath = 'public/downloads/android/ParcelFlow.apk';
const metadataPath = 'public/api/app-update/android.json';

if (!fs.existsSync(apkPath)) {
  console.error('Error: APK not found at', apkPath);
  process.exit(1);
}

const apkBuffer = fs.readFileSync(apkPath);
const apkSizeBytes = apkBuffer.length;
const sha256 = crypto.createHash('sha256').update(apkBuffer).digest('hex');

let existing = {
  latestVersionName: '1.2.0',
  latestVersionCode: 5,
  minimumSupportedVersionCode: 4,
  apkUrl: '/downloads/android/ParcelFlow.apk',
  releaseNotes: [
    'Faster parcel barcode scanning & instant carrier auto-detection',
    'Real-time hub express counter arrival alerts (\'On My Way\')',
    'Enhanced digital pickup pass QR verification security',
    'Automatic offline sync resilience & performance improvements'
  ],
  mandatory: false,
};

if (fs.existsSync(metadataPath)) {
  try {
    existing = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  } catch {
    // ignore
  }
}

const updated = {
  ...existing,
  apkSizeBytes,
  sha256,
  releaseDate: new Date().toISOString().split('T')[0],
};

const dir = path.dirname(metadataPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(metadataPath, JSON.stringify(updated, null, 2), 'utf8');

console.log('=== PARCELFLOW RELEASE METADATA PUBLISHED ===');
console.log(`Version: ${updated.latestVersionName} (code: ${updated.latestVersionCode})`);
console.log(`Size: ${apkSizeBytes} bytes`);
console.log(`SHA-256: ${sha256}`);
console.log(`Destination: ${metadataPath}`);
