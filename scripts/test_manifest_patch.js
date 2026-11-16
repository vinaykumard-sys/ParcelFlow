import fs from 'fs';

let manifest = fs.readFileSync('apk_temp/AndroidManifest.xml');

function replaceUtf16(buf, searchStr, replaceStr) {
  const searchBuf = Buffer.from(searchStr, 'utf16le');
  const replaceBuf = Buffer.from(replaceStr, 'utf16le');
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

const c1 = replaceUtf16(manifest, 'com.heatshield.ai', 'in.parcelflow.app');
console.log('Replaced com.heatshield.ai count:', c1);

fs.writeFileSync('apk_temp/AndroidManifest.xml', manifest);
console.log('Saved patched AndroidManifest.xml');
