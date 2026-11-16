import https from 'https';
import fs from 'fs';
import { execSync } from 'child_process';

const file = fs.createWriteStream('live-downloaded.apk');
https.get('https://parcelflow-blush.vercel.app/downloads/android/ParcelFlow.apk', res => {
  res.pipe(file);
  file.on('finish', () => {
    console.log('Downloaded live APK. Size:', fs.statSync('live-downloaded.apk').size);
    
    // Check badging with aapt2
    const badging = execSync('& "node_modules\\aaptjs3\\bin\\x64\\win32\\aapt2.exe" dump badging live-downloaded.apk', { shell: 'powershell' }).toString();
    console.log('Badging:');
    console.log(badging.split('\n').slice(0, 5).join('\n'));
    console.log('App line:', badging.split('\n').find(l => l.startsWith('application:')));
    
    // Check signature with jarsigner
    const jarOut = execSync('& "C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jarsigner.exe" -verify live-downloaded.apk', { shell: 'powershell' }).toString();
    console.log('Jarsigner verification:\n', jarOut);

    // Check with uber-apk-signer verify
    const uberOut = execSync('& "C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\java.exe" -jar uber-apk-signer.jar -a live-downloaded.apk -y --verbose', { shell: 'powershell' }).toString();
    console.log('Uber verify summary:');
    const vLines = uberOut.split('\n').filter(l => l.includes('verified') || l.includes('Subject:'));
    console.log(vLines.join('\n'));

    fs.unlinkSync('live-downloaded.apk');
  });
});
