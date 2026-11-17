import fs from 'fs';

const origXml = fs.readFileSync('test_manifest/AndroidManifest.xml');

// In AXML, string pool starts at offset 8
const stringCount = origXml.readUInt32LE(16);
const stringPoolOff = 8;
const stringsStart = stringPoolOff + origXml.readUInt32LE(stringPoolOff + 20);

// Read string offsets
const strings = [];
for (let i = 0; i < stringCount; i++) {
  const off = origXml.readUInt32LE(stringPoolOff + 28 + i * 4);
  const strPos = stringsStart + off;
  const len = origXml.readUInt16LE(strPos);
  let str = '';
  for (let j = 0; j < len; j++) {
    str += String.fromCharCode(origXml.readUInt16LE(strPos + 2 + j * 2));
  }
  strings.push({ idx: i, str });
}

console.log('Original AndroidManifest strings count:', strings.length);
strings.filter(s => s.str.includes('heatshield') || s.str.includes('parcelflow') || s.str.includes('MainActivity')).forEach(s => {
  console.log(`[${s.idx}] "${s.str}"`);
});
