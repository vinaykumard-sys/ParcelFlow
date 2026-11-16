import React from 'react';
import {
  Package,
  CheckCircle2,
  Calendar,
  Clock,
  Scan,
  PackagePlus,
  UserPlus,
  ArrowRight,
  Boxes
} from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';
import type { AdminTab, AdminParcel } from '../types';

interface DashboardScreenProps {
  onNavigate: (tab: AdminTab) => void;
  onOpenScanModal: () => void;
  onOpenReceiveModal: () => void;
  onOpenAddResidentModal: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenScanModal,
  onOpenReceiveModal,
  onOpenAddResidentModal,
}) => {
  const kpis = adminService.getKPIs();
  const activeSociety = adminService.getActiveSociety();
  const parcels = adminService.getParcels();
  const notifications = adminService.getNotifications().slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Society Overview Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">{activeSociety.name}</h2>
            <Sticker color="mint" rotate="right" size="xs">
              Live Operations Active
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            {activeSociety.address}, {activeSociety.city} • Gate 2 Parcel Hub • {activeSociety.total_towers} Towers ({activeSociety.total_flats} Flats)
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenScanModal}
            className="py-2.5 px-4 rounded-xl bg-orange-500 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A1128] active:translate-y-0 transition-all flex items-center gap-1.5"
          >
            <Scan className="w-4 h-4" />
            <span>Scan OTP</span>
          </button>

          <button
            onClick={onOpenReceiveModal}
            className="py-2.5 px-4 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A1128] active:translate-y-0 transition-all flex items-center gap-1.5"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Receive Parcel</span>
          </button>

          <button
            onClick={onOpenAddResidentModal}
            className="py-2.5 px-4 rounded-xl bg-amber-400 text-[#0A1128] font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A1128] active:translate-y-0 transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Resident</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (87 Today, 61 Collected, 18 Scheduled, 8 Pending) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: 87 Today */}
        <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-4 sm:p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Today Total</span>
            <div className="p-2 rounded-xl bg-blue-100 border-2 border-[#0A1128] text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#0A1128] tracking-tight">{kpis.todayTotal}</span>
              <span className="text-xs font-bold text-emerald-600">+14% vs avg</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Parcels arrived at hub</p>
          </div>
        </div>

        {/* Metric 2: 61 Collected */}
        <div className="rounded-2xl bg-emerald-50 border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-4 sm:p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">Collected</span>
            <div className="p-2 rounded-xl bg-emerald-400 border-2 border-[#0A1128] text-[#0A1128]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">{kpis.collected}</span>
              <span className="text-xs font-extrabold px-1.5 py-0.5 bg-emerald-300 text-emerald-950 rounded border border-[#0A1128]">
                70.1%
              </span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-800 mt-1">Handed over via OTP/QR</p>
          </div>
        </div>

        {/* Metric 3: 18 Scheduled */}
        <div className="rounded-2xl bg-amber-50 border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-4 sm:p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900">Scheduled</span>
            <div className="p-2 rounded-xl bg-amber-400 border-2 border-[#0A1128] text-[#0A1128]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight">{kpis.scheduled}</span>
              <span className="text-xs font-bold text-amber-800">Next: 6:00 PM</span>
            </div>
            <p className="text-[11px] font-semibold text-amber-800 mt-1">Pickup slots booked</p>
          </div>
        </div>

        {/* Metric 4: 8 Pending */}
        <div className="rounded-2xl bg-orange-50 border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-4 sm:p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-orange-900">Pending</span>
            <div className="p-2 rounded-xl bg-orange-500 border-2 border-[#0A1128] text-white">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-orange-950 tracking-tight">{kpis.pending}</span>
              <span className="text-xs font-bold text-orange-700">Awaiting slot</span>
            </div>
            <p className="text-[11px] font-semibold text-orange-800 mt-1">Notifications dispatched</p>
          </div>
        </div>
      </div>

      {/* Mid Section: Hub Racks & Realtime Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Hub Inventory Summary */}
        <div className="lg:col-span-2 rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white border-2 border-[#0A1128]">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#0A1128]">Parcel Hub Storage Occupancy</h3>
                <p className="text-xs font-medium text-slate-500">112 Total Storage Capacity across Racks A & B</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('hub-inventory')}
              className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View Racks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-[#0A1128]" />
                  <span>Rack A (Towers A & B Parcels)</span>
                </span>
                <span className="font-mono">82% Occupied (46/56 Slots)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full border-2 border-[#0A1128] overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-[#0A1128]" />
                  <span>Rack B (Tower C & Oversize Locker)</span>
                </span>
                <span className="font-mono">68% Occupied (38/56 Slots)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full border-2 border-[#0A1128] overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
          </div>

          {/* Quick Hub Stats Pills */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t-2 border-slate-100">
            <div className="p-3 rounded-xl bg-blue-50 border-2 border-[#0A1128] text-center">
              <span className="block text-[10px] font-black uppercase text-blue-700">Total in Hub</span>
              <span className="text-xl font-black text-blue-950">112</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border-2 border-[#0A1128] text-center">
              <span className="block text-[10px] font-black uppercase text-emerald-700">Ready for Pickup</span>
              <span className="text-xl font-black text-emerald-950">61</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border-2 border-[#0A1128] text-center">
              <span className="block text-[10px] font-black uppercase text-amber-700">In Secure Storage</span>
              <span className="text-xl font-black text-amber-950">33</span>
            </div>
          </div>
        </div>

        {/* Right Col: Realtime Activity Feed */}
        <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-[#0A1128] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-[#0A1128]" />
                <span>Live Activity Stream</span>
              </h3>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-[11px] font-extrabold text-blue-600 hover:underline"
              >
                View Log
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl bg-amber-50/60 border-2 border-[#0A1128] text-xs space-y-1 shadow-[2px_2px_0px_#0A1128]"
                >
                  <div className="flex items-center justify-between font-bold text-[#0A1128]">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Just now</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 line-clamp-2">{n.body}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('otp-scanner')}
            className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Launch Handover Scanner</span>
          </button>
        </div>
      </div>

      {/* Recent Parcels Table Card */}
      <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#0A1128]">Recent Parcels at Hub</h3>
            <p className="text-xs font-medium text-slate-500">Live parcel inventory waiting for collection</p>
          </div>
          <button
            onClick={() => onNavigate('tracking')}
            className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Search All Parcels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#0A1128] text-slate-500 font-black uppercase text-[10px]">
                <th className="py-2.5 px-3">Tracking ID</th>
                <th className="py-2.5 px-3">Courier</th>
                <th className="py-2.5 px-3">Resident & Flat</th>
                <th className="py-2.5 px-3">Rack & Shelf</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-[#0A1128]">
              {parcels.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">{p.tracking_number}</td>
                  <td className="py-3 px-3 font-semibold">{p.courier_company}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold">{p.recipient_name_on_package}</span>
                    <span className="ml-1 text-slate-500 font-mono">({p.apartment?.unit_number})</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-[#0A1128] font-mono text-[11px] font-bold">
                      {p.storage_location?.shelf || 'Shelf A1'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-[#0A1128] ${
                        p.status === 'COMPLETED'
                          ? 'bg-emerald-300 text-emerald-950'
                          : p.status === 'SCHEDULED'
                          ? 'bg-blue-300 text-blue-950'
                          : 'bg-amber-300 text-amber-950'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={onOpenScanModal}
                      className="px-2.5 py-1 rounded-lg bg-orange-500 text-white font-extrabold text-[11px] border border-[#0A1128] shadow-[1px_1px_0px_#0A1128] hover:-translate-y-0.5"
                    >
                      Verify OTP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
