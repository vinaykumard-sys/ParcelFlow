import fs from 'fs';
import { ApkSigner, SigningKey, convertToPEM } from 'apk_sign_ts';

async function testSign() {
  console.log('Testing convertToPEM with parcelflow-release.jks...');
  const keystoreData = new Uint8Array(fs.readFileSync('parcelflow-release.jks'));
  try {
    const { privateKey, certificate } = await convertToPEM(keystoreData, 'parcelflow123', 'pkcs12');
    console.log('Successfully extracted PEM from keystore!');
    console.log('Private key length:', privateKey.length);
    console.log('Certificate length:', certificate.length);

    const signingKey = SigningKey.fromPEM(privateKey, certificate);
    console.log('Successfully created SigningKey!');

    const signer = new ApkSigner({ signingKey });
    console.log('Successfully created ApkSigner!');
  } catch (err) {
    console.error('Error in convertToPEM:', err);
  }
}

testSign();
