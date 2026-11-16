import React, { useState } from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  Sliders, 
  ArrowRight,
  Smile,
  Frown,
  PackageX,
  PackageCheck
} from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'without' | 'with'>('both');

  return (
    <section id="comparison" className="relative py-20 sm:py-28 bg-[#FAF7F2] text-slate-900 overflow-hidden border-b-2 border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-300 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] text-slate-900 text-xs sm:text-sm font-black uppercase tracking-wider mb-4 -rotate-1 hover:rotate-0 transition-transform">
            <Sliders className="w-4 h-4 text-slate-900" />
            <span>The Reality Check</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Delivery anxiety? <br />
            <span className="relative inline-block text-rose-500">
              Never again.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            See how ParcelFlow transforms daily delivery panic into a predictable, scheduled evening walk.
          </p>

          {/* Quick Filter Buttons */}
          <div className="inline-flex items-center gap-1.5 mt-8 p-1.5 bg-white rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A]">
            <button
              type="button"
              onClick={() => setActiveTab('both')}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${
                activeTab === 'both' ? 'bg-amber-300 text-slate-900 border border-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('without')}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${
                activeTab === 'without' ? 'bg-rose-400 text-white border border-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Without ParcelFlow 😭
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('with')}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${
                activeTab === 'with' ? 'bg-emerald-400 text-slate-900 border border-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              With ParcelFlow 😎
            </button>
          </div>
        </div>

        {/* Comic Strip Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: WITHOUT PARCELFLOW (Chaotic & Stressed) */}
          {(activeTab === 'both' || activeTab === 'without') && (
            <div className="bg-rose-50/80 rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between relative overflow-hidden">
              {/* Comic Banner Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="px-3.5 py-1.5 text-xs font-black rounded-full bg-rose-500 text-white border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>WITHOUT PARCELFLOW</span>
                </span>
                <span className="text-3xl">😭</span>
              </div>

              {/* Comic Dialogue Scene */}
              <div className="space-y-4 my-2">
                {/* Speech Bubble 1: Courier */}
                <div className="relative bg-white rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] max-w-[85%] self-start">
                  <div className="text-[10px] font-black uppercase text-rose-600 mb-0.5">📞 Courier (Call #4 at 2:15 PM):</div>
                  <p className="text-sm font-black text-slate-900">
                    "Sir, I am standing at gate. Please come down right now or I return parcel!"
                  </p>
                </div>

                {/* Speech Bubble 2: Resident Panicking */}
                <div className="relative bg-rose-200 rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] max-w-[85%] ml-auto">
                  <div className="text-[10px] font-black uppercase text-slate-800 mb-0.5">😰 You (In Important Meeting):</div>
                  <p className="text-sm font-black text-slate-900">
                    "Bhaiya, I am at work! Can you give to flat 402 neighbor or leave outside door?"
                  </p>
                </div>

                {/* Speech Bubble 3: Courier Result */}
                <div className="relative bg-white rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] max-w-[85%] self-start">
                  <div className="text-[10px] font-black uppercase text-rose-600 mb-0.5">📦 Courier:</div>
                  <p className="text-sm font-black text-slate-900">
                    "Neighbor not opening door sir. I am throwing package behind flower pot."
                  </p>
                </div>
              </div>

              {/* Cartoon Illustration: Stressed Character & Stolen Box */}
              <div className="my-6 bg-white rounded-2xl p-4 border-2 border-slate-900/60">
                <svg viewBox="0 0 300 130" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="150" cy="118" rx="120" ry="8" fill="#0F172A" opacity="0.1" />
                  
                  {/* Stressed Character at Office */}
                  <g transform="translate(40, 20)">
                    <circle cx="35" cy="35" r="22" fill="#FED7AA" stroke="#0F172A" strokeWidth="2.5" />
                    {/* Sweating tear */}
                    <path d="M58 20 C60 16 63 16 65 20 C65 24 58 24 58 20 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="1" />
                    {/* Crying eyes */}
                    <path d="M25 35 Q29 30 33 35" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M41 35 Q45 30 49 35" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Open sad mouth */}
                    <ellipse cx="37" cy="46" rx="6" ry="7" fill="#0F172A" />
                    {/* Buzzing phone vibrating */}
                    <rect x="68" y="30" width="22" height="38" rx="4" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />
                    <line x1="72" y1="36" x2="86" y2="36" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="72" y1="42" x2="82" y2="42" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="79" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">RING!</text>
                  </g>

                  {/* Damaged box behind shoe rack */}
                  <g transform="translate(180, 45)">
                    {/* Flower pot */}
                    <polygon points="20,70 60,70 50,30 30,30" fill="#EA580C" stroke="#0F172A" strokeWidth="2" />
                    <circle cx="40" cy="22" r="14" fill="#16A34A" stroke="#0F172A" strokeWidth="2" />
                    {/* Box hidden behind pot */}
                    <rect x="52" y="36" width="40" height="34" rx="3" fill="#FDBA74" stroke="#0F172A" strokeWidth="2" />
                    <line x1="60" y1="46" x2="82" y2="60" stroke="#DC2626" strokeWidth="2" />
                    <text x="72" y="54" textAnchor="middle" fill="#DC2626" fontSize="8" fontWeight="bold">LOST?</text>
                  </g>
                </svg>
              </div>

              {/* Frustrations List */}
              <div className="space-y-2 border-t-2 border-slate-900/20 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                  <span className="text-rose-600">❌</span> 5+ sudden phone calls during your workday.
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                  <span className="text-rose-600">❌</span> Package dumped on door mat or behind plants.
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                  <span className="text-rose-600">❌</span> Constant risk of stolen or damaged deliveries.
                </div>
              </div>
            </div>
          )}

          {/* Card 2: WITH PARCELFLOW (Calm, Scheduled & Happy) */}
          {(activeTab === 'both' || activeTab === 'with') && (
            <div className="bg-emerald-50/80 rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-[6px_6px_0px_#0F172A] flex flex-col justify-between relative overflow-hidden">
              {/* Comic Banner Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="px-3.5 py-1.5 text-xs font-black rounded-full bg-emerald-500 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  <span>WITH PARCELFLOW</span>
                </span>
                <span className="text-3xl">😎</span>
              </div>

              {/* Comic Dialogue Scene */}
              <div className="space-y-4 my-2">
                {/* Speech Bubble 1: Silent Notification */}
                <div className="relative bg-white rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] max-w-[85%] self-start">
                  <div className="text-[10px] font-black uppercase text-emerald-700 mb-0.5">🔔 Silent Notification (1:15 PM):</div>
                  <p className="text-sm font-black text-slate-900">
                    "Parcel safely logged at Society Gate Hub (Tower B • Shelf 2). Choose your pickup time."
                  </p>
                </div>

                {/* Speech Bubble 2: Resident Relaxed */}
                <div className="relative bg-emerald-200 rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] max-w-[85%] ml-auto">
                  <div className="text-[10px] font-black uppercase text-slate-800 mb-0.5">😌 You (1-Tap Selection):</div>
                  <p className="text-sm font-black text-slate-900">
                    "Book pickup window for 8:00 PM after gym session. ✓"
                  </p>
                </div>

                {/* Speech Bubble 3: Society Hub Handover */}
                <div className="relative bg-white rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] max-w-[85%] self-start">
                  <div className="text-[10px] font-black uppercase text-emerald-700 mb-0.5">🔐 Hub Handover (8:02 PM):</div>
                  <p className="text-sm font-black text-slate-900">
                    "QR scanned. OTP verified. Here is your package, have a great evening!"
                  </p>
                </div>
              </div>

              {/* Cartoon Illustration: Smiling Character with Box */}
              <div className="my-6 bg-white rounded-2xl p-4 border-2 border-slate-900/60">
                <svg viewBox="0 0 300 130" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="150" cy="118" rx="120" ry="8" fill="#0F172A" opacity="0.1" />
                  
                  {/* Happy Character with Sunglasses */}
                  <g transform="translate(60, 20)">
                    <circle cx="35" cy="35" r="22" fill="#FED7AA" stroke="#0F172A" strokeWidth="2.5" />
                    {/* Cool sunglasses */}
                    <rect x="22" y="30" width="11" height="8" rx="2" fill="#0F172A" />
                    <rect x="37" y="30" width="11" height="8" rx="2" fill="#0F172A" />
                    <line x1="33" y1="34" x2="37" y2="34" stroke="#0F172A" strokeWidth="2" />
                    {/* Confident Smile */}
                    <path d="M28 44 Q35 52 42 44" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Thumbs Up Hand */}
                    <circle cx="68" cy="50" r="10" fill="#FED7AA" stroke="#0F172A" strokeWidth="2" />
                    <text x="68" y="54" textAnchor="middle" fontSize="11">👍</text>
                  </g>

                  {/* Organized Society Hub Rack with Verified Parcel */}
                  <g transform="translate(160, 30)">
                    <rect x="10" y="10" width="100" height="75" rx="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
                    <line x1="10" y1="48" x2="110" y2="48" stroke="#0F172A" strokeWidth="2" />
                    {/* Boxes on shelves */}
                    <rect x="18" y="18" width="26" height="22" rx="3" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
                    <rect x="52" y="18" width="28" height="22" rx="3" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
                    {/* Verified glowing box */}
                    <rect x="24" y="54" width="34" height="24" rx="4" fill="#34D399" stroke="#0F172A" strokeWidth="2" />
                    <text x="41" y="69" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="bold">8 PM ✓</text>
                  </g>
                </svg>
              </div>

              {/* Benefits List */}
              <div className="space-y-2 border-t-2 border-slate-900/20 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <span className="text-emerald-700">✓</span> Zero calls interrupting your meetings or commute.
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <span className="text-emerald-700">✓</span> Safely stored on high-security racks with camera monitoring.
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <span className="text-emerald-700">✓</span> 10-second pickup with dynamic OTP or QR code.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Funny Summary Pill */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-300 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] text-slate-900 font-black text-sm">
            <span>Stop running for couriers. Let your parcels wait for you.</span>
            <span className="text-lg">📦✨</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ComparisonSection;
