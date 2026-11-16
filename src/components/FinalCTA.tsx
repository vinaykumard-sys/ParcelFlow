import React from 'react';
import { 
  Download, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Users
} from 'lucide-react';

interface FinalCTAProps {
  onOpenPilotModal?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenPilotModal }) => {
  return (
    <section className="relative py-28 bg-slate-950 text-white overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle geometric line accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Transform your apartment delivery experience</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Ready to stop waiting around <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            for your parcels?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bring ParcelFlow to your gated community or apartment society today. Experience zero gate clutter, guaranteed security, and pickup at your exact convenience.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/download"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-blue-500/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Download className="w-5 h-5" />
            <span>Get the ParcelFlow App</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>

          {onOpenPilotModal && (
            <button
              onClick={onOpenPilotModal}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-base transition-all duration-200 hover:border-slate-600"
            >
              <Building2 className="w-5 h-5 text-blue-400" />
              <span>Request Society Pilot</span>
            </button>
          )}
        </div>

        {/* Trust Stats & Pillars */}
        <div className="mt-16 pt-12 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">100% Secure Handover</div>
            <p className="text-xs text-slate-400 mt-1">Encrypted dynamic QR and OTP verification for zero misplaced items.</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">&lt; 15 Second Pickup</div>
            <p className="text-xs text-slate-400 mt-1">Quick scan at the hub on your way home with zero paperwork.</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">Built for High-Density</div>
            <p className="text-xs text-slate-400 mt-1">Easily scales from 100 to 2,000+ flats without gate bottlenecks.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
