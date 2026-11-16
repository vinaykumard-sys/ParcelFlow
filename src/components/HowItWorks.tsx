import React, { useState } from 'react';

interface Step {
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

const stepsData: Step[] = [
  {
    number: '01',
    badge: 'Hub Reception',
    title: 'Parcel Arrives at Hub',
    subtitle: 'Couriers drop off safely at the central society hub',
    description: 'No wandering delivery agents inside the premises. All couriers dock directly at the dedicated ParcelFlow Hub where packages are digitally scanned and assigned a secure shelf spot.',
    highlights: ['Barcode / RFID intake', 'Gate congestion reduced by 85%', 'Inspected & logged instantly']
  },
  {
    number: '02',
    badge: 'Smart Notification',
    title: 'You Get Notified',
    subtitle: 'Instant push notification & SMS alert with photo',
    description: 'The moment your package is logged, you receive a crisp notification on your phone with package details, carrier info, and safe storage confirmation.',
    highlights: ['Real-time push & SMS', 'Shelf & locker location tags', 'Zero missed doorbell calls']
  },
  {
    number: '03',
    badge: 'Flexible Scheduling',
    title: 'Choose Your Time',
    subtitle: 'Pick when you want to collect — on your schedule',
    description: 'Coming back late from the office or heading out for dinner? Tap your app and select the 30-minute pickup window that fits seamlessly into your evening routine.',
    highlights: ['30-min guaranteed windows', 'Reschedule with one tap', 'Reminders before closing']
  },
  {
    number: '04',
    badge: 'Verified Handover',
    title: 'Collect Securely',
    subtitle: 'Dynamic QR code and 4-digit OTP handover',
    description: 'Walk down to the hub, flash your dynamic in-app QR code or share your 4-digit OTP. The hub staff verifies in under 15 seconds. Safe, seamless, and completely accounted for.',
    highlights: ['Tamper-evident verification', 'Under 30-sec pickup time', 'Full digital chain of custody']
  }
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('8:00 PM – 8:30 PM');
  const [isQrScanned, setIsQrScanned] = useState<boolean>(false);

  const timeSlots = [
    { id: '6pm', label: '6:00 PM – 6:30 PM', sub: 'Early evening' },
    { id: '7pm', label: '7:00 PM – 7:30 PM', sub: 'Peak slot' },
    { id: '8pm', label: '8:00 PM – 8:30 PM', sub: 'Recommended' },
    { id: '9pm', label: '9:00 PM – 9:30 PM', sub: 'Late evening' },
  ];

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden text-slate-100">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">ParcelFlow</span> Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            From the minute the delivery van arrives at your society gate to the moment you walk back to your door with your parcel.
          </p>
        </div>

        {/* Desktop Step Nav / Stepper Indicators */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-12">
          {stepsData.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                  isActive
                    ? 'bg-slate-900/90 border-blue-500/60 shadow-lg shadow-blue-500/10 scale-[1.02]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.number}
                </div>
                <div>
                  <div className="text-xs uppercase font-medium tracking-wider text-slate-400 mb-0.5">
                    Step {step.number}
                  </div>
                  <div className={`font-semibold text-sm line-clamp-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8">
          {/* Card 01: Parcel Arrives at Hub */}
          <div
            onClick={() => setActiveStep(0)}
            className={`group relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
              activeStep === 0
                ? 'bg-gradient-to-b from-slate-900/95 to-slate-900/70 border-blue-500/60 ring-1 ring-blue-500/30 shadow-2xl shadow-blue-500/10'
                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                STEP 01
              </span>
              <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60">
                Gate Hub Dock
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              Parcel arrives at hub
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Delivery partners hand over packages at the society entry hub. Every box is digitally catalogued with optical barcode scan in seconds.
            </p>

            {/* Illustration 1: SVG Package Entering Hub */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
              {/* Scan laser line animation */}
              <div className="absolute inset-x-8 top-16 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-[0_0_12px_#38bdf8]" />

              {/* Hub Gate Bay Graphic */}
              <div className="relative flex items-center justify-center w-full">
                {/* Hub Box Container */}
                <div className="relative w-40 sm:w-48 h-32 rounded-xl bg-slate-900/90 border-2 border-dashed border-blue-500/40 flex flex-col items-center justify-center p-3 shadow-inner">
                  <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-blue-600 text-[10px] font-mono font-bold tracking-wider text-white uppercase shadow-sm">
                    Bay A-04 Entry
                  </div>

                  {/* 3D Isometric Parcel Box SVG */}
                  <svg className="w-16 h-16 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
                    {/* Top Face */}
                    <path d="M32 6L54 18L32 30L10 18L32 6Z" fill="#3B82F6" fillOpacity="0.85" stroke="#60A5FA" strokeWidth="1.5" />
                    {/* Tape on top */}
                    <path d="M26 15L38 21" stroke="#93C5FD" strokeWidth="2" strokeDasharray="2 2" />
                    {/* Left Face */}
                    <path d="M10 18L32 30V54L10 42V18Z" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="1.5" />
                    {/* Right Face */}
                    <path d="M32 30L54 18V42L32 54V30Z" fill="#1E40AF" stroke="#2563EB" strokeWidth="1.5" />
                    {/* Barcode graphic on box */}
                    <rect x="36" y="34" width="2" height="10" fill="#93C5FD" />
                    <rect x="40" y="34" width="4" height="10" fill="#93C5FD" />
                    <rect x="46" y="34" width="1.5" height="10" fill="#93C5FD" />
                    <rect x="49" y="34" width="3" height="10" fill="#93C5FD" />
                  </svg>

                  <div className="mt-2 text-center">
                    <span className="text-[11px] font-mono text-cyan-300 font-semibold tracking-wide">
                      SCAN: #PF-8839-IN
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Pill below */}
              <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Verified & Safely Tagged at Gate 2
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-4">
              {stepsData[0].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 02: You Get Notified */}
          <div
            onClick={() => setActiveStep(1)}
            className={`group relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
              activeStep === 1
                ? 'bg-gradient-to-b from-slate-900/95 to-slate-900/70 border-indigo-500/60 ring-1 ring-indigo-500/30 shadow-2xl shadow-indigo-500/10'
                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                STEP 02
              </span>
              <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60">
                Instant Dispatch
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
              You get notified
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Skip courier calls when you're in meetings. ParcelFlow triggers an automated push notification and SMS the second it's logged.
            </p>

            {/* Illustration 2: Notification Badge Card Graphic */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
              {/* Radial glow */}
              <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />

              {/* Notification Banner Simulator */}
              <div className="relative w-full max-w-sm rounded-2xl bg-slate-900/90 border border-indigo-500/40 p-4 shadow-xl backdrop-blur-lg transform transition-transform group-hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  {/* App Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/30">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        ParcelFlow
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">Just now</span>
                    </div>
                    <div className="text-xs font-semibold text-indigo-300 mt-1">
                      📦 Amazon delivery arrived
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      Shelf B-14 • Gate 2 Parcel Bay • 1.2 kg Box
                    </div>
                  </div>
                </div>

                {/* Sub-action bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">Tap to schedule pickup</span>
                  <span className="font-semibold text-indigo-400 flex items-center gap-1">
                    Schedule <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>

              {/* Alert Bell Badge */}
              <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
                SMS & WhatsApp mirror sent to +91 98••• ••210
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-4">
              {stepsData[1].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 03: Choose Your Time */}
          <div
            onClick={() => setActiveStep(2)}
            className={`group relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
              activeStep === 2
                ? 'bg-gradient-to-b from-slate-900/95 to-slate-900/70 border-cyan-500/60 ring-1 ring-cyan-500/30 shadow-2xl shadow-cyan-500/10'
                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                STEP 03
              </span>
              <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60">
                Your Control
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              Choose your time
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              No rushing home. Select a 30-minute pickup slot when you're free. The hub prepares your parcel for zero-wait handover.
            </p>

            {/* Illustration 3: Animated Interactive Time Slots */}
            <div className="relative w-full min-h-[224px] sm:h-64 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-800 overflow-hidden flex flex-col justify-center p-4">
              <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
                <span>TODAY'S PICKUP WINDOWS</span>
                <span className="text-cyan-400">Tap a slot to test</span>
              </div>

              {/* Time slot buttons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.label;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTimeSlot(slot.label);
                      }}
                      className={`relative px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-600/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono">{slot.label.split(' – ')[0]}</span>
                        {isSelected ? (
                          <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{slot.sub}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Slot Feedback */}
              <div className="mt-3 py-2 px-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300">Slot locked:</span>
                <span className="font-mono font-bold text-cyan-300">{selectedTimeSlot}</span>
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-4">
              {stepsData[2].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 04: Collect Securely */}
          <div
            onClick={() => setActiveStep(3)}
            className={`group relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
              activeStep === 3
                ? 'bg-gradient-to-b from-slate-900/95 to-slate-900/70 border-emerald-500/60 ring-1 ring-emerald-500/30 shadow-2xl shadow-emerald-500/10'
                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                STEP 04
              </span>
              <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60">
                100% Encrypted
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
              Collect securely
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Head down to the hub. Present your QR code or 4-digit OTP. The staff scans it and hands over your package in under 20 seconds.
            </p>

            {/* Illustration 4: QR Verification & Green Checkmark Handover */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/90 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              <div className="flex items-center gap-6">
                {/* QR Code Container */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsQrScanned(!isQrScanned);
                  }}
                  className="relative p-3 rounded-2xl bg-white text-slate-950 shadow-xl border border-slate-200 transition-transform duration-300 group-hover:scale-105"
                  title="Click to simulate scan"
                >
                  {/* SVG QR Code */}
                  <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 100 100" fill="none">
                    {/* Top-left marker */}
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="#0F172A" />
                    <rect x="11" y="11" width="16" height="16" rx="2" fill="white" />
                    <rect x="15" y="15" width="8" height="8" rx="1" fill="#0F172A" />

                    {/* Top-right marker */}
                    <rect x="67" y="5" width="28" height="28" rx="4" fill="#0F172A" />
                    <rect x="73" y="11" width="16" height="16" rx="2" fill="white" />
                    <rect x="77" y="15" width="8" height="8" rx="1" fill="#0F172A" />

                    {/* Bottom-left marker */}
                    <rect x="5" y="67" width="28" height="28" rx="4" fill="#0F172A" />
                    <rect x="11" y="73" width="16" height="16" rx="2" fill="white" />
                    <rect x="15" y="77" width="8" height="8" rx="1" fill="#0F172A" />

                    {/* QR Code bits */}
                    <rect x="38" y="10" width="6" height="6" fill="#0F172A" />
                    <rect x="48" y="14" width="6" height="12" fill="#0F172A" />
                    <rect x="40" y="24" width="8" height="6" fill="#0F172A" />
                    <rect x="58" y="8" width="5" height="16" fill="#0F172A" />

                    <rect x="10" y="38" width="12" height="6" fill="#0F172A" />
                    <rect x="26" y="42" width="6" height="14" fill="#0F172A" />
                    <rect x="36" y="36" width="14" height="14" rx="2" fill="#2563EB" />
                    <rect x="54" y="38" width="8" height="6" fill="#0F172A" />
                    <rect x="66" y="40" width="14" height="6" fill="#0F172A" />
                    <rect x="84" y="38" width="6" height="18" fill="#0F172A" />

                    <rect x="42" y="56" width="12" height="6" fill="#0F172A" />
                    <rect x="58" y="52" width="6" height="14" fill="#0F172A" />
                    <rect x="70" y="54" width="8" height="12" fill="#0F172A" />

                    <rect x="38" y="68" width="8" height="6" fill="#0F172A" />
                    <rect x="50" y="72" width="10" height="8" fill="#0F172A" />
                    <rect x="64" y="70" width="8" height="14" fill="#0F172A" />
                    <rect x="76" y="72" width="14" height="6" fill="#0F172A" />
                    <rect x="42" y="82" width="16" height="8" fill="#0F172A" />
                    <rect x="68" y="88" width="12" height="6" fill="#0F172A" />
                  </svg>

                  {/* Scan bar on QR code */}
                  <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 animate-bounce shadow-md" />
                </div>

                {/* Handover Verified Card */}
                <div className="flex flex-col gap-2.5">
                  {/* OTP Badge */}
                  <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-center">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">One-Time OTP</div>
                    <div className="text-xl sm:text-2xl font-mono font-extrabold text-white tracking-widest text-emerald-400">
                      7 4 9 2
                    </div>
                  </div>

                  {/* Verified Handover Badge */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-lg shadow-emerald-500/10">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="leading-tight">Verified Handover</div>
                      <div className="text-[10px] font-normal text-emerald-400/80">Logged to Hub Audit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-4">
              {stepsData[3].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Flow Guarantee Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900/40 border border-blue-500/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">Zero lost packages. Complete chain of custody.</h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Every movement is digitally time-stamped. No more packages left unattended on doorsteps or lost at security gates.
              </p>
            </div>
          </div>

          <a
            href="#app-preview"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25"
          >
            See Live App Experience
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
