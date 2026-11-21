import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parseAxml, patchManifestAxml } from '@iyexin/mio-android-tools';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const javaExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\java.exe';
const baseApk = 'public/downloads/android/ParcelFlow.apk';

console.log('====================================================');
console.log('ParcelFlow v1.4.0 (versionCode 7) APK Build Script');
console.log('====================================================\n');

// Step 1: Clean temporary build directories
console.log('=== Step 1: Cleaning temporary build directories ===');
if (fs.existsSync('unsigned.apk')) {
  fs.unlinkSync('unsigned.apk');
  console.log('Removed unsigned.apk');
}
if (fs.existsSync('uber_out')) {
  fs.rmSync('uber_out', { recursive: true, force: true });
  console.log('Removed uber_out directory');
}
if (fs.existsSync('apk_temp')) {
  fs.rmSync('apk_temp', { recursive: true, force: true });
  console.log('Removed old apk_temp directory');
}
fs.mkdirSync('apk_temp', { recursive: true });

// Step 2: Unpack base APK into apk_temp
console.log('\n=== Step 2: Unpacking base APK into apk_temp ===');
if (!fs.existsSync(baseApk)) {
  throw new Error(`Base APK not found at ${baseApk}!`);
}
console.log(`Unpacking from ${baseApk}...`);
execSync(`& "${jarExe}" xf ..\\${baseApk.replace(/\//g, '\\')}`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});
console.log('Unpack complete.');

// Step 3: Remove old META-INF
console.log('\n=== Step 3: Removing old META-INF signatures ===');
if (fs.existsSync('apk_temp/META-INF')) {
  fs.rmSync('apk_temp/META-INF', { recursive: true, force: true });
  console.log('Removed apk_temp/META-INF');
}

// Step 4: Patch AndroidManifest.xml
console.log('\n=== Step 4: Patching AndroidManifest.xml ===');
const manifestPath = 'apk_temp/AndroidManifest.xml';
let manifestBuf = fs.readFileSync(manifestPath);

console.log('Patching manifest with packageName=in.parcelflow.app, versionCode=7, versionName=1.4.0...');
manifestBuf = patchManifestAxml(manifestBuf, {
  packageName: 'in.parcelflow.app',
  versionCode: 7,
  versionName: '1.4.0',
});

// Verify patched manifest
const parsedDoc = parseAxml(manifestBuf);
const manifestElem = parsedDoc.elements.find(e => e.name === 'manifest');
const pkgAttr = manifestElem.attributes.find(a => parsedDoc.strings[a.name] === 'package');
const vCodeAttr = manifestElem.attributes.find(a => parsedDoc.strings[a.name] === 'versionCode');
const vNameAttr = manifestElem.attributes.find(a => parsedDoc.strings[a.name] === 'versionName');
const pkgVal = parsedDoc.strings[pkgAttr.rawValue !== 0xffffffff ? pkgAttr.rawValue : pkgAttr.data];
const vCodeVal = vCodeAttr.data;
const vNameVal = parsedDoc.strings[vNameAttr.rawValue !== 0xffffffff ? vNameAttr.rawValue : vNameAttr.data];

console.log(`Verified package: ${pkgVal}`);
console.log(`Verified versionCode: ${vCodeVal}`);
console.log(`Verified versionName: ${vNameVal}`);

if (pkgVal !== 'in.parcelflow.app') {
  throw new Error(`Package name mismatch: ${pkgVal} !== in.parcelflow.app`);
}
if (vCodeVal !== 7) {
  throw new Error(`versionCode mismatch: ${vCodeVal} !== 7`);
}
if (vNameVal !== '1.4.0') {
  throw new Error(`versionName mismatch: ${vNameVal} !== 1.4.0`);
}

fs.writeFileSync(manifestPath, manifestBuf);
console.log('AndroidManifest.xml written successfully.');

// Step 5: Update apk_temp/assets/www/ with latest build from dist/
console.log('\n=== Step 5: Updating apk_temp/assets/www/ from dist/ ===');
if (!fs.existsSync('dist/index.html')) {
  console.log('Building dist/ with npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const targetWww = 'apk_temp/assets/www';
if (fs.existsSync(targetWww)) {
  fs.rmSync(targetWww, { recursive: true, force: true });
}
fs.mkdirSync(targetWww, { recursive: true });
copyDirRecursive('dist', targetWww);
console.log(`Updated ${targetWww} from dist/ with ${fs.readdirSync(targetWww).length} items.`);

// Step 6: Pack unsigned APK with jar.exe
console.log('\n=== Step 6: Packing unsigned APK with jar.exe ===');
execSync(`& "${jarExe}" -c -M -f ..\\unsigned.apk .`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});
console.log('Packed unsigned.apk successfully.');

// Step 7: Update resources.arsc to uncompressed STORED (method 0)
console.log('\n=== Step 7: Updating resources.arsc to uncompressed STORED (method 0) ===');
execSync(`& "${jarExe}" -u -0 -M -f ..\\unsigned.apk resources.arsc`, {
  cwd: 'apk_temp',
  shell: 'powershell'
});

// Verify resources.arsc in unsigned.apk
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
  const name = unsignedBuf.subarray(uCur + 46, uCur + 46 + fnLen).toString('utf8');
  if (name === 'resources.arsc') {
    arscMethod = method;
  }
  uCur += 46 + fnLen + extraLen + commentLen;
}
if (arscMethod !== 0) {
  throw new Error(`CRITICAL: resources.arsc method is ${arscMethod}, expected 0 (STORED)!`);
}
console.log('CONFIRMED: resources.arsc is STORED (method 0)');

