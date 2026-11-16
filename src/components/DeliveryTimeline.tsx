import React, { useState, useEffect } from 'react';

interface Stage {
  id: string;
  name: string;
  shortLabel: string;
  time: string;
  location: string;
  actor: string;
  badge: string;
  status: 'completed' | 'active' | 'upcoming';
  description: string;
  auditDetail: string;
  iconType: 'truck' | 'gate' | 'hub' | 'notification' | 'calendar' | 'handover';
}

const STAGES: Stage[] = [
  {
    id: 'courier',
    name: 'Courier Arrival',
    shortLabel: 'Courier',
    time: '5:14 PM',
    location: 'Society Perimeter Gate',
    actor: 'BlueDart Courier #BD-904',
    badge: 'Stage 01 • Inbound Transit',
    status: 'completed',
    description: 'The delivery vehicle arrives at the residential community boundary. Instead of searching for apartment towers and buzzing flats, the courier directs toward the unified delivery reception.',
    auditDetail: 'Vehicle entry verified at boom barrier with license plate log.',
    iconType: 'truck'
  },
  {
    id: 'gate',
    name: 'Society Gate Verification',
    shortLabel: 'Society Gate',
    time: '5:22 PM',
    location: 'Main Security Gatehouse',
    actor: 'Guard Suresh Kumar (ID: SEC-108)',
    badge: 'Stage 02 • Access Verification',
    status: 'completed',
    description: 'Security officers log the courier pass seamlessly via the ParcelFlow Gate terminal. The courier delivers all building parcels in one single coordinated drop rather than making 40 separate door visits.',
    auditDetail: 'Digital gate pass issued with zero traffic congestion at main entry.',
    iconType: 'gate'
  },
  {
    id: 'hub',
    name: 'Parcel Hub Intake & Sorting',
    shortLabel: 'Parcel Hub',
    time: '5:28 PM',
    location: 'Gate 2 ParcelFlow Hub Bay',
    actor: 'Hub Specialist Priya (Station 2)',
    badge: 'Stage 03 • Secure Storage',
    status: 'active',
    description: 'Packages are scanned with high-speed barcode readers, weighed, and categorized into designated secure shelves or climate-controlled bins. A photographic intake log is created automatically.',
    auditDetail: 'Assigned to Shelf B-14. Tamper sensor & HD CCTV recorded.',
    iconType: 'hub'
  },
  {
    id: 'notification',
    name: 'Resident Notification Dispatched',
    shortLabel: 'Notification',
    time: '5:29 PM',
    location: 'ParcelFlow Cloud Dispatch',
    actor: 'System Automated Message Engine',
    badge: 'Stage 04 • Real-Time Alert',
    status: 'upcoming',
    description: 'A priority push notification and WhatsApp/SMS alert arrives on the resident’s smartphone with photo verification, courier name, and parcel dimensions. No spam calls or interruptions.',
    auditDetail: 'Delivery receipt delivered in 1.4s with 99.98% delivery rate.',
    iconType: 'notification'
  },
  {
    id: 'scheduled',
    name: 'Resident Schedules Pickup',
    shortLabel: 'Scheduled',
    time: '6:45 PM',
    location: 'Resident Mobile Application',
    actor: 'Alex Sharma (Apartment B-402)',
    badge: 'Stage 05 • Slot Reserved',
    status: 'upcoming',
    description: 'Resident reviews the notification and picks 8:00 PM – 8:30 PM for collection after returning from work. The hub dashboard queues the package for priority rapid handover.',
    auditDetail: 'Encrypted token and dynamic QR payload generated on device.',
    iconType: 'calendar'
  },
  {
    id: 'handover',
    name: 'Secure Handover & Verified OTP',
    shortLabel: 'Handover',
    time: '8:07 PM',
    location: 'Gate 2 Hub Collection Counter',
    actor: 'Resident & Hub Agent Verified',
    badge: 'Stage 06 • Final Handover',
    status: 'upcoming',
    description: 'Resident shows the dynamic QR code or provides OTP 7492. In under 20 seconds, the package is handed over, signature captured, and both resident and carrier receive closed proof of receipt.',
    auditDetail: 'Chain of custody closed. Zero lost parcels guaranteed.',
    iconType: 'handover'
  }
];

