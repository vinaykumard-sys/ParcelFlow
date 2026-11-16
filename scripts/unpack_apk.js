import { execSync } from 'child_process';
import fs from 'fs';

if (fs.existsSync('apk_temp')) fs.rmSync('apk_temp', { recursive: true, force: true });
fs.mkdirSync('apk_temp');

execSync('& "C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe" xf ..\\public\\downloads\\android\\ParcelFlow.apk', {
  cwd: 'apk_temp',
  shell: 'powershell'
});

console.log('Unpacked APK into apk_temp. Files:', fs.readdirSync('apk_temp'));
