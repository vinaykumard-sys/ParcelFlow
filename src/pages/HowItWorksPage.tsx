import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  Key, 
  Sparkles,
  Users,
  Layers,
  ArrowRight,
  Package,
  QrCode
} from 'lucide-react';
import { DownloadCTA } from '../components/DownloadCTA';
import { Sticker } from '../components/Sticker';

interface HowItWorksPageProps {
  onOpenPilotModal?: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onOpenPilotModal }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Courier Arrival & Fast Gate Check-In',
      role: 'Courier & Gate Hub',
      color: 'blue' as const,
      badge: '30-Sec Intake',
      summary: 'Delivery couriers hand off packages at the society Parcel Hub in under 30 seconds. No waiting for elevators, no calling confused residents in meetings.',
      details: [
        'Courier arrives at the dedicated society ParcelFlow gate terminal.',
        'Barcode or label is instantly scanned using our fast optical scanner.',
        'Recipient tower and flat number are automatically linked to the society resident directory.',
        'Courier gets instant digital sign-off and proceeds to their next stop.'
      ],
      diagram: (
        <svg viewBox="0 0 320 180" className="w-full h-auto max-h-48">
          <rect width="320" height="180" rx="16" fill="#EFF6FF" stroke="#0A1128" strokeWidth="2.5" />
          {/* Ground */}
          <line x1="10" y1="150" x2="310" y2="150" stroke="#0A1128" strokeWidth="3" strokeDasharray="6 4" />
          {/* Gate Booth */}
          <rect x="180" y="55" width="110" height="95" rx="10" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
          <rect x="195" y="70" width="80" height="40" rx="6" fill="#DBEAFE" stroke="#0A1128" strokeWidth="2" />
          <text x="235" y="95" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1E40AF">GATE HUB</text>
          <circle cx="270" cy="45" r="7" fill="#10B981" stroke="#0A1128" strokeWidth="2" />
          {/* Scanner laser */}
          <line x1="205" y1="120" x2="145" y2="120" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 2" />
          {/* Delivery Rider on Scooter */}
          <circle cx="65" cy="145" r="14" fill="#0A1128" />
          <circle cx="130" cy="145" r="14" fill="#0A1128" />
          <path d="M65 145 L95 145 L110 115 L80 115 Z" fill="#2563EB" stroke="#0A1128" strokeWidth="2.5" />
          {/* Package on back */}
          <rect x="70" y="95" width="28" height="20" rx="3" fill="#FBBF24" stroke="#0A1128" strokeWidth="2" />
          <line x1="84" y1="95" x2="84" y2="115" stroke="#0A1128" strokeWidth="1.5" />
          {/* Rider */}
          <circle cx="102" cy="85" r="10" fill="#FED7AA" stroke="#0A1128" strokeWidth="2" />
          <path d="M92 82 Q102 70 112 82 Z" fill="#2563EB" stroke="#0A1128" strokeWidth="2" />
          {/* Speed sparkles */}
          <text x="35" y="110" fontSize="16">⚡</text>
          <text x="140" y="90" fontSize="10" fontWeight="bold" fill="#0A1128" className="bg-white">30s Check-In!</text>
        </svg>
      )
    },
    {
      step: '02',
      title: 'Digital Logging & Secure Hub Bay',
      role: 'Hub Staff & CCTV',
      color: 'yellow' as const,
      badge: 'Secure Storage',
      summary: 'Parcels are categorized into labeled, weather-proof storage bays under continuous 24/7 CCTV surveillance, completely protected from clutter and theft.',
      details: [
        'System automatically designates a numbered rack bay matching package dimensions.',
        'Package condition is confirmed and safely placed in its assigned slot.',
        'Zero messy piles or boxes strewn across the guard cabin floor.',
        'Status updates in real time on the society operations dashboard.'
      ],
      diagram: (
        <svg viewBox="0 0 320 180" className="w-full h-auto max-h-48">
          <rect width="320" height="180" rx="16" fill="#FEF3C7" stroke="#0A1128" strokeWidth="2.5" />
          {/* Hub Racks */}
          <rect x="40" y="35" width="240" height="115" rx="8" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
          <line x1="40" y1="75" x2="280" y2="75" stroke="#0A1128" strokeWidth="2" />
          <line x1="40" y1="115" x2="280" y2="115" stroke="#0A1128" strokeWidth="2" />
          <line x1="120" y1="35" x2="120" y2="150" stroke="#0A1128" strokeWidth="2" />
          <line x1="200" y1="35" x2="200" y2="150" stroke="#0A1128" strokeWidth="2" />
          {/* Packages on shelves */}
          <rect x="55" y="45" width="45" height="25" rx="4" fill="#F97316" stroke="#0A1128" strokeWidth="2" />
          <rect x="135" y="45" width="50" height="25" rx="4" fill="#3B82F6" stroke="#0A1128" strokeWidth="2" />
          <rect x="215" y="48" width="45" height="22" rx="4" fill="#10B981" stroke="#0A1128" strokeWidth="2" />
          <rect x="52" y="85" width="52" height="25" rx="4" fill="#FBBF24" stroke="#0A1128" strokeWidth="2" />
          {/* Active highlighted box */}
          <rect x="135" y="82" width="50" height="28" rx="4" fill="#EC4899" stroke="#0A1128" strokeWidth="2.5" />
          <text x="160" y="100" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">#B-402</text>
          <rect x="215" y="85" width="45" height="25" rx="4" fill="#A855F7" stroke="#0A1128" strokeWidth="2" />
          {/* CCTV Camera */}
          <circle cx="280" cy="25" r="8" fill="#0A1128" />
          <path d="M280 25 L260 35 L265 42 L285 30 Z" fill="#3B82F6" stroke="#0A1128" strokeWidth="1.5" />
          <circle cx="260" cy="38" r="2" fill="#EF4444" />
          {/* Badge */}
          <rect x="100" y="152" width="120" height="22" rx="6" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
          <text x="160" y="167" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0A1128">CCTV Monitored Bay</text>
        </svg>
      )
    },
    {
      step: '03',
      title: 'Resident Alert & Evening Slot Selection',
      role: 'Resident in App',
      color: 'orange' as const,
      badge: 'Your Schedule',
      summary: 'You receive an instant notification with carrier photo and details. Instead of running home, choose when you want to pick it up.',
      details: [
        'Instant push notification & WhatsApp alert: "📦 Your parcel is ready at Hub A".',
        'Open the ParcelFlow app to inspect carrier name, label photo, and arrival time.',
        'Select an evening pickup window that fits your day (e.g. 7:30 PM – 8:00 PM).',
        'Late meeting or stuck in traffic? Tap "Reschedule" anytime with zero penalty.'
      ],
      diagram: (
        <svg viewBox="0 0 320 180" className="w-full h-auto max-h-48">
          <rect width="320" height="180" rx="16" fill="#FFEDD5" stroke="#0A1128" strokeWidth="2.5" />
          {/* Phone Mockup */}
          <rect x="105" y="12" width="110" height="156" rx="16" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
          {/* Phone notch */}
          <rect x="135" y="16" width="50" height="6" rx="3" fill="#0A1128" />
          {/* Parcel Alert Card */}
          <rect x="115" y="32" width="90" height="42" rx="8" fill="#FEF3C7" stroke="#0A1128" strokeWidth="1.5" />
          <text x="125" y="48" fontSize="8" fontWeight="bold" fill="#0A1128">📦 Amazon Package</text>
          <text x="125" y="60" fontSize="7" fill="#64748B">Hub A • Arrived 12m ago</text>
          {/* Time slot chips */}
          <text x="120" y="86" fontSize="7" fontWeight="bold" fill="#0A1128">CHOOSE EVENING SLOT:</text>
          <rect x="118" y="93" width="84" height="16" rx="5" fill="#F1F5F9" stroke="#0A1128" strokeWidth="1" />
          <text x="160" y="104" textAnchor="middle" fontSize="7.5" fill="#475569">6:30 PM – 7:00 PM</text>
          {/* Selected slot */}
          <rect x="118" y="113" width="84" height="18" rx="5" fill="#2563EB" stroke="#0A1128" strokeWidth="1.5" />
          <text x="160" y="125" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFFFF">✓ 7:30 PM – 8:00 PM</text>
          <rect x="118" y="135" width="84" height="16" rx="5" fill="#F1F5F9" stroke="#0A1128" strokeWidth="1" />
          <text x="160" y="146" textAnchor="middle" fontSize="7.5" fill="#475569">8:30 PM – 9:00 PM</text>
        </svg>
      )
    },
    {
      step: '04',
      title: 'Encrypted QR & Backup OTP Token',
      role: 'Authentication Engine',
      color: 'mint' as const,
      badge: 'Zero Fraud',
      summary: 'A dynamic QR code and backup 4-digit OTP are created specifically for your handover. No paper sign-in books, no false handovers.',
      details: [
        'Dynamic QR token refreshes regularly to prevent screenshot tampering.',
        'Traveling or stuck late? Forward the single-use collection pass to flatmates via WhatsApp.',
        'Couriers never get your phone number, keeping your identity private.',
        'Guarantees 100% correct delivery to the right resident every single time.'
      ],
      diagram: (
        <svg viewBox="0 0 320 180" className="w-full h-auto max-h-48">
          <rect width="320" height="180" rx="16" fill="#D1FAE5" stroke="#0A1128" strokeWidth="2.5" />
          {/* Pass Card */}
          <rect x="60" y="25" width="200" height="130" rx="14" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
          {/* Pass Header */}
          <rect x="60" y="25" width="200" height="32" rx="12" fill="#10B981" stroke="#0A1128" strokeWidth="2" />
          <text x="160" y="46" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">🔐 VERIFIED PASS #9421</text>
          {/* QR Code in center */}
          <rect x="85" y="68" width="60" height="60" rx="6" fill="#F8FAFC" stroke="#0A1128" strokeWidth="2" />
          <rect x="92" y="75" width="18" height="18" fill="#0A1128" />
          <rect x="95" y="78" width="12" height="12" fill="#FFFFFF" />
          <rect x="120" y="75" width="18" height="18" fill="#0A1128" />
          <rect x="123" y="78" width="12" height="12" fill="#FFFFFF" />
          <rect x="92" y="103" width="18" height="18" fill="#0A1128" />
          <rect x="95" y="106" width="12" height="12" fill="#FFFFFF" />
          <rect x="115" y="100" width="8" height="8" fill="#0A1128" />
          <rect x="125" y="108" width="10" height="10" fill="#10B981" />
          {/* Backup OTP Block */}
          <rect x="160" y="70" width="85" height="55" rx="8" fill="#FEF3C7" stroke="#0A1128" strokeWidth="2" />
          <text x="202" y="88" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#64748B">BACKUP OTP</text>
          <text x="202" y="112" textAnchor="middle" fontSize="18" fontWeight="900" fill="#0A1128" letterSpacing="2">8419</text>
          {/* Delegation chip */}
          <text x="160" y="146" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#059669">✓ Shareable via WhatsApp</text>
        </svg>
      )
    },
    {
      step: '05',
      title: '15-Second Handover & Digital Receipt',
      role: 'Resident & Gate Hub',
      color: 'blue' as const,
      badge: 'Done in 15s',
      summary: 'Walk by the parcel hub on your way home, scan your pass, take your package, and head up to your apartment with zero stress.',
      details: [
        'Gate staff scans your pass on the hub terminal.',
        'Hub bay shelf illuminates for instant 5-second package retrieval.',
        'Handover status flips instantly to "Collected" in your mobile app.',
        'Timestamped digital receipt is archived in your history for complete peace of mind.'
      ],
      diagram: (
        <svg viewBox="0 0 320 180" className="w-full h-auto max-h-48">
          <rect width="320" height="180" rx="16" fill="#DBEAFE" stroke="#0A1128" strokeWidth="2.5" />
          {/* Handover Counter */}
          <rect x="30" y="90" width="260" height="65" rx="8" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2.5" />
          <line x1="30" y1="110" x2="290" y2="110" stroke="#0A1128" strokeWidth="2" />
          {/* Terminal */}
          <rect x="135" y="65" width="50" height="40" rx="6" fill="#0A1128" />
          <rect x="140" y="70" width="40" height="25" rx="3" fill="#10B981" />
          <text x="160" y="86" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FFFFFF">✓ VALID</text>
          {/* Resident with parcel */}
          <circle cx="85" cy="55" r="16" fill="#FED7AA" stroke="#0A1128" strokeWidth="2" />
          <path d="M75 55 Q85 68 95 55" stroke="#0A1128" strokeWidth="2" fill="none" />
          {/* Eyes smiling */}
          <circle cx="80" cy="52" r="2" fill="#0A1128" />
          <circle cx="90" cy="52" r="2" fill="#0A1128" />
          {/* Box held */}
          <rect x="68" y="75" width="34" height="25" rx="4" fill="#FBBF24" stroke="#0A1128" strokeWidth="2" />
          {/* Staff */}
          <circle cx="235" cy="55" r="16" fill="#FED7AA" stroke="#0A1128" strokeWidth="2" />
          <path d="M225 55 Q235 68 245 55" stroke="#0A1128" strokeWidth="2" fill="none" />
          {/* Thumbs up badge */}
          <rect x="100" y="120" width="120" height="24" rx="6" fill="#FEF08A" stroke="#0A1128" strokeWidth="2" />
          <text x="160" y="136" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0A1128">🎉 15s Total Handover!</text>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#FEF9F3] text-[#0A1128] pt-28 pb-16 selection:bg-amber-300 selection:text-[#0A1128]">
      
      {/* Hero Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sticker color="blue" rotate="slight-left" size="sm">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-white" />
            The Complete Parcel Journey
          </Sticker>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A1128] max-w-4xl mx-auto leading-tight">
          How ParcelFlow works from <br />
          <span className="text-blue-600 underline decoration-amber-400 decoration-wavy decoration-2">
            society gate to your hands.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto">
          A seamless 5-stage closed loop designed specifically for modern Indian apartment societies. Zero missed calls, zero lost packages, and complete evening schedule freedom.
        </p>

        {/* Stage quick jump bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black border-[2px] border-[#0A1128] transition-all ${
                activeStep === idx 
                  ? 'bg-blue-600 text-white shadow-[3px_3px_0px_#0A1128] -translate-y-0.5' 
                  : 'bg-white hover:bg-amber-50 text-[#0A1128] shadow-[2px_2px_0px_#0A1128]'
              }`}
            >
              Stage {s.step}: {s.badge}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Step Explorer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Stage Selector Cards */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-1 mb-2">
              Select stage to view cartoon diagram:
            </div>

            {steps.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  type="button"
                  className={`w-full text-left p-4.5 sm:p-5 rounded-2xl border-[2.5px] border-[#0A1128] transition-all flex items-start gap-4 cursor-pointer ${
                    isActive 
                      ? 'bg-white shadow-[5px_5px_0px_#0A1128] -translate-y-0.5' 
                      : 'bg-[#FEF9F3] hover:bg-white shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl border-[2px] border-[#0A1128] flex items-center justify-center shrink-0 font-black text-sm shadow-[2px_2px_0px_#0A1128] ${
                    isActive 
                      ? 'bg-amber-400 text-[#0A1128]' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {s.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <Sticker color={s.color} size="sm" rotate="none" shadow="sm">
                        {s.badge}
                      </Sticker>
                      <span className="text-[11px] font-bold text-slate-500">{s.role}</span>
                    </div>
                    <div className="font-extrabold text-sm sm:text-base text-[#0A1128] leading-snug mt-1">
                      {s.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Stage View & Illustrated Diagram */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border-[3px] border-[#0A1128] p-6 sm:p-8 shadow-[6px_6px_0px_#0A1128] relative">
              
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-[2.5px] border-slate-100 pb-5 mb-5">
                <div>
                  <div className="text-xs font-black font-mono text-blue-600 uppercase tracking-wider">
                    Stage {steps[activeStep].step} of 05
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] mt-0.5">
                    {steps[activeStep].title}
                  </h2>
                </div>
                <Sticker color={steps[activeStep].color} rotate="slight-right" size="sm">
                  {steps[activeStep].role}
                </Sticker>
              </div>

              {/* Illustrated Diagram Canvas */}
              <div className="mb-6 p-2 rounded-2xl bg-[#FEF9F3] border-[2px] border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
                {steps[activeStep].diagram}
              </div>

              {/* Summary */}
              <p className="text-base font-semibold text-slate-800 leading-relaxed mb-6">
                {steps[activeStep].summary}
              </p>

              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                How this stage works:
              </h4>

              <div className="space-y-2.5 mb-6">
                {steps[activeStep].details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border-[1.5px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 stroke-[2.5]" />
                    <span className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Step Navigation footer */}
              <div className="flex items-center justify-between pt-5 border-t-[2px] border-slate-200">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-xs font-black text-[#0A1128] border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128] transition-all cursor-pointer"
                >
                  ← Previous Stage
                </button>

                <div className="flex items-center gap-1.5">
                  {steps.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveStep(dotIdx)}
                      className={`h-2.5 rounded-full border border-[#0A1128] transition-all cursor-pointer ${
                        activeStep === dotIdx ? 'w-7 bg-amber-400' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-xs font-black text-white border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Next Stage →
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Special Deep Dives: Real-Life Scenarios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Sticker color="yellow" rotate="none" size="sm" className="mb-3 inline-flex">
            Everyday Realities
          </Sticker>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">Engineered for Modern Living</h2>
          <p className="text-slate-600 font-medium text-sm sm:text-base mt-2">
            No rigid rules. Built to handle real-life schedule twists smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-7 rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-[5px_5px_0px_#0A1128] hover:-translate-y-1 transition-all">
            <div className="w-13 h-13 rounded-2xl bg-amber-100 border-[2px] border-[#0A1128] text-amber-800 flex items-center justify-center mb-5 shadow-[2px_2px_0px_#0A1128]">
              <Users className="w-7 h-7 stroke-[2.2]" />
            </div>
            <Sticker color="yellow" rotate="slight-left" size="sm" className="mb-3">
              Family & Friends
            </Sticker>
            <h3 className="text-xl font-black text-[#0A1128] mb-2">Proxy Delegation</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Traveling or stuck in evening traffic? One click sends a secure forwarding pass via WhatsApp to your flatmate, spouse, or neighbor to pick up your parcel.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-[5px_5px_0px_#0A1128] hover:-translate-y-1 transition-all">
            <div className="w-13 h-13 rounded-2xl bg-blue-100 border-[2px] border-[#0A1128] text-blue-800 flex items-center justify-center mb-5 shadow-[2px_2px_0px_#0A1128]">
              <Clock className="w-7 h-7 stroke-[2.2]" />
            </div>
            <Sticker color="blue" rotate="slight-right" size="sm" className="mb-3">
              Schedule Freedom
            </Sticker>
            <h3 className="text-xl font-black text-[#0A1128] mb-2">Instant Rescheduling</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Plans change. If you can’t make your 7:30 PM slot, reschedule to 9:00 PM or the next morning with zero penalty. Your package remains guarded in the hub.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-[5px_5px_0px_#0A1128] hover:-translate-y-1 transition-all">
            <div className="w-13 h-13 rounded-2xl bg-emerald-100 border-[2px] border-[#0A1128] text-emerald-800 flex items-center justify-center mb-5 shadow-[2px_2px_0px_#0A1128]">
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            </div>
            <Sticker color="mint" rotate="slight-left" size="sm" className="mb-3">
              100% Audit Trail
            </Sticker>
            <h3 className="text-xl font-black text-[#0A1128] mb-2">Zero Lost Packages</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Every parcel status is logged to an immutable digital audit trail with exact staff badge IDs and timestamps. No paper logbooks, no guessing games.
            </p>
          </div>

        </div>
      </div>

      {/* Download CTA component */}
      <DownloadCTA onOpenPilotModal={onOpenPilotModal} />

    </div>
  );
};
