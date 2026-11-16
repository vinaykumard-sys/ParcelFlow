import React, { useState, useRef, type MouseEvent } from 'react';
import { 
  Package, 
  Clock, 
  ShieldCheck, 
  Bell, 
  Building2, 
  BarChart3, 
  ArrowUpRight, 
  CheckCircle2, 
  QrCode, 
  Sparkles,
  Check
} from 'lucide-react';

interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  description: string;
  metrics: string;
  interactivePreview: React.ReactNode;
}

// 3D Tilt Card Component
const TiltCard: React.FC<{
  feature: FeatureItem;
  isActive: boolean;
  onSelect: () => void;
}> = ({ feature, isActive, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glowPos, setGlowPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Percentage for glow
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setGlowPos({ x: xPercent, y: yPercent });

    // Calculate tilt angles (-8deg to 8deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className={`group relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between cursor-pointer overflow-hidden ${
        isActive 
          ? 'border-blue-500/80 shadow-[0_0_35px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/40' 
          : 'border-slate-800/80 hover:border-slate-700/90 shadow-xl'
      }`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(59, 130, 246, 0.18), transparent 70%)`
        }}
      />

      {/* Top Border Subtle Gradient Glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div>
        {/* Card Header: Icon & Badge */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-transform duration-300 shadow-inner">
            {feature.icon}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
              {feature.badge}
            </span>
            <div className="w-6 h-6 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-blue-500/50 transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Feature Title & Tagline */}
        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors mb-1.5 flex items-center gap-2">
          {feature.title}
        </h3>
        <p className="text-xs font-semibold text-blue-400/90 mb-3 tracking-wide">
          {feature.tagline}
        </p>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
          {feature.description}
        </p>
      </div>

      {/* Card Interactive Micro-Preview Visual */}
      <div className="mt-auto">
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3.5 group-hover:border-slate-700/70 transition-colors backdrop-blur-sm">
          {feature.interactivePreview}
        </div>

        {/* Bottom Metric Strip */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] text-slate-400">BENCHMARK</span>
          <span className="font-medium text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {feature.metrics}
          </span>
        </div>
      </div>
    </div>
  );
};

