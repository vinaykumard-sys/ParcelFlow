import fs from 'fs';

const buf = fs.readFileSync('classes.dex');
const strCount = buf.readUInt32LE(0x38);
const strOff = buf.readUInt32LE(0x3c);
const strings = [];
for (let i = 0; i < strCount; i++) {
  const off = buf.readUInt32LE(strOff + i * 4);
  let pos = off;
  while (buf[pos] & 0x80) pos++;
  pos++;
  let end = pos;
  while (buf[end] !== 0) end++;
  strings.push({ idx: i, str: buf.toString('utf8', pos, end) });
}

strings.forEach(s => {
  if (s.str.includes('1.1.0') || s.str.includes('ParcelFlowApp')) {
    console.log(`[${s.idx}] "${s.str}"`);
    console.log(`  prev [${s.idx-1}]: "${strings[s.idx-1].str}"`);
    console.log(`  next [${s.idx+1}]: "${strings[s.idx+1].str}"`);
  }
});
