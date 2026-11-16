import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Calendar, Award } from 'lucide-react';
import { Sticker } from '../components/Sticker';
import { adminService } from '../services/adminService';

export const ReportsScreen: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const activeSociety = adminService.getActiveSociety();

  const hourlyData = [
    { hour: '07:00 AM', volume: 6, label: 'Early Intake' },
    { hour: '09:00 AM', volume: 18, label: 'Morning Courier Wave' },
    { hour: '11:00 AM', volume: 14, label: 'Midday Delivery' },
    { hour: '01:00 PM', volume: 8, label: 'Lunch Intake' },
    { hour: '03:00 PM', volume: 12, label: 'Afternoon Wave' },
    { hour: '05:00 PM', volume: 22, label: 'Pre-Evening Prep' },
    { hour: '06:30 PM', volume: 34, label: 'Peak Slot 1' },
    { hour: '08:00 PM', volume: 46, label: 'Super Peak Slot 2' },
    { hour: '09:30 PM', volume: 16, label: 'Night Handover' },
  ];

  const maxVolume = 50;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-[#0A1128] tracking-tight">Analytics & Operational Reports</h2>
            <Sticker color="mint" rotate="right" size="xs">
              94.2% Handover Rate
            </Sticker>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Intake trends, peak resident collection windows, and courier SLA distribution for {activeSociety.name}.
          </p>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex rounded-xl border-2 border-[#0A1128] bg-white p-1">
          {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`py-1.5 px-3.5 text-xs font-black rounded-lg transition-all ${
                timeframe === t ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#0A1128]' : 'text-slate-600'
              }`}
            >
              {t === 'DAILY' ? 'Daily' : t === 'WEEKLY' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
          <span className="text-[10px] font-black uppercase text-slate-500">Collection Rate</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 block">94.2%</span>
          <span className="text-[10px] font-bold text-emerald-700">Zero lost packages</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
          <span className="text-[10px] font-black uppercase text-slate-500">Average Dwell Time</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-950 mt-1 block">3.4 hrs</span>
          <span className="text-[10px] font-bold text-blue-700">From intake to pickup</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
          <span className="text-[10px] font-black uppercase text-slate-500">Peak Window</span>
          <span className="text-xl sm:text-2xl font-black text-orange-950 mt-1 block">8:00 – 8:30 PM</span>
          <span className="text-[10px] font-bold text-orange-700">31 pickups scheduled</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
          <span className="text-[10px] font-black uppercase text-slate-500">Courier Handovers</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-950 mt-1 block">87 pkgs</span>
          <span className="text-[10px] font-bold text-purple-700">7 partner couriers</span>
        </div>
      </div>

      {/* Time-of-Day Bar Chart */}
      <div className="rounded-2xl bg-white border-3 border-[#0A1128] shadow-[6px_6px_0px_#0A1128] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-[#0A1128]">
              Time-of-Day Parcel Intake & Pickup Demand
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Evening spike illustrates why scheduled pickup windows prevent lobby congestion.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-100 border border-[#0A1128] rounded-lg">
            Peak Shift: 6:00 PM – 9:30 PM
          </span>
        </div>

        <div className="pt-6 pb-2">
          <div className="h-48 flex items-end gap-2 sm:gap-4 justify-between border-b-2.5 border-[#0A1128] pb-2">
            {hourlyData.map((d, i) => {
              const heightPercent = Math.round((d.volume / maxVolume) * 100);
              const isPeak = d.volume > 30;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-0.5 rounded bg-[#0A1128] text-white text-[10px] font-mono font-bold pointer-events-none whitespace-nowrap z-10">
                    {d.volume} parcels
                  </div>

                  <div
                    className={`w-full rounded-t-lg border-2 border-[#0A1128] transition-all group-hover:-translate-y-1 ${
                      isPeak
                        ? 'bg-orange-500 shadow-[2px_2px_0px_#0A1128]'
                        : 'bg-blue-600 shadow-[1px_1px_0px_#0A1128]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-black text-slate-500 mt-2 truncate w-full text-center">
                    {d.hour.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Courier Partner Share */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-5 space-y-3">
          <h4 className="font-extrabold text-sm text-[#0A1128]">Courier Volume Split</h4>
          <div className="space-y-2 text-xs font-bold">
            <div>
              <div className="flex justify-between mb-1">
                <span>Amazon Logistics</span>
                <span className="font-mono">38% (33 Parcels)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#0A1128]">
                <div className="h-full bg-blue-600" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Blue Dart Express</span>
                <span className="font-mono">24% (21 Parcels)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#0A1128]">
                <div className="h-full bg-blue-500" style={{ width: '24%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Delhivery</span>
                <span className="font-mono">18% (16 Parcels)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#0A1128]">
                <div className="h-full bg-orange-500" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Ekart & Others</span>
                <span className="font-mono">20% (17 Parcels)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#0A1128]">
                <div className="h-full bg-emerald-500" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border-2.5 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-[#0A1128]">Society Dispatch Efficiency</h4>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              By enforcing dedicated 30-minute pickup windows, Lakeview Residency reduced guardhouse lobby courier inquiries by 89% and eliminated misplaced packages completely.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-[#0A1128] flex items-center gap-3">
            <Award className="w-8 h-8 text-emerald-700 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-emerald-950 block">Audit Grade: A+</span>
              <span className="font-semibold text-emerald-800">100% verified optical handovers today.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
