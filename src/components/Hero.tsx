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
  QrCode,
  Sparkles,
  Info,
  Calendar,
  X
} from 'lucide-react';

interface SlotOption {
  id: string;
  label: string;
  start: string;
  end: string;
  sub: string;
  tag?: string;
  popular?: boolean;
}

const TIME_SLOTS: SlotOption[] = [
  { id: 'slot-1', label: '5:00 PM – 5:30 PM', start: '5:00 PM', end: '5:30 PM', sub: 'Early Evening', tag: 'Fast Handover' },
  { id: 'slot-2', label: '6:30 PM – 7:00 PM', start: '6:30 PM', end: '7:00 PM', sub: 'Post-Work Rush', tag: 'Peak Commute' },
  { id: 'slot-3', label: '8:00 PM – 8:30 PM', start: '8:00 PM', end: '8:30 PM', sub: 'Prime Evening', tag: 'Most Popular', popular: true },
  { id: 'slot-4', label: '9:15 PM – 9:45 PM', start: '9:15 PM', end: '9:45 PM', sub: 'Late Handover', tag: 'Night Owls' },
];

export const Hero: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<string>('8:00 PM – 8:30 PM');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [showPassModal, setShowPassModal] = useState<boolean>(false);
  const [customTimeOpen, setCustomTimeOpen] = useState<boolean>(false);
  const [customHour, setCustomHour] = useState<string>('07:30 PM');

  const handleSelectSlot = (slotLabel: string) => {
    setSelectedSlot(slotLabel);
    setFeedbackNotice(`Pickup slot confirmed: ${slotLabel}!`);
    const timer = setTimeout(() => {
      setFeedbackNotice(null);
    }, 3800);
    return () => clearTimeout(timer);
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `${customHour} – ${customHour.replace(/(\d+):(\d+)/, (_, h, m) => {
      const min = parseInt(m, 10) + 30;
      return min >= 60 ? `${(parseInt(h, 10) % 12) + 1}:00` : `${h}:${min}`;
    })}`;
    setSelectedSlot(formatted);
    setCustomTimeOpen(false);
    setFeedbackNotice(`Custom window saved: ${formatted}!`);
  };

  return (
    <section className="relative overflow-hidden bg-[#FEF9F3] text-[#0A1128] pt-28 pb-16 md:pt-36 md:pb-24 border-b-2 border-[#0A1128]/15">
      {/* Subtle Warm Halftone Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1.6px, transparent 1.6px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN (Matches User's Reference Artwork) ================= */}
          <div className="md:col-span-5 space-y-6 text-center md:text-left z-10">
            
            {/* Playful Green Brush Badge with Yellow Burst Lines */}
            <div className="inline-flex items-center justify-center md:justify-start">
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
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight leading-[1.02] text-[#0A1128] drop-shadow-[2px_3px_0px_rgba(10,17,40,0.15)]">
              Your parcel. <br />
              <span className="relative inline-block">
                Your time.
                <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-300/40 -z-10 rounded-full -rotate-1" />
              </span>
            </h1>

            {/* Subtitle in friendly italic/rounded font */}
            <p className="text-xl sm:text-2xl italic font-semibold text-slate-700 tracking-wide">
              Never miss a delivery again.
            </p>

            {/* Buttons: Download App → and ▷ How It Works */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              {/* Royal Blue Pill: Download App → */}
              <a
                href="/download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 lg:px-8 py-3.5 lg:py-4 rounded-full bg-[#1D4ED8] hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg border-2 border-[#0A1128] shadow-[3.5px_3.5px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A1128] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0A1128] transition-all group"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                <span>Download App</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* White Pill with Black Border: ▷ How It Works */}
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 lg:px-7 py-3.5 lg:py-4 rounded-full bg-white hover:bg-amber-50 text-[#0A1128] font-extrabold text-base sm:text-lg border-2 border-[#0A1128] shadow-[3.5px_3.5px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A1128] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0A1128] transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-[#0A1128] flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Play className="w-3 h-3 fill-[#0A1128] text-[#0A1128] translate-x-0.5" />
                </div>
                <span>How It Works</span>
              </a>
            </div>

            {/* Hand-drawn Orange Curved Arrow pointing down */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
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
              <span className="text-xs sm:text-sm font-bold text-slate-700 italic bg-amber-200/90 px-3 py-1 rounded-md border border-[#0A1128] shadow-[1.5px_1.5px_0px_#0A1128]">
                Takes 30 seconds to set up for your apartment! 🎉
              </span>
            </div>

            {/* Flying Cardboard Package with Speed Lines (Bottom Left) */}
            <div className="pt-2 flex items-center justify-center md:justify-start">
              <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
                {/* Speed Lines */}
                <div className="flex flex-col gap-1 items-end opacity-80">
                  <span className="w-7 h-1 bg-amber-400 rounded-full"></span>
                  <span className="w-10 h-1 bg-orange-400 rounded-full"></span>
                  <span className="w-5 h-1 bg-blue-500 rounded-full"></span>
                </div>

                {/* Flying Cardboard Package Mascot */}
                <div className="relative w-11 h-11 -rotate-6 hover:rotate-6 transition-transform">
                  <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[2px_2px_0px_rgba(10,17,40,0.6)]" fill="none">
                    <polygon points="24,6 42,15 24,24 6,15" fill="#FBBF24" stroke="#0A1128" strokeWidth="2" />
                    <polygon points="20,8 28,12 28,22 20,18" fill="#F59E0B" opacity="0.8" />
                    <polygon points="6,15 24,24 24,42 6,33" fill="#D97706" stroke="#0A1128" strokeWidth="2" />
                    <polygon points="24,24 42,15 42,33 24,42" fill="#B45309" stroke="#0A1128" strokeWidth="2" />
                    <rect x="27" y="22" width="10" height="7" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1" />
                    <line x1="29" y1="24" x2="35" y2="24" stroke="#0A1128" strokeWidth="1" />
                    <line x1="29" y1="26" x2="33" y2="26" stroke="#0A1128" strokeWidth="1" />
                  </svg>
                </div>

                <div className="text-left">
                  <div className="text-xs font-black text-[#0A1128] flex items-center gap-1.5">
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

          {/* ================= RIGHT COLUMN (Rider Scene & Interactive Timing Layout) ================= */}
          <div className="md:col-span-7 relative flex flex-col items-center">
            
            {/* The Main Illustration Canvas (Full-Bleed, Seamless Warm Cream) */}
            <div className="relative w-full max-w-[620px] select-none">
              
              {/* Pristine Illustrated Courier Scene from User Reference */}
              <div className="relative w-full overflow-visible">
                <img
                  src="/rider-hero-perfect.png"
                  alt="ParcelFlow Cheerful Delivery Courier on Blue Scooter"
                  className="w-full h-auto object-contain max-h-[460px] sm:max-h-[520px] drop-shadow-[0_12px_24px_rgba(10,17,40,0.08)]"
                  onError={(e) => {
                    e.currentTarget.src = '/rider-scene.png';
                  }}
                />

                {/* Dynamic Floating Overlay: Live Handover Slot Pill synchronized with state */}
                <div 
                  className="absolute bottom-16 right-4 sm:bottom-20 sm:right-6 z-20 cursor-pointer group"
                  onClick={() => setShowPassModal(true)}
                  title="Click to view digital pickup pass"
                >
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-sm text-[#0A1128] font-black text-xs sm:text-sm border-2 border-emerald-500 shadow-[3px_3px_0px_#0A1128] hover:scale-105 transition-all">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedSlot}</span>
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-extrabold ml-1 shadow-sm">
                      ✓
                    </span>
                  </div>
                </div>

                {/* Interactive Tooltip on "Parcel Arrived!" area */}
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === 'parcel' ? null : 'parcel')}
                  className="absolute top-36 right-4 sm:top-40 sm:right-8 z-20 w-8 h-8 rounded-full bg-amber-400/30 hover:bg-amber-400/60 border border-amber-600 flex items-center justify-center transition-all animate-pulse"
                  title="Click to inspect arrival status"
                >
                  <Info className="w-4 h-4 text-[#0A1128]" />
                </button>

                {activeTooltip === 'parcel' && (
                  <div className="absolute top-44 right-4 sm:right-8 z-30 w-64 p-3 rounded-2xl bg-[#0A1128] text-white text-xs border border-white/20 shadow-2xl animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/15">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" /> Package at Society Hub
                      </span>
                      <button onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-200">
                      Amazon package arrived at Gate 1 Hub. Stored in climate-safe locker bay. Ready for pickup during your selected slot: <span className="font-bold text-emerald-300">{selectedSlot}</span>.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* ================= INTERACTIVE TIMING ARRANGER (Arranged Layout) ================= */}
            <div className="w-full max-w-[620px] mt-2 z-20">
              <div className="bg-white rounded-3xl border-[3px] border-[#0A1128] shadow-[5px_5px_0px_#0A1128] p-4 sm:p-5">
                
                {/* Header: Title + Notification Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 border-2 border-[#0A1128] text-blue-700 flex items-center justify-center shadow-[1.5px_1.5px_0px_#0A1128]">
                      <Calendar className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#0A1128] flex items-center gap-1.5">
                        <span>Select Your Handover Slot</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                          Interactive Demo
                        </span>
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500">
                        Choose when you want to collect your parcel from the society hub
                      </p>
                    </div>
                  </div>

                  {/* Toast Feedback Chip */}
                  {feedbackNotice ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-200 text-xs font-bold text-emerald-800 bg-emerald-100 border-2 border-emerald-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>{feedbackNotice}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowPassModal(true)}
                      className="text-xs font-black text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                  )}
                </div>

                {/* 4 Interactive Slot Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot.includes(slot.start);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleSelectSlot(slot.label)}
                        className={`relative p-2.5 rounded-2xl text-left border-2 transition-all duration-150 ${
                          isSelected
                            ? 'bg-[#1D4ED8] text-white border-[#0A1128] shadow-[3.5px_3.5px_0px_#0A1128] -translate-y-1'
                            : 'bg-[#FEF9F3] hover:bg-amber-50 text-slate-900 border-slate-300 hover:border-[#0A1128] shadow-[2px_2px_0px_#0A1128]/30 hover:-translate-y-0.5'
                        }`}
                      >
                        {slot.popular && (
                          <span className={`absolute -top-2.5 right-2 text-[9px] font-black px-2 py-0.5 rounded-full border ${
                            isSelected
                              ? 'bg-amber-300 text-[#0A1128] border-[#0A1128] shadow-[1px_1px_0px_#0A1128]'
                              : 'bg-amber-200 text-amber-900 border-amber-400'
                          }`}>
                            Popular
                          </span>
                        )}
                        <div className="text-xs font-black flex items-center justify-between">
                          <span>{slot.start}</span>
                          {isSelected ? (
                            <span className="w-4 h-4 rounded-full bg-white text-[#1D4ED8] flex items-center justify-center text-[10px] font-extrabold">
                              ✓
                            </span>
                          ) : (
                            <Clock className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                        <div className={`text-[11px] font-bold mt-0.5 ${
                          isSelected ? 'text-white' : 'text-slate-800'
                        }`}>
                          {slot.end}
                        </div>
                        <div className={`text-[10px] font-medium mt-1 ${
                          isSelected ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {slot.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Sub-Bar: Custom Time + Digital Security Guarantee */}
                <div className="mt-3 pt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Locker Bay #14 Reserved • OTP: <strong className="text-[#0A1128] font-mono">7492</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomTimeOpen(!customTimeOpen)}
                    className="text-blue-600 hover:text-blue-800 font-extrabold underline underline-offset-2 flex items-center gap-1"
                  >
                    <span>Need a custom time?</span>
                  </button>
                </div>

                {/* Custom Time Slot Expandable Drawer */}
                {customTimeOpen && (
                  <form onSubmit={handleCustomTimeSubmit} className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
                    <input
                      type="text"
                      value={customHour}
                      onChange={(e) => setCustomHour(e.target.value)}
                      placeholder="e.g. 07:15 PM"
                      className="px-3 py-1.5 rounded-xl border-2 border-[#0A1128] text-xs font-bold w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]"
                    >
                      Set Window
                    </button>
                    <span className="text-[11px] text-slate-500">Pick any 30-min window between 8:00 AM – 11:00 PM</span>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ================= DIGITAL HANDOVER PASS MODAL ================= */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-[8px_8px_0px_#0A1128] p-6 text-center">
            <button
              onClick={() => setShowPassModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 border-2 border-[#0A1128] text-blue-700 flex items-center justify-center mb-3 shadow-[2px_2px_0px_#0A1128]">
              <Package className="w-6 h-6" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-400 mb-2">
              Ready for Pickup
            </span>

            <h3 className="text-xl font-black text-[#0A1128]">Society Hub Pickup Pass</h3>
            <p className="text-xs text-slate-600 mt-1">
              Show this QR or enter OTP at the Emerald Towers Gate 1 Hub
            </p>

            {/* QR Mockup */}
            <div className="my-5 p-4 rounded-2xl bg-[#FEF9F3] border-2 border-[#0A1128] inline-block shadow-[3px_3px_0px_#0A1128]">
              <div className="w-40 h-40 bg-white p-2 rounded-xl border border-slate-300 flex flex-col items-center justify-center">
                <QrCode className="w-32 h-32 text-[#0A1128]" />
              </div>
              <div className="mt-2 text-xs font-mono font-black text-slate-800 tracking-wider">
                PASS: PF-EMR-8492
              </div>
            </div>

            {/* OTP Code Box */}
            <div className="bg-amber-100 border-2 border-[#0A1128] rounded-2xl p-3 mb-4 shadow-[2px_2px_0px_#0A1128]">
              <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">One-Time Handover PIN</div>
              <div className="text-2xl font-black font-mono text-[#0A1128] tracking-widest mt-0.5">
                7 4 9 2
              </div>
              <div className="text-[10px] text-amber-800 mt-1">Valid window: <strong className="font-bold">{selectedSlot}</strong></div>
            </div>

            <button
              onClick={() => setShowPassModal(false)}
              className="w-full py-3 rounded-full bg-[#1D4ED8] hover:bg-blue-600 text-white font-extrabold text-sm border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]"
            >
              Done / Close Pass
            </button>
          </div>
        </div>
      )}

      {/* Decorative Ground Curve Wave at Bottom (Matches Reference Artwork) */}
      <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none overflow-hidden opacity-90">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-full fill-blue-600">
          <path d="M0,25 C300,5 600,35 1200,10 L1200,40 L0,40 Z" />
        </svg>
      </div>
    </section>
  );
};
