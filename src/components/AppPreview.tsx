import React, { useState } from 'react';

type PickupState = 'idle' | 'selecting' | 'scheduled';

interface TimeOption {
  id: string;
  time: string;
  label: string;
  spotsLeft: number;
}

const TIME_OPTIONS: TimeOption[] = [
  { id: 't1', time: '5:00 PM – 5:30 PM', label: 'Early Evening', spotsLeft: 6 },
  { id: 't2', time: '6:00 PM – 6:30 PM', label: 'Work Return Slot', spotsLeft: 4 },
  { id: 't3', time: '7:00 PM – 7:30 PM', label: 'Prime Slot', spotsLeft: 8 },
  { id: 't4', time: '8:00 PM – 8:30 PM', label: 'Recommended', spotsLeft: 12 },
];

export const AppPreview: React.FC = () => {
  const [pickupState, setPickupState] = useState<PickupState>('idle');
  const [selectedTimeId, setSelectedTimeId] = useState<string>('t4');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const selectedTime = TIME_OPTIONS.find((t) => t.id === selectedTimeId) || TIME_OPTIONS[3];

  const handleCopyOtp = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="app-preview" className="relative py-24 sm:py-32 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Interactive Live App Demo
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">ParcelFlow</span> app.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Take complete command of your society deliveries. Schedule pickups in 2 taps, receive zero-spam updates, and enjoy seamless OTP handovers.
          </p>
        </div>

        {/* Centerpiece Phone Frame Container with Satellite Cards */}
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          {/* Satellite Card 1: Instant SMS & App Alert (Top Left on desktop) */}
          <div className="hidden lg:flex absolute -left-12 top-20 z-30 w-72 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl animate-float">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Instant SMS & App Alert</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Arrived at Gate 2 Hub at 7:14 PM with carrier & shelf coordinates.
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Sent in 0.8s
                </div>
              </div>
            </div>
          </div>

          {/* Satellite Card 2: Encrypted OTP Verification (Bottom Right on desktop) */}
          <div className="hidden lg:flex absolute -right-12 bottom-28 z-30 w-72 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl backdrop-blur-xl animate-float-delayed">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-white">Encrypted OTP Verification</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dynamic OTP token and cryptographic QR ensure only you or your authorized family collects.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    OTP: 7492
                  </span>
                  <span className="text-[10px] text-slate-400">Time-synced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Satellite Card 3: Zero Gate Wait (Top Right on desktop) */}
          <div className="hidden lg:flex absolute -right-8 top-16 z-30 w-64 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-white">&lt; 30 Sec Pickup</div>
                <div className="text-[10px] text-slate-400">Pre-staged at collection desk</div>
              </div>
            </div>
          </div>

          {/* Interactive Mobile Phone Mockup */}
          <div className="relative w-[340px] sm:w-[380px] rounded-[48px] p-3 sm:p-4 bg-slate-800 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(59,130,246,0.15)] border-4 border-slate-700/80 ring-1 ring-slate-600/40">
            {/* Phone Outer Glare & Buttons */}
            <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-slate-600 rounded-l-sm" />
            <div className="absolute -left-[7px] top-42 w-[3px] h-14 bg-slate-600 rounded-l-sm" />
            <div className="absolute -left-[7px] top-60 w-[3px] h-14 bg-slate-600 rounded-l-sm" />
            <div className="absolute -right-[7px] top-36 w-[3px] h-16 bg-slate-600 rounded-r-sm" />

            {/* Inner Phone Screen */}
            <div className="relative w-full rounded-[38px] bg-slate-950 overflow-hidden border border-slate-800 shadow-inner flex flex-col min-h-[640px] select-none">
              {/* Dynamic Island / Notch */}
              <div className="pt-3 px-6 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20">
                <span>7:24</span>
                {/* Dynamic Island capsule */}
                <div className="w-24 h-5 rounded-full bg-black border border-slate-800/80 flex items-center justify-center gap-1.5 shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  {/* Battery SVG */}
                  <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="7" width="16" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                    <rect x="4" y="9" width="11" height="6" rx="1" fill="currentColor" />
                    <rect x="19" y="10" width="2" height="4" rx="1" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* App Content Header */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Good evening 👋</span>
                    <h3 className="text-base font-bold text-white">Alex Sharma</h3>
                    <span className="text-[10px] text-blue-400 font-mono">Apartment B-402 • Tower 2</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                    AS
                  </div>
                </div>

                {/* 2 Parcels Waiting Banner */}
                <div className="mt-4 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-950/80 to-indigo-950/60 border border-blue-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-xs font-semibold text-white">2 Parcels Waiting</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                    Gate 2 Hub
                  </span>
                </div>
              </div>

              {/* Scrollable Parcel List / State Area */}
              <div className="flex-1 px-5 pb-5 space-y-3 overflow-y-auto">
                {/* Main Parcel Card (Amazon) */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Amazon • Echo Dot Gen 5</div>
                        <div className="text-[10px] text-slate-400 font-mono">#PF-94821 • Arrived 10 mins ago</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                    <span>Gate 2 Hub • Shelf B-08</span>
                    <span className="font-semibold text-slate-300">0.9 kg Box</span>
                  </div>

                  {/* Dynamic Button or Scheduled Status based on state */}
                  {pickupState === 'scheduled' ? (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          ✓ Pickup Scheduled
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Today {selectedTime.time.split(' – ')[0]}</span>
                      </div>

                      {/* Monospace OTP Badge */}
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-[9px] font-mono text-slate-400 uppercase">Handover OTP</div>
                          <div className="text-lg font-mono font-extrabold text-white tracking-widest text-emerald-300">
                            7 4 9 2
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyOtp}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-300 transition-colors"
                        >
                          {isCopied ? 'Copied ✓' : 'Copy'}
                        </button>
                      </div>

                      {/* Mini QR Placeholder */}
                      <div className="mt-2.5 pt-2 border-t border-emerald-900/40 flex items-center justify-between">
                        <div className="text-[10px] text-slate-400 leading-tight">
                          Show QR or OTP at Gate 2 counter
                        </div>
                        <button
                          type="button"
                          onClick={() => setPickupState('selecting')}
                          className="text-[10px] font-semibold text-blue-400 hover:underline"
                        >
                          Change Slot
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPickupState('selecting')}
                      className="mt-3 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 group"
                    >
                      <span>Schedule Pickup</span>
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Second Parcel Card (Myntra) */}
                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">Myntra • Urban Sneakers</div>
                      <div className="text-[10px] text-slate-400">Arrived 45 mins ago • Shelf C-02</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      Stored
                    </span>
                  </div>
                </div>

                {/* Bottom App Navigation Bar */}
                <div className="pt-2 flex items-center justify-around border-t border-slate-900 text-slate-500 text-[10px]">
                  <div className="flex flex-col items-center text-blue-400 font-semibold">
                    <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Parcels
                  </div>
                  <div className="flex flex-col items-center hover:text-slate-300 transition-colors">
                    <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule
                  </div>
                  <div className="flex flex-col items-center hover:text-slate-300 transition-colors">
                    <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0a2 2 0 002-2v-4a2 2 0 00-2-2 2 2 0 00-2 2v4a2 2 0 002 2zm-6 0a2 2 0 002-2v-4a2 2 0 00-2-2 2 2 0 00-2 2v4a2 2 0 002 2zm-6 0h2" />
                    </svg>
                    Passes
                  </div>
                  <div className="flex flex-col items-center hover:text-slate-300 transition-colors">
                    <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </div>
                </div>
              </div>

              {/* IN-PHONE SLIDING MODAL / DRAWER */}
              {pickupState === 'selecting' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col justify-end animate-fadeIn">
                  <div className="rounded-t-[32px] bg-slate-900 border-t border-slate-700 p-5 shadow-2xl animate-slideUp">
                    {/* Drawer drag handle */}
                    <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4" />

                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-white">Choose Pickup Window</h4>
                      <button
                        type="button"
                        onClick={() => setPickupState('idle')}
                        className="text-slate-400 hover:text-white text-xs font-mono"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-4">
                      Select when you would like to pick up from Gate 2 Hub today.
                    </p>

                    {/* Time Options list */}
                    <div className="space-y-2 mb-4">
                      {TIME_OPTIONS.map((slot) => {
                        const isChosen = selectedTimeId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedTimeId(slot.id)}
                            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isChosen
                                ? 'bg-blue-600/20 border-cyan-400 text-white shadow-sm'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold font-mono">{slot.time}</div>
                              <div className="text-[10px] text-slate-400">{slot.label}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                                {slot.spotsLeft} slots left
                              </span>
                              {isChosen ? (
                                <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                                  ✓
                                </span>
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Confirm Action Button */}
                    <button
                      type="button"
                      onClick={() => setPickupState('scheduled')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
                    >
                      Confirm Today at {selectedTime.time.split(' – ')[0]}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
          </div>

          {/* Mobile view fallback: satellite cards beneath */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:hidden w-full max-w-sm">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs font-bold text-white mb-1">Instant SMS & App Alert</div>
              <p className="text-[11px] text-slate-400">
                Arrived at Gate 2 Hub at 7:14 PM with carrier & shelf coordinates.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30">
              <div className="text-xs font-bold text-emerald-400 mb-1">Encrypted OTP Verification</div>
              <p className="text-[11px] text-slate-400">
                Dynamic OTP token and cryptographic QR ensure secure collection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
