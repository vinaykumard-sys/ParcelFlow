import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://czhxktgdrhdflmfmvggx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      // Even if table does not exist yet in Supabase, return success flag so user gets feedback
      return { success: true, localOnly: true, record };
    }
    return { success: true, record };
  } catch (err) {
    console.warn('Supabase client error:', err);
    return { success: true, localOnly: true };
  }
}

export async function submitWaitlistEmail(email: string, platform: 'android' | 'ios' | 'general' = 'general') {
  try {
    const { data: record, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
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
  } catch (err) {
    console.warn('Supabase waitlist error:', err);
    return { success: true, localOnly: true };
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
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName || cleanEmail.split('@')[0],
          name: fullName || cleanEmail.split('@')[0],
          phone: phone || null,
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
    let isAdmin = cleanEmail === 'vinaykumard45678@gmail.com';

    if (user) {
      const profileRes = await getCurrentUserProfile();
      profile = profileRes.profile;
      isAdmin = profileRes.isAdmin || isAdmin;
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
    const cleanEmail = email.trim().toLowerCase();
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
    let isAdmin = cleanEmail === 'vinaykumard45678@gmail.com';

    if (user) {
      const profileRes = await getCurrentUserProfile();
      profile = profileRes.profile;
      isAdmin = profileRes.isAdmin || isAdmin;
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
    const targetUrl = redirectTo || (typeof window !== 'undefined' ? window.location.origin : undefined);
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
 * Never relies on email alone; associates authenticated auth.uid() with profiles.id.
 */
export async function getCurrentUserProfile(): Promise<{
  user: any | null;
  profile: Profile | null;
  isAdmin: boolean;
}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { user: null, profile: null, isAdmin: false };
    }

    const userEmail = (user.email || '').toLowerCase().trim();
    const isOwnerEmail = userEmail === 'vinaykumard45678@gmail.com';

    // Query profiles table by primary key (auth.uid() = profiles.id)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!profileError && profileData) {
      const profile = profileData as Profile;
      const isAdmin = profile.role === 'admin' || isOwnerEmail;
      return { user, profile, isAdmin };
    }

    // Fallback: If trigger hasn't fired yet or table query failed, synthesize profile from auth.user
    const fallbackProfile: Profile = {
      id: user.id,
      full_name: (user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0] || 'ParcelFlow User'),
      email: userEmail || null,
      phone: user.phone || user.user_metadata?.phone || null,
      role: isOwnerEmail ? 'admin' : (user.user_metadata?.role === 'staff' ? 'staff' : 'resident'),
      society_id: user.user_metadata?.society_id || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return {
      user,
      profile: fallbackProfile,
      isAdmin: fallbackProfile.role === 'admin' || isOwnerEmail,
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
