import React, { useState, useEffect } from 'react';
import { useMobileStore } from './services/mobileState';
import { ResidentApp } from './resident/ResidentApp';
import { StaffApp } from './staff/StaffApp';
import { AdminApp } from './admin/AdminApp';
import { Forbidden403 } from './components/Forbidden403';
import { Smartphone, Monitor, Shield, ArrowLeft } from 'lucide-react';

export const MobileApp: React.FC = () => {
  const { currentRole, isAuthenticated, logout } = useMobileStore();
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [requestedPortal, setRequestedPortal] = useState<string | null>(null);

  useEffect(() => {
    // Detect if running inside native Android APK or mobile browser
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

    // Inspect URL parameters for requested portal (e.g., ?portal=admin or ?role=admin)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get('portal') || params.get('role');
      const path = window.location.pathname;

      if (portalParam) {
        setRequestedPortal(portalParam.toUpperCase());
      } else if (path.includes('/admin')) {
        setRequestedPortal('ADMIN');
      } else if (path.includes('/staff') || path.includes('/security')) {
        setRequestedPortal('SECURITY');
      } else if (path.includes('/resident')) {
        setRequestedPortal('RESIDENT');
      }
    }
  }, []);

  // Determine authorized portal strictly from authenticated user role
  const isSuperAdmin = currentRole === 'SUPER_ADMIN';
  const isSocietyAdmin = currentRole === 'SOCIETY_ADMIN' || currentRole === 'ADMIN';
  const isSecurity = currentRole === 'SECURITY' || currentRole === 'STAFF';
  const isResident = currentRole === 'RESIDENT' || (!isSuperAdmin && !isSocietyAdmin && !isSecurity);

  // Role validation: if requestedPortal is set and user is authenticated with a different privilege level
  const isUnauthorizedAdminAttempt =
    requestedPortal &&
    (requestedPortal === 'ADMIN' || requestedPortal === 'SUPER_ADMIN' || requestedPortal === 'SOCIETY_ADMIN') &&
    isAuthenticated &&
    !isSuperAdmin &&
    !isSocietyAdmin;

  const isUnauthorizedStaffAttempt =
    requestedPortal &&
    (requestedPortal === 'SECURITY' || requestedPortal === 'STAFF') &&
    isAuthenticated &&
    isResident;

  const portalLabel = isSuperAdmin
    ? 'Super Admin Portal'
    : isSocietyAdmin
    ? 'Society Admin Portal'
    : isSecurity
    ? 'Gate Security Portal'
    : 'Resident Portal';

  return (
    <div className="w-full min-h-screen bg-[#F7F2EB] flex flex-col items-center justify-center font-sans antialiased">
      {/* Top Floating Control Bar for Web Viewers (Hidden in native APK / mobile full screen) */}
      {!isNativeApp && (
        <header className="w-full max-w-lg mx-auto py-2.5 px-4 mb-2 flex items-center justify-between text-xs font-bold text-[#060D1E] select-none">
          <a
            href="/"
            className="flex items-center gap-1.5 text-slate-700 hover:text-black py-1 px-2.5 bg-white rounded-xl border border-slate-300 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Marketing Site</span>
          </a>

          {/* Strict Role/Portal Indicator - Non-clickable Badge (NO role switching dropdowns or buttons) */}
          <div className="flex items-center gap-1.5 py-1 px-3 bg-white text-[#060D1E] rounded-xl border border-slate-300 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#1E60F2]" />
            <span className="font-extrabold text-[#1E60F2]">{portalLabel}</span>
          </div>

          {/* Toggle Device Frame / Fullscreen view */}
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1 py-1 px-2.5 bg-white rounded-xl border border-slate-300 shadow-sm text-slate-700 hover:text-black"
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
        </header>
      )}

      {/* App Container */}
      <main
        className={`relative transition-all duration-300 overflow-hidden ${
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

        {/* 403 Forbidden Screen when unauthorized role attempts access */}
        {isUnauthorizedAdminAttempt ? (
          <Forbidden403
            currentRole={currentRole}
            requiredRole="SOCIETY_ADMIN"
            attemptedPath="/admin"
            onReturnToPortal={() => setRequestedPortal(null)}
            onLogout={() => {
              logout();
              setRequestedPortal(null);
            }}
          />
        ) : isUnauthorizedStaffAttempt ? (
          <Forbidden403
            currentRole={currentRole}
            requiredRole="SECURITY"
            attemptedPath="/staff"
            onReturnToPortal={() => setRequestedPortal(null)}
            onLogout={() => {
              logout();
              setRequestedPortal(null);
            }}
          />
        ) : isSuperAdmin || isSocietyAdmin ? (
          <AdminApp
            onLogoutSession={() => setRequestedPortal(null)}
            onReturnToPortal={() => setRequestedPortal(null)}
          />
        ) : isSecurity ? (
          <StaffApp
            onLogoutSession={() => setRequestedPortal(null)}
          />
        ) : (
          <ResidentApp
            onLogoutSession={() => setRequestedPortal(null)}
          />
        )}
      </main>
    </div>
  );
};

export default MobileApp;
