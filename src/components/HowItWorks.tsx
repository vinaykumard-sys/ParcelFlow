import React, { useState } from 'react';

interface Step {
  number: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

const stepsData: Step[] = [
  {
    number: '01',
    badge: 'Hub Reception',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-900',
    title: 'Parcel Arrives at Hub',
    subtitle: 'Couriers drop off safely at the central society hub',
    description: 'No wandering delivery riders in apartment corridors. Delivery partners dock directly at the dedicated ParcelFlow Hub where packages are scanned, tagged, and placed on safe shelves.',
    highlights: ['Barcode / RFID intake', 'Gate congestion reduced by 85%', 'Inspected & logged in 10 seconds']
  },
  {
    number: '02',
    badge: 'Smart Notification',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-900',
    title: 'You Get Notified',
    subtitle: 'Instant push notification & SMS alert with photo',
    description: 'The second your box is logged, you receive a cheerful notification on your phone with item details, shelf location, and photo proof. Zero missed doorbell calls.',
    highlights: ['Instant push & WhatsApp alert', 'Shelf & locker location tags', 'Zero interrupted work meetings']
  },
  {
    number: '03',
    badge: 'Flexible Timing',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-900',
    title: 'Choose Your Time',
    subtitle: 'Pick when you want to collect — on your schedule',
    description: 'Stuck in evening traffic or heading out to the gym? Tap your app and select the 30-minute pickup window that fits seamlessly into your evening routine.',
    highlights: ['30-min guaranteed windows', 'One-tap rescheduling', 'Gentle reminders before closing']
  },
  {
    number: '04',
    badge: 'Verified Handover',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-900',
    title: 'Collect Securely',
    subtitle: 'Dynamic QR code and 4-digit OTP handover',
    description: 'Walk down to the hub on your way home, flash your dynamic in-app QR code or share your 4-digit OTP. Friendly hub staff verifies and hands your parcel in under 15 seconds.',
    highlights: ['Tamper-evident verification', 'Under 15-sec pickup time', 'Full digital chain of custody']
  }
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('8:00 PM – 8:30 PM');
  const [isQrScanned, setIsQrScanned] = useState<boolean>(false);
  const [notificationDismissed, setNotificationDismissed] = useState<boolean>(false);

  const timeSlots = [
    { id: '5pm', label: '5:00 PM – 5:30 PM', sub: 'Early evening' },
    { id: '630pm', label: '6:30 PM – 7:00 PM', sub: 'Return slot' },
    { id: '8pm', label: '8:00 PM – 8:30 PM', sub: 'Recommended' },
    { id: '915pm', label: '9:15 PM – 9:45 PM', sub: 'Night walk' },
  ];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-[#FEF9F3] text-[#0A1128] overflow-hidden">
      {/* Decorative Cartoon Doodles & Background Accents */}
      <div className="absolute top-12 left-10 w-24 h-24 rounded-full bg-blue-100/60 border-2 border-dashed border-blue-300 pointer-events-none -rotate-12" />
      <div className="absolute bottom-16 right-8 w-32 h-32 rounded-3xl bg-amber-100/70 border-2 border-dashed border-amber-300 pointer-events-none rotate-6" />
      <div className="absolute top-1/2 right-4 w-16 h-16 rounded-full bg-emerald-100/60 border-2 border-dashed border-emerald-300 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#0A1128] text-xs font-extrabold uppercase tracking-wider mb-4 shadow-cartoon-sm rotate-[-1deg]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse" />
            Simple 4-Step Process ⚡
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1128]">
            How <span className="relative inline-block text-[#2563EB]">
              ParcelFlow
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#FBBF24]" viewBox="0 0 100 12" preserveAspectRatio="none" fill="currentColor">
                <path d="M0,8 Q50,0 100,8 L100,12 Q50,4 0,12 Z" />
              </svg>
            </span> Works
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            From the minute the courier van pulls up at your society gate to the moment you walk back to your door with your parcel.
          </p>
        </div>

        {/* Playful Interactive Stepper Tabs */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-12">
          {stepsData.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 ${
                  isActive
                    ? 'bg-white border-[#0A1128] shadow-cartoon-lg -translate-y-1'
                    : 'bg-[#F4EFE6] border-[#0A1128]/40 hover:border-[#0A1128] hover:bg-white/80'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0 border-2 border-[#0A1128] ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-cartoon-sm'
                      : 'bg-white text-[#0A1128]'
                  }`}
                >
                  {step.number}
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    Step {step.number}
                  </div>
                  <div className={`font-black text-sm line-clamp-1 ${isActive ? 'text-[#0A1128]' : 'text-slate-700'}`}>
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 4 Large Cartoon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8">
          
          {/* ========================================================= */}
          {/* CARD 01: Parcel Arrives at Hub                            */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveStep(0)}
            className={`group relative rounded-3xl p-6 sm:p-8 border-[2.5px] border-[#0A1128] transition-all duration-300 bg-white cursor-pointer ${
              activeStep === 0
                ? 'shadow-cartoon-xl -translate-y-1 ring-4 ring-blue-200/60'
                : 'shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border-2 border-[#0A1128] shadow-cartoon-sm -rotate-2">
                📦 STEP 01
              </span>
              <span className="text-xs font-extrabold text-[#0A1128] px-3 py-1 rounded-xl bg-[#F4EFE6] border-2 border-[#0A1128]">
                Gate Hub Dock
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#0A1128] mb-2 group-hover:text-[#2563EB] transition-colors">
              Parcel arrives at hub
            </h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
              Delivery riders pull up to the central society hub. The friendly agent scans the barcode, stamps verification, and places it safely on the shelf.
            </p>

            {/* Cartoon Scene: Delivery Rider Handing Parcel to Guard/Agent */}
            <div className="relative w-full h-64 rounded-2xl bg-[#EBF5FF] border-2 border-[#0A1128] overflow-hidden flex flex-col items-center justify-center p-3 select-none">
              {/* Background hub shelf wall */}
              <div className="absolute inset-x-4 top-3 bottom-12 flex justify-between opacity-30 pointer-events-none">
                <div className="w-16 border-2 border-[#0A1128] rounded-lg bg-amber-100 flex flex-col justify-around p-1">
                  <div className="h-4 bg-amber-400 rounded border border-[#0A1128]" />
                  <div className="h-5 bg-blue-400 rounded border border-[#0A1128]" />
                  <div className="h-4 bg-emerald-400 rounded border border-[#0A1128]" />
                </div>
                <div className="w-16 border-2 border-[#0A1128] rounded-lg bg-amber-100 flex flex-col justify-around p-1">
                  <div className="h-5 bg-purple-400 rounded border border-[#0A1128]" />
                  <div className="h-4 bg-red-400 rounded border border-[#0A1128]" />
                  <div className="h-4 bg-cyan-400 rounded border border-[#0A1128]" />
                </div>
              </div>

              {/* Hub Counter Desk */}
              <div className="absolute inset-x-8 bottom-0 h-16 bg-[#FBBF24] border-t-2 border-[#0A1128] flex items-center justify-center">
                <div className="px-4 py-0.5 rounded-full bg-white border-2 border-[#0A1128] text-[10px] font-black uppercase tracking-wider text-[#0A1128] shadow-cartoon-sm">
                  🏢 Society Parcel Hub Bay A-1
                </div>
              </div>

              {/* Cartoon Characters SVG */}
              <svg className="relative z-10 w-full max-w-[340px] h-48" viewBox="0 0 340 190" fill="none">
                {/* Rider (Left side) */}
                <g className="transition-transform duration-300 group-hover:translate-x-1">
                  {/* Rider Helmet */}
                  <ellipse cx="75" cy="50" rx="22" ry="20" fill="#2563EB" stroke="#0A1128" strokeWidth="2.5" />
                  <path d="M60 48 Q75 40 93 48" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="90" cy="50" r="3" fill="#0A1128" />
                  {/* Face */}
                  <ellipse cx="82" cy="55" rx="10" ry="9" fill="#FFDFC4" stroke="#0A1128" strokeWidth="2" />
                  <circle cx="85" cy="54" r="1.5" fill="#0A1128" />
                  {/* Smile */}
                  <path d="M83 58 Q86 61 89 58" stroke="#0A1128" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  {/* Rider Torso / Blue Uniform */}
                  <path d="M55 80 Q75 75 95 80 L98 128 L52 128 Z" fill="#3B82F6" stroke="#0A1128" strokeWidth="2.5" />
                  {/* ParcelFlow badge on shirt */}
                  <rect x="68" y="85" width="14" height="6" rx="2" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />
                  {/* Arm extending forward holding package */}
                  <path d="M90 92 Q115 95 130 102" stroke="#FFDFC4" strokeWidth="9" strokeLinecap="round" />
                  <path d="M90 92 Q115 95 130 102" stroke="#0A1128" strokeWidth="2.5" fill="none" />
                </g>

                {/* Handover Box (Center) */}
                <g className="transition-transform duration-300 group-hover:scale-105" transform="translate(132, 85)">
                  {/* Isometric / Cartoon Parcel Box */}
                  <rect x="0" y="0" width="46" height="38" rx="5" fill="#D97706" stroke="#0A1128" strokeWidth="2.5" />
                  {/* Tape */}
                  <rect x="18" y="0" width="10" height="38" fill="#FDE68A" stroke="#0A1128" strokeWidth="1.5" />
                  {/* White Fragile/Barcode Sticker */}
                  <rect x="4" y="8" width="12" height="10" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                  <line x1="6" y1="11" x2="14" y2="11" stroke="#0A1128" strokeWidth="1.5" />
                  <line x1="6" y1="14" x2="12" y2="14" stroke="#0A1128" strokeWidth="1.5" />
                  {/* Scan Beam Beep */}
                  <line x1="3" y1="-4" x2="43" y2="-4" stroke="#10B981" strokeWidth="3" strokeDasharray="3 3" />
                </g>

                {/* Friendly Hub Agent / Guard (Right side) */}
                <g className="transition-transform duration-300 group-hover:-translate-x-1">
                  {/* Guard Cap */}
                  <path d="M245 42 L285 42 L280 32 L250 32 Z" fill="#0A1128" stroke="#0A1128" strokeWidth="2.5" />
                  <rect x="240" y="40" width="50" height="5" rx="2" fill="#0A1128" />
                  <circle cx="265" cy="37" r="3" fill="#FBBF24" />
                  {/* Friendly Face */}
                  <ellipse cx="265" cy="56" rx="15" ry="14" fill="#FFDFC4" stroke="#0A1128" strokeWidth="2.5" />
                  {/* Friendly Eyes */}
                  <ellipse cx="258" cy="54" rx="2" ry="3" fill="#0A1128" />
                  <ellipse cx="270" cy="54" rx="2" ry="3" fill="#0A1128" />
                  {/* Glasses */}
                  <circle cx="258" cy="54" r="6" stroke="#0A1128" strokeWidth="1.5" fill="none" />
                  <circle cx="270" cy="54" r="6" stroke="#0A1128" strokeWidth="1.5" fill="none" />
                  <line x1="264" y1="54" x2="265" y2="54" stroke="#0A1128" strokeWidth="1.5" />
                  {/* Big Warm Smile */}
                  <path d="M260 62 Q265 67 270 62" stroke="#0A1128" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Hub Uniform (Pastel green/mint) */}
                  <path d="M240 82 Q265 78 290 82 L294 130 L236 130 Z" fill="#10B981" stroke="#0A1128" strokeWidth="2.5" />
                  {/* Agent ID badge */}
                  <rect x="272" y="88" width="10" height="12" rx="1.5" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                  {/* Receiving hands & Scanner Gun */}
                  <path d="M245 92 Q225 96 200 98" stroke="#FFDFC4" strokeWidth="8" strokeLinecap="round" />
                  <path d="M245 92 Q225 96 200 98" stroke="#0A1128" strokeWidth="2.5" fill="none" />
                  {/* Barcode Scanner in hand */}
                  <rect x="188" y="93" width="14" height="8" rx="2" fill="#0A1128" />
                  <line x1="188" y1="97" x2="175" y2="97" stroke="#EF4444" strokeWidth="2" strokeDasharray="2 2" />
                </g>

                {/* Little Floating Success Sparkles */}
                <path d="M155 60 L158 66 L164 68 L158 70 L155 76 L152 70 L146 68 L152 66 Z" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />
                <path d="M120 50 L122 54 L126 55 L122 56 L120 60 L118 56 L114 55 L118 54 Z" fill="#10B981" stroke="#0A1128" strokeWidth="1.5" />
              </svg>

              {/* Sticker Tag */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-400 text-[#0A1128] border-2 border-[#0A1128] font-black text-[10px] shadow-cartoon-sm rotate-3">
                ✓ Barcode Scanned!
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-6 space-y-2.5 border-t-2 border-[#0A1128]/10 pt-4">
              {stepsData[0].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-[#0A1128] flex items-center justify-center text-emerald-800 shrink-0 font-black">
                    ✓
                  </div>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 02: You Get Notified                                */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveStep(1)}
            className={`group relative rounded-3xl p-6 sm:p-8 border-[2.5px] border-[#0A1128] transition-all duration-300 bg-white cursor-pointer ${
              activeStep === 1
                ? 'shadow-cartoon-xl -translate-y-1 ring-4 ring-amber-200/60'
                : 'shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border-2 border-[#0A1128] shadow-cartoon-sm rotate-2">
                🔔 STEP 02
              </span>
              <span className="text-xs font-extrabold text-[#0A1128] px-3 py-1 rounded-xl bg-[#F4EFE6] border-2 border-[#0A1128]">
                Instant Push & SMS
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#0A1128] mb-2 group-hover:text-amber-700 transition-colors">
              You get notified
            </h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
              Skip courier calls when you’re in meetings. ParcelFlow sends a crisp notification the instant your package is safe on the hub shelf.
            </p>

            {/* Cartoon Scene: Phone popping with "📦 Parcel received" */}
            <div className="relative w-full h-64 rounded-2xl bg-[#FEF9C3] border-2 border-[#0A1128] overflow-hidden flex flex-col items-center justify-center p-3 select-none">
              {/* Radial speed lines */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-56 h-56 rounded-full border-4 border-dashed border-amber-400 animate-spin" style={{ animationDuration: '30s' }} />
              </div>

              {/* Floating notification badge card */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationDismissed(!notificationDismissed);
                }}
                className={`relative z-20 w-full max-w-[310px] p-3.5 rounded-2xl bg-white border-2 border-[#0A1128] shadow-cartoon transition-all duration-300 group-hover:-translate-y-1 ${
                  notificationDismissed ? 'opacity-70 scale-95' : 'scale-100'
                }`}
                title="Click to interact"
              >
                <div className="flex items-start gap-3">
                  {/* App Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] border-2 border-[#0A1128] flex items-center justify-center text-white text-lg font-black shrink-0 shadow-cartoon-sm">
                    📦
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0A1128] flex items-center gap-1.5">
                        ParcelFlow
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-bold">Just now</span>
                    </div>
                    <div className="text-xs font-black text-[#2563EB] mt-0.5">
                      📦 Amazon delivery arrived!
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 truncate mt-0.5">
                      Shelf B-08 • Society Hub Gate 2
                    </div>
                  </div>
                </div>

                {/* Action button inside notification */}
                <div className="mt-2.5 pt-2 border-t-2 border-[#0A1128]/10 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500">Tap to schedule pickup</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#FBBF24] text-[#0A1128] border-2 border-[#0A1128] text-[10px] font-black shadow-cartoon-sm">
                    Choose Time →
                  </span>
                </div>
              </div>

              {/* Cartoon Phone Graphic below notification */}
              <div className="relative mt-2 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white border-2 border-[#0A1128] text-[11px] font-black text-slate-700 shadow-cartoon-sm flex items-center gap-1.5">
                  <span className="text-sm">💬</span> WhatsApp alert mirrored
                </span>
                <span className="px-3 py-1 rounded-full bg-white border-2 border-[#0A1128] text-[11px] font-black text-slate-700 shadow-cartoon-sm flex items-center gap-1.5">
                  <span className="text-sm">📳</span> Zero spam calls
                </span>
              </div>

              {/* Floating stickers */}
              <div className="absolute top-2 left-3 px-2 py-0.5 rounded-full bg-white border-2 border-[#0A1128] text-[10px] font-black text-[#0A1128] shadow-cartoon-sm -rotate-6">
                ⚡ Real-time
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-6 space-y-2.5 border-t-2 border-[#0A1128]/10 pt-4">
              {stepsData[1].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-[#0A1128] flex items-center justify-center text-emerald-800 shrink-0 font-black">
                    ✓
                  </div>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 03: Choose Your Time                                 */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveStep(2)}
            className={`group relative rounded-3xl p-6 sm:p-8 border-[2.5px] border-[#0A1128] transition-all duration-300 bg-white cursor-pointer ${
              activeStep === 2
                ? 'shadow-cartoon-xl -translate-y-1 ring-4 ring-purple-200/60'
                : 'shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border-2 border-[#0A1128] shadow-cartoon-sm -rotate-2">
                🕐 STEP 03
              </span>
              <span className="text-xs font-extrabold text-[#0A1128] px-3 py-1 rounded-xl bg-[#F4EFE6] border-2 border-[#0A1128]">
                Your Schedule
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#0A1128] mb-2 group-hover:text-purple-700 transition-colors">
              Choose your time
            </h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
              No rushing home. Select a 30-minute pickup slot when you’re free. The hub pre-stages your package for zero-wait handover.
            </p>

            {/* Cartoon Phone Time-Selector Scene */}
            <div className="relative w-full h-64 rounded-2xl bg-[#EDE9FE] border-2 border-[#0A1128] overflow-hidden flex flex-col justify-center p-4 select-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-900">
                  Select pickup window:
                </span>
                <span className="text-[10px] font-extrabold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-[#0A1128]">
                  Tap to change 👇
                </span>
              </div>

              {/* 4 Interactive Time Slot Buttons */}
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
                      className={`relative p-2.5 rounded-xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#2563EB] text-white border-[#0A1128] shadow-cartoon -translate-y-0.5'
                          : 'bg-white text-[#0A1128] border-[#0A1128]/40 hover:border-[#0A1128] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{slot.label.split(' – ')[0]}</span>
                        {isSelected ? (
                          <span className="w-4 h-4 rounded-full bg-[#FBBF24] text-[#0A1128] border border-[#0A1128] flex items-center justify-center text-[10px] font-black">
                            ✓
                          </span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full border border-[#0A1128]/40" />
                        )}
                      </div>
                      <div className={`text-[10px] font-semibold mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {slot.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Slot Confirmation Banner */}
              <div className="mt-3 py-2 px-3.5 rounded-xl bg-white border-2 border-[#0A1128] shadow-cartoon-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎯</span>
                  <span className="text-xs font-black text-[#0A1128]">Slot locked:</span>
                </div>
                <span className="font-mono font-black text-xs text-[#2563EB] px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                  {selectedTimeSlot}
                </span>
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-6 space-y-2.5 border-t-2 border-[#0A1128]/10 pt-4">
              {stepsData[2].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-[#0A1128] flex items-center justify-center text-emerald-800 shrink-0 font-black">
                    ✓
                  </div>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 04: Collect Securely                                 */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveStep(3)}
            className={`group relative rounded-3xl p-6 sm:p-8 border-[2.5px] border-[#0A1128] transition-all duration-300 bg-white cursor-pointer ${
              activeStep === 3
                ? 'shadow-cartoon-xl -translate-y-1 ring-4 ring-emerald-200/60'
                : 'shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border-2 border-[#0A1128] shadow-cartoon-sm rotate-2">
                🔐 STEP 04
              </span>
              <span className="text-xs font-extrabold text-[#0A1128] px-3 py-1 rounded-xl bg-[#F4EFE6] border-2 border-[#0A1128]">
                100% Verified
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#0A1128] mb-2 group-hover:text-emerald-700 transition-colors">
              Collect securely
            </h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
              Head to the hub on your way home. Flash your dynamic QR code or share your 4-digit OTP. Staff hands over your parcel in under 15 seconds.
            </p>

            {/* Cartoon Scene: Smiling resident scanning QR with green checkmark */}
            <div className="relative w-full h-64 rounded-2xl bg-[#DCFCE7] border-2 border-[#0A1128] overflow-hidden flex items-center justify-around p-4 select-none">
              
              {/* Interactive QR Code Box */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQrScanned(!isQrScanned);
                }}
                className="relative p-2.5 rounded-2xl bg-white border-2 border-[#0A1128] shadow-cartoon hover:scale-105 transition-all duration-200 flex flex-col items-center cursor-pointer"
                title="Click to simulate QR scan"
              >
                {/* Custom SVG QR Code with cartoon accents */}
                <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 100 100" fill="none">
                  {/* Top-left marker */}
                  <rect x="6" y="6" width="26" height="26" rx="4" fill="#0A1128" />
                  <rect x="12" y="12" width="14" height="14" rx="2" fill="white" />
                  <rect x="16" y="16" width="6" height="6" rx="1" fill="#0A1128" />

                  {/* Top-right marker */}
                  <rect x="68" y="6" width="26" height="26" rx="4" fill="#0A1128" />
                  <rect x="74" y="12" width="14" height="14" rx="2" fill="white" />
                  <rect x="78" y="16" width="6" height="6" rx="1" fill="#0A1128" />

                  {/* Bottom-left marker */}
                  <rect x="6" y="68" width="26" height="26" rx="4" fill="#0A1128" />
                  <rect x="12" y="74" width="14" height="14" rx="2" fill="white" />
                  <rect x="16" y="78" width="6" height="6" rx="1" fill="#0A1128" />

                  {/* QR Data Bits */}
                  <rect x="38" y="10" width="8" height="6" fill="#0A1128" />
                  <rect x="50" y="14" width="8" height="10" fill="#0A1128" />
                  <rect x="38" y="24" width="10" height="8" fill="#0A1128" />
                  <rect x="58" y="8" width="6" height="14" fill="#0A1128" />

                  <rect x="10" y="38" width="12" height="6" fill="#0A1128" />
                  <rect x="26" y="42" width="8" height="12" fill="#0A1128" />
                  <rect x="38" y="38" width="12" height="12" rx="3" fill="#2563EB" />
                  <rect x="54" y="38" width="8" height="6" fill="#0A1128" />
                  <rect x="66" y="40" width="14" height="6" fill="#0A1128" />

                  <rect x="42" y="56" width="12" height="6" fill="#0A1128" />
                  <rect x="58" y="52" width="6" height="14" fill="#0A1128" />
                  <rect x="70" y="54" width="8" height="12" fill="#0A1128" />

                  <rect x="38" y="68" width="8" height="6" fill="#0A1128" />
                  <rect x="50" y="72" width="10" height="8" fill="#0A1128" />
                  <rect x="66" y="70" width="8" height="12" fill="#0A1128" />
                  <rect x="42" y="82" width="16" height="8" fill="#0A1128" />
                </svg>

                {/* Laser scan line */}
                <div className="absolute inset-x-2 top-2 h-1 bg-[#10B981] rounded animate-bounce shadow-sm" />
                
                <span className="text-[10px] font-black text-slate-500 mt-1">Tap to scan</span>
              </div>

              {/* Handover & OTP Badges (Right side) */}
              <div className="flex flex-col gap-2.5">
                {/* OTP Box */}
                <div className="p-3 rounded-2xl bg-white border-2 border-[#0A1128] shadow-cartoon-sm text-center">
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Handover OTP
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-black text-[#2563EB] tracking-widest mt-0.5">
                    7 4 9 2
                  </div>
                </div>

                {/* Verified Green Checkmark Badge */}
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border-2 border-[#0A1128] shadow-cartoon-sm">
                  <div className="w-7 h-7 rounded-full bg-[#10B981] border-2 border-[#0A1128] text-white flex items-center justify-center font-black text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0A1128]">Verified!</div>
                    <div className="text-[10px] font-bold text-emerald-700">15-sec pickup</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights List */}
            <div className="mt-6 space-y-2.5 border-t-2 border-[#0A1128]/10 pt-4">
              {stepsData[3].highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-[#0A1128] flex items-center justify-center text-emerald-800 shrink-0 font-black">
                    ✓
                  </div>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-white border-[2.5px] border-[#0A1128] shadow-cartoon-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FBBF24] border-2 border-[#0A1128] flex items-center justify-center text-2xl shrink-0 shadow-cartoon-sm">
              🛡️
            </div>
            <div>
              <h4 className="text-lg font-black text-[#0A1128]">Zero lost packages. Complete chain of custody.</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Every movement is digitally time-stamped. No packages left unattended in corridors or lost at security gates.
              </p>
            </div>
          </div>

          <a
            href="#delivery-timeline"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-sm border-2 border-[#0A1128] shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-0.5 transition-all"
          >
            Watch Journey Timeline
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
