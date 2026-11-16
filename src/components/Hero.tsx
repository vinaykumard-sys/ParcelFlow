import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Download, 
  ChevronRight, 
  Check, 
  Star, 
  Package, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Building2,
  Calendar,
  BellRing
} from 'lucide-react';
import { Sticker } from './Sticker';

export const Hero: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<string>('8:00 PM – 8:30 PM');
  const [activeSticker, setActiveSticker] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] text-[#0F172A] pt-28 pb-20 md:pt-36 md:pb-28 border-b-[3px] border-[#0F172A]">
      {/* Playful background decorative pattern: subtle halftone dots */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1.75px, transparent 1.75px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating subtle pastel decorative doodle shapes */}
      <div className="absolute top-20 left-12 w-16 h-16 rounded-full bg-yellow-300/40 border-2 border-[#0F172A] -rotate-12 hidden lg:flex items-center justify-center font-black text-xs text-[#0F172A] shadow-cartoon-sm pointer-events-none select-none">
        FAST ⚡
      </div>
      <div className="absolute top-40 right-10 w-20 h-20 rounded-2xl bg-pink-300/40 border-2 border-[#0F172A] rotate-12 hidden lg:flex items-center justify-center font-black text-xs text-center text-[#0F172A] shadow-cartoon-sm pointer-events-none select-none p-1">
        NO STRESS 😌
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left z-10">
            
            {/* Playful Top Badge */}
            <div className="inline-flex items-center">
              <Sticker 
                color="yellow" 
                rotate="slight-left" 
                size="md" 
                shadow="md"
                className="font-extrabold tracking-wide"
                icon={<Sparkles className="w-4 h-4 text-[#0F172A] fill-amber-300 animate-pulse" />}
              >
                ParcelFlow • Smarter Apartment Deliveries
              </Sticker>
            </div>

            {/* Huge Bold Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-black tracking-tight leading-[1.08] text-[#0F172A]">
              Your parcel. <br className="hidden sm:inline" />
              Your{' '}
              <span className="relative inline-block mt-1 sm:mt-0">
                {/* Yellow & Orange Highlighter Box Behind "time." */}
                <span className="relative z-10 px-3 py-0.5 text-blue-600 bg-white border-[3px] border-[#0F172A] shadow-cartoon-md rounded-2xl inline-block -rotate-1 hover:rotate-0 transition-transform">
                  time.
                </span>
                {/* Hand-drawn brush underline ornament */}
                <svg 
                  className="absolute -bottom-3.5 left-0 w-full h-4 text-orange-500 pointer-events-none" 
                  viewBox="0 0 200 16" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M3 11C45 4 155 3 197 12" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                  />
                </svg>
              </span>
            </h1>

            {/* Playful Copy */}
            <p className="text-lg sm:text-xl font-medium text-slate-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Never miss a delivery again. <span className="font-bold text-[#0F172A]">ParcelFlow</span> lets apartment residents choose when their parcels fit into their schedule.
            </p>

            {/* Action Buttons & Hand-Drawn Arrow */}
            <div className="relative pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Primary CTA */}
                <a
                  href="/download"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-lg border-[3px] border-[#0F172A] shadow-cartoon-lg hover:-translate-y-1 hover:shadow-cartoon-xl active:translate-y-0.5 active:shadow-cartoon-sm transition-all group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download App</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Secondary CTA */}
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-amber-50 text-[#0F172A] font-black text-lg border-[3px] border-[#0F172A] shadow-cartoon-md hover:-translate-y-1 hover:shadow-cartoon-lg active:translate-y-0.5 active:shadow-cartoon-sm transition-all"
                >
                  <span>How It Works</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>

              {/* Hand-Drawn Curved SVG Arrow Pointing to CTA */}
              <div className="hidden sm:flex items-center gap-2 mt-4 ml-6 text-slate-700 font-bold text-sm">
                <svg 
                  className="w-9 h-7 text-orange-500 -scale-y-100 rotate-12" 
                  viewBox="0 0 40 30" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M4 4C14 18 24 22 34 20M34 20L28 14M34 20L29 26" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
                <span className="italic font-extrabold text-[#0F172A] bg-amber-200/90 px-2 py-0.5 rounded-md border border-[#0F172A] shadow-[2px_2px_0px_#0F172A] -rotate-1">
                  Takes 30 seconds to set up! 🎉
                </span>
              </div>
            </div>

            {/* Social Proof / Trust Strip */}
            <div className="pt-3 border-t-2 border-slate-300/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-slate-800">
              {/* Resident Avatars */}
              <div className="flex -space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-400 border-2 border-[#0F172A] flex items-center justify-center font-black text-xs shadow-cartoon-sm">
                  👩
                </div>
                <div className="w-9 h-9 rounded-full bg-sky-400 border-2 border-[#0F172A] flex items-center justify-center font-black text-xs shadow-cartoon-sm">
                  👨‍💼
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-400 border-2 border-[#0F172A] flex items-center justify-center font-black text-xs shadow-cartoon-sm">
                  👩‍💻
                </div>
                <div className="w-9 h-9 rounded-full bg-purple-400 border-2 border-[#0F172A] flex items-center justify-center font-black text-xs shadow-cartoon-sm">
                  🧔
                </div>
              </div>

              {/* Rating & Count */}
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-[#0F172A] stroke-[1.5]" />
                  ))}
                </div>
                <span className="font-extrabold text-[#0F172A]">4.9/5</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-700">10,000+ happy apartment residents</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: MAIN CARTOON ILLUSTRATION ================= */}
          <div className="lg:col-span-6 relative">
            
            {/* The Main Illustration Stage */}
            <div className="relative w-full rounded-3xl bg-white border-[3px] border-[#0F172A] shadow-cartoon-xl overflow-visible p-3 sm:p-5">
              
              {/* Scene Container */}
              <div className="relative w-full bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50/70 rounded-2xl border-2 border-[#0F172A] overflow-hidden pt-4 pb-2 px-2 sm:px-4">
                
                {/* Animated / Bobbing Custom Cartoon Delivery Scene SVG */}
                <div className="relative w-full flex items-center justify-center">
                  <svg 
                    viewBox="0 0 620 440" 
                    className="w-full h-auto max-h-[460px] drop-shadow-sm select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Linear Gradients for rich cartoon shading */}
                      <linearGradient id="skySun" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FEF08A" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                      <linearGradient id="towerGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E0E7FF" />
                        <stop offset="100%" stopColor="#C7D2FE" />
                      </linearGradient>
                      <linearGradient id="towerGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FEF3C7" />
                        <stop offset="100%" stopColor="#FDE68A" />
                      </linearGradient>
                      <linearGradient id="towerGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D1FAE5" />
                        <stop offset="100%" stopColor="#A7F3D0" />
                      </linearGradient>
                      <linearGradient id="scooterBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                      <linearGradient id="hubAwning" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="25%" stopColor="#2563EB" />
                        <stop offset="25%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#2563EB" />
                        <stop offset="75%" stopColor="#2563EB" />
                        <stop offset="75%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#FFFFFF" />
                      </linearGradient>

                      {/* Animation Styles */}
                      <style>{`
                        @keyframes scooterBob {
                          0%, 100% { transform: translateY(0px) rotate(0deg); }
                          50% { transform: translateY(-5px) rotate(0.4deg); }
                        }
                        @keyframes speedDash {
                          0% { stroke-dashoffset: 60; }
                          100% { stroke-dashoffset: 0; }
                        }
                        @keyframes beaconPulse {
                          0%, 100% { transform: scale(1); opacity: 1; }
                          50% { transform: scale(1.25); opacity: 0.6; }
                        }
                        @keyframes cloudDrift {
                          0%, 100% { transform: translateX(0px); }
                          50% { transform: translateX(12px); }
                        }
                        .animate-scooter {
                          animation: ${prefersReducedMotion ? 'none' : 'scooterBob 2.6s ease-in-out infinite'};
                          transform-origin: 290px 310px;
                        }
                        .animate-dash-road {
                          animation: ${prefersReducedMotion ? 'none' : 'speedDash 1.2s linear infinite'};
                        }
                        .animate-beacon {
                          animation: ${prefersReducedMotion ? 'none' : 'beaconPulse 2s ease-in-out infinite'};
                          transform-origin: 510px 185px;
                        }
                        .animate-clouds {
                          animation: ${prefersReducedMotion ? 'none' : 'cloudDrift 8s ease-in-out infinite'};
                        }
                      `}</style>
                    </defs>

                    {/* ================= BACKGROUND: SKY & INDIAN SOCIETY TOWERS ================= */}
                    {/* Warm Friendly Sun */}
                    <circle cx="90" cy="70" r="38" fill="url(#skySun)" stroke="#0F172A" strokeWidth="2.5" />
                    {/* Sun rays */}
                    <path d="M90 22V14M90 126V118M42 70H34M146 70H138M56 36L50 30M124 104L130 110M56 104L50 110M124 36L130 30" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Fluffy Cartoon Clouds */}
                    <g className="animate-clouds">
                      <path d="M220 50C220 42 226 36 235 36C239 30 248 28 256 32C262 26 274 28 278 35C286 35 292 41 292 49C292 56 286 62 278 62H232C225 62 220 57 220 50Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                      <path d="M430 45C430 39 435 34 442 34C445 29 453 27 460 30C465 25 475 27 478 33C485 33 490 38 490 45C490 51 485 56 478 56H439C434 56 430 51 430 45Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                    </g>

                    {/* Modern Indian High-Rise Apartment Towers */}
                    {/* Tower 1 (Left - Violet/Blue modern block) */}
                    <g>
                      <rect x="40" y="90" width="105" height="230" rx="6" fill="url(#towerGrad1)" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Rooftop pergola architectural detail */}
                      <rect x="52" y="76" width="80" height="14" rx="2" fill="#818CF8" stroke="#0F172A" strokeWidth="2.5" />
                      <line x1="68" y1="76" x2="68" y2="90" stroke="#0F172A" strokeWidth="2" />
                      <line x1="92" y1="76" x2="92" y2="90" stroke="#0F172A" strokeWidth="2" />
                      <line x1="116" y1="76" x2="116" y2="90" stroke="#0F172A" strokeWidth="2" />
                      
                      {/* Balconies with potted plants */}
                      {/* Floor 4 */}
                      <rect x="50" y="105" width="38" height="26" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                      <rect x="94" y="105" width="40" height="26" rx="2" fill="#FEF08A" stroke="#0F172A" strokeWidth="2" />
                      <path d="M48 126H88" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Plant */}
                      <circle cx="82" cy="120" r="5" fill="#10B981" stroke="#0F172A" strokeWidth="1.5" />
                      
                      {/* Floor 3 */}
                      <rect x="50" y="145" width="38" height="26" rx="2" fill="#FEF08A" stroke="#0F172A" strokeWidth="2" />
                      <rect x="94" y="145" width="40" height="26" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                      <path d="M92 166H134" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Potted monstera leaf */}
                      <path d="M98 160C98 155 104 154 105 160Z" fill="#059669" stroke="#0F172A" strokeWidth="1.5" />

                      {/* Floor 2 */}
                      <rect x="50" y="185" width="38" height="26" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                      <rect x="94" y="185" width="40" height="26" rx="2" fill="#FEF08A" stroke="#0F172A" strokeWidth="2" />
                      
                      {/* Floor 1 */}
                      <rect x="50" y="225" width="38" height="26" rx="2" fill="#FEF08A" stroke="#0F172A" strokeWidth="2" />
                      <rect x="94" y="225" width="40" height="26" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                    </g>

                    {/* Tower 2 (Center Background - Tall Yellow/Warm Tower) */}
                    <g>
                      <rect x="155" y="60" width="120" height="260" rx="6" fill="url(#towerGrad2)" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Water Tank on Roof */}
                      <rect x="180" y="44" width="35" height="16" rx="3" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
                      <line x1="197" y1="44" x2="197" y2="38" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="197" cy="36" r="3" fill="#EF4444" stroke="#0F172A" strokeWidth="1.5" />

                      {/* Grid of Balconies and Windows */}
                      {[80, 120, 160, 200, 240].map((y, idx) => (
                        <g key={idx}>
                          <rect x="166" y={y} width="28" height="24" rx="2" fill={idx % 2 === 0 ? "#FFFFFF" : "#FEF08A"} stroke="#0F172A" strokeWidth="1.5" />
                          <rect x="201" y={y} width="28" height="24" rx="2" fill={idx % 3 === 0 ? "#FEF08A" : "#FFFFFF"} stroke="#0F172A" strokeWidth="1.5" />
                          <rect x="236" y={y} width="28" height="24" rx="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
                          {/* Balcony Railing */}
                          <line x1="164" y1={y + 24} x2="266" y2={y + 24} stroke="#0F172A" strokeWidth="2" />
                          {/* Cute hanging creeper plant */}
                          {idx === 1 && (
                            <path d="M170 144Q172 152 176 148Q179 155 183 145" stroke="#10B981" strokeWidth="2" fill="none" />
                          )}
                        </g>
                      ))}
                    </g>

                    {/* Tower 3 (Right - Mint/Green Modern Tower) */}
                    <g>
                      <rect x="285" y="80" width="95" height="240" rx="6" fill="url(#towerGrad3)" stroke="#0F172A" strokeWidth="2.5" />
                      <rect x="295" y="68" width="75" height="12" rx="2" fill="#34D399" stroke="#0F172A" strokeWidth="2" />
                      {[100, 140, 180, 220].map((y, idx) => (
                        <g key={idx}>
                          <rect x="295" y={y} width="34" height="24" rx="2" fill={idx === 1 ? "#FEF08A" : "#FFFFFF"} stroke="#0F172A" strokeWidth="1.5" />
                          <rect x="337" y={y} width="34" height="24" rx="2" fill={idx === 2 ? "#FEF08A" : "#FFFFFF"} stroke="#0F172A" strokeWidth="1.5" />
                        </g>
                      ))}
                    </g>

                    {/* ================= SOCIETY GRAND GATE & PARCEL HUB ================= */}
                    {/* Society Entrance Archway */}
                    <g>
                      {/* Left Gate Pillar */}
                      <rect x="390" y="190" width="22" height="130" rx="3" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
                      <circle cx="401" cy="180" r="8" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
                      {/* Right Gate Pillar */}
                      <rect x="470" y="190" width="22" height="130" rx="3" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
                      <circle cx="481" cy="180" r="8" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />

                      {/* Arched Signboard: "SOCIETY GATE" */}
                      <rect x="380" y="150" width="122" height="28" rx="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
                      <text x="441" y="169" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="900" letterSpacing="0.8">
                        EMERALD TOWERS
                      </text>

                      {/* Red-White Striped Boom Barrier (open) */}
                      <line x1="408" y1="260" x2="455" y2="215" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                      <line x1="418" y1="250" x2="426" y2="242" stroke="#FFFFFF" strokeWidth="6" />
                      <line x1="436" y1="233" x2="444" y2="225" stroke="#FFFFFF" strokeWidth="6" />
                      <circle cx="408" cy="260" r="5" fill="#0F172A" />
                    </g>

                    {/* The Society Parcel Hub (Security / Delivery Reception) */}
                    <g>
                      {/* Hub Cabin Building */}
                      <rect x="495" y="200" width="115" height="120" rx="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Striped Blue-White Awning */}
                      <path d="M490 200L500 185H615L610 200Z" fill="url(#hubAwning)" stroke="#0F172A" strokeWidth="2.5" />
                      
                      {/* Hub Signboard */}
                      <rect x="508" y="172" width="90" height="20" rx="5" fill="#2563EB" stroke="#0F172A" strokeWidth="2" />
                      <text x="553" y="186" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900">
                        📦 PARCEL HUB
                      </text>

                      {/* Pulsing Beacon / Location Pin above Hub */}
                      <g className="animate-beacon">
                        <circle cx="553" cy="150" r="10" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />
                        <circle cx="553" cy="150" r="4" fill="#FFFFFF" />
                        <path d="M553 160L553 170" stroke="#0F172A" strokeWidth="2" />
                      </g>

                      {/* Hub Large Window with Stacked Colored Parcel Boxes */}
                      <rect x="510" y="215" width="85" height="55" rx="4" fill="#E0F2FE" stroke="#0F172A" strokeWidth="2" />
                      {/* Parcel Shelves */}
                      <line x1="510" y1="242" x2="595" y2="242" stroke="#0F172A" strokeWidth="2" />
                      {/* Packages on shelves */}
                      <rect x="516" y="224" width="18" height="16" rx="2" fill="#F97316" stroke="#0F172A" strokeWidth="1.5" />
                      <rect x="538" y="222" width="22" height="18" rx="2" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
                      <rect x="564" y="227" width="16" height="13" rx="2" fill="#3B82F6" stroke="#0F172A" strokeWidth="1.5" />
                      
                      <rect x="518" y="247" width="24" height="20" rx="2" fill="#10B981" stroke="#0F172A" strokeWidth="1.5" />
                      <rect x="548" y="250" width="20" height="17" rx="2" fill="#A855F7" stroke="#0F172A" strokeWidth="1.5" />
                      <rect x="572" y="246" width="18" height="21" rx="2" fill="#F43F5E" stroke="#0F172A" strokeWidth="1.5" />

                      {/* Hub Entrance Door */}
                      <rect x="530" y="278" width="45" height="42" rx="3" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="568" cy="300" r="2.5" fill="#0F172A" />
                    </g>

                    {/* Potted palm tree near entrance */}
                    <g>
                      <path d="M472 320L474 300C465 292 460 280 464 270M474 300C480 290 488 285 492 272M474 300C474 285 476 270 478 266" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <rect x="466" y="308" width="16" height="14" rx="2" fill="#EA580C" stroke="#0F172A" strokeWidth="2" />
                    </g>

                    {/* ================= GROUND ROAD & ROUTE LINE ================= */}
                    {/* Asphalt Road Base */}
                    <rect x="0" y="320" width="620" height="120" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
                    <rect x="0" y="320" width="620" height="12" fill="#475569" />

                    {/* Animated Dashed Road Center Line */}
                    <line 
                      x1="0" 
                      y1="375" 
                      x2="620" 
                      y2="375" 
                      stroke="#FDE047" 
                      strokeWidth="6" 
                      strokeDasharray="25 20" 
                      className="animate-dash-road" 
                    />

                    {/* Dotted Green Curved Arrival Route leading into Hub */}
                    <path 
                      d="M20 365 Q 160 360 240 355 T 440 330 T 540 280" 
                      stroke="#10B981" 
                      strokeWidth="4" 
                      strokeDasharray="8 6" 
                      fill="none" 
                    />

                    {/* Speed / Wind Effect Lines Behind Scooter */}
                    <g stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="60" y1="330" x2="110" y2="330" strokeDasharray="10 5" />
                      <line x1="40" y1="345" x2="95" y2="345" strokeDasharray="8 6" />
                      <line x1="80" y1="360" x2="120" y2="360" strokeDasharray="6 4" />
                    </g>

                    {/* ================= MAIN CHARACTER: RIDER & SCOOTER ================= */}
                    <g className="animate-scooter">
                      
                      {/* Rear Delivery Luggage Rack & Parcel Box */}
                      <g>
                        {/* Branded ParcelFlow Delivery Box */}
                        <rect x="145" y="240" width="70" height="62" rx="8" fill="#2563EB" stroke="#0F172A" strokeWidth="2.5" />
                        <rect x="145" y="254" width="70" height="8" fill="#F97316" stroke="#0F172A" strokeWidth="2" />
                        {/* White ParcelFlow text/logo on box */}
                        <circle cx="180" cy="282" r="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
                        <path d="M174 282L179 287L188 276" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        
                        {/* Parcels sticking out the top */}
                        <rect x="155" y="222" width="24" height="20" rx="3" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
                        <line x1="167" y1="222" x2="167" y2="242" stroke="#EF4444" strokeWidth="2" />
                        <rect x="180" y="228" width="28" height="15" rx="3" fill="#34D399" stroke="#0F172A" strokeWidth="2" />
                      </g>

                      {/* Scooter Rear Wheel */}
                      <circle cx="175" cy="365" r="28" fill="#0F172A" />
                      <circle cx="175" cy="365" r="16" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="175" cy="365" r="7" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
                      {/* Brake Disc */}
                      <circle cx="175" cy="365" r="11" fill="none" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />

                      {/* Scooter Body & Chassis (ParcelFlow Blue & Electric Cyan) */}
                      {/* Rear Mudguard / Fender */}
                      <path d="M142 360C142 340 160 330 195 332L210 350H150Z" fill="url(#scooterBlue)" stroke="#0F172A" strokeWidth="2.5" />
                      
                      {/* Scooter Seat */}
                      <path d="M190 280C190 275 200 270 230 270C250 270 260 278 260 286C240 288 200 288 190 280Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />

                      {/* Scooter Floorboard & Main Frame */}
                      <path d="M185 345L225 345L245 348L280 348L295 315L275 285L225 305L195 330Z" fill="url(#scooterBlue)" stroke="#0F172A" strokeWidth="2.5" />
                      
                      {/* Footrest Floorboard with rubber grip */}
                      <rect x="235" y="342" width="45" height="9" rx="2" fill="#0F172A" />
                      <line x1="242" y1="346" x2="272" y2="346" stroke="#94A3B8" strokeWidth="1.5" />

                      {/* Front Apron / Shield */}
                      <path d="M280 350L305 285L325 280L335 315L310 355Z" fill="url(#scooterBlue)" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Front Badge */}
                      <circle cx="312" cy="305" r="7" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
                      <path d="M312 301V309M308 305H316" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

                      {/* Scooter Front Wheel */}
                      <circle cx="330" cy="365" r="28" fill="#0F172A" />
                      <circle cx="330" cy="365" r="16" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
                      <circle cx="330" cy="365" r="7" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
                      {/* Front Suspension Fork */}
                      <line x1="318" y1="310" x2="330" y2="365" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />

                      {/* Handlebar Stem & Handlebars */}
                      <line x1="305" y1="285" x2="300" y2="245" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M288 245H315" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
                      
                      {/* Headlight & Friendly Light Beam */}
                      <rect x="306" y="240" width="16" height="14" rx="4" fill="#FEF08A" stroke="#0F172A" strokeWidth="2" />
                      {/* Light Beam Cone */}
                      <path d="M322 242L420 220L440 290L322 254Z" fill="#FEF08A" fillOpacity="0.35" />

                      {/* Rear View Mirror */}
                      <circle cx="288" cy="230" r="5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
                      <line x1="288" y1="235" x2="292" y2="245" stroke="#0F172A" strokeWidth="2" />

                      {/* ===== THE DELIVERY HERO CHARACTER ===== */}
                      {/* Legs & Sneakers */}
                      {/* Rear Leg sitting on seat */}
                      <path d="M225 285C225 285 242 305 248 338L262 338C262 338 250 295 235 282Z" fill="#1E3A8A" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Sneaker */}
                      <path d="M245 338H275C277 338 278 344 274 346H242C240 342 242 338 245 338Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                      <rect x="254" y="340" width="8" height="4" fill="#EF4444" />

                      {/* Torso & Branded Uniform Jacket */}
                      {/* Body */}
                      <path d="M210 240C210 215 230 205 255 205C270 205 280 215 282 240L275 285C260 288 230 288 215 285Z" fill="#2563EB" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Orange high-vis stripes on jacket */}
                      <path d="M225 225C240 228 260 228 272 225" stroke="#F97316" strokeWidth="4" strokeLinecap="round" fill="none" />
                      <path d="M220 245C240 250 262 250 276 245" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" fill="none" />
                      
                      {/* White Shirt Collar */}
                      <polygon points="252,206 258,218 246,218" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />

                      {/* Arms & Hands gripping handlebar */}
                      {/* Left Arm extending forward */}
                      <path d="M260 220Q280 230 300 244" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" fill="none" />
                      <path d="M260 220Q280 230 300 244" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      {/* Hand glove gripping */}
                      <circle cx="300" cy="244" r="6" fill="#F97316" stroke="#0F172A" strokeWidth="2" />

                      {/* Friendly Cheerful Face & Head */}
                      {/* Neck */}
                      <rect x="248" y="195" width="14" height="14" rx="2" fill="#FDBA74" stroke="#0F172A" strokeWidth="2" />
                      
                      {/* Head / Face */}
                      <circle cx="258" cy="180" r="20" fill="#FED7AA" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Big Warm Friendly Smile */}
                      <path d="M256 186C256 193 268 193 270 186" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="#FFFFFF" />
                      {/* Rosy Cheeks */}
                      <ellipse cx="250" cy="184" rx="3.5" ry="2.5" fill="#F43F5E" fillOpacity="0.6" />
                      <ellipse cx="270" cy="184" rx="3.5" ry="2.5" fill="#F43F5E" fillOpacity="0.6" />
                      {/* Expressive Cartoon Eye */}
                      <circle cx="264" cy="176" r="3.5" fill="#0F172A" />
                      <circle cx="265" cy="174" r="1.2" fill="#FFFFFF" />
                      {/* Eyebrow */}
                      <path d="M260 170Q265 167 270 170" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />

                      {/* ParcelFlow Branded Delivery Helmet */}
                      <path d="M236 175C236 155 252 145 272 148C284 150 288 160 286 175H236Z" fill="#1D4ED8" stroke="#0F172A" strokeWidth="2.5" />
                      {/* Helmet Orange Visor Rim */}
                      <path d="M242 165Q265 160 288 165" stroke="#F97316" strokeWidth="4" strokeLinecap="round" fill="none" />
                      {/* Helmet Chevron Logo */}
                      <path d="M256 154L262 160L268 154" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      {/* Chin Strap */}
                      <path d="M246 178Q254 195 264 194" stroke="#0F172A" strokeWidth="2" fill="none" />

                      {/* Delivery Backpack Strap */}
                      <path d="M220 220Q226 250 230 270" stroke="#F97316" strokeWidth="4" strokeLinecap="round" fill="none" />
                    </g>

                  </svg>
                </div>

              </div>

              {/* ================= 6 PLAYFUL FLOATING UI STICKERS ================= */}
              
              {/* Sticker 1: Top-Left "📦 Parcel Arrived!" */}
              <div 
                className="absolute -top-5 -left-3 sm:-left-5 cursor-pointer z-20"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'floatSticker1 3.8s ease-in-out infinite'
                }}
                onClick={() => setActiveSticker(activeSticker === 1 ? null : 1)}
              >
                <Sticker 
                  color="yellow" 
                  rotate={-4} 
                  size="md" 
                  shadow="lg"
                  icon={<Package className="w-4 h-4 text-[#0F172A]" />}
                  className="transition-transform hover:scale-110 hover:rotate-0"
                >
                  📦 Parcel Arrived!
                </Sticker>
              </div>

              {/* Sticker 2: Top-Right "🕐 8:00 PM – 8:30 PM" */}
              <div 
                className="absolute -top-5 -right-3 sm:-right-4 cursor-pointer z-20"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'floatSticker2 4.2s ease-in-out infinite 0.6s'
                }}
                onClick={() => setActiveSticker(activeSticker === 2 ? null : 2)}
              >
                <Sticker 
                  color="mint" 
                  rotate={3} 
                  size="md" 
                  shadow="lg"
                  icon={<Clock className="w-4 h-4 text-[#0F172A]" />}
                  className="transition-transform hover:scale-110 hover:rotate-0"
                >
                  🕐 8:00 PM – 8:30 PM
                </Sticker>
              </div>

              {/* Sticker 3: Mid-Left "🔐 Secure Handover" */}
              <div 
                className="absolute top-1/3 -left-4 sm:-left-6 cursor-pointer z-20 hidden sm:block"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'floatSticker1 4.5s ease-in-out infinite 1.2s'
                }}
                onClick={() => setActiveSticker(activeSticker === 3 ? null : 3)}
              >
                <Sticker 
                  color="purple" 
                  rotate={-5} 
                  size="sm" 
                  shadow="md"
                  icon={<ShieldCheck className="w-4 h-4 text-white" />}
                  className="transition-transform hover:scale-110 hover:rotate-0"
                >
                  🔐 Secure Handover
                </Sticker>
              </div>

              {/* Sticker 4: Mid-Right "📍 Society Hub" */}
              <div 
                className="absolute top-1/3 -right-4 sm:-right-6 cursor-pointer z-20"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'floatSticker2 3.9s ease-in-out infinite 0.9s'
                }}
                onClick={() => setActiveSticker(activeSticker === 4 ? null : 4)}
              >
                <Sticker 
                  color="orange" 
                  rotate={-3} 
                  size="sm" 
                  shadow="md"
                  icon={<MapPin className="w-4 h-4 text-white animate-bounce" />}
                  className="transition-transform hover:scale-110 hover:rotate-0"
                >
                  📍 Society Hub
                </Sticker>
              </div>

              {/* Sticker 5: Bottom-Left "✓ Pickup Scheduled" */}
              <div 
                className="absolute -bottom-4 left-4 sm:left-6 cursor-pointer z-20"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'floatSticker1 4.1s ease-in-out infinite 1.8s'
                }}
                onClick={() => setActiveSticker(activeSticker === 5 ? null : 5)}
              >
                <Sticker 
                  color="blue" 
                  rotate={4} 
                  size="md" 
                  shadow="lg"
                  icon={<Check className="w-4 h-4 text-white stroke-[3]" />}
                  className="transition-transform hover:scale-110 hover:rotate-0"
                >
                  ✓ Pickup Scheduled
                </Sticker>
              </div>

              {/* Sticker 6: Bottom-Right "🚚 On the way" */}
              <div 
                className="absolute -bottom-4 right-4 sm:right-6 cursor-pointer z-20"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'floatSticker2 4.4s ease-in-out infinite 1.5s'
                }}
                onClick={() => setActiveSticker(activeSticker === 6 ? null : 6)}
              >
                <Sticker 
                  color="yellow" 
                  rotate={-2} 
                  size="md" 
                  shadow="lg"
                  icon={<Truck className="w-4 h-4 text-[#0F172A]" />}
                  className="transition-transform hover:scale-110 hover:rotate-0"
                >
                  🚚 On the way
                </Sticker>
              </div>

            </div>

            {/* Micro Interactive Slot Bar Beneath the Illustration */}
            <div className="mt-7 bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#0F172A] shadow-cartoon flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-[#0F172A] animate-ping" />
                <span className="font-extrabold text-[#0F172A]">Pick your delivery slot:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {['6:30 PM', '7:15 PM', '8:00 PM', '9:00 PM'].map((time) => {
                  const isSelected = selectedSlot.startsWith(time.split(' ')[0]);
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedSlot(`${time} – ${parseInt(time) + 1}:00 PM`)}
                      className={`px-2.5 py-1 rounded-lg font-bold border-2 border-[#0F172A] transition-all text-xs ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0F172A] -translate-y-0.5' 
                          : 'bg-[#FAF7F2] text-slate-800 hover:bg-amber-100 shadow-[1px_1px_0px_#0F172A]'
                      }`}
                    >
                      {time} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Sticker Keyframe Styles */}
      <style>{`
        @keyframes floatSticker1 {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-7px) rotate(-1deg); }
        }
        @keyframes floatSticker2 {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
      `}</style>
    </section>
  );
};
