import React, { useState, useEffect } from 'react';
import { useMobileStore } from './services/mobileState';
import { ResidentApp } from './resident/ResidentApp';
import { StaffApp } from './staff/StaffApp';
import { AdminApp } from './admin/AdminApp';
import { Forbidden403 } from './components/Forbidden403';
import {
  Smartphone,
  Monitor,
  Shield,
  Home,
  Crown,
  ArrowLeft,
  Sparkles,
  Info,
  X,
  CheckCircle2,
  Package,
} from 'lucide-react';
import type { MobileRole } from './types';

export const MobileApp: React.FC = () => {
  const { currentRole, setRole } = useMobileStore();
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [isUnauthorizedAdminAttempt, setIsUnauthorizedAdminAttempt] = useState(false);

  // Active persona selection state
  const [activePersona, setActivePersona] = useState<'RESIDENT' | 'SECURITY' | 'ADMIN'>(
    currentRole === 'ADMIN' || currentRole === 'SOCIETY_ADMIN' || currentRole === 'SUPER_ADMIN'
      ? 'ADMIN'
      : currentRole === 'SECURITY' || currentRole === 'STAFF'
      ? 'SECURITY'
      : 'RESIDENT'
  );

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

    // Inspect URL query parameters for direct persona landing or unauthorized attempts
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portalParam = (params.get('portal') || params.get('role') || '').toUpperCase();
      if (params.get('unauthorized') === 'true' || portalParam === 'FORBIDDEN') {
        setIsUnauthorizedAdminAttempt(true);
      } else if (portalParam === 'ADMIN' || portalParam === 'SUPER_ADMIN' || portalParam === 'SOCIETY_ADMIN') {
        setActivePersona('ADMIN');
        setRole('SOCIETY_ADMIN');
      } else if (portalParam === 'SECURITY' || portalParam === 'STAFF') {
        setActivePersona('SECURITY');
        setRole('SECURITY');
      } else if (portalParam === 'RESIDENT') {
        setActivePersona('RESIDENT');
        setRole('RESIDENT');
      }
    }
  }, []);

  const handleSelectPersona = (persona: 'RESIDENT' | 'SECURITY' | 'ADMIN') => {
    setActivePersona(persona);
    if (persona === 'RESIDENT') {
      setRole('RESIDENT');
    } else if (persona === 'SECURITY') {
      setRole('SECURITY');
    } else {
      setRole('SOCIETY_ADMIN');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F2EB] flex flex-col items-center justify-center font-sans antialiased py-2 sm:py-4">
      {/* Top Floating Control Bar for Web Viewers */}
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

          {/* Persona Switcher Buttons in Top Bar */}
          <div className="flex items-center p-1 bg-white rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] gap-1">
            <button
              onClick={() => handleSelectPersona('RESIDENT')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl text-xs font-black transition-all ${
                activePersona === 'RESIDENT'
                  ? 'bg-[#1E60F2] text-white shadow-[1px_1px_0px_#060D1E]'
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Resident</span>
            </button>

            <button
              onClick={() => handleSelectPersona('SECURITY')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl text-xs font-black transition-all ${
                activePersona === 'SECURITY'
                  ? 'bg-[#10B981] text-white shadow-[1px_1px_0px_#060D1E]'
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Security Staff</span>
            </button>

            <button
              onClick={() => handleSelectPersona('ADMIN')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl text-xs font-black transition-all ${
                activePersona === 'ADMIN'
                  ? 'bg-amber-400 text-[#060D1E] shadow-[1px_1px_0px_#060D1E]'
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Society Admin</span>
            </button>
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

        {/* In-App Mobile Persona Switcher Bar (Directly accessible on mobile screens and APK) */}
        <div className="w-full bg-[#FEF9F3] border-b-2 border-[#060D1E] px-3 py-2 z-30 pt-3">
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <button
              onClick={() => handleSelectPersona('RESIDENT')}
              className={`py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all ${
                activePersona === 'RESIDENT'
                  ? 'bg-[#1E60F2] text-white shadow-[1px_1px_0px_#060D1E]'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Resident</span>
            </button>

            <button
              onClick={() => handleSelectPersona('SECURITY')}
              className={`py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all ${
                activePersona === 'SECURITY'
                  ? 'bg-[#10B981] text-white shadow-[1px_1px_0px_#060D1E]'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Security</span>
            </button>

            <button
              onClick={() => handleSelectPersona('ADMIN')}
              className={`py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all ${
                activePersona === 'ADMIN'
                  ? 'bg-amber-400 text-[#060D1E] shadow-[1px_1px_0px_#060D1E]'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-1 px-1 text-[10px] font-black text-slate-500">
            <span>
              {activePersona === 'RESIDENT' && '👤 Vinay Kumar • Flat B-402'}
              {activePersona === 'SECURITY' && '🛡️ Ramesh Gowda • Gate Hub #1'}
              {activePersona === 'ADMIN' && '👑 Greenview Heights • Committee Ops'}
            </span>
            <span className="text-[#1E60F2] uppercase tracking-wider font-extrabold">1-Tap Switch</span>
          </div>
        </div>

        {/* Active Application Shell Container */}
        <div className="flex-1 overflow-hidden relative">
          {isUnauthorizedAdminAttempt ? (
            <Forbidden403
              currentRole={currentRole}
              requiredRole="SOCIETY_ADMIN"
              attemptedPath="/admin"
              onReturnToPortal={() => {
                setIsUnauthorizedAdminAttempt(false);
                handleSelectPersona('RESIDENT');
              }}
              onLogout={() => {
                setIsUnauthorizedAdminAttempt(false);
                handleSelectPersona('RESIDENT');
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
      </main>
    </div>
  );
};

export default MobileApp;
