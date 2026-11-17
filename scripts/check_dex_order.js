import fs from 'fs';

const buf = fs.readFileSync('classes.dex');

const stringIdsSize = buf.readUInt32LE(0x38);
const stringIdsOff = buf.readUInt32LE(0x3c);
const strings = [];
for (let i = 0; i < stringIdsSize; i++) {
  const off = buf.readUInt32LE(stringIdsOff + i * 4);
  let pos = off;
  while (buf[pos] & 0x80) pos++;
  pos++;
  let end = pos;
  while (buf[end] !== 0) end++;
  strings.push(buf.toString('utf8', pos, end));
}

let sorted = true;
for (let i = 0; i < strings.length - 1; i++) {
  if (strings[i].localeCompare(strings[i + 1]) > 0) {
    console.log(`ORDER VIOLATION at [${i}] vs [${i + 1}]:`);
    console.log(`  [${i}]: "${strings[i]}"`);
    console.log(`  [${i + 1}]: "${strings[i + 1]}"`);
    sorted = false;
  }
}
console.log('Is string pool sorted?', sorted);