// Step 8: Sign & 4-byte zipalign with uber-apk-signer
console.log('\n=== Step 8: Signing and 4-byte zipaligning with uber-apk-signer ===');
const uberCmd = `& "${javaExe}" -jar uber-apk-signer.jar -a unsigned.apk --ks parcelflow-release.jks --ksAlias parcelflow --ksPass parcelflow123 --ksKeyPass parcelflow123 -o uber_out --verbose`;
const uberOut = execSync(uberCmd, { shell: 'powershell' }).toString();
console.log(uberOut.trim());

const finalApkPath = 'uber_out/unsigned-aligned-signed.apk';
if (!fs.existsSync(finalApkPath)) {
  throw new Error('Final APK was not generated in uber_out!');
}

// Step 9: Verify 4-byte alignment of resources.arsc and all .so / DEX files
console.log('\n=== Step 9: Verifying 4-byte alignment and entries ===');
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
  const name = finalBuf.subarray(sCur + 46, sCur + 46 + fnLen).toString('utf8');

  const localExtraLen = finalBuf.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + fnLen + localExtraLen;
  const isAligned4 = (dataOffset % 4 === 0);

  if (name === 'resources.arsc') {
    arscAligned = isAligned4 && (method === 0);
    console.log(`[VERIFIED] ${name}: method=${method} (${method === 0 ? 'STORED' : 'DEFLATED'}), dataOffset=${dataOffset}, 4-byte-aligned=${isAligned4}`);
  }
  if (name.endsWith('.so') || name.endsWith('.dex')) {
    console.log(`[VERIFIED] ${name}: method=${method}, dataOffset=${dataOffset}, 4-byte-aligned=${isAligned4}`);
    if (!isAligned4) {
      throw new Error(`CRITICAL: ${name} is NOT 4-byte aligned!`);
    }
  }
  sCur += 46 + fnLen + extraLen + commentLen;
}

if (!arscAligned) {
  throw new Error('CRITICAL: resources.arsc failed 4-byte alignment or STORED method check!');
}

// Step 10: Compute SHA-256 and byte size
console.log('\n=== Step 10: Computing SHA-256 and file size ===');
const finalApkBytes = fs.readFileSync(finalApkPath);
const finalApkSize = finalApkBytes.length;
const finalApkSha256 = crypto.createHash('sha256').update(finalApkBytes).digest('hex');
console.log(`Final APK Size: ${finalApkSize} bytes (${(finalApkSize / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`Final APK SHA-256: ${finalApkSha256}`);

// Step 11: Save final APK to destinations
console.log('\n=== Step 11: Distributing final production APK ===');
const destinations = [
  'public/downloads/android/ParcelFlow-v1.4.0-update.apk',
  'public/downloads/ParcelFlow-v1.4.0-update.apk',
  'public/downloads/android/ParcelFlow.apk',
  'public/downloads/ParcelFlow.apk',
  'downloads/android/ParcelFlow-v1.4.0-update.apk',
  'downloads/android/ParcelFlow.apk',
  'C:\\Users\\Vinay\\Downloads\\ParcelFlow.apk'
];

for (const dest of destinations) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(finalApkPath, dest);
  console.log(`Copied to ${dest} (${fs.statSync(dest).size} bytes)`);
}

// Step 12: Update public/api/app-update/android.json
console.log('\n=== Step 12: Updating public/api/app-update/android.json ===');
const updateJsonPath = path.resolve('public/api/app-update/android.json');
let updateConfig = {};
if (fs.existsSync(updateJsonPath)) {
  try {
    updateConfig = JSON.parse(fs.readFileSync(updateJsonPath, 'utf8'));
  } catch (e) {
    console.warn('Could not parse existing update json, recreating.');
  }
}

updateConfig.latestVersionName = '1.4.0';
updateConfig.latestVersionCode = 7;
updateConfig.minimumSupportedVersionCode = 4;
updateConfig.apkUrl = '/downloads/android/ParcelFlow-v1.4.0-update.apk';
updateConfig.apkSizeBytes = finalApkSize;
updateConfig.sha256 = finalApkSha256;
updateConfig.releaseDate = '2026-11-21';

fs.writeFileSync(updateJsonPath, JSON.stringify(updateConfig, null, 2));
console.log('Updated public/api/app-update/android.json successfully:');
console.log(JSON.stringify(updateConfig, null, 2));

// Step 13: Clean up temporary files
console.log('\n=== Step 13: Cleaning up temporary build artifacts ===');
if (fs.existsSync('unsigned.apk')) fs.unlinkSync('unsigned.apk');
if (fs.existsSync('uber_out')) fs.rmSync('uber_out', { recursive: true, force: true });
if (fs.existsSync('apk_temp')) fs.rmSync('apk_temp', { recursive: true, force: true });

console.log('\n====================================================');
console.log('SUCCESS: Production ParcelFlow v1.4.0 APK Built!');
console.log('====================================================');
console.log(`Version: 1.4.0 (versionCode 7)`);
console.log(`Package: in.parcelflow.app`);
console.log(`Size: ${finalApkSize} bytes`);
console.log(`SHA-256: ${finalApkSha256}`);
console.log(`Primary APK URL: /downloads/android/ParcelFlow-v1.4.0-update.apk`);
console.log(`Fallback APK URL: /downloads/android/ParcelFlow.apk`);
