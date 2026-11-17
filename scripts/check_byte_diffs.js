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

const typeIdsSize = buf.readUInt32LE(0x40);
const typeIdsOff = buf.readUInt32LE(0x44);
const types = [];
for (let i = 0; i < typeIdsSize; i++) {
  const descIdx = buf.readUInt32LE(typeIdsOff + i * 4);
  types.push(strings[descIdx]);
}

const methodIdsSize = buf.readUInt32LE(0x58);
const methodIdsOff = buf.readUInt32LE(0x5c);
const methods = [];
for (let i = 0; i < methodIdsSize; i++) {
  const classIdx = buf.readUInt16LE(methodIdsOff + i * 8);
  const protoIdx = buf.readUInt16LE(methodIdsOff + i * 8 + 2);
  const nameIdx = buf.readUInt32LE(methodIdsOff + i * 8 + 4);
  methods.push({ class: types[classIdx], name: strings[nameIdx] });
}

// Check onCreate in original HeatShield APK vs current ParcelFlow APK
const origApk = 'C:\\Users\\Vinay\\Downloads\\HeatShield-AI-v1.0.0.apk';
import { execSync } from 'child_process';
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
execSync(`& "${jarExe}" xf "${origApk}" classes.dex`, { cwd: 'scripts', shell: 'powershell' });
const origBuf = fs.readFileSync('scripts/classes.dex');
fs.unlinkSync('scripts/classes.dex');

// Compare bytecode bytes of classes.dex
console.log('Current DEX size:', buf.length, 'Original DEX size:', origBuf.length);
let diffCount = 0;
for (let i = 0; i < Math.min(buf.length, origBuf.length); i++) {
  if (buf[i] !== origBuf[i]) {
    if (diffCount < 20) {
      console.log(`Byte diff at offset 0x${i.toString(16)}: orig 0x${origBuf[i].toString(16)} ('${String.fromCharCode(origBuf[i])}') vs curr 0x${buf[i].toString(16)} ('${String.fromCharCode(buf[i])}')`);
    }
    diffCount++;
  }
}
console.log('Total byte diffs:', diffCount);
