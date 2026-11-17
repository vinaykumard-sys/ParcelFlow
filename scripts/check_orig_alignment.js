import fs from 'fs';

const buf = fs.readFileSync('C:\\Users\\Vinay\\Downloads\\HeatShield-AI-v1.0.0.apk');

let eocd = -1;
for (let i = buf.length - 22; i >= 0; i--) {
  if (buf.readUInt32LE(i) === 0x06054b50) {
    eocd = i;
    break;
  }
}
const cdOffset = buf.readUInt32LE(eocd + 16);
const totalEntries = buf.readUInt16LE(eocd + 10);

let cur = cdOffset;
for (let i = 0; i < totalEntries; i++) {
  const method = buf.readUInt16LE(cur + 10);
  const fnLen = buf.readUInt16LE(cur + 28);
  const extraLen = buf.readUInt16LE(cur + 30);
  const commentLen = buf.readUInt16LE(cur + 32);
  const localOffset = buf.readUInt32LE(cur + 42);
  const name = buf.slice(cur + 46, cur + 46 + fnLen).toString('utf8');

  const localExtraLen = buf.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + fnLen + localExtraLen;
  const isAligned4 = (dataOffset % 4 === 0);

  if (name.includes('resources.arsc') || name.includes('classes.dex') || name.includes('AndroidManifest.xml') || name.endsWith('.so')) {
    console.log(`${name}: method=${method} (${method === 0 ? 'STORED' : 'DEFLATED'}), dataOffset=${dataOffset}, 4-byte-aligned=${isAligned4}`);
  }

  cur += 46 + fnLen + extraLen + commentLen;
}
