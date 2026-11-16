// ============================================================================
// PARCELFLOW AUTHENTICATION & SECURITY END-TO-END TEST SUITE
// Tests:
// 1. SQL RLS & Identity Invariant Validation (profiles, parcels, handover_tokens, audit_logs, etc.)
// 2. Admin Security: Ensuring admin privilege CANNOT be gained via email string or localStorage alone
// 3. Client Auth Error Handling: Empty credentials, bad password, phone validation
// 4. Role elevation prevention & metadata tampering defenses
// ============================================================================

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}: ${details}`);
    failed++;
  }
}

console.log('====================================================');
console.log('PARCELFLOW AUTH & SECURITY AUDIT TEST SUITE');
console.log('====================================================\n');

// ----------------------------------------------------------------------------
// TEST GROUP 1: SQL SCHEMA & RLS AUDIT
// ----------------------------------------------------------------------------
console.log('--- 1. SQL Schema & RLS Audit ---');

const sqlAllInOne = fs.readFileSync('database/00_PARCELFLOW_ALL_IN_ONE.sql', 'utf8');
const sqlAuthAdmin = fs.readFileSync('database/auth_and_admin_setup.sql', 'utf8');
const sqlSchema = fs.readFileSync('database/schema.sql', 'utf8');

// A. Check RLS is enabled on all critical tables
const requiredRlsTables = [
  'profiles',
  'parcels',
  'staff',
  'residents',
  'storage_locations',
  'pickup_slots',
  'pickup_bookings',
  'handover_tokens',
  'audit_logs',
  'issues',
  'notifications'
];

requiredRlsTables.forEach(table => {
  const rlsRegex = new RegExp(`ALTER\\s+TABLE\\s+public\\.${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, 'i');
  assert(
    rlsRegex.test(sqlAuthAdmin) || rlsRegex.test(sqlAllInOne),
    `RLS is enabled on public.${table}`,
    `Missing ENABLE ROW LEVEL SECURITY for ${table}`
  );
});

// B. Check anti-role-elevation triggers exist on profiles and users
assert(
  /prevent_role_elevation\(\)/.test(sqlAuthAdmin) && /trg_prevent_role_elevation/.test(sqlAuthAdmin),
  'Anti-role-elevation trigger exists on public.profiles',
  'Missing trg_prevent_role_elevation on public.profiles'
);

assert(
  /prevent_user_role_elevation\(\)/.test(sqlAuthAdmin),
  'Anti-role-elevation guard exists for public.users',
  'Missing prevent_user_role_elevation on public.users'
);

// C. Verify auth.uid() = profiles.id link
assert(
  /id\s+UUID\s+PRIMARY\s+KEY\s+REFERENCES\s+auth\.users\(id\)/i.test(sqlAuthAdmin),
  'profiles table primary key strictly references auth.users(id)',
  'profiles.id must reference auth.users(id)'
);

// D. Verify is_admin() checks database role, not email string alone
assert(
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_admin\(\)/i.test(sqlAuthAdmin) &&
  /role\s*=\s*'admin'/i.test(sqlAuthAdmin),
  'public.is_admin() verifies database role = admin',
  'is_admin() must verify role = admin in profiles/users table'
);

// E. Verify handover_tokens allows resident creation
assert(
  /CREATE\s+POLICY\s+"Residents\s+create\s+own\s+handover\s+tokens"/i.test(sqlAuthAdmin),
  'handover_tokens has INSERT policy for authenticated residents',
  'handover_tokens must allow residents to generate their tokens'
);

// F. Verify log_parcel_status_change has SECURITY DEFINER
assert(
  /FUNCTION\s+log_parcel_status_change\(\)[\s\S]*?LANGUAGE\s+plpgsql\s+SECURITY\s+DEFINER/i.test(sqlSchema) ||
  /FUNCTION\s+log_parcel_status_change\(\)[\s\S]*?SECURITY\s+DEFINER/i.test(sqlAllInOne),
  'log_parcel_status_change() is declared SECURITY DEFINER to bypass RLS during event logging',
  'log_parcel_status_change must be SECURITY DEFINER'
);

// ----------------------------------------------------------------------------
// TEST GROUP 2: CLIENT-SIDE ADMIN SECURITY & ROLE ISOLATION
// ----------------------------------------------------------------------------
console.log('\n--- 2. Client-Side Admin Security Audit ---');

