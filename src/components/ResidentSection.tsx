import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Dumbbell, 
  Plane, 
  Users, 
  Moon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Calendar,
  ShieldCheck
} from 'lucide-react';

interface LifestyleMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  residentStory: string;
  oldChaos: string;
  parcelflowFix: string;
  scheduledTime: string;
  statusBadge: string;
  timelineBlocks: {
    time: string;
    activity: string;
    parcelStatus: 'waiting' | 'safe' | 'pickup' | 'interrupted';
    note: string;
  }[];
}

export const ResidentSection: React.FC = () => {
  const [activeModeId, setActiveModeId] = useState<string>('work');

  const lifestyleModes: LifestyleMode[] = [
    {
      id: 'work',
      name: 'Work & Office',
      icon: <Briefcase className="w-5 h-5" />,
      tagline: 'Important client presentations & deep work',
      residentStory: 'Ananya is presenting the quarterly revenue report to executives when the delivery driver starts spam-calling her phone.',
      oldChaos: '4 missed calls from courier, phone buzzing loudly on the presentation screen, delivery guy leaves parcel in random corridor or returns it.',
      parcelflowFix: 'Courier safely drops parcel at Society Gate Hub at 1:15 PM. Ananya gets a silent confirmation and schedules pickup for 7:45 PM after work.',
      scheduledTime: '7:45 PM – 8:15 PM',
      statusBadge: 'Zero Work Interruptions',
      timelineBlocks: [
        { time: '10:00 AM', activity: 'Quarterly Planning Sprint', parcelStatus: 'waiting', note: 'Phone silent & undisturbed' },
        { time: '01:15 PM', activity: 'Delivery arrives at gate', parcelStatus: 'safe', note: 'Safely verified & shelved in Hub' },
        { time: '04:30 PM', activity: 'Executive Presentation', parcelStatus: 'safe', note: 'Zero courier phone calls' },
        { time: '07:45 PM', activity: 'Walking back from car park', parcelStatus: 'pickup', note: 'Quick 20s QR scan & parcel in hand' }
      ]
    },
    {
      id: 'college',
      name: 'College & Classes',
      icon: <GraduationCap className="w-5 h-5" />,
      tagline: 'Lectures, labs & campus study groups',
      residentStory: 'Rohan is inside the engineering lab where phones aren\'t allowed. Couriers expect him to rush back to his society gate within 5 minutes.',
      oldChaos: 'Driver cancels delivery: "Customer not answering phone, marked as delivery attempted". Rohan has to wait 3 extra days.',
      parcelflowFix: 'Society Hub receives the study books automatically. Rohan checks his app between classes and reserves an 8:30 PM collection.',
      scheduledTime: '8:30 PM – 9:00 PM',
      statusBadge: 'Zero Missed Deliveries',
      timelineBlocks: [
        { time: '09:00 AM', activity: 'Data Structures Lab Exam', parcelStatus: 'waiting', note: 'Mobile locked in locker' },
        { time: '11:45 AM', activity: 'Courier arrives at Society Gate', parcelStatus: 'safe', note: 'Guard logs tracking code in 10s' },
        { time: '03:30 PM', activity: 'Library Study Session', parcelStatus: 'safe', note: 'Push notification: Ready at Hub B' },
        { time: '08:30 PM', activity: 'Returning from Campus', parcelStatus: 'pickup', note: 'Instant OTP handover at Gate Hub' }
      ]
    },
    {
      id: 'gym',
      name: 'Gym & Fitness',
      icon: <Dumbbell className="w-5 h-5" />,
      tagline: 'Workouts, runs & personal wellness time',
      residentStory: 'Vikram is midway through his bench press sets when the courier shouts into the intercom asking him to come down immediately.',
      oldChaos: 'Ruined workout flow, rushing down in gym clothes only to find the courier left for the next block already.',
      parcelflowFix: 'Complete your workout in peace. Your parcel stays safe in the temperature-controlled hub until your evening cooldown.',
      scheduledTime: '7:15 PM – 7:45 PM',
      statusBadge: 'Workout Uninterrupted',
      timelineBlocks: [
        { time: '06:00 PM', activity: 'Cardio & Strength Training', parcelStatus: 'waiting', note: 'Headphones on, zero distractions' },
        { time: '06:30 PM', activity: 'Courier drops at ParcelFlow Hub', parcelStatus: 'safe', note: 'Logged with guard barcode reader' },
        { time: '07:05 PM', activity: 'Post-workout stretch & shower', parcelStatus: 'safe', note: 'Parcel waiting securely' },
        { time: '07:15 PM', activity: 'Evening stroll past Clubhouse', parcelStatus: 'pickup', note: 'Picked up without breaking sweat' }
      ]
    },
    {
      id: 'travel',
      name: 'Travel & Commute',
      icon: <Plane className="w-5 h-5" />,
      tagline: 'Out-of-town trips, flights & traffic delays',
      residentStory: 'Pooja is stuck in evening peak traffic on the Outer Ring Road. Delivery guy says: "Madam, I will leave your package outside your flat door".',
      oldChaos: 'High anxiety over stolen parcels in open apartment hallways, packages exposed to rain or curious pets.',
      parcelflowFix: 'ParcelFlow holds the parcel securely in the society vault for up to 48 hours. Collect whenever you comfortably reach home.',
      scheduledTime: '9:30 PM – 10:00 PM',
      statusBadge: 'Guaranteed Hallway Safety',
      timelineBlocks: [
        { time: '02:00 PM', activity: 'Client meeting in neighboring city', parcelStatus: 'waiting', note: 'Out of town' },
        { time: '04:15 PM', activity: 'Courier check-in at Society', parcelStatus: 'safe', note: 'Encrypted shelf storage bay' },
        { time: '07:30 PM', activity: 'Airport highway traffic delay', parcelStatus: 'safe', note: 'Zero panic, package is secured' },
        { time: '09:30 PM', activity: 'Arrived at society main gate', parcelStatus: 'pickup', note: 'Collected on the drive in' }
      ]
    },
    {
      id: 'family',
      name: 'Family & Home',
      icon: <Users className="w-5 h-5" />,
      tagline: 'Dinner time, bedtime routines & quiet evenings',
      residentStory: 'The Sharma family is putting their toddler to sleep when the doorbell repeatedly chimes and intercom buzzes.',
      oldChaos: 'Dog barks, baby wakes up crying, chaotic rush to answer the courier before he drives off to another sector.',
      parcelflowFix: 'Strict "Quiet Gate" policy. No random doorbells during dinner or bedtime. Pick up your packages together during your night walk.',
      scheduledTime: '8:45 PM – 9:15 PM',
      statusBadge: 'Peaceful Home Sanctuary',
      timelineBlocks: [
        { time: '01:00 PM', activity: 'Daily deliveries arrive', parcelStatus: 'safe', note: 'Centralized at Gate Hub 1' },
        { time: '07:30 PM', activity: 'Family Dinner', parcelStatus: 'safe', note: 'Zero doorbell disturbances' },
        { time: '08:15 PM', activity: 'Kids Bedtime Stories', parcelStatus: 'safe', note: 'No loud buzzer interruptions' },
        { time: '08:45 PM', activity: 'Post-dinner family stroll', parcelStatus: 'pickup', note: 'Smooth pickup in under 30 seconds' }
      ]
    },
    {
      id: 'evening',
      name: 'Evening Leisure',
      icon: <Moon className="w-5 h-5" />,
      tagline: 'Dog walks, clubhouse chats & relaxed pickups',
      residentStory: 'Rahul enjoys an evening walk around the society gardens. Collecting his Amazon and Myntra packages is part of his pleasant routine.',
      oldChaos: 'Juggling 3 different courier calls at 11:20 AM, 2:10 PM, and 4:45 PM throughout a chaotic Saturday.',
      parcelflowFix: 'All 3 deliveries consolidated in one clean notification. Collect all boxes in one single tap and OTP verification.',
      scheduledTime: '8:15 PM – 8:45 PM',
      statusBadge: 'One-Stop Consolidated Pickup',
      timelineBlocks: [
        { time: '11:30 AM', activity: 'Package 1 (Amazon) arrived', parcelStatus: 'safe', note: 'Auto-bundled under Flat 402' },
        { time: '02:45 PM', activity: 'Package 2 (Myntra) arrived', parcelStatus: 'safe', note: 'Auto-bundled under Flat 402' },
        { time: '05:10 PM', activity: 'Package 3 (Flipkart) arrived', parcelStatus: 'safe', note: 'Single multi-box collection code' },
        { time: '08:15 PM', activity: 'Evening Dog Walk', parcelStatus: 'pickup', note: 'All 3 items handed over in 1 scan' }
      ]
    }
  ];

  const currentMode = lifestyleModes.find(m => m.id === activeModeId) || lifestyleModes[0];

  return (
    <section id="for-residents" className="relative py-24 sm:py-32 bg-slate-900/60 text-white overflow-hidden border-t border-slate-800/80">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>Resident Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Stop planning your day <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              around a courier delivery.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Your life shouldn't revolve around waiting for a courier. ParcelFlow lets you choose when your parcel fits into your day — not the other way around.
          </p>
        </div>

        {/* Lifestyle Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {lifestyleModes.map((mode) => {
            const isSelected = mode.id === activeModeId;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveModeId(mode.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.35)]'
                    : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-slate-400'}>{mode.icon}</span>
                <span>{mode.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Scenario Interactive Visualizer */}
        <div className="rounded-3xl bg-slate-950/90 border border-slate-800/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                {currentMode.icon}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{currentMode.name}</h3>
                <p className="text-xs text-slate-400">{currentMode.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{currentMode.statusBadge}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 font-mono">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Slot: {currentMode.scheduledTime}</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Comparison & Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
            {/* Left Column: Reality vs ParcelFlow comparison */}
            <div className="lg:col-span-5 space-y-5">
              {/* The Old Way */}
              <div className="rounded-2xl bg-rose-950/20 border border-rose-900/30 p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>The Old Frustrating Way</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentMode.oldChaos}
                </p>
              </div>

              {/* The ParcelFlow Way */}
              <div className="rounded-2xl bg-blue-950/25 border border-blue-800/40 p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>With ParcelFlow</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {currentMode.parcelflowFix}
                </p>
                <div className="mt-4 pt-3 border-t border-blue-900/40 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Scheduled Handover Window:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    {currentMode.scheduledTime}
                  </span>
                </div>
              </div>

              {/* Story Quote */}
              <div className="text-xs text-slate-400 italic bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                "{currentMode.residentStory}"
              </div>
            </div>

            {/* Right Column: Dynamic Day Schedule Flow */}
            <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 sm:p-7">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Simulated Resident Daily Timeline</span>
                </h4>
                <span className="text-xs text-emerald-400 font-mono">Synced to ParcelFlow Hub</span>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-emerald-500">
                {currentMode.timelineBlocks.map((block, idx) => {
                  let badgeStyles = 'bg-slate-800 text-slate-300 border-slate-700';
                  if (block.parcelStatus === 'safe') badgeStyles = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                  if (block.parcelStatus === 'pickup') badgeStyles = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse';

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center ${
                        block.parcelStatus === 'pickup' 
                          ? 'bg-emerald-400 ring-4 ring-emerald-500/20' 
                          : block.parcelStatus === 'safe'
                          ? 'bg-blue-400 ring-4 ring-blue-500/20'
                          : 'bg-slate-700'
                      }`} />

                      <div className="rounded-xl bg-slate-950/80 border border-slate-800/90 p-3.5 hover:border-slate-700 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-blue-400">{block.time}</span>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeStyles}`}>
                            {block.parcelStatus === 'pickup' ? 'Ready for Pickup' : block.parcelStatus === 'safe' ? 'Safely Stored' : 'Normal Schedule'}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-white">{block.activity}</div>
                        <div className="text-xs text-slate-400 mt-1">{block.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Callout */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Held securely in society lockers until verified
                </span>
                <span className="font-medium text-blue-400">ParcelFlow Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResidentSection;

