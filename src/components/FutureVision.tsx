import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  ArrowRight, 
  Boxes,
  Zap,
  Bot,
  Truck,
  Building2
} from 'lucide-react';

interface RoadmapStage {
  id: string;
  stageBadge: string;
  badgeStatus: 'live' | 'next' | 'later' | 'future';
  badgeColor: string;
  timeframe: string;
  title: string;
  tagline: string;
  description: string;
  milestones: string[];
  emoji: string;
  illustration: React.ReactNode;
}

export const FutureVision: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  const stages: RoadmapStage[] = [
    {
      id: 'today',
      stageBadge: 'LIVE TODAY',
      badgeStatus: 'live',
      badgeColor: 'bg-emerald-300 text-slate-900',
      timeframe: 'Phase 1 • Now Live in Pilot Societies',
      title: 'Scheduled Gate Handovers',
      tagline: 'Solving the immediate pain of apartment parcel chaos',
      description: 'Centralized Gate Hub intake, instant resident push alerts, flexible evening pickup windows, and cryptographic QR/OTP verification.',
      milestones: [
        '8-second gate intake scanner terminal',
        'Resident pickup scheduling app (iOS & Android)',
        'Zero-trust OTP & QR code release protocol',
        'Complete digital chain of custody for RWAs'
      ],
      emoji: '📦',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="140" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Society Hub Booth */}
          <rect x="60" y="40" width="120" height="90" rx="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="50,45 120,15 190,45" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
          <text x="120" y="38" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="900">HUB 01</text>
          
          {/* Organized Racks */}
          <rect x="75" y="55" width="40" height="65" rx="3" fill="#E0F2FE" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="80" y="60" width="14" height="12" rx="2" fill="#FB923C" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="97" y="62" width="14" height="10" rx="2" fill="#34D399" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="80" y="80" width="16" height="14" rx="2" fill="#F472B6" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Checkmark badge */}
          <g transform="translate(140, 60)">
            <circle cx="16" cy="16" r="16" fill="#86EFAC" stroke="#0F172A" strokeWidth="2" />
            <path d="M10 16 L14 20 L22 12" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      )
    },
    {
      id: 'next',
      stageBadge: 'NEXT UP',
      badgeStatus: 'next',
      badgeColor: 'bg-amber-300 text-slate-900',
      timeframe: 'Phase 2 • Q3 2026',
      title: 'Smart Parcel Lockers',
      tagline: '24/7 automated unattended pickup pods',
      description: 'Modular physical smart lockers installed in society clubhouses and tower lobbies. Collect at 2:00 AM or midday without needing staff assistance.',
      milestones: [
        'Modular electronic locker bays with touchscreens',
        'Cold-chain insulated pods for groceries & fresh food',
        'Automatic OTP locker door pops on approach',
        'Integrated solar battery backup'
      ],
      emoji: '🗄️',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="140" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Smart Locker Unit */}
          <rect x="50" y="25" width="140" height="110" rx="8" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
          
          {/* Locker Pod Cells */}
          <rect x="60" y="35" width="34" height="26" rx="3" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="88" cy="48" r="2.5" fill="#10B981" />
          
          <rect x="100" y="35" width="34" height="26" rx="3" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="128" cy="48" r="2.5" fill="#EF4444" />

          {/* Central Interactive Touchscreen */}
          <rect x="140" y="35" width="40" height="58" rx="4" fill="#0F172A" stroke="#0F172A" strokeWidth="2" />
          <text x="160" y="65" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="bold">SCAN QR</text>

          {/* Lower Large Lockers */}
          <rect x="60" y="68" width="34" height="30" rx="3" fill="#FEF08A" stroke="#0F172A" strokeWidth="1.5" />
          {/* Cold-chain blue locker */}
          <rect x="100" y="68" width="34" height="30" rx="3" fill="#93C5FD" stroke="#0F172A" strokeWidth="1.5" />
          <text x="117" y="86" textAnchor="middle" fill="#0F172A" fontSize="7" fontWeight="bold">COLD ❄️</text>

          {/* Glowing Green Pop */}
          <path d="M60 105 L94 105 L90 128 L56 128 Z" fill="#86EFAC" stroke="#0F172A" strokeWidth="1.5" />
          <text x="75" y="120" textAnchor="middle" fill="#0F172A" fontSize="7" fontWeight="bold">POPPED!</text>
        </svg>
      )
    },
    {
      id: 'later',
      stageBadge: 'LATER',
      badgeStatus: 'later',
      badgeColor: 'bg-sky-300 text-slate-900',
      timeframe: 'Phase 3 • 2027',
      title: 'Direct Courier Integrations',
      tagline: 'Deep carrier API handshakes for zero-touch intake',
      description: 'Amazon Logistics, Flipkart, Blinkit, and BlueDart carriers deposit straight into ParcelFlow hubs with automated digital handshakes.',
      milestones: [
        'Direct carrier dispatch API integrations',
        'Single-scan bulk intake for 50+ packages at once',
        'Automatic reverse pickups & seamless returns from hub',
        'Instant courier payout upon safe hub handover'
      ],
      emoji: '🤝',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="140" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Carrier Logos Floating */}
          <rect x="30" y="40" width="70" height="40" rx="6" fill="#FDBA74" stroke="#0F172A" strokeWidth="2" />
          <text x="65" y="65" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="900">AMAZON</text>

          <rect x="140" y="40" width="70" height="40" rx="6" fill="#93C5FD" stroke="#0F172A" strokeWidth="2" />
          <text x="175" y="65" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="900">FLIPKART</text>

          {/* Central API Handshake Cloud */}
          <ellipse cx="120" cy="100" rx="40" ry="24" fill="#FDE047" stroke="#0F172A" strokeWidth="2.5" />
          <text x="120" y="104" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="900">DIRECT API</text>

          {/* Lightning connection lines */}
          <line x1="80" y1="75" x2="100" y2="90" stroke="#0F172A" strokeWidth="3" strokeDasharray="3 3" />
          <line x1="160" y1="75" x2="140" y2="90" stroke="#0F172A" strokeWidth="3" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 'future',
      stageBadge: 'THE HORIZON',
      badgeStatus: 'future',
      badgeColor: 'bg-purple-300 text-slate-900',
      timeframe: 'Phase 4 • 2028 & Beyond',
      title: 'Smarter Delivery Infrastructure',
      tagline: 'Autonomous intra-society delivery & intelligent towers',
      description: 'Self-driving indoor rovers and vertical elevator transport bring scheduled packages from gate hubs straight to doorstep on your exact command.',
      milestones: [
        'Automated ground rovers navigating society walkways',
        'Smart elevator calls for door-to-door delivery',
        'AI predictive intake forecasting delivery volumes',
        'Zero-emission intra-society transport'
      ],
      emoji: '🤖',
      illustration: (
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="140" rx="90" ry="8" fill="#0F172A" opacity="0.12" />
          {/* Cute Autonomous Delivery Rover */}
          <rect x="70" y="60" width="100" height="60" rx="14" fill="#C084FC" stroke="#0F172A" strokeWidth="3" />
          
          {/* Rover Wheels */}
          <circle cx="85" cy="125" r="14" fill="#0F172A" />
          <circle cx="85" cy="125" r="5" fill="#FFFFFF" />
          <circle cx="155" cy="125" r="14" fill="#0F172A" />
          <circle cx="155" cy="125" r="5" fill="#FFFFFF" />

          {/* Rover Face / Eyes */}
          <circle cx="140" cy="80" r="6" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
          <circle cx="156" cy="80" r="6" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
          <path d="M142 94 Q148 98 154 94" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

          {/* Parcel inside clear compartment */}
          <rect x="80" y="70" width="40" height="35" rx="4" fill="#FDBA74" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="80" y1="88" x2="120" y2="88" stroke="#EA580C" strokeWidth="3" />

          {/* Lidar sensor antenna on top */}
          <line x1="120" y1="60" x2="120" y2="40" stroke="#0F172A" strokeWidth="3" />
          <circle cx="120" cy="38" r="7" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />

          {/* Antenna wave rings */}
          <path d="M110 32 C115 28 125 28 130 32" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const currentStage = stages[activeStageIndex];

  return (
    <section id="future-vision" className="relative py-20 sm:py-28 bg-[#FFFDF9] text-slate-900 overflow-hidden border-b-2 border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] text-slate-900 text-xs sm:text-sm font-black uppercase tracking-wider mb-4 rotate-1 hover:rotate-0 transition-transform">
            <Compass className="w-4 h-4 text-slate-900" />
            <span>Product Roadmap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            We're building more than <br />
            <span className="relative inline-block text-blue-600">
              parcel storage.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            From scheduled gate handovers today to IoT lockers and autonomous rovers tomorrow, here is how residential delivery infrastructure is evolving.
          </p>
        </div>

        {/* 4-Step Interactive Roadmap Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stages.map((stage, idx) => {
            const isSelected = idx === activeStageIndex;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`p-5 rounded-2xl border-2 border-slate-900 text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-100 shadow-[4px_4px_0px_#0F172A] -translate-y-1'
                    : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_#0F172A]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stage.emoji}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900 ${stage.badgeColor}`}>
                    {stage.stageBadge}
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">{stage.timeframe}</div>
                  <div className="text-base font-black text-slate-900 mt-1">{stage.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep-Dive Card */}
        <div className="bg-white rounded-3xl border-3 border-slate-900 shadow-[6px_6px_0px_#0F172A] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Cartoon Roadmap Illustration */}
            <div className="lg:col-span-6 bg-amber-50 rounded-2xl p-6 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A]">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A] ${currentStage.badgeColor}`}>
                  {currentStage.stageBadge}
                </span>
                <span className="text-xs font-black text-slate-800 bg-white px-2.5 py-1 rounded-full border border-slate-900">
                  {currentStage.timeframe}
                </span>
              </div>

              {/* Illustration */}
              <div className="py-2">
                {currentStage.illustration}
              </div>
            </div>

            {/* Right: Stage Detail & Milestones */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {currentStage.title}
                </h3>
                <p className="text-sm font-bold text-blue-700 mt-1 uppercase tracking-wide">
                  {currentStage.tagline}
                </p>
                <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed mt-3">
                  {currentStage.description}
                </p>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Key Deliverables & Milestones:</h4>
                {currentStage.milestones.map((milestone, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-300 border border-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{milestone}</span>
                  </div>
                ))}
              </div>

              {/* Next/Prev Navigation */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={activeStageIndex === 0}
                  onClick={() => setActiveStageIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200"
                >
                  ← Previous Phase
                </button>
                <button
                  type="button"
                  disabled={activeStageIndex === stages.length - 1}
                  onClick={() => setActiveStageIndex(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl text-xs font-black border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-[2px_2px_0px_#0F172A] hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>Next Phase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FutureVision;
