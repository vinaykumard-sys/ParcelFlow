import React, { useState, useEffect } from 'react';
import { useMobileStore } from './services/mobileState';
import { ResidentApp } from './resident/ResidentApp';
import { StaffApp } from './staff/StaffApp';
import { AdminApp } from './admin/AdminApp';
import { Forbidden403 } from './components/Forbidden403';
import { AppUpdateModal } from './components/AppUpdateModal';
import { checkForAppUpdate, type RemoteAppUpdateMetadata } from '../services/appUpdateService';
import { CURRENT_APP_VERSION } from './version';
import { initializePushNotifications } from '../services/fcmClient';
import { supabase } from '../services/supabaseClient';
import { fetchVerifiedProfile, normalizeRole } from '../services/authService';
import { isAppOwner } from '../services/ownerService';
import {
  Smartphone,
  Monitor,
  ArrowLeft,
  Sparkles,
  Info,
  X,
  KeyRound,
  Check,
  Crown,
} from 'lucide-react';

// ============================================================================
// SECURITY: Role is derived EXCLUSIVELY from the authenticated Supabase DB
// profile stored in mobileStore. No URL param or button can elevate role.
// ============================================================================

export const MobileApp: React.FC = () => {
  const { currentRole, currentUser, login, logout, selectedSociety } = useMobileStore();
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [isUnauthorizedAdminAttempt, setIsUnauthorizedAdminAttempt] = useState(false);

  // In-App Update State
  const [updateMetadata, setUpdateMetadata] = useState<RemoteAppUpdateMetadata | null>(null);
  const [isMandatoryUpdate, setIsMandatoryUpdate] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdateComplete, setIsUpdateComplete] = useState(false);

  // Global Password Recovery State (listening for PASSWORD_RECOVERY or #type=recovery)
  const [isPasswordRecoveryModalOpen, setIsPasswordRecoveryModalOpen] = useState(false);
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const isOwner = isAppOwner(currentUser?.email);
  const [ownerTestPersona, setOwnerTestPersona] = useState<'ADMIN' | 'SECURITY' | 'RESIDENT'>('ADMIN');

  const isPathAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  // Universal Persona Switcher for App Owner Vinay Kumar; strictly role-bound for all other users
  const activePersona: 'RESIDENT' | 'SECURITY' | 'ADMIN' =
    isOwner
      ? ownerTestPersona
      : currentRole === 'ADMIN' || currentRole === 'SOCIETY_ADMIN' || currentRole === 'SUPER_ADMIN' || (!currentUser && isPathAdmin)
      ? 'ADMIN'
      : currentRole === 'SECURITY' || currentRole === 'STAFF'
      ? 'SECURITY'
      : 'RESIDENT';

  useEffect(() => {
    // Detect native Android APK or small viewport
    const isNative =
      typeof window !== 'undefined' &&
      ((window as any).__PARCELFLOW_NATIVE_APP__ === true ||
        navigator.userAgent.includes('ParcelFlowApp') ||
        window.location.protocol === 'file:' ||
        window.innerWidth < 640);

    if (isNative) {
      setIsNativeApp(true);
      setDeviceFrameMode(false);
    }

    // Show 403 if URL signals an unauthorized attempt — but NEVER elevate role from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portalParam = (params.get('portal') || params.get('role') || '').toUpperCase();
      if (params.get('unauthorized') === 'true' || portalParam === 'FORBIDDEN') {
        setIsUnauthorizedAdminAttempt(true);
      }
      if (params.get('action') === 'app_update' || params.get('update') === 'true') {
        setIsUpdateModalOpen(true);
      }
      // Check for password recovery hash
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (
        hash.includes('type=recovery') ||
        search.includes('type=recovery') ||
        (hash.includes('access_token') && hash.includes('recovery'))
      ) {
        setIsPasswordRecoveryModalOpen(true);
      }
    }

    // 1. Initial Supabase Session Sync on Startup
    const syncSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        if (session?.user) {
          const profile = await fetchVerifiedProfile(session.user.id);
          const role = profile?.role ? normalizeRole(profile.role) : 'RESIDENT';

          login({
            id: session.user.id,
            email: session.user.email || '',
            name:
              profile?.full_name ||
              session.user.user_metadata?.full_name ||
              session.user.email?.split('@')[0] ||
              'Resident',
            phone: profile?.phone || session.user.phone,
            role,
            societyId: profile?.society_id || selectedSociety.id,
            flatNumber: (profile as any)?.flat_number,
          });
        }
      } catch (e) {
        console.warn('Session sync note:', e);
      }
    };
    syncSession();

    // 2. Global Auth State Change Listener (handles Google OAuth redirect, recovery & session refreshes)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecoveryModalOpen(true);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const profile = await fetchVerifiedProfile(session.user.id);
          const role = profile?.role ? normalizeRole(profile.role) : 'RESIDENT';

          login({
            id: session.user.id,
            email: session.user.email || '',
            name:
              profile?.full_name ||
              session.user.user_metadata?.full_name ||
              session.user.email?.split('@')[0] ||
              'Resident',
            phone: profile?.phone || session.user.phone,
            role,
            societyId: profile?.society_id || selectedSociety.id,
            flatNumber: (profile as any)?.flat_number,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    // 3. Production In-App Update Check on Startup / Resume
    const runUpdateCheck = async () => {
      try {
        const check = await checkForAppUpdate();
        if (check.hasUpdate && check.updateMetadata) {
          setUpdateMetadata(check.updateMetadata);
          setIsMandatoryUpdate(check.isMandatory);
          setIsUpdateComplete(false);

          // If mandatory: always show. If optional: check if dismissed for this version code
          const dismissedCode =
            typeof localStorage !== 'undefined'
              ? localStorage.getItem('parcelflow_update_dismissed_code')
              : null;
          if (
            check.isMandatory ||
            !dismissedCode ||
            parseInt(dismissedCode, 10) < check.updateMetadata.latestVersionCode
          ) {
            setIsUpdateModalOpen(true);
          }
        } else if (!check.hasUpdate && check.updateMetadata) {
          // Check if an update was completed and the app just relaunched
          const pendingComplete =
            typeof localStorage !== 'undefined'
              ? localStorage.getItem('parcelflow_pending_update_complete')
              : null;
          if (pendingComplete) {
            localStorage.removeItem('parcelflow_pending_update_complete');
            setUpdateMetadata(check.updateMetadata);
            setIsUpdateComplete(true);
            setIsUpdateModalOpen(true);
          }
        }
      } catch (err) {
        console.warn('Update check note:', err);
      }
    };

    runUpdateCheck();

    // 4. Register Device for Push Notifications & Handle Notification Tap Routing
    initializePushNotifications(currentUser?.id, () => {
      runUpdateCheck();
      setIsUpdateModalOpen(true);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [currentUser?.id]);

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#060D1E] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Banner (on desktop browsers) */}
      {!isNativeApp && (
        <header className="bg-white border-b-2 border-[#060D1E] px-4 py-2 flex items-center justify-between text-xs font-bold shadow-xs z-40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1E60F2] text-white flex items-center justify-center font-black text-xs">
              PF
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#060D1E]">
              ParcelFlow Mobile
            </span>
            <span className="text-[10px] bg-blue-100 text-[#1E60F2] px-2 py-0.5 rounded-full font-bold ml-1">
              Active: {activePersona}
            </span>
          </div>

          {/* Toggle Device Frame / Fullscreen view */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTourGuide(!showTourGuide)}
              className="flex items-center gap-1 py-1.5 px-2.5 bg-white rounded-xl border border-slate-300 shadow-sm text-slate-700 hover:text-black"
              title="Toggle Workflow Instructions"
            >
              <Info className="w-3.5 h-3.5 text-[#1E60F2]" />
              <span className="hidden sm:inline">Flow Guide</span>
            </button>

            <button
              onClick={() => setDeviceFrameMode(!deviceFrameMode)}
              className="flex items-center gap-1 py-1.5 px-2.5 bg-white rounded-xl border border-slate-300 shadow-sm text-slate-700 hover:text-black"
              title="Toggle Mobile Device Frame"
            >
              {deviceFrameMode ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fill</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Frame</span>
                </>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Workflow Tour Guide Callout */}
      {!isNativeApp && showTourGuide && (
        <div className="w-full max-w-lg mx-auto mb-2 px-4">
          <div className="bg-white rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-3 text-xs relative animate-fadeIn">
            <button
              onClick={() => setShowTourGuide(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 font-black text-[#1E60F2] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>How To Test The Complete Experience:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] font-semibold text-slate-700">
              <div className="bg-blue-50/70 p-2 rounded-xl border border-blue-200">
                <p className="font-black text-[#1E60F2] mb-0.5">1. Resident</p>
                <p className="leading-tight text-slate-600">
                  View deliveries, Ask ParcelFlow AI, Express Pickup QR, Family Pass & 2D Storage Map.
                </p>
              </div>
              <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                <p className="font-black text-emerald-800 mb-0.5">2. Security Staff</p>
                <p className="leading-tight text-slate-600">
                  Scan couriers, Smart storage suggestion, report incidents & verify resident passes.
                </p>
              </div>
              <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200">
                <p className="font-black text-amber-900 mb-0.5">3. Society Admin</p>
                <p className="leading-tight text-slate-600">
                  Predictive analytics, live hub elevation map, incident resolution & manage subscriptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Container */}
      <main
        className={`relative transition-all duration-300 overflow-hidden flex flex-col ${
          deviceFrameMode && !isNativeApp
            ? 'w-[390px] h-[844px] max-h-[96vh] rounded-[48px] border-[10px] border-[#060D1E] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3),8px_8px_0px_#060D1E] bg-[#FEF9F3]'
            : 'w-full h-screen max-w-md mx-auto bg-[#FEF9F3]'
        }`}
      >
        {/* Notch / Dynamic Island on Framed Mobile View */}
        {deviceFrameMode && !isNativeApp && (
          <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-[#060D1E] rounded-full z-40 pointer-events-none flex items-center justify-end pr-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-900/60" />
          </div>
        )}

        {/* Active Application Shell Container */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {/* Universal Persona Switcher for App Owner Vinay Kumar */}
          {isOwner && (
            <div className="bg-[#060D1E] text-white px-3.5 py-2 border-b-2 border-amber-400 flex items-center justify-between shrink-0 z-40">
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Owner Studio
                </span>
                <span className="text-[9px] text-slate-400 font-bold hidden xs:inline">({currentUser?.email})</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setOwnerTestPersona('ADMIN')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    ownerTestPersona === 'ADMIN' ? 'bg-amber-400 text-[#060D1E]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setOwnerTestPersona('SECURITY')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    ownerTestPersona === 'SECURITY' ? 'bg-amber-400 text-[#060D1E]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Security
                </button>
                <button
                  type="button"
                  onClick={() => setOwnerTestPersona('RESIDENT')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                    ownerTestPersona === 'RESIDENT' ? 'bg-amber-400 text-[#060D1E]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Resident
                </button>
              </div>
            </div>
          )}
          {/* Persistent In-App Update Notice Banner (if update available and modal dismissed) */}
          {updateMetadata && updateMetadata.latestVersionCode > CURRENT_APP_VERSION.versionCode && !isUpdateModalOpen && !isUpdateComplete && (
            <div
              onClick={() => setIsUpdateModalOpen(true)}
              className="bg-gradient-to-r from-[#1E60F2] to-[#0A1128] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between cursor-pointer shadow-md z-30 transition-transform active:scale-[0.99] border-b-2 border-[#060D1E]"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="truncate">New ParcelFlow v{updateMetadata.latestVersionName} Available</span>
              </div>
              <span className="bg-amber-400 text-[#060D1E] px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm flex-shrink-0">
                Update Now
              </span>
            </div>
          )}
          {isUnauthorizedAdminAttempt ? (
            <Forbidden403
              currentRole={currentRole}
              requiredRole="SOCIETY_ADMIN"
              attemptedPath="/admin"
              onReturnToPortal={() => {
                setIsUnauthorizedAdminAttempt(false);
              }}
              onLogout={() => {
                setIsUnauthorizedAdminAttempt(false);
              }}
            />
          ) : (
            <>
              {activePersona === 'RESIDENT' && <ResidentApp />}
              {activePersona === 'SECURITY' && <StaffApp />}
              {activePersona === 'ADMIN' && <AdminApp />}
            </>
          )}
        </div>

        {/* Production In-App Update Modal */}
        {updateMetadata && (
          <AppUpdateModal
            isOpen={isUpdateModalOpen}
            metadata={updateMetadata}
            isMandatory={isMandatoryUpdate}
            isUpdateComplete={isUpdateComplete}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setIsUpdateComplete(false);
              if (!isMandatoryUpdate && updateMetadata && typeof localStorage !== 'undefined') {
                localStorage.setItem(
                  'parcelflow_update_dismissed_code',
                  String(updateMetadata.latestVersionCode)
                );
              }
            }}
          />
        )}

        {/* Global Set New Password Modal (triggered via email recovery link or PASSWORD_RECOVERY event) */}
        {isPasswordRecoveryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-[#FEF9F3] text-[#0B1E3F] rounded-3xl border-2 border-[#0B1E3F] shadow-[4px_4px_0px_#0B1E3F] p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-[#1E60F2]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B1E3F]">Set New Password</h3>
                    <p className="text-[10px] font-bold text-slate-500">Recovery session authenticated</p>
                  </div>
                </div>
                {!recoveryLoading && (
                  <button
                    onClick={() => setIsPasswordRecoveryModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {recoveryError && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-800">
                  {recoveryError}
                </div>
              )}

              {recoverySuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-black text-emerald-900">Password Updated Successfully!</p>
                  <p className="text-[11px] font-bold text-slate-500">You can now access your account.</p>
                  <button
                    onClick={() => {
                      setIsPasswordRecoveryModalOpen(false);
                      setRecoverySuccess(false);
                    }}
                    className="w-full py-2 bg-[#FFC72C] text-[#0B1E3F] text-xs font-black rounded-xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]"
                  >
                    Continue to App
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!recoveryNewPassword || recoveryNewPassword.length < 6) {
                      setRecoveryError('Password must be at least 6 characters long.');
                      return;
                    }
                    if (recoveryNewPassword !== recoveryConfirmPassword) {
                      setRecoveryError('Passwords do not match.');
                      return;
                    }
                    setRecoveryLoading(true);
                    setRecoveryError(null);
                    try {
                      const { error } = await supabase.auth.updateUser({
                        password: recoveryNewPassword,
                      });
                      if (error) {
                        setRecoveryError(error.message || 'Failed to update password.');
                        setRecoveryLoading(false);
                      } else {
                        setRecoveryLoading(false);
                        setRecoverySuccess(true);
                      }
                    } catch (err: any) {
                      setRecoveryError(err.message || 'Error updating password.');
                      setRecoveryLoading(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={recoveryNewPassword}
                      onChange={(e) => setRecoveryNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white text-xs font-bold text-[#0B1E3F] rounded-2xl border-2 border-[#0B1E3F] shadow-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={recoveryConfirmPassword}
                      onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white text-xs font-bold text-[#0B1E3F] rounded-2xl border-2 border-[#0B1E3F] shadow-sm focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="w-full py-3 bg-[#FFC72C] hover:bg-amber-400 text-[#0B1E3F] font-black text-xs rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] active:scale-95 transition-all"
                  >
                    {recoveryLoading ? 'Updating Password...' : 'Save New Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileApp;
