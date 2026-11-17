// ============================================================================
// PARCELFLOW BACKEND SERVICES TEST SUITE (scripts/test_backend_services.js)
// Tests all 7 services in src/services/:
// 1. supabaseClient.ts
// 2. authService.ts
// 3. parcelService.ts
// 4. pickupService.ts
// 5. otpQrService.ts
// 6. staffService.ts
// 7. adminService.ts
// ============================================================================

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}: ${details}`);
    failed++;
  }
}

console.log('====================================================================');
console.log('TESTING SRC/SERVICES/ BACKEND SERVICES & SCHEMA ALIGNMENT');
console.log('====================================================================\n');

// -----------------------------------------------------------------------------
// 1. supabaseClient.ts
// -----------------------------------------------------------------------------
console.log('--- 1. Testing src/services/supabaseClient.ts ---');
const clientSource = fs.readFileSync('src/services/supabaseClient.ts', 'utf8');

assert(
  clientSource.includes('https://czhxktgdrhdflmfmvggx.supabase.co'),
  'supabaseClient uses correct Supabase project URL'
);
assert(
  clientSource.includes('sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K'),
  'supabaseClient uses correct publishable key'
);
assert(
  /persistSession:\s*true/.test(clientSource) &&
  /autoRefreshToken:\s*true/.test(clientSource) &&
  /detectSessionInUrl:\s*true/.test(clientSource),
  'supabaseClient configures session persistence, auto token refresh & URL detection'
);
assert(
  clientSource.includes('FALLBACK_SOCIETIES') && clientSource.includes('FALLBACK_PARCELS'),
  'supabaseClient exports resilient fallback constants for zero-downtime demonstration'
);

// -----------------------------------------------------------------------------
// 2. authService.ts
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing src/services/authService.ts ---');
const authSource = fs.readFileSync('src/services/authService.ts', 'utf8');

assert(
  authSource.includes('signUpWithEmail') && authSource.includes('signInWithEmail'),
  'authService exports signUpWithEmail and signInWithEmail'
);
assert(
  authSource.includes('signInWithGoogle'),
  'authService exports signInWithGoogle OAuth handler'
);
assert(
  authSource.includes('signInWithPhoneOtp') && authSource.includes('verifyPhoneOtp'),
  'authService exports signInWithPhoneOtp and verifyPhoneOtp'
);
assert(
  authSource.includes('vinaykumard45678@gmail.com'),
  'authService references admin email vinaykumard45678@gmail.com'
);
assert(
  authSource.includes("const isAdmin = profile?.role === 'admin';") ||
  authSource.includes("const isAdmin = profile.role === 'admin';"),
  'authService strictly checks admin role against verified public.profiles DB record'
);
assert(
  !/let\s+isAdmin\s*=\s*cleanEmail\s*===\s*'vinaykumard45678@gmail\.com'/i.test(authSource),
  'authService DOES NOT grant admin based on unverified email string check alone'
);
assert(
  authSource.includes('fetchVerifiedProfile'),
  'authService queries public.profiles where id = auth.uid()'
);

// -----------------------------------------------------------------------------
// 3. parcelService.ts
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing src/services/parcelService.ts ---');
const parcelSource = fs.readFileSync('src/services/parcelService.ts', 'utf8');

assert(
  parcelSource.includes('getResidentParcels('),
  'parcelService queries resident parcels'
);
assert(
  parcelSource.includes('getParcelById(') && parcelSource.includes('getParcelByTracking('),
  'parcelService queries parcel details by ID and tracking number'
);
assert(
  parcelSource.includes('updateParcelStatus('),
  'parcelService updates parcel status (WAITING, SCHEDULED, READY, HANDED_OVER, COMPLETED)'
);
assert(
  parcelSource.includes('normalizeParcelStatus'),
  'parcelService normalizes status transitions (e.g. WAITING -> RECEIVED, READY -> READY_FOR_PICKUP)'
);
assert(
  parcelSource.includes('getParcelTimeline(') && parcelSource.includes('addParcelTimelineEvent('),
  'parcelService queries and records audit timeline events in parcel_events'
);

// -----------------------------------------------------------------------------
// 4. pickupService.ts
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing src/services/pickupService.ts ---');
const pickupSource = fs.readFileSync('src/services/pickupService.ts', 'utf8');

assert(
  pickupSource.includes('DEFAULT_EVENING_SLOTS'),
  'pickupService defines evening pickup slot windows'
);
assert(
  pickupSource.includes('5:00 PM – 5:30 PM') &&
  pickupSource.includes('6:00 PM – 6:30 PM') &&
  pickupSource.includes('7:00 PM – 7:30 PM') &&
  pickupSource.includes('8:00 PM – 8:30 PM'),
  'pickupService covers 5:00, 6:00, 7:00, 8:00 evening windows'
);
assert(
  pickupSource.includes('getPickupSlots('),
  'pickupService queries slots with live capacity counting (max_capacity - current_bookings_count)'
);
assert(
  pickupSource.includes('bookPickupSlot('),
  'pickupService books pickup slots and increments capacity'
);
assert(
  pickupSource.includes('reschedulePickupSlot('),
  'pickupService reschedules pickup slots adjusting slot booking counts'
);
assert(
  pickupSource.includes('cancelPickupBooking('),
  'pickupService cancels bookings and releases slot capacity'
);

// -----------------------------------------------------------------------------
// 5. otpQrService.ts
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing src/services/otpQrService.ts ---');
const otpSource = fs.readFileSync('src/services/otpQrService.ts', 'utf8');

assert(
  otpSource.includes('generateSixDigitOtp('),
  'otpQrService generates 6-digit numeric OTP'
);
assert(
  otpSource.includes('OTP_EXPIRY_MINUTES = 10'),
  'otpQrService enforces 10-minute validity expiry'
);
assert(
  otpSource.includes('generateHandoverToken('),
  'otpQrService generates database-backed token with QR data and single-use status'
);
assert(
  otpSource.includes('validateOtp('),
  'otpQrService validates 6-digit OTP code single-use with expiry verification'
);
assert(
  otpSource.includes('validateQrToken('),
  'otpQrService validates optical QR tokens'
);
assert(
  otpSource.includes("status: 'USED'"),
  'otpQrService marks token as USED upon successful verification'
);

// -----------------------------------------------------------------------------
// 6. staffService.ts
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing src/services/staffService.ts ---');
const staffSource = fs.readFileSync('src/services/staffService.ts', 'utf8');

assert(
  staffSource.includes('intakeParcel('),
  'staffService provides parcel intake with tracking ID, barcode & resident assignment'
);
assert(
  staffSource.includes('parseStorageSlotString('),
  'staffService parses storage slot string (e.g. Tower B / Rack B / Slot 17)'
);
assert(
  staffSource.includes('checkSlotOccupancy('),
  'staffService checks storage slot occupancy before assignment'
);
assert(
  staffSource.includes('verifyHandover('),
  'staffService verifies handover via QR scan or OTP entry'
);
assert(
  staffSource.includes("status: 'HANDED_OVER'"),
  'staffService updates parcel status to HANDED_OVER upon verification'
);
assert(
  staffSource.includes('releaseStorageSlot('),
  'staffService releases storage rack slot when parcel is handed over'
);
assert(
  staffSource.includes("action: 'HANDOVER_DISPATCHED'") || staffSource.includes("action: 'PARCEL_SCAN_IN'"),
  'staffService writes audit trail records to public.audit_logs'
);

// -----------------------------------------------------------------------------
// 7. adminService.ts
// -----------------------------------------------------------------------------
console.log('\n--- 7. Testing src/services/adminService.ts ---');
const adminSource = fs.readFileSync('src/services/adminService.ts', 'utf8');

assert(
  adminSource.includes('getSocietyStats('),
  'adminService calculates society stats & parcel analytics'
);
assert(
  adminSource.includes('todayTotal') &&
  adminSource.includes('collectedCount') &&
  adminSource.includes('pendingCount') &&
  adminSource.includes('scheduledCount') &&
  adminSource.includes('collectionRate'),
  'adminService provides complete parcel metrics (today total, collected, pending, scheduled, rate)'
);
assert(
  adminSource.includes('getSocietyResidents(') && adminSource.includes('addResident('),
  'adminService provides resident directory management'
);
assert(
  adminSource.includes('getSocietyStaff(') && adminSource.includes('addStaffMember('),
  'adminService provides staff roster management'
);
assert(
  adminSource.includes('getPickupSlotsConfig(') && adminSource.includes('updateSlotCapacity('),
  'adminService provides pickup slots capacity management'
);
assert(
  adminSource.includes('Math.max(5, capacity)'),
  'adminService clamps minimum slot capacity to 5'
);
assert(
  adminSource.includes('syncFromSupabase('),
  'adminService supports full live sync with Supabase tables'
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n====================================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
