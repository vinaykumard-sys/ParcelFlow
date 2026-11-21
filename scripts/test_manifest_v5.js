import { parseAxml } from '@iyexin/mio-android-tools';
import fs from 'fs';

const buf = fs.readFileSync('AndroidManifest_v5.xml');
const doc = parseAxml(buf);
const perms = doc.elements.filter(e => e.name === 'uses-permission');
console.log('Uses permissions:');
perms.forEach(p => {
  const nameAttr = p.attributes.find(a => doc.strings[a.name] === 'name');
  if (nameAttr) {
    console.log(' -', doc.strings[nameAttr.rawValue]);
  }
});
