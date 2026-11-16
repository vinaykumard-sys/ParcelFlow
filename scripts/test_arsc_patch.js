import fs from 'fs';

let arsc = fs.readFileSync('apk_temp/resources.arsc');

function replaceAscii(buf, searchStr, replaceStr) {
  const searchBuf = Buffer.from(searchStr, 'utf8');
  const replaceBuf = Buffer.from(replaceStr, 'utf8');
  if (searchBuf.length !== replaceBuf.length) {
    throw new Error(`Length mismatch: ${searchBuf.length} !== ${replaceBuf.length}`);
  }
  let count = 0;
  let idx = 0;
  while ((idx = buf.indexOf(searchBuf, idx)) !== -1) {
    replaceBuf.copy(buf, idx);
    idx += replaceBuf.length;
    count++;
  }
  return count;
}

const c1 = replaceAscii(arsc, 'HeatShield AI', 'ParcelFlow   ');
const c2 = replaceAscii(arsc, '::Smart Urban Heatwave Risk Assessment & Resilience Platform', '::Smart Gated Community Parcel Management & Delivery Locker ');
const c3 = replaceAscii(arsc, 'Theme.HeatShield', 'Theme.ParcelFlow');

console.log('Arsc replacements:', { c1, c2, c3 });
fs.writeFileSync('apk_temp/resources.arsc', arsc);
console.log('Saved patched resources.arsc');
