import fs from 'fs';

const buf = fs.readFileSync('apk_temp/resources.arsc');
const searchBuf = Buffer.from('com.heatshield.ai', 'utf16le');
const replaceBuf = Buffer.from('in.parcelflow.app', 'utf16le');

let count = 0;
let idx = 0;
while ((idx = buf.indexOf(searchBuf, idx)) !== -1) {
  replaceBuf.copy(buf, idx);
  idx += replaceBuf.length;
  count++;
}
console.log('Replaced UTF16 com.heatshield.ai in arsc:', count);
fs.writeFileSync('apk_temp/resources.arsc', buf);
