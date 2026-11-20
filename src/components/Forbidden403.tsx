import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, Lock, Home } from 'lucide-react';

interface Forbidden403PageProps {
  currentRole?: string;
  requiredRole?: string;
  attemptedPath?: string;
  onLogout?: () => void;
}

export const Forbidden403Page: React.FC<Forbidden403PageProps> = ({
  currentRole = 'RESIDENT',
  requiredRole = 'ADMIN',
  attemptedPath = '/admin',
  onLogout,
}) => {
  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleAppClick = () => {
    window.location.href = '/app';
  };

  return (
    <div className="min-h-screen bg-[#FEF9F3] text-[#060D1E] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border-3 border-[#060D1E] shadow-[8px_8px_0px_#060D1E] p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />

        {/* Shield Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-500 border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] text-white mb-5 mt-2">
          <ShieldAlert className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* 403 Badge */}
        <div>
          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 font-black text-xs uppercase tracking-widest rounded-full mb-3">
            HTTP 403 Forbidden
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#060D1E] tracking-tight mb-2">
          Access Denied
        </h1>

        <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-6 leading-relaxed">
          You do not have the required permissions to view <span className="font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">{attemptedPath}</span>.
        </p>

        {/* Security Details Card */}
        <div className="bg-[#FEF9F3] rounded-2xl border-2 border-[#060D1E] p-4 text-left mb-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Your Current Role:</span>
            <span className="font-black px-2.5 py-1 rounded-lg bg-blue-100 text-[#1E60F2] border border-blue-300">
              {currentRole}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Required Privilege:</span>
            <span className="font-black px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 border border-rose-300">
              {requiredRole}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-[11px] text-slate-500 font-semibold">
            <Lock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span>Unauthorized portal access attempts are logged and protected by server-side RLS policies.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleAppClick}
            className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs sm:text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User App Portal</span>
          </button>

          <button
            onClick={handleHomeClick}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-[#060D1E] font-extrabold text-xs rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Go to ParcelFlow Home</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-3 text-rose-700 hover:text-rose-900 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out & Clear Session</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
