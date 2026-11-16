import React, { useState, useEffect } from 'react';

interface Stage {
  id: string;
  name: string;
  shortLabel: string;
  time: string;
  location: string;
  actor: string;
  badge: string;
  description: string;
  auditDetail: string;
  emoji: string;
  xPercent: number; // percentage along the path for mobile/desktop
  svgCoord: { x: number; y: number };
}

const STAGES: Stage[] = [
  {
    id: 'courier',
    name: 'Courier Arrival at Gate',
    shortLabel: 'Courier',
    time: '5:14 PM',
    location: 'Society Perimeter Gate',
    actor: 'BlueDart Courier (Rider Amit)',
    badge: 'Stage 01 • Inbound Transit',
    description: 'The delivery rider arrives at the society perimeter gate. Instead of hunting through 10 tower blocks and buzzing doorbells, the courier docks all parcels at the unified ParcelFlow Hub.',
    auditDetail: 'Vehicle entry logged at boom barrier. Zero corridor clutter.',
    emoji: '🚚',
    xPercent: 0,
    svgCoord: { x: 100, y: 80 }
  },
  {
    id: 'hub',
    name: 'Parcel Hub Intake & Sorting',
    shortLabel: 'Parcel Hub',
    time: '5:22 PM',
    location: 'Gate 2 ParcelFlow Hub Bay',
    actor: 'Hub Specialist Suresh (Station 2)',
    badge: 'Stage 02 • Safe Intake',
    description: 'Hub staff scans barcodes with optical scanners, checks package integrity, and places the box into designated climate-safe shelves. A digital intake photo is automatically captured.',
    auditDetail: 'Tagged to Shelf B-08. Tamper-evident sensor logged.',
    emoji: '📦',
    xPercent: 25,
    svgCoord: { x: 300, y: 48 }
  },
  {
    id: 'scheduled',
    name: 'Resident Chooses Time',
    shortLabel: 'Choose Time',
    time: '5:24 PM',
    location: 'ParcelFlow Resident App',
    actor: 'Resident Alex (Flat B-402)',
    badge: 'Stage 03 • Flexible Slot',
    description: 'Resident receives a cheerful push & WhatsApp notification. They tap the app to lock in 8:00 PM – 8:30 PM for easy pickup on their walk back from the gym or office.',
    auditDetail: 'One-time dynamic OTP & cryptographic QR token generated.',
    emoji: '📱',
    xPercent: 50,
    svgCoord: { x: 500, y: 80 }
  },
  {
    id: 'handover',
    name: 'Verified Counter Handover',
    shortLabel: 'Verified Handover',
    time: '8:07 PM',
    location: 'Gate 2 Collection Counter',
    actor: 'Resident & Hub Agent Verified',
    badge: 'Stage 04 • QR & OTP Verification',
    description: 'Resident shows the dynamic QR code or states the 4-digit OTP. The hub staff verifies it in 10 seconds and hands over the parcel. Zero awkward gate exchanges.',
    auditDetail: 'Cryptographic match confirmed. Closed chain of custody.',
    emoji: '🔐',
    xPercent: 75,
    svgCoord: { x: 700, y: 112 }
  },
  {
    id: 'home',
    name: 'Resident Gets Parcel Safe & Sound',
    shortLabel: 'Resident Gets Parcel',
    time: '8:10 PM',
    location: 'Apartment B-402 Doorstep',
    actor: 'Happy Resident Unboxing',
    badge: 'Stage 05 • Delivery Completed',
    description: 'Resident walks home smiling with their intact parcel in hand. No missed packages, no neighbor doorstep drop-offs, and zero anxiety.',
    auditDetail: 'Digital delivery receipt & carbon footprint ledger closed.',
    emoji: '🏠',
    xPercent: 100,
    svgCoord: { x: 900, y: 80 }
  }
];

