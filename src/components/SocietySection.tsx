import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Package, 
  Search, 
  Sparkles, 
  TrendingUp, 
  QrCode, 
  Boxes,
  Users,
  Check
} from 'lucide-react';

interface SocietySectionProps {
  onOpenPilotModal?: () => void;
}

export const SocietySection: React.FC<SocietySectionProps> = ({ onOpenPilotModal }) => {
  const [activeRack, setActiveRack] = useState<'A' | 'B' | 'C'>('A');
  const [scannedCount, setScannedCount] = useState<number>(87);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScannedCount(prev => prev + 1);
      setIsScanning(false);
    }, 600);
  };

  const racksData = {
    A: {
      name: 'Rack A • Towers 1 & 2',
      color: 'bg-amber-100 border-amber-400',
      parcels: [
        { id: 'PF-104', flat: 'Tower 1 • #402', carrier: 'Amazon', time: '11:15 AM', status: 'Ready for 8 PM' },
        { id: 'PF-105', flat: 'Tower 1 • #1105', carrier: 'Flipkart', time: '11:32 AM', status: 'Ready for 7:30 PM' },
        { id: 'PF-108', flat: 'Tower 2 • #301', carrier: 'BlueDart', time: '12:04 PM', status: 'Ready for 8 PM' },
        { id: 'PF-112', flat: 'Tower 2 • #904', carrier: 'Myntra', time: '12:45 PM', status: 'Ready for 9 PM' },
      ]
    },
    B: {
      name: 'Rack B • Towers 3 & 4',
      color: 'bg-sky-100 border-sky-400',
      parcels: [
        { id: 'PF-201', flat: 'Tower 3 • #601', carrier: 'Blinkit', time: '01:10 PM', status: 'Ready for 6:30 PM' },
        { id: 'PF-205', flat: 'Tower 3 • #1202', carrier: 'Amazon', time: '01:25 PM', status: 'Ready for 8 PM' },
        { id: 'PF-209', flat: 'Tower 4 • #204', carrier: 'Delhivery', time: '02:00 PM', status: 'Ready for 8:30 PM' },
      ]
    },
    C: {
      name: 'Rack C • Towers 5 & Clubhouse',
      color: 'bg-emerald-100 border-emerald-400',
      parcels: [
        { id: 'PF-301', flat: 'Tower 5 • #1402', carrier: 'Amazon', time: '02:15 PM', status: 'Ready for 7 PM' },
        { id: 'PF-304', flat: 'Tower 5 • #704', carrier: 'Zara', time: '02:40 PM', status: 'Ready for 8 PM' },
        { id: 'PF-309', flat: 'Clubhouse • Staff', carrier: 'FedEx', time: '03:10 PM', status: 'Internal Store' },
      ]
    }
  };

  return (
    <section id="for-societies" className="relative py-20 sm:py-28 bg-[#FEF9F3] text-[#0A1128] overflow-hidden border-b-2 border-[#0A1128]">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #0A1128 1px, transparent 1px), linear-gradient(to bottom, #0A1128 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-300 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-[#0A1128] text-xs sm:text-sm font-black uppercase tracking-wider mb-4 -rotate-1 hover:rotate-0 transition-transform">
            <Building2 className="w-4 h-4 text-[#0A1128]" />
            <span>Built For Modern Gated Societies</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1128] tracking-tight leading-tight">
            Built for apartment communities. <br />
            <span className="relative inline-block text-blue-600">
              One organized hub for 500+ homes.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Stop turning your residential lobby into a courier warehouse. ParcelFlow gives security guards and RWAs a clean, high-speed parcel station.
          </p>
        </div>

        {/* 2-Column Showcase: Left Cartoon Society & Hub Scene, Right Interactive Hub Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Illustrated Society Scene */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] relative">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-300 text-[#0A1128] border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                🏢 Prestige Green Oaks • 520 Apartments
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-[#0A1128]">
                Gate Hub Live ✓
              </span>
            </div>

            {/* Custom SVG: The Apartment Community + Organized Parcel Hub */}
            <div className="bg-amber-50/70 rounded-2xl p-3 border-2 border-[#0A1128]/40 overflow-hidden">
              <svg viewBox="0 0 400 250" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Sky & Clouds */}
                <ellipse cx="60" cy="30" rx="30" ry="12" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="80" cy="25" rx="20" ry="10" fill="#FFFFFF" opacity="0.8" />
                <ellipse cx="320" cy="40" rx="25" ry="10" fill="#FFFFFF" opacity="0.8" />

                {/* Society Background Towers */}
                {/* Tower 1 */}
                <rect x="25" y="40" width="55" height="150" rx="4" fill="#93C5FD" stroke="#0A1128" strokeWidth="2.5" />
                <rect x="35" y="55" width="12" height="12" rx="2" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="55" y="55" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="35" y="80" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="55" y="80" width="12" height="12" rx="2" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="35" y="105" width="12" height="12" rx="2" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="55" y="105" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                
                {/* Tower 2 (Taller) */}
                <rect x="85" y="15" width="65" height="175" rx="4" fill="#60A5FA" stroke="#0A1128" strokeWidth="2.5" />
                <rect x="95" y="30" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="115" y="30" width="12" height="12" rx="2" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="95" y="55" width="12" height="12" rx="2" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="115" y="55" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="95" y="80" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="115" y="80" width="12" height="12" rx="2" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="95" y="105" width="12" height="12" rx="2" fill="#FEF08A" stroke="#0A1128" strokeWidth="1.5" />
                <rect x="115" y="105" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#0A1128" strokeWidth="1.5" />

                {/* Ground Line */}
                <line x1="10" y1="190" x2="390" y2="190" stroke="#0A1128" strokeWidth="4" strokeLinecap="round" />

                {/* The Organized Society Parcel Hub Building */}
                <g transform="translate(160, 65)">
                  {/* Roof with ParcelFlow sign */}
                  <polygon points="10,40 110,10 210,40" fill="#F97316" stroke="#0A1128" strokeWidth="3" />
                  <rect x="65" y="22" width="90" height="20" rx="4" fill="#FDE047" stroke="#0A1128" strokeWidth="2" />
                  <text x="110" y="36" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="900">PARCEL HUB 📦</text>

                  {/* Hub Main Wall */}
                  <rect x="20" y="40" width="180" height="85" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3" />
                  
                  {/* The Colorful Parcel Racks Inside */}
                  {/* Rack A (Amber) */}
                  <rect x="30" y="50" width="45" height="70" rx="3" fill="#FEF3C7" stroke="#0A1128" strokeWidth="2" />
                  <line x1="30" y1="72" x2="75" y2="72" stroke="#0A1128" strokeWidth="2" />
                  <line x1="30" y1="95" x2="75" y2="95" stroke="#0A1128" strokeWidth="2" />
                  {/* Parcels on Rack A */}
                  <rect x="34" y="55" width="16" height="14" rx="2" fill="#FB923C" stroke="#0A1128" strokeWidth="1.5" />
                  <rect x="53" y="58" width="18" height="11" rx="2" fill="#F472B6" stroke="#0A1128" strokeWidth="1.5" />
                  <rect x="34" y="78" width="18" height="14" rx="2" fill="#38BDF8" stroke="#0A1128" strokeWidth="1.5" />
                  <rect x="54" y="80" width="17" height="12" rx="2" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />

                  {/* Rack B (Sky Blue) */}
                  <rect x="85" y="50" width="45" height="70" rx="3" fill="#E0F2FE" stroke="#0A1128" strokeWidth="2" />
                  <line x1="85" y1="72" x2="130" y2="72" stroke="#0A1128" strokeWidth="2" />
                  <line x1="85" y1="95" x2="130" y2="95" stroke="#0A1128" strokeWidth="2" />
                  {/* Parcels on Rack B */}
                  <rect x="89" y="56" width="18" height="13" rx="2" fill="#34D399" stroke="#0A1128" strokeWidth="1.5" />
                  <rect x="90" y="77" width="17" height="15" rx="2" fill="#FB923C" stroke="#0A1128" strokeWidth="1.5" />
                  <rect x="109" y="79" width="18" height="13" rx="2" fill="#F472B6" stroke="#0A1128" strokeWidth="1.5" />

                  {/* Security Intake Desk */}
                  <rect x="140" y="80" width="50" height="45" rx="4" fill="#3B82F6" stroke="#0A1128" strokeWidth="2.5" />
                  <text x="165" y="105" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">SCANNER</text>

                  {/* Friendly Security Officer Guard */}
                  <circle cx="165" cy="62" r="12" fill="#FED7AA" stroke="#0A1128" strokeWidth="2" />
                  <path d="M153 60 C153 50 177 50 177 60 Z" fill="#1E3A8A" stroke="#0A1128" strokeWidth="1.5" />
                  <circle cx="162" cy="62" r="1.5" fill="#0A1128" />
                  <circle cx="168" cy="62" r="1.5" fill="#0A1128" />
                  <path d="M163 66 Q165 69 167 66" stroke="#0A1128" strokeWidth="1" />
                </g>

                {/* Society Gate Boom Barrier */}
                <rect x="350" y="150" width="16" height="40" rx="3" fill="#475569" stroke="#0A1128" strokeWidth="2" />
                {/* Striped Boom Barrier */}
                <line x1="358" y1="160" x2="280" y2="160" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                <line x1="340" y1="160" x2="330" y2="160" stroke="#FFFFFF" strokeWidth="6" />
                <line x1="315" y1="160" x2="305" y2="160" stroke="#FFFFFF" strokeWidth="6" />

                {/* Cute Courier handing over parcel */}
                <g transform="translate(230, 140)">
                  <ellipse cx="25" cy="50" rx="20" ry="4" fill="#0A1128" opacity="0.2" />
                  <circle cx="20" cy="15" r="10" fill="#FED7AA" stroke="#0A1128" strokeWidth="2" />
                  <path d="M12 12 C12 6 28 6 28 12 Z" fill="#DC2626" stroke="#0A1128" strokeWidth="1.5" />
                  {/* Delivery bag */}
                  <rect x="5" y="24" width="30" height="24" rx="4" fill="#EA580C" stroke="#0A1128" strokeWidth="2" />
                  {/* Smiling Face */}
                  <circle cx="18" cy="15" r="1.2" fill="#0A1128" />
                  <circle cx="23" cy="15" r="1.2" fill="#0A1128" />
                  <path d="M19 19 Q21 21 23 19" stroke="#0A1128" strokeWidth="1" />
                </g>

                {/* Floating Hub Sticker */}
                <g transform="translate(20, 205)">
                  <rect width="130" height="26" rx="6" fill="#86EFAC" stroke="#0A1128" strokeWidth="2" />
                  <text x="65" y="17" textAnchor="middle" fill="#0A1128" fontSize="9" fontWeight="900">Zero Corridor Clutter ✓</text>
                </g>
              </svg>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Gate Intercom Load: <strong className="text-emerald-700">Reduced by 92%</strong></span>
              <span>Guard Intake Speed: <strong className="text-blue-700">8 Sec / Parcel</strong></span>
            </div>
          </div>

          {/* Right: Interactive Society Parcel Hub Terminal */}
          <div className="lg:col-span-6 space-y-5">
            {/* Live Counters */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-amber-100 rounded-2xl p-4 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#0A1128]">{scannedCount}</div>
                <div className="text-[11px] font-black uppercase text-amber-900 mt-1">Parcels Today</div>
              </div>

              <div className="bg-emerald-100 rounded-2xl p-4 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#0A1128]">62</div>
                <div className="text-[11px] font-black uppercase text-emerald-900 mt-1">Collected</div>
              </div>

              <div className="bg-sky-100 rounded-2xl p-4 border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#0A1128]">25</div>
                <div className="text-[11px] font-black uppercase text-sky-900 mt-1">Scheduled</div>
              </div>
            </div>

            {/* Interactive Rack Browser Box */}
            <div className="bg-white rounded-3xl p-6 border-3 border-[#0A1128] shadow-[5px_5px_0px_#0A1128]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-black text-[#0A1128] flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-amber-500" />
                    <span>Live Society Rack Manager</span>
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">Select a rack to see organized parcel inventory</p>
                </div>

                {/* Simulate Quick Scan Button */}
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#0A1128] text-xs font-black border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] active:translate-y-0.5 transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0A1128]" />
                  <span>{isScanning ? 'Scanning...' : '+ Inbound Scan'}</span>
                </button>
              </div>

              {/* Rack Selector Tabs */}
              <div className="flex gap-2 mb-4">
                {(['A', 'B', 'C'] as const).map((rack) => (
                  <button
                    key={rack}
                    type="button"
                    onClick={() => setActiveRack(rack)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black border-2 border-[#0A1128] transition-all ${
                      activeRack === rack
                        ? 'bg-amber-300 text-[#0A1128] shadow-[2px_2px_0px_#0A1128] -translate-y-0.5'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Rack {rack}
                  </button>
                ))}
              </div>

              {/* Parcels List for Selected Rack */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {racksData[activeRack].parcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="p-3 bg-slate-50 rounded-xl border-2 border-[#0A1128] flex items-center justify-between hover:bg-amber-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border-2 border-[#0A1128] flex items-center justify-center font-black text-xs text-[#0A1128]">
                        📦
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#0A1128]">{parcel.flat}</div>
                        <div className="text-[11px] font-semibold text-slate-600">
                          {parcel.carrier} • In at {parcel.time}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-[11px] font-black rounded-lg bg-emerald-100 text-emerald-800 border border-[#0A1128]">
                      {parcel.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Society RWA Pilot Callout */}
            <div className="bg-amber-300 rounded-2xl p-5 border-2 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-[#0A1128]">Are you an RWA Member or Society Manager?</h4>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">We set up the entire parcel station with hardware and staff training in under 48 hours.</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenPilotModal ? onOpenPilotModal() : alert('Join Pilot: contact@parcelflow.in')}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#FFFFFF] hover:-translate-y-0.5 transition-all"
              >
                Join Society Pilot →
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SocietySection;
