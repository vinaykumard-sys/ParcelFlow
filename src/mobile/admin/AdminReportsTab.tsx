import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, CheckCircle2, Package, Clock, ShieldCheck } from 'lucide-react';
import { useMobileStore } from '../services/mobileState';

export const AdminReportsTab: React.FC = () => {
  const { report } = useMobileStore();
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');

  const hourlyDistribution = [
    { time: '9 AM', count: 18, height: '35%' },
    { time: '12 PM', count: 42, height: '60%' },
    { time: '3 PM', count: 55, height: '70%' },
    { time: '6 PM', count: 88, height: '95%' },
    { time: '9 PM', count: 72, height: '80%' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <h1 className="text-base font-black text-[#060D1E] tracking-tight">Analytics & Reports</h1>
        <p className="text-[11px] font-bold text-slate-500">Last 30 Days Society Performance</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 space-y-4">
        {/* Period Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-300 text-xs font-black">
          {(['Daily', 'Weekly', 'Monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`py-2 rounded-xl transition-all ${
                period === p
                  ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                  : 'text-slate-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Big Collection Rate Highlight Card */}
        <div className="p-4 bg-gradient-to-br from-emerald-500 to-[#10B981] text-white rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100">
                Collection Efficiency Rate
              </span>
              <div className="text-4xl font-black mt-1">88.3%</div>
              <p className="text-xs font-bold text-emerald-100 mt-1">
                +14.2% increase compared to unmanaged courier entry.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* 30-Day Totals Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <span className="text-[10px] font-black uppercase text-slate-500">Total Parcels</span>
            <div className="text-2xl font-black text-[#060D1E]">1,240</div>
            <span className="text-[10px] font-bold text-emerald-600">Avg 41 / day</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <span className="text-[10px] font-black uppercase text-emerald-600">Collected</span>
            <div className="text-2xl font-black text-[#060D1E]">1,095</div>
            <span className="text-[10px] font-bold text-slate-500">88.3% rate</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <span className="text-[10px] font-black uppercase text-[#1E60F2]">Scheduled Today</span>
            <div className="text-2xl font-black text-[#060D1E]">18</div>
            <span className="text-[10px] font-bold text-slate-500">Peak tonight</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <span className="text-[10px] font-black uppercase text-amber-600">In Storage</span>
            <div className="text-2xl font-black text-[#060D1E]">33</div>
            <span className="text-[10px] font-bold text-slate-500">Rack B capacity</span>
          </div>
        </div>

        {/* Hourly Distribution Bar Chart */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <h3 className="text-xs font-black uppercase text-[#060D1E] mb-1">
            Hourly Peak Intake Distribution
          </h3>
          <p className="text-[10px] font-bold text-slate-500 mb-3">
            Highest rush between 6:00 PM and 9:00 PM
          </p>

          <div className="h-32 flex items-end justify-between gap-3 pt-3 pb-1 border-b border-slate-100">
            {hourlyDistribution.map((h) => (
              <div key={h.time} className="flex-1 flex flex-col items-center h-full justify-end">
                <div
                  className="w-full bg-[#1E60F2] rounded-t-lg border border-[#060D1E]"
                  style={{ height: h.height }}
                />
                <span className="text-[10px] font-black text-slate-500 mt-1">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={() => alert('Society Report for Greenview Heights exported to CSV.')}
          className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 active:scale-95 text-[#060D1E] font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-[#1E60F2]" />
          <span>Export Monthly Audit Report (CSV)</span>
        </button>
      </div>
    </div>
  );
};
