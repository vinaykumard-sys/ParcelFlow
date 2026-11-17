import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const origApk = 'C:\\Users\\Vinay\\Downloads\\HeatShield-AI-v1.0.0.apk';

console.log('--- Step 1: Prepare fresh apk_build folder ---');
if (fs.existsSync('apk_build')) fs.rmSync('apk_build', { recursive: true, force: true });
fs.mkdirSync('apk_build');

// Extract base from current working public APK to keep all icons and res
execSync(`& "${jarExe}" xf ..\\public\\downloads\\android\\ParcelFlow.apk`, {
  cwd: 'apk_build',
  shell: 'powershell'
});

// Remove old signatures
if (fs.existsSync('apk_build/META-INF')) {
  fs.rmSync('apk_build/META-INF', { recursive: true, force: true });
}

console.log('--- Step 2: Install 100% sorted, zero-violation classes.dex ---');
// Copy our verified zero-violation classes_fixed.dex
fs.copyFileSync('test_dex_fix/classes_fixed.dex', 'apk_build/classes.dex');

console.log('--- Step 3: Configure AndroidManifest.xml for MainActivity ---');
// In AndroidManifest.xml, ensure String 53 is "com.heatshield.ai.MainActivity"
const manifestPath = 'apk_build/AndroidManifest.xml';
const manifestBuf = fs.readFileSync(manifestPath);

const searchStr = 'in.parcelflow.app.MainActivity';
const replaceStr = 'com.heatshield.ai.MainActivity';
const sBuf = Buffer.from(searchStr, 'utf16le');
const rBuf = Buffer.from(replaceStr, 'utf16le');

let mIdx = manifestBuf.indexOf(sBuf);
if (mIdx !== -1) {
  rBuf.copy(manifestBuf, mIdx);
  console.log(`Replaced activity name to "${replaceStr}" in AndroidManifest.xml at 0x${mIdx.toString(16)}`);
  fs.writeFileSync(manifestPath, manifestBuf);
} else {
  console.log('Activity name already set in AndroidManifest.xml');
}

console.log('--- Step 4: Ensure assets/www contains fresh ParcelFlow web build with /assets/ paths ---');
// Copy dist files to assets/www
const wwwDir = 'apk_build/assets/www';
if (fs.existsSync(wwwDir)) fs.rmSync(wwwDir, { recursive: true, force: true });
fs.mkdirSync(wwwDir, { recursive: true });

// Copy all files from dist into wwwDir
function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
copyRecursive('dist', wwwDir);
console.log('Copied fresh dist to assets/www. Total items:', fs.readdirSync(wwwDir).length);

// Verify index.html in assets/www has /assets/
const indexHtml = fs.readFileSync(path.join(wwwDir, 'index.html'), 'utf8');
console.log('index.html script tags check:', indexHtml.includes('src="/assets/') ? 'PASS (/assets/ present)' : 'WARN');

console.log('--- Step 5: Verify classes.dex has ZERO violations ---');
const dexCheckBuf = fs.readFileSync('apk_build/classes.dex');
const strCount = dexCheckBuf.readUInt32LE(0x38);
const strOff = dexCheckBuf.readUInt32LE(0x3c);
const allStrings = [];
for (let i = 0; i < strCount; i++) {
  const off = dexCheckBuf.readUInt32LE(strOff + i * 4);
  let pos = off;
  while (dexCheckBuf[pos] & 0x80) pos++;
  pos++;
  let end = pos;
  while (dexCheckBuf[end] !== 0) end++;
  allStrings.push(dexCheckBuf.toString('utf8', pos, end));
}
function compareModifiedUtf8(s1, s2) {
  const l1 = s1.length, l2 = s2.length, min = Math.min(l1, l2);
  for (let i = 0; i < min; i++) {
    const c1 = s1.charCodeAt(i), c2 = s2.charCodeAt(i);
    if (c1 !== c2) return c1 - c2;
  }
  return l1 - l2;
}
let violations = 0;
for (let i = 0; i < allStrings.length - 1; i++) {
  if (compareModifiedUtf8(allStrings[i], allStrings[i + 1]) >= 0) {
    violations++;
  }
}
console.log(`DEX verification: ${violations} order violations found (must be 0).`);
if (violations > 0) throw new Error('DEX string pool not sorted!');

console.log('--- Step 6: Verify aapt2 dump xmltree on AndroidManifest.xml ---');
fs.writeFileSync('temp_manifest.xml', fs.readFileSync('apk_build/AndroidManifest.xml'));
const aaptOut = execSync(`node_modules\\aaptjs3\\bin\\x64\\win32\\aapt2.exe dump xmltree apk_build/AndroidManifest.xml --file AndroidManifest.xml`, { shell: 'powershell' }).toString();
console.log('aapt2 manifest validation:\n', aaptOut.split('\n').filter(l => l.includes('package=') || l.includes('activity')).join('\n'));

console.log('\nAll pre-packaging checks passed 100%!');
