import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Warehouse,
  CheckCircle2
} from 'lucide-react';

export const IndiaFirstSection: React.FC = () => {
  const [activeCity, setActiveCity] = useState<'bengaluru' | 'mumbai' | 'gurugram' | 'hyderabad'>('bengaluru');

  const cityData = {
    bengaluru: {
      name: 'Bengaluru Tech Corridor',
      emoji: '🌳',
      exampleSociety: 'Greenwood Regency (1,420 Flats)',
      dailyParcels: '280+ parcels/day',
      topCouriers: 'Amazon, Flipkart, Blinkit, Myntra, BlueDart',
      gateSaving: '42 hours of guard intercom time saved/month'
    },
    mumbai: {
      name: 'Mumbai High-Rise Clusters',
      emoji: '🌊',
      exampleSociety: 'Lodha Horizon Towers (850 Flats)',
      dailyParcels: '210+ parcels/day',
      topCouriers: 'Amazon Prime, Zepto, Swiggy Instamart, Delhivery',
      gateSaving: 'Zero delivery bikes circling narrow parking ramps'
    },
    gurugram: {
      name: 'Gurugram Golf Course Ext.',
      emoji: '🏙️',
      exampleSociety: 'DLF Crest Parklands (1,150 Flats)',
      dailyParcels: '310+ parcels/day',
      topCouriers: 'Amazon, Myntra, BlueDart, DTDC, Zara',
      gateSaving: '95% reduction in gate boom-barrier queue congestion'
    },
    hyderabad: {
      name: 'Hyderabad Financial District',
      emoji: '💎',
      exampleSociety: 'My Home Bhooja (1,800 Flats)',
      dailyParcels: '360+ parcels/day',
      topCouriers: 'Amazon, Flipkart, Shadowfax, Delhivery',
      gateSaving: 'Complete digital audit logs for 4 gated security gates'
    }
  };

  const selectedData = cityData[activeCity];

  return (
    <section className="relative py-20 sm:py-28 bg-[#FEF9F3] text-[#0A1128] overflow-hidden border-b-2 border-[#0A1128]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-300 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-[#0A1128] text-xs sm:text-sm font-black uppercase tracking-wider mb-4 -rotate-1 hover:rotate-0 transition-transform">
            <Warehouse className="w-4 h-4 text-[#0A1128]" />
            <span>Built For Indian Realities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1128] tracking-tight leading-tight">
            Designed specifically for <br />
            <span className="relative inline-block text-blue-600">
              high-density apartment living.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            From 1,500+ flat high-rises in Bengaluru to gated townships in Gurugram, Indian communities receive hundreds of packages daily from 15+ carriers.
          </p>
        </div>

        {/* City Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {(Object.keys(cityData) as Array<keyof typeof cityData>).map((cityKey) => (
            <button
              key={cityKey}
              type="button"
              onClick={() => setActiveCity(cityKey)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black border-2 border-[#0A1128] transition-all flex items-center gap-2 ${
                activeCity === cityKey
                  ? 'bg-amber-300 text-[#0A1128] shadow-[3px_3px_0px_#0A1128] -translate-y-1'
                  : 'bg-white text-slate-700 hover:bg-slate-50 shadow-[1px_1px_0px_#0A1128]'
              }`}
            >
              <span>{cityData[cityKey].emoji}</span>
              <span>{cityData[cityKey].name}</span>
            </button>
          ))}
        </div>

        {/* Main City Showcase Card */}
        <div className="bg-white rounded-3xl border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: City Data Metrics */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-[#0A1128]">
                  {selectedData.exampleSociety}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
                {selectedData.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-amber-50 rounded-2xl p-4 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                  <div className="text-xs font-black uppercase text-amber-900">Daily Deliveries</div>
                  <div className="text-2xl font-black text-[#0A1128] mt-1">{selectedData.dailyParcels}</div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">Handled smoothly by 1 hub</div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                  <div className="text-xs font-black uppercase text-emerald-900">Gate Impact</div>
                  <div className="text-base font-black text-[#0A1128] mt-1">{selectedData.gateSaving}</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-[#0A1128]">
                <div className="text-xs font-black uppercase text-slate-700 mb-1">Supported Carriers at Gate Hub:</div>
                <div className="text-xs sm:text-sm font-bold text-[#0A1128]">{selectedData.topCouriers}</div>
              </div>
            </div>

            {/* Right: Cartoon Society Blueprint Graphic */}
            <div className="lg:col-span-5 bg-sky-50 rounded-2xl p-6 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
              <div className="text-center font-black text-xs uppercase text-sky-950 mb-3 tracking-wider">
                High-Density Hub Blueprint
              </div>

              <svg viewBox="0 0 240 180" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Gate Hub Station */}
                <rect x="20" y="20" width="80" height="60" rx="8" fill="#FDE047" stroke="#0A1128" strokeWidth="2.5" />
                <text x="60" y="45" textAnchor="middle" fill="#0A1128" fontSize="8" fontWeight="900">GATE HUB</text>
                <text x="60" y="60" textAnchor="middle" fill="#0A1128" fontSize="7" fontWeight="bold">Intake Desk</text>

                {/* Arrow to Tower Staging */}
                <path d="M100 50 H140" stroke="#0A1128" strokeWidth="3" strokeDasharray="4 2" />
                <polygon points="140,46 148,50 140,54" fill="#0A1128" />

                {/* Society Racks */}
                <rect x="150" y="20" width="70" height="60" rx="8" fill="#86EFAC" stroke="#0A1128" strokeWidth="2.5" />
                <text x="185" y="45" textAnchor="middle" fill="#0A1128" fontSize="8" fontWeight="900">SMART RACKS</text>
                <text x="185" y="60" textAnchor="middle" fill="#0A1128" fontSize="7" fontWeight="bold">Tower Categorized</text>

                {/* Arrow Down to Handover */}
                <path d="M185 80 V115" stroke="#0A1128" strokeWidth="3" strokeDasharray="4 2" />
                <polygon points="181,115 185,123 189,115" fill="#0A1128" />

                {/* Resident Pickup Window */}
                <rect x="130" y="125" width="100" height="45" rx="8" fill="#93C5FD" stroke="#0A1128" strokeWidth="2.5" />
                <text x="180" y="145" textAnchor="middle" fill="#0A1128" fontSize="8" fontWeight="900">EVENING PICKUP</text>
                <text x="180" y="158" textAnchor="middle" fill="#0A1128" fontSize="7" fontWeight="bold">QR / OTP Verified</text>

                {/* Happy Resident Icon */}
                <circle cx="60" cy="140" r="16" fill="#FED7AA" stroke="#0A1128" strokeWidth="2" />
                <text x="60" y="145" textAnchor="middle" fontSize="14">😎</text>
                <path d="M80 145 H120" stroke="#10B981" strokeWidth="3" strokeDasharray="3 2" />
              </svg>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default IndiaFirstSection;
