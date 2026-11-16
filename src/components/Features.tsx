import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  ShieldCheck, 
  Bell, 
  Building2, 
  BarChart3, 
  Check, 
  Sparkles,
  ArrowRight,
  QrCode,
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';

interface FeatureCard {
  id: string;
  emoji: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  rotation: string;
  hoverRotation: string;
  accentBg: string;
  illustration: React.ReactNode;
  interactiveElement: React.ReactNode;
}

export const Features: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<string>('8:00 PM');
  const [showOtpVerified, setShowOtpVerified] = useState<boolean>(true);
  const [notificationState, setNotificationState] = useState<boolean>(true);

  const features: FeatureCard[] = [
    {
      id: 'tracking',
      emoji: '📦',
      badge: 'Real-Time Intake',
      badgeColor: 'bg-amber-300 text-[#0A1128]',
      title: 'Parcel Tracking',
      subtitle: 'Know when parcel reaches society',
      description: 'No more guessing where the courier dumped your box. Get notified the exact second your package is scanned at your society gate hub.',
      color: 'bg-sky-50',
      rotation: '-rotate-1',
      hoverRotation: 'hover:rotate-0',
      accentBg: 'bg-sky-400',
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-28 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Floor Shadow */}
          <ellipse cx="100" cy="118" rx="65" ry="8" fill="#0A1128" opacity="0.12" />
          
          {/* Society Gate Hub Signboard */}
          <rect x="25" y="15" width="60" height="26" rx="6" fill="#FDE047" stroke="#0A1128" strokeWidth="2.5" />
          <text x="55" y="32" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="900" fontFamily="sans-serif">HUB 01</text>
          
          {/* Main Box */}
          <g className="animate-bounce" style={{ animationDuration: '3s' }}>
            <rect x="68" y="42" width="64" height="60" rx="8" fill="#FDBA74" stroke="#0A1128" strokeWidth="2.5" />
            {/* Box tape */}
            <path d="M68 66 H132" stroke="#EA580C" strokeWidth="6" strokeDasharray="4 2" />
            <path d="M96 42 V102" stroke="#EA580C" strokeWidth="6" />
            {/* Happy Face on Box */}
            <circle cx="86" cy="56" r="3" fill="#0A1128" />
            <circle cx="114" cy="56" r="3" fill="#0A1128" />
            <path d="M94 62 Q100 68 106 62" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
            {/* Shipping Label */}
            <rect x="76" y="78" width="28" height="16" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
            <line x1="80" y1="83" x2="98" y2="83" stroke="#0A1128" strokeWidth="1.5" />
            <line x1="80" y1="88" x2="92" y2="88" stroke="#0A1128" strokeWidth="1.5" />
          </g>

          {/* Scanner beam */}
          <path d="M138 28 L110 50 L124 58 Z" fill="#38BDF8" opacity="0.4" />
          <circle cx="140" cy="26" r="8" fill="#38BDF8" stroke="#0A1128" strokeWidth="2" />
          <path d="M137 23 L143 29 M143 23 L137 29" stroke="#0A1128" strokeWidth="1.5" strokeLinecap="round" />

          {/* Success Check Pill */}
          <g transform="translate(132, 70)">
            <rect width="52" height="22" rx="11" fill="#86EFAC" stroke="#0A1128" strokeWidth="2" />
            <text x="26" y="15" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="800">Scanned ✓</text>
          </g>
        </svg>
      ),
      interactiveElement: (
        <div className="bg-white rounded-xl p-3 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-[#0A1128]">Hub Gate 2 • Tower B Shelf 4</span>
          </div>
          <span className="text-[11px] font-black px-2 py-0.5 bg-sky-100 text-sky-800 rounded border border-[#0A1128]">11:42 AM</span>
        </div>
      )
    },
    {
      id: 'timing',
      emoji: '🕐',
      badge: 'Zero Rush',
      badgeColor: 'bg-emerald-300 text-[#0A1128]',
      title: 'Flexible Pickup',
      subtitle: 'Choose a convenient handover window',
      description: 'Stop racing home before the delivery rider leaves. Tell ParcelFlow when you are free, and your parcel is waiting at your chosen hour.',
      color: 'bg-emerald-50',
      rotation: 'rotate-1',
      hoverRotation: 'hover:rotate-0',
      accentBg: 'bg-emerald-400',
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-28 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="116" rx="60" ry="7" fill="#0A1128" opacity="0.12" />
          {/* Cartoon Clock */}
          <circle cx="100" cy="62" r="42" fill="#FEF08A" stroke="#0A1128" strokeWidth="3" />
          <circle cx="100" cy="62" r="33" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
          {/* Clock face ticks */}
          <line x1="100" y1="33" x2="100" y2="38" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="129" y1="62" x2="124" y2="62" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="100" y1="91" x2="100" y2="86" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="71" y1="62" x2="76" y2="62" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
          {/* Clock hands pointing to 8:00 */}
          <line x1="100" y1="62" x2="100" y2="44" stroke="#0A1128" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="100" y1="62" x2="80" y2="76" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="62" r="4.5" fill="#EF4444" stroke="#0A1128" strokeWidth="2" />
          
          {/* Little wings on clock */}
          <path d="M58 52 Q44 42 46 62 Q52 66 60 62 Z" fill="#93C5FD" stroke="#0A1128" strokeWidth="2" />
          <path d="M142 52 Q156 42 154 62 Q148 66 140 62 Z" fill="#93C5FD" stroke="#0A1128" strokeWidth="2" />

          {/* Little sticker on side */}
          <g transform="translate(125, 20) rotate(12)">
            <rect width="56" height="20" rx="5" fill="#F472B6" stroke="#0A1128" strokeWidth="2" />
            <text x="28" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900">Your Time!</text>
          </g>
        </svg>
      ),
      interactiveElement: (
        <div className="flex items-center gap-1.5 justify-between">
          {['6:30 PM', '8:00 PM', '9:15 PM'].map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setSelectedSlot(slot)}
              className={`flex-1 py-1.5 px-1 text-xs font-black rounded-lg border-2 border-[#0A1128] transition-all ${
                selectedSlot === slot 
                  ? 'bg-emerald-400 text-[#0A1128] shadow-[2px_2px_0px_#0A1128] -translate-y-0.5' 
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {slot} {selectedSlot === slot && '✓'}
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'security',
      emoji: '🔐',
      badge: 'Zero Theft',
      badgeColor: 'bg-purple-300 text-[#0A1128]',
      title: 'Secure Handover',
      subtitle: 'QR and OTP verification',
      description: 'Your package is never left unattended at doorsteps. Every handover requires a one-time OTP or secure QR verification.',
      color: 'bg-purple-50',
      rotation: '-rotate-1',
      hoverRotation: 'hover:rotate-0',
      accentBg: 'bg-purple-400',
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-28 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="116" rx="60" ry="7" fill="#0A1128" opacity="0.12" />
          {/* Cartoon Padlock */}
          <rect x="74" y="52" width="52" height="46" rx="10" fill="#A855F7" stroke="#0A1128" strokeWidth="3" />
          {/* Shackle */}
          <path d="M84 52 V36 C84 26 116 26 116 36 V52" stroke="#0A1128" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M84 52 V36 C84 28 116 28 116 36 V52" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Keyhole */}
          <circle cx="100" cy="72" r="5" fill="#0A1128" />
          <path d="M98 74 L97 86 H103 L102 74 Z" fill="#0A1128" />
          
          {/* Glowing QR Shield */}
          <g transform="translate(132, 42) rotate(-8)">
            <rect width="46" height="46" rx="8" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
            {/* Mini QR pattern */}
            <rect x="6" y="6" width="12" height="12" fill="#0A1128" />
            <rect x="8" y="8" width="8" height="8" fill="#FFFFFF" />
            <rect x="28" y="6" width="12" height="12" fill="#0A1128" />
            <rect x="30" y="8" width="8" height="8" fill="#FFFFFF" />
            <rect x="6" y="28" width="12" height="12" fill="#0A1128" />
            <rect x="8" y="30" width="8" height="8" fill="#FFFFFF" />
            <rect x="24" y="24" width="8" height="8" fill="#0A1128" />
            <rect x="34" y="34" width="6" height="6" fill="#10B981" />
          </g>

          {/* Sparkles */}
          <circle cx="60" cy="40" r="4" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />
          <circle cx="140" cy="100" r="3" fill="#F472B6" />
        </svg>
      ),
      interactiveElement: (
        <div 
          onClick={() => setShowOtpVerified(!showOtpVerified)}
          className="cursor-pointer bg-white rounded-xl p-2.5 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-[#0A1128] tracking-wider bg-purple-100 px-2 py-0.5 rounded border border-[#0A1128]">
              OTP: 8392
            </span>
          </div>
          <span className="text-[11px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-[#0A1128]">
            {showOtpVerified ? 'Verified ✓' : 'Tap to Verify'}
          </span>
        </div>
      )
    },
    {
      id: 'notifications',
      emoji: '🔔',
      badge: 'Smart Alerts',
      badgeColor: 'bg-rose-300 text-[#0A1128]',
      title: 'Instant Notifications',
      subtitle: 'Know when your parcel arrives',
      description: 'Clean, respectful push notifications and WhatsApp alerts. No spam calls, no panic, just friendly reminders when your box is waiting.',
      color: 'bg-rose-50',
      rotation: 'rotate-1',
      hoverRotation: 'hover:rotate-0',
      accentBg: 'bg-rose-400',
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-28 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="116" rx="55" ry="7" fill="#0A1128" opacity="0.12" />
          {/* Cartoon Bell */}
          <g className="animate-pulse" style={{ animationDuration: '2.5s' }}>
            <path d="M100 24 C82 24 72 38 72 62 C72 74 64 82 62 86 H138 C136 82 128 74 128 62 C128 38 118 24 100 24 Z" fill="#FDE047" stroke="#0A1128" strokeWidth="3" />
            {/* Clapper */}
            <circle cx="100" cy="92" r="8" fill="#F59E0B" stroke="#0A1128" strokeWidth="2.5" />
            {/* Bell highlight */}
            <path d="M84 46 Q88 34 100 32" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            {/* Top loop */}
            <path d="M96 24 C96 20 104 20 104 24" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Sound waves */}
          <path d="M50 56 C46 62 46 72 50 78" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 50 C36 60 36 78 42 88" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M150 56 C154 62 154 72 150 78" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M158 50 C164 60 164 78 158 88" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />

          {/* Floating message bubble */}
          <g transform="translate(112, 16) rotate(6)">
            <rect width="64" height="26" rx="8" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
            <path d="M120 42 L124 48 L128 42" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
            <text x="32" y="17" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="800">📦 Amazon In!</text>
          </g>
        </svg>
      ),
      interactiveElement: (
        <div 
          onClick={() => setNotificationState(!notificationState)}
          className="cursor-pointer bg-white rounded-xl p-2.5 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">💬</span>
            <span className="text-xs font-bold text-[#0A1128]">WhatsApp Alert</span>
          </div>
          <span className={`text-[11px] font-black px-2 py-0.5 rounded border border-[#0A1128] ${
            notificationState ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'
          }`}>
            {notificationState ? 'Enabled 🔔' : 'Muted'}
          </span>
        </div>
      )
    },
    {
      id: 'society',
      emoji: '🏢',
      badge: 'Community First',
      badgeColor: 'bg-blue-300 text-[#0A1128]',
      title: 'Society Ready',
      subtitle: 'Designed for apartment communities',
      description: 'Clears out corridor pile-ups, stops courier delivery bikes from speeding inside walking zones, and brings safety back to your community.',
      color: 'bg-blue-50',
      rotation: '-rotate-1',
      hoverRotation: 'hover:rotate-0',
      accentBg: 'bg-blue-400',
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-28 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="116" rx="65" ry="7" fill="#0A1128" opacity="0.12" />
          
          {/* Apartment Tower 1 */}
          <rect x="42" y="32" width="46" height="78" rx="4" fill="#60A5FA" stroke="#0A1128" strokeWidth="2.5" />
          {/* Windows */}
          <rect x="50" y="40" width="8" height="8" rx="1" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="64" y="40" width="8" height="8" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="50" y="56" width="8" height="8" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="64" y="56" width="8" height="8" rx="1" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="50" y="72" width="8" height="8" rx="1" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="64" y="72" width="8" height="8" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />

          {/* Apartment Tower 2 */}
          <rect x="94" y="18" width="56" height="92" rx="4" fill="#93C5FD" stroke="#0A1128" strokeWidth="2.5" />
          <rect x="104" y="28" width="9" height="9" rx="1" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="122" y="28" width="9" height="9" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="104" y="46" width="9" height="9" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="122" y="46" width="9" height="9" rx="1" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="104" y="64" width="9" height="9" rx="1" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="122" y="64" width="9" height="9" rx="1" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />

          {/* Little tree */}
          <circle cx="160" cy="94" r="14" fill="#4ADE80" stroke="#0A1128" strokeWidth="2" />
          <rect x="157" y="102" width="6" height="12" fill="#92400E" stroke="#0A1128" strokeWidth="1.5" />

          {/* Society Badge */}
          <g transform="translate(68, 92)">
            <rect width="64" height="22" rx="6" fill="#FDE047" stroke="#0A1128" strokeWidth="2" />
            <text x="32" y="15" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="900">500+ Flats Ready</text>
          </g>
        </svg>
      ),
      interactiveElement: (
        <div className="bg-white rounded-xl p-2.5 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">Gate Traffic Reduction:</span>
          <span className="font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-[#0A1128]">-85%</span>
        </div>
      )
    },
    {
      id: 'management',
      emoji: '📊',
      badge: 'Zero Disputes',
      badgeColor: 'bg-orange-300 text-[#0A1128]',
      title: 'Smart Management',
      subtitle: 'Tools for society management',
      description: 'Guards get a dead-simple, 5-second scan screen. RWA management gets complete audit trails and proof of handover for every package.',
      color: 'bg-orange-50',
      rotation: 'rotate-1',
      hoverRotation: 'hover:rotate-0',
      accentBg: 'bg-orange-400',
      illustration: (
        <svg viewBox="0 0 200 130" className="w-full h-28 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="116" rx="60" ry="7" fill="#0A1128" opacity="0.12" />
          
          {/* Dashboard Tablet */}
          <rect x="45" y="24" width="110" height="82" rx="10" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3" />
          <rect x="52" y="32" width="96" height="66" rx="6" fill="#FFF7ED" stroke="#0A1128" strokeWidth="1.5" />
          
          {/* Cartoon Bar Chart */}
          <rect x="62" y="68" width="12" height="22" rx="2" fill="#F97316" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="80" y="54" width="12" height="36" rx="2" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="98" y="44" width="12" height="46" rx="2" fill="#34D399" stroke="#0A1128" strokeWidth="1.5" />
          <rect x="116" y="38" width="12" height="52" rx="2" fill="#60A5FA" stroke="#0A1128" strokeWidth="1.5" />

          {/* Upward trend spark */}
          <path d="M64 62 L82 50 L102 38 L124 30" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
          <circle cx="124" cy="30" r="3.5" fill="#EF4444" stroke="#0A1128" strokeWidth="1.5" />

          {/* Sticker on tablet */}
          <g transform="translate(125, 14) rotate(14)">
            <rect width="48" height="18" rx="4" fill="#F472B6" stroke="#0A1128" strokeWidth="1.5" />
            <text x="24" y="12" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900">100% Audit</text>
          </g>
        </svg>
      ),
      interactiveElement: (
        <div className="bg-white rounded-xl p-2.5 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">Clearance Rate Today:</span>
          <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-[#0A1128]">98.4%</span>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="relative py-20 sm:py-28 bg-[#FEF9F3] text-[#0A1128] overflow-hidden border-b-2 border-[#0A1128]">
      {/* Background polka dots */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0A1128 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Cartoon Sticker Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-[#0A1128] text-xs sm:text-sm font-black uppercase tracking-wider mb-4 -rotate-1 hover:rotate-0 transition-transform">
            <Sparkles className="w-4 h-4 text-[#0A1128]" />
            <span>Built Differently For Apartment Living</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1128] tracking-tight leading-tight">
            Everything your parcel needs. <br />
            <span className="relative inline-block text-blue-600">
              Nothing you don't.
              {/* Playful cartoon underline stroke */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Six thoughtful, stress-free features engineered to bring calm, security, and predictability to high-density apartment deliveries.
          </p>
        </div>

        {/* 6 Illustrated Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative ${feature.color} rounded-2xl p-6 sm:p-7 border-2 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] ${feature.rotation} ${feature.hoverRotation} transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[7px_7px_0px_#0A1128] flex flex-col justify-between`}
            >
              <div>
                {/* Top bar with emoji & badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {feature.emoji}
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-black rounded-full border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Cartoon Illustration */}
                <div className="my-2 bg-white/70 rounded-xl p-2 border-2 border-[#0A1128]/60 overflow-hidden">
                  {feature.illustration}
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-[#0A1128] mt-4 mb-1 tracking-tight flex items-center gap-2">
                  {feature.title}
                </h3>
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                  {feature.subtitle}
                </p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed mb-5">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Interactive Playground */}
              <div className="pt-2 border-t-2 border-[#0A1128]/10">
                {feature.interactiveElement}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fun Banner */}
        <div className="mt-14 bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-300 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-3xl shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-lg font-black text-[#0A1128]">Zero Corridor Intrusions. Zero Doorstep Thefts.</h4>
              <p className="text-sm font-medium text-slate-600">Enjoy full privacy inside your home while your packages stay safe at the gate hub.</p>
            </div>
          </div>
          <a
            href="/features"
            className="shrink-0 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0A1128] transition-all inline-flex items-center gap-2"
          >
            <span>Explore All Features</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
