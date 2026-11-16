import fs from 'fs';
import crypto from 'crypto';
import { ApkSigner, SigningKey } from 'apk_sign_ts';

async function testPkcs8() {
  const rsaKeyPem = fs.readFileSync('key.pem', 'utf8');
  // Convert PKCS#1 to PKCS#8
  const keyObj = crypto.createPrivateKey(rsaKeyPem);
  const pkcs8Pem = keyObj.export({ type: 'pkcs8', format: 'pem' });
  fs.writeFileSync('key_pkcs8.pem', pkcs8Pem);
  console.log('Successfully converted to PKCS#8 PEM!');

  const certPem = fs.readFileSync('cert.pem', 'utf8');
  const signingKey = SigningKey.fromPEM(pkcs8Pem, certPem);
  const signer = new ApkSigner({ signingKey });

  const apkData = fs.readFileSync('public/downloads/android/ParcelFlow.apk');
  const { signedApk } = await signer.sign(new Uint8Array(apkData));
  console.log('SUCCESS! Signed APK with v1 + v2 + v3! Size:', signedApk.length);
  fs.writeFileSync('test-v2-signed.apk', signedApk);
}

testPkcs8();
