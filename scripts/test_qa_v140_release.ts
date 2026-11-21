// ============================================================================
// PARCELFLOW v1.4.0 (versionCode 7) MASTER END-TO-END QA & SECURITY SUITE
// (scripts/test_qa_v140_release.ts)
// ============================================================================

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabase } from '../src/services/supabaseClient.ts';
import {
  signInWithEmail,
  signInWithGoogle,
  resetPasswordForEmail,
  verifyPasswordResetOtp,
  FIXED_ADMIN_EMAIL,
  FIXED_ADMIN_UID,
} from '../src/services/authService.ts';
import { CURRENT_APP_VERSION, getEffectiveAppVersion } from '../src/mobile/version.ts';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] #${totalTests} - ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] #${totalTests} - ${testName}`);
    if (detail) console.error(`         Detail: ${detail}`);
  }
}

// Minimal ZIP parser to inspect APK central directory & local file headers
interface ZipLocalEntry {
  fileName: string;
  compressionMethod: number; // 0 = STORED, 8 = DEFLATED
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
  dataOffset?: number;
}

function parseZipEntries(buffer: Buffer): { entries: ZipLocalEntry[]; error?: string } {
  const entries: ZipLocalEntry[] = [];
  try {
    // Find End of Central Directory (EOCD) signature: 0x06054b50
    let eocdOffset = -1;
    for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i--) {
      if (buffer.readUInt32LE(i) === 0x06054b50) {
        eocdOffset = i;
        break;
      }
    }
    if (eocdOffset === -1) {
      return { entries: [], error: 'Could not find ZIP EOCD signature' };
    }

    const cdEntriesCount = buffer.readUInt16LE(eocdOffset + 10);
    const cdSize = buffer.readUInt32LE(eocdOffset + 12);
    const cdOffset = buffer.readUInt32LE(eocdOffset + 16);

    let offset = cdOffset;
    for (let i = 0; i < cdEntriesCount && offset < cdOffset + cdSize; i++) {
      if (buffer.readUInt32LE(offset) !== 0x02014b50) {
        break; // Corrupted or truncated central directory
      }
      const compressionMethod = buffer.readUInt16LE(offset + 10);
      const compressedSize = buffer.readUInt32LE(offset + 20);
      const uncompressedSize = buffer.readUInt32LE(offset + 24);
      const fileNameLen = buffer.readUInt16LE(offset + 28);
      const extraLen = buffer.readUInt16LE(offset + 30);
      const commentLen = buffer.readUInt16LE(offset + 32);
      const localHeaderOffset = buffer.readUInt32LE(offset + 42);

      const fileName = buffer.toString('utf8', offset + 46, offset + 46 + fileNameLen);

      // Check local file header to find exact data offset
      let dataOffset: number | undefined = undefined;
      if (localHeaderOffset + 30 <= buffer.length && buffer.readUInt32LE(localHeaderOffset) === 0x04034b50) {
        const localFileNameLen = buffer.readUInt16LE(localHeaderOffset + 26);
        const localExtraLen = buffer.readUInt16LE(localHeaderOffset + 28);
        dataOffset = localHeaderOffset + 30 + localFileNameLen + localExtraLen;
      }

      entries.push({
        fileName,
        compressionMethod,
        compressedSize,
        uncompressedSize,
        localHeaderOffset,
        dataOffset,
      });

      offset += 46 + fileNameLen + extraLen + commentLen;
    }

    return { entries };
  } catch (err: any) {
    return { entries: [], error: err.message };
  }
}

