import React, { useState } from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  Sliders, 
  PackageX, 
  PackageCheck 
} from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // For interactive slider or side-by-side view
  const [viewMode, setViewMode] = useState<'split' | 'slider'>('split');

  return (
    <section id="comparison" className="relative py-24 sm:py-32 bg-slate-950 text-white overflow-hidden border-t border-slate-800">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-rose-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm">
            <Sliders className="w-3.5 h-3.5" />
            <span>The Contrast</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            No more parcel chaos. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              Welcome to total delivery calm.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            See how ParcelFlow transforms daily delivery panic into a seamless, scheduled ritual you look forward to.
          </p>

          {/* View Mode Toggle */}
          <div className="inline-flex items-center gap-1.5 mt-8 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'split' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'slider' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Slider
            </button>
          </div>
        </div>

        {/* View Mode 1: Interactive Slider */}
        {viewMode === 'slider' && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> The Daily Chaos ({100 - sliderPosition}%)
              </span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> With ParcelFlow ({sliderPosition}%)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <p className="text-center text-xs text-slate-500 mt-2 font-mono">
              Drag slider left or right to compare real-world experiences
            </p>
          </div>
        )}

        {/* Main Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: The Old Chaos */}
          <div className={`rounded-3xl bg-slate-950 border border-rose-900/40 p-6 sm:p-9 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all ${
            viewMode === 'slider' && sliderPosition > 70 ? 'opacity-40 scale-[0.98]' : 'opacity-100'
          }`}>
            {/* Top Tag & Header */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-950/80">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>No More This: The Daily Delivery Chaos</span>
                </div>
                <div className="text-xs font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded">
                  High Anxiety: 94%
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                "Sir, your parcel is at the gate. Come now!"
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                You're in the middle of a client call or commuting, and your phone starts vibrating aggressively with unpredictable calls.
              </p>

              {/* Simulated Chaotic Notification Feed */}
              <div className="space-y-3 font-sans">
                {/* Notification 1 */}
                <div className="rounded-xl bg-slate-900/90 border border-rose-900/40 p-3.5 relative">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                      Missed Call (3)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">11:32 AM</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    +91 98402 12984 (Delivery Courier)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 italic">
                    "Rang 6 times while you were presenting quarterly figures"
                  </div>
                </div>

                {/* Chat Bubble 1 */}
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                    <span className="flex items-center gap-1 text-slate-300 font-semibold">
                      <MessageSquare className="w-3.5 h-3.5" /> SMS Exchange
                    </span>
                    <span className="font-mono text-[10px]">11:34 AM</span>
                  </div>
                  
                  <div className="bg-rose-950/30 text-rose-200 text-xs p-2.5 rounded-lg border border-rose-900/30">
                    <span className="font-bold text-rose-400 block text-[10px] uppercase">Courier:</span>
                    "Sir, flat 402 koi open nahi kar raha. Main 5 min me chala jaunga."
                  </div>

                  <div className="bg-slate-800/80 text-slate-200 text-xs p-2.5 rounded-lg ml-4 border border-slate-700">
                    <span className="font-bold text-slate-400 block text-[10px] uppercase">You:</span>
                    "Bhaiya main office me hu. Guard ko de do please."
                  </div>

                  <div className="bg-rose-950/30 text-rose-200 text-xs p-2.5 rounded-lg border border-rose-900/30">
                    <span className="font-bold text-rose-400 block text-[10px] uppercase">Courier:</span>
                    "Guard mana kar raha hai lene se. Parcel return daal raha hu."
                  </div>
                </div>

                {/* Final Disaster */}
                <div className="rounded-xl bg-rose-950/40 border border-rose-800/50 p-3 text-xs text-rose-200 flex items-center gap-3">
                  <PackageX className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <div className="font-bold text-rose-300">Delivery Attempt Failed</div>
                    <div className="text-[11px] text-rose-400/80">Re-attempt scheduled 2 days later during work hours again.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Frustrations Summary */}
            <div className="mt-8 pt-5 border-t border-rose-950/80">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-300">
                  ❌ 3-5 stressful phone calls
                </div>
                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-300">
                  ❌ Parcels left on corridor doormats
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: The ParcelFlow Calm */}
          <div className={`rounded-3xl bg-slate-950 border border-emerald-500/40 p-6 sm:p-9 shadow-[0_0_40px_rgba(16,185,129,0.12)] relative overflow-hidden flex flex-col justify-between transition-all ${
            viewMode === 'slider' && sliderPosition < 30 ? 'opacity-40 scale-[0.98]' : 'opacity-100'
          }`}>
            {/* Top Glow Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-950/80">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>With ParcelFlow: Pure Delivery Zen</span>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                  Peace of Mind: 100%
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                "Your parcel is safe. Pick up whenever you want."
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                Deliveries seamlessly drop into the society gate hub. You choose your pickup time and collect with a simple 10-second QR tap.
              </p>

              {/* Simulated Calm ParcelFlow Notification Feed */}
              <div className="space-y-3 font-sans">
                {/* Step 1: Silent Secure Drop */}
                <div className="rounded-xl bg-slate-900/90 border border-emerald-500/30 p-3.5 relative">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Silent Confirmation
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">11:30 AM</span>
                  </div>
                  <div className="text-xs text-white font-medium">
                    Amazon Package Safely Logged at Gate Hub
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Scanned into Locker Bay B-07. No phone calls required.
                  </div>
                </div>

                {/* Step 2: Resident Chooses Time */}
                <div className="rounded-xl bg-blue-950/30 border border-blue-500/30 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Scheduled Handover Window
                    </span>
                    <span className="font-mono text-[10px] text-blue-400">01:15 PM</span>
                  </div>
                  <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Chosen Pickup Window:</div>
                      <div className="text-sm font-bold text-white">Today: 8:00 PM – 8:30 PM</div>
                    </div>
                    <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30">
                      Confirmed ✓
                    </span>
                  </div>
                </div>

                {/* Step 3: Evening Stroll Handover */}
                <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/40 p-3 text-xs text-emerald-200 flex items-center gap-3">
                  <PackageCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-300">Collected During Evening Walk</div>
                    <div className="text-[11px] text-emerald-400/80">Flapped dynamic QR at hub terminal • Elapsed time: 14 seconds.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Benefits Summary */}
            <div className="mt-8 pt-5 border-t border-emerald-950/80">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                  ✅ 0 disruptive phone calls
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                  ✅ Bank-grade QR & OTP custody
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;

