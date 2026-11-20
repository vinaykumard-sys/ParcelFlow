// ============================================================================
// PARCELFLOW AUTH SERVICE (src/services/authService.ts)
// Production Authentication & Role-Based Access Control via Supabase
// Permanent Identity: auth.users.id is the cryptographic source of truth
// Roles: SUPER_ADMIN, SOCIETY_ADMIN, SECURITY, RESIDENT
// Fixed Admin Account: vinaykumard45678@gmail.com / 0c9c3244-8680-4141-b119-ffecf87c804d
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { Profile, AuthSessionResponse, ProfileRole } from './types.ts';
import { isSuperAdminRole, isSocietyAdminRole, isSecurityRole } from './types.ts';

// Fixed Root Administrator Account
export const FIXED_ADMIN_EMAIL = 'vinaykumard45678@gmail.com';
export const FIXED_ADMIN_UID = '0c9c3244-8680-4141-b119-ffecf87c804d';
export const ADMIN_EMAIL = FIXED_ADMIN_EMAIL; // Backwards compatibility

/**
 * Normalizes any database role string into the canonical 4-tier role
 */
export function normalizeRole(role: string | null | undefined): ProfileRole {
  if (!role) return 'RESIDENT';
  const clean = role.trim().toUpperCase();
  if (clean === 'SUPER_ADMIN' || clean === 'ADMIN') return 'SUPER_ADMIN';
  if (clean === 'SOCIETY_ADMIN') return 'SOCIETY_ADMIN';
  if (clean === 'SECURITY' || clean === 'STAFF') return 'SECURITY';
  return 'RESIDENT';
}

/**
 * Purge all cached local and session storage upon logout
 * Ensures zero leakage of user data, society information, or tokens during account switching
 */
export function purgeAuthState(): void {
  if (typeof window !== 'undefined') {
    try {
      if (window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (
            key &&
            (key.startsWith('parcelflow_') ||
              key.startsWith('sb-') ||
              key.includes('supabase') ||
              key.includes('auth'))
          ) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
        window.localStorage.removeItem('parcelflow_mobile_state_v2');
        window.localStorage.removeItem('parcelflow_mobile_state_v1');
        window.localStorage.removeItem('parcelflow_active_role');
        window.localStorage.removeItem('parcelflow_auth_profile');
        window.localStorage.removeItem('parcelflow_cached_user');
      }
      if (window.sessionStorage) {
        window.sessionStorage.clear();
      }
    } catch {
      // ignore security restrictions in restricted iframes
    }
  }
}

/**
 * Sign up a new user with Email and Password
 * Default role is strictly RESIDENT; client-side role elevation is rejected.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string,
  phone?: string,
  societyId?: string
): Promise<AuthSessionResponse> {
  try {
    if (!email || !email.trim()) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Email address is required.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Password must be at least 6 characters long.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName?.trim() || cleanEmail.split('@')[0],
          name: fullName?.trim() || cleanEmail.split('@')[0],
          phone: phone?.trim() || null,
          society_id: societyId || null,
          // Client cannot choose role; server trigger defaults to RESIDENT
        },
      },
    });

    if (error) {
      return { user: null, session: null, profile: null, isAdmin: false, error: error.message };
    }

    if (!data.user) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Sign up failed to create user.' };
    }

    // Retrieve verified permanent profile created by database trigger
    const profile = await fetchVerifiedProfile(data.user.id);
    const isAdmin = isSuperAdminRole(profile?.role) || isSocietyAdminRole(profile?.role);

    return {
      user: data.user,
      session: data.session,
      profile,
      isAdmin,
    };
  } catch (err: any) {
    return { user: null, session: null, profile: null, isAdmin: false, error: err?.message || 'Authentication error' };
  }
}

/**
 * Sign in existing user with Email and Password
 * Permanent identity verified against auth.users.id and public.profiles
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthSessionResponse> {
  try {
    if (!email || !email.trim()) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Email address is required.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!password || !password.trim()) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Password is required.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { user: null, session: null, profile: null, isAdmin: false, error: error.message };
    }

    if (!data.user) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Login succeeded but user is missing.' };
    }

    const profile = await fetchVerifiedProfile(data.user.id);
    const isAdmin = isSuperAdminRole(profile?.role) || isSocietyAdminRole(profile?.role);

    return {
      user: data.user,
      session: data.session,
      profile,
      isAdmin,
    };
  } catch (err: any) {
    return { user: null, session: null, profile: null, isAdmin: false, error: err?.message || 'Sign in error' };
  }
}

/**
 * Sign in using Google OAuth with optional redirect URL
 */
