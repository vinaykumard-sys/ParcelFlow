import React from 'react';
import { 
  Download, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Users,
  CheckCircle2,
  Heart
} from 'lucide-react';

interface FinalCTAProps {
  onOpenPilotModal?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenPilotModal }) => {
  return (
    <section className="relative py-24 sm:py-32 bg-[#FEF9F3] text-[#0A1128] overflow-hidden border-t-2 border-[#0A1128]">
      {/* Background Decorative polka dots */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#0A1128 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Floating Cartoon Stickers */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-300 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-[#0A1128] text-xs sm:text-sm font-black -rotate-2 hover:rotate-0 transition-transform">
            <Sparkles className="w-4 h-4 text-[#0A1128]" />
            <span>Zero Doorstep Thefts</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-[#0A1128] text-xs sm:text-sm font-black rotate-2 hover:rotate-0 transition-transform">
            <span>📦 500+ Flat Communities Ready</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-300 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-[#0A1128] text-xs sm:text-sm font-black -rotate-1 hover:rotate-0 transition-transform">
            <span>⚡ 10-Second QR Pickup</span>
          </div>
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A1128] leading-tight">
          Ready to stop waiting around <br />
          <span className="relative inline-block text-blue-600">
            for your parcels?
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
              <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
          Bring ParcelFlow to your gated apartment society today. Experience zero gate clutter, complete delivery security, and pickup at your exact convenience.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/download"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base border-2 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A1128] transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Download App for Free</span>
          </a>

          <button
            type="button"
            onClick={() => onOpenPilotModal ? onOpenPilotModal() : alert('Pilot inquiry: pilot@parcelflow.in')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-amber-300 hover:bg-amber-200 text-[#0A1128] font-black text-base border-2 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A1128] transition-all"
          >
            <Building2 className="w-5 h-5 text-[#0A1128]" />
            <span>Bring ParcelFlow to My Society</span>
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-14 pt-8 border-t-2 border-[#0A1128]/10 flex flex-wrap items-center justify-center gap-6 text-xs font-black text-slate-700">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Free For Residents</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Works With All Couriers (Amazon, Flipkart, Blinkit)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>No Hardware Cost for Society Pilots</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FinalCTA;