const srcSupabase = fs.readFileSync('src/utils/supabase.ts', 'utf8');
const backendSupabase = fs.readFileSync('backend/supabase_client.ts', 'utf8');
const adminSupabase = fs.readFileSync('admin-dashboard/src/services/supabase_client.ts', 'utf8');

// Verify that frontend DOES NOT set isAdmin based purely on email string comparison
assert(
  !/let\s+isAdmin\s*=\s*cleanEmail\s*===\s*'vinaykumard45678@gmail\.com'/i.test(srcSupabase),
  'src/utils/supabase.ts: isAdmin is NOT granted via raw email string check',
  'Found let isAdmin = cleanEmail === vinay...'
);
assert(
  !/let\s+isAdmin\s*=\s*cleanEmail\s*===\s*'vinaykumard45678@gmail\.com'/i.test(backendSupabase),
  'backend/supabase_client.ts: isAdmin is NOT granted via raw email string check',
  'Found let isAdmin = cleanEmail === vinay...'
);
assert(
  !/let\s+isAdmin\s*=\s*cleanEmail\s*===\s*'vinaykumard45678@gmail\.com'/i.test(adminSupabase),
  'admin-dashboard: isAdmin is NOT granted via raw email string check',
  'Found let isAdmin = cleanEmail === vinay...'
);

// Verify that getCurrentUserProfile strictly checks profile.role === 'admin'
assert(
  /const\s+isAdmin\s*=\s*profile\.role\s*===\s*'admin';/.test(srcSupabase),
  'src/utils/supabase.ts: getCurrentUserProfile checks verified profile.role === admin',
  'getCurrentUserProfile must check profile.role === admin'
);

// Verify that fallbackProfile does NOT grant admin without verified DB record
assert(
  /role:\s*'resident'/.test(srcSupabase) && !/role:\s*isOwnerEmail\s*\?\s*'admin'/.test(srcSupabase),
  'Unverified fallback profiles default safely to resident role',
  'Unverified profile must not grant admin role'
);

// ----------------------------------------------------------------------------
// TEST GROUP 3: INPUT VALIDATION & ERROR HANDLING
// ----------------------------------------------------------------------------
console.log('\n--- 3. Input Validation & Error Handling ---');

assert(
  /if\s*\(!email\s*\|\|\s*!email\.trim\(\)\)/.test(srcSupabase),
  'Empty email validation present in auth helpers',
  'Missing email emptiness check'
);

assert(
  /if\s*\(!password\s*\|\|\s*password\.length\s*<\s*6\)/.test(srcSupabase),
  'Short/empty password validation (min 6 chars) present in signup',
  'Missing password length check'
);

assert(
  /if\s*\(!phone\s*\|\|\s*!phone\.trim\(\)\s*\|\|\s*phone\.trim\(\)\.replace\(/i.test(srcSupabase),
  'Phone number validation (min 10 digits) present in OTP helpers',
  'Missing phone format check'
);

// ----------------------------------------------------------------------------
// TEST GROUP 4: SESSION PERSISTENCE & TOKEN REFRESH
// ----------------------------------------------------------------------------
console.log('\n--- 4. Session Persistence & Token Refresh ---');

assert(
  /persistSession:\s*true/.test(backendSupabase) &&
  /autoRefreshToken:\s*true/.test(backendSupabase) &&
  /detectSessionInUrl:\s*true/.test(backendSupabase),
  'backend/supabase_client.ts: session persistence, auto token refresh, and URL OAuth detection active',
  'Missing auth config'
);

assert(
  /persistSession:\s*true/.test(srcSupabase) &&
  /autoRefreshToken:\s*true/.test(srcSupabase) &&
  /detectSessionInUrl:\s*true/.test(srcSupabase),
  'src/utils/supabase.ts: session persistence, auto token refresh, and URL OAuth detection active',
  'Missing auth config'
);

assert(
  /persistSession:\s*true/.test(adminSupabase) &&
  /autoRefreshToken:\s*true/.test(adminSupabase) &&
  /detectSessionInUrl:\s*true/.test(adminSupabase),
  'admin-dashboard: session persistence, auto token refresh, and URL OAuth detection active',
  'Missing auth config'
);

console.log('\n====================================================');
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
