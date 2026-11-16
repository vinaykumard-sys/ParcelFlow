import fs from 'fs';
import { ApkSigner, SigningKey } from 'apk_sign_ts';
import { execSync } from 'child_process';

async function testDualSign() {
  const pkcs8Pem = fs.readFileSync('key_pkcs8.pem', 'utf8');
  const certPem = fs.readFileSync('cert.pem', 'utf8');
  const signingKey = SigningKey.fromPEM(pkcs8Pem, certPem);
  const signer = new ApkSigner({ signingKey });

  const inputApk = fs.readFileSync('test_manifest_order.apk');
  const { signedApk } = await signer.sign(new Uint8Array(inputApk));
  fs.writeFileSync('ParcelFlow-dual-signed.apk', signedApk);
  console.log('Saved ParcelFlow-dual-signed.apk! Size:', signedApk.length);

  // Check jarsigner verify on dual signed
  const jarsignerExe = 'C:\\Program Files\\Microsoft\\jdk-17.0.21.21-hotspot\\bin\\jarsigner.exe';
  const out = execSync(`& "${jarsignerExe}" -verify ParcelFlow-dual-signed.apk`, {
    shell: 'powershell'
  }).toString();
  console.log('Jarsigner verification on dual signed:\n', out);

  // Check aapt2 dump badging
  const aaptOut = execSync('& "node_modules\\aaptjs3\\bin\\x64\\win32\\aapt2.exe" dump badging ParcelFlow-dual-signed.apk', {
    shell: 'powershell'
  }).toString();
  console.log('aapt2 dump badging package line:\n', aaptOut.split('\n')[0]);
  console.log('aapt2 dump badging application line:\n', aaptOut.split('\n').find(l => l.startsWith('application:')));
}

testDualSign();
