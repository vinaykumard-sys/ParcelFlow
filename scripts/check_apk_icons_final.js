import { execSync } from 'child_process';
import fs from 'fs';

// Check icons in signed_out/unaligned-aligned-signed.apk
const jarExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jar.exe';
const list = execSync(`& "${jarExe}" tvf signed_out/unaligned-aligned-signed.apk`, {
  shell: 'powershell'
}).toString();

const lines = list.split('\n');
lines.filter(l => l.includes('ic_launcher') || l.includes('splash_logo')).forEach(l => console.log(l.trim()));
