import fs from 'fs';

const buf = fs.readFileSync('apk_temp/AndroidManifest.xml');
let str = '';
for (let i = 0; i < buf.length - 1; i += 2) {
  const code = buf.readUInt16LE(i);
  if (code >= 32 && code <= 126) {
    str += String.fromCharCode(code);
  } else {
    if (str.toLowerCase().includes('heat') || str.toLowerCase().includes('shield')) {
      console.log(`UTF16LE [0x${(i - str.length * 2).toString(16)}]: ${str}`);
    }
    str = '';
  }
}
