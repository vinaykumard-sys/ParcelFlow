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

const fieldIdsSize = buf.readUInt32LE(0x50);
const fieldIdsOff = buf.readUInt32LE(0x54);
const fields = [];
for (let i = 0; i < fieldIdsSize; i++) {
  const classIdx = buf.readUInt16LE(fieldIdsOff + i * 8);
  const typeIdx = buf.readUInt16LE(fieldIdsOff + i * 8 + 2);
  const nameIdx = buf.readUInt32LE(fieldIdsOff + i * 8 + 4);
  fields.push({ class: types[classIdx], type: types[typeIdx], name: strings[nameIdx] });
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

function disasm(name) {
  const mInfo = allMethods.find(m => m.name === name);
  if (!mInfo || mInfo.codeOff === 0) return;
  console.log(`\n=== Disassembling ${name} ===`);
  let cp = mInfo.codeOff;
  const insnsSize = buf.readUInt32LE(cp + 12);
  let insP = cp + 16;
  const endP = insP + insnsSize * 2;
  while (insP < endP) {
    const pc = (insP - (cp + 16)) / 2;
    const op = buf.readUInt8(insP);
    const b1 = buf.readUInt8(insP + 1);

    if (op === 0x6e || op === 0x74 || op === 0x70 || op === 0x71 || op === 0x72) {
      const methIdx = buf.readUInt16LE(insP + 2);
      const m = methods[methIdx];
      console.log(`  [pc ${pc}] invoke: ${m?.class}->${m?.name}`);
      insP += 6;
    } else if (op === 0x1a) {
      const strIdx = buf.readUInt16LE(insP + 2);
      console.log(`  [pc ${pc}] const-string: "${strings[strIdx]}"`);
      insP += 4;
    } else if (op === 0x54 || op === 0x55 || op === 0x56) {
      const fIdx = buf.readUInt16LE(insP + 2);
      console.log(`  [pc ${pc}] i-field: ${fields[fIdx]?.name}`);
      insP += 4;
    } else if (op === 0x62 || op === 0x63) {
      const fIdx = buf.readUInt16LE(insP + 2);
      console.log(`  [pc ${pc}] s-field: ${fields[fIdx]?.name}`);
      insP += 4;
    } else if (op === 0x1c) { // const-class
      const typeIdx = buf.readUInt16LE(insP + 2);
      console.log(`  [pc ${pc}] const-class: ${types[typeIdx]}`);
      insP += 4;
    } else {
      insP += 2;
    }
  }
}

disasm('createSplashScreen');
disasm('initWebView');
disasm('requestLocationPermissionsIfNeeded');
