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
  UserCheck, 
  CheckCircle2, 
  Fingerprint,
  QrCode
} from 'lucide-react';

interface JourneyStep {
  stepNumber: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  actor: string;
  timestamp: string;
  hashProof: string;
  description: string;
  securityPillar: string;
  auditDetail: string;
}

export const SecuritySection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const journeySteps: JourneyStep[] = [
    {
      stepNumber: '01',
      name: 'Parcel Received at Gate Hub',
      shortName: 'Received',
      icon: <Warehouse className="w-5 h-5" />,
      actor: 'Courier Driver & Gate Security Officer',
      timestamp: '11:24:08 AM',
      hashProof: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f',
      description: 'Carrier presents package at society perimeter gate hub. Guard verifies basic exterior condition before taking custody.',
      securityPillar: 'Physical Perimeter Defense',
      auditDetail: 'Delivery vehicle entry timestamped, carrier badge recorded.'
    },
    {
      stepNumber: '02',
      name: 'Barcode & Tracking Scanned',
      shortName: 'Scanned',
      icon: <Scan className="w-5 h-5" />,
      actor: 'ParcelFlow OCR Optical Terminal',
      timestamp: '11:24:19 AM (11s intake)',
      hashProof: 'SHA256: 9e107d9d372bb6826bd81d3542a419d6d84a7e8a',
      description: 'High-speed handheld scanner captures tracking barcode, carrier brand, and parses destination flat number (e.g. Tower C-1402).',
      securityPillar: 'Optical Ingestion & Parse',
      auditDetail: 'Zero manual transcription errors; matched with verified resident registry.'
    },
    {
      stepNumber: '03',
      name: 'Stored in Temperature Hub Bay',
      shortName: 'Stored',
      icon: <Lock className="w-5 h-5" />,
      actor: 'Automated Hub Storage System',
      timestamp: '11:25:02 AM',
      hashProof: 'SHA256: 4b227777d4dd1fc61c6f884f48641d02b4d121d3',
      description: 'Package placed in dedicated partitioned shelf Bay C-14 under 24/7 CCTV surveillance coverage and climate control.',
      securityPillar: 'Tamper-Evident Storage',
      auditDetail: 'Bay sensor validates weight match and logs bin lock event.'
    },
    {
      stepNumber: '04',
      name: 'Resident Schedules Window',
      shortName: 'Scheduled',
      icon: <CalendarClock className="w-5 h-5" />,
      actor: 'Verified Resident App (Tower C-1402)',
      timestamp: '01:15:44 PM',
      hashProof: 'SHA256: ef2d127de37b942baad06145e54b0c619a1f2232',
      description: 'Resident receives encrypted push notification, reviews sender details, and reserves convenient evening collection window (8:00 PM).',
      securityPillar: 'Zero Unsolicited Intercoms',
      auditDetail: 'Schedule timestamp logged; dynamic single-use collection token generated.'
    },
    {
      stepNumber: '05',
      name: 'Encrypted QR & OTP Verification',
      shortName: 'Verified',
      icon: <KeyRound className="w-5 h-5" />,
      actor: 'Handover Terminal & Resident Device',
      timestamp: '08:04:12 PM',
      hashProof: 'SHA256: 8c6976e5b5410415bde908bd4dee15dfb167a9c8',
      description: 'Resident arrives at hub and presents dynamic QR or 4-digit OTP. Token validates identity in < 250 milliseconds.',
      securityPillar: 'Cryptographic Authentication',
      auditDetail: 'OTP expires after 1 successful verification; prevents replay attacks.'
    },
    {
      stepNumber: '06',
      name: 'Safe Tamper-Evident Handover',
      shortName: 'Handed Over',
      icon: <PackageCheck className="w-5 h-5" />,
      actor: 'Resident & Hub Security Supervisor',
      timestamp: '08:04:32 PM (Completed)',
      hashProof: 'SHA256: 2c624232cdd221771294dfbb310aca000a0df6ac',
      description: 'Package is handed to resident with physical visual check. Immediate digital receipt sent via app and society ledger archived.',
      securityPillar: 'Irrevocable Proof-of-Collection',
      auditDetail: '100% closed-loop chain of custody; zero chance of lost parcel disputes.'
    }
  ];

  const currentStep = journeySteps[activeStepIndex];

  return (
    <section id="security" className="relative py-24 sm:py-32 bg-slate-900 text-white overflow-hidden border-t border-slate-800">
      {/* Radial lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank-Grade Chain of Custody</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Secure by design. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Verified at every single millisecond.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            From the moment the courier hands a package to society security until you scan your one-time code, every transaction is cryptographically logged.
          </p>
        </div>

        {/* 6-Step Recorded Parcel Journey Interactive Bar */}
        <div className="mb-12">
          {/* Progress Timeline Header */}
          <div className="hidden lg:grid grid-cols-6 gap-3 relative mb-6">
            {/* Connecting Progress Line */}
            <div className="absolute top-1/2 left-[8%] right-[8%] -translate-y-1/2 h-[3px] bg-slate-800 z-0">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${(activeStepIndex / (journeySteps.length - 1)) * 100}%` }}
              />
            </div>

            {journeySteps.map((step, idx) => {
              const isPassed = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`relative z-10 flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                    isCurrent 
                      ? 'bg-slate-800/90 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)]' 
                      : 'hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isPassed && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : step.stepNumber}
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                    {step.shortName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Step Scroller */}
          <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {journeySteps.map((step, idx) => (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 border ${
                  activeStepIndex === idx
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span>{step.stepNumber}</span>
                <span>{step.shortName}</span>
              </button>
            ))}
          </div>

          {/* Detailed Inspector Card for Selected Step */}
          <div className="rounded-3xl bg-slate-950/90 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  {currentStep.icon}
                </div>
                <div>
                  <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">
                    Step {currentStep.stepNumber} of 06
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentStep.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {currentStep.securityPillar}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  {currentStep.timestamp}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-base text-slate-300 leading-relaxed">
                  {currentStep.description}
                </p>

                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    <span>Verified Operating Actor</span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {currentStep.actor}
                  </div>
                  <div className="text-xs text-slate-400 pt-1">
                    {currentStep.auditDetail}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Fingerprint className="w-4 h-4" />
                    IMMUTABLE AUDIT PROOF
                  </span>
                  <span className="text-emerald-400">STATUS: SEALED</span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Cryptographic Transaction Hash:</div>
                  <div className="text-blue-300 break-all text-[11px] mt-1 bg-slate-950 p-2 rounded border border-slate-800">
                    {currentStep.hashProof}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 pt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Validated by decentralized society hub ledger</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Security Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800/80 p-6 hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">QR & OTP Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No parcel leaves the hub without cryptographic two-factor validation. Either scan the dynamic in-app QR code or verify your 4-digit token.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 border border-slate-800/80 p-6 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Staff Access Control</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Security personnel log in with authorized biometric or PIN credentials. Hub lockers and shelf zones maintain strict role-based access.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 border border-slate-800/80 p-6 hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Complete Audit Logging</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every action from intake, relocation, notification, to resident collection is indelibly recorded with millisecond timestamps and actor IDs.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 border border-slate-800/80 p-6 hover:border-purple-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Tamper-Evident Handover</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Both resident and security officer confirm parcel state. Immediate digital receipts protect against lost, swapped, or damaged package disputes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;

