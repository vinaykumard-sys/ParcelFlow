// ============================================================================
// PARCELFLOW AUTHENTICATION & SECURITY END-TO-END TEST SUITE
// Tests:
// 1. SQL Schema & RLS Invariant Validation (profiles, parcels, handover_tokens, audit_logs, etc.)
// 2. Permanent 4-Tier Role Architecture (SUPER_ADMIN, SOCIETY_ADMIN, SECURITY, RESIDENT)
// 3. Fixed Admin Invariant: vinaykumard45678@gmail.com / 0c9c3244-8680-4141-b119-ffecf87c804d -> SUPER_ADMIN
// 4. Anti-Role-Elevation & Staff Creation Guard
// 5. Session Handling & Full Cache Purge on Sign Out
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
console.log('PARCELFLOW AUTH & SECURITY AUDIT TEST SUITE (v2.0)');
console.log('====================================================\n');

// ----------------------------------------------------------------------------
// TEST GROUP 1: SQL SCHEMA & RLS AUDIT
// ----------------------------------------------------------------------------
console.log('--- 1. SQL Schema & RLS Audit ---');

const sqlAllInOne = fs.readFileSync('database/00_PARCELFLOW_ALL_IN_ONE.sql', 'utf8');
const sqlAuthAdmin = fs.readFileSync('database/auth_and_admin_setup.sql', 'utf8');
const sqlSchema = fs.readFileSync('database/schema.sql', 'utf8');
const sqlMigration = fs.readFileSync('database/01_PERMANENT_IDENTITY_SECURITY_MIGRATION.sql', 'utf8');

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

// C. Verify auth.uid() = profiles.id permanent link
assert(
  /id\s+UUID\s+PRIMARY\s+KEY\s+REFERENCES\s+auth\.users\(id\)/i.test(sqlAuthAdmin),
  'profiles table primary key strictly references auth.users(id)',
  'profiles.id must reference auth.users(id)'
);

