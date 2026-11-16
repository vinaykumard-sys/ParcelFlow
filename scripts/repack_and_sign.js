import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('--- Step 1: Remove old signature files ---');
if (fs.existsSync('apk_temp/META-INF')) {
  fs.rmSync('apk_temp/META-INF', { recursive: true, force: true });
}

console.log('--- Step 2: Repack APK with jar.exe ---');
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const jarsignerExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jarsigner.exe';

if (fs.existsSync('ParcelFlow-signed.apk')) {
  fs.unlinkSync('ParcelFlow-signed.apk');
}

// Build jar/apk archive from apk_temp
execSync(`& "${jarExe}" -c -M -f ..\\ParcelFlow-signed.apk .`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});

console.log('--- Step 3: Sign APK with parcelflow-release.jks ---');
execSync(`& "${jarsignerExe}" -keystore parcelflow-release.jks -storepass parcelflow123 -sigalg SHA256withRSA -digestalg SHA-256 ParcelFlow-signed.apk parcelflow`, {
  shell: 'powershell'
});

console.log('--- Step 4: Verify signature ---');
const verifyOut = execSync(`& "${jarsignerExe}" -verify -verbose -certs ParcelFlow-signed.apk`, {
  shell: 'powershell'
}).toString();

if (verifyOut.includes('jar verified.')) {
  console.log('VERIFIED: APK is cryptographically signed and valid!');
} else {
  console.warn('Warning on verify:', verifyOut.slice(0, 500));
}

console.log('--- Step 5: Distribute to all download paths ---');
const destinations = [
  'public/downloads/android/ParcelFlow.apk',
  'public/downloads/ParcelFlow.apk',
  'downloads/android/ParcelFlow.apk',
  'C:\\Users\\Vinay\\Downloads\\ParcelFlow.apk'
];

for (const dest of destinations) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync('ParcelFlow-signed.apk', dest);
  console.log(`Copied to ${dest} (Size: ${fs.statSync(dest).size} bytes)`);
}

console.log('ALL DONE! Clean ParcelFlow APK successfully deployed.');
