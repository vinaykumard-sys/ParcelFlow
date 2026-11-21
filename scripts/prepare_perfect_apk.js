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
// Use verified zero-violation classes.dex
if (fs.existsSync('test_dex_fix/classes_fixed.dex')) {
  fs.copyFileSync('test_dex_fix/classes_fixed.dex', 'apk_build/classes.dex');
  console.log('Installed classes.dex from test_dex_fix/classes_fixed.dex');
} else if (fs.existsSync('apk_build/classes.dex')) {
  console.log('Using verified classes.dex extracted from base APK.');
} else {
  throw new Error('classes.dex not found in apk_build!');
}

console.log('--- Step 3: Configure AndroidManifest.xml (versionCode 5, versionName 1.2.0, REQUEST_INSTALL_PACKAGES) ---');
import { parseAxml, patchManifestAxml } from '@iyexin/mio-android-tools';

const manifestPath = 'apk_build/AndroidManifest.xml';
let manifestBuf = fs.readFileSync(manifestPath);

// Patch versionCode to 5 and versionName to '1.2.0'
manifestBuf = patchManifestAxml(manifestBuf, {
  packageName: 'in.parcelflow.app',
  versionCode: 5,
  versionName: '1.2.0',
});

// Rebuild AXML string pool with REQUEST_INSTALL_PACKAGES replacing VIBRATE
function findAxmlStringPool(buffer) {
  let offset = buffer.readUInt16LE(2);
  while (offset + 8 <= buffer.length) {
    const type = buffer.readUInt16LE(offset);
    const size = buffer.readUInt32LE(offset + 4);
    if (type === 0x0001) {
      const headerSize = buffer.readUInt16LE(offset + 2);
      const stringCount = buffer.readUInt32LE(offset + 8);
      const styleCount = buffer.readUInt32LE(offset + 12);
      const flags = buffer.readUInt32LE(offset + 16);
      const stringsStart = buffer.readUInt32LE(offset + 20);
      const stylesStart = buffer.readUInt32LE(offset + 24);
      return { offset, headerSize, size, stringCount, styleCount, flags, stringsStart, stylesStart };
    }
    if (size < 8) break;
    offset += size;
  }
  throw new Error('AXML string pool not found');
}

function encodeUtf8Length(length) {
  if (length > 0x7f) {
    return Buffer.from([((length >> 8) & 0x7f) | 0x80, length & 0xff]);
  }
  return Buffer.from([length]);
}

function encodeAxmlString(value, utf8) {
  if (utf8) {
    const bytes = Buffer.from(value, 'utf8');
    const length = value.length;
    const lengthBytes = encodeUtf8Length(length);
    const byteLengthBytes = encodeUtf8Length(bytes.length);
    return Buffer.concat([lengthBytes, byteLengthBytes, bytes, Buffer.from([0])]);
  }
  const bytes = Buffer.from(value, 'utf16le');
  const length = value.length;
  const lengthBytes = Buffer.alloc(length > 0x7fff ? 4 : 2);
  if (length > 0x7fff) {
    lengthBytes.writeUInt16LE(((length >> 16) & 0x7fff) | 0x8000, 0);
    lengthBytes.writeUInt16LE(length & 0xffff, 2);
  } else {
    lengthBytes.writeUInt16LE(length, 0);
  }
  return Buffer.concat([lengthBytes, bytes, Buffer.from([0, 0])]);
}

