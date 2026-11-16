import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Clock, 
  Briefcase, 
  Car, 
  GraduationCap, 
  MapPinOff, 
  PhoneMissed, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  AlertTriangle,
  XCircle,
  Package
} from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const [activeTimeIndex, setActiveTimeIndex] = useState<number>(0);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);
  const [isChaoticView, setIsChaoticView] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const unpredictableTimes = [
    { time: '9:00 AM', context: 'During your standup meeting' },
    { time: '2:30 PM', context: 'While you are deep in focus' },
    { time: '6:45 PM', context: 'Stuck in bumper-to-bumper traffic' },
    { time: '8:17 PM', context: 'When you stepped out for dinner' },
  ];

  const scenarios = [
    {
      title: "You're at work.",
      tag: "Office Hours",
      icon: Briefcase,
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      quote: "Sir, parcel leke aaya hu. Gate pe koi nahi hai, kiske paas chhodu?",
      painPoint: "Trapped in a client presentation while your phone buzzes incessantly with an unknown courier number.",
      stat: "68% of delivery calls occur during core work hours."
    },
    {
      title: "You're in traffic.",
      tag: "Daily Commute",
      icon: Car,
      color: "from-amber-500/20 to-amber-600/10",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
      quote: "Sir, main 2 minute wait kar sakta hu, fir wapas le jaunga.",
      painPoint: "Stuck 45 minutes away on the flyover, powerless to receive an urgent order you've been tracking for days.",
      stat: "Average commute delay leaves zero margin for courier windows."
    },
    {
      title: "You're in class.",
      tag: "University / Study",
      icon: GraduationCap,
      color: "from-indigo-500/20 to-indigo-600/10",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      quote: "Resident not reachable. Delivery attempted and rescheduled.",
      painPoint: "Phone on silent during a lecture or lab exam. You step out to 3 missed calls and a 'Failed Delivery' SMS.",
      stat: "42% of first-attempt apartment deliveries fail on first try."
    },
    {
      title: "You're nowhere near home.",
      tag: "Errands & Travel",
      icon: MapPinOff,
      color: "from-rose-500/20 to-rose-600/10",
      borderColor: "border-rose-500/30",
      iconColor: "text-rose-400",
      quote: "Bahar fek ke jaa raha hu door pe.",
      painPoint: "Left unattended outside your door or dumped in an overflowing security guard cabin with no accountability.",
      stat: "Over 80% of gate guards complain of unmanaged parcel dumping."
    }
  ];

  // Prefers reduced motion check
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Time roulette animation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveTimeIndex((prev) => (prev + 1) % unpredictableTimes.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [unpredictableTimes.length, prefersReducedMotion]);

  return (
    <section className="relative py-20 lg:py-32 bg-[#0B0F19] text-white border-t border-slate-800/80 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 pointer-events-none opacity-20">
        <div className="absolute left-1/4 top-0 w-80 h-80 bg-rose-600/30 rounded-full blur-[130px]" />
        <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Daily Apartment Dilemma</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            We've all seen this message.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal">
            Every courier app promises your package is arriving today. Yet none of them tell you the only detail that actually matters.
          </p>
        </div>

        {/* Big Simulated Delivery Notification */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/70 p-6 sm:p-8 shadow-2xl shadow-rose-950/20 backdrop-blur-xl overflow-hidden">
            
            {/* Top notification header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Express Courier</span>
                    <span className="text-[10px] text-slate-400">• Just now</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Tracking #IN-9402-EXP</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1.5">
                <BellRing className="w-3 h-3 animate-ping" />
                Out For Delivery
              </span>
            </div>

            {/* Notification Core Content */}
            <div className="py-6 space-y-4">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                "Your parcel is arriving today."
              </div>

              {/* The "But... when?" Animated Time Shifter */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">The Big Question</div>
                    <div className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <span>But... when?</span>
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Animated changing time pill */}
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-inner">
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-mono font-bold text-amber-400 transition-all duration-300">
                      {unpredictableTimes[activeTimeIndex].time}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {unpredictableTimes[activeTimeIndex].context}
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated missed calls callout */}
              <div className="flex items-center gap-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl">
                <PhoneMissed className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>3 missed calls from Delivery Associate while you were away from your desk.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Resident Real-World Scenarios Grid */}
        <div className="mt-16 sm:mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Because life happens when couriers ring.
            </h3>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Deliveries don't check your calendar. You're left scrambling to coordinate handovers in the middle of your day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scenarios.map((sc, idx) => {
              const Icon = sc.icon;
              const isSelected = activeScenarioIndex === idx;

              return (
                <div
                  key={sc.title}
                  onClick={() => setActiveScenarioIndex(idx)}
                  className={`group relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${
                    isSelected 
                      ? `${sc.borderColor} shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/30` 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sc.color} border ${sc.borderColor} flex items-center justify-center ${sc.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2.5 py-1 rounded-full bg-slate-800/80">
                        {sc.tag}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {sc.title}
                    </h4>

                    {/* Delivery phone dialogue quote */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 text-xs italic text-slate-300 font-mono">
                      "{sc.quote}"
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {sc.painPoint}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{sc.stat}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transition: "What if you could choose?" */}
        <div className="mt-20 sm:mt-28">
          <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            
            {/* Header of transition */}
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                The ParcelFlow Shift
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                What if you could choose?
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                Instead of being held hostage by random delivery arrival times, turn unpredictable chaos into a smooth, scheduled handover.
              </p>
            </div>

            {/* Toggle view button */}
            <div className="flex justify-center mt-6">
              <div className="inline-flex rounded-xl p-1 bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setIsChaoticView(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                    isChaoticView 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Without ParcelFlow (Chaos)
                </button>
                <button
                  onClick={() => setIsChaoticView(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                    !isChaoticView 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  With ParcelFlow (Calm)
                </button>
              </div>
            </div>

            {/* Visual Route comparison container */}
            <div className="mt-8 max-w-4xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8">
              
              {!isChaoticView ? (
                /* The ParcelFlow Way: Clean, sleek, organized route line */
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Organized & Scheduled Journey
                    </span>
                    <span className="font-mono text-slate-400">Status: In Control</span>
                  </div>

                  {/* SVG Clean Direct Path */}
                  <div className="relative py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                      
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center">
                        <div className="text-[10px] uppercase font-bold text-blue-400">Step 1 • Gate Arrival</div>
                        <div className="text-sm font-bold text-white mt-1">Logged Safely</div>
                        <div className="text-[11px] text-slate-400 mt-1">No missed calls or rushes</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center">
                        <div className="text-[10px] uppercase font-bold text-indigo-400">Step 2 • Tower Hub</div>
                        <div className="text-sm font-bold text-white mt-1">Secured in Storage</div>
                        <div className="text-[11px] text-slate-400 mt-1">Verified check-in</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/60 shadow-lg shadow-blue-500/10 text-center">
                        <div className="text-[10px] uppercase font-bold text-emerald-400">Step 3 • You Choose</div>
                        <div className="text-sm font-bold text-white mt-1">8:00 PM – 8:30 PM</div>
                        <div className="text-[11px] text-slate-300 mt-1">When you are actually home</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center">
                        <div className="text-[10px] uppercase font-bold text-emerald-400">Step 4 • Safe Handover</div>
                        <div className="text-sm font-bold text-emerald-200 mt-1">QR / OTP Verified</div>
                        <div className="text-[11px] text-emerald-400/80 mt-1">Zero hassle. Done.</div>
                      </div>

                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 flex items-center justify-between">
                    <span>Your schedule dictates the delivery, never the other way around.</span>
                    <a href="/download" className="font-semibold text-white hover:text-blue-300 flex items-center gap-1">
                      <span>Get started</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Chaotic View: Tangled dotted path, stress, missed calls */
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                    <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Chaotic Tangled Routine
                    </span>
                    <span className="font-mono text-rose-400">Status: Constant Stress</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center">
                      <div className="text-[10px] uppercase font-bold text-rose-400">Random Time</div>
                      <div className="text-sm font-bold text-white mt-1">11:15 AM Ring</div>
                      <div className="text-[11px] text-rose-300 mt-1">"Bhaiya gate pe hu"</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center">
                      <div className="text-[10px] uppercase font-bold text-rose-400">Panic & Commute</div>
                      <div className="text-sm font-bold text-white mt-1">3 Missed Calls</div>
                      <div className="text-[11px] text-rose-300 mt-1">Trapped in meeting/traffic</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center">
                      <div className="text-[10px] uppercase font-bold text-rose-400">Unsafe Dump</div>
                      <div className="text-sm font-bold text-white mt-1">Left Outside Door</div>
                      <div className="text-[11px] text-rose-300 mt-1">Risk of theft or damage</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center">
                      <div className="text-[10px] uppercase font-bold text-rose-400">Failed Handover</div>
                      <div className="text-sm font-bold text-white mt-1">Return to Hub</div>
                      <div className="text-[11px] text-rose-300 mt-1">Wait another 48 hours</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center justify-between">
                    <span>This broken workflow costs apartment communities hours of friction every day.</span>
                    <button 
                      onClick={() => setIsChaoticView(false)}
                      className="font-semibold text-emerald-400 hover:underline"
                    >
                      Switch to ParcelFlow solution →
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
