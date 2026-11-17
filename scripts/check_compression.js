import { execSync } from 'child_process';
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const out = execSync(`& "${jarExe}" tvf public/downloads/android/ParcelFlow.apk`, { shell: 'powershell' }).toString();
console.log(out.split('\n').filter(l => l.includes('resources.arsc') || l.includes('AndroidManifest.xml') || l.includes('classes.dex')).join('\n'));
