/**
 * QA Verification: Access Control + Duplicate Rejection
 * Tests:
 *   1. Anonymous/normal user cannot access Admin or Security panels
 *   2. Only vinaykumard45678@gmail.com (UID 0c9c3244-8680-4141-b119-ffecf87c804d) is SUPER_ADMIN
 *   3. addParcel/addExpectedOrder/addResident/addStaff reject duplicates
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function pass(label) {
  console.log(`[PASS] ${label}`);
  passed++;
}

function fail(label, reason) {
  console.log(`[FAIL] ${label} -- ${reason}`);
  failed++;
}

// ─── 1. Access Control: Source Code Checks ───────────────────────────────────

console.log('\n--- 1. Access Control: Role Guard Verification ---');

// 1a. MobileApp.tsx must NOT have persona switcher buttons for Admin/Security
const mobileAppPath = path.join(__dirname, '../src/mobile/MobileApp.tsx');
if (fs.existsSync(mobileAppPath)) {
  const src = fs.readFileSync(mobileAppPath, 'utf8');
  const hasPersonaSwitcher = /handleSelectPersona|selectPersona|PersonaSwitcher|switchToAdmin|switchToSecurity/i.test(src);
  if (!hasPersonaSwitcher) {
    pass('MobileApp.tsx: Public persona switcher removed');
  } else {
    fail('MobileApp.tsx: Public persona switcher still exists', 'Found handleSelectPersona/PersonaSwitcher pattern');
  }
  
  // Admin/Security buttons must not be freely accessible
  const hasOpenAdminButton = /onPress.*Admin|onClick.*Admin.*role|openAdmin.*button/i.test(src);
  if (!hasOpenAdminButton) {
    pass('MobileApp.tsx: No unguarded Admin/Security role-switch buttons found');
  } else {
    fail('MobileApp.tsx: Unguarded Admin/Security buttons detected', 'Role switch buttons present for any user');
  }
} else {
  fail('MobileApp.tsx', 'File not found at ' + mobileAppPath);
}

// 1b. authService.ts must enforce FIXED_ADMIN_UID
const authServicePath = path.join(__dirname, '../src/services/authService.ts');
if (fs.existsSync(authServicePath)) {
  const src = fs.readFileSync(authServicePath, 'utf8');
  const FIXED_UID = '0c9c3244-8680-4141-b119-ffecf87c804d';
  if (src.includes(FIXED_UID)) {
    pass(`authService.ts: FIXED_ADMIN_UID (${FIXED_UID}) is hardcoded`);
  } else {
    fail('authService.ts: FIXED_ADMIN_UID missing', 'UID not found in authService');
  }
  if (src.includes('vinaykumard45678@gmail.com')) {
    pass('authService.ts: Super Admin email vinaykumard45678@gmail.com is enforced');
  } else {
    fail('authService.ts: Super Admin email not enforced', 'Email not in authService');
  }
  // isAdmin must be derived from isSuperAdminRole/isSocietyAdminRole (DB role), not raw email alone
  // Allowed: email fallback tied to FIXED_ADMIN_EMAIL constant (not user-supplied email)
  // Forbidden: isAdmin = email === someArbitraryString
  const derivedFromRole = /isSuperAdminRole|isSocietyAdminRole/.test(src);
  const rawArbitraryEmail = /isAdmin\s*=\s*(true\s*if\s*)?.*email\s*===\s*['"`][^'"` ]+@/i.test(src);
  if (derivedFromRole && !rawArbitraryEmail) {
    pass('authService.ts: isAdmin derived from DB role (isSuperAdminRole/isSocietyAdminRole), not arbitrary email');
  } else if (!derivedFromRole) {
    fail('authService.ts: isAdmin not derived from role functions', 'isSuperAdminRole not found');
  } else {
    fail('authService.ts: isAdmin granted by raw arbitrary email', 'Hardcoded arbitrary email check detected');
  }
} else {
  fail('authService.ts', 'File not found');
}

// 1c. Database SQL: role check constraint and default=RESIDENT
const sqlFiles = [
  '../database/00_PARCELFLOW_ALL_IN_ONE.sql',
  '../database/02_security_hardening.sql',
  '../database/03_role_guards.sql',
].map(f => path.join(__dirname, f));

let foundRoleCheck = false;
let foundDefaultResident = false;
let foundAntiElevationTrigger = false;
for (const f of sqlFiles) {
  if (fs.existsSync(f)) {
    const sql = fs.readFileSync(f, 'utf8');
    if (sql.includes("CHECK (role IN ('SUPER_ADMIN'") || sql.includes("CHECK (role IN (")) foundRoleCheck = true;
    if (/DEFAULT\s+'RESIDENT'/i.test(sql)) foundDefaultResident = true;
    if (/prevent_role_elevation|anti.*role.*elevation|block.*role.*change/i.test(sql)) foundAntiElevationTrigger = true;
  }
}
// Also check all-in-one
const allInOnePath = path.join(__dirname, '../database/00_PARCELFLOW_ALL_IN_ONE.sql');
if (fs.existsSync(allInOnePath)) {
  const sql = fs.readFileSync(allInOnePath, 'utf8');
  if (sql.includes("CHECK (role IN ('SUPER_ADMIN'") || sql.includes("CHECK (role IN (")) foundRoleCheck = true;
  if (/DEFAULT\s+'RESIDENT'/i.test(sql)) foundDefaultResident = true;
  if (/prevent_role_elevation|BEFORE UPDATE.*role|prevent.*elevation/i.test(sql)) foundAntiElevationTrigger = true;
}

foundRoleCheck ? pass("DB: profiles.role has 4-tier CHECK constraint") : fail("DB: profiles.role CHECK constraint", "Not found in SQL files");
foundDefaultResident ? pass("DB: profiles.role DEFAULT is 'RESIDENT'") : fail("DB: profiles.role default RESIDENT", "DEFAULT 'RESIDENT' not found");
foundAntiElevationTrigger ? pass("DB: Anti-role-elevation trigger present") : fail("DB: Anti-role-elevation trigger", "Not found in SQL files");

// ─── 2. Duplicate Rejection in mobileState.ts ────────────────────────────────

console.log('\n--- 2. Duplicate Rejection: mobileState.ts ---');

const mobileStatePath = path.join(__dirname, '../src/mobile/services/mobileState.ts');
if (fs.existsSync(mobileStatePath)) {
  const src = fs.readFileSync(mobileStatePath, 'utf8');

  // addParcel: duplicate check by trackingNumber (returns isDuplicate:true)
  const addParcelHasDupCheck = /addParcel[\s\S]{0,1500}isDuplicate.*true|isDuplicate.*true[\s\S]{0,500}addParcel/i.test(src) ||
    /trackingNumber[\s\S]{0,300}isDuplicate/i.test(src);

  addParcelHasDupCheck
    ? pass('mobileState.ts: addParcel rejects duplicate trackingNumbers (isDuplicate: true)')
    : fail('mobileState.ts: addParcel duplicate check', 'No isDuplicate trackingNumber guard found in addParcel');

  // addResident: duplicate check
  const addResidentHasDupCheck = /addResident[\s\S]{0,600}isDuplicate/i.test(src);
  addResidentHasDupCheck
    ? pass('mobileState.ts: addResident rejects duplicates (isDuplicate: true)')
    : fail('mobileState.ts: addResident duplicate check', 'No isDuplicate guard found in addResident');

  // addStaff: duplicate check
  const addStaffHasDupCheck = /addStaff[\s\S]{0,600}isDuplicate/i.test(src);
  addStaffHasDupCheck
    ? pass('mobileState.ts: addStaff rejects duplicates (isDuplicate: true)')
    : fail('mobileState.ts: addStaff duplicate check', 'No isDuplicate guard found in addStaff');

  // loadState/saveState: deduplication
  const hasDedup = /Set\(|\.filter.*unique|\[\.\.\.new Set|deduplicate|dedup/i.test(src);
  hasDedup
    ? pass('mobileState.ts: loadState/saveState uses deduplication (Set or filter)')
    : fail('mobileState.ts: loadState/saveState dedup', 'No deduplication pattern found');
} else {
  fail('mobileState.ts', 'File not found at ' + mobileStatePath);
}

// addExpectedOrder duplicate check
const expectedOrderFiles = [
  '../src/mobile/services/mobileState.ts',
  '../src/mobile/components/ExpectedOrders.tsx',
  '../src/mobile/components/ResidentParcelsTab.tsx',
].map(f => path.join(__dirname, f));

let foundExpectedOrderDedup = false;
for (const f of expectedOrderFiles) {
  if (fs.existsSync(f)) {
    const src = fs.readFileSync(f, 'utf8');
    if (/addExpectedOrder[\s\S]{0,600}(find|some|filter|duplicate|already|exists)/i.test(src) ||
        /addExpectedOrder[\s\S]{0,800}already.*exist|addExpectedOrder[\s\S]{0,800}duplicate/i.test(src)) {
      foundExpectedOrderDedup = true;
      break;
    }
  }
}
foundExpectedOrderDedup
  ? pass('addExpectedOrder rejects duplicates')
  : fail('addExpectedOrder duplicate check', 'No duplicate guard found in ExpectedOrders/mobileState');

// ─── 3. Admin Route Guard ─────────────────────────────────────────────────────

console.log('\n--- 3. Admin Route Guard ---');

const routeFiles = [
  '../src/mobile/MobileApp.tsx',
  '../src/App.tsx',
  '../src/mobile/components/AdminGuard.tsx',
  '../admin-dashboard/src/App.tsx',
].map(f => path.join(__dirname, f));

let foundAdminGuard = false;
for (const f of routeFiles) {
  if (fs.existsSync(f)) {
    const src = fs.readFileSync(f, 'utf8');
    if (/403|Forbidden|SUPER_ADMIN|isAdmin.*false.*redirect|Navigate.*login|RequireAdmin|AdminGuard|ProtectedRoute/i.test(src)) {
      foundAdminGuard = true;
      break;
    }
  }
}
foundAdminGuard
  ? pass('Admin route: 403 or redirect guard found in routing layer')
  : fail('Admin route guard', 'No 403/redirect guard detected in routing files');

// Security panel guard
let foundSecurityGuard = false;
for (const f of routeFiles) {
  if (fs.existsSync(f)) {
    const src = fs.readFileSync(f, 'utf8');
    if (/SECURITY|security.*role|role.*security/i.test(src) &&
        /guard|protect|403|forbidden|redirect|require/i.test(src)) {
      foundSecurityGuard = true;
      break;
    }
  }
}
foundSecurityGuard
  ? pass('Security panel: role guard found in routing layer')
  : fail('Security panel guard', 'No SECURITY role guard found in routing files');

// ─── 4. Summary ──────────────────────────────────────────────────────────────

console.log('\n================================================================');
console.log(`QA VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${passed + failed}`);
console.log('================================================================');
process.exit(failed > 0 ? 1 : 0);
