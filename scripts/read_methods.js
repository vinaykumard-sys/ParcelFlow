import fs from 'fs';

const buf = fs.readFileSync('classes.dex');

// Read string pool
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

// Read method ids
const methodIdsSize = buf.readUInt32LE(0x58);
const methodIdsOff = buf.readUInt32LE(0x5c);
const methods = [];
for (let i = 0; i < methodIdsSize; i++) {
  const nameIdx = buf.readUInt32LE(methodIdsOff + i * 8 + 4);
  methods.push(strings[nameIdx]);
}

// Find class_def for MainActivity (class 4)
const classDefsOff = buf.readUInt32LE(0x64);
const c4Off = classDefsOff + 4 * 32;
const classDataOff = buf.readUInt32LE(c4Off + 24);
console.log('MainActivity classDataOff:', '0x' + classDataOff.toString(16));

// Read uleb128 helpers
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

let p = classDataOff;
let staticFieldsSize, instanceFieldsSize, directMethodsSize, virtualMethodsSize;
[staticFieldsSize, p] = readUleb128(buf, p);
[instanceFieldsSize, p] = readUleb128(buf, p);
[directMethodsSize, p] = readUleb128(buf, p);
[virtualMethodsSize, p] = readUleb128(buf, p);

console.log({ staticFieldsSize, instanceFieldsSize, directMethodsSize, virtualMethodsSize });

// Skip static & instance fields
for (let i = 0; i < staticFieldsSize + instanceFieldsSize; i++) {
  [, p] = readUleb128(buf, p); // field_idx_diff
  [, p] = readUleb128(buf, p); // access_flags
}

// Read direct methods
console.log('\n--- Direct Methods ---');
let mIdx = 0;
for (let i = 0; i < directMethodsSize; i++) {
  let diff, flags, codeOff;
  [diff, p] = readUleb128(buf, p);
  [flags, p] = readUleb128(buf, p);
  [codeOff, p] = readUleb128(buf, p);
  mIdx += diff;
  console.log(`Method ${methods[mIdx]} (codeOff: 0x${codeOff.toString(16)})`);
}

// Read virtual methods
console.log('\n--- Virtual Methods ---');
mIdx = 0;
for (let i = 0; i < virtualMethodsSize; i++) {
  let diff, flags, codeOff;
  [diff, p] = readUleb128(buf, p);
  [flags, p] = readUleb128(buf, p);
  [codeOff, p] = readUleb128(buf, p);
  mIdx += diff;
  console.log(`Method ${methods[mIdx]} (codeOff: 0x${codeOff.toString(16)})`);
}
