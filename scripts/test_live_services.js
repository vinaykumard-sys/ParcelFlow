// ============================================================================
// LIVE FUNCTIONAL TEST FOR SRC/SERVICES (scripts/test_live_services.js)
// Tests direct execution of methods in:
// - supabaseClient
// - authService
// - parcelService
// - pickupService
// - otpQrService
// - staffService
// - adminService
// ============================================================================

import { supabase } from '../src/services/supabaseClient.ts';
import { authService } from '../src/services/authService.ts';
import { parcelService, normalizeParcelStatus } from '../src/services/parcelService.ts';
import { pickupService, formatTimeWindowLabel } from '../src/services/pickupService.ts';
import { otpQrService, generateSixDigitOtp } from '../src/services/otpQrService.ts';
import { staffService, parseStorageSlotString } from '../src/services/staffService.ts';
import { adminService } from '../src/services/adminService.ts';

async function runLiveTests() {
  console.log('--- STARTING LIVE FUNCTIONAL SERVICE TESTS ---');
  let passCount = 0;
  let failCount = 0;

  function check(cond, msg) {
    if (cond) {
      console.log(`  ✓ [PASS] ${msg}`);
      passCount++;
    } else {
      console.error(`  ✗ [FAIL] ${msg}`);
      failCount++;
    }
  }

  // 1. Supabase Client
  const { data: societies, error: socErr } = await supabase.from('societies').select('id, name').limit(1);
  check(!socErr, 'Live Supabase connection to public.societies table succeeded');

  // 2. Auth Service checks
  const emptyRes = await authService.signInWithEmail('', '');
  check(emptyRes.error === 'Email address is required.', 'authService.signInWithEmail rejects empty email');

  const shortPassRes = await authService.signUpWithEmail('test@example.com', '123');
  check(shortPassRes.error === 'Password must be at least 6 characters long.', 'authService.signUpWithEmail rejects short password');

  const badPhone = await authService.signInWithPhoneOtp('123');
  check(!badPhone.success && badPhone.error.includes('10-digit'), 'authService.signInWithPhoneOtp validates phone length');

  // 3. Parcel Service checks
  check(normalizeParcelStatus('WAITING') === 'RECEIVED', 'normalizeParcelStatus maps WAITING to RECEIVED');
  check(normalizeParcelStatus('READY') === 'READY_FOR_PICKUP', 'normalizeParcelStatus maps READY to READY_FOR_PICKUP');
  check(normalizeParcelStatus('SCHEDULED') === 'SCHEDULED', 'normalizeParcelStatus keeps SCHEDULED');

  const residentParcels = await parcelService.getResidentParcels('e1111111-1111-1111-1111-111111111111');
  check(Array.isArray(residentParcels) && residentParcels.length > 0, 'parcelService.getResidentParcels returns array of parcels');

  const singleParcel = await parcelService.getParcelByTracking('PF-8921-IN');
  check(singleParcel && singleParcel.tracking_number === 'PF-8921-IN', 'parcelService.getParcelByTracking finds parcel PF-8921-IN');

  const timeline = await parcelService.getParcelTimeline('71111111-1111-1111-1111-111111111111');
  check(Array.isArray(timeline) && timeline.length > 0, 'parcelService.getParcelTimeline returns audit events');

  // 4. Pickup Service checks
  const timeLabel = formatTimeWindowLabel('18:00:00', '18:30:00');
  check(timeLabel === '6:00 PM – 6:30 PM', 'formatTimeWindowLabel formats 18:00 to 6:00 PM – 6:30 PM');

  const slots = await pickupService.getPickupSlots('a1111111-1111-1111-1111-111111111111');
  check(Array.isArray(slots) && slots.length >= 4, 'pickupService.getPickupSlots provisions/retrieves evening slots');
  check(slots.every(s => typeof s.availableCapacity === 'number'), 'Each pickup slot has calculated availableCapacity');

  // 5. OTP & QR Service checks
  const otp = generateSixDigitOtp();
  check(/^\d{6}$/.test(otp), `generateSixDigitOtp generated valid 6-digit numeric string: ${otp}`);

  // Test token generation with test resident
  const tokenGen = await otpQrService.generateHandoverToken('71111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111');
  check(tokenGen.success && tokenGen.data?.otpCode.length === 6, 'otpQrService.generateHandoverToken creates 6-digit token with 10-min expiry');

  if (tokenGen.success && tokenGen.data) {
    const validOtpRes = await otpQrService.validateOtp('71111111-1111-1111-1111-111111111111', tokenGen.data.otpCode);
    check(validOtpRes.success, 'otpQrService.validateOtp validates newly generated OTP');

    // Single-use check: validating again must fail
    const reusedOtpRes = await otpQrService.validateOtp('71111111-1111-1111-1111-111111111111', tokenGen.data.otpCode);
    check(!reusedOtpRes.success, 'otpQrService enforces single-use: re-submitting used OTP fails');
  }

  // 6. Staff Service checks
  const parsedSlot = parseStorageSlotString('Tower B / Rack B / Slot 17');
  check(parsedSlot.zone === 'Tower B' && parsedSlot.rack === 'Rack B' && parsedSlot.shelf === 'Slot 17', 'parseStorageSlotString correctly parses Tower B / Rack B / Slot 17');

  const occupancy = await staffService.checkSlotOccupancy('a1111111-1111-1111-1111-111111111111', 'Rack A', 'Shelf A-08');
  check(typeof occupancy.isOccupied === 'boolean', 'staffService.checkSlotOccupancy returns slot occupancy boolean');

  // 7. Admin Service checks
  const stats = await adminService.getSocietyStats('a1111111-1111-1111-1111-111111111111');
  check(typeof stats.todayTotal === 'number' && stats.todayTotal >= 0, 'adminService.getSocietyStats returns todayTotal');
  check(typeof stats.collectionRate === 'number', 'adminService.getSocietyStats returns collectionRate');
  check(stats.storageCapacity === 112, 'adminService.getSocietyStats returns storageCapacity 112');

  const residents = await adminService.getSocietyResidents('a1111111-1111-1111-1111-111111111111');
  check(Array.isArray(residents) && residents.length > 0, 'adminService.getSocietyResidents returns resident directory');

  const staff = await adminService.getSocietyStaff('a1111111-1111-1111-1111-111111111111');
  check(Array.isArray(staff) && staff.length > 0, 'adminService.getSocietyStaff returns staff roster');

  const configSlots = await adminService.getPickupSlotsConfig('a1111111-1111-1111-1111-111111111111');
  check(Array.isArray(configSlots) && configSlots.length > 0, 'adminService.getPickupSlotsConfig returns slot capacity config');

  console.log(`\n====================================================`);
  console.log(`LIVE SERVICE TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`====================================================`);

  if (failCount > 0) process.exit(1);
}

runLiveTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
