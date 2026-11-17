import { execSync } from 'child_process';

const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const list = execSync(`& "${jarExe}" tf "C:\\Users\\Vinay\\Downloads\\HeatShield-AI-v1.0.0.apk"`, { shell: 'powershell' }).toString();
const entries = list.trim().split('\n').map(s => s.trim());
console.log('First 5 entries of original APK:');
entries.slice(0, 5).forEach((e, i) => console.log(`${i}: ${e}`));
