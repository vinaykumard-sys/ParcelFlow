// ============================================================================
// UI HARDENING & ROUTE PROTECTION VERIFICATION SUITE
// Tests:
// 1. Permanent Removal of Client-Side Role Switchers
// 2. Strict Route Protection & 403 Forbidden Guards
// 3. Complete State Isolation & Logout Cache Purging
// 4. Double-Tap / Duplicate Submission Prevention
// 5. Loading, Empty, Success & Failure UI States
// ============================================================================

import fs from 'fs';

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
console.log('PARCELFLOW UI HARDENING & ROLE ENFORCEMENT AUDIT');
console.log('====================================================\n');

// ----------------------------------------------------------------------------
// 1. Check for removal of client-side role switchers
// ----------------------------------------------------------------------------
console.log('--- 1. Client-Side Role Switching Removal ---');

const mobileApp = fs.readFileSync('src/mobile/MobileApp.tsx', 'utf8');
const residentSplash = fs.readFileSync('src/mobile/resident/ResidentSplash.tsx', 'utf8');
const residentProfile = fs.readFileSync('src/mobile/resident/ResidentProfileTab.tsx', 'utf8');
const staffSplash = fs.readFileSync('src/mobile/staff/StaffSplashAndLogin.tsx', 'utf8');
const staffProfile = fs.readFileSync('src/mobile/staff/StaffProfileTab.tsx', 'utf8');
const adminLogin = fs.readFileSync('src/mobile/admin/AdminLogin.tsx', 'utf8');
const adminSettings = fs.readFileSync('src/mobile/admin/AdminSettingsTab.tsx', 'utf8');
const adminNav = fs.readFileSync('admin-dashboard/src/components/Navbar.tsx', 'utf8');
const adminSidebar = fs.readFileSync('admin-dashboard/src/components/Sidebar.tsx', 'utf8');

assert(
  !mobileApp.includes('setShowRoleSwitcher(true)') && !mobileApp.includes('<RoleSwitcherModal'),
  'src/mobile/MobileApp.tsx: RoleSwitcherModal and showRoleSwitcher trigger removed',
  'Found RoleSwitcherModal in MobileApp.tsx'
);

assert(
  !residentSplash.includes('Switch to Staff / Admin App'),
  'src/mobile/resident/ResidentSplash.tsx: Switch role button removed',
  'Found switch role button in ResidentSplash'
);

assert(
  !residentProfile.includes('Switch Role Experience') && !residentProfile.includes('onSwitchRole'),
  'src/mobile/resident/ResidentProfileTab.tsx: Switch role card & prop removed',
  'Found Switch Role Experience in ResidentProfileTab'
);

assert(
  !staffSplash.includes('Switch to Resident / Admin App'),
  'src/mobile/staff/StaffSplashAndLogin.tsx: Switch role button removed',
  'Found switch role button in StaffSplashAndLogin'
);

assert(
  !staffProfile.includes('Switch Role Experience') && !staffProfile.includes('onSwitchRole'),
  'src/mobile/staff/StaffProfileTab.tsx: Switch role card & prop removed',
  'Found Switch Role Experience in StaffProfileTab'
);

assert(
  !adminLogin.includes('Switch to Resident / Staff App'),
  'src/mobile/admin/AdminLogin.tsx: Switch role button removed',
  'Found switch role button in AdminLogin'
);

assert(
  !adminSettings.includes('Switch Role Experience') && !adminSettings.includes('onSwitchRole'),
  'src/mobile/admin/AdminSettingsTab.tsx: Switch role card & prop removed',
  'Found Switch Role Experience in AdminSettingsTab'
);

assert(
  !adminSidebar.includes("'role-switcher'") && !adminSidebar.includes('"role-switcher"'),
  'admin-dashboard/src/components/Sidebar.tsx: role-switcher nav item removed',
  'Found role-switcher in Sidebar'
);

assert(
  !adminNav.includes("onSelectTab('role-switcher')"),
  'admin-dashboard/src/components/Navbar.tsx: role switcher click trigger removed',
  'Found onSelectTab(role-switcher) in Navbar'
);

// ----------------------------------------------------------------------------
// 2. Strict Route Protection & 403 Forbidden Guards
// ----------------------------------------------------------------------------
console.log('\n--- 2. Route Protection & 403 Forbidden Guards ---');

const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
const adminDashboardApp = fs.readFileSync('admin-dashboard/src/App.tsx', 'utf8');

assert(
  appTsx.includes('AdminRouteGuard') && appTsx.includes('Forbidden403Page'),
  'src/App.tsx: AdminRouteGuard protects /admin with Forbidden403Page',
  'Missing AdminRouteGuard in App.tsx'
);

assert(
  appTsx.includes('path="/admin"') && appTsx.includes('element={<AdminRouteGuard />}'),
  'src/App.tsx: Route /admin strictly mapped to AdminRouteGuard',
  'Missing /admin route mapping in App.tsx'
);

assert(
  mobileApp.includes('Forbidden403') && mobileApp.includes('isUnauthorizedAdminAttempt'),
  'src/mobile/MobileApp.tsx: Renders Forbidden403 on unauthorized portal access attempt',
  'Missing Forbidden403 in MobileApp.tsx'
);

