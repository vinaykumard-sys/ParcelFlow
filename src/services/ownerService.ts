// ============================================================================
// PARCELFLOW PLATFORM OWNER & ADMIN DELEGATION SERVICE
// (src/services/ownerService.ts)
//
// App Owner Privileges (vinaykumard45678@gmail.com):
// - Appoint Society Admins with Real Name, Email & 10-digit Phone
// - Generates secure 6-digit Admin Activation OTP
// - Universal Persona Switcher (Owner, Society Admin, Security, Resident)
// - Direct Owner UPI Configuration (vinaykumard45678@okhdfcbank)
// ============================================================================

import { supabase } from './supabaseClient';
import { FIXED_ADMIN_EMAIL } from './authService';

export const APP_OWNER_EMAIL = FIXED_ADMIN_EMAIL.toLowerCase(); // 'vinaykumard45678@gmail.com'

export interface AdminInvitation {
  id: string;
  email: string;
  phone: string; // 10-digit mobile
  fullName: string;
  societyId: string;
  societyName: string;
  otpCode: string; // 6-digit activation code
  createdAt: string;
  expiresAt: string;
  status: 'PENDING' | 'ACTIVATED' | 'REVOKED';
}

export interface OwnerUpiConfig {
  upiId: string;
  payeeName: string;
  bankName: string;
}

const STORAGE_INVITES_KEY = 'parcelflow_admin_invitations_v2';
const STORAGE_OWNER_UPI_KEY = 'parcelflow_owner_upi_config_v2';

export const DEFAULT_OWNER_UPI: OwnerUpiConfig = {
  upiId: 'vinaykumard45678@okhdfcbank',
  payeeName: 'Vinay Kumar',
  bankName: 'HDFC Bank',
};

/**
 * Checks if the given email corresponds to the Platform Owner (Vinay Kumar)
 */
export function isAppOwner(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === APP_OWNER_EMAIL;
}

/**
 * Validate standard 10-digit Indian phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const clean = phone.replace(/[\s\-\+]/g, '');
  const digits = clean.startsWith('91') && clean.length === 12 ? clean.slice(2) : clean;
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Format 10-digit phone to standard +91 XXXXX XXXXX
 */
export function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/[\s\-\+]/g, '');
  const digits = clean.startsWith('91') && clean.length === 12 ? clean.slice(2) : clean;
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Validate flat / unit format
 */
export function isValidFlatNumber(flat: string): boolean {
  if (!flat) return false;
  const clean = flat.trim();
  // Valid patterns: "A-402", "Tower A · Flat 402", "B-1204", "Flat 301", "C-201"
  return /^[A-Za-z0-9\s·\-\.]{2,20}$/.test(clean);
}

/**
 * Retrieve all Admin Invitations issued by Owner
 */
export function getAdminInvitations(): AdminInvitation[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_INVITES_KEY);
      if (saved) return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Issue a new Society Admin invitation with 6-digit OTP
 */
export async function createAdminInvite(params: {
  email: string;
  phone: string;
  fullName: string;
  societyId: string;
  societyName: string;
}): Promise<{ success: boolean; invite?: AdminInvitation; error?: string }> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.fullName.trim();
  const cleanPhone = params.phone.replace(/[\s\-\+]/g, '');
  const digits = cleanPhone.startsWith('91') && cleanPhone.length === 12 ? cleanPhone.slice(2) : cleanPhone;

  if (cleanName.length < 3) {
    return { success: false, error: 'Full name must be at least 3 characters long.' };
  }
  if (!isValidPhoneNumber(digits)) {
    return { success: false, error: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // Generate 6-digit numeric activation OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days validity

  const newInvite: AdminInvitation = {
    id: `inv-${Date.now()}`,
    email: cleanEmail,
    phone: formatPhoneNumber(digits),
    fullName: cleanName,
    societyId: params.societyId,
    societyName: params.societyName,
    otpCode,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'PENDING',
  };

  try {
    const list = getAdminInvitations();
    // Replace any existing invite for this email
    const filtered = list.filter((inv) => inv.email !== cleanEmail);
    filtered.unshift(newInvite);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_INVITES_KEY, JSON.stringify(filtered));
    }

    // Also attempt saving to Supabase if table exists
    try {
      await supabase.from('admin_invitations').upsert(
        {
          email: cleanEmail,
          phone: newInvite.phone,
          full_name: cleanName,
          society_id: params.societyId,
          otp_code: otpCode,
          status: 'PENDING',
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: 'email' }
      );
    } catch {
      // ignore
    }

    return { success: true, invite: newInvite };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to generate invitation.' };
  }
}

/**
 * Revoke an admin invitation
 */
export function revokeAdminInvite(inviteId: string): boolean {
  try {
    const list = getAdminInvitations();
    const updated = list.map((inv) =>
      inv.id === inviteId ? { ...inv, status: 'REVOKED' as const } : inv
    );
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_INVITES_KEY, JSON.stringify(updated));
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Verify an admin invitation code when someone logs in or registers
 */
export async function verifyAndActivateAdminCode(
  email: string,
  otpCode: string
): Promise<{ success: boolean; invite?: AdminInvitation; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otpCode.trim();

  const list = getAdminInvitations();
  const matched = list.find(
    (inv) =>
      inv.email.toLowerCase() === cleanEmail &&
      inv.otpCode === cleanOtp &&
      inv.status === 'PENDING'
  );

  if (!matched) {
    return {
      success: false,
      error: 'Invalid or expired Admin Activation Code. Please contact App Owner Vinay Kumar.',
    };
  }

  // Check expiration
  if (new Date(matched.expiresAt).getTime() < Date.now()) {
    return {
      success: false,
      error: 'Admin Activation Code has expired. Please request a new invite from Vinay.',
    };
  }

  // Mark as activated
  const updated = list.map((inv) =>
    inv.id === matched.id ? { ...inv, status: 'ACTIVATED' as const } : inv
  );
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_INVITES_KEY, JSON.stringify(updated));
  }

  // Update profile in Supabase if exists
  try {
    await supabase
      .from('profiles')
      .update({
        role: 'SOCIETY_ADMIN',
        society_id: matched.societyId,
      })
      .eq('email', cleanEmail);
  } catch {
    // ignore
  }

  return { success: true, invite: { ...matched, status: 'ACTIVATED' } };
}

/**
 * Get configured Owner UPI details
 */
export function getOwnerUpiConfig(): OwnerUpiConfig {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_OWNER_UPI_KEY);
      if (saved) return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return DEFAULT_OWNER_UPI;
}

/**
 * Save / Update Owner UPI ID
 */
export function saveOwnerUpiConfig(config: Partial<OwnerUpiConfig>): OwnerUpiConfig {
  const current = getOwnerUpiConfig();
  const updated: OwnerUpiConfig = {
    ...current,
    ...config,
  };
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_OWNER_UPI_KEY, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }
  return updated;
}
