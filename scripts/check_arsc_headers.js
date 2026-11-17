import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const apkPath = path.resolve('public/downloads/android/ParcelFlow.apk');
if (!fs.existsSync('temp_arsc')) fs.mkdirSync('temp_arsc');
execSync(`& "${jarExe}" xf "${apkPath}" resources.arsc`, { cwd: 'temp_arsc', shell: 'powershell' });
const arscBuf = fs.readFileSync('temp_arsc/resources.arsc');
fs.rmSync('temp_arsc', { recursive: true, force: true });

// Check ResTable header
const type = arscBuf.readUInt16LE(0);
const headerSize = arscBuf.readUInt16LE(2);
const totalSize = arscBuf.readUInt32LE(4);
const packageCount = arscBuf.readUInt32LE(8);
console.log(`ResTable: type=0x${type.toString(16)}, headerSize=${headerSize}, packageCount=${packageCount}`);

let p = headerSize;
while (p < arscBuf.length) {
  const cType = arscBuf.readUInt16LE(p);
  const cHeaderSize = arscBuf.readUInt16LE(p + 2);
  const cSize = arscBuf.readUInt32LE(p + 4);

  if (cType === 0x0001) { // RES_STRING_POOL_TYPE
    const stringCount = arscBuf.readUInt32LE(p + 8);
    const styleCount = arscBuf.readUInt32LE(p + 12);
    const flags = arscBuf.readUInt32LE(p + 16);
    const isUtf8 = (flags & (1 << 8)) !== 0;
    const isSorted = (flags & (1 << 0)) !== 0;
    console.log(`String Pool at 0x${p.toString(16)}: count=${stringCount}, isUtf8=${isUtf8}, isSorted=${isSorted}`);
  } else if (cType === 0x0200) { // RES_TABLE_PACKAGE_TYPE
    const pkgId = arscBuf.readUInt32LE(p + 8);
    let pkgName = '';
    for (let i = 0; i < 128; i++) {
      const char = arscBuf.readUInt16LE(p + 12 + i * 2);
      if (char === 0) break;
      pkgName += String.fromCharCode(char);
    }
    console.log(`Package at 0x${p.toString(16)}: id=0x${pkgId.toString(16)}, name="${pkgName}"`);
  }
  p += cSize;
}
