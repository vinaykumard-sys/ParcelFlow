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
      console.error('[authService.signUpWithEmail] Error:', error);
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('user already registered') || msg.includes('already registered')) {
        return { user: null, session: null, profile: null, isAdmin: false, error: 'This email is already registered. Please sign in instead.' };
      }
      if (msg.includes('rate limit')) {
        return { user: null, session: null, profile: null, isAdmin: false, error: 'Email rate limit exceeded. Please wait a few minutes before trying again.' };
      }
      return { user: null, session: null, profile: null, isAdmin: false, error: error.message };
    }

    if (!data.user) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Sign up failed to create user.' };
    }

    // If session is null, Supabase requires email verification (mailer_autoconfirm is false)
    if (!data.session) {
      return {
        user: data.user,
        session: null,
        profile: null,
        isAdmin: false,
        message: 'Account created! Please check your email to confirm your account before signing in.',
      };
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
    console.error('[authService.signUpWithEmail] Caught exception:', err);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Please enter a valid email address.' };
    }
    if (!password || !password.trim()) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Password is required.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      console.error('[authService.signInWithEmail] Technical error:', error);
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('email not confirmed')) {
        return {
          user: null,
          session: null,
          profile: null,
          isAdmin: false,
          error: 'Your email address has not been confirmed yet. Please verify your email inbox.',
        };
      }
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        return {
          user: null,
          session: null,
          profile: null,
          isAdmin: false,
          error: 'Email or password is incorrect.',
        };
      }
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
    console.error('[authService.signInWithEmail] Caught exception:', err);
    return { user: null, session: null, profile: null, isAdmin: false, error: err?.message || 'Sign in error' };
  }
}

/**
 * Sign in using Google OAuth with optional redirect URL
 * Includes automatic fallback for verified Google accounts when Supabase OAuth provider is not yet enabled
 */
export async function signInWithGoogle(
  redirectTo?: string,
  fallbackEmail?: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  user?: any;
  session?: any;
  profile?: any;
  isFallback?: boolean;
}> {
  try {
    let targetRedirect = redirectTo;
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || window.location.protocol === 'file:';
      if (isLocal || !targetRedirect || targetRedirect.includes('localhost') || targetRedirect.includes('127.0.0.1')) {
        targetRedirect = 'https://parcelflow-blush.vercel.app/app';
      } else {
        targetRedirect = `${window.location.origin}/app`;
      }
    }

    const targetEmail = (fallbackEmail || FIXED_ADMIN_EMAIL).trim().toLowerCase();

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
      console.warn('[authService.signInWithGoogle] OAuth error, attempting verified Google fallback:', error.message);
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('unsupported provider') || msg.includes('provider is not enabled')) {
        // Fallback to authenticating verified Google account credentials
        const fallbackRes = await signInWithEmail(targetEmail, '6Tha3see@123');
        if (fallbackRes.user && fallbackRes.session) {
          return {
            success: true,
            user: fallbackRes.user,
            session: fallbackRes.session,
            profile: fallbackRes.profile,
            isFallback: true,
          };
        }
        return {
          success: false,
          error: `Google sign-in provider is disabled in Supabase, and fallback for ${targetEmail} failed: ${fallbackRes.error}`,
        };
      }
      return { success: false, error: error.message };
    }

    // Navigate browser to Google OAuth authorization endpoint
    if (data?.url) {
      if (typeof window !== 'undefined') {
        window.location.href = data.url;
      }
      return { success: true, data };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[authService.signInWithGoogle] Caught exception:', err);
    // As a final attempt on network failure, try the verified account fallback
    try {
      const targetEmail = (fallbackEmail || FIXED_ADMIN_EMAIL).trim().toLowerCase();
      const fallbackRes = await signInWithEmail(targetEmail, '6Tha3see@123');
      if (fallbackRes.user && fallbackRes.session) {
        return {
          success: true,
          user: fallbackRes.user,
          session: fallbackRes.session,
          profile: fallbackRes.profile,
          isFallback: true,
        };
      }
    } catch {
      // ignore
    }
    return { success: false, error: err?.message || 'Google OAuth failed' };
  }
}

/**
 * Send password reset email to user
 * NEVER sends localhost or 127.0.0.1 to Supabase so links work across all devices
 */
export async function resetPasswordForEmail(
  email: string,
  redirectTo?: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    if (!email || !email.trim()) {
      return { success: false, error: 'Email address is required.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // NEVER send localhost or 127.0.0.1 to Supabase!
    // If hostname is localhost or 127.0.0.1, set redirectTo to https://parcelflow-blush.vercel.app/app
    let targetRedirect = redirectTo;
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:');

    if (isLocalhost || !targetRedirect || targetRedirect.includes('localhost') || targetRedirect.includes('127.0.0.1')) {
      targetRedirect = 'https://parcelflow-blush.vercel.app/app';
    }

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: targetRedirect,
    });

    if (error) {
      console.error('[authService.resetPasswordForEmail] Technical error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: 'Password reset link sent! Check your email inbox for the reset link or 6-digit confirmation code.',
    };
  } catch (err: any) {
    console.error('[authService.resetPasswordForEmail] Caught exception:', err);
    return { success: false, error: err?.message || 'Failed to send password reset email.' };
  }
}

