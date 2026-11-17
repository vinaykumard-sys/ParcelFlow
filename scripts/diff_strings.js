import fs from 'fs';

const buf = fs.readFileSync('classes.dex');

const stringIdsSize = buf.readUInt32LE(0x38);
const stringIdsOff = buf.readUInt32LE(0x3c);
const strings = [];
for (let i = 0; i < stringIdsSize; i++) {
  const off = buf.readUInt32LE(stringIdsOff + i * 4);
  let pos = off;
  while (buf[pos] & 0x80) pos++;
  pos++;
  let end = pos;
  while (buf[end] !== 0) end++;
  strings.push(buf.toString('utf8', pos, end));
}

const typeIdsSize = buf.readUInt32LE(0x40);
const typeIdsOff = buf.readUInt32LE(0x44);
const types = [];
for (let i = 0; i < typeIdsSize; i++) {
  const descIdx = buf.readUInt32LE(typeIdsOff + i * 4);
  types.push(strings[descIdx]);
}

const methodIdsSize = buf.readUInt32LE(0x58);
const methodIdsOff = buf.readUInt32LE(0x5c);
const methods = [];
for (let i = 0; i < methodIdsSize; i++) {
  const classIdx = buf.readUInt16LE(methodIdsOff + i * 8);
  const protoIdx = buf.readUInt16LE(methodIdsOff + i * 8 + 2);
  const nameIdx = buf.readUInt32LE(methodIdsOff + i * 8 + 4);
  methods.push({ class: types[classIdx], name: strings[nameIdx] });
}

function readUleb128(b, p) {
  let result = 0;
  let shift = 0;
  while (true) {
    const byte = b[p++];
    result |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) break;
    shift += 7;
  }
  return [result, p];
}

const classDefsOff = buf.readUInt32LE(0x64);
const c4Off = classDefsOff + 4 * 32;
const classDataOff = buf.readUInt32LE(c4Off + 24);

let p = classDataOff;
let staticFieldsSize, instanceFieldsSize, directMethodsSize, virtualMethodsSize;
[staticFieldsSize, p] = readUleb128(buf, p);
[instanceFieldsSize, p] = readUleb128(buf, p);
[directMethodsSize, p] = readUleb128(buf, p);
[virtualMethodsSize, p] = readUleb128(buf, p);

for (let i = 0; i < staticFieldsSize; i++) {
  let diff, flags;
  [diff, p] = readUleb128(buf, p);
  [flags, p] = readUleb128(buf, p);
}
for (let i = 0; i < instanceFieldsSize; i++) {
  let diff, flags;
  [diff, p] = readUleb128(buf, p);
  [flags, p] = readUleb128(buf, p);
}

let methodIdx = 0;
const allMethods = [];
for (let i = 0; i < directMethodsSize; i++) {
  let diff, flags, codeOff;
  [diff, p] = readUleb128(buf, p);
  [flags, p] = readUleb128(buf, p);
  [codeOff, p] = readUleb128(buf, p);
  methodIdx += diff;
  allMethods.push({ idx: methodIdx, name: methods[methodIdx]?.name || 'unknown', codeOff });
}
methodIdx = 0;
for (let i = 0; i < virtualMethodsSize; i++) {
  let diff, flags, codeOff;
  [diff, p] = readUleb128(buf, p);
  [flags, p] = readUleb128(buf, p);
  [codeOff, p] = readUleb128(buf, p);
  methodIdx += diff;
  allMethods.push({ idx: methodIdx, name: methods[methodIdx]?.name || 'unknown', codeOff });
}

// Compare string table of HeatShield classes.dex vs ParcelFlow classes.dex!
const origApk = 'C:\\Users\\Vinay\\Downloads\\HeatShield-AI-v1.0.0.apk';
import { execSync } from 'child_process';
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
execSync(`& "${jarExe}" xf "${origApk}" classes.dex`, { cwd: 'scripts', shell: 'powershell' });
const origBuf = fs.readFileSync('scripts/classes.dex');
fs.unlinkSync('scripts/classes.dex');

const origStringIdsSize = origBuf.readUInt32LE(0x38);
const origStringIdsOff = origBuf.readUInt32LE(0x3c);
const origStrings = [];
for (let i = 0; i < origStringIdsSize; i++) {
  const off = origBuf.readUInt32LE(origStringIdsOff + i * 4);
  let pos = off;
  while (origBuf[pos] & 0x80) pos++;
  pos++;
  let end = pos;
  while (origBuf[end] !== 0) end++;
  origStrings.push(origBuf.toString('utf8', pos, end));
}

console.log(`Original string count: ${origStrings.length}, Current string count: ${strings.length}`);
for (let i = 0; i < Math.min(origStrings.length, strings.length); i++) {
  if (origStrings[i] !== strings[i]) {
    console.log(`String mismatch at [${i}]:`);
    console.log(`  ORIG: "${origStrings[i]}"`);
    console.log(`  CURR: "${strings[i]}"`);
  }
}