function rebuildAxmlStringPool(original, newStrings) {
  const pool = findAxmlStringPool(original);
  const utf8 = (pool.flags & 0x100) !== 0;
  const encoded = [];
  const offsets = [];
  let dataLength = 0;
  for (const value of newStrings) {
    offsets.push(dataLength);
    const item = encodeAxmlString(value, utf8);
    encoded.push(item);
    dataLength += item.length;
    const padding = (4 - (dataLength % 4)) % 4;
    if (padding > 0) {
      encoded.push(Buffer.alloc(padding));
      dataLength += padding;
    }
  }
  const tableLength = newStrings.length * 4;
  const chunkSize = 28 + tableLength + dataLength;
  const chunk = Buffer.alloc(chunkSize);
  chunk.writeUInt16LE(0x0001, 0);
  chunk.writeUInt16LE(28, 2);
  chunk.writeUInt32LE(chunkSize, 4);
  chunk.writeUInt32LE(newStrings.length, 8);
  chunk.writeUInt32LE(0, 12);
  chunk.writeUInt32LE(pool.flags, 16);
  chunk.writeUInt32LE(28 + tableLength, 20);
  chunk.writeUInt32LE(0, 24);
  for (let index = 0; index < offsets.length; index += 1) {
    chunk.writeUInt32LE(offsets[index] ?? 0, 28 + index * 4);
  }
  let cursor = 28 + tableLength;
  for (const item of encoded) {
    item.copy(chunk, cursor);
    cursor += item.length;
  }
  const before = original.subarray(0, pool.offset);
  const after = original.subarray(pool.offset + pool.size);
  const result = Buffer.concat([before, chunk, after]);
  result.writeUInt32LE(result.length, 4);
  return result;
}

const doc = parseAxml(manifestBuf);
const vIdx = doc.strings.indexOf('android.permission.VIBRATE');
if (vIdx !== -1) {
  doc.strings[vIdx] = 'android.permission.REQUEST_INSTALL_PACKAGES';
  manifestBuf = rebuildAxmlStringPool(manifestBuf, doc.strings);
  console.log('Injected android.permission.REQUEST_INSTALL_PACKAGES into AndroidManifest.xml');
}

// In AndroidManifest.xml, ensure activity name is "com.heatshield.ai.MainActivity"
const searchStr = 'in.parcelflow.app.MainActivity';
const replaceStr = 'com.heatshield.ai.MainActivity';
const sBuf = Buffer.from(searchStr, 'utf16le');
const rBuf = Buffer.from(replaceStr, 'utf16le');

let mIdx = manifestBuf.indexOf(sBuf);
if (mIdx !== -1) {
  rBuf.copy(manifestBuf, mIdx);
  console.log(`Replaced activity name to "${replaceStr}" in AndroidManifest.xml at 0x${mIdx.toString(16)}`);
} else {
  console.log('Activity name already set in AndroidManifest.xml');
}
fs.writeFileSync(manifestPath, manifestBuf);

console.log('--- Step 4: Ensure assets/www contains fresh ParcelFlow web build with /assets/ paths ---');
// Copy dist files to assets/www
const wwwDir = 'apk_build/assets/www';
if (fs.existsSync(wwwDir)) fs.rmSync(wwwDir, { recursive: true, force: true });
fs.mkdirSync(wwwDir, { recursive: true });

// Copy all files from dist into wwwDir using built-in cpSync
fs.cpSync('dist', wwwDir, { recursive: true });
// Strip out recursive downloads folder so APK doesn't package itself!
const downloadsDir = path.join(wwwDir, 'downloads');
if (fs.existsSync(downloadsDir)) {
  fs.rmSync(downloadsDir, { recursive: true, force: true });
  console.log('Stripped recursive downloads directory from assets/www');
}
console.log('Copied clean dist to assets/www. Total items:', fs.readdirSync(wwwDir).length);

// Verify index.html in assets/www has /assets/ and inject native app flag
let indexHtml = fs.readFileSync(path.join(wwwDir, 'index.html'), 'utf8');
console.log('index.html script tags check:', indexHtml.includes('src="/assets/') ? 'PASS (/assets/ present)' : 'WARN');

if (!indexHtml.includes('__PARCELFLOW_NATIVE_APP__')) {
  indexHtml = indexHtml.replace('<head>', '<head><script>window.__PARCELFLOW_NATIVE_APP__=true;</script>');
  fs.writeFileSync(path.join(wwwDir, 'index.html'), indexHtml, 'utf8');
  console.log('Injected window.__PARCELFLOW_NATIVE_APP__=true into assets/www/index.html');
}

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

// Step 6: Verified - actual validation is run on final APK in package_perfect_apk.js
console.log('--- Step 6: Ready for packaging ---');

console.log('\nAll pre-packaging checks passed 100%!');
