import fs from 'fs';
import forge from 'node-forge';

const p12Der = fs.readFileSync('parcelflow-release.jks', 'binary');
const p12Asn1 = forge.asn1.fromDer(p12Der);
const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, 'parcelflow123');

for (const bag of p12.safeContents) {
  for (const safeBag of bag.safeBags) {
    if (safeBag.key) {
      const privateKeyPem = forge.pki.privateKeyToPem(safeBag.key);
      fs.writeFileSync('key.pem', privateKeyPem);
      console.log('Saved private key to key.pem!');
    }
    if (safeBag.cert) {
      const certPem = forge.pki.certificateToPem(safeBag.cert);
      fs.writeFileSync('cert.pem', certPem);
      console.log('Saved certificate to cert.pem!');
    }
  }
}