export const DeliveryTimeline: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play scrubber effect when play button is toggled
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STAGES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeStage = STAGES[activeIndex];
  const progressPercent = (activeIndex / (STAGES.length - 1)) * 100;

  // Icon renderer
  const renderIcon = (type: Stage['iconType'], isActive: boolean) => {
    const strokeColor = isActive ? 'currentColor' : '#94A3B8';
    switch (type) {
      case 'truck':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      case 'gate':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6M9 18h6" />
          </svg>
        );
      case 'hub':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'notification':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'handover':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={strokeColor}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <section id="delivery-timeline" className="relative py-24 sm:py-32 bg-slate-900/90 text-slate-100 overflow-hidden border-y border-slate-800">
      {/* Decorative background aura */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Interactive Journey Visualizer
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            From Courier to Your Hands
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Click through the stages or press play to watch the parcel physically travel across the ParcelFlow chain of custody.
          </p>
        </div>

        {/* Playback Controls & Stage Counter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Pause Journey
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Auto-Play Journey
                </>
              )}
            </button>

            <button
              onClick={() => setActiveIndex(0)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
              title="Reset to Courier"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>Stage {activeIndex + 1} of {STAGES.length}:</span>
            <span className="font-bold text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-blue-400">
              {activeStage.shortLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1))}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
              aria-label="Previous stage"
            >
              ‹
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0))}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
              aria-label="Next stage"
            >
              ›
            </button>
          </div>
        </div>

        {/* Scrubber / Interactive Timeline Bar */}
        <div className="relative py-12 px-2 sm:px-6">
          {/* Background Track Line */}
          <div className="absolute top-1/2 left-6 right-6 h-1.5 -translate-y-1/2 bg-slate-800 rounded-full" />

          {/* Active Fill Track Line */}
          <div
            className="absolute top-1/2 left-6 h-1.5 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `calc(${progressPercent}% * 0.9 + 12px)` }}
          />

          {/* Traveling Parcel Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-500 ease-out pointer-events-none"
            style={{ left: `calc(1.5rem + ${progressPercent}% * 0.94)` }}
          >
            <div className="relative flex flex-col items-center">
              {/* Floating Package Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 ring-4 ring-slate-950 animate-bounce">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="w-2 h-2 rounded-full bg-amber-400 mt-1 shadow-sm shadow-amber-400" />
            </div>
          </div>

          {/* Stage Nodes Grid */}
          <div className="relative z-10 flex justify-between items-center">
            {STAGES.map((stage, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPlaying(false);
                  }}
                  className="group focus:outline-none flex flex-col items-center"
                >
                  {/* Node Circle */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ring-4 ring-slate-950 ${
                      isCurrent
                        ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/40 ring-blue-500/30'
                        : isPast
                        ? 'bg-emerald-600/80 text-white hover:bg-emerald-500'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {renderIcon(stage.iconType, isCurrent || isPast)}
                  </div>

                  {/* Node Title & Time Below */}
                  <div className="hidden md:flex flex-col items-center mt-3 text-center">
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        isCurrent ? 'text-blue-400 font-bold' : isPast ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {stage.shortLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {stage.time}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Display Card */}
        <div className="mt-8 rounded-3xl bg-slate-950/80 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Stage Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {activeStage.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  🕒 {activeStage.time}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ✓ Recorded & Verified
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeStage.name}
              </h3>

              <p className="text-slate-300 text-base leading-relaxed">
                {activeStage.description}
              </p>

              {/* Actor & Location Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Location Point</div>
                  <div className="text-xs font-semibold text-white mt-0.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {activeStage.location}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Verified Handler / Actor</div>
                  <div className="text-xs font-semibold text-white mt-0.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {activeStage.actor}
                  </div>
                </div>
              </div>

              {/* Security Audit Detail */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span><strong>Security Stamp:</strong> {activeStage.auditDetail}</span>
              </div>
            </div>

            {/* Right Column: Visual Stage Graphic Representation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm h-64 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Visual pulse glow */}
                <div className="absolute w-40 h-40 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

                {/* Stage-specific graphics */}
                {activeIndex === 0 && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-white">Courier Docking Inbound</div>
                    <div className="text-xs text-slate-400 font-mono">Consolidated single-point handoff</div>
                  </div>
                )}

                {activeIndex === 1 && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-white">Gate Pass Verified</div>
                    <div className="text-xs text-slate-400 font-mono">Zero non-resident entry into towers</div>
                  </div>
                )}

                {activeIndex === 2 && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-white">Hub Shelf Bay B-14</div>
                    <div className="text-xs text-slate-400 font-mono">Barcode & weight verified: 1.2 kg</div>
                  </div>
                )}

                {activeIndex === 3 && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-white">Smart Push Dispatched</div>
                    <div className="text-xs text-slate-400 font-mono">Pinged resident mobile device</div>
                  </div>
                )}

                {activeIndex === 4 && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-white">Pickup Window: 8:00 PM</div>
                    <div className="text-xs text-slate-400 font-mono">Handover queue prepared</div>
                  </div>
                )}

                {activeIndex === 5 && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-white">Handover Completed</div>
                    <div className="text-xs text-emerald-400 font-mono">OTP 7492 verified • 18s pickup</div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live Society Node Active
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
