import { execSync } from 'child_process';
import fs from 'fs';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const jarsignerExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jarsigner.exe';

if (fs.existsSync('test_manifest_order.apk')) fs.unlinkSync('test_manifest_order.apk');

// Ensure apk_temp has no old META-INF
if (fs.existsSync('apk_temp/META-INF')) {
  fs.rmSync('apk_temp/META-INF', { recursive: true, force: true });
}

// Build with jar.exe (WITHOUT -M, so MANIFEST.MF is automatically entry 0!)
execSync(`& "${jarExe}" -c -f ..\\test_manifest_order.apk .`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});

// Now sign with jarsigner
execSync(`& "${jarsignerExe}" -keystore parcelflow-release.jks -storepass parcelflow123 -sigalg SHA256withRSA -digestalg SHA-256 test_manifest_order.apk parcelflow`, {
  shell: 'powershell'
});

// Verify
const out = execSync(`& "${jarsignerExe}" -verify test_manifest_order.apk`, {
  shell: 'powershell'
}).toString();

console.log('Verification output:\n', out);
