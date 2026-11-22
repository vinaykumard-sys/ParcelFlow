// ============================================================================
// PARCELFLOW DIRECT UPI PAYMENT SYSTEM
// (src/services/upiPaymentService.ts)
//
// Direct bank-to-bank settlement to Owner's UPI ID (vinaykumard45678@okhdfcbank)
// with 0% gateway commission, instant credit, GPay/PhonePe/Paytm/BHIM deep links,
// and real-time dynamic QR code generation.
// ============================================================================

import { getOwnerUpiConfig, DEFAULT_OWNER_UPI } from './ownerService';

export interface UpiPaymentRequest {
  amount: number;
  transactionNote: string;
  societyName?: string;
  residentName?: string;
  referenceId?: string;
  customUpiId?: string;
  customPayeeName?: string;
}

export interface UpiPaymentDetails {
  upiDeepLink: string;
  qrCodeUrl: string;
  payeeUpiId: string;
  payeeName: string;
  amount: number;
  formattedAmount: string;
  transactionNote: string;
  referenceId: string;
}

/**
 * Generate standard NPCI UPI Intent Link
 * Format: upi://pay?pa=<VPA>&pn=<Name>&am=<Amount>&cu=INR&tn=<Note>&tr=<RefId>
 */
export function generateUpiDeepLink(req: UpiPaymentRequest): string {
  const config = getOwnerUpiConfig();
  const upiId = (req.customUpiId || config.upiId || DEFAULT_OWNER_UPI.upiId).trim();
  const payeeName = (req.customPayeeName || config.payeeName || DEFAULT_OWNER_UPI.payeeName).trim();
  const amountStr = req.amount.toFixed(2);
  const refId = req.referenceId || `PF-${Date.now().toString(36).toUpperCase()}`;
  const note = req.transactionNote || `ParcelFlow Payment ${refId}`;

  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amountStr,
    cu: 'INR',
    tn: note,
    tr: refId,
  });

  return `upi://pay?${params.toString()}`;
}

/**
 * Generate high-resolution Dynamic QR Code for scanning with any UPI app
 */
export function generateUpiQrCodeUrl(upiDeepLink: string, size: number = 320): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(upiDeepLink)}`;
}

/**
 * Create full payment payload for checkout modals
 */
export function prepareUpiPayment(req: UpiPaymentRequest): UpiPaymentDetails {
  const config = getOwnerUpiConfig();
  const upiId = (req.customUpiId || config.upiId || DEFAULT_OWNER_UPI.upiId).trim();
  const payeeName = (req.customPayeeName || config.payeeName || DEFAULT_OWNER_UPI.payeeName).trim();
  const refId = req.referenceId || `PF-${Date.now().toString(36).toUpperCase()}`;
  const deepLink = generateUpiDeepLink({ ...req, referenceId: refId });
  const qrUrl = generateUpiQrCodeUrl(deepLink);

  return {
    upiDeepLink: deepLink,
    qrCodeUrl: qrUrl,
    payeeUpiId: upiId,
    payeeName,
    amount: req.amount,
    formattedAmount: `₹${req.amount.toLocaleString('en-IN')}`,
    transactionNote: req.transactionNote,
    referenceId: refId,
  };
}

/**
 * Trigger UPI Payment App directly on Android devices
 * Opens installed UPI apps (Google Pay, PhonePe, Paytm, BHIM, CRED, Navi)
 */
export function openUpiIntent(upiDeepLink: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Create an invisible anchor element with the upi:// protocol
    const a = document.createElement('a');
    a.href = upiDeepLink;
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {}
    }, 1000);
    return true;
  } catch (err) {
    console.warn('UPI Intent Launch Note:', err);
    // Fallback: direct window.location
    try {
      window.location.href = upiDeepLink;
      return true;
    } catch {
      return false;
    }
  }
}
