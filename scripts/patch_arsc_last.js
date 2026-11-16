import fs from 'fs';

let arsc = fs.readFileSync('apk_temp/resources.arsc');
const searchBuf = Buffer.from('com.heatshield.ai', 'utf8');
const replaceBuf = Buffer.from('in.parcelflow.app', 'utf8');

let count = 0;
let idx = 0;
while ((idx = arsc.indexOf(searchBuf, idx)) !== -1) {
  replaceBuf.copy(arsc, idx);
  idx += replaceBuf.length;
  count++;
}
console.log('Replaced com.heatshield.ai in arsc:', count);
fs.writeFileSync('apk_temp/resources.arsc', arsc);