export const Features: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('8:00 PM');
  const [copiedOtp, setCopiedOtp] = useState<boolean>(false);

  const handleCopyOtp = () => {
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const featureItems: FeatureItem[] = [
    {
      id: 'visibility',
      icon: <Package className="w-6 h-6" />,
      badge: 'Visibility',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      title: 'Parcel Visibility',
      tagline: 'Instant society gate check-in',
      description: 'Know the second your delivery arrives at your society gate. Complete audit trail with tracking ID and carrier tags.',
      metrics: '100% Gate Logging',
      interactivePreview: (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400">ID: PF-8492-IN</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-medium">Logged at Gate</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/90 rounded-lg p-2 border border-slate-800">
            <div className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
              AMZ
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate">Electronics Box (1.2 kg)</div>
              <div className="text-[10px] text-slate-400">Arrived Gate 2 • 3:42 PM</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'timing',
      icon: <Clock className="w-6 h-6" />,
      badge: 'Control',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      title: 'Flexible Timing',
      tagline: 'Choose when it fits your schedule',
      description: 'Never worry about couriers calling while you are in a meeting. Select a verified pickup window that matches your day.',
      metrics: 'Zero Missed Handovers',
      interactivePreview: (
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Select Pickup Window:</span>
            <span className="text-indigo-400 font-semibold">{selectedTimeSlot}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {['6:30 PM', '8:00 PM', '9:15 PM'].map((time) => (
              <button
                key={time}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTimeSlot(time);
                }}
                className={`py-1 text-[11px] font-medium rounded border transition-all text-center ${
                  selectedTimeSlot === time
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'security',
      icon: <ShieldCheck className="w-6 h-6" />,
      badge: 'Tamper-Proof',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      title: 'Secure Handover',
      tagline: 'Cryptographic QR & OTP verification',
      description: 'Strict chain-of-custody protocols. Guard scans your dynamic one-time QR or verifies your 4-digit code before releasing.',
      metrics: '0 False Collections',
      interactivePreview: (
        <div className="flex items-center justify-between bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-white p-1 flex items-center justify-center">
              <QrCode className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-400 tracking-wider font-mono">One-Time OTP</div>
              <div className="text-sm font-mono font-bold text-emerald-400 tracking-widest">7492</div>
            </div>
          </div>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyOtp();
            }}
            className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
          >
            {copiedOtp ? 'Verified ✓' : 'Verify'}
          </button>
        </div>
      )
    },
    {
      id: 'notifications',
      icon: <Bell className="w-6 h-6" />,
      badge: 'Real-time',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      title: 'Instant Notifications',
      tagline: 'Intelligent multi-channel alerts',
      description: 'Get notified via App push, WhatsApp, or SMS the moment your parcel enters the society locker or hub shelf.',
      metrics: '< 1.2s Dispatch Speed',
      interactivePreview: (
        <div className="space-y-1.5 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-200">ParcelFlow Notification</span>
            </div>
            <span className="text-[10px] text-slate-500">Just now</span>
          </div>
          <div className="text-xs text-slate-300 line-clamp-1">
            "Your parcel is safe in Locker Bay B. Ready for pickup."
          </div>
        </div>
      )
    },
    {
      id: 'society-ready',
      icon: <Building2 className="w-6 h-6" />,
      badge: 'Community',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      title: 'Society Ready',
      tagline: 'Tailored for high-density gated societies',
      description: 'Flawlessly handles 200+ parcels a day. Eliminates gate chaos, reduces delivery truck jams, and protects guard sanity.',
      metrics: '78% Less Gate Chaos',
      interactivePreview: (
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400">Tower Integration</div>
            <div className="font-semibold text-cyan-300">Towers A - G</div>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <div className="text-[10px] text-slate-400">Guard Scan Time</div>
            <div className="font-semibold text-emerald-400">~ 9 Seconds</div>
          </div>
        </div>
      )
    },
    {
      id: 'management',
      icon: <BarChart3 className="w-6 h-6" />,
      badge: 'Operations',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      title: 'Smart Management',
      tagline: 'Centralized admin audit & analytics',
      description: 'Societies and RWA management gain 100% transparency. Live inventory logs, pickup analytics, and staff audit reports.',
      metrics: 'Zero Lost Parcels Record',
      interactivePreview: (
        <div className="space-y-2 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Daily Clearance Rate</span>
            <span className="font-semibold text-purple-300">96.4%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-[96.4%]" />
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-slate-950 text-white overflow-hidden">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Decorative Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Precision & Peace of Mind</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Designed for convenience. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
              Engineered for absolute security.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Every feature in ParcelFlow is tuned specifically for the realities of modern apartment communities — removing gate friction while giving residents total control.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featureItems.map((feature, idx) => (
            <TiltCard
              key={feature.id}
              feature={feature}
              isActive={selectedFeature === idx}
              onSelect={() => setSelectedFeature(idx)}
            />
          ))}
        </div>

        {/* Interactive Feature Deep Dive Highlight Banner */}
        <div className="mt-16 sm:mt-20 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/80 p-8 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" />
                <span>Zero Compromises on Privacy</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                No strangers roaming your apartment corridors.
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                By centralizing intake at your society's dedicated ParcelFlow Gate Hub, delivery personnel no longer require elevator access or corridor entry. Parcels rest safely in organized bays until you're ready to collect.
              </p>
            </div>
            
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-4.5 text-center">
                <div className="text-3xl sm:text-4xl font-black text-blue-400 font-mono mb-1">0</div>
                <div className="text-xs text-slate-300 font-medium">Unverified Gate Entries</div>
              </div>
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-4.5 text-center">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mb-1">100%</div>
                <div className="text-xs text-slate-300 font-medium">Verified Handover Proof</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

