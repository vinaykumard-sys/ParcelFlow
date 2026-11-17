import React, { useState, useEffect } from 'react';
import { useMobileStore } from './services/mobileState';
import { ResidentApp } from './resident/ResidentApp';
import { StaffApp } from './staff/StaffApp';
import { AdminApp } from './admin/AdminApp';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { Smartphone, Monitor, Shield, Sparkles, Home, ArrowLeft } from 'lucide-react';

export const MobileApp: React.FC = () => {
  const { currentRole, setRole, selectedSociety } = useMobileStore();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [isNativeApp, setIsNativeApp] = useState(false);

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
  }, []);

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

          {/* Role Indicator & Switcher Button */}
          <button
            onClick={() => setShowRoleSwitcher(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-50 text-[#060D1E] rounded-xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1E60F2]" />
            <span>Role:</span>
            <span className="font-black text-[#1E60F2]">
              {currentRole === 'RESIDENT' ? 'Resident' : currentRole === 'STAFF' ? 'Staff' : 'Admin'}
            </span>
          </button>

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

        {/* Active Role Application Shell */}
        {currentRole === 'RESIDENT' && (
          <ResidentApp onOpenRoleSwitcher={() => setShowRoleSwitcher(true)} />
        )}

        {currentRole === 'STAFF' && (
          <StaffApp onOpenRoleSwitcher={() => setShowRoleSwitcher(true)} />
        )}

        {currentRole === 'ADMIN' && (
          <AdminApp
            onOpenRoleSwitcher={() => setShowRoleSwitcher(true)}
            onNavigateToStaffScan={() => {
              setRole('STAFF');
            }}
            onNavigateToStaffReceive={() => {
              setRole('STAFF');
            }}
          />
        )}

        {/* Role Switcher Modal */}
        {showRoleSwitcher && (
          <RoleSwitcherModal
            currentRole={currentRole}
            onSelectRole={(role) => setRole(role)}
            onClose={() => setShowRoleSwitcher(false)}
          />
        )}
      </main>
    </div>
  );
};

export default MobileApp;
