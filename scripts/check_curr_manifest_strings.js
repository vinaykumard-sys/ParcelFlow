import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const apkPath = path.resolve('public/downloads/android/ParcelFlow.apk');
execSync(`& "${jarExe}" xf "${apkPath}" AndroidManifest.xml`, { cwd: 'test_manifest', shell: 'powershell' });
const currXml = fs.readFileSync('test_manifest/AndroidManifest.xml');

const stringCount = currXml.readUInt32LE(16);
const stringPoolOff = 8;
const stringsStart = stringPoolOff + currXml.readUInt32LE(stringPoolOff + 20);

const strings = [];
for (let i = 0; i < stringCount; i++) {
  const off = currXml.readUInt32LE(stringPoolOff + 28 + i * 4);
  const strPos = stringsStart + off;
  const len = currXml.readUInt16LE(strPos);
  let str = '';
  for (let j = 0; j < len; j++) {
    str += String.fromCharCode(currXml.readUInt16LE(strPos + 2 + j * 2));
  }
  strings.push({ idx: i, str });
}

console.log('Current AndroidManifest strings count:', strings.length);
strings.filter(s => s.str.includes('heatshield') || s.str.includes('parcelflow') || s.str.includes('MainActivity')).forEach(s => {
  console.log(`[${s.idx}] "${s.str}"`);
});
