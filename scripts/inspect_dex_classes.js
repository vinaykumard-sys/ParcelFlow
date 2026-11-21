import fs from 'fs';

// If apk_build/classes.dex doesn't exist, extract from public/downloads/android/ParcelFlow.apk
if (!fs.existsSync('apk_build/classes.dex')) {
  console.log('Extracting classes.dex from APK...');
  // we can read it directly from zip or use jar
}

const apkPath = 'public/downloads/android/ParcelFlow.apk';
import { execSync } from 'child_process';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
if (!fs.existsSync('apk_inspect')) fs.mkdirSync('apk_inspect');
execSync(`"${jarExe}" xf ..\\${apkPath} classes.dex AndroidManifest.xml`, { cwd: 'apk_inspect' });

const dexBuf = fs.readFileSync('apk_inspect/classes.dex');
const strSet = new Set();
// Search for strings in dex
let curStr = '';
for (let i = 0; i < dexBuf.length; i++) {
  const b = dexBuf[i];
  if (b >= 32 && b <= 126) {
    curStr += String.fromCharCode(b);
  } else {
    if (curStr.length >= 4) strSet.add(curStr);
    curStr = '';
  }
}

const strings = [...strSet];
console.log('--- Dex Activity & Bridge Strings ---');
console.log(strings.filter(s => s.toLowerCase().includes('mainactivity') || s.toLowerCase().includes('bridge') || s.toLowerCase().includes('webview') || s.toLowerCase().includes('download') || s.toLowerCase().includes('install') || s.toLowerCase().includes('provider') || s.toLowerCase().includes('intent') || s.toLowerCase().includes('fileprovider')).slice(0, 40));

console.log('--- Custom App Packages ---');
console.log(strings.filter(s => s.startsWith('com.') || s.startsWith('in.')).slice(0, 30));
