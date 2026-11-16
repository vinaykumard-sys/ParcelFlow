import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  ArrowRight, 
  Calendar
} from 'lucide-react';

interface RoadmapPhase {
  id: string;
  badge: string;
  badgeStatus: 'active' | 'upcoming' | 'later' | 'vision';
  timeframe: string;
  title: string;
  tagline: string;
  description: string;
  milestones: string[];
  visualMetric: string;
}

export const FutureVision: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);

  const phases: RoadmapPhase[] = [
    {
      id: 'today',
      badge: 'LIVE TODAY',
      badgeStatus: 'active',
      timeframe: 'Phase 1 • Now Live',
      title: 'Scheduled Gate Handovers',
      tagline: 'Solving the immediate pain of apartment parcel chaos',
      description: 'Centralized Gate Hub intake, instant resident push alerts, flexible evening pickup windows, and cryptographic QR/OTP verification.',
      milestones: [
        '10-second gate intake scanner terminal',
        'Resident pickup scheduling app (iOS & Android)',
        'Zero-trust OTP & QR code release protocol',
        'Complete digital chain of custody for RWAs'
      ],
      visualMetric: 'Deployed in Pilot Societies'
    },
    {
      id: 'next',
      badge: 'Q3 2026',
      badgeStatus: 'upcoming',
      timeframe: 'Phase 2 • Engineering In-Progress',
      title: 'Smart Parcel Lockers',
      tagline: '24/7 automated unattended pickup pods',
      description: 'Modular physical smart lockers installed in society clubhouses and tower lobbies. Collect at 2:00 AM or midday without needing staff assistance.',
      milestones: [
        'IoT smart bays with Bluetooth & NFC unlock',
        'Cold-chain climate compartments for groceries & meds',
        'Auto-assigned dynamic bay sizing (S, M, L, XL)',
        'Battery backup & offline emergency override'
      ],
      visualMetric: 'Hardware Prototype Validated'
    },
    {
      id: 'later',
      badge: '2027',
      badgeStatus: 'later',
      timeframe: 'Phase 3 • Partner APIs',
      title: 'Direct Courier Integrations',
      tagline: 'Deep carrier API handshake',
      description: 'Direct deep integrations with Amazon Logistics, Flipkart, Delhivery, BlueDart, and Shadowfax. Couriers pre-scan directly into ParcelFlow bays.',
      milestones: [
        'Unified carrier webhook ingestion protocol',
        'Pre-manifest automated bay reservation',
        'One-scan bulk drop for delivery drivers',
        'Automatic reverse-logistics & returns pick-up'
      ],
      visualMetric: 'API Specifications Drafted'
    },
    {
      id: 'future',
      badge: 'VISION 2028+',
      badgeStatus: 'vision',
      timeframe: 'Phase 4 • Autonomous Future',
      title: 'Intelligent Delivery Infrastructure',
      tagline: 'Autonomous intra-society campus logistics',
      description: 'Self-driving community delivery rovers that transport heavy packages from gate hubs directly to tower elevators during reserved evening slots.',
      milestones: [
        'Campus micro-mobility delivery rovers',
        'Multi-package intelligent weight optimization',
        'Carbon-neutral society logistics index',
        'Smart elevator & access door integrations'
      ],
      visualMetric: 'Patents & Concept Architecture'
    }
  ];

  return (
    <section id="roadmap" className="relative py-24 sm:py-32 bg-slate-950 text-white overflow-hidden border-t border-slate-800">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[650px] h-[400px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm">
            <Compass className="w-3.5 h-3.5" />
            <span>The Horizon</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            This is just the beginning. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Building the operating system for last-yard logistics.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            We started with scheduled apartment handovers. Here is our progressive roadmap to automate and elevate community delivery infrastructure.
          </p>
        </div>

        {/* 4-Phase Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {phases.map((phase, idx) => {
            const isSelected = selectedPhase === idx;

            let badgeStyles = 'bg-slate-800 text-slate-400 border-slate-700';
            let cardBorder = 'border-slate-800 hover:border-slate-700';

            if (phase.badgeStatus === 'active') {
              badgeStyles = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold';
              cardBorder = isSelected ? 'border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-emerald-500/30';
            } else if (phase.badgeStatus === 'upcoming') {
              badgeStyles = 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-bold';
              cardBorder = isSelected ? 'border-blue-500/80 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-slate-800';
            } else if (phase.badgeStatus === 'later') {
              badgeStyles = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
              cardBorder = isSelected ? 'border-indigo-500/80' : 'border-slate-800';
            } else if (phase.badgeStatus === 'vision') {
              badgeStyles = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
              cardBorder = isSelected ? 'border-purple-500/80' : 'border-slate-800';
            }

            return (
              <div
                key={phase.id}
                onClick={() => setSelectedPhase(idx)}
                className={`rounded-2xl bg-slate-900/80 border p-6 backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col justify-between group ${cardBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeStyles}`}>
                      {phase.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                  </div>

                  <div className="text-[11px] text-blue-400 font-semibold mb-1">
                    {phase.timeframe}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {phase.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{phase.visualMetric}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Phase Deep Dive Spotlight */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>Deep Dive: {phases[selectedPhase].timeframe}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {phases[selectedPhase].title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {phases[selectedPhase].description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {phases[selectedPhase].milestones.map((milestone, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800 p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Impact Vector</div>
                <div className="text-xl font-bold text-white mt-1">Autonomous Society Logistics</div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Transforming high-rise residential complexes into zero-friction, automated delivery hubs.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="#pilot"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  <span>Apply For Society Pilot</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureVision;

