import { execSync } from 'child_process';
import fs from 'fs';

// Extract classes.dex from public/downloads/android/ParcelFlow.apk
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
if (!fs.existsSync('temp_inspect')) fs.mkdirSync('temp_inspect');
execSync(`& "${jarExe}" xf ..\\public\\downloads\\android\\ParcelFlow.apk classes.dex AndroidManifest.xml resources.arsc`, {
  cwd: 'temp_inspect',
  shell: 'powershell'
});

const dexBuf = fs.readFileSync('temp_inspect/classes.dex');
console.log('DEX size:', dexBuf.length);

// Read DEX header
const magic = dexBuf.slice(0, 8).toString('ascii');
console.log('DEX magic:', magic);
const checksum = dexBuf.readUInt32LE(8);
console.log('DEX checksum:', checksum.toString(16));
const stringIdsSize = dexBuf.readUInt32LE(56);
const stringIdsOff = dexBuf.readUInt32LE(60);
console.log('String IDs count:', stringIdsSize, 'offset:', stringIdsOff);

// Search for MainActivity or in/parcelflow strings in DEX
let curStr = '';
const strings = [];
for (let i = 0x70; i < dexBuf.length; i++) {
  const b = dexBuf[i];
  if (b >= 32 && b <= 126) {
    curStr += String.fromCharCode(b);
  } else {
    if (curStr.length >= 4) {
      if (curStr.includes('parcelflow') || curStr.includes('heatshield') || curStr.includes('MainActivity')) {
        strings.push(curStr);
      }
    }
    curStr = '';
  }
}
console.log('Matching strings in classes.dex:', strings);
