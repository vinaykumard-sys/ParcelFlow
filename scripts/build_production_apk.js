import fs from 'fs';
import path from 'path';
import yazl from 'yazl';
import crypto from 'crypto';
import { ApkSigner, SigningKey } from 'apk_sign_ts';

// 1. Pack directory into an APK with resources.arsc UNCOMPRESSED
async function buildApkZip(srcDir, outZipPath) {
  return new Promise(async (resolve, reject) => {
    const zip = new yazl.ZipFile();
    const outStream = fs.createWriteStream(outZipPath);

    async function walk(dir, prefix = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      // Sort entries alphabetically
      entries.sort((a, b) => a.name.localeCompare(b.name));
      for (const e of entries) {
        const full = path.join(dir, e.name);
        const rel = prefix ? `${prefix}/${e.name}` : e.name;
        if (e.isDirectory()) {
          if (e.name !== 'META-INF') {
            await walk(full, rel);
          }
        } else if (e.isFile()) {
          // Do not include old META-INF signatures
          if (rel.startsWith('META-INF/')) return;
          
          // resources.arsc MUST NOT be compressed in Android APKs!
          const compress = e.name !== 'resources.arsc';
          zip.addFile(full, rel, { compress });
        }
      }
    }

    await walk(srcDir);
    zip.outputStream.pipe(outStream).on('close', resolve).on('error', reject);
    zip.end();
  });
}

// 2. 4-byte zip alignment (zipalign 4)
function alignZip(inputBuf) {
  // Parse central directory
  // Find End of Central Directory (EOCD): 0x06054b50
  let eocdOffset = -1;
  for (let i = inputBuf.length - 22; i >= 0; i--) {
    if (inputBuf.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) throw new Error('EOCD not found');

  const cdOffset = inputBuf.readUInt32LE(eocdOffset + 16);
  const cdSize = inputBuf.readUInt32LE(eocdOffset + 12);
  const totalEntries = inputBuf.readUInt16LE(eocdOffset + 10);

  // Read central directory entries
  const cdEntries = [];
  let curCd = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (inputBuf.readUInt32LE(curCd) !== 0x02014b50) {
      throw new Error('Bad CD entry signature at ' + curCd);
    }
    const compMethod = inputBuf.readUInt16LE(curCd + 10);
    const fileNameLen = inputBuf.readUInt16LE(curCd + 28);
    const extraLen = inputBuf.readUInt16LE(curCd + 30);
    const commentLen = inputBuf.readUInt16LE(curCd + 32);
    const localHeaderOffset = inputBuf.readUInt32LE(curCd + 42);
    const fileName = inputBuf.slice(curCd + 46, curCd + 46 + fileNameLen).toString('utf8');

    cdEntries.push({
      cdOffset: curCd,
      compMethod,
      fileNameLen,
      extraLen,
      commentLen,
      localHeaderOffset,
      fileName,
      totalCdEntryLen: 46 + fileNameLen + extraLen + commentLen
    });
    curCd += 46 + fileNameLen + extraLen + commentLen;
  }

  // Now reconstruct the zip with 4-byte aligned data offsets
  const outChunks = [];
  let currentOffset = 0;
  const newCdOffsets = [];

  for (const entry of cdEntries) {
    const lOff = entry.localHeaderOffset;
    if (inputBuf.readUInt32LE(lOff) !== 0x04034b50) {
      throw new Error('Bad local header at ' + lOff);
    }
    const compMethod = inputBuf.readUInt16LE(lOff + 8);
    const fNameLen = inputBuf.readUInt16LE(lOff + 26);
    const extraLen = inputBuf.readUInt16LE(lOff + 28);
    const compSize = inputBuf.readUInt32LE(lOff + 18);
    
    const headerFixed = inputBuf.slice(lOff, lOff + 30);
    const fileNameBytes = inputBuf.slice(lOff + 30, lOff + 30 + fNameLen);
    const extraBytes = inputBuf.slice(lOff + 30 + fNameLen, lOff + 30 + fNameLen + extraLen);
    const dataBytes = inputBuf.slice(lOff + 30 + fNameLen + extraLen, lOff + 30 + fNameLen + extraLen + compSize);

    // If uncompressed (compMethod === 0), data offset must be multiple of 4
    let padding = 0;
    if (compMethod === 0) {
      const dataOffset = currentOffset + 30 + fNameLen + extraLen;
      padding = (4 - (dataOffset % 4)) % 4;
    }

    const newExtraLen = extraLen + padding;
    const newHeader = Buffer.from(headerFixed);
    newHeader.writeUInt16LE(newExtraLen, 28);

    newCdOffsets.push({
      oldCdOffset: entry.cdOffset,
      newLocalHeaderOffset: currentOffset,
      newExtraLen: newExtraLen,
      padding
    });

    outChunks.push(newHeader);
    outChunks.push(fileNameBytes);
    outChunks.push(extraBytes);
    if (padding > 0) {
      outChunks.push(Buffer.alloc(padding, 0));
    }
    outChunks.push(dataBytes);

    currentOffset += 30 + fNameLen + newExtraLen + compSize;
  }

  // Central directory start offset
  const newCdStart = currentOffset;
  for (let i = 0; i < cdEntries.length; i++) {
    const entry = cdEntries[i];
    const update = newCdOffsets[i];
    const cdEntryBuf = Buffer.from(inputBuf.slice(entry.cdOffset, entry.cdOffset + entry.totalCdEntryLen));
    
    // Update local header offset
    cdEntryBuf.writeUInt32LE(update.newLocalHeaderOffset, 42);
    // Update extra field length in CD
    cdEntryBuf.writeUInt16LE(update.newExtraLen, 30);
    
    outChunks.push(cdEntryBuf);
    currentOffset += cdEntryBuf.length;
  }

  const newCdSize = currentOffset - newCdStart;
  const newEocd = Buffer.from(inputBuf.slice(eocdOffset, eocdOffset + 22));
  newEocd.writeUInt32LE(newCdSize, 12);
  newEocd.writeUInt32LE(newCdStart, 16);
  outChunks.push(newEocd);

  return Buffer.concat(outChunks);
}

// 3. Complete Build, Align & Sign Pipeline
async function main() {
  console.log('--- Step 1: Packing apk_temp with uncompressed resources.arsc ---');
  await buildApkZip('apk_temp', 'unaligned.apk');
  console.log('Packed unaligned.apk:', fs.statSync('unaligned.apk').size, 'bytes');

  console.log('--- Step 2: Applying 4-byte zip alignment (zipalign 4) ---');
  const unalignedBuf = fs.readFileSync('unaligned.apk');
  const alignedBuf = alignZip(unalignedBuf);
  fs.writeFileSync('aligned.apk', alignedBuf);
  console.log('Created aligned.apk:', alignedBuf.length, 'bytes');

  console.log('--- Step 3: Signing with APK Signature Scheme v1 + v2 + v3 ---');
  const pkcs8Pem = fs.readFileSync('key_pkcs8.pem', 'utf8');
  const certPem = fs.readFileSync('cert.pem', 'utf8');
  const signingKey = SigningKey.fromPEM(pkcs8Pem, certPem);
  const signer = new ApkSigner({ signingKey });

  const { signedApk } = await signer.sign(new Uint8Array(alignedBuf));
  fs.writeFileSync('ParcelFlow-production.apk', signedApk);
  console.log('SUCCESS: Generated ParcelFlow-production.apk! Size:', signedApk.length, 'bytes');
}

main().catch(console.error);
