import { execSync } from 'child_process';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const list = execSync(`& "${jarExe}" tf public/downloads/android/ParcelFlow.apk`, { shell: 'powershell' }).toString();
const entries = list.trim().split('\n').map(s => s.trim());
console.log('First 10 entries of public/downloads/android/ParcelFlow.apk:');
entries.slice(0, 10).forEach((e, i) => console.log(`${i}: ${e}`));
const manifestIdx = entries.findIndex(e => e.includes('MANIFEST.MF'));
console.log('Index of MANIFEST.MF:', manifestIdx);
