import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface PilotRequestData {
  society_name: string;
  city: string;
  total_units: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  role: string;
  notes?: string;
}

export async function submitPilotRequest(data: PilotRequestData) {
  try {
    if (!data.society_name?.trim() || !data.contact_name?.trim()) {
      return { success: false, error: 'Society name and contact name are required.' };
    }
    if (!data.contact_phone?.trim() || data.contact_phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Valid 10-digit mobile number required.' };
    }

    const { data: record, error } = await supabase
      .from('pilot_requests')
      .insert([
        {
          ...data,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase pilot_requests insert notice:', error.message);
      return { success: true, localOnly: true, record };
    }
    return { success: true, record };
  } catch (err: any) {
    console.warn('Supabase client error:', err);
    return { success: true, localOnly: true, error: err?.message };
  }
}

export async function submitWaitlistEmail(email: string, platform: 'android' | 'ios' | 'general' = 'general') {
  try {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, error: 'Valid email address required.' };
    }

    const { data: record, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: trimmed,
          platform,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase waitlist insert notice:', error.message);
      return { success: true, localOnly: true, record };
    }
    return { success: true, record };
  } catch (err: any) {
    console.warn('Supabase waitlist error:', err);
    return { success: true, localOnly: true, error: err?.message };
  }
}

// ============================================================================
// PROFILE & AUTH TYPES
// ============================================================================

export type ProfileRole = 'resident' | 'staff' | 'admin';

export interface Profile {
  id: string; // references auth.users(id)
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: ProfileRole;
  society_id: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface AuthSessionResponse {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  isAdmin: boolean;
  error?: string | null;
}

// ============================================================================
// PRODUCTION SUPABASE AUTHENTICATION HELPERS
// ============================================================================

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

    const user = data.user;
    const session = data.session;
    let profile: Profile | null = null;
    let isAdmin = false;

    if (user) {
      const profileRes = await getCurrentUserProfile();
      profile = profileRes.profile;
      isAdmin = profileRes.isAdmin;
    }

    return { user, session, profile, isAdmin, error: null };
  } catch (err: any) {
    return { user: null, session: null, profile: null, isAdmin: false, error: err.message || 'Unknown sign up error' };
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthSessionResponse> {
  try {
    if (!email || !email.trim()) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Email address is required.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!password) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Password is required.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { user: null, session: null, profile: null, isAdmin: false, error: error.message };
    }

    const user = data.user;
    const session = data.session;
    let profile: Profile | null = null;
    let isAdmin = false;

    if (user) {
      const profileRes = await getCurrentUserProfile();
      profile = profileRes.profile;
      isAdmin = profileRes.isAdmin;
    }

    return { user, session, profile, isAdmin, error: null };
  } catch (err: any) {
    return { user: null, session: null, profile: null, isAdmin: false, error: err.message || 'Unknown sign in error' };
  }
}

/**
 * Sign in with Google OAuth (Supabase Auth)
 */
export async function signInWithGoogle(redirectTo?: string): Promise<{ data: any; error: string | null }> {
  try {
    const targetUrl = redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: targetUrl,
      },
    });

    return { data, error: error ? error.message : null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Google OAuth failed' };
  }
}

/**
 * Send Phone OTP via SMS (Supabase Auth)
 */
export async function signInWithPhoneOtp(phone: string): Promise<{ data: any; error: string | null }> {
  try {
    if (!phone || !phone.trim() || phone.trim().replace(/\D/g, '').length < 10) {
      return { data: null, error: 'A valid phone number with at least 10 digits is required.' };
    }
    const cleanPhone = phone.trim();
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: cleanPhone,
    });

    return { data, error: error ? error.message : null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to send OTP' };
  }
}

/**
 * Verify SMS Phone OTP
 */
export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<AuthSessionResponse> {
  try {
    if (!phone || !phone.trim() || !token || !token.trim()) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Phone number and OTP code are required.' };
    }
    const cleanPhone = phone.trim();
    const cleanToken = token.trim();
    const { data, error } = await supabase.auth.verifyOtp({
      phone: cleanPhone,
      token: cleanToken,
      type: 'sms',
    });

    if (error) {
      return { user: null, session: null, profile: null, isAdmin: false, error: error.message };
    }

    const user = data.user;
    const session = data.session;
    let profile: Profile | null = null;
    let isAdmin = false;

    if (user) {
      const profileRes = await getCurrentUserProfile();
      profile = profileRes.profile;
      isAdmin = profileRes.isAdmin;
    }

    return { user, session, profile, isAdmin, error: null };
  } catch (err: any) {
    return { user: null, session: null, profile: null, isAdmin: false, error: err.message || 'Failed to verify OTP' };
  }
}

/**
 * Get current authenticated user and linked public.profiles record
 * Never relies on client email alone; associates authenticated auth.uid() with profiles.id.
 */
export async function getCurrentUserProfile(): Promise<{
  user: any | null;
  profile: Profile | null;
  isAdmin: boolean;
}> {
  try {
    // 1. Authenticate with Supabase Auth (cryptographically verifies session token)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { user: null, profile: null, isAdmin: false };
    }

    // 2. Strict DB query: auth.uid() = profiles.id
    // Admin privilege CANNOT be granted by email string or localStorage manipulation alone
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!profileError && profileData) {
      const profile = profileData as Profile;
      // Admin privilege is strictly determined by profiles.role in the database
      const isAdmin = profile.role === 'admin';
      return { user, profile, isAdmin };
    }

    // Fallback: If profile row is still syncing, synthesize a default non-admin resident profile
    // Note: Never elevate to admin without verified DB record
    const userEmail = (user.email || '').toLowerCase().trim();
    const fallbackProfile: Profile = {
      id: user.id,
      full_name: (user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0] || 'ParcelFlow User'),
      email: userEmail || null,
      phone: user.phone || user.user_metadata?.phone || null,
      role: 'resident',
      society_id: user.user_metadata?.society_id || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return {
      user,
      profile: fallbackProfile,
      isAdmin: false,
    };
  } catch (err) {
    console.warn('getCurrentUserProfile error:', err);
    return { user: null, profile: null, isAdmin: false };
  }
}

/**
 * Sign out the currently active session
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err.message || 'Failed to sign out' };
  }
}
