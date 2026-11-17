import { execSync } from 'child_process';
import fs from 'fs';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const javaExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\java.exe';

// Sign with uber-apk-signer
if (fs.existsSync('test_uber_out')) fs.rmSync('test_uber_out', { recursive: true, force: true });
const uberOut = execSync(`& "${javaExe}" -jar uber-apk-signer.jar -a test.apk --ks parcelflow-release.jks --ksAlias parcelflow --ksPass parcelflow123 --ksKeyPass parcelflow123 -o test_uber_out --verbose`, {
  shell: 'powershell'
}).toString();
console.log('Uber output:', uberOut);

const buf = fs.readFileSync('test_uber_out/test-aligned-signed.apk');
let eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
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

  console.log(`${name}: method=${method} (${method === 0 ? 'STORED' : 'DEFLATED'}), dataOffset=${dataOffset}, 4-byte-aligned=${isAligned4}`);
  cur += 46 + fnLen + extraLen + commentLen;
}
