import fs from 'fs';
import { ApkSigner, SigningKey } from 'apk_sign_ts';

async function testSignPem() {
  const privateKey = fs.readFileSync('key.pem', 'utf8');
  const certificate = fs.readFileSync('cert.pem', 'utf8');
  const signingKey = SigningKey.fromPEM(privateKey, certificate);

  const signer = new ApkSigner({ signingKey });
  console.log('Successfully initialized ApkSigner with PEM!');

  // Test sign a dummy zip/apk
  const apkData = fs.readFileSync('public/downloads/android/ParcelFlow.apk');
  const { signedApk } = await signer.sign(new Uint8Array(apkData));
  console.log('Successfully signed APK! Size:', signedApk.length);
  fs.writeFileSync('test-v2-signed.apk', signedApk);
}

testSignPem();
