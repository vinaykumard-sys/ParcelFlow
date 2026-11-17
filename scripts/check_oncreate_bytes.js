import fs from 'fs';

const buf = fs.readFileSync('classes.dex');
const onCreateOff = 0x17d8; // from our previous disasm
console.log('Bytes of onCreate header:');
for (let i = 0; i < 20; i++) {
  console.log(`+${i}: 0x${buf.readUInt8(onCreateOff + i).toString(16)}`);
}
