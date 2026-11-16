import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Bell, 
  MapPin, 
  Building2, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Calendar,
  RotateCcw,
  ChevronRight,
  Truck
} from 'lucide-react';

export const Hero: React.FC = () => {
  // Interactive simulator state for the hero product visual
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<string>('8:00 PM – 8:30 PM');
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const availableSlots = [
    '6:30 PM – 7:00 PM',
    '7:15 PM – 7:45 PM',
    '8:00 PM – 8:30 PM',
    '9:00 PM – 9:30 PM'
  ];

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Step cycle simulation
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 4;
        if (next === 2) {
          setIsScheduled(false);
        } else if (next === 3) {
          setIsScheduled(true);
        }
        return next;
      });
    }, 3800);

    return () => clearInterval(timer);
  }, [isAutoPlaying, prefersReducedMotion]);

  const handleManualSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setIsScheduled(true);
    setActiveStep(3);
    setIsAutoPlaying(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsScheduled(false);
    setIsAutoPlaying(true);
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-32 bg-[#0B0F19] text-white">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/25 rounded-full blur-[128px]" />
        <div className="absolute top-24 right-1/4 w-[480px] h-[480px] bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-48 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[110px]" />
      </div>

      {/* Subtle particle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Call To Action */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left z-10">
            {/* Gradient Community Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/20 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                Built for modern apartment communities
              </span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Your parcel.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Your time.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              ParcelFlow gives apartment residents control over when they receive their parcels — securely, conveniently, and without waiting around for the delivery guy.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="/download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
              >
                <span>Download App</span>
                <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-base border border-slate-700/60 backdrop-blur-md transition-all duration-200 hover:border-slate-600"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Social proof & Trust markers */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero gate congestion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>QR & OTP Verified Handover</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Gate-2-Door convenience</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Animated Interactive Product Visual */}
          <div className="lg:col-span-6 relative">
            
            {/* Visual Container Card */}
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 p-5 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
              
              {/* Card top toolbar with status & interactive control */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-slate-200 tracking-wide uppercase text-[11px]">
                    Live Simulation
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    {isAutoPlaying ? 'Pause Demo' : 'Resume Auto'}
                  </button>
                  <button
                    onClick={handleReset}
                    title="Reset simulation"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step Flow Indicators */}
              <div className="grid grid-cols-4 gap-2 my-4">
                {[
                  { step: 0, label: '1. Courier Entry' },
                  { step: 1, label: '2. Hub Check-in' },
                  { step: 2, label: '3. Choose Slot' },
                  { step: 3, label: '4. Confirmed' },
                ].map((item) => (
                  <button
                    key={item.step}
                    onClick={() => {
                      setActiveStep(item.step);
                      setIsAutoPlaying(false);
                      if (item.step === 3) setIsScheduled(true);
                      if (item.step < 3) setIsScheduled(false);
                    }}
                    className={`py-1.5 px-2 text-[11px] font-medium rounded-lg text-center transition-all ${
                      activeStep === item.step
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-300 border border-transparent'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Animated Map / Gate Scene (SVG + CSS) */}
              <div className="relative h-44 sm:h-52 w-full rounded-2xl bg-slate-950/80 border border-slate-800/80 p-4 overflow-hidden flex flex-col justify-between">
                
                {/* SVG Route Journey */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#6366F1" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>

                  {/* Background route path */}
                  <path
                    d="M 40 85 C 130 85, 170 35, 260 40 C 330 45, 370 110, 480 110"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                  />

                  {/* Active animated route path */}
                  <path
                    d="M 40 85 C 130 85, 170 35, 260 40 C 330 45, 370 110, 480 110"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    strokeDasharray="500"
                    strokeDashoffset={
                      activeStep === 0 ? '360' :
                      activeStep === 1 ? '200' :
                      activeStep === 2 ? '60' : '0'
                    }
                  />
                </svg>

                {/* Society Gate Node (Start) */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg">
                    <Truck className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Main Gate</div>
                      <div className="text-xs font-semibold text-slate-200">Courier Arrival</div>
                    </div>
                  </div>

                  {/* Parcel Hub Node (Midpoint) */}
                  <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl shadow-lg transition-all duration-300 ${
                    activeStep >= 1 
                      ? 'bg-indigo-950/70 border-indigo-500/50 text-indigo-200' 
                      : 'bg-slate-900/90 border-slate-800 text-slate-400'
                  }`}>
                    <Building2 className={`w-4 h-4 ${activeStep >= 1 ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Tower Hub</div>
                      <div className="text-xs font-semibold text-white">ParcelFlow Safe Hub</div>
                    </div>
                  </div>

                  {/* Resident Handover Node (End) */}
                  <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl shadow-lg transition-all duration-300 ${
                    activeStep >= 3 
                      ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200' 
                      : 'bg-slate-900/90 border-slate-800 text-slate-400'
                  }`}>
                    <MapPin className={`w-4 h-4 ${activeStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Resident Handover</div>
                      <div className="text-xs font-semibold text-white">Tower B • #704</div>
                    </div>
                  </div>
                </div>

                {/* Animated Moving Package representation */}
                <div 
                  className="relative z-20 transition-all duration-1000 ease-out flex items-center gap-2"
                  style={{
                    transform: `translate(${
                      activeStep === 0 ? '15%' :
                      activeStep === 1 ? '48%' :
                      activeStep === 2 ? '68%' : '88%'
                    }, 0)`
                  }}
                >
                  <div className="relative group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 shadow-lg shadow-amber-500/30 flex items-center justify-center text-slate-950 border border-amber-200/50">
                      <Package className="w-5 h-5 animate-bounce" />
                    </div>
                    {/* Ripple ring around active package */}
                    <span className="absolute -inset-1 rounded-xl bg-amber-400/30 animate-ping -z-10" />
                  </div>
                </div>

                {/* Scene Bottom details */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/40 px-3 py-1 rounded-lg backdrop-blur-sm border border-slate-800/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Tracking ID: <span className="text-slate-200 font-mono">PF-8921-IN</span></span>
                  </div>
                  <span className="text-emerald-400 font-medium">Logged in Society Registry</span>
                </div>
              </div>

              {/* Interactive Phone Notification & Slot Selector UI */}
              <div className="mt-5 space-y-3">
                {/* Notification Pop Card */}
                <div className={`p-3.5 rounded-2xl border transition-all duration-500 ${
                  activeStep >= 1
                    ? 'bg-slate-900/95 border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800/50 opacity-60'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex-shrink-0">
                      <Bell className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span>📦 Parcel Received at Society Hub</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-normal">Just now</span>
                        </h4>
                        <span className="text-[11px] text-slate-400">ParcelFlow App</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Amazon Package (Tower B Safe Storage). Select your preferred delivery or pickup window:
                      </p>
                    </div>
                  </div>

                  {/* Interactive Time Slot Grid */}
                  <div className="mt-3 pt-3 border-t border-slate-800/70">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-400" /> Choose Pickup Window:
                      </span>
                      <span className="text-[11px] text-indigo-400">Interactive</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => handleManualSlotSelect(slot)}
                            className={`px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold ring-2 ring-blue-400/40 shadow-md'
                                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                            }`}
                          >
                            <span>{slot.split(' – ')[0]}</span>
                            <span className="text-[10px] opacity-75">to {slot.split(' – ')[1]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Scheduled Status Bar */}
                <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  isScheduled || activeStep === 3
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center gap-2.5 text-xs font-medium">
                    {isScheduled || activeStep === 3 ? (
                      <>
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-white font-semibold">Scheduled for {selectedSlot}</span>
                          <span className="text-[11px] text-emerald-300 block">Passcode & OTP Ready for Handover</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <span>Awaiting resident time slot selection...</span>
                      </>
                    )}
                  </div>

                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                    isScheduled || activeStep === 3
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isScheduled || activeStep === 3 ? 'Scheduled ✓' : 'Pending Choice'}
                  </span>
                </div>
              </div>

            </div>

            {/* Floating Satellite Cards around Visual */}
            <div className="hidden sm:flex absolute -top-4 -right-4 bg-slate-900/95 border border-slate-700/70 rounded-2xl p-3 shadow-xl backdrop-blur-md items-center gap-2.5 z-20 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-white">Zero Missed Deliveries</div>
                <div className="text-[10px] text-slate-400">Guaranteed secure hold</div>
              </div>
            </div>

            <div className="hidden sm:flex absolute -bottom-5 -left-4 bg-slate-900/95 border border-slate-700/70 rounded-2xl p-3 shadow-xl backdrop-blur-md items-center gap-2.5 z-20">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-white">Instant App Notification</div>
                <div className="text-[10px] text-slate-400">No unexpected gate calls</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