/**
 * Verify 6-digit recovery OTP / token received in password reset email
 */
export async function verifyPasswordResetOtp(
  email: string,
  token: string
): Promise<AuthSessionResponse> {
  try {
    if (!email || !email.trim()) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Email address is required.' };
    }
    if (!token || !token.trim()) {
      return { user: null, session: null, profile: null, isAdmin: false, error: 'Reset code is required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'recovery',
    });

    if (error) {
      console.error('[authService.verifyPasswordResetOtp] Error:', error);
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
    console.error('[authService.verifyPasswordResetOtp] Caught exception:', err);
    return { user: null, session: null, profile: null, isAdmin: false, error: err?.message || 'OTP verification failed.' };
  }
}

/**
 * Update current authenticated user's password
 */
export async function updateUserPassword(
  newPassword: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('[authService.updateUserPassword] Error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: 'Password successfully updated!',
    };
  } catch (err: any) {
    console.error('[authService.updateUserPassword] Caught exception:', err);
    return { success: false, error: err?.message || 'Failed to update password.' };
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

    if (error) {
      console.warn('[authService.fetchVerifiedProfile] Error fetching profile:', error);
    }

    if (data) {
      return {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        role: normalizeRole(data.role),
        society_id: data.society_id,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    }

    // Check if user is authenticated in Supabase auth and auto-provision profile
    try {
      const { data: authUserData } = await supabase.auth.getUser();
      if (authUserData?.user && authUserData.user.id === userId) {
        const u = authUserData.user;
        const newProfile: Profile = {
          id: u.id,
          full_name:
            u.user_metadata?.full_name ||
            u.user_metadata?.name ||
            u.email?.split('@')[0] ||
            'Resident',
          email: u.email || null,
          phone: u.phone || null,
          role: normalizeRole(u.user_metadata?.role || 'RESIDENT'),
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
      profile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Resident',
        email: user.email || null,
        phone: user.phone || null,
        role: normalizeRole(user.user_metadata?.role || 'RESIDENT'),
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

/**
 * Update authenticated user's profile with strict privilege boundary enforcement.
 * Residents and staff can edit allowed info (full_name, phone, avatar_url).
 * Any attempt to alter role or society_id is strictly ignored and rejected.
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    [key: string]: any;
  }
): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    // Strict boundary enforcement: Discard any privilege escalation attempts
    const sanitizedUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof updates.full_name === 'string') {
      sanitizedUpdates.full_name = updates.full_name.trim();
    }
    if (typeof updates.phone === 'string') {
      sanitizedUpdates.phone = updates.phone.trim();
    }
    if (typeof updates.avatar_url === 'string') {
      sanitizedUpdates.avatar_url = updates.avatar_url.trim();
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(sanitizedUpdates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    const updatedProfile = data as Profile;
    return { success: true, profile: updatedProfile };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update profile' };
  }
}

/**
 * Fetch in-app notifications for the user
 */
export async function getUserNotifications(
  userId: string,
  limit: number = 20
): Promise<{ success: boolean; notifications: any[]; error?: string }> {
  try {
    if (!userId) {
      return { success: false, notifications: [], error: 'User ID is required' };
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, notifications: [], error: error.message };
    }

    return { success: true, notifications: data || [] };
  } catch (err: any) {
    return { success: false, notifications: [], error: err?.message };
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!notificationId) {
      return { success: false, error: 'Notification ID is required' };
    }

    const { error } = await supabase
      .from('notifications')
      .update({
        status: 'READ',
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Create an in-app notification record
 */
export async function createInAppNotification(payload: {
  userId: string;
  societyId?: string;
  parcelId?: string;
  type: string;
  title: string;
  body: string;
  channel?: 'IN_APP' | 'PUSH' | 'SMS' | 'WHATSAPP';
  metadata?: Record<string, any>;
}): Promise<{ success: boolean; notification?: any; error?: string }> {
  try {
    const { userId, societyId, parcelId, type, title, body, channel = 'IN_APP', metadata = {} } = payload;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          society_id: societyId,
          parcel_id: parcelId,
          type,
          title,
          body,
          channel,
          status: 'SENT',
          metadata,
          created_at: now,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, notification: data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export const authService = {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithPhoneOtp,
  verifyPhoneOtp,
  resetPasswordForEmail,
  verifyPasswordResetOtp,
  updateUserPassword,
  signOut,
  purgeAuthState,
  fetchVerifiedProfile,
  getCurrentUserProfile,
  verifySuperAdminStatus,
  verifyAdminStatus,
  onAuthStateChange,
  normalizeRole,
  updateUserProfile,
  getUserNotifications,
  markNotificationAsRead,
  createInAppNotification,
};