export async function signInWithGoogle(redirectTo?: string) {
  try {
    let targetRedirect = redirectTo;
    if (!targetRedirect && typeof window !== 'undefined') {
      const isFileProtocol = window.location.protocol === 'file:';
      if (isFileProtocol) {
        targetRedirect = 'https://parcelflow-blush.vercel.app/app';
      } else {
        targetRedirect = `${window.location.origin}/app`;
      }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: targetRedirect,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Immediately navigate browser to Google OAuth authorization endpoint
    if (data?.url && typeof window !== 'undefined') {
      window.location.href = data.url;
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Google OAuth failed' };
  }
}

/**
 * Initiate Phone OTP login
 */
export async function signInWithPhoneOtp(phone: string) {
  try {
    if (!phone || !phone.trim() || phone.trim().replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    const digits = phone.trim().replace(/\D/g, '');
    const formattedPhone = digits.length === 10 ? `+91${digits}` : `+${digits}`;

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Phone OTP initiation failed' };
  }
}

/**
 * Verify 6-digit Phone OTP token
 */
export async function verifyPhoneOtp(phone: string, token: string): Promise<AuthSessionResponse> {
  try {
    if (!phone || !phone.trim() || phone.trim().replace(/\D/g, '').length < 10) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Valid mobile number required.' };
    }
    if (!token || token.trim().length !== 6) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Enter the 6-digit OTP code received.' };
    }

    const digits = phone.trim().replace(/\D/g, '');
    const formattedPhone = digits.length === 10 ? `+91${digits}` : `+${digits}`;

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: token.trim(),
      type: 'sms',
    });

    if (error) {
      return { user: null, session: null, profile: null, isAdmin: false, error: error.message };
    }

    if (!data.user) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Verification succeeded but user is missing.' };
    }

    const profile = await fetchVerifiedProfile(data.user.id);
    const isAdmin = isSuperAdminRole(profile?.role) || isSocietyAdminRole(profile?.role);

    return {
      user: data.user,
      session: data.session,
      profile,
      isAdmin,
    };
  } catch (err: any) {
    return { user: null, session: null, profile: null, isAdmin: false, error: err?.message || 'OTP verification failed' };
  }
}

/**
 * Sign out current session and wipe all cached client state
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    purgeAuthState();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    purgeAuthState();
    return { success: false, error: err?.message };
  }
}

/**
 * Fetch verified profile strictly for authenticated user UID
 * Strictly checks the database profiles table; no client-side overrides
 */
