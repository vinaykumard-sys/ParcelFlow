import fs from 'fs';
import path from 'path';

const apkPath = 'public/downloads/android/ParcelFlow.apk';
const buf = fs.readFileSync(apkPath);
console.log(`APK Size: ${buf.length} bytes`);

// Find EOCD
let eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const cdOffset = buf.readUInt32LE(eocd + 16);
const total = buf.readUInt16LE(eocd + 10);
console.log(`Zip Central Directory Entries: ${total}`);

let cur = cdOffset;
let arscOk = false;
let classesOk = false;
let wwwIndexOk = false;

for (let i = 0; i < total; i++) {
  const method = buf.readUInt16LE(cur + 10);
  const fnLen = buf.readUInt16LE(cur + 28);
  const extraLen = buf.readUInt16LE(cur + 30);
  const commentLen = buf.readUInt16LE(cur + 32);
  const localOffset = buf.readUInt32LE(cur + 42);
  const name = buf.subarray(cur + 46, cur + 46 + fnLen).toString('utf8');

  const localExtraLen = buf.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + fnLen + localExtraLen;
  const isAligned4 = (dataOffset % 4 === 0);

  if (name === 'resources.arsc') {
    arscOk = (method === 0) && isAligned4;
    console.log(`[CHECK] ${name}: method=${method} (${method === 0 ? 'STORED' : 'DEFLATED'}), dataOffset=${dataOffset}, 4-byte-aligned=${isAligned4}`);
  }
  if (name === 'classes.dex') {
    classesOk = true;
    console.log(`[CHECK] ${name}: present at dataOffset=${dataOffset}`);
  }
  if (name === 'assets/www/index.html') {
    wwwIndexOk = true;
    console.log(`[CHECK] ${name}: present at dataOffset=${dataOffset}`);
  }

  cur += 46 + fnLen + extraLen + commentLen;
}

if (!arscOk) throw new Error('resources.arsc is not STORED or not 4-byte aligned!');
if (!classesOk) throw new Error('classes.dex is missing!');
if (!wwwIndexOk) throw new Error('assets/www/index.html is missing!');

console.log('All ZIP structure validations passed 100%!');
