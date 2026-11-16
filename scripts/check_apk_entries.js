import AdmZip from 'adm-zip';
import fs from 'fs';

const apkPath = 'public/downloads/android/ParcelFlow.apk';
const zip = new AdmZip(apkPath);
const entries = zip.getEntries();
console.log('Total entries:', entries.length);
entries.forEach(e => {
  if (e.entryName.startsWith('assets/') || e.entryName === 'AndroidManifest.xml' || e.entryName === 'classes.dex' || e.entryName === 'resources.arsc') {
    console.log(e.entryName, 'Size:', e.header.size);
  }
});
