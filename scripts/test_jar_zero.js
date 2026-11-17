import { execSync } from 'child_process';
import fs from 'fs';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';

if (!fs.existsSync('test_pack')) fs.mkdirSync('test_pack');
fs.writeFileSync('test_pack/a.txt', 'hello world compressed');
fs.writeFileSync('test_pack/resources.arsc', 'resources binary data 1234567890');

// Step 1: create with normal compression, NO manifest
if (fs.existsSync('test.apk')) fs.unlinkSync('test.apk');
execSync(`& "${jarExe}" -c -M -f ..\\test.apk a.txt`, { cwd: 'test_pack', shell: 'powershell' });

// Step 2: update with -0 (no compression) for resources.arsc
execSync(`& "${jarExe}" -u -0 -M -f ..\\test.apk resources.arsc`, { cwd: 'test_pack', shell: 'powershell' });

// Step 3: check compression
const out = execSync(`& "${jarExe}" tvf test.apk`, { shell: 'powershell' }).toString();
console.log('Archive contents:\n', out);

// Check zip methods
const buf = fs.readFileSync('test.apk');
let eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const cdOffset = buf.readUInt32LE(eocd + 16);
const totalEntries = buf.readUInt16LE(eocd + 10);
let cur = cdOffset;
for (let i = 0; i < totalEntries; i++) {
  const method = buf.readUInt16LE(cur + 10);
  const fnLen = buf.readUInt16LE(cur + 28);
  const extraLen = buf.readUInt16LE(cur + 30);
  const commentLen = buf.readUInt16LE(cur + 32);
  const name = buf.slice(cur + 46, cur + 46 + fnLen).toString('utf8');
  console.log(`${name}: method=${method} (${method === 0 ? 'STORED' : 'DEFLATED'})`);
  cur += 46 + fnLen + extraLen + commentLen;
}
