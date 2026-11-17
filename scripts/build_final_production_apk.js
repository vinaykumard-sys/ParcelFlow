import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const javaExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\java.exe';
const jarsignerExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jarsigner.exe';

console.log('=== Step 1: Clean temp build artifacts ===');
if (fs.existsSync('unsigned.apk')) fs.unlinkSync('unsigned.apk');
if (fs.existsSync('uber_out')) fs.rmSync('uber_out', { recursive: true, force: true });
if (fs.existsSync('apk_temp/META-INF')) fs.rmSync('apk_temp/META-INF', { recursive: true, force: true });

console.log('=== Step 2: Build unsigned APK archive with jar.exe (no manifest, standard deflate) ===');
execSync(`& "${jarExe}" -c -M -f ..\\unsigned.apk .`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});

console.log('=== Step 3: Replace resources.arsc with UNCOMPRESSED (method=0 STORED) entry ===');
execSync(`& "${jarExe}" -u -0 -M -f ..\\unsigned.apk resources.arsc`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});

console.log('=== Step 4: Verify resources.arsc in unsigned.apk is STORED (method 0) ===');
const unsignedBuf = fs.readFileSync('unsigned.apk');
let uEocd = unsignedBuf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const uCdOffset = unsignedBuf.readUInt32LE(uEocd + 16);
const uTotal = unsignedBuf.readUInt16LE(uEocd + 10);
let uCur = uCdOffset;
let arscMethod = -1;
for (let i = 0; i < uTotal; i++) {
  const method = unsignedBuf.readUInt16LE(uCur + 10);
  const fnLen = unsignedBuf.readUInt16LE(uCur + 28);
  const extraLen = unsignedBuf.readUInt16LE(uCur + 30);
  const commentLen = unsignedBuf.readUInt16LE(uCur + 32);
  const name = unsignedBuf.slice(uCur + 46, uCur + 46 + fnLen).toString('utf8');
  if (name === 'resources.arsc') {
    arscMethod = method;
  }
  uCur += 46 + fnLen + extraLen + commentLen;
}
if (arscMethod !== 0) {
  throw new Error(`CRITICAL: resources.arsc method is ${arscMethod}, expected 0 (STORED)!`);
}
console.log('CONFIRMED: resources.arsc is STORED (method 0)');

console.log('=== Step 5: Sign & 4-byte zipalign with uber-apk-signer ===');
const uberOut = execSync(`& "${javaExe}" -jar uber-apk-signer.jar -a unsigned.apk --ks parcelflow-release.jks --ksAlias parcelflow --ksPass parcelflow123 --ksKeyPass parcelflow123 -o uber_out --verbose`, {
  shell: 'powershell'
}).toString();
console.log(uberOut);

const finalApkPath = 'uber_out/unsigned-aligned-signed.apk';
if (!fs.existsSync(finalApkPath)) {
  throw new Error('Final APK was not generated!');
}

console.log('=== Step 6: Verify final APK alignment & signatures ===');
const finalBuf = fs.readFileSync(finalApkPath);
let sEocd = finalBuf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const sCdOffset = finalBuf.readUInt32LE(sEocd + 16);
const sTotal = finalBuf.readUInt16LE(sEocd + 10);
let sCur = sCdOffset;
let arscAligned = false;
for (let i = 0; i < sTotal; i++) {
  const method = finalBuf.readUInt16LE(sCur + 10);
  const fnLen = finalBuf.readUInt16LE(sCur + 28);
  const extraLen = finalBuf.readUInt16LE(sCur + 30);
  const commentLen = finalBuf.readUInt16LE(sCur + 32);
  const localOffset = finalBuf.readUInt32LE(sCur + 42);
  const name = finalBuf.slice(sCur + 46, sCur + 46 + fnLen).toString('utf8');

  const localExtraLen = finalBuf.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + fnLen + localExtraLen;
  const isAligned4 = (dataOffset % 4 === 0);

  if (name === 'resources.arsc') {
    arscAligned = isAligned4 && (method === 0);
    console.log(`[VERIFIED] ${name}: method=${method} (${method === 0 ? 'STORED' : 'DEFLATED'}), dataOffset=${dataOffset}, 4-byte-aligned=${isAligned4}`);
  }
  sCur += 46 + fnLen + extraLen + commentLen;
}

if (!arscAligned) {
  throw new Error('CRITICAL: resources.arsc failed alignment or storage check!');
}

console.log('=== Step 7: Distribute final production APK ===');
const destinations = [
  'public/downloads/android/ParcelFlow.apk',
  'public/downloads/ParcelFlow.apk',
  'downloads/android/ParcelFlow.apk',
  'C:\\Users\\Vinay\\Downloads\\ParcelFlow.apk'
];

for (const dest of destinations) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(finalApkPath, dest);
  console.log(`Copied to ${dest} (${fs.statSync(dest).size} bytes)`);
}

// Clean up temp
if (fs.existsSync('unsigned.apk')) fs.unlinkSync('unsigned.apk');
if (fs.existsSync('uber_out')) fs.rmSync('uber_out', { recursive: true, force: true });

console.log('SUCCESS: Production ParcelFlow APK is ready, verified, and distributed!');
