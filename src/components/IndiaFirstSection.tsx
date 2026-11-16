import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Warehouse
} from 'lucide-react';

export const IndiaFirstSection: React.FC = () => {
  const [activeCity, setActiveCity] = useState<'bengaluru' | 'mumbai' | 'gurugram' | 'hyderabad'>('bengaluru');

  const cityData = {
    bengaluru: {
      name: 'Bengaluru Tech Corridor',
      exampleSociety: 'Greenwood Regency (1,420 Flats)',
      dailyParcels: '280+ parcels/day',
      topCouriers: 'Amazon, Flipkart, Blinkit, Myntra, BlueDart',
      gateSaving: '42 hours of guard intercom time saved/month'
    },
    mumbai: {
      name: 'Mumbai High-Rise Clusters',
      exampleSociety: 'Lodha Horizon Towers (850 Flats)',
      dailyParcels: '210+ parcels/day',
      topCouriers: 'Amazon Prime, Zepto, Swiggy Instamart, Delhivery',
      gateSaving: 'Zero delivery delivery bikes circling narrow parking ramps'
    },
    gurugram: {
      name: 'Gurugram Golf Course Ext.',
      exampleSociety: 'DLF Crest Parklands (1,150 Flats)',
      dailyParcels: '310+ parcels/day',
      topCouriers: 'Amazon, Myntra, BlueDart, DTDC, Zara',
      gateSaving: '95% reduction in gate boom-barrier queue congestion'
    },
    hyderabad: {
      name: 'Hyderabad Financial District',
      exampleSociety: 'My Home Bhooja (1,800 Flats)',
      dailyParcels: '360+ parcels/day',
      topCouriers: 'Amazon, Flipkart, Shadowfax, Delhivery',
      gateSaving: 'Complete digital audit logs for 4 gated security gates'
    }
  };

  const selectedData = cityData[activeCity];

  return (
    <section className="relative py-24 sm:py-32 bg-slate-900/80 text-white overflow-hidden border-t border-slate-800">
      {/* Background Lighting Elements */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm">
            <Building className="w-3.5 h-3.5" />
            <span>Built For Indian Apartment Realities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Designed specifically for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              high-density apartment living.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Western locker models fail in Indian gated societies where 200 to 500+ packages arrive every single day from 10 different couriers. ParcelFlow is custom-engineered for our societies.
          </p>
        </div>

        {/* 4 Large Highlight Reality Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 backdrop-blur-md">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Society Scale</div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">500 – 2.5K+</div>
            <div className="text-xs text-slate-400 mt-2">Flats per gated society complex</div>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 backdrop-blur-md">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Daily E-Commerce Volume</div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">200 – 400+</div>
            <div className="text-xs text-slate-400 mt-2">Parcels arriving daily at society gate</div>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 backdrop-blur-md">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Delivery Partner Mix</div>
            <div className="text-3xl sm:text-4xl font-black text-blue-400 font-mono">15+ Carriers</div>
            <div className="text-xs text-slate-400 mt-2">Amazon, Flipkart, Myntra, BlueDart, Delhivery</div>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 backdrop-blur-md">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Gate Check-in Time</div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-300 font-mono">&lt; 10s / Parcel</div>
            <div className="text-xs text-slate-400 mt-2">Ultra-fast optical OCR barcode ingestion</div>
          </div>
        </div>

        {/* Society Reality Blueprint & City Selector */}
        <div className="rounded-3xl bg-slate-950/90 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* City Selector Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Proven in Tier-1 Residential Megaplexes</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated workload impact based on verified society audits
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {(['bengaluru', 'mumbai', 'gurugram', 'hyderabad'] as const).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setActiveCity(city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeCity === city
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Active City Details Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
            {/* Left Blueprint Architecture */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase">Representative Cluster</span>
                    <h4 className="text-xl font-bold text-white">{selectedData.exampleSociety}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
                    {selectedData.dailyParcels}
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>Carrier Ecosystem:</strong> {selectedData.topCouriers}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Operational Impact:</strong> {selectedData.gateSaving}</span>
                  </div>
                </div>
              </div>

              {/* High Density Architecture Diagram */}
              <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-emerald-400" />
                  <span>The ParcelFlow High-Density Blueprint</span>
                </h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-mono text-blue-400 uppercase mb-1">Gate Intake Hub</div>
                    <div className="text-xs font-bold text-white">Central Drop Zone</div>
                    <div className="text-[10px] text-slate-400 mt-1">Couriers unload in 3 mins</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase mb-1">Sorting Bays</div>
                    <div className="text-xs font-bold text-white">Tower-wise Shelving</div>
                    <div className="text-[10px] text-slate-400 mt-1">Organized by A/B/C/D wings</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-mono text-purple-400 uppercase mb-1">Handover Point</div>
                    <div className="text-xs font-bold text-white">Resident Pickup</div>
                    <div className="text-[10px] text-slate-400 mt-1">Evening scheduled window</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Ground Reality Friction Solved */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>The Three Realities of Indian Gate Life</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">1. The Peak 11 AM - 3 PM Courier Flood</div>
                  <p className="text-slate-400 leading-relaxed">
                    Instead of 40 couriers ringing 400 different doorbells throughout the afternoon, all parcels consolidate into the Gate Hub in seconds.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">2. No Corridor Security Breaches</div>
                  <p className="text-slate-400 leading-relaxed">
                    Zero unauthorized personnel wandering residential lift lobbies and stairwells. Elevators remain free for residents and children.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">3. Guard Focus Remains on Perimeter Protection</div>
                  <p className="text-slate-400 leading-relaxed">
                    Guards are security officers, not parcel receptionists. ParcelFlow handles the notifications, tracking, and handovers digitally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndiaFirstSection;

