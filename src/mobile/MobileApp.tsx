import React, { useState, useEffect } from 'react';
import { useMobileStore } from './services/mobileState';
import { ResidentApp } from './resident/ResidentApp';
import { StaffApp } from './staff/StaffApp';
import { AdminApp } from './admin/AdminApp';
import { Forbidden403 } from './components/Forbidden403';
import { AppUpdateModal } from './components/AppUpdateModal';
import { checkForAppUpdate, type RemoteAppUpdateMetadata } from '../services/appUpdateService';
import { initializePushNotifications } from '../services/fcmClient';
import { supabase } from '../services/supabaseClient';
import { fetchVerifiedProfile, normalizeRole } from '../services/authService';
import {
  Smartphone,
  Monitor,
  ArrowLeft,
  Sparkles,
  Info,
  X,
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

  const isPathAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  // Derive display persona from AUTHENTICATED role in store, or unauthenticated /admin route visit
  const activePersona: 'RESIDENT' | 'SECURITY' | 'ADMIN' =
    currentRole === 'ADMIN' || currentRole === 'SOCIETY_ADMIN' || currentRole === 'SUPER_ADMIN' || (!currentUser && isPathAdmin)
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

    // 2. Global Auth State Change Listener (handles Google OAuth redirect & session refreshes)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
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
    <div className="w-full min-h-screen bg-[#F7F2EB] flex flex-col items-center justify-center font-sans antialiased py-2 sm:py-4">
      {/* Top Floating Control Bar for Web Viewers — NO persona switcher (role is DB-driven) */}
      {!isNativeApp && (
        <header className="w-full max-w-2xl mx-auto py-2 px-4 mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#060D1E] select-none">
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="flex items-center gap-1.5 text-slate-700 hover:text-black py-1.5 px-3 bg-white rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Marketing</span>
            </a>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-[11px] font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive Workflow</span>
            </div>
          </div>

          {/* SECURITY: Persona switcher removed. Role is determined by authenticated Supabase profile only. */}

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
                <p className="leading-tight text-slate-600">View deliveries, add expected order, book evening slot & open Digital Pass (OTP & QR).</p>
              </div>
              <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                <p className="font-black text-emerald-800 mb-0.5">2. Security Staff</p>
                <p className="leading-tight text-slate-600">Scan couriers, assign lockers, verify resident pass & release locker.</p>
              </div>
              <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200">
                <p className="font-black text-amber-900 mb-0.5">3. Society Admin</p>
                <p className="leading-tight text-slate-600">Manage lockers, launch 8-step onboarding & manage subscriptions.</p>
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

        {/* SECURITY: In-App persona switcher removed. Role is locked to authenticated Supabase DB profile. */}

        {/* Active Application Shell Container */}
        <div className="flex-1 overflow-hidden relative">
          {isUnauthorizedAdminAttempt ? (
            <Forbidden403
              currentRole={currentRole}
              requiredRole="SOCIETY_ADMIN"
              attemptedPath="/admin"
              onReturnToPortal={() => {
                setIsUnauthorizedAdminAttempt(false);
                // Role reverts to what the DB says — no manual override
              }}
              onLogout={() => {
                setIsUnauthorizedAdminAttempt(false);
                // Role reverts to what the DB says — no manual override
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
      </main>
    </div>
  );
};

export default MobileApp;
