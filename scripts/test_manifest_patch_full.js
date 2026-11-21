import { parseAxml, patchManifestAxml } from '@iyexin/mio-android-tools';
import fs from 'fs';
import { execSync } from 'child_process';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
if (!fs.existsSync('test_manifest')) fs.mkdirSync('test_manifest');
execSync(`& "${jarExe}" xf ..\\public\\downloads\\android\\ParcelFlow.apk AndroidManifest.xml`, { cwd: 'test_manifest', shell: 'powershell' });

const manifestPath = 'test_manifest/AndroidManifest.xml';
let manifestBuf = fs.readFileSync(manifestPath);

// 1. Patch manifest version code, name, and package
manifestBuf = patchManifestAxml(manifestBuf, {
  packageName: 'in.parcelflow.app',
  versionCode: 5,
  versionName: '1.2.0',
});

// 2. Replace VIBRATE permission with REQUEST_INSTALL_PACKAGES
const RES_STRING_POOL_TYPE = 0x0001;

function findStringPool(buffer) {
  let offset = buffer.readUInt16LE(2);
  while (offset + 8 <= buffer.length) {
    const type = buffer.readUInt16LE(offset);
    const size = buffer.readUInt32LE(offset + 4);
    if (type === RES_STRING_POOL_TYPE) {
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

function encodeString(value, utf8) {
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

function rebuildStringPool(original, newStrings) {
  const pool = findStringPool(original);
  const utf8 = (pool.flags & 0x100) !== 0;
  const encoded = [];
  const offsets = [];
  let dataLength = 0;
  for (const value of newStrings) {
    offsets.push(dataLength);
    const item = encodeString(value, utf8);
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
  chunk.writeUInt16LE(RES_STRING_POOL_TYPE, 0);
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
  manifestBuf = rebuildStringPool(manifestBuf, doc.strings);
  console.log('Successfully injected android.permission.REQUEST_INSTALL_PACKAGES into manifest!');
}

// 3. Ensure MainActivity class name points to com.heatshield.ai.MainActivity
const searchStr = 'in.parcelflow.app.MainActivity';
const replaceStr = 'com.heatshield.ai.MainActivity';
const sBuf = Buffer.from(searchStr, 'utf16le');
const rBuf = Buffer.from(replaceStr, 'utf16le');

let mIdx = manifestBuf.indexOf(sBuf);
if (mIdx !== -1) {
  rBuf.copy(manifestBuf, mIdx);
  console.log(`Replaced activity name to "${replaceStr}" in AndroidManifest.xml at 0x${mIdx.toString(16)}`);
} else {
  console.log('Activity name already com.heatshield.ai.MainActivity');
}

fs.writeFileSync(manifestPath, manifestBuf);

// Verify with parseAxml
const verifiedDoc = parseAxml(manifestBuf);
const manifestElem = verifiedDoc.elements.find(e => e.name === 'manifest');
const vCodeAttr = manifestElem.attributes.find(a => verifiedDoc.strings[a.name] === 'versionCode');
const vNameAttr = manifestElem.attributes.find(a => verifiedDoc.strings[a.name] === 'versionName');
console.log('Verified versionCode:', vCodeAttr.data);
console.log('Verified versionName:', verifiedDoc.strings[vNameAttr.rawValue !== 0xffffffff ? vNameAttr.rawValue : vNameAttr.data]);
console.log('Verified permissions:', verifiedDoc.elements.filter(e => e.name === 'uses-permission').map(p => {
  const a = p.attributes.find(attr => verifiedDoc.strings[attr.name] === 'name');
  return verifiedDoc.strings[a.rawValue !== 0xffffffff ? a.rawValue : a.data];
}));
