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

// Find class_def for MainActivity (string index 61)
const classDefsSize = buf.readUInt32LE(0x60);
const classDefsOff = buf.readUInt32LE(0x64);

for (let i = 0; i < classDefsSize; i++) {
  const cOff = classDefsOff + i * 32;
  const classIdx = buf.readUInt32LE(cOff);
  const staticValuesOff = buf.readUInt32LE(cOff + 28);
  console.log(`Class ${i}: classIdx=${classIdx}, staticValuesOff=0x${staticValuesOff.toString(16)}`);
  if (staticValuesOff > 0) {
    // Read encoded array
    let p = staticValuesOff;
    // size of array (uleb128)
    let size = buf[p++];
    console.log(`  static values size: ${size}`);
    for (let j = 0; j < size; j++) {
      const valType = buf[p] & 0x1f;
      const valArg = buf[p] >> 5;
      p++;
      console.log(`  val ${j}: type=0x${valType.toString(16)}, arg=${valArg}`);
      if (valType === 0x17) { // VALUE_STRING
        let strIdx = 0;
        for (let b = 0; b <= valArg; b++) {
          strIdx |= (buf[p++] << (b * 8));
        }
        console.log(`    String value [${strIdx}]: "${strings[strIdx]}"`);
      }
    }
  }
}