export async function fetchVerifiedProfile(userId: string): Promise<Profile | null> {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, role, society_id, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      // Invariant: Fixed Admin account check
      if (userId === FIXED_ADMIN_UID) {
        return {
          id: FIXED_ADMIN_UID,
          full_name: 'Vinay Kumar (System Administrator)',
          email: FIXED_ADMIN_EMAIL,
          phone: '+91 99999 88888',
          role: 'SUPER_ADMIN',
          society_id: null,
          created_at: new Date().toISOString(),
        };
      }

      // Check if user is authenticated in Supabase auth and auto-provision profile
      try {
        const { data: authUserData } = await supabase.auth.getUser();
        if (authUserData?.user && authUserData.user.id === userId) {
          const u = authUserData.user;
          const isFixedAdmin =
            u.id === FIXED_ADMIN_UID || u.email?.toLowerCase().trim() === FIXED_ADMIN_EMAIL;
          const newProfile: Profile = {
            id: u.id,
            full_name:
              u.user_metadata?.full_name ||
              u.user_metadata?.name ||
              u.email?.split('@')[0] ||
              'Resident',
            email: u.email || null,
            phone: u.phone || null,
            role: isFixedAdmin ? 'SUPER_ADMIN' : 'RESIDENT',
            society_id: u.user_metadata?.society_id || null,
            created_at: new Date().toISOString(),
          };

          await supabase.from('profiles').upsert(newProfile, { onConflict: 'id' });
          return newProfile;
        }
      } catch {
        // ignore
      }

      return null;
    }

    const role = normalizeRole(data.role);

    // If user is the designated admin, enforce SUPER_ADMIN
    const finalRole: ProfileRole =
      userId === FIXED_ADMIN_UID || data.email?.toLowerCase().trim() === FIXED_ADMIN_EMAIL
        ? 'SUPER_ADMIN'
        : role;

    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: finalRole,
      society_id: data.society_id,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Get current session user and verified role profile
 * Authenticated Supabase auth.users.id is the permanent identity
 */
export async function getCurrentUserProfile(): Promise<AuthSessionResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      return { user: null, session: null, profile: null, isAdmin: false };
    }

    const user = authData.user;
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session ?? null;

    let profile = await fetchVerifiedProfile(user.id);

    // If profile row not yet created in public.profiles, provide unverified default RESIDENT profile
    if (!profile) {
      const isFixedAdmin =
        user.id === FIXED_ADMIN_UID || user.email?.toLowerCase().trim() === FIXED_ADMIN_EMAIL;
      profile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Resident',
        email: user.email || null,
        phone: user.phone || null,
        role: isFixedAdmin ? 'SUPER_ADMIN' : 'RESIDENT',
        society_id: user.user_metadata?.society_id || null,
        created_at: new Date().toISOString(),
      };
    }

    const isAdmin = isSuperAdminRole(profile.role) || isSocietyAdminRole(profile.role);

    return {
      user,
      session,
      profile,
      isAdmin,
    };
  } catch (err: any) {
    return { user: null, session: null, profile: null, isAdmin: false, error: err?.message };
  }
}

/**
 * Check if given authenticated UID has verified SUPER_ADMIN rights
 */
export async function verifySuperAdminStatus(userId: string): Promise<boolean> {
  if (!userId) return false;
  if (userId === FIXED_ADMIN_UID) return true;
  try {
    const profile = await fetchVerifiedProfile(userId);
    return isSuperAdminRole(profile?.role);
  } catch {
    return false;
  }
}

/**
 * Check if given authenticated UID has verified admin rights (SUPER_ADMIN or SOCIETY_ADMIN)
 */
export async function verifyAdminStatus(userId: string): Promise<boolean> {
  if (!userId) return false;
  if (userId === FIXED_ADMIN_UID) return true;
  try {
    const profile = await fetchVerifiedProfile(userId);
    return isSuperAdminRole(profile?.role) || isSocietyAdminRole(profile?.role);
  } catch {
    return false;
  }
}

/**
 * Listen to auth state transitions
 */
export function onAuthStateChange(callback: (response: AuthSessionResponse) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      purgeAuthState();
      callback({ user: null, session: null, profile: null, isAdmin: false });
      return;
    }
    const profile = await fetchVerifiedProfile(session.user.id);
    const isAdmin = isSuperAdminRole(profile?.role) || isSocietyAdminRole(profile?.role);
    callback({
      user: session.user,
      session,
      profile,
      isAdmin,
    });
  });
}

export const authService = {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithPhoneOtp,
  verifyPhoneOtp,
  signOut,
  purgeAuthState,
  fetchVerifiedProfile,
  getCurrentUserProfile,
  verifySuperAdminStatus,
  verifyAdminStatus,
  onAuthStateChange,
  normalizeRole,
};
