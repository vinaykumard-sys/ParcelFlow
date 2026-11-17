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

const methodIdsSize = buf.readUInt32LE(0x58);
const methodIdsOff = buf.readUInt32LE(0x5c);
const methods = [];
for (let i = 0; i < methodIdsSize; i++) {
  const classIdx = buf.readUInt16LE(methodIdsOff + i * 8);
  const protoIdx = buf.readUInt16LE(methodIdsOff + i * 8 + 2);
  const nameIdx = buf.readUInt32LE(methodIdsOff + i * 8 + 4);
  methods.push({ class: classIdx, name: strings[nameIdx] });
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
const c2Off = classDefsOff + 2 * 32;
const classDataOff = buf.readUInt32LE(c2Off + 24);

let p = classDataOff;
let staticFieldsSize, instanceFieldsSize, directMethodsSize, virtualMethodsSize;
[staticFieldsSize, p] = readUleb128(buf, p);
[instanceFieldsSize, p] = readUleb128(buf, p);
[directMethodsSize, p] = readUleb128(buf, p);
[virtualMethodsSize, p] = readUleb128(buf, p);

for (let i = 0; i < directMethodsSize; i++) {
  let diff, flags, codeOff;
  [diff, p] = readUleb128(buf, p);
  [flags, p] = readUleb128(buf, p);
  [codeOff, p] = readUleb128(buf, p);
}
let mIdx = 0;
for (let i = 0; i < virtualMethodsSize; i++) {
  let diff, flags, codeOff;
  [diff, p] = readUleb128(buf, p);
  [flags, p] = readUleb128(buf, p);
  [codeOff, p] = readUleb128(buf, p);
  mIdx += diff;
  const mName = methods[mIdx].name;
  console.log(`Method ${i}: ${mName} at 0x${codeOff.toString(16)}`);
  if (mName === 'onReceivedError') {
    let cp = codeOff;
    const insnsSize = buf.readUInt32LE(cp + 12);
    let insP = cp + 16;
    const endP = insP + insnsSize * 2;
    while (insP < endP) {
      const pc = (insP - (cp + 16)) / 2;
      const op = buf.readUInt8(insP);
      console.log(`  [pc ${pc}] op: 0x${op.toString(16)}`);
      insP += 2;
    }
  }
}