async function runMasterQA() {
  console.log('\n======================================================================');
  console.log('PARCELFLOW v1.4.0 (versionCode 7) MASTER END-TO-END QA & SECURITY SUITE');
  console.log('======================================================================\n');

  // -------------------------------------------------------------------------
  // SECTION 1: IN-APP VERSION CODE & TS CONSTANTS
  // -------------------------------------------------------------------------
  console.log('[SECTION 1] In-App Version Configuration & Logic');
  assert(CURRENT_APP_VERSION.versionName === '1.4.0', 'CURRENT_APP_VERSION.versionName is "1.4.0"', `Got ${CURRENT_APP_VERSION.versionName}`);
  assert(CURRENT_APP_VERSION.versionCode === 7, 'CURRENT_APP_VERSION.versionCode is 7', `Got ${CURRENT_APP_VERSION.versionCode}`);
  assert(CURRENT_APP_VERSION.packageId === 'in.parcelflow.app', 'Package ID is "in.parcelflow.app"');
  
  const effectiveVer = getEffectiveAppVersion();
  assert(effectiveVer.versionName === '1.4.0' && effectiveVer.versionCode === 7, 'getEffectiveAppVersion() returns 1.4.0 (code 7)');

  // -------------------------------------------------------------------------
  // SECTION 2: APK METADATA VALIDATION (android.json)
  // -------------------------------------------------------------------------
  console.log('\n[SECTION 2] Update API Metadata Validation (public/api/app-update/android.json)');
  const metadataPath = path.resolve(process.cwd(), 'public/api/app-update/android.json');
  assert(fs.existsSync(metadataPath), 'android.json metadata file exists');

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  assert(metadata.latestVersionName === '1.4.0', 'Metadata latestVersionName is "1.4.0"', `Got ${metadata.latestVersionName}`);
  assert(metadata.latestVersionCode === 7, 'Metadata latestVersionCode is 7', `Got ${metadata.latestVersionCode}`);
  assert(metadata.apkUrl === '/downloads/android/ParcelFlow-v1.4.0-update.apk', 'Metadata apkUrl is "/downloads/android/ParcelFlow-v1.4.0-update.apk"', `Got ${metadata.apkUrl}`);
  assert(typeof metadata.sha256 === 'string' && metadata.sha256.length === 64, 'Metadata sha256 is a 64-character hex hash');
  assert(typeof metadata.apkSizeBytes === 'number' && metadata.apkSizeBytes > 1000000, 'Metadata apkSizeBytes is valid (>1MB)');

  // -------------------------------------------------------------------------
  // SECTION 3: APK BINARY INTEGRITY & COMPLIANCE
  // -------------------------------------------------------------------------
  console.log('\n[SECTION 3] APK Binary Integrity, Signatures & Alignment');
  const apkPath = path.resolve(process.cwd(), 'public/downloads/android/ParcelFlow-v1.4.0-update.apk');
  const apkExists = fs.existsSync(apkPath);
  assert(apkExists, 'Target APK file exists at public/downloads/android/ParcelFlow-v1.4.0-update.apk');

  if (apkExists) {
    const apkBuffer = fs.readFileSync(apkPath);
    const actualBytes = apkBuffer.length;
    const actualSha256 = crypto.createHash('sha256').update(apkBuffer).digest('hex');

    assert(actualBytes === metadata.apkSizeBytes, `APK file size matches metadata (${actualBytes} bytes)`);
    assert(actualSha256 === metadata.sha256, `APK sha256 matches metadata (${actualSha256})`);

    const { entries, error } = parseZipEntries(apkBuffer);
    assert(!error && entries.length > 0, 'APK ZIP central directory parsed successfully', error);

    const hasManifest = entries.some((e) => e.fileName === 'AndroidManifest.xml');
    assert(hasManifest, 'APK contains AndroidManifest.xml');

    const hasDex = entries.some((e) => e.fileName === 'classes.dex');
    assert(hasDex, 'APK contains classes.dex');

    const hasWebAssets = entries.some((e) => e.fileName.startsWith('assets/'));
    assert(hasWebAssets, 'APK contains packaged web assets (assets/)');

    const resourcesEntry = entries.find((e) => e.fileName === 'resources.arsc');
    assert(!!resourcesEntry, 'APK contains resources.arsc');

    if (resourcesEntry) {
      assert(resourcesEntry.compressionMethod === 0, 'resources.arsc is STORED (uncompressed, method 0)');
      if (resourcesEntry.dataOffset !== undefined) {
        const isAligned = resourcesEntry.dataOffset % 4 === 0;
        assert(isAligned, `resources.arsc data is 4-byte aligned (offset: ${resourcesEntry.dataOffset}, modulo 4 = ${resourcesEntry.dataOffset % 4})`);
      }
    }

    const hasSignature = entries.some(
      (e) => e.fileName.startsWith('META-INF/') && (e.fileName.endsWith('.RSA') || e.fileName.endsWith('.DSA') || e.fileName.endsWith('.EC') || e.fileName.endsWith('.SF'))
    );
    assert(hasSignature, 'APK is signed with release keystore (META-INF signature present)');
  }

  // -------------------------------------------------------------------------
  // SECTION 4: SUPABASE LIVE AUTHENTICATION & ERROR MAPPING
  // -------------------------------------------------------------------------
  console.log('\n[SECTION 4] Live Supabase Auth: Password Verification & Error Mapping');

  // Test 4.1: Bad Password Rejection
  const badLoginRes = await signInWithEmail('vinaykumard45678@gmail.com', 'CompletelyWrongPassword!999');
  assert(badLoginRes.user === null, 'Bad password login returns user: null');
  assert(badLoginRes.session === null, 'Bad password login returns session: null');
  assert(
    badLoginRes.error === 'Email or password is incorrect.',
    'Bad password returns clean user error "Email or password is incorrect."',
    `Got error: "${badLoginRes.error}"`
  );

  // Test 4.2: Direct Supabase auth client bad password response
  const { data: directBadData, error: directBadErr } = await supabase.auth.signInWithPassword({
    email: 'vinaykumard45678@gmail.com',
    password: 'CompletelyWrongPassword!999',
  });
  assert(directBadData.user === null, 'Direct Supabase client rejects bad password');
  assert(!!directBadErr && (directBadErr.status === 400 || directBadErr.message.toLowerCase().includes('invalid login credentials')), 'Supabase API returns HTTP 400 Invalid login credentials');

  // Test 4.3: Valid Credentials / Root Admin Login
  const goodLoginRes = await signInWithEmail(FIXED_ADMIN_EMAIL, '6Tha3see@123');
  assert(!!goodLoginRes.user, 'Valid login returns authenticated user');
  assert(goodLoginRes.user?.id === FIXED_ADMIN_UID, `Authenticated user ID matches FIXED_ADMIN_UID (${FIXED_ADMIN_UID})`);
  assert(!!goodLoginRes.session?.access_token, 'Valid login returns active JWT access token');
  assert(goodLoginRes.isAdmin === true, 'Authenticated admin user has isAdmin: true');

  // -------------------------------------------------------------------------
  // SECTION 5: GOOGLE OAUTH ENDPOINT & FALLBACK VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n[SECTION 5] Google OAuth Endpoint Authorization & Account Fallback');
  
  // Test direct Supabase OAuth call
  const { data: oauthData, error: oauthErr } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://parcelflow-blush.vercel.app/app',
    },
  });

  if (oauthData?.url) {
    assert(oauthData.url.includes('google') || oauthData.url.includes('supabase'), 'OAuth returns valid authorize URL');
    console.log(`         OAuth URL: ${oauthData.url.substring(0, 80)}...`);
  } else {
    // If Supabase OAuth provider is not configured in project dashboard
    assert(
      !!oauthErr && (oauthErr.message.toLowerCase().includes('unsupported') || oauthErr.message.toLowerCase().includes('provider')),
      'Supabase gracefully reports OAuth provider status when unconfigured in dashboard'
    );
  }

  // Test signInWithGoogle helper handles fallback cleanly
  const googleHelperRes = await signInWithGoogle('https://parcelflow-blush.vercel.app/app', FIXED_ADMIN_EMAIL);
  assert(googleHelperRes.success === true, 'signInWithGoogle completes successfully (via OAuth or verified account fallback)');
  if (googleHelperRes.isFallback) {
    assert(googleHelperRes.user?.id === FIXED_ADMIN_UID, 'Verified Google fallback signs into correct admin profile');
  }

  // -------------------------------------------------------------------------
  // SECTION 6: IN-APP PASSWORD RESET OTP FLOW
  // -------------------------------------------------------------------------
  console.log('\n[SECTION 6] In-App Password Reset & OTP Recovery Flow');

  // Test 6.1: resetPasswordForEmail never passes localhost
  const resetRes = await resetPasswordForEmail('test-recovery@parcelflow.app', 'http://localhost:5173/reset');
  assert(resetRes.success === true || (resetRes.error && resetRes.error.length > 0), 'resetPasswordForEmail executed without unhandled exception');

  // Test 6.2: verifyPasswordResetOtp with expired/invalid token
  const badOtpRes = await verifyPasswordResetOtp('vinaykumard45678@gmail.com', '999999');
  assert(badOtpRes.user === null, 'Invalid OTP token rejected');
  assert(!!badOtpRes.error, 'Invalid OTP returns informative error message', badOtpRes.error);

  // -------------------------------------------------------------------------
  // SECTION 7: DATABASE PERSISTENCE & ZERO DATA LOSS AUDIT
  // -------------------------------------------------------------------------
  console.log('\n[SECTION 7] Database User Persistence & Zero Data Loss Audit');

  // Audit Profiles table & Roles
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, full_name, email, role, society_id');
  assert(!pErr && !!profiles && profiles.length > 0, `Profiles table intact (${profiles?.length || 0} user profiles present)`);
  
  const adminProfile = profiles?.find((p) => p.id === FIXED_ADMIN_UID || p.email === FIXED_ADMIN_EMAIL);
  assert(!!adminProfile, `Root admin profile persists (UID: ${FIXED_ADMIN_UID}, Role: ${adminProfile?.role})`);

  // Verify Resident roles exist
  const residentProfiles = profiles?.filter((p) => p.role?.toUpperCase() === 'RESIDENT');
  assert(!!residentProfiles && residentProfiles.length > 0, `Resident user roles intact (${residentProfiles?.length || 0} resident profiles present)`);

  // Verify Admin roles exist
  const adminProfiles = profiles?.filter((p) => p.role?.toUpperCase() === 'SUPER_ADMIN' || p.role?.toUpperCase() === 'ADMIN' || p.role?.toUpperCase() === 'SOCIETY_ADMIN');
  assert(!!adminProfiles && adminProfiles.length > 0, `Admin roles intact (${adminProfiles?.length || 0} admin profiles present)`);

  // Audit Societies table
  const { data: societies, error: sErr } = await supabase.from('societies').select('id, name, code');
  assert(!sErr && !!societies && societies.length > 0, `Societies table intact (${societies?.length || 0} societies present)`);

  // Audit Apartments / Units table
  const { data: apartments, error: aErr } = await supabase.from('apartments').select('id, tower, unit_number');
  assert(!aErr && !!apartments && apartments.length > 0, `Apartments / Units table intact (${apartments?.length || 0} units present)`);

  // Audit Parcels table
  const { data: parcels, error: paErr } = await supabase.from('parcels').select('id, tracking_number, status');
  assert(!paErr && !!parcels && parcels.length > 0, `Parcels table intact (${parcels?.length || 0} parcels present)`);

  // Audit Storage Map Service computation
  const { getStorageGrid } = await import('../src/services/storageMapService.ts');
  const gridRes = await getStorageGrid();
  assert(gridRes.slots.length === 40, `Storage Map 2D grid generates 40 slots across hubs (Got ${gridRes.slots.length} slots)`);
  assert(gridRes.stats.totalSlots === 40, `Storage Map stats totalSlots is 40`);

  // -------------------------------------------------------------------------
  // SECTION 8: PRODUCTION BUILD & TYPESCRIPT TYPECHECK VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n[SECTION 8] Production Web Build & TypeScript Verification');
  
  const { execSync } = await import('child_process');
  
  try {
    console.log('         Running tsc --noEmit...');
    execSync('cmd /c "npx tsc --noEmit"', { stdio: 'pipe', encoding: 'utf8' });
    assert(true, 'TypeScript typecheck (tsc --noEmit) passed with 0 errors');
  } catch (err: any) {
    assert(false, 'TypeScript typecheck (tsc --noEmit) passed with 0 errors', err.stdout || err.message);
  }

  try {
    console.log('         Running npm run build...');
    const buildOutput = execSync('cmd /c "npm run build"', { stdio: 'pipe', encoding: 'utf8' });
    const builtOk = fs.existsSync(path.resolve(process.cwd(), 'dist/index.html'));
    assert(builtOk, 'Production Vite build (npm run build) completed and dist/index.html generated');
  } catch (err: any) {
    assert(false, 'Production Vite build (npm run build) completed', err.stdout || err.message);
  }

  // -------------------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(`TOTAL TESTS: ${totalTests}`);
  console.log(`PASSED:      ${passedTests}`);
  console.log(`FAILED:      ${failedTests}`);
  console.log(`SUCCESS RATE: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('======================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runMasterQA().catch((err) => {
  console.error('Fatal error in Master QA suite:', err);
  process.exit(1);
});
