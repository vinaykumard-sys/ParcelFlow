import fs from 'fs';

const buf = fs.readFileSync('classes.dex');
// Find where APP_URL (string index 15) is referenced
for (let i = 0; i < buf.length - 4; i++) {
  if (buf[i] === 0x1a && buf[i+2] === 0x0f && buf[i+3] === 0x00) {
    console.log('const-string string@15 found at offset 0x' + i.toString(16));
  }
}
const idx = buf.indexOf(Buffer.from('APP_URL'));
console.log('APP_URL at offset 0x' + idx.toString(16));
