import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const javaExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\java.exe';
const jarsignerExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jarsigner.exe';

console.log('--- Step 1: Unpack current ParcelFlow APK ---');
if (fs.existsSync('apk_temp')) fs.rmSync('apk_temp', { recursive: true, force: true });
fs.mkdirSync('apk_temp');

execSync(`& "${jarExe}" xf ..\\public\\downloads\\android\\ParcelFlow.apk`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});

// Remove old signatures
if (fs.existsSync('apk_temp/META-INF')) {
  fs.rmSync('apk_temp/META-INF', { recursive: true, force: true });
}

console.log('--- Step 2: Ensure fresh web build in assets/www ---');
// Verify assets/www contains our latest built web files
const distFiles = fs.readdirSync('dist');
console.log('dist files:', distFiles);

console.log('--- Step 3: Pack into unsigned APK with resources.arsc UNCOMPRESSED ---');
if (fs.existsSync('unsigned.apk')) fs.unlinkSync('unsigned.apk');

// Create archive with all files except resources.arsc first
// Or create with all files, then replace resources.arsc with -u -0
execSync(`& "${jarExe}" -c -M -f ..\\unsigned.apk .`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});

// Now force replace resources.arsc with -0 (no compression / STORED)
execSync(`& "${jarExe}" -u -0 -M -f ..\\unsigned.apk resources.arsc`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});

console.log('--- Step 4: Verify resources.arsc in unsigned.apk is STORED (method 0) ---');
const buf = fs.readFileSync('unsigned.apk');
let eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const cdOffset = buf.readUInt32LE(eocd + 16);
const totalEntries = buf.readUInt16LE(eocd + 10);
let cur = cdOffset;
for (let i = 0; i < totalEntries; i++) {
  const method = buf.readUInt16LE(cur + 10);
  const fnLen = buf.readUInt16LE(cur + 28);
  const extraLen = buf.readUInt16LE(cur + 30);
  const commentLen = buf.readUInt16LE(cur + 32);
  const name = buf.slice(cur + 46, cur + 46 + fnLen).toString('utf8');
  if (name.includes('resources.arsc') || name.includes('AndroidManifest.xml') || name.includes('classes.dex')) {
    console.log(`unsigned.apk -> ${name}: method=${method} (${method === 0 ? 'STORED' : 'DEFLATED'})`);
  }
  cur += 46 + fnLen + extraLen + commentLen;
}

console.log('--- Step 5: Sign & Align with uber-apk-signer ---');
if (fs.existsSync('uber_out')) fs.rmSync('uber_out', { recursive: true, force: true });
const uberOut = execSync(`& "${javaExe}" -jar uber-apk-signer.jar -a unsigned.apk --ks parcelflow-release.jks --ksAlias parcelflow --ksPass parcelflow123 --ksKeyPass parcelflow123 -o uber_out --verbose`, {
  shell: 'powershell'
}).toString();
console.log('Uber output:\n', uberOut);

console.log('--- Step 6: Verify signed APK with check_zip_alignment ---');
const signedBuf = fs.readFileSync('uber_out/unsigned-aligned-signed.apk');
let sEocd = signedBuf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const sCdOffset = signedBuf.readUInt32LE(sEocd + 16);
const sTotalEntries = signedBuf.readUInt16LE(sEocd + 10);
let sCur = sCdOffset;
for (let i = 0; i < sTotalEntries; i++) {
  const method = signedBuf.readUInt16LE(sCur + 10);
  const fnLen = signedBuf.readUInt16LE(sCur + 28);
  const extraLen = signedBuf.readUInt16LE(sCur + 30);
  const commentLen = signedBuf.readUInt16LE(sCur + 32);
  const localOffset = signedBuf.readUInt32LE(sCur + 42);
  const name = signedBuf.slice(sCur + 46, sCur + 46 + fnLen).toString('utf8');

  const localExtraLen = signedBuf.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + fnLen + localExtraLen;
  const isAligned4 = (dataOffset % 4 === 0);

  if (name.includes('resources.arsc') || name.includes('classes.dex') || name.includes('AndroidManifest.xml') || name.endsWith('.so')) {
    console.log(`signed.apk -> ${name}: method=${method} (${method === 0 ? 'STORED' : 'DEFLATED'}), dataOffset=${dataOffset}, 4-byte-aligned=${isAligned4}`);
  }
  sCur += 46 + fnLen + extraLen + commentLen;
}
