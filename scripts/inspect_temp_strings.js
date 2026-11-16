import fs from 'fs';

function findStrings(buf, minLen = 4) {
  const strings = [];
  let curr = '';
  let start = 0;
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if (b >= 32 && b <= 126) {
      if (!curr) start = i;
      curr += String.fromCharCode(b);
    } else {
      if (curr.length >= minLen) {
        strings.push({ offset: start, str: curr });
      }
      curr = '';
    }
  }
  return strings;
}

['apk_temp/AndroidManifest.xml', 'apk_temp/resources.arsc', 'apk_temp/classes.dex'].forEach(file => {
  const buf = fs.readFileSync(file);
  const found = findStrings(buf);
  console.log(`=== ${file} (size: ${buf.length}) ===`);
  found.filter(s => s.str.toLowerCase().includes('heat') || s.str.toLowerCase().includes('shield') || s.str.toLowerCase().includes('parcel')).forEach(s => {
    console.log(`  [0x${s.offset.toString(16)}] ${s.str}`);
  });
});
