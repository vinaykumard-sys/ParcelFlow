import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parseAxml } from '@iyexin/mio-android-tools';
import { execSync } from 'child_process';

console.log('======================================================');
console.log('Testing ParcelFlow v1.4.1 Google Login & Update Release');
console.log('======================================================\n');

let pass = 0;
let fail = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    console.log(`[PASS] ${msg}`);
    pass++;
  } else {
    console.error(`[FAIL] ${msg}`);
    fail++;
  }
}

// 1. Verify Android update metadata
const updateJsonPath = path.resolve('public/api/app-update/android.json');
assert(fs.existsSync(updateJsonPath), 'android.json exists');
const updateJson = JSON.parse(fs.readFileSync(updateJsonPath, 'utf8'));
assert(updateJson.latestVersionName === '1.4.1', `versionName is 1.4.1 (got ${updateJson.latestVersionName})`);
assert(updateJson.latestVersionCode === 8, `versionCode is 8 (got ${updateJson.latestVersionCode})`);
assert(updateJson.apkUrl === '/downloads/android/ParcelFlow-v1.4.1-update.apk', 'apkUrl points to ParcelFlow-v1.4.1-update.apk');

// 2. Verify APK binary
const apkPath = path.resolve('public/downloads/android/ParcelFlow-v1.4.1-update.apk');
assert(fs.existsSync(apkPath), 'ParcelFlow-v1.4.1-update.apk binary exists');
const apkBytes = fs.readFileSync(apkPath);
assert(apkBytes.length === updateJson.apkSizeBytes, `APK size matches metadata (${apkBytes.length} bytes)`);
const hash = crypto.createHash('sha256').update(apkBytes).digest('hex');
assert(hash === updateJson.sha256, `SHA-256 matches metadata (${hash})`);

// 3. Verify in-app version configuration
const versionTs = fs.readFileSync('src/mobile/version.ts', 'utf8');
assert(versionTs.includes("versionName: '1.4.1'"), 'version.ts has versionName 1.4.1');
assert(versionTs.includes("versionCode: 8"), 'version.ts has versionCode 8');
assert(versionTs.includes("packageId: 'in.parcelflow.app'"), 'version.ts has packageId in.parcelflow.app');

// 4. Verify ResidentLogin.tsx zero-redirect Google modal
const loginTsx = fs.readFileSync('src/mobile/resident/ResidentLogin.tsx', 'utf8');
assert(!loginTsx.includes('onClick={handleNativeGoogleOAuth}'), 'handleNativeGoogleOAuth removed from button clicks');
assert(loginTsx.includes('onClick={() => setShowGoogleModal(true)}'), 'Continue with Google opens Google modal');
assert(loginTsx.includes('vinaykumard45678@gmail.com') || loginTsx.includes('FIXED_ADMIN_EMAIL'), 'Real Gmail ID vinaykumard45678@gmail.com is listed');
assert(loginTsx.includes('googleAccounts.map'), 'Maps over real Google accounts list');
assert(loginTsx.includes('Use another Google account'), 'Contains "Use another Google account" option');
assert(loginTsx.includes('Enter Real Google Email Address'), 'Contains custom real Gmail address entry');

// 5. Verify DownloadPage.tsx
const downloadPageTsx = fs.readFileSync('src/pages/DownloadPage.tsx', 'utf8');
assert(downloadPageTsx.includes('ParcelFlow-v1.4.1-update.apk'), 'DownloadPage.tsx references ParcelFlow-v1.4.1-update.apk');
assert(downloadPageTsx.includes("versionName: '1.4.1'"), 'DownloadPage.tsx has default versionName 1.4.1');
assert(downloadPageTsx.includes('versionCode: 8'), 'DownloadPage.tsx has default versionCode 8');

console.log('\n======================================================');
console.log(`Results: ${pass} passed, ${fail} failed`);
console.log('======================================================');

if (fail > 0) process.exit(1);