export const DeliveryTimeline: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STAGES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeStage = STAGES[activeIndex];
  const activeCoord = activeStage.svgCoord;

  return (
    <section id="delivery-timeline" className="relative py-20 sm:py-28 bg-[#FEF9F3] text-[#0A1128] overflow-hidden border-y-2 border-[#0A1128]/10">
      {/* Background Cartoon Doodles */}
      <div className="absolute top-1/2 left-8 w-20 h-20 rounded-full bg-amber-100/60 border-2 border-dashed border-amber-300 pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-12 w-28 h-28 rounded-3xl bg-blue-100/60 border-2 border-dashed border-blue-300 pointer-events-none rotate-12" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#0A1128] text-xs font-black uppercase tracking-wider mb-4 shadow-cartoon-sm rotate-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            Interactive Journey Route 🗺️
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1128]">
            From Courier to Your Hands
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            Watch the cartoon package physically travel along the curved route as you click through stages or hit auto-play!
          </p>
        </div>

        {/* Playback Controls & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl border-2 border-[#0A1128] shadow-cartoon">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-2xl text-xs font-black border-2 border-[#0A1128] flex items-center gap-2 transition-all ${
                isPlaying
                  ? 'bg-[#FBBF24] text-[#0A1128] shadow-cartoon-sm'
                  : 'bg-[#2563EB] text-white shadow-cartoon-sm hover:bg-[#1D4ED8]'
              }`}
            >
              {isPlaying ? (
                <>
                  <span>⏸</span> Pause Route
                </>
              ) : (
                <>
                  <span>▶</span> Auto-Play Journey
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveIndex(0);
                setIsPlaying(false);
              }}
              className="px-3 py-2 rounded-2xl text-xs font-black bg-[#F4EFE6] hover:bg-white text-[#0A1128] border-2 border-[#0A1128] transition-colors shadow-cartoon-sm"
              title="Reset to Courier"
            >
              ↺ Reset
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500 font-bold">Stage {activeIndex + 1} of {STAGES.length}:</span>
            <span className="font-black text-[#0A1128] px-3 py-1 rounded-xl bg-amber-100 border-2 border-[#0A1128] shadow-cartoon-sm">
              {activeStage.emoji} {activeStage.shortLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1));
                setIsPlaying(false);
              }}
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#0A1128] flex items-center justify-center font-black text-sm text-[#0A1128] shadow-cartoon-sm transition-all"
              aria-label="Previous stage"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0));
                setIsPlaying(false);
              }}
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#0A1128] flex items-center justify-center font-black text-sm text-[#0A1128] shadow-cartoon-sm transition-all"
              aria-label="Next stage"
            >
              ›
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CURVED ANIMATED SVG ROUTE CANVAS                          */}
        {/* ========================================================= */}
        <div className="relative bg-[#FEF9F3] rounded-3xl border-2 border-[#0A1128] p-6 sm:p-10 shadow-cartoon-lg mb-8 overflow-hidden select-none">
          
          {/* Subtle background route grid/dots */}
          <div className="absolute inset-0 bg-[radial-gradient(#0A1128_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Desktop Curved Route SVG View */}
          <div className="relative w-full h-44 sm:h-52 hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 1000 160" fill="none">
              {/* Shadow Track Line */}
              <path
                d="M 100 84 C 250 24, 350 144, 500 84 C 650 24, 750 144, 900 84"
                stroke="#0A1128"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />

              {/* Road Track Line (Asphalt/Cream with thick dashed center) */}
              <path
                d="M 100 80 C 250 20, 350 140, 500 80 C 650 20, 750 140, 900 80"
                stroke="#FDE68A"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Animated dashed centerline */}
              <path
                d="M 100 80 C 250 20, 350 140, 500 80 C 650 20, 750 140, 900 80"
                stroke="#0A1128"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Traveled Green Completed Segment */}
              <path
                d="M 100 80 C 250 20, 350 140, 500 80 C 650 20, 750 140, 900 80"
                stroke="#10B981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (activeIndex / (STAGES.length - 1)) * 1000}
                style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }}
                fill="none"
              />

              {/* 5 Stage Anchor Nodes on the SVG */}
              {STAGES.map((st, i) => {
                const isSelected = i === activeIndex;
                const isDone = i < activeIndex;
                return (
                  <g
                    key={st.id}
                    onClick={() => {
                      setActiveIndex(i);
                      setIsPlaying(false);
                    }}
                    className="cursor-pointer group"
                    transform={`translate(${st.svgCoord.x}, ${st.svgCoord.y})`}
                  >
                    {/* Outer Circle Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 26 : 22}
                      fill={isSelected ? '#2563EB' : isDone ? '#10B981' : '#FFFFFF'}
                      stroke="#0A1128"
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                    />

                    {/* Emoji / Icon inside circle */}
                    <text
                      x="0"
                      y="6"
                      textAnchor="middle"
                      fontSize={isSelected ? '20' : '16'}
                      className="pointer-events-none select-none"
                    >
                      {st.emoji}
                    </text>

                    {/* Number Badge Pill */}
                    <rect
                      x="-12"
                      y="-36"
                      width="24"
                      height="16"
                      rx="8"
                      fill="#0A1128"
                    />
                    <text
                      x="0"
                      y="-24"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#FFFFFF"
                      fontFamily="monospace"
                    >
                      0{i + 1}
                    </text>
                  </g>
                );
              })}

              {/* PHYSICALLY TRAVELING CARTOON PACKAGE BOX */}
              <g
                style={{
                  transform: `translate(${activeCoord.x}px, ${activeCoord.y}px)`,
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className="pointer-events-none"
              >
                {/* Floating Little Package Mascot */}
                <g transform="translate(-24, -62)">
                  {/* Floating Wings or Bounce aura */}
                  <ellipse cx="24" cy="46" rx="14" ry="4" fill="#0A1128" opacity="0.3" />
                  
                  {/* Package Box Body */}
                  <rect x="6" y="10" width="36" height="30" rx="5" fill="#F59E0B" stroke="#0A1128" strokeWidth="2.5" />
                  {/* Tape */}
                  <rect x="20" y="10" width="8" height="30" fill="#FDE68A" stroke="#0A1128" strokeWidth="1.5" />
                  {/* Cute Googly Eyes on the Box */}
                  <circle cx="16" cy="22" r="3.5" fill="white" stroke="#0A1128" strokeWidth="1.5" />
                  <circle cx="17.5" cy="22" r="1.5" fill="#0A1128" />
                  <circle cx="32" cy="22" r="3.5" fill="white" stroke="#0A1128" strokeWidth="1.5" />
                  <circle cx="33.5" cy="22" r="1.5" fill="#0A1128" />
                  {/* Happy Smile */}
                  <path d="M22 28 Q24 31 26 28" stroke="#0A1128" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  
                  {/* Speech Bubble "Moving!" */}
                  <g transform="translate(38, -4)">
                    <rect x="0" y="0" width="46" height="18" rx="6" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                    <text x="23" y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0A1128">
                      Moving!
                    </text>
                  </g>
                </g>
              </g>
            </svg>
          </div>

          {/* Stage Labels Row beneath Route */}
          <div className="hidden md:grid grid-cols-5 gap-2 mt-4 text-center">
            {STAGES.map((st, i) => {
              const isSelected = i === activeIndex;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setActiveIndex(i);
                    setIsPlaying(false);
                  }}
                  className={`p-2 rounded-xl text-xs font-black transition-all ${
                    isSelected
                      ? 'bg-white border-2 border-[#0A1128] shadow-cartoon-sm text-[#2563EB] -translate-y-1'
                      : 'text-slate-600 hover:text-[#0A1128]'
                  }`}
                >
                  <div>{st.shortLabel}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{st.time}</div>
                </button>
              );
            })}
          </div>

          {/* Mobile Linear Route Stepper Fallback */}
          <div className="md:hidden flex flex-col gap-3">
            <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
              {STAGES.map((st, i) => {
                const isSelected = i === activeIndex;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setActiveIndex(i);
                      setIsPlaying(false);
                    }}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#2563EB] text-white border-[#0A1128] shadow-cartoon-sm'
                        : 'bg-white text-slate-700 border-[#0A1128]/30'
                    }`}
                  >
                    <span>{st.emoji}</span>
                    <span>{st.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ACTIVE STAGE DETAILED CARTOON DISPLAY CARD                */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-white border-[2.5px] border-[#0A1128] p-6 sm:p-10 shadow-cartoon-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Stage Info & Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border-2 border-[#0A1128] shadow-cartoon-sm">
                  {activeStage.badge}
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#F4EFE6] text-[#0A1128] border-2 border-[#0A1128]">
                  🕒 {activeStage.time}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border-2 border-[#0A1128]">
                  ✓ Recorded in Ledger
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {activeStage.name}
              </h3>

              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {activeStage.description}
              </p>

              {/* Actor & Location Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border-2 border-[#0A1128]">
                  <div className="text-[10px] font-black uppercase text-slate-500">Location Point</div>
                  <div className="text-xs font-black text-[#0A1128] mt-0.5 flex items-center gap-1.5">
                    <span>📍</span> {activeStage.location}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FAFC] border-2 border-[#0A1128]">
                  <div className="text-[10px] font-black uppercase text-slate-500">Verified Actor / Handler</div>
                  <div className="text-xs font-black text-[#0A1128] mt-0.5 flex items-center gap-1.5">
                    <span>👤</span> {activeStage.actor}
                  </div>
                </div>
              </div>

              {/* Security Audit Detail */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-[#0A1128] text-xs text-amber-900 font-bold flex items-start gap-2.5">
                <span className="text-base shrink-0">🛡️</span>
                <span><strong>Security Stamp:</strong> {activeStage.auditDetail}</span>
              </div>
            </div>

            {/* Right Column: Cartoon Stage Visual Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm h-64 rounded-3xl bg-[#FEF9F3] border-2 border-[#0A1128] p-6 flex flex-col items-center justify-center text-center overflow-hidden shadow-cartoon">
                
                {/* Stage 0: Courier Van */}
                {activeIndex === 0 && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 rounded-2xl bg-blue-100 border-2 border-[#0A1128] flex items-center justify-center text-4xl mx-auto shadow-cartoon-sm">
                      🚚
                    </div>
                    <div className="text-base font-black text-[#0A1128]">Courier at Society Gate</div>
                    <div className="text-xs text-slate-500 font-bold">Consolidated drop-off at entrance hub</div>
                  </div>
                )}

                {/* Stage 1: Hub Intake */}
                {activeIndex === 1 && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 rounded-2xl bg-amber-100 border-2 border-[#0A1128] flex items-center justify-center text-4xl mx-auto shadow-cartoon-sm">
                      📦
                    </div>
                    <div className="text-base font-black text-[#0A1128]">Hub Shelf Bay B-08</div>
                    <div className="text-xs text-slate-500 font-bold">Optically scanned, tagged & safely stored</div>
                  </div>
                )}

                {/* Stage 2: Scheduling Time */}
                {activeIndex === 2 && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 rounded-2xl bg-purple-100 border-2 border-[#0A1128] flex items-center justify-center text-4xl mx-auto shadow-cartoon-sm">
                      📱
                    </div>
                    <div className="text-base font-black text-[#0A1128]">Slot Selected: 8:00 PM</div>
                    <div className="text-xs text-slate-500 font-bold">Resident scheduled handover on phone</div>
                  </div>
                )}

                {/* Stage 3: Verified Handover */}
                {activeIndex === 3 && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-[#0A1128] flex items-center justify-center text-4xl mx-auto shadow-cartoon-sm">
                      🔐
                    </div>
                    <div className="text-base font-black text-[#0A1128]">OTP 7492 Confirmed</div>
                    <div className="text-xs text-slate-500 font-bold">10-second zero-wait handover verified</div>
                  </div>
                )}

                {/* Stage 4: Home Delivery */}
                {activeIndex === 4 && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 rounded-2xl bg-yellow-100 border-2 border-[#0A1128] flex items-center justify-center text-4xl mx-auto shadow-cartoon-sm">
                      🏠
                    </div>
                    <div className="text-base font-black text-[#0A1128]">Safely in Your Hands!</div>
                    <div className="text-xs text-slate-500 font-bold">Zero anxiety. Happy unboxing at home.</div>
                  </div>
                )}

                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#0A1128] text-[11px] font-black text-slate-700 shadow-cartoon-sm">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  Live Society Stage Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryTimeline;
