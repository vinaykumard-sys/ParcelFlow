import fs from 'fs';

const buf = fs.readFileSync('classes.dex');
const str = buf.toString('latin1');

// DEX header: string_ids_size, string_ids_off
const stringIdsSize = buf.readUInt32LE(0x38);
const stringIdsOff = buf.readUInt32LE(0x3c);
console.log('stringIdsSize:', stringIdsSize, 'stringIdsOff:', stringIdsOff);

for (let i = 0; i < stringIdsSize; i++) {
  const off = buf.readUInt32LE(stringIdsOff + i * 4);
  // Read string at off (uleb128 length followed by MUTF-8)
  let pos = off;
  // skip uleb128
  while (buf[pos] & 0x80) pos++;
  pos++; // skip last byte
  let end = pos;
  while (buf[end] !== 0) end++;
  const s = buf.toString('utf8', pos, end);
  if (s.includes('http') || s.includes('heat') || s.includes('parcel') || s.includes('file:') || s.includes('assets') || s.includes('www') || s.includes('localhost') || s.includes('URL') || s.includes('loadUrl')) {
    console.log(`[${i}]`, s);
  }
}
