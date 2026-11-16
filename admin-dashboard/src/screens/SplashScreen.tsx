import React from 'react';
import { PackageBoxIllustration, SocietyBuildingIllustration, SecureOtpShieldIllustration } from '../components/Illustrations';
import { Sticker } from '../components/Sticker';
import { ArrowRight, Building, KeyRound, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import type { AdminTab } from '../types';

interface SplashScreenProps {
  onNavigate: (tab: AdminTab) => void;
  onOpenScanModal: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate, onOpenScanModal }) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative rounded-3xl bg-[#FFFDF9] border-3 border-[#0A1128] shadow-[8px_8px_0px_#0A1128] p-6 sm:p-10 overflow-hidden">
        {/* Floating Cartoon Stickers */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex flex-col gap-2 items-end">
          <Sticker color="mint" rotate="right" size="sm">
            ✨ Society Hub v0.1.0
          </Sticker>
          <Sticker color="yellow" rotate="left" size="xs" className="hidden sm:inline-flex">
            📦 87 Parcels Processed Today
          </Sticker>
        </div>

        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border-2 border-[#0A1128] text-xs font-black text-blue-800 shadow-[2px_2px_0px_#0A1128]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Welcome to ParcelFlow Admin & Operations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight leading-tight">
            Your parcel.<br />
            <span className="text-blue-600 underline decoration-amber-400 decoration-wavy decoration-2">
              Your time.
            </span>
          </h1>

          <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
            The mission-control dashboard for gated apartment societies. Manage resident directories, courier parcel intake, smart hub inventory racks, pickup time-windows, and secure OTP/QR handovers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="py-3 px-6 rounded-2xl bg-blue-600 text-white font-extrabold text-sm border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A1128] active:translate-y-0 active:shadow-[2px_2px_0px_#0A1128] transition-all flex items-center gap-2"
            >
              <span>Enter Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('society-selection')}
              className="py-3 px-5 rounded-2xl bg-white text-[#0A1128] font-extrabold text-sm border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-0.5 hover:bg-amber-50 active:translate-y-0 transition-all flex items-center gap-2"
            >
              <Building className="w-4 h-4 text-blue-600" />
              <span>Select Society</span>
            </button>

            <button
              onClick={onOpenScanModal}
              className="py-3 px-5 rounded-2xl bg-orange-500 text-white font-extrabold text-sm border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-0.5 hover:bg-orange-600 active:translate-y-0 transition-all flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Counter Scan OTP</span>
            </button>
          </div>
        </div>

        {/* Decorative Vector Graphic */}
        <div className="absolute -bottom-6 -right-6 opacity-30 lg:opacity-100 pointer-events-none">
          <PackageBoxIllustration className="w-48 h-48 sm:w-64 sm:h-64" />
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-400 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
              <Building className="w-5 h-5 text-[#0A1128]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0A1128]">Multi-Society Architecture</h3>
              <p className="text-[11px] font-semibold text-slate-500">4 Gated Complexes</p>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600 mb-4">
            Manage Lakeview Residency, Greenwood Heights, Skyline Apartments, and Maple Residency from a single unified portal.
          </p>
          <button
            onClick={() => onNavigate('society-selection')}
            className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Explore Society Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-blue-500 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0A1128]">Role-Based Access</h3>
              <p className="text-[11px] font-semibold text-slate-500">Admin, Staff & Resident</p>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600 mb-4">
            Strict PostgreSQL Row Level Security (RLS) policies protecting resident privacy and enforcing authorized handover.
          </p>
          <button
            onClick={() => onNavigate('role-switcher')}
            className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Test Role Permissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-400 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] text-[#0A1128]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0A1128]">Zero-Loss Handover</h3>
              <p className="text-[11px] font-semibold text-slate-500">OTP / QR Verification</p>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600 mb-4">
            Parcels are only released after optical QR scanning or 4-digit OTP matching, eliminating lost or misplaced packages.
          </p>
          <button
            onClick={() => onNavigate('otp-scanner')}
            className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Launch Handover Scanner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
