import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Package, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  QrCode, 
  FileSpreadsheet
} from 'lucide-react';

interface ParcelRecord {
  id: string;
  trackingId: string;
  flat: string;
  courier: string;
  timeIn: string;
  status: 'collected' | 'scheduled' | 'pending';
  scheduledTime?: string;
  bay: string;
}

export const SocietySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'collected' | 'scheduled' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  
  // Counting metrics with simulated live updates
  const [counts, setCounts] = useState({
    today: 87,
    collected: 61,
    scheduled: 18,
    pending: 8
  });

  const [parcels, setParcels] = useState<ParcelRecord[]>([
    { id: '1', trackingId: 'AMZ-9921', flat: 'Tower B - 1204', courier: 'Amazon Logistics', timeIn: '01:40 PM', status: 'collected', scheduledTime: '06:30 PM', bay: 'Locker B-04' },
    { id: '2', trackingId: 'FK-4819', flat: 'Tower A - 402', courier: 'Flipkart Express', timeIn: '02:15 PM', status: 'scheduled', scheduledTime: '08:00 PM', bay: 'Bay C-12' },
    { id: '3', trackingId: 'BLD-1102', flat: 'Tower D - 801', courier: 'BlueDart Air', timeIn: '03:10 PM', status: 'scheduled', scheduledTime: '08:30 PM', bay: 'Bay A-07' },
    { id: '4', trackingId: 'DEL-6720', flat: 'Tower C - 1503', courier: 'Delhivery', timeIn: '03:45 PM', status: 'pending', bay: 'Hub Staging' },
    { id: '5', trackingId: 'ZOM-8831', flat: 'Tower B - 601', courier: 'Blinkit / Box', timeIn: '12:20 PM', status: 'collected', scheduledTime: '01:00 PM', bay: 'Locker A-02' },
    { id: '6', trackingId: 'MYN-2901', flat: 'Tower A - 904', courier: 'Myntra Logistics', timeIn: '04:05 PM', status: 'pending', bay: 'Bay D-03' },
  ]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      const newId = (parcels.length + 1).toString();
      const newRecord: ParcelRecord = {
        id: newId,
        trackingId: `AMZ-NEW${Math.floor(1000 + Math.random() * 9000)}`,
        flat: 'Tower B - 504',
        courier: 'Amazon Prime',
        timeIn: 'Just now',
        status: 'pending',
        bay: 'Bay E-01'
      };
      setParcels(prev => [newRecord, ...prev]);
      setCounts(prev => ({
        ...prev,
        today: prev.today + 1,
        pending: prev.pending + 1
      }));

      setTimeout(() => setScanSuccess(false), 3000);
    }, 1200);
  };

  const filteredParcels = parcels.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
    const matchesSearch = p.flat.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.courier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="for-societies" className="relative py-24 sm:py-32 bg-slate-950 text-white overflow-hidden border-t border-slate-800/80">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm">
            <Building2 className="w-3.5 h-3.5" />
            <span>Society & RWA Operations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Built for the way <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              modern societies actually work.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Gated communities are overwhelmed by 200+ delivery couriers per day. ParcelFlow empowers estate managers and security guards with seamless digital intake and verified handovers.
          </p>
        </div>

        {/* Live Animated Counters Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* Metric 1 */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Parcels Today</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight group-hover:text-blue-300 transition-colors">
              {counts.today}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
              </span>
              <span>vs yesterday avg</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/40" />
          </div>

          {/* Metric 2 */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Collected</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
              {counts.collected}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              <span className="text-emerald-400 font-medium">70.1%</span> cleared from hub
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/60" />
          </div>

          {/* Metric 3 */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Scheduled</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-indigo-300 font-mono tracking-tight">
              {counts.scheduled}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Pickups booked for 6PM - 10PM
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500/60" />
          </div>

          {/* Metric 4 */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Pending Action</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight">
              {counts.pending}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Awaiting resident selection
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/60" />
          </div>
        </div>

        {/* Society Admin & Guard Live Hub Preview */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Prestige Green Oaks — Gate Hub 1 Terminal
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Staff On Duty: Supervisor Ramakant S. • Connected to Society Cloud Database
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isScanning}
                onClick={handleSimulateScan}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
              >
                <QrCode className="w-4 h-4" />
                <span>{isScanning ? 'Scanning Barcode...' : '+ Quick Inbound Scan'}</span>
              </button>
            </div>
          </div>

          {/* Notification banner on scan */}
          {scanSuccess && (
            <div className="my-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                New parcel scanned into Bay E-01! Resident notified via push & WhatsApp.
              </span>
              <span className="font-mono text-[11px] text-emerald-400">Time: 1.1s</span>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search flat (e.g. Tower B), tracking ID, courier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'collected', 'scheduled', 'pending'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                    activeFilter === filter
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {filter} ({filter === 'all' ? counts.today : counts[filter]})
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Destination Flat</th>
                  <th className="py-3 px-4">Carrier</th>
                  <th className="py-3 px-4">Hub Storage Bay</th>
                  <th className="py-3 px-4">Intake Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-blue-400">
                      {parcel.trackingId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {parcel.flat}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {parcel.courier}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {parcel.bay}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {parcel.timeIn}
                    </td>
                    <td className="py-3 px-4">
                      {parcel.status === 'collected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Collected
                        </span>
                      )}
                      {parcel.status === 'scheduled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium">
                          <Clock className="w-3 h-3" /> Scheduled {parcel.scheduledTime}
                        </span>
                      )}
                      {parcel.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium">
                          <AlertTriangle className="w-3 h-3" /> Pending Selection
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3 Society Key Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-slate-800/80">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Zero Lost Parcel Disputes</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every parcel is scanned upon delivery. Tamper-evident OTP or QR handover ensures zero claims of "I never received my package."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">80% Less Gate Congestion</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Delivery vans drop off batches at the parcel hub in under 3 minutes, instead of wandering through internal lanes or jamming the entry barrier.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Automated Security Audit Trails</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete digital chain of custody. Society RWA committee and security heads can export PDF/Excel logs with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocietySection;

