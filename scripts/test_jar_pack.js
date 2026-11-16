import { execSync } from 'child_process';
import fs from 'fs';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const javaExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\java.exe';
const jarsignerExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jarsigner.exe';

// 1. Pack with jar.exe (standard Java zip implementation, guaranteed no illegal EXT descriptors)
if (fs.existsSync('jar_packed.apk')) fs.unlinkSync('jar_packed.apk');
execSync(`& "${jarExe}" -c -f ..\\jar_packed.apk .`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});
console.log('Packed with jar.exe. Size:', fs.statSync('jar_packed.apk').size);

// 2. Sign and align with uber-apk-signer
if (fs.existsSync('uber_out')) fs.rmSync('uber_out', { recursive: true, force: true });
const uberOut = execSync(`& "${javaExe}" -jar uber-apk-signer.jar -a jar_packed.apk --ks parcelflow-release.jks --ksAlias parcelflow --ksPass parcelflow123 --ksKeyPass parcelflow123 -o uber_out --verbose`, {
  shell: 'powershell'
}).toString();
console.log('Uber output:\n', uberOut);

// 3. Now verify with jarsigner!
const signedApk = 'uber_out/jar_packed-aligned-signed.apk';
const verifyOut = execSync(`& "${jarsignerExe}" -verify "${signedApk}"`, {
  shell: 'powershell'
}).toString();
console.log('Jarsigner verification on final APK:\n', verifyOut);