assert(
  adminDashboardApp.includes('403 Forbidden / Access Denied'),
  'admin-dashboard/src/App.tsx: Renders 403 Forbidden when unauthorized role accesses /admin',
  'Missing 403 in admin-dashboard App.tsx'
);

// ----------------------------------------------------------------------------
// 3. State Isolation & Logout Cache Purging
// ----------------------------------------------------------------------------
console.log('\n--- 3. State Isolation & Logout Purge ---');

const mobileState = fs.readFileSync('src/mobile/services/mobileState.ts', 'utf8');

assert(
  mobileState.includes("localStorage.removeItem('parcelflow_mobile_state_v2')") &&
  mobileState.includes("localStorage.removeItem('parcelflow_auth_user')") &&
  mobileState.includes("sessionStorage.clear()"),
  'src/mobile/services/mobileState.ts: logout() purges all localStorage and sessionStorage caches',
  'Incomplete cache purge in mobileState.ts'
);

assert(
  residentProfile.includes('logout()') &&
  staffProfile.includes('logout()') &&
  adminSettings.includes('logout()'),
  'All profile and settings screens call logout() to isolate sessions on sign out',
  'Missing logout() call in profile/settings tabs'
);

// ----------------------------------------------------------------------------
// 4. Double-Tap & Submission Hardening
// ----------------------------------------------------------------------------
console.log('\n--- 4. Double-Tap & Submission Hardening ---');

const schedulePickup = fs.readFileSync('src/mobile/resident/ResidentSchedulePickup.tsx', 'utf8');
const receiveParcel = fs.readFileSync('src/mobile/staff/StaffReceiveParcel.tsx', 'utf8');
const handoverVerification = fs.readFileSync('src/mobile/staff/StaffHandoverVerification.tsx', 'utf8');

assert(
  schedulePickup.includes('if (loading) return;'),
  'ResidentSchedulePickup: Guards against double-tap submission',
  'Missing double-tap guard in ResidentSchedulePickup'
);

assert(
  receiveParcel.includes('if (submitting || !trackingId.trim()) return;') || receiveParcel.includes('if (submitting'),
  'StaffReceiveParcel: Guards against duplicate submission',
  'Missing double-tap guard in StaffReceiveParcel'
);

assert(
  handoverVerification.includes('if (isVerifying') && handoverVerification.includes('if (isVerifying || !otpInput.trim()) return;'),
  'StaffHandoverVerification: Double-tap protected for both QR and manual OTP verification',
  'Missing verification guard in StaffHandoverVerification'
);

// ----------------------------------------------------------------------------
// 5. Empty States & Retry Capabilities
// ----------------------------------------------------------------------------
console.log('\n--- 5. Empty & Loading States ---');

const residentDashboard = fs.readFileSync('src/mobile/resident/ResidentDashboard.tsx', 'utf8');
const residentParcels = fs.readFileSync('src/mobile/resident/ResidentParcelsTab.tsx', 'utf8');
const residentHistory = fs.readFileSync('src/mobile/resident/ResidentHistoryTab.tsx', 'utf8');
const staffParcels = fs.readFileSync('src/mobile/staff/StaffParcelsTab.tsx', 'utf8');
const staffHistory = fs.readFileSync('src/mobile/staff/StaffHistoryTab.tsx', 'utf8');

assert(
  residentDashboard.includes('No incoming parcels awaiting pickup'),
  'ResidentDashboard: Empty state provided when active parcels count is 0',
  'Missing empty state in ResidentDashboard'
);

assert(
  residentParcels.includes('Reset Search Filters'),
  'ResidentParcelsTab: Empty state includes Reset Filters retry action',
  'Missing reset filter button in ResidentParcelsTab'
);

assert(
  residentHistory.includes('No collection history yet'),
  'ResidentHistoryTab: Empty state provided when pickup history is empty',
  'Missing empty state in ResidentHistoryTab'
);

assert(
  staffParcels.includes('Reset Filter'),
  'StaffParcelsTab: Empty state includes Reset Filter retry action',
  'Missing empty state in StaffParcelsTab'
);

assert(
  staffHistory.includes('No handovers completed yet this shift'),
  'StaffHistoryTab: Empty state provided for empty shift handover log',
  'Missing empty state in StaffHistoryTab'
);

// ----------------------------------------------------------------------------
// 6. Safe Area & Margin Spacing Check
// ----------------------------------------------------------------------------
console.log('\n--- 6. Safe Area & Margin Spacing Check ---');

assert(
  residentDashboard.includes('pb-20') &&
  residentParcels.includes('pb-20') &&
  residentHistory.includes('pb-20') &&
  residentProfile.includes('pb-20'),
  'Resident tabs include pb-20 safe-area bottom padding to prevent bottom nav clipping',
  'Missing pb-20 in Resident tabs'
);

assert(
  staffParcels.includes('pb-20') &&
  staffHistory.includes('pb-20') &&
  staffProfile.includes('pb-20'),
  'Staff tabs include pb-20 safe-area bottom padding',
  'Missing pb-20 in Staff tabs'
);

console.log('\n====================================================');
console.log(`UI HARDENING RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
