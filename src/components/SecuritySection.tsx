import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scan, 
  Warehouse, 
  CalendarClock, 
  KeyRound, 
  PackageCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';

interface JourneyStep {
  stepNumber: string;
  name: string;
  emoji: string;
  color: string;
  badge: string;
  badgeColor: string;
  actor: string;
  timestamp: string;
  description: string;
  auditDetail: string;
  illustration: React.ReactNode;
}

export const SecuritySection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps: JourneyStep[] = [
    {
      stepNumber: '01',
      name: 'Received at Hub',
      emoji: '🚚',
      color: 'bg-amber-100',
      badge: 'Step 1 • Gate Arrival',
      badgeColor: 'bg-amber-300 text-slate-900',
      actor: 'Courier Driver & Hub Officer',
      timestamp: '11:24 AM',
      description: 'Courier arrives at the society perimeter gate. Package is received into safe custody without delivery bikes entering residential inner walking areas.',
      auditDetail: 'Delivery vehicle entry timestamped, carrier badge recorded digitally.',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="142" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Delivery Van */}
          <rect x="25" y="55" width="90" height="65" rx="10" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
          <path d="M115 75 L140 75 L150 95 L150 120 L115 120 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="120" y="80" width="22" height="18" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="55" cy="120" r="14" fill="#0F172A" />
          <circle cx="55" cy="120" r="6" fill="#FFFFFF" />
          <circle cx="132" cy="120" r="14" fill="#0F172A" />
          <circle cx="132" cy="120" r="6" fill="#FFFFFF" />
          <text x="65" y="92" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="900">EXPRESS</text>

          {/* Package Handover Box */}
          <g transform="translate(160, 75)">
            <rect width="36" height="34" rx="4" fill="#FDBA74" stroke="#0F172A" strokeWidth="2" />
            <path d="M0 17 H36" stroke="#EA580C" strokeWidth="4" />
            <circle cx="18" cy="14" r="2" fill="#0F172A" />
          </g>

          {/* Gate Boom Barrier */}
          <line x1="200" y1="130" x2="200" y2="70" stroke="#0F172A" strokeWidth="3" />
        </svg>
      )
    },
    {
      stepNumber: '02',
      name: 'Logged & Scanned',
      emoji: '⚡',
      color: 'bg-sky-100',
      badge: 'Step 2 • 8-Sec Scan',
      badgeColor: 'bg-sky-300 text-slate-900',
      actor: 'ParcelFlow Optical Terminal',
      timestamp: '11:24:18 AM',
      description: 'The package barcode and recipient tower/flat number are read instantly by the hub scanner. Recipient receives a silent, verified push notification.',
      auditDetail: 'High-res image of carrier shipping label archived with SHA-256 hash.',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="142" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Scanner Device */}
          <rect x="70" y="30" width="100" height="75" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          {/* Laser beam */}
          <path d="M85 70 L60 115 L180 115 L155 70 Z" fill="#EF4444" opacity="0.25" />
          <line x1="60" y1="115" x2="180" y2="115" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 3" />
          
          {/* Package on scanner */}
          <rect x="92" y="100" width="56" height="40" rx="6" fill="#FDBA74" stroke="#0F172A" strokeWidth="2" />
          {/* Barcode */}
          <line x1="102" y1="115" x2="102" y2="128" stroke="#0F172A" strokeWidth="2" />
          <line x1="108" y1="115" x2="108" y2="128" stroke="#0F172A" strokeWidth="1" />
          <line x1="112" y1="115" x2="112" y2="128" stroke="#0F172A" strokeWidth="3" />
          <line x1="120" y1="115" x2="120" y2="128" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="126" y1="115" x2="126" y2="128" stroke="#0F172A" strokeWidth="2" />

          {/* Scanner Screen Display */}
          <rect x="80" y="40" width="80" height="24" rx="4" fill="#0F172A" />
          <text x="120" y="56" textAnchor="middle" fill="#4ADE80" fontSize="9" fontWeight="900">SCANNED ✓ T1-402</text>
        </svg>
      )
    },
    {
      stepNumber: '03',
      name: 'Safely Stored',
      emoji: '🗄️',
      color: 'bg-emerald-100',
      badge: 'Step 3 • Secured On Rack',
      badgeColor: 'bg-emerald-300 text-slate-900',
      actor: 'Hub Inventory System',
      timestamp: '11:25 AM',
      description: 'Placed onto designated, color-coded rack bins organized by tower and wing. Fully protected from dust, rain, and unauthorized access.',
      auditDetail: 'Allocated to Bay A-12 with digital shelf verification check.',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="142" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Storage Rack Shelf */}
          <rect x="50" y="30" width="140" height="105" rx="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
          <line x1="50" y1="65" x2="190" y2="65" stroke="#0F172A" strokeWidth="2.5" />
          <line x1="50" y1="100" x2="190" y2="100" stroke="#0F172A" strokeWidth="2.5" />
          
          {/* Neatly stored boxes */}
          <rect x="65" y="38" width="28" height="22" rx="3" fill="#F472B6" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="105" y="36" width="34" height="24" rx="3" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="150" y="40" width="26" height="20" rx="3" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />

          {/* Highlighted Box on Shelf 2 */}
          <g className="animate-pulse">
            <rect x="95" y="72" width="48" height="24" rx="4" fill="#34D399" stroke="#0F172A" strokeWidth="2.5" />
            <text x="119" y="87" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="bold">TOWER B</text>
          </g>

          <rect x="60" y="108" width="38" height="22" rx="3" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="110" y="106" width="30" height="24" rx="3" fill="#FDBA74" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="150" y="108" width="32" height="22" rx="3" fill="#A78BFA" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      stepNumber: '04',
      name: 'Time Scheduled',
      emoji: '📱',
      color: 'bg-purple-100',
      badge: 'Step 4 • Resident Choice',
      badgeColor: 'bg-purple-300 text-slate-900',
      actor: 'Resident on ParcelFlow App',
      timestamp: '03:40 PM',
      description: 'Resident taps the mobile notification during their coffee break, selecting their preferred evening collection window: 8:00 PM – 8:30 PM.',
      auditDetail: 'Encrypted pickup token issued to resident device only.',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="142" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Smartphone */}
          <rect x="80" y="20" width="80" height="120" rx="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          <rect x="90" y="32" width="60" height="92" rx="8" fill="#F5F3FF" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Slot cards inside phone */}
          <rect x="95" y="42" width="50" height="16" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <text x="120" y="53" textAnchor="middle" fill="#0F172A" fontSize="7" fontWeight="bold">6:30 PM</text>
          
          <rect x="95" y="64" width="50" height="18" rx="4" fill="#A855F7" stroke="#0F172A" strokeWidth="1.5" />
          <text x="120" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900">8:00 PM ✓</text>

          <rect x="95" y="88" width="50" height="16" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <text x="120" y="99" textAnchor="middle" fill="#0F172A" fontSize="7" fontWeight="bold">9:15 PM</text>

          {/* Floating Sticker */}
          <g transform="translate(145, 30) rotate(12)">
            <rect width="60" height="22" rx="6" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />
            <text x="30" y="15" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="900">Locked in 🎯</text>
          </g>
        </svg>
      )
    },
    {
      stepNumber: '05',
      name: 'Verified Release',
      emoji: '🔐',
      color: 'bg-rose-100',
      badge: 'Step 5 • OTP / QR Handshake',
      badgeColor: 'bg-rose-300 text-slate-900',
      actor: 'Resident & Gate Hub Staff',
      timestamp: '08:08 PM',
      description: 'Resident arrives at the parcel hub. A dynamic cryptographic QR code or 6-digit OTP is scanned. Release confirmed instantly.',
      auditDetail: 'Multi-factor authentication match authenticated by cloud registry.',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="142" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Shield Badge */}
          <path d="M120 25 L165 42 V80 C165 110 120 128 120 128 C120 128 75 110 75 80 V42 Z" fill="#F43F5E" stroke="#0F172A" strokeWidth="3" />
          
          {/* QR code on shield */}
          <rect x="98" y="55" width="44" height="44" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <rect x="104" y="61" width="10" height="10" fill="#0F172A" />
          <rect x="126" y="61" width="10" height="10" fill="#0F172A" />
          <rect x="104" y="83" width="10" height="10" fill="#0F172A" />
          <rect x="120" y="77" width="8" height="8" fill="#10B981" />

          {/* Sparkles */}
          <circle cx="65" cy="50" r="4" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="175" cy="50" r="4" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      stepNumber: '06',
      name: 'Safe Handover',
      emoji: '🎉',
      color: 'bg-green-100',
      badge: 'Step 6 • Mission Complete',
      badgeColor: 'bg-green-300 text-slate-900',
      actor: 'Happy Resident',
      timestamp: '08:09 PM',
      description: 'Package in hand! Both resident and society RWA get digital receipts. Zero lost packages, zero confusion, 100% peace of mind.',
      auditDetail: 'Custody concluded. Immutable digital audit entry logged.',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="142" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Happy Resident Holding Package */}
          <circle cx="120" cy="50" r="22" fill="#FED7AA" stroke="#0F172A" strokeWidth="2.5" />
          {/* Cool sunglasses */}
          <rect x="106" y="44" width="12" height="8" rx="2" fill="#0F172A" />
          <rect x="122" y="44" width="12" height="8" rx="2" fill="#0F172A" />
          <line x1="118" y1="48" x2="122" y2="48" stroke="#0F172A" strokeWidth="2" />
          {/* Big Smile */}
          <path d="M112 58 Q120 66 128 58" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

          {/* Happy Torso */}
          <path d="M95 125 C95 80 145 80 145 125 Z" fill="#10B981" stroke="#0F172A" strokeWidth="2.5" />

          {/* Package in hands */}
          <rect x="98" y="90" width="44" height="34" rx="4" fill="#FDBA74" stroke="#0F172A" strokeWidth="2" />
          <line x1="98" y1="107" x2="142" y2="107" stroke="#EA580C" strokeWidth="4" />

          {/* Confetti */}
          <rect x="65" y="35" width="8" height="8" rx="1" fill="#F472B6" transform="rotate(20)" />
          <rect x="170" y="38" width="8" height="8" rx="1" fill="#FBBF24" transform="rotate(-30)" />
          <rect x="160" y="80" width="6" height="6" rx="1" fill="#38BDF8" transform="rotate(45)" />
        </svg>
      )
    }
  ];

  const currentStep = steps[activeStepIndex];

  return (
    <section id="security" className="relative py-20 sm:py-28 bg-[#FFFDF9] text-slate-900 overflow-hidden border-b-2 border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-300 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] text-slate-900 text-xs sm:text-sm font-black uppercase tracking-wider mb-4 -rotate-1 hover:rotate-0 transition-transform">
            <ShieldCheck className="w-4 h-4 text-slate-900" />
            <span>End-to-End Custody</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Every parcel has a journey. <br />
            <span className="relative inline-block text-purple-600">
              Tracked, guarded & verified.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-purple-400" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            From the minute the delivery courier steps foot onto society grounds until it is safely in your hands, every step has cryptographic proof.
          </p>
        </div>

        {/* 6-Step Cartoon Progress Bar */}
        <div className="mb-12">
          {/* Steps Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {steps.map((step, index) => {
              const isActive = index === activeStepIndex;
              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => setActiveStepIndex(index)}
                  className={`p-3.5 rounded-2xl border-2 border-slate-900 text-left transition-all duration-150 flex flex-col justify-between ${
                    isActive 
                      ? `${step.color} shadow-[4px_4px_0px_#0F172A] -translate-y-1` 
                      : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0F172A]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{step.emoji}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border border-slate-900 ${
                      isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {step.stepNumber}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{step.name}</div>
                    <div className="text-[10px] font-bold text-slate-600 mt-0.5">{step.timestamp}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Inspector Showcase Card */}
        <div className="bg-white rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_#0F172A] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Cartoon Stage Graphic */}
            <div className={`lg:col-span-6 rounded-2xl p-6 ${currentStep.color} border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A]`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A] ${currentStep.badgeColor}`}>
                  {currentStep.badge}
                </span>
                <span className="text-xs font-black bg-white px-2.5 py-1 rounded-full border border-slate-900">
                  Logged: {currentStep.timestamp}
                </span>
              </div>

              {/* Cartoon SVG */}
              <div className="py-2">
                {currentStep.illustration}
              </div>
            </div>

            {/* Right: Step Description & Audit Proof */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-purple-100 text-purple-900 border border-slate-900">
                  {currentStep.actor}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                  {currentStep.name}
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed mt-2">
                  {currentStep.description}
                </p>
              </div>

              {/* Digital Audit Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A]">
                <div className="flex items-center gap-2 mb-1">
                  <Fingerprint className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wide">Immutable Society Audit Record:</span>
                </div>
                <p className="font-mono text-xs font-bold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-300">
                  {currentStep.auditDetail}
                </p>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200"
                >
                  ← Previous Step
                </button>
                <button
                  type="button"
                  disabled={activeStepIndex === steps.length - 1}
                  onClick={() => setActiveStepIndex(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl text-xs font-black border-2 border-slate-900 bg-purple-400 hover:bg-purple-300 text-slate-900 shadow-[2px_2px_0px_#0F172A] hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Security Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'QR & OTP Verification', icon: '🔐', desc: 'Zero package releases without verified 6-digit one-time code or encrypted QR.' },
            { title: 'Authorized Staff Access', icon: '🛡️', desc: 'Only trained and vetted society gate personnel can unlock and manage parcels.' },
            { title: 'Chain of Custody Logs', icon: '📋', desc: 'Every intake, scan, move, and handover is permanently recorded with timestamps.' },
            { title: 'Zero Corridor Thefts', icon: '🚪', desc: 'Packages are never dropped outside flats or left unattended in common corridors.' },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] hover:-translate-y-1 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 border-2 border-slate-900 flex items-center justify-center text-xl mb-3">
                {pillar.icon}
              </div>
              <h4 className="text-base font-black text-slate-900">{pillar.title}</h4>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SecuritySection;
