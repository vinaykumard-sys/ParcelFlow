import fs from 'fs';

const buf = fs.readFileSync('classes.dex');
const strCount = buf.readUInt32LE(0x38);
const strOff = buf.readUInt32LE(0x3c);
const strings = [];
for (let i = 0; i < strCount; i++) {
  const off = buf.readUInt32LE(strOff + i * 4);
  let pos = off;
  while (buf[pos] & 0x80) pos++;
  pos++;
  let end = pos;
  while (buf[end] !== 0) end++;
  strings.push(buf.toString('utf8', pos, end));
}

const typeCount = buf.readUInt32LE(0x40);
const typeOff = buf.readUInt32LE(0x44);
const types = [];
for (let i = 0; i < typeCount; i++) {
  types.push(strings[buf.readUInt32LE(typeOff + i * 4)]);
}

const methodCount = buf.readUInt32LE(0x58);
const methodOff = buf.readUInt32LE(0x5c);
const methods = [];
for (let i = 0; i < methodCount; i++) {
  const classIdx = buf.readUInt16LE(methodOff + i * 8);
  const nameIdx = buf.readUInt32LE(methodOff + i * 8 + 4);
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

const classDefsCount = buf.readUInt32LE(0x60);
const classDefsOff = buf.readUInt32LE(0x64);

for (let c = 0; c < classDefsCount; c++) {
  const cOff = classDefsOff + c * 32;
  const classIdx = buf.readUInt32LE(cOff);
  const classDataOff = buf.readUInt32LE(cOff + 24);
  console.log(`\n================ Class [${c}]: ${types[classIdx]} ================`);
  if (!classDataOff) continue;

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

  let mIdx = 0;
  for (let i = 0; i < directMethodsSize; i++) {
    let diff, flags, codeOff;
    [diff, p] = readUleb128(buf, p);
    [flags, p] = readUleb128(buf, p);
    [codeOff, p] = readUleb128(buf, p);
    mIdx += diff;
    console.log(`  direct method: ${methods[mIdx]?.name} (codeOff: 0x${codeOff.toString(16)})`);
    disasmMethod(methods[mIdx]?.name, codeOff);
  }
  mIdx = 0;
  for (let i = 0; i < virtualMethodsSize; i++) {
    let diff, flags, codeOff;
    [diff, p] = readUleb128(buf, p);
    [flags, p] = readUleb128(buf, p);
    [codeOff, p] = readUleb128(buf, p);
    mIdx += diff;
    console.log(`  virtual method: ${methods[mIdx]?.name} (codeOff: 0x${codeOff.toString(16)})`);
    disasmMethod(methods[mIdx]?.name, codeOff);
  }
}

function disasmMethod(name, codeOff) {
  if (!codeOff) return;
  const insnsSize = buf.readUInt32LE(codeOff + 12);
  const insnsOff = codeOff + 16;
  for (let i = 0; i < insnsSize; ) {
    const opcode = buf[insnsOff + i * 2];
    const high = buf[insnsOff + i * 2 + 1];
    if (opcode === 0x1a) { // const-string
      const strIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
      console.log(`    [pc ${i}] const-string: "${strings[strIdx]}"`);
      i += 2;
    } else if (opcode === 0x1b) { // const-string/jumbo
      const strIdx = buf.readUInt32LE(insnsOff + i * 2 + 2);
      console.log(`    [pc ${i}] const-string/jumbo: "${strings[strIdx]}"`);
      i += 3;
    } else if (opcode >= 0x6e && opcode <= 0x72) { // invoke-kind
      const methIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
      console.log(`    [pc ${i}] invoke: ${methods[methIdx]?.class}->${methods[methIdx]?.name}`);
      i += 3;
    } else {
      i++;
    }
  }
}
