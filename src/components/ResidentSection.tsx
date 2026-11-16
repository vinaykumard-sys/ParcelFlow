import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Dumbbell, 
  Plane, 
  Coffee, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  PhoneOff,
  Smile,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';

interface LifestyleScene {
  id: string;
  name: string;
  emoji: string;
  activityTitle: string;
  badge: string;
  badgeColor: string;
  color: string;
  scheduledTime: string;
  quote: string;
  residentName: string;
  role: string;
  whatTheyAreDoing: string;
  howParcelFlowHelps: string;
  illustration: React.ReactNode;
}

export const ResidentSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('working');

  const scenes: LifestyleScene[] = [
    {
      id: 'working',
      name: 'Working',
      emoji: '💼',
      activityTitle: 'Deep Focus & Client Meetings',
      badge: 'Zero Meeting Interruptions',
      badgeColor: 'bg-blue-300 text-[#0A1128]',
      color: 'bg-blue-50',
      scheduledTime: '7:45 PM – 8:15 PM',
      quote: '"I was presenting to our VP when the delivery guy used to call 5 times. Now, my phone is completely quiet."',
      residentName: 'Ananya S.',
      role: 'Product Lead • Tower B Flat 804',
      whatTheyAreDoing: 'Running design critiques and client quarterly reviews with colleagues.',
      howParcelFlowHelps: 'Courier silently hands parcel to Society Gate Hub. Ananya gets a silent ping and collects on her evening stroll after logging off.',
      illustration: (
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Desk & Chair */}
          <ellipse cx="160" cy="195" rx="120" ry="12" fill="#0A1128" opacity="0.1" />
          
          {/* Work Desk */}
          <rect x="40" y="130" width="240" height="14" rx="4" fill="#FDE047" stroke="#0A1128" strokeWidth="2.5" />
          <rect x="60" y="144" width="12" height="52" rx="2" fill="#CA8A04" stroke="#0A1128" strokeWidth="2.5" />
          <rect x="248" y="144" width="12" height="52" rx="2" fill="#CA8A04" stroke="#0A1128" strokeWidth="2.5" />

          {/* Plant on desk */}
          <rect x="230" y="105" width="22" height="25" rx="3" fill="#F472B6" stroke="#0A1128" strokeWidth="2" />
          <circle cx="236" cy="94" r="10" fill="#4ADE80" stroke="#0A1128" strokeWidth="2" />
          <circle cx="248" cy="90" r="12" fill="#22C55E" stroke="#0A1128" strokeWidth="2" />

          {/* Laptop */}
          <rect x="120" y="80" width="76" height="50" rx="4" fill="#93C5FD" stroke="#0A1128" strokeWidth="2.5" />
          <rect x="110" y="128" width="96" height="6" rx="2" fill="#CBD5E1" stroke="#0A1128" strokeWidth="2" />
          {/* Laptop chart */}
          <line x1="130" y1="110" x2="145" y2="98" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="145" y1="98" x2="160" y2="105" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="160" y1="105" x2="180" y2="90" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

          {/* Character: Smiling Ananya at desk */}
          {/* Body / Shirt */}
          <path d="M128 170 C128 135 188 135 188 170 Z" fill="#3B82F6" stroke="#0A1128" strokeWidth="2.5" />
          {/* Collar */}
          <path d="M152 140 L158 152 L164 140 Z" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
          {/* Head & Hair */}
          <circle cx="158" cy="78" r="24" fill="#FED7AA" stroke="#0A1128" strokeWidth="2.5" />
          {/* Hair Bun */}
          <circle cx="158" cy="52" r="14" fill="#451A03" stroke="#0A1128" strokeWidth="2" />
          <path d="M136 74 C136 60 180 60 180 74 C180 64 136 64 136 74 Z" fill="#451A03" stroke="#0A1128" strokeWidth="2" />
          {/* Eyes & Smile */}
          <circle cx="150" cy="76" r="2.5" fill="#0A1128" />
          <circle cx="166" cy="76" r="2.5" fill="#0A1128" />
          <path d="M153 84 Q158 89 163 84" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
          <circle cx="147" cy="81" r="2.5" fill="#FDA4AF" />
          <circle cx="169" cy="81" r="2.5" fill="#FDA4AF" />

          {/* Coffee Mug */}
          <rect x="76" y="112" width="16" height="18" rx="3" fill="#F97316" stroke="#0A1128" strokeWidth="2" />
          <path d="M92 116 C96 116 96 124 92 124" stroke="#0A1128" strokeWidth="2" fill="none" />
          {/* Steam */}
          <path d="M82 106 Q80 102 84 98" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Silent Phone with Green Notification */}
          <g transform="translate(45, 40) rotate(-6)">
            <rect width="70" height="36" rx="8" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
            <circle cx="14" cy="18" r="6" fill="#10B981" />
            <text x="14" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">✓</text>
            <text x="26" y="16" fill="#0A1128" fontSize="7.5" fontWeight="900">Hub Safe 📦</text>
            <text x="26" y="26" fill="#64748B" fontSize="6.5" fontWeight="bold">Slot: 8:00 PM</text>
          </g>
        </svg>
      )
    },
    {
      id: 'studying',
      name: 'Studying',
      emoji: '📚',
      activityTitle: 'Exam Preparation & Class Lectures',
      badge: 'Unbroken Study Flow',
      badgeColor: 'bg-emerald-300 text-[#0A1128]',
      color: 'bg-emerald-50',
      scheduledTime: '6:30 PM – 7:00 PM',
      quote: '"I used to sprint down 8 floors in the middle of online lectures. Now I grab my parcels once study hours are over."',
      residentName: 'Rohan M.',
      role: 'Engineering Student • Tower C Flat 402',
      whatTheyAreDoing: 'Solving complex algorithms with noise-canceling headphones.',
      howParcelFlowHelps: 'No frantic doorbell rings or lobby phone calls during test prep. Everything stays safely stored until study time ends.',
      illustration: (
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="160" cy="195" rx="120" ry="12" fill="#0A1128" opacity="0.1" />
          
          {/* Desk */}
          <rect x="40" y="130" width="240" height="14" rx="4" fill="#86EFAC" stroke="#0A1128" strokeWidth="2.5" />
          <rect x="60" y="144" width="12" height="52" rx="2" fill="#15803D" stroke="#0A1128" strokeWidth="2.5" />
          <rect x="248" y="144" width="12" height="52" rx="2" fill="#15803D" stroke="#0A1128" strokeWidth="2.5" />

          {/* Stack of books */}
          <rect x="65" y="116" width="38" height="14" rx="2" fill="#F43F5E" stroke="#0A1128" strokeWidth="2" />
          <rect x="67" y="102" width="34" height="14" rx="2" fill="#3B82F6" stroke="#0A1128" strokeWidth="2" />
          <rect x="70" y="90" width="30" height="12" rx="2" fill="#FBBF24" stroke="#0A1128" strokeWidth="2" />

          {/* Study Lamp */}
          <path d="M236 130 V75 Q236 60 216 60 H204" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M195 50 L212 68 L185 75 Z" fill="#FEF08A" stroke="#0A1128" strokeWidth="2" />
          <path d="M190 75 L160 130 L220 130 Z" fill="#FEF08A" opacity="0.25" />

          {/* Character Rohan studying with headphones */}
          <path d="M128 170 C128 135 188 135 188 170 Z" fill="#10B981" stroke="#0A1128" strokeWidth="2.5" />
          <circle cx="158" cy="80" r="24" fill="#FED7AA" stroke="#0A1128" strokeWidth="2.5" />
          {/* Curly hair */}
          <path d="M136 76 C134 56 182 56 180 76 Z" fill="#1E293B" stroke="#0A1128" strokeWidth="2" />
          {/* Big blue headphones */}
          <path d="M134 76 C134 50 182 50 182 76" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" fill="none" />
          <rect x="130" y="70" width="8" height="18" rx="3" fill="#2563EB" stroke="#0A1128" strokeWidth="2" />
          <rect x="178" y="70" width="8" height="18" rx="3" fill="#2563EB" stroke="#0A1128" strokeWidth="2" />

          {/* Eyes looking down at open book */}
          <path d="M150 82 Q153 85 156 82" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
          <path d="M162 82 Q165 85 168 82" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
          <path d="M156 90 Q159 93 162 90" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />

          {/* Open textbook on desk */}
          <path d="M125 128 L158 124 L190 128 L186 116 L158 114 L128 116 Z" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
          <line x1="158" y1="114" x2="158" y2="124" stroke="#0A1128" strokeWidth="1.5" />

          {/* Floating Sticker */}
          <g transform="translate(210, 30) rotate(8)">
            <rect width="76" height="24" rx="6" fill="#FDE047" stroke="#0A1128" strokeWidth="2" />
            <text x="38" y="16" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="900">100% Focused</text>
          </g>
        </svg>
      )
    },
    {
      id: 'exercising',
      name: 'Exercising',
      emoji: '🏃',
      activityTitle: 'Morning Runs & Gym Workouts',
      badge: 'Zero Workout Stoppages',
      badgeColor: 'bg-orange-300 text-[#0A1128]',
      color: 'bg-orange-50',
      scheduledTime: '8:30 AM – 9:00 AM',
      quote: '"I was mid-squat when delivery drivers used to pound on my door. Now I finish my gym session at my own pace."',
      residentName: 'Karan V.',
      role: 'Fitness Coach • Tower A Flat 1201',
      whatTheyAreDoing: 'Strength training and jogging around the society podium garden.',
      howParcelFlowHelps: 'Karan picks up sports gear and health supplements on his way back from the clubhouse gym.',
      illustration: (
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="160" cy="195" rx="120" ry="12" fill="#0A1128" opacity="0.1" />

          {/* Dumbbells on floor */}
          <rect x="50" y="174" width="30" height="8" rx="2" fill="#64748B" stroke="#0A1128" strokeWidth="2" />
          <rect x="46" y="168" width="8" height="20" rx="3" fill="#0A1128" />
          <rect x="76" y="168" width="8" height="20" rx="3" fill="#0A1128" />

          {/* Running track curve */}
          <path d="M30 190 Q160 170 290 190" stroke="#F97316" strokeWidth="8" strokeDasharray="16 12" strokeLinecap="round" />

          {/* Character Karan running */}
          <g transform="translate(110, 45)">
            {/* Motion lines */}
            <path d="M-15 40 H-5 M-25 50 H-10 M-20 60 H-8" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
            
            {/* Head & Sweatband */}
            <circle cx="50" cy="30" r="20" fill="#FED7AA" stroke="#0A1128" strokeWidth="2.5" />
            <path d="M34 26 H66" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
            {/* Smiling face */}
            <circle cx="48" cy="32" r="2.5" fill="#0A1128" />
            <circle cx="58" cy="32" r="2.5" fill="#0A1128" />
            <path d="M50 38 Q54 42 58 38" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
            
            {/* Runner Torso */}
            <path d="M35 52 L65 52 L58 95 L40 95 Z" fill="#F97316" stroke="#0A1128" strokeWidth="2.5" />
            
            {/* Arms swinging */}
            <path d="M35 55 L18 75 L30 85" stroke="#0A1128" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M65 55 L85 65 L76 78" stroke="#0A1128" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Legs running */}
            <path d="M42 95 L30 120 L15 125" stroke="#0A1128" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M56 95 L72 118 L90 115" stroke="#0A1128" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Red sneakers */}
            <rect x="6" y="122" width="18" height="9" rx="3" fill="#EF4444" stroke="#0A1128" strokeWidth="2" />
            <rect x="85" y="112" width="18" height="9" rx="3" fill="#EF4444" stroke="#0A1128" strokeWidth="2" />
          </g>

          {/* Floating Heart / BPM Badge */}
          <g transform="translate(205, 30) rotate(-6)">
            <rect width="80" height="28" rx="8" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
            <text x="14" y="19" fontSize="13">❤️</text>
            <text x="32" y="19" fill="#0A1128" fontSize="9" fontWeight="900">In The Zone</text>
          </g>
        </svg>
      )
    },
    {
      id: 'travelling',
      name: 'Travelling',
      emoji: '✈️',
      activityTitle: 'Airport Trips & City Commutes',
      badge: 'Protected While Away',
      badgeColor: 'bg-purple-300 text-[#0A1128]',
      color: 'bg-purple-50',
      scheduledTime: 'Post-Trip / Friday 7:00 PM',
      quote: '"I was traveling for 3 days and ordered gifts online. They safely rested in the hub until I unlocked my door."',
      residentName: 'Priya & Vikram',
      role: 'Consultants • Tower E Flat 1502',
      whatTheyAreDoing: 'Boarding flights or stuck in Bangalore rush-hour cab traffic.',
      howParcelFlowHelps: 'Zero risk of parcels being stolen from outside door mats while you are away from your apartment.',
      illustration: (
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="160" cy="195" rx="120" ry="12" fill="#0A1128" opacity="0.1" />

          {/* Rolling Suitcase */}
          <rect x="70" y="80" width="56" height="95" rx="10" fill="#A855F7" stroke="#0A1128" strokeWidth="3" />
          {/* Suitcase ribs */}
          <line x1="80" y1="105" x2="116" y2="105" stroke="#6B21A8" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="125" x2="116" y2="125" stroke="#6B21A8" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="145" x2="116" y2="145" stroke="#6B21A8" strokeWidth="3" strokeLinecap="round" />
          {/* Wheels */}
          <circle cx="82" cy="180" r="5" fill="#0A1128" />
          <circle cx="114" cy="180" r="5" fill="#0A1128" />
          {/* Handle */}
          <path d="M88 80 V50 H108 V80" stroke="#0A1128" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Luggage tag */}
          <rect x="100" y="90" width="16" height="10" rx="2" fill="#FDE047" stroke="#0A1128" strokeWidth="1.5" />

          {/* Cartoon Airplane */}
          <g transform="translate(180, 50) rotate(-15)">
            <path d="M0 20 Q40 10 90 20 Q105 23 115 15 L108 26 L115 35 Q105 28 90 30 Q40 40 0 30 Z" fill="#60A5FA" stroke="#0A1128" strokeWidth="2.5" />
            {/* Wing */}
            <path d="M40 25 L55 2 L75 25 Z" fill="#3B82F6" stroke="#0A1128" strokeWidth="2" />
            <path d="M42 27 L55 45 L70 27 Z" fill="#2563EB" stroke="#0A1128" strokeWidth="2" />
            {/* Windows */}
            <circle cx="30" cy="24" r="2.5" fill="#FFFFFF" />
            <circle cx="42" cy="24" r="2.5" fill="#FFFFFF" />
            <circle cx="54" cy="24" r="2.5" fill="#FFFFFF" />
            <circle cx="66" cy="24" r="2.5" fill="#FFFFFF" />
          </g>

          {/* Dotted Flight Path */}
          <path d="M140 110 Q160 85 190 75" stroke="#9333EA" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />

          {/* Vacation badge */}
          <g transform="translate(170, 130) rotate(4)">
            <rect width="90" height="30" rx="8" fill="#FDE047" stroke="#0A1128" strokeWidth="2" />
            <text x="14" y="20" fontSize="13">🏖️</text>
            <text x="32" y="20" fill="#0A1128" fontSize="9" fontWeight="900">Safe at Hub</text>
          </g>
        </svg>
      )
    },
    {
      id: 'relaxing',
      name: 'Relaxing',
      emoji: '☕',
      activityTitle: 'Evening Tea, Family Dinner & Movies',
      badge: 'Pure Evening Peace',
      badgeColor: 'bg-amber-300 text-[#0A1128]',
      color: 'bg-amber-50',
      scheduledTime: '8:45 PM – 9:15 PM',
      quote: '"Our evenings feel quiet again. Dinner isn\'t interrupted by security gate buzzers or delivery bikes."',
      residentName: 'Sunita & Ramesh',
      role: 'Residents • Tower D Flat 204',
      whatTheyAreDoing: 'Enjoying hot chai and watching evening sitcoms with family.',
      howParcelFlowHelps: 'Scheduled handover allows residents to choose their calm post-dinner stroll for package collection.',
      illustration: (
        <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="160" cy="195" rx="120" ry="12" fill="#0A1128" opacity="0.1" />

          {/* Cozy Comfy Sofa */}
          <rect x="60" y="110" width="200" height="60" rx="16" fill="#FBBF24" stroke="#0A1128" strokeWidth="3" />
          <rect x="45" y="100" width="30" height="70" rx="10" fill="#F59E0B" stroke="#0A1128" strokeWidth="2.5" />
          <rect x="245" y="100" width="30" height="70" rx="10" fill="#F59E0B" stroke="#0A1128" strokeWidth="2.5" />
          {/* Sofa legs */}
          <rect x="75" y="170" width="10" height="18" rx="2" fill="#78350F" stroke="#0A1128" strokeWidth="2" />
          <rect x="235" y="170" width="10" height="18" rx="2" fill="#78350F" stroke="#0A1128" strokeWidth="2" />

          {/* Comfy Cushions */}
          <rect x="85" y="115" width="65" height="45" rx="8" fill="#FDE68A" stroke="#0A1128" strokeWidth="2" />
          <rect x="170" y="115" width="65" height="45" rx="8" fill="#FDE68A" stroke="#0A1128" strokeWidth="2" />

          {/* Cute Cat Sleeping on sofa */}
          <ellipse cx="140" cy="130" rx="18" ry="12" fill="#FB923C" stroke="#0A1128" strokeWidth="2" />
          <circle cx="126" cy="126" r="8" fill="#FB923C" stroke="#0A1128" strokeWidth="2" />
          <polygon points="120,122 124,114 128,120" fill="#FB923C" stroke="#0A1128" strokeWidth="1.5" />
          <polygon points="126,120 130,114 134,122" fill="#FB923C" stroke="#0A1128" strokeWidth="1.5" />
          <path d="M124 126 Q126 128 128 126" stroke="#0A1128" strokeWidth="1" />
          <text x="145" y="118" fill="#0A1128" fontSize="9" fontWeight="bold">zzz</text>

          {/* Steaming Mug on small table */}
          <rect x="190" y="80" width="22" height="24" rx="4" fill="#EC4899" stroke="#0A1128" strokeWidth="2" />
          <path d="M212 85 C218 85 218 95 212 95" stroke="#0A1128" strokeWidth="2" fill="none" />
          <path d="M198 72 Q196 66 200 60" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <path d="M204 70 Q202 64 206 58" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

          {/* TV Screen / Ambient Glow */}
          <g transform="translate(110, 20)">
            <rect width="100" height="26" rx="6" fill="#38BDF8" stroke="#0A1128" strokeWidth="2" />
            <text x="50" y="17" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="900">Movie Night 🍿</text>
          </g>
        </svg>
      )
    }
  ];

  const currentScene = scenes.find((s) => s.id === activeTab) || scenes[0];

  return (
    <section id="for-residents" className="relative py-20 sm:py-28 bg-[#FEF9F3] text-[#0A1128] overflow-hidden border-b-2 border-[#0A1128]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-300 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-[#0A1128] text-xs sm:text-sm font-black uppercase tracking-wider mb-4 rotate-1 hover:rotate-0 transition-transform">
            <CalendarCheck className="w-4 h-4 text-[#0A1128]" />
            <span>Built Around Real Lives</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1128] tracking-tight leading-tight">
            Your day. Your schedule. <br />
            <span className="relative inline-block text-emerald-600">
              Your parcel.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you are on a client call, preparing for exams, or clocking miles at the gym, ParcelFlow molds effortlessly around your day.
          </p>
        </div>

        {/* Activity Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => setActiveTab(scene.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm border-2 border-[#0A1128] transition-all duration-150 flex items-center gap-2 ${
                activeTab === scene.id
                  ? 'bg-amber-300 text-[#0A1128] shadow-[3px_3px_0px_#0A1128] -translate-y-1'
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0A1128]'
              }`}
            >
              <span className="text-base">{scene.emoji}</span>
              <span>{scene.name}</span>
            </button>
          ))}
        </div>

        {/* Main Illustrated Scene Showcase Card */}
        <div className="bg-white rounded-3xl border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Rich Cartoon Scene */}
            <div className={`lg:col-span-7 p-6 sm:p-10 ${currentScene.color} border-b-2 lg:border-b-0 lg:border-r-2 border-[#0A1128] flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] ${currentScene.badgeColor}`}>
                  {currentScene.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-[#0A1128] border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pickup: {currentScene.scheduledTime}</span>
                </span>
              </div>

              {/* The SVG Illustration */}
              <div className="my-auto py-4">
                {currentScene.illustration}
              </div>

              {/* Scene caption pill */}
              <div className="bg-white/90 rounded-2xl p-4 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] flex items-start gap-3 mt-4">
                <span className="text-2xl shrink-0">💡</span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1128]">What is happening:</h4>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">{currentScene.whatTheyAreDoing}</p>
                </div>
              </div>
            </div>

            {/* Right Column: How ParcelFlow Makes It Calm */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-white">
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-black rounded border border-[#0A1128] mb-2">
                    {currentScene.activityTitle}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight leading-snug">
                    Deliveries wait for you. <br />
                    Not the other way around.
                  </h3>
                </div>

                {/* Resident Quote Bubble */}
                <div className="relative bg-amber-50 rounded-2xl p-5 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
                  <p className="text-sm font-bold text-[#0A1128] italic leading-relaxed">
                    {currentScene.quote}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-[#0A1128] flex items-center justify-center font-black text-xs text-[#0A1128]">
                      {currentScene.residentName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#0A1128]">{currentScene.residentName}</div>
                      <div className="text-[11px] font-semibold text-slate-600">{currentScene.role}</div>
                    </div>
                  </div>
                </div>

                {/* Benefit checklist */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-300 border-2 border-[#0A1128] flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#0A1128]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0A1128]" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      <strong>Zero spam phone calls</strong> while in meetings or busy.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-300 border-2 border-[#0A1128] flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#0A1128]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0A1128]" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      <strong>Guaranteed safe custody</strong> inside the society hub until collected.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-300 border-2 border-[#0A1128] flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#0A1128]">
                      <Clock className="w-3.5 h-3.5 text-[#0A1128]" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      <strong>Pick your preferred slot</strong> with 1-tap on the mobile app.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-8 pt-6 border-t-2 border-[#0A1128]/10">
                <a
                  href="/download"
                  className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm border-2 border-[#0A1128] shadow-[3px_3px_0px_#F59E0B] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#F59E0B] transition-all flex items-center justify-center gap-2"
                >
                  <span>Experience Stress-Free Delivery</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ResidentSection;
