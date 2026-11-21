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

const codeOff = 0x1190;
const insnsSize = buf.readUInt32LE(codeOff + 12);
const insnsOff = codeOff + 16;
console.log('Disassembly of shouldOverrideUrlLoading:');
for (let i = 0; i < insnsSize; ) {
  const raw = buf.readUInt16LE(insnsOff + i * 2);
  const op = raw & 0xff;
  const A = (raw >> 8) & 0x0f;
  const B = (raw >> 12) & 0x0f;
  const AA = (raw >> 8) & 0xff;
  const hex = raw.toString(16).padStart(4, '0');

  if (op === 0x1a) { // const-string
    const strIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
    console.log(`[${i.toString().padStart(3)}] const-string v${AA}, "${strings[strIdx]}"`);
    i += 2;
  } else if (op === 0x6e) { // invoke-virtual
    const methIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
    const regs = buf.readUInt16LE(insnsOff + i * 2 + 4);
    console.log(`[${i.toString().padStart(3)}] invoke-virtual {regs 0x${regs.toString(16)}}, ${methods[methIdx]?.class}->${methods[methIdx]?.name}`);
    i += 3;
  } else if (op === 0x70) { // invoke-direct
    const methIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
    const regs = buf.readUInt16LE(insnsOff + i * 2 + 4);
    console.log(`[${i.toString().padStart(3)}] invoke-direct {regs 0x${regs.toString(16)}}, ${methods[methIdx]?.class}->${methods[methIdx]?.name}`);
    i += 3;
  } else if (op === 0x71) { // invoke-static
    const methIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
    const regs = buf.readUInt16LE(insnsOff + i * 2 + 4);
    console.log(`[${i.toString().padStart(3)}] invoke-static {regs 0x${regs.toString(16)}}, ${methods[methIdx]?.class}->${methods[methIdx]?.name}`);
    i += 3;
  } else if (op === 0x22) { // new-instance
    const typeIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
    console.log(`[${i.toString().padStart(3)}] new-instance v${AA}, ${types[typeIdx]}`);
    i += 2;
  } else if (op === 0x54) { // iget-object
    const fIdx = buf.readUInt16LE(insnsOff + i * 2 + 2);
    console.log(`[${i.toString().padStart(3)}] iget-object v${A}, v${B}, fieldIdx=${fIdx}`);
    i += 2;
  } else if (op === 0x0e) { // return-void
    console.log(`[${i.toString().padStart(3)}] return-void`);
    i++;
  } else if (op === 0x0f) { // return
    console.log(`[${i.toString().padStart(3)}] return v${AA}`);
    i++;
  } else if (op === 0x12) { // const/4
    console.log(`[${i.toString().padStart(3)}] const/4 v${A}, ${B}`);
    i++;
  } else if (op === 0x0a) { // move-result
    console.log(`[${i.toString().padStart(3)}] move-result v${AA}`);
    i++;
  } else if (op === 0x38) { // if-eqz
    const target = i + (buf.readInt16LE(insnsOff + i * 2 + 2));
    console.log(`[${i.toString().padStart(3)}] if-eqz v${AA}, -> [${target}]`);
    i += 2;
  } else if (op === 0x39) { // if-nez
    const target = i + (buf.readInt16LE(insnsOff + i * 2 + 2));
    console.log(`[${i.toString().padStart(3)}] if-nez v${AA}, -> [${target}]`);
    i += 2;
  } else if (op === 0x28) { // goto
    const target = i + (buf.readInt8(insnsOff + i * 2 + 1));
    console.log(`[${i.toString().padStart(3)}] goto -> [${target}]`);
    i++;
  } else {
    console.log(`[${i.toString().padStart(3)}] op=0x${op.toString(16)} raw=0x${hex}`);
    i++;
  }
}
