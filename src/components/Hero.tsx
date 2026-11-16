import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Play, 
  ArrowRight, 
  Clock, 
  Check, 
  MapPin, 
  BellRing, 
  Package, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

interface SlotOption {
  id: string;
  label: string;
  sub: string;
  popular?: boolean;
}

const TIME_SLOTS: SlotOption[] = [
  { id: 'slot-1', label: '5:00 PM – 5:30 PM', sub: 'Early Evening' },
  { id: 'slot-2', label: '6:30 PM – 7:00 PM', sub: 'Post-Work' },
  { id: 'slot-3', label: '8:00 PM – 8:30 PM', sub: 'Most Popular', popular: true },
  { id: 'slot-4', label: '9:15 PM – 9:45 PM', sub: 'Late Handover' },
];

export const Hero: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<string>('8:00 PM – 8:30 PM');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleSelectSlot = (slotLabel: string) => {
    setSelectedSlot(slotLabel);
    setFeedbackNotice(`Delivery window confirmed for ${slotLabel}!`);
    const timer = setTimeout(() => {
      setFeedbackNotice(null);
    }, 3800);
    return () => clearTimeout(timer);
  };

  return (
    <section className="relative overflow-hidden bg-[#FEF9F3] text-[#0A1128] pt-28 pb-20 md:pt-36 md:pb-28 border-b-2 border-[#0A1128]/15">
      {/* Subtle Warm Halftone Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1.6px, transparent 1.6px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN (Matches Reference Image) ================= */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-10">
            
            {/* Playful Green Brush Badge with Yellow Burst Lines */}
            <div className="inline-flex items-center justify-center lg:justify-start">
              <div className="relative inline-flex items-center group cursor-default select-none">
                {/* Left Burst Rays */}
                <div className="absolute -left-6 -top-2.5 w-6 h-6 pointer-events-none text-amber-400">
                  <svg viewBox="0 0 24 24" className="w-full h-full stroke-current" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="12" x2="8" y2="12" />
                    <line x1="5" y1="5" x2="9" y2="9" />
                    <line x1="12" y1="3" x2="12" y2="8" />
                  </svg>
                </div>

                {/* Mint Green Brush Pill Badge */}
                <div className="relative px-5 py-1.5 rounded-full bg-[#86EFAC] text-[#0A1128] font-black text-sm sm:text-base border-2 border-[#0A1128] shadow-[2.5px_2.5px_0px_#0A1128] -rotate-1 group-hover:rotate-0 transition-transform flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span className="tracking-wide">ParcelFlow</span>
                </div>

                {/* Right Burst Rays */}
                <div className="absolute -right-6 -bottom-2 w-6 h-6 pointer-events-none text-amber-400">
                  <svg viewBox="0 0 24 24" className="w-full h-full stroke-current" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="16" y1="12" x2="21" y2="12" />
                    <line x1="15" y1="15" x2="19" y2="19" />
                    <line x1="12" y1="16" x2="12" y2="21" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Massive Cartoon Headline: "Your parcel. Your time." */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[74px] font-black tracking-tight leading-[1.02] text-[#0A1128] drop-shadow-[2px_3px_0px_rgba(10,17,40,0.18)]">
              Your parcel. <br />
              Your time.
            </h1>

            {/* Subtitle in friendly italic/rounded font */}
            <p className="text-xl sm:text-2xl italic font-semibold text-slate-700 tracking-wide">
              Never miss a delivery again.
            </p>

            {/* Buttons: Download App → and ▷ How It Works */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Royal Blue Pill: Download App → */}
              <a
                href="/download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#1D4ED8] hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_#0A1128] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0A1128] transition-all group"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                <span>Download App</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* White Pill with Black Border: ▷ How It Works */}
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white hover:bg-amber-50 text-[#0A1128] font-extrabold text-base sm:text-lg border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_#0A1128] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0A1128] transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-[#0A1128] flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Play className="w-3 h-3 fill-[#0A1128] text-[#0A1128] translate-x-0.5" />
                </div>
                <span>How It Works</span>
              </a>
            </div>

            {/* Hand-drawn Orange Curved Arrow underneath pointing down */}
            <div className="hidden sm:flex items-center justify-center lg:justify-start gap-3 pt-2">
              <svg 
                className="w-10 h-8 text-orange-500 -rotate-6" 
                viewBox="0 0 44 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M4 6 C 14 18, 26 26, 38 24 M 38 24 L 28 18 M 38 24 L 32 30" 
                  stroke="#EA580C" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <span className="text-xs sm:text-sm font-bold text-slate-700 italic bg-amber-200/80 px-2.5 py-1 rounded-md border border-[#0A1128] shadow-[1.5px_1.5px_0px_#0A1128]">
                Takes 30 seconds to set up for your apartment! 🎉
              </span>
            </div>

            {/* Flying Cardboard Package with Speed Lines */}
            <div className="pt-2 flex items-center justify-center lg:justify-start">
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
                {/* Speed Lines */}
                <div className="flex flex-col gap-1 items-end opacity-75">
                  <span className="w-7 h-1 bg-amber-400 rounded-full"></span>
                  <span className="w-10 h-1 bg-orange-400 rounded-full"></span>
                  <span className="w-5 h-1 bg-blue-500 rounded-full"></span>
                </div>

                {/* Flying Cardboard Package Illustration */}
                <div className="relative w-11 h-11 -rotate-6 hover:rotate-6 transition-transform">
                  <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_rgba(10,17,40,0.6)]" fill="none">
                    {/* Top Flap */}
                    <polygon points="24,6 42,15 24,24 6,15" fill="#FBBF24" stroke="#0A1128" strokeWidth="2" />
                    {/* Tape stripe across top */}
                    <polygon points="20,8 28,12 28,22 20,18" fill="#F59E0B" opacity="0.8" />
                    {/* Left Face */}
                    <polygon points="6,15 24,24 24,42 6,33" fill="#D97706" stroke="#0A1128" strokeWidth="2" />
                    {/* Right Face */}
                    <polygon points="24,24 42,15 42,33 24,42" fill="#B45309" stroke="#0A1128" strokeWidth="2" />
                    {/* Shipping Label Badge */}
                    <rect x="27" y="22" width="10" height="7" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1" />
                    <line x1="29" y1="24" x2="35" y2="24" stroke="#0A1128" strokeWidth="1" />
                    <line x1="29" y1="26" x2="33" y2="26" stroke="#0A1128" strokeWidth="1" />
                  </svg>
                </div>

                <div className="text-left">
                  <div className="text-xs font-black text-[#0A1128] flex items-center gap-1">
                    <span>15-Sec Hub Handover</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full border border-emerald-400">Verified</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-600">
                    No waiting at gate. Collect with encrypted OTP/QR.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (Rider Scene & Interactive Layout) ================= */}
          <div className="lg:col-span-7 relative">
            
            {/* The Main Stage Card */}
            <div className="relative rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-3 sm:p-5">
              
              {/* Window Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 border border-[#0A1128]" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 border border-[#0A1128]" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 border border-[#0A1128]" />
                  <span className="text-xs font-black text-[#0A1128] ml-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Emerald Towers • Gate Hub #4
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Hub Live</span>
                </div>
              </div>

              {/* Rider Artwork Canvas Area */}
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#0A1128] bg-[#FEF9F3] flex items-center justify-center">
                {/* Cheerful Courier Artwork */}
                <img
                  src="/rider-scene.png"
                  alt="ParcelFlow Cheerful Delivery Courier on Blue Scooter"
                  className="w-full h-auto object-cover max-h-[380px] sm:max-h-[440px] select-none"
                  onError={(e) => {
                    // Fallback to hero-illustration.jpg if needed
                    e.currentTarget.src = '/hero-illustration.jpg';
                  }}
                />

                {/* ================= FLOATING STICKERS WITH TOOLTIPS ================= */}

                {/* Sticker 1: Top-Left "🔔 Parcel Arrived!" */}
                <div 
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 group cursor-pointer"
                  onClick={() => setActiveTooltip(activeTooltip === 'arrived' ? null : 'arrived')}
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-300 text-[#0A1128] font-black text-xs sm:text-sm border-2 border-[#0A1128] shadow-[2.5px_2.5px_0px_#0A1128] hover:scale-105 transition-transform -rotate-2">
                    <BellRing className="w-3.5 h-3.5 text-[#0A1128] animate-bounce" />
                    <span>🔔 Parcel Arrived!</span>
                  </div>

                  {/* Interactive Tooltip */}
                  <div className={`absolute top-full left-0 mt-2 w-56 p-2.5 rounded-xl bg-[#0A1128] text-white text-xs font-medium border border-white/20 shadow-xl z-30 transition-all duration-150 ${
                    activeTooltip === 'arrived' ? 'block' : 'hidden group-hover:block'
                  }`}>
                    <div className="font-bold text-amber-300 mb-0.5 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> Gate Check-In Active
                    </div>
                    <p className="text-[11px] text-slate-200">
                      Amazon & Flipkart parcels checked in at Gate 1. Securely held in your society's hub bay.
                    </p>
                  </div>
                </div>

                {/* Sticker 2: Top-Right "🗓️ Choose Your Time" (Dynamic Slot Preview) */}
                <div 
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 group cursor-pointer"
                  onClick={() => setActiveTooltip(activeTooltip === 'time' ? null : 'time')}
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-300 text-[#0A1128] font-black text-xs sm:text-sm border-2 border-[#0A1128] shadow-[2.5px_2.5px_0px_#0A1128] hover:scale-105 transition-transform rotate-2">
                    <Clock className="w-3.5 h-3.5 text-[#0A1128]" />
                    <span>🗓️ {selectedSlot}</span>
                  </div>

                  {/* Interactive Tooltip */}
                  <div className={`absolute top-full right-0 mt-2 w-60 p-2.5 rounded-xl bg-[#0A1128] text-white text-xs font-medium border border-white/20 shadow-xl z-30 transition-all duration-150 ${
                    activeTooltip === 'time' ? 'block' : 'hidden group-hover:block'
                  }`}>
                    <div className="font-bold text-emerald-300 mb-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Selected Handover Window
                    </div>
                    <p className="text-[11px] text-slate-200">
                      Currently set for <span className="font-bold text-white">{selectedSlot}</span>. Tap any slot bar below to update instantly!
                    </p>
                  </div>
                </div>

                {/* Sticker 3: Mid-Right "📍 Society Hub" */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 z-20 group cursor-pointer hidden sm:block"
                  onClick={() => setActiveTooltip(activeTooltip === 'hub' ? null : 'hub')}
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-400 text-white font-black text-xs sm:text-sm border-2 border-[#0A1128] shadow-[2.5px_2.5px_0px_#0A1128] hover:scale-105 transition-transform -rotate-1">
                    <MapPin className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>📍 Society Hub</span>
                  </div>

                  {/* Interactive Tooltip */}
                  <div className={`absolute top-full right-0 mt-2 w-56 p-2.5 rounded-xl bg-[#0A1128] text-white text-xs font-medium border border-white/20 shadow-xl z-30 transition-all duration-150 ${
                    activeTooltip === 'hub' ? 'block' : 'hidden group-hover:block'
                  }`}>
                    <div className="font-bold text-amber-300 mb-0.5">Emerald Towers Hub</div>
                    <p className="text-[11px] text-slate-200">
                      24/7 CCTV surveillance with digital audit logging for 100% handover security.
                    </p>
                  </div>
                </div>

                {/* Sticker 4 / Floating Tracking Card: Lower Left */}
                <div 
                  className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 group cursor-pointer"
                  onClick={() => setActiveTooltip(activeTooltip === 'tracking' ? null : 'tracking')}
                >
                  <div className="bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-2xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] max-w-[210px] sm:max-w-[240px] hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                      <span className="text-[11px] font-black text-[#0A1128] flex items-center gap-1">
                        <Package className="w-3 h-3 text-blue-600" /> Tracking
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">#PF-8492</span>
                    </div>

                    {/* Progress steps */}
                    <div className="space-y-1 text-[10px] sm:text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                        <span className="line-through opacity-75">Picked</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                        <span className="line-through opacity-75">At Hub</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-700 font-extrabold bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold animate-pulse">✓</span>
                        <span>Scheduled: {selectedSlot.split('–')[0].trim()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Tooltip */}
                  <div className={`absolute bottom-full left-0 mb-2 w-60 p-2.5 rounded-xl bg-[#0A1128] text-white text-xs font-medium border border-white/20 shadow-xl z-30 transition-all duration-150 ${
                    activeTooltip === 'tracking' ? 'block' : 'hidden group-hover:block'
                  }`}>
                    <div className="font-bold text-sky-300 mb-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> End-to-End Tracking
                    </div>
                    <p className="text-[11px] text-slate-200">
                      Shows exact status. Once you schedule a slot, pickup pass is verified in 15 seconds.
                    </p>
                  </div>
                </div>

              </div>

              {/* ================= INTERACTIVE TIMING & TRACKING CONTROLLER ================= */}
              <div className="mt-4 pt-3 border-t-2 border-[#0A1128]/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-blue-100 text-blue-700 border border-blue-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-extrabold text-[#0A1128]">
                        Choose Your Handover Slot:
                      </span>
                      <span className="hidden sm:inline text-[11px] text-slate-500 ml-2">
                        (Tap to test live sync)
                      </span>
                    </div>
                  </div>

                  {/* Live Feedback Toast Chip */}
                  {feedbackNotice ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-200 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>{feedbackNotice}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Info className="w-3 h-3 text-slate-400" />
                      <span>Updates tracker in real time</span>
                    </div>
                  )}
                </div>

                {/* 4 Interactive Time Slot Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot.label;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSelectSlot(slot.label)}
                        className={`relative p-2.5 rounded-xl text-left border-2 transition-all duration-150 ${
                          isSelected
                            ? 'bg-[#1D4ED8] text-white border-[#0A1128] shadow-[3px_3px_0px_#0A1128] -translate-y-0.5'
                            : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300 hover:border-[#0A1128] shadow-[1.5px_1.5px_0px_#0A1128]/40 hover:-translate-y-0.5'
                        }`}
                      >
                        {slot.popular && (
                          <span className={`absolute -top-2 right-2 text-[9px] font-black px-1.5 py-0.2 rounded-full border ${
                            isSelected
                              ? 'bg-amber-300 text-[#0A1128] border-[#0A1128]'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            Popular
                          </span>
                        )}
                        <div className="text-xs font-black flex items-center justify-between">
                          <span>{slot.label.split('–')[0].trim()}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                        <div className={`text-[10px] font-semibold mt-0.5 ${
                          isSelected ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {slot.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
