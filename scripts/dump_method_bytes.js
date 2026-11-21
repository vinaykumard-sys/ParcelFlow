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

function dumpCode(codeOff) {
  const insnsSize = buf.readUInt32LE(codeOff + 12);
  const insnsOff = codeOff + 16;
  for (let i = 0; i < insnsSize; ) {
    const raw = buf.readUInt16LE(insnsOff + i * 2);
    const op = raw & 0xff;
    const vA = (raw >> 8) & 0x0f;
    const vB = (raw >> 12) & 0x0f;
    const extra = (raw >> 8) & 0xff;

    if (op === 0x1a) { // const-string
      const strIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
      console.log(`  [${i}] const-string v${extra}, "${strings[strIdx]}"`);
      i += 2;
    } else if (op >= 0x6e && op <= 0x72) { // invoke-kind
      const methIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
      console.log(`  [${i}] invoke ${methods[methIdx]?.class}->${methods[methIdx]?.name}`);
      i += 3;
    } else if (op === 0x22) { // new-instance
      const typeIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
      console.log(`  [${i}] new-instance v${extra}, ${types[typeIdx]}`);
      i += 2;
    } else if (op === 0x54) { // iget-object
      console.log(`  [${i}] iget-object`);
      i += 2;
    } else {
      console.log(`  [${i}] op=0x${op.toString(16)} extra=0x${extra.toString(16)}`);
      i++;
    }
  }
}

console.log('--- shouldOverrideUrlLoading (codeOff: 0x1190) ---');
dumpCode(0x1190);
