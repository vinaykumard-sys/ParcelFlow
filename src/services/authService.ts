// ============================================================================
// PARCELFLOW AUTH SERVICE (src/services/authService.ts)
// Production Authentication & Role-Based Access Control via Supabase
// Real login: Email/password, Google OAuth, Phone OTP
// Strict Admin verification linked to authenticated UID and public.profiles
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type { Profile, AuthSessionResponse, ProfileRole } from './types.ts';

export const ADMIN_EMAIL = 'vinaykumard45678@gmail.com';

/**
 * Sign up a new user with Email and Password
 * Automatically sets up public.profiles via PostgreSQL trigger
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
        },
      },
    });

    if (error) {
      return { user: null, session: null, profile: null, isAdmin: false, error: error.message };
    }

    if (!data.user) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Sign up failed to create user.' };
    }

    // Retrieve verified profile created by trigger
    const profile = await fetchVerifiedProfile(data.user.id);
    const isAdmin = profile?.role === 'admin';

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
    const isAdmin = profile?.role === 'admin';

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
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const targetRedirect = redirectTo || `${origin}/admin`;

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
    const isAdmin = profile?.role === 'admin';

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
 * Sign out current session
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Fetch verified profile strictly for authenticated user UID
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
      return null;
    }

    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.role as ProfileRole,
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

    // If profile row not yet created in public.profiles, provide unverified default resident profile
    if (!profile) {
      profile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Resident',
        email: user.email || null,
        phone: user.phone || null,
        role: 'resident',
        society_id: user.user_metadata?.society_id || null,
        created_at: new Date().toISOString(),
      };
    }

    const isAdmin = profile.role === 'admin';

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
 * Check if given authenticated UID has verified admin rights in public.profiles
 */
export async function verifyAdminStatus(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const profile = await fetchVerifiedProfile(userId);
    return profile?.role === 'admin';
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
      callback({ user: null, session: null, profile: null, isAdmin: false });
      return;
    }
    const profile = await fetchVerifiedProfile(session.user.id);
    const isAdmin = profile?.role === 'admin';
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
  fetchVerifiedProfile,
  getCurrentUserProfile,
  verifyAdminStatus,
  onAuthStateChange,
};
