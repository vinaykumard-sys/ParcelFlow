import { execSync } from 'child_process';
import fs from 'fs';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
execSync(`& "${jarExe}" xf public/downloads/android/ParcelFlow.apk classes.dex`, { shell: 'powershell' });

const buf = fs.readFileSync('classes.dex');

// Read string pool
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

// Read type ids
const typeIdsSize = buf.readUInt32LE(0x40);
const typeIdsOff = buf.readUInt32LE(0x44);
const types = [];
for (let i = 0; i < typeIdsSize; i++) {
  const descIdx = buf.readUInt32LE(typeIdsOff + i * 4);
  types.push(strings[descIdx]);
}

// Read method ids
const methodIdsSize = buf.readUInt32LE(0x58);
const methodIdsOff = buf.readUInt32LE(0x5c);
const methods = [];
for (let i = 0; i < methodIdsSize; i++) {
  const classIdx = buf.readUInt16LE(methodIdsOff + i * 8);
  const protoIdx = buf.readUInt16LE(methodIdsOff + i * 8 + 2);
  const nameIdx = buf.readUInt32LE(methodIdsOff + i * 8 + 4);
  methods.push({ class: types[classIdx], name: strings[nameIdx] });
}

// Read class defs
const classDefsSize = buf.readUInt32LE(0x60);
const classDefsOff = buf.readUInt32LE(0x64);
console.log('Class Defs Count:', classDefsSize);
for (let i = 0; i < classDefsSize; i++) {
  const cOff = classDefsOff + i * 32;
  const classIdx = buf.readUInt32LE(cOff);
  const accessFlags = buf.readUInt32LE(cOff + 4);
  const superclassIdx = buf.readUInt32LE(cOff + 8);
  const interfacesOff = buf.readUInt32LE(cOff + 12);
  const sourceFileIdx = buf.readUInt32LE(cOff + 16);
  const annotationsOff = buf.readUInt32LE(cOff + 20);
  const classDataOff = buf.readUInt32LE(cOff + 24);
  const staticValuesOff = buf.readUInt32LE(cOff + 28);
  console.log(`Class ${i}: ${types[classIdx]} extends ${superclassIdx === 0xffffffff ? 'none' : types[superclassIdx]}, source=${sourceFileIdx === 0xffffffff ? 'none' : strings[sourceFileIdx]}`);
}

console.log('\n--- Methods in DEX ---');
methods.forEach((m, i) => {
  if (m.class.includes('parcelflow') || m.class.includes('heatshield') || m.class.includes('MainActivity')) {
    console.log(`[Method ${i}] ${m.class} -> ${m.name}`);
  }
});
