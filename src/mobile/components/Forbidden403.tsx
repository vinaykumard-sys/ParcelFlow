import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';
import { MobileStatusBar } from './MobileStatusBar';

interface Forbidden403Props {
  currentRole?: string;
  requiredRole?: string;
  onReturnToPortal?: () => void;
  onLogout?: () => void;
  attemptedPath?: string;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({
  currentRole = 'RESIDENT',
  requiredRole = 'ADMIN',
  onReturnToPortal,
  onLogout,
  attemptedPath = '/admin',
}) => {
  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none justify-between p-6">
      <MobileStatusBar />

      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
        {/* Shield Icon with Brutalist Shadow */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl bg-rose-500 border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] flex items-center justify-center text-white">
            <ShieldAlert className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-[#060D1E] text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
            403
          </div>
        </div>

        {/* Status & Heading */}
        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 font-extrabold text-[11px] uppercase tracking-wider rounded-full mb-3">
          403 Access Denied
        </span>

        <h1 className="text-2xl font-black text-[#060D1E] tracking-tight mb-2">
          Forbidden Area
        </h1>

        <p className="text-xs font-semibold text-slate-600 max-w-xs mb-5 leading-relaxed">
          You attempted to access <span className="font-mono font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">{attemptedPath}</span> which requires <strong className="text-[#060D1E]">{requiredRole}</strong> privileges.
        </p>

        {/* Security Context Card */}
        <div className="w-full bg-white rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4 text-left mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Your Current Role:</span>
            <span className="font-black px-2 py-0.5 rounded bg-blue-100 text-[#1E60F2] border border-blue-200">
              {currentRole}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">Required Role:</span>
            <span className="font-black px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
              {requiredRole}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Unauthorized access attempt has been recorded in audit logs.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5 pb-2">
        {onReturnToPortal && (
          <button
            onClick={onReturnToPortal}
            className="w-full py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Portal</span>
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Log Out & Sign In with Authorized Account</span>
          </button>
        )}
      </div>
    </div>
  );
};
