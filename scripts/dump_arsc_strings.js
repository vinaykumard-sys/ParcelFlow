import fs from 'fs';

const buf = fs.readFileSync('resources.arsc');
// Search for UTF-16 and UTF-8 strings in ARSC
let text = '';
for (let i = 0; i < buf.length - 1; i++) {
  // UTF-16LE check: printable char followed by 0x00
  if (buf[i] >= 32 && buf[i] <= 126 && buf[i+1] === 0) {
    let s = '';
    while (i < buf.length - 1 && buf[i] >= 32 && buf[i] <= 126 && buf[i+1] === 0) {
      s += String.fromCharCode(buf[i]);
      i += 2;
    }
    if (s.length >= 3) {
      console.log('ARSC UTF-16:', s);
    }
  }
}
