import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Coffee, 
  ShieldCheck, 
  Building2, 
  Package, 
  Smartphone,
  ChevronRight,
  Smile,
  Frown,
  Zap
} from 'lucide-react';
import { Sticker } from './Sticker';

export const ProblemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'chaos' | 'flow'>('both');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [activeThought, setActiveThought] = useState<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Cycle through the thoughts automatically
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setActiveThought((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <section className="relative py-20 lg:py-32 bg-[#FEF9F3] text-[#0A1128] border-b-[3px] border-[#0A1128] overflow-hidden">
      {/* Background paper grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(10, 17, 40, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(10, 17, 40, 0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center">
            <Sticker 
              color="orange" 
              rotate="slight-left" 
              size="md" 
              shadow="md"
              icon={<span className="text-base">🤯</span>}
            >
              The Daily Delivery Struggle
            </Sticker>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A1128] leading-tight">
            We've all been there.
          </h2>

          <p className="text-lg sm:text-xl font-medium text-slate-700 leading-relaxed">
            That dreaded notification pops up at 8:30 AM: <br className="hidden sm:inline" />
            <span className="font-extrabold text-[#0A1128] bg-amber-200/80 px-2 py-0.5 rounded-md border border-[#0A1128]">
              "Your delivery partner is arriving today."
            </span>{' '}
            And your entire day turns into a stressful guessing game.
          </p>

          {/* Interactive Switcher for Mobile / Desktop focus */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="inline-flex p-1.5 rounded-2xl bg-white border-2 border-[#0A1128] shadow-cartoon-sm">
              <button
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                  activeTab === 'both'
                    ? 'bg-amber-400 text-[#0A1128] border-2 border-[#0A1128] shadow-cartoon-sm -translate-y-0.5'
                    : 'text-slate-600 hover:text-[#0A1128]'
                }`}
              >
                Compare Side-by-Side ⚖️
              </button>
              <button
                onClick={() => setActiveTab('chaos')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                  activeTab === 'chaos'
                    ? 'bg-rose-500 text-white border-2 border-[#0A1128] shadow-cartoon-sm -translate-y-0.5'
                    : 'text-slate-600 hover:text-[#0A1128]'
                }`}
              >
                The Chaos 😭
              </button>
              <button
                onClick={() => setActiveTab('flow')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                  activeTab === 'flow'
                    ? 'bg-emerald-500 text-white border-2 border-[#0A1128] shadow-cartoon-sm -translate-y-0.5'
                    : 'text-slate-600 hover:text-[#0A1128]'
                }`}
              >
                With ParcelFlow ✨
              </button>
            </div>
          </div>
        </div>

        {/* ================= MAIN COMPARISON ARENA ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* ================= LEFT CARD: THE CHAOS (BEFORE PARCELFLOW) ================= */}
          {(activeTab === 'both' || activeTab === 'chaos') && (
            <div className="relative rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-cartoon-xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden group">
              
              {/* Card Banner */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
                <div className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-[#0A1128] animate-ping" />
                  <span className="font-black text-base sm:text-lg text-rose-600 uppercase tracking-wider">
                    Without ParcelFlow
                  </span>
                </div>
                <Sticker color="red" size="sm" rotate={2} shadow="sm">
                  Panic Mode 🚨
                </Sticker>
              </div>

              {/* The Stressed Resident Cartoon Illustration */}
              <div className="my-5 relative w-full bg-rose-50/70 rounded-2xl border-2 border-[#0A1128] p-4 overflow-hidden flex flex-col items-center justify-center">
                
                {/* Comic Jagged "Bro... WHEN?!" Bubble */}
                <div 
                  className="absolute top-3 right-4 z-20 cursor-pointer"
                  style={{
                    animation: prefersReducedMotion ? 'none' : 'calloutShake 2.4s ease-in-out infinite'
                  }}
                >
                  <div className="relative bg-amber-300 text-rose-600 font-black text-sm sm:text-base px-4 py-2 rounded-2xl border-2 border-[#0A1128] shadow-cartoon rotate-6">
                    <span className="text-[#0A1128]">Bro... </span>
                    <span className="text-rose-600 text-lg">WHEN?! 🤯</span>
                    {/* Speech bubble pointer */}
                    <div className="absolute -bottom-2.5 left-4 w-4 h-4 bg-amber-300 border-r-2 border-b-2 border-[#0A1128] rotate-45" />
                  </div>
                </div>

                {/* SVG Illustration: Stressed resident at desk staring at phone */}
                <div className="w-full flex items-center justify-center py-2">
                  <svg 
                    viewBox="0 0 460 290" 
                    className="w-full max-w-[420px] h-auto drop-shadow-sm select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <style>{`
                        @keyframes sweatDrop {
                          0%, 100% { transform: translateY(0px); opacity: 1; }
                          50% { transform: translateY(6px); opacity: 0.3; }
                        }
                        @keyframes phoneBuzz {
                          0%, 100% { transform: rotate(-5deg); }
                          25% { transform: rotate(5deg); }
                          50% { transform: rotate(-4deg); }
                          75% { transform: rotate(4deg); }
                        }
                        @keyframes tangledDash {
                          0% { stroke-dashoffset: 40; }
                          100% { stroke-dashoffset: 0; }
                        }
                        .animate-sweat {
                          animation: ${prefersReducedMotion ? 'none' : 'sweatDrop 1.6s ease-in-out infinite'};
                        }
                        .animate-buzz {
                          animation: ${prefersReducedMotion ? 'none' : 'phoneBuzz 0.25s ease-in-out infinite'};
                          transform-origin: 320px 190px;
                        }
                        .animate-tangled {
                          animation: ${prefersReducedMotion ? 'none' : 'tangledDash 1.5s linear infinite'};
                        }
                      `}</style>
                    </defs>

                    {/* Chaotic tangled background scribble */}
                    <path 
                      d="M20 50 Q 80 15 130 90 T 220 40 T 320 120 T 420 50 Q 400 130 330 140 T 180 160 T 60 120" 
                      fill="none" 
                      stroke="#FDA4AF" 
                      strokeWidth="3.5" 
                      strokeDasharray="6 4" 
                      className="animate-tangled" 
                    />

                    {/* Comic Stress Stars and Sparks */}
                    <text x="140" y="70" fontSize="18">⚡</text>
                    <text x="280" y="80" fontSize="18">❓</text>
                    <text x="100" y="110" fontSize="16">❗</text>

                    {/* Desk & Chair */}
                    <rect x="50" y="195" width="360" height="14" rx="3" fill="#D97706" stroke="#0A1128" strokeWidth="2.5" />
                    <line x1="80" y1="209" x2="80" y2="280" stroke="#0A1128" strokeWidth="3.5" />
                    <line x1="380" y1="209" x2="380" y2="280" stroke="#0A1128" strokeWidth="3.5" />

                    {/* Laptop with "Q4 Review Call" on desk */}
                    <rect x="110" y="145" width="70" height="50" rx="3" fill="#64748B" stroke="#0A1128" strokeWidth="2.5" />
                    <rect x="115" y="150" width="60" height="38" rx="2" fill="#0A1128" />
                    {/* Red mic muted dot on laptop */}
                    <circle cx="125" cy="160" r="3" fill="#EF4444" />
                    <rect x="132" y="158" width="36" height="4" rx="1" fill="#FFFFFF" />
                    <rect x="125" y="168" width="45" height="3" rx="1" fill="#94A3B8" />
                    {/* Laptop Base */}
                    <polygon points="98,195 192,195 180,198 110,198" fill="#94A3B8" stroke="#0A1128" strokeWidth="2" />

                    {/* Spilled / Knocked Coffee Mug */}
                    <ellipse cx="90" cy="192" rx="8" ry="4" fill="#E2E8F0" stroke="#0A1128" strokeWidth="1.5" />
                    <path d="M82 192L84 178H96L98 192Z" fill="#E2E8F0" stroke="#0A1128" strokeWidth="2" />
                    {/* Coffee spill puddle */}
                    <path d="M70 195Q80 192 90 195Q105 198 95 200Z" fill="#78350F" />

                    {/* Buzzing Smartphone on desk */}
                    <g className="animate-buzz">
                      <rect x="305" y="160" width="34" height="60" rx="6" fill="#1E293B" stroke="#0A1128" strokeWidth="2.5" />
                      <rect x="308" y="166" width="28" height="48" rx="3" fill="#EF4444" />
                      {/* Incoming Call Icon */}
                      <circle cx="322" cy="182" r="8" fill="#FFFFFF" />
                      <path d="M318 182C318 180 324 180 326 182" stroke="#EF4444" strokeWidth="2" fill="none" />
                      {/* Buzz soundwaves */}
                      <path d="M300 170Q296 180 300 190" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                      <path d="M344 170Q348 180 344 190" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                    </g>

                    {/* STRESSED RESIDENT CHARACTER */}
                    {/* Torso */}
                    <rect x="195" y="160" width="55" height="50" rx="8" fill="#3B82F6" stroke="#0A1128" strokeWidth="2.5" />
                    
                    {/* Panic Hands On Head */}
                    <path d="M190 165Q180 130 200 115" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" fill="none" />
                    <path d="M190 165Q180 130 200 115" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="202" cy="114" r="5" fill="#FDBA74" stroke="#0A1128" strokeWidth="1.5" />

                    <path d="M255 165Q265 130 245 115" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" fill="none" />
                    <path d="M255 165Q265 130 245 115" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="243" cy="114" r="5" fill="#FDBA74" stroke="#0A1128" strokeWidth="1.5" />

                    {/* Head */}
                    <circle cx="222" cy="130" r="26" fill="#FED7AA" stroke="#0A1128" strokeWidth="2.5" />
                    
                    {/* Disheveled Messy Hair */}
                    <path d="M196 122C196 100 215 95 222 95C230 95 248 100 248 122L244 112L235 115L228 108L220 114L212 108L205 115Z" fill="#1E293B" stroke="#0A1128" strokeWidth="2" />

                    {/* Wide Stressed Eyes (Spirals / Dots) */}
                    <circle cx="212" cy="128" r="5" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
                    <circle cx="212" cy="128" r="2.5" fill="#EF4444" />
                    <circle cx="232" cy="128" r="5" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
                    <circle cx="232" cy="128" r="2.5" fill="#EF4444" />

                    {/* Comical Wavy Panicked Mouth */}
                    <path d="M212 144Q216 140 220 144Q224 148 228 144Q232 140 236 144" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                    {/* Animated Sweat Droplets */}
                    <g className="animate-sweat">
                      <path d="M246 118C246 123 252 125 252 118C252 112 246 114 246 118Z" fill="#38BDF8" stroke="#0A1128" strokeWidth="1.5" />
                      <path d="M194 124C194 128 198 130 198 124C198 120 194 121 194 124Z" fill="#38BDF8" stroke="#0A1128" strokeWidth="1.5" />
                    </g>
                  </svg>
                </div>

                {/* Simulated Delivery SMS Alert Card */}
                <div className="w-full bg-white p-3 rounded-xl border-2 border-[#0A1128] shadow-cartoon-sm flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 border border-[#0A1128] flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4 text-rose-600 animate-bounce" />
                    </div>
                    <div>
                      <div className="font-black text-[#0A1128]">Courier: "Sir main gate pe khada hu!"</div>
                      <div className="text-slate-600 text-[11px]">"2 min me aao warna OTP return kar raha hu."</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-rose-600 shrink-0">12:47 PM</span>
                </div>
              </div>

              {/* 3 Floating Thought Bubbles (Rotates automatically or click) */}
              <div className="space-y-2.5 pt-2">
                <p className="font-black text-xs uppercase tracking-wider text-slate-500">
                  The Three Horrible Possibilities:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { time: '9:00 AM?', sub: 'During your sprint standup meeting' },
                    { time: '2:00 PM?', sub: 'Deep in client sales pitch presentation' },
                    { time: '7:30 PM?', sub: 'Stuck on flyover in gridlock traffic' },
                  ].map((thought, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveThought(idx)}
                      className={`p-2.5 rounded-xl border-2 border-[#0A1128] transition-all cursor-pointer ${
                        activeThought === idx
                          ? 'bg-amber-100 shadow-cartoon -translate-y-0.5'
                          : 'bg-slate-50 shadow-[1px_1px_0px_#0A1128] opacity-75'
                      }`}
                    >
                      <div className="font-black text-sm text-[#0A1128] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        <span>{thought.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">{thought.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= RIGHT CARD: THE RELIEF (WITH PARCELFLOW) ================= */}
          {(activeTab === 'both' || activeTab === 'flow') && (
            <div className="relative rounded-3xl bg-white border-[3px] border-[#0A1128] shadow-cartoon-xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden group">
              
              {/* Card Banner */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
                <div className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-[#0A1128] animate-ping" />
                  <span className="font-black text-base sm:text-lg text-emerald-600 uppercase tracking-wider">
                    Then ParcelFlow Happened ✨
                  </span>
                </div>
                <Sticker color="mint" size="sm" rotate={-2} shadow="sm">
                  100% Peace of Mind ☕
                </Sticker>
              </div>

              {/* The Relaxed Resident Cartoon Illustration */}
              <div className="my-5 relative w-full bg-emerald-50/70 rounded-2xl border-2 border-[#0A1128] p-4 overflow-hidden flex flex-col items-center justify-center">
                
                {/* Floating "Pickup at 8 PM ✓" Sticker */}
                <div 
                  className="absolute top-3 right-4 z-20"
                  style={{
                    animation: prefersReducedMotion ? 'none' : 'calloutFloat 3s ease-in-out infinite'
                  }}
                >
                  <Sticker 
                    color="yellow" 
                    rotate={-4} 
                    size="sm" 
                    shadow="md"
                    icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  >
                    Picked: 8:00 PM ✓
                  </Sticker>
                </div>

                {/* SVG Illustration: Relaxed resident enjoying coffee & smiling */}
                <div className="w-full flex items-center justify-center py-2">
                  <svg 
                    viewBox="0 0 460 290" 
                    className="w-full max-w-[420px] h-auto drop-shadow-sm select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <style>{`
                        @keyframes steamRise {
                          0% { transform: translateY(0px); opacity: 0; }
                          50% { opacity: 0.8; }
                          100% { transform: translateY(-10px); opacity: 0; }
                        }
                        @keyframes cleanPathFlow {
                          0% { stroke-dashoffset: 30; }
                          100% { stroke-dashoffset: 0; }
                        }
                        .animate-steam {
                          animation: ${prefersReducedMotion ? 'none' : 'steamRise 2s ease-out infinite'};
                        }
                        .animate-clean-path {
                          animation: ${prefersReducedMotion ? 'none' : 'cleanPathFlow 1s linear infinite'};
                        }
                      `}</style>
                    </defs>

                    {/* Clean Organized Pathway in Background */}
                    <path 
                      d="M30 60 H 430" 
                      fill="none" 
                      stroke="#86EFAC" 
                      strokeWidth="5" 
                      strokeDasharray="10 8" 
                      className="animate-clean-path" 
                    />

                    {/* Happy Stars / Sparkles */}
                    <text x="80" y="80" fontSize="18">✨</text>
                    <text x="360" y="70" fontSize="18">🌱</text>
                    <text x="280" y="60" fontSize="18">⭐</text>

                    {/* Potted Plant on Desk */}
                    <rect x="70" y="165" width="22" height="25" rx="3" fill="#EA580C" stroke="#0A1128" strokeWidth="2" />
                    <path d="M81 165Q70 145 60 148Q70 155 81 165" fill="#10B981" stroke="#0A1128" strokeWidth="1.5" />
                    <path d="M81 165Q92 145 102 148Q92 155 81 165" fill="#059669" stroke="#0A1128" strokeWidth="1.5" />

                    {/* Neat Wooden Desk */}
                    <rect x="50" y="195" width="360" height="14" rx="3" fill="#FBBF24" stroke="#0A1128" strokeWidth="2.5" />
                    <line x1="80" y1="209" x2="80" y2="280" stroke="#0A1128" strokeWidth="3.5" />
                    <line x1="380" y1="209" x2="380" y2="280" stroke="#0A1128" strokeWidth="3.5" />

                    {/* Laptop Screen with Green "Tasks Finished" */}
                    <rect x="120" y="145" width="70" height="50" rx="3" fill="#64748B" stroke="#0A1128" strokeWidth="2.5" />
                    <rect x="125" y="150" width="60" height="38" rx="2" fill="#F0FDF4" />
                    <circle cx="155" cy="165" r="8" fill="#10B981" />
                    <path d="M152 165L154 167L158 162" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <polygon points="108,195 202,195 190,198 120,198" fill="#94A3B8" stroke="#0A1128" strokeWidth="2" />

                    {/* Calm Phone on Desk Showing ParcelFlow Checkmark */}
                    <rect x="310" y="165" width="34" height="60" rx="6" fill="#1E293B" stroke="#0A1128" strokeWidth="2.5" />
                    <rect x="313" y="171" width="28" height="48" rx="3" fill="#10B981" />
                    <rect x="318" y="180" width="18" height="12" rx="2" fill="#FFFFFF" />
                    <text x="327" y="189" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0A1128">📦</text>
                    <rect x="318" y="196" width="18" height="4" rx="1" fill="#FFFFFF" />

                    {/* RELAXED RESIDENT CHARACTER */}
                    {/* Comfortable Ergonomic Chair Back */}
                    <rect x="200" y="120" width="60" height="85" rx="12" fill="#CBD5E1" stroke="#0A1128" strokeWidth="2.5" />
                    
                    {/* Torso in Comfortable Mint Shirt */}
                    <rect x="205" y="160" width="50" height="50" rx="8" fill="#10B981" stroke="#0A1128" strokeWidth="2.5" />

                    {/* Arm Holding Coffee Mug */}
                    <path d="M255 170Q275 165 270 185" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" fill="none" />
                    <path d="M255 170Q275 165 270 185" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" fill="none" />
                    
                    {/* Hot Steaming Ceramic Coffee Mug */}
                    <rect x="265" y="178" width="16" height="18" rx="3" fill="#FFFFFF" stroke="#0A1128" strokeWidth="2" />
                    <path d="M281 182Q287 186 281 191" stroke="#0A1128" strokeWidth="2" fill="none" />
                    {/* Animated Steam */}
                    <g className="animate-steam">
                      <path d="M270 174Q273 168 271 164" stroke="#94A3B8" strokeWidth="2" fill="none" />
                      <path d="M276 174Q279 168 277 164" stroke="#94A3B8" strokeWidth="2" fill="none" />
                    </g>

                    {/* Peaceful Head with Smile & Cool Glasses */}
                    <circle cx="230" cy="130" r="25" fill="#FED7AA" stroke="#0A1128" strokeWidth="2.5" />
                    
                    {/* Neat Combed Hair */}
                    <path d="M205 125C205 105 220 100 230 100C240 100 255 105 255 125H205Z" fill="#1E293B" stroke="#0A1128" strokeWidth="2" />

                    {/* Chill Sunglasses / Peaceful Happy Eyes */}
                    <rect x="218" y="122" width="11" height="8" rx="2" fill="#0A1128" />
                    <rect x="233" y="122" width="11" height="8" rx="2" fill="#0A1128" />
                    <line x1="229" y1="125" x2="233" y2="125" stroke="#0A1128" strokeWidth="2" />

                    {/* Happy Big Relaxed Smile */}
                    <path d="M222 140C222 148 238 148 238 140" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" fill="#FFFFFF" />

                    {/* Rosy Cheeks */}
                    <ellipse cx="216" cy="138" rx="3" ry="2" fill="#F43F5E" fillOpacity="0.6" />
                    <ellipse cx="244" cy="138" rx="3" ry="2" fill="#F43F5E" fillOpacity="0.6" />
                  </svg>
                </div>

                {/* Calm ParcelFlow Status Bar */}
                <div className="w-full bg-white p-3 rounded-xl border-2 border-[#0A1128] shadow-cartoon-sm flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-[#0A1128] flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-black text-[#0A1128]">Parcel safely checked into Society Hub!</div>
                      <div className="text-slate-600 text-[11px]">Stored securely. Ready when you arrive home.</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-600 shrink-0">Ready ✓</span>
                </div>
              </div>

              {/* Straightened Organized 4-Step Route: Courier → Society Hub → Choose Time → Secure Handover */}
              <div className="space-y-2.5 pt-2">
                <p className="font-black text-xs uppercase tracking-wider text-slate-500">
                  The Organized Straightened Route:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { step: '01', title: 'Courier Gate', icon: '🚚', bg: 'bg-blue-100' },
                    { step: '02', title: 'Society Hub', icon: '🏢', bg: 'bg-amber-100' },
                    { step: '03', title: 'Choose Time', icon: '📱', bg: 'bg-purple-100' },
                    { step: '04', title: 'Secure Handover', icon: '🔐', bg: 'bg-emerald-100' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border-2 border-[#0A1128] shadow-cartoon-sm ${item.bg} flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-slate-700">
                        <span>{item.step}</span>
                        <span className="text-sm">{item.icon}</span>
                      </div>
                      <div className="font-extrabold text-[#0A1128] text-xs mt-1">
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ================= BIG VISUAL TRANSITION BANNER ================= */}
        <div className="mt-14 relative bg-amber-300 rounded-3xl border-[3px] border-[#0A1128] shadow-cartoon-xl p-6 sm:p-8 overflow-hidden text-center">
          {/* Decorative Background Doodles */}
          <div className="absolute top-2 left-4 text-2xl select-none opacity-40">✨</div>
          <div className="absolute bottom-2 right-4 text-2xl select-none opacity-40">🚀</div>
          <div className="absolute top-3 right-1/4 text-2xl select-none opacity-30">📦</div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center">
              <Sticker color="blue" size="sm" rotate={-2} shadow="md">
                ⚡ The Golden Rule of Deliveries
              </Sticker>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1128]">
              Delivery people have schedules. <br className="hidden sm:inline" />
              So do you. ParcelFlow syncs both.
            </h3>

            <p className="text-base sm:text-lg font-bold text-slate-800 max-w-2xl mx-auto">
              No more interrupting meetings. No more packages dumped at the guard cabin. Collect your delivery with a single 10-second OTP when you're genuinely ready.
            </p>

            <div className="pt-2">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0A1128] font-black text-base border-2 border-[#0A1128] shadow-cartoon hover:-translate-y-0.5 hover:shadow-cartoon-lg transition-all"
              >
                <span>See the 4-step delivery journey</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Comic Callout Keyframes */}
      <style>{`
        @keyframes calloutShake {
          0%, 100% { transform: rotate(5deg) scale(1); }
          50% { transform: rotate(8deg) scale(1.04); }
        }
        @keyframes calloutFloat {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50% { transform: translateY(-5px) rotate(-2deg); }
        }
      `}</style>
    </section>
  );
};
