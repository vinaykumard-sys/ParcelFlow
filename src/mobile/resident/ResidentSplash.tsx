import React from 'react';
import { Package, ArrowRight, Building, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';

interface ResidentSplashProps {
  onGetStarted: () => void;
  onSelectRole?: () => void;
}

export const ResidentSplash: React.FC<ResidentSplashProps> = ({ onGetStarted, onSelectRole }) => {
  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <MobileStatusBar />

      {/* Top Graphic Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4 text-center">
        {/* Animated Brand Badge */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-[#1E60F2] border-[3px] border-[#060D1E] shadow-[4px_4px_0px_#060D1E] flex items-center justify-center relative">
            <Package className="w-12 h-12 text-white stroke-[2.5]" />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#10B981] border-2 border-[#060D1E] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl font-black tracking-tight text-[#060D1E]">ParcelFlow</span>
        </div>
        <p className="text-xs uppercase tracking-widest font-extrabold text-[#1E60F2] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 mb-6">
          Resident Portal
        </p>

        {/* Hero Illustration / Graphic Card */}
        <div className="w-full bg-white rounded-3xl border-2 border-[#060D1E] p-6 shadow-[4px_4px_0px_#060D1E] mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-[#1E60F2]/10 rounded-full pointer-events-none" />
          
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
              <Building className="w-8 h-8 text-amber-800" />
            </div>
            <div className="p-3 bg-blue-100 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
              <Package className="w-8 h-8 text-[#1E60F2]" />
            </div>
            <div className="p-3 bg-emerald-100 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
              <ShieldCheck className="w-8 h-8 text-[#10B981]" />
            </div>
          </div>

          <h2 className="text-xl font-black text-[#060D1E] mb-2 leading-tight">
            Your parcel. <br />
            <span className="text-[#1E60F2]">Your time.</span>
          </h2>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed max-w-[240px] mx-auto">
            Zero missed deliveries, guaranteed slot pickup, and seamless OTP & QR verification at your gate.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-[#FEF9F3] px-2.5 py-1 rounded-lg border border-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#1E60F2]" /> 30-min Slots
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Secure
            </span>
          </div>
        </div>

        {/* 3 Pagination Indicator Dots */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-2 rounded-full bg-[#1E60F2]" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
      </div>

      {/* Bottom Button Area */}
      <div className="px-6 pb-8 pt-2">
        <button
          onClick={onGetStarted}
          className="w-full py-3.5 px-6 bg-[#1E60F2] hover:bg-blue-600 active:scale-[0.98] text-white font-black text-base rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {onSelectRole && (
          <button
            onClick={onSelectRole}
            className="w-full mt-3 py-2 text-xs font-extrabold text-slate-600 hover:text-[#060D1E] text-center"
          >
            Switch to Staff / Admin App →
          </button>
        )}
      </div>
    </div>
  );
};