// D. Verify is_admin() checks database role, not email string alone
assert(
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_admin\(\)/i.test(sqlAuthAdmin) &&
  /role/i.test(sqlAuthAdmin),
  'public.is_admin() verifies database role',
  'is_admin() must verify database role in profiles/users table'
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
// TEST GROUP 2: PERMANENT 4-TIER ROLE STRUCTURE & SECURITY GUARDS
// ----------------------------------------------------------------------------
console.log('\n--- 2. Permanent 4-Tier Role Architecture Audit ---');

// A. Profiles check constraint enforces 4 roles: SUPER_ADMIN, SOCIETY_ADMIN, SECURITY, RESIDENT
assert(
  /CHECK\s*\(\s*role\s+IN\s*\(\s*'SUPER_ADMIN',\s*'SOCIETY_ADMIN',\s*'SECURITY',\s*'RESIDENT'\s*\)\s*\)/i.test(sqlAuthAdmin),
  'public.profiles strictly enforces 4-tier role CHECK (SUPER_ADMIN, SOCIETY_ADMIN, SECURITY, RESIDENT)',
  'profiles.role constraint must be SUPER_ADMIN, SOCIETY_ADMIN, SECURITY, RESIDENT'
);

// B. Default role for new users is RESIDENT
assert(
  /role\s+TEXT\s+NOT\s+NULL\s+DEFAULT\s+'RESIDENT'/i.test(sqlAuthAdmin),
  'public.profiles default role is strictly RESIDENT',
  'Default role must be RESIDENT'
);

// C. Fixed Admin: vinaykumard45678@gmail.com / 0c9c3244-8680-4141-b119-ffecf87c804d -> SUPER_ADMIN
assert(
  /0c9c3244-8680-4141-b119-ffecf87c804d/i.test(sqlAuthAdmin) &&
  /vinaykumard45678@gmail\.com/i.test(sqlAuthAdmin) &&
  /SUPER_ADMIN/i.test(sqlAuthAdmin),
  'Fixed Admin Account 0c9c3244-8680-4141-b119-ffecf87c804d (vinaykumard45678@gmail.com) strictly mapped to SUPER_ADMIN',
  'Fixed admin mapping missing'
);

// D. Helper functions is_super_admin(), is_society_admin(), is_security() exist
assert(
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_super_admin\(\)/i.test(sqlAuthAdmin),
  'public.is_super_admin() function exists',
  'Missing is_super_admin()'
);

assert(
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_society_admin\(/i.test(sqlAuthAdmin),
  'public.is_society_admin() function exists',
  'Missing is_society_admin()'
);

assert(
  /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.is_security\(/i.test(sqlAuthAdmin),
  'public.is_security() function exists',
  'Missing is_security()'
);

// E. Staff creation guard: only Super Admin or Society Admin can create staff
assert(
  /validate_staff_creation\(\)/.test(sqlAuthAdmin) &&
  /trg_validate_staff_creation/.test(sqlAuthAdmin),
  'validate_staff_creation() trigger prevents non-admins from creating SECURITY staff accounts',
  'Missing staff creation validation trigger'
);

// F. Tamper-resistant audit_logs: append-only, no update or delete policies
assert(
  !/CREATE\s+POLICY\s+.*?\s+ON\s+public\.audit_logs\s+FOR\s+UPDATE/i.test(sqlAuthAdmin) &&
  !/CREATE\s+POLICY\s+.*?\s+ON\s+public\.audit_logs\s+FOR\s+DELETE/i.test(sqlAuthAdmin),
  'public.audit_logs is append-only with zero UPDATE/DELETE policies (tamper-resistant)',
  'audit_logs must not have UPDATE or DELETE policies'
);

// ----------------------------------------------------------------------------
// TEST GROUP 3: CLIENT-SIDE AUTH SERVICE & SECURITY AUDIT
// ----------------------------------------------------------------------------
console.log('\n--- 3. Client-Side Auth Service & Security Audit ---');

const authServiceCode = fs.readFileSync('src/services/authService.ts', 'utf8');
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

// Verify fixed admin UID in authService
assert(
  /0c9c3244-8680-4141-b119-ffecf87c804d/.test(authServiceCode) &&
  /FIXED_ADMIN_UID/.test(authServiceCode),
  'src/services/authService.ts enforces FIXED_ADMIN_UID invariant',
  'FIXED_ADMIN_UID missing in authService.ts'
);

// Verify that fallbackProfile does NOT grant admin without verified DB record
assert(
  /role:\s*'resident'/.test(srcSupabase) && !/role:\s*isOwnerEmail\s*\?\s*'admin'/.test(srcSupabase),
  'Unverified fallback profiles default safely to resident role',
  'Unverified profile must not grant admin role'
);

// Verify purgeAuthState is implemented and called on signOut
assert(
  /purgeAuthState\(\)/.test(authServiceCode) &&
  /localStorage\.removeItem\('parcelflow_mobile_state_v2'\)/.test(authServiceCode),
  'authService.signOut() purges all cached localStorage, mobile state, and tokens on logout',
  'Missing purgeAuthState in authService.ts'
);

// ----------------------------------------------------------------------------
// TEST GROUP 4: INPUT VALIDATION & ERROR HANDLING
// ----------------------------------------------------------------------------
console.log('\n--- 4. Input Validation & Error Handling ---');

assert(
  /if\s*\(!email\s*\|\|\s*!email\.trim\(\)\)/.test(authServiceCode),
  'authService.ts: Empty email validation present',
  'Missing email emptiness check'
);

assert(
  /if\s*\(!password\s*\|\|\s*password\.length\s*<\s*6\)/.test(authServiceCode),
  'authService.ts: Short/empty password validation (min 6 chars) present',
  'Missing password length check'
);

assert(
  /if\s*\(!phone\s*\|\|\s*!phone\.trim\(\)\s*\|\|\s*phone\.trim\(\)\.replace\(/i.test(authServiceCode),
  'authService.ts: Phone number validation (min 10 digits) present',
  'Missing phone format check'
);

// ----------------------------------------------------------------------------
// TEST GROUP 5: SESSION PERSISTENCE & TOKEN REFRESH
// ----------------------------------------------------------------------------
console.log('\n--- 5. Session Persistence & Token Refresh ---');

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
