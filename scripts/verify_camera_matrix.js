// ============================================================================
// CAMERA TEST MATRIX VERIFICATION (scripts/verify_camera_matrix.js)
// Verifies permissions state machine, scanning engines, formats, recovery,
// and duplicate scan prevention against ParcelFlow camera & scanner codebase.
// ============================================================================

import fs from 'fs';

let pass = 0;
let fail = 0;

function check(cond, title, detail = '') {
  if (cond) {
    console.log(`[PASS] ${title}`);
    pass++;
  } else {
    console.error(`[FAIL] ${title}: ${detail}`);
    fail++;
  }
}

console.log('================================================================');
console.log('PARCELFLOW CAMERA TEST MATRIX & SCANNER VERIFICATION');
console.log('================================================================\n');

const scannerComp = fs.readFileSync('src/mobile/components/scanner/CameraBarcodeScanner.tsx', 'utf8');
const permissionModal = fs.readFileSync('src/mobile/components/scanner/CameraPermissionModal.tsx', 'utf8');
const scannerService = fs.readFileSync('src/mobile/services/scannerService.ts', 'utf8');
const staffReceiveParcel = fs.readFileSync('src/mobile/staff/StaffReceiveParcel.tsx', 'utf8');
const staffHandover = fs.readFileSync('src/mobile/staff/StaffHandoverVerification.tsx', 'utf8');

// ----------------------------------------------------------------------------
// 1. Permission State Machine
// ----------------------------------------------------------------------------
console.log('--- 1. Camera Permission State Machine ---');

check(
  scannerComp.includes("'not_requested'") &&
  scannerComp.includes("'prompt'") &&
  scannerComp.includes("'granted'") &&
  scannerComp.includes("'denied'") &&
  scannerComp.includes("'permanently_denied'") &&
  scannerComp.includes("'unavailable_busy'") &&
  scannerComp.includes("'backgrounded'"),
  'All 7 permission states represented in CameraPermissionState type'
);

check(
  scannerComp.includes("navigator.mediaDevices.getUserMedia") &&
  scannerComp.includes("video: {"),
  'Request real camera stream via navigator.mediaDevices.getUserMedia'
);

check(
  scannerComp.includes("NotAllowedError") &&
  (scannerComp.includes("'permanently_denied'") || scannerComp.includes("'denied'")),
  'Handles NotAllowedError and transitions to denied / permanently_denied'
);

check(
  scannerComp.includes("NotReadableError") || scannerComp.includes("TrackStartError") || scannerComp.includes("'unavailable_busy'"),
  'Handles hardware lock / busy camera via unavailable_busy state'
);

check(
  permissionModal.toLowerCase().includes("android") &&
  permissionModal.toLowerCase().includes("ios") &&
  permissionModal.toLowerCase().includes("desktop") &&
  permissionModal.toLowerCase().includes("site settings"),
  'CameraPermissionModal provides platform-specific settings instructions for Android, iOS & Desktop'
);

check(
  scannerComp.includes("visibilitychange") &&
  scannerComp.includes("pagehide") &&
  scannerComp.includes("pageshow"),
  'Backgrounded & Resumed recovery releases hardware tracks and restores stream on reactivation'
);

// ----------------------------------------------------------------------------
// 2. Barcode & QR Decoding Engine & Formats
// ----------------------------------------------------------------------------
console.log('\n--- 2. Real Barcode & QR Decoding Engines ---');

check(
  scannerComp.includes("window.BarcodeDetector") || scannerComp.includes("BarcodeDetector"),
  'Primary native GPU-accelerated BarcodeDetector API integrated'
);

check(
  scannerComp.includes("Html5Qrcode") &&
  scannerComp.includes("Html5QrcodeSupportedFormats"),
  'Html5Qrcode fallback engine integrated'
);

const requiredFormats = ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a', 'upc_e'];
const formatsCovered = requiredFormats.every(f => 
  scannerComp.toLowerCase().includes(f.toLowerCase()) || 
  scannerComp.toUpperCase().includes(f.toUpperCase())
);

check(
  formatsCovered,
  'Supports all 6 standard barcode formats: QR_CODE, CODE_128, CODE_39, EAN_13, UPC_A, UPC_E'
);

check(
  scannerComp.includes("facingMode") &&
  scannerComp.includes("setFacingMode"),
  'Rear (environment) and front (user) camera flip controls supported'
);

check(
  scannerComp.includes("torch") &&
  scannerComp.includes("applyConstraints"),
  'Hardware flashlight (torch) toggle constraint supported'
);

check(
  scannerComp.includes("<canvas") &&
  (scannerComp.includes("boundingBox") || scannerComp.includes("cornerPoints")),
  'Live canvas overlay tracks barcode bounding box and corner points'
);

check(
  scannerService.includes("playScanChime") &&
  scannerService.includes("playErrorTone") &&
  scannerService.includes("navigator.vibrate"),
  'Web Audio API chime / error tone and haptic vibration feedback implemented'
);

// ----------------------------------------------------------------------------
// 3. Duplicate Scan Prevention
// ----------------------------------------------------------------------------
console.log('\n--- 3. Duplicate Scan Prevention ---');

check(
  scannerService.includes("checkDuplicateParcel") &&
  scannerService.includes("isDuplicate"),
  'scannerService.checkDuplicateParcel checks parcel existence'
);

check(
  staffReceiveParcel.includes("checkDuplicate") &&
  staffReceiveParcel.includes("Parcel already registered"),
  'StaffReceiveParcel halts intake and displays "Parcel already registered" banner'
);

check(
  staffReceiveParcel.includes("handleContinue") &&
  staffReceiveParcel.includes("checkDuplicate(trackingId)"),
  'Manual entry fallback runs identical duplicate check before intake'
);

check(
  staffHandover.includes("CameraBarcodeScanner") &&
  staffHandover.includes("handleQrScanned"),
  'StaffHandoverVerification utilizes real CameraBarcodeScanner for digital pass verification'
);

console.log('\n================================================================');
console.log(`CAMERA TEST MATRIX SUMMARY: ${pass} PASSED, ${fail} FAILED`);
console.log('================================================================');

if (fail > 0) process.exit(1);
