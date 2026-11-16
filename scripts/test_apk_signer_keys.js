import fs from 'fs';
import { convertToPEM } from 'apk_sign_ts';

async function testSign() {
  const keystoreData = new Uint8Array(fs.readFileSync('parcelflow-release.jks'));
  const res = await convertToPEM(keystoreData, 'parcelflow123', 'pkcs12');
  console.log('Returned keys:', Object.keys(res));
  console.log('Result:', res);
}

testSign();
