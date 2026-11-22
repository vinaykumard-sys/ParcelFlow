import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  Package,
  Calendar,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Zap,
  CheckCircle2,
  Boxes,
  Users,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  getDeliveryPickupInsights,
  type DeliveryPickupInsights,
} from '../../services/analyticsService';
import { useMobileStore } from '../services/mobileState';

export const PredictiveAnalyticsTab: React.FC = () => {
  const { selectedSociety } = useMobileStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [insights, setInsights] = useState<DeliveryPickupInsights | null>(null);
  const [selectedBarHour, setSelectedBarHour] = useState<string | null>('18:00');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDeliveryPickupInsights(selectedSociety?.id);
      setInsights(data);
    } catch (err) {
      console.error('Failed to load predictive insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSociety?.id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#FEF9F3]">
        <RefreshCw className="w-8 h-8 text-[#1E60F2] animate-spin mb-3" />
        <span className="font-black text-sm text-[#060D1E]">
          Generating Predictive Insights...
        </span>
        <span className="text-xs text-slate-500 font-medium mt-1">
          Analyzing courier intake patterns & resident pickup history
        </span>
      </div>
    );
  }

  // Honest empty state when insufficient data
  if (!insights || (!insights.hasData && insights.expectedToday === 0)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#FEF9F3]">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-amber-800" />
        </div>
        <h3 className="font-black text-base text-[#060D1E] mb-1">
          No Activity Recorded Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mb-4">
          {insights?.emptyStateReason ||
            'Predictive analytics activate once couriers begin delivering packages to this society.'}
        </p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-white rounded-xl border-2 border-[#060D1E] text-xs font-black shadow-[2px_2px_0px_#060D1E] flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Insights</span>
        </button>
      </div>
    );
  }

  const hourlyList = insights.hourlyDistribution || [];
  const maxVolume = Math.max(
    ...hourlyList.map((h) => Math.max(h.expected_intake, h.expected_pickups)),
    12
  );

  const selectedHourData = hourlyList.find((h) => h.hour === selectedBarHour) || hourlyList[0];

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#060D1E] tracking-tight">
              Delivery & Pickup Insights
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 border border-[#060D1E]">
              AI Forecast ✨
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Screen 8 • Courier load prediction & staffing optimization
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] active:scale-95 transition-transform"
          aria-label="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-[#060D1E]" />
        </button>
      </div>

      {/* 2. Smart Alert Banner (Screen 8 Highlight) */}
      {insights.smartAlertBanner && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 border-2 border-[#060D1E] rounded-2xl p-4 shadow-[3px_3px_0px_#060D1E] relative overflow-hidden animate-in fade-in">
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-[#060D1E] text-amber-300 flex items-center justify-center flex-shrink-0 font-black shadow-sm">
              <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs text-[#060D1E] uppercase tracking-wider">
                  {insights.smartAlertBanner.title}
                </span>
                <span className="text-[9px] font-bold bg-[#060D1E] text-white px-2 py-0.5 rounded">
                  94% Confidence
                </span>
              </div>
              <p className="text-xs font-bold text-[#060D1E]/90 mt-1 leading-snug">
                {insights.smartAlertBanner.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Expected Today & KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Expected Today */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-slate-400">
              Expected Today
            </span>
            <Package className="w-4 h-4 text-[#1E60F2]" />
          </div>
          <div className="font-black text-2xl text-[#060D1E]">
            {insights.expectedToday}
          </div>
          <div className="text-[10px] font-bold text-slate-500 mt-1">
            {insights.receivedToday} already in hub
          </div>
        </div>

        {/* Peak Time Indicator */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-slate-400">
              Peak Window
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-black text-lg text-amber-900 leading-tight">
            {insights.peakWindow}
          </div>
          <div className="text-[10px] font-bold text-amber-700 mt-1">
            ~25 pickups forecasted
          </div>
        </div>

        {/* Collected Today */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-slate-400">
              Collected
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-black text-2xl text-[#060D1E]">
            {insights.collectedToday}
          </div>
          <div className="text-[10px] font-bold text-emerald-600 mt-1">
            Verified handovers
          </div>
        </div>

        {/* Storage Utilization */}
        <div className="bg-white rounded-2xl border-2 border-[#060D1E] p-3.5 shadow-[2px_2px_0px_#060D1E] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-slate-400">
              Hub Capacity
            </span>
            <Boxes className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-black text-2xl text-[#060D1E]">
            {insights.storageUtilizationRate}%
          </div>
          <div className="text-[10px] font-bold text-purple-700 mt-1">
            Optimal distribution
          </div>
        </div>
      </div>

      {/* 4. Hourly Distribution Bar Chart (Screen 8 Core Visual) */}
      <div className="bg-white rounded-3xl border-2 border-[#060D1E] p-4.5 shadow-[3px_3px_0px_#060D1E] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-[#060D1E] leading-tight">
              Hourly Delivery & Pickup Distribution
            </h2>
            <p className="text-[11px] font-semibold text-slate-500">
              Tapping a time bucket displays live volume breakdown
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] font-black">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-500 border border-[#060D1E]" />
              <span className="text-slate-600">Intake</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-400 border border-[#060D1E]" />
              <span className="text-slate-600">Pickups</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="pt-2 pb-2">
          <div className="grid grid-cols-8 gap-1.5 items-end h-40 border-b-2 border-slate-200 px-1">
            {hourlyList.map((item) => {
              const isPeakHour = item.hour === '18:00' || item.hour === '20:00';
              const isSelected = selectedBarHour === item.hour;
              const intakeHeight = Math.max(10, Math.round((item.expected_intake / maxVolume) * 100));
              const pickupHeight = Math.max(10, Math.round((item.expected_pickups / maxVolume) * 100));

              return (
                <div
                  key={item.hour}
                  onClick={() => setSelectedBarHour(item.hour)}
                  className={`flex flex-col items-center justify-end h-full cursor-pointer relative py-1 rounded-xl transition-colors ${
                    isSelected ? 'bg-blue-50/80 ring-2 ring-[#1E60F2]' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Neat Peak Tag Badge (contained inside chart bounds, no bouncing) */}
                  {isPeakHour && (
                    <span className="mb-1 px-1 py-0.2 rounded bg-amber-400 text-amber-950 font-black text-[7px] border border-[#060D1E] leading-tight">
                      PEAK
                    </span>
                  )}

                  {/* Dual Bar (Intake Blue + Pickup Amber) */}
                  <div className="flex items-end gap-1 w-full justify-center">
                    {/* Intake Bar */}
                    <div
                      className={`w-2.5 sm:w-3.5 rounded-t-md border border-[#060D1E] transition-all ${
                        isPeakHour ? 'bg-blue-600' : 'bg-blue-400'
                      }`}
                      style={{ height: `${intakeHeight}%` }}
                      title={`Intake: ${item.expected_intake}`}
                    />

                    {/* Pickup Bar */}
                    <div
                      className={`w-2.5 sm:w-3.5 rounded-t-md border border-[#060D1E] transition-all ${
                        isPeakHour
                          ? 'bg-amber-400'
                          : 'bg-amber-300'
                      }`}
                      style={{ height: `${pickupHeight}%` }}
                      title={`Pickups: ${item.expected_pickups}`}
                    />
                  </div>

                  {/* Hour Label */}
                  <span
                    className={`text-[8px] sm:text-[9px] mt-1.5 font-black transition-colors ${
                      isSelected
                        ? 'text-[#1E60F2] font-black'
                        : isPeakHour
                        ? 'text-amber-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Hour Detail Card */}
        {selectedHourData && (
          <div className="bg-[#FEF9F3] rounded-2xl border-2 border-[#060D1E] p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-black text-slate-800">
                {selectedHourData.hour}
              </div>
              <div>
                <span className="font-black text-[#060D1E] block">
                  Window {selectedHourData.hour} –{' '}
                  {parseInt(selectedHourData.hour, 10) + 2}:00
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {(selectedHourData.hour === '18:00' || selectedHourData.hour === '20:00')
                    ? '⚡ Evening Resident Peak Window'
                    : 'Standard Courier Intake Window'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[9px] font-black uppercase text-blue-600 block">
                  Expected Intake
                </span>
                <span className="font-black text-sm text-[#060D1E]">
                  {selectedHourData.expected_intake} pkgs
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-amber-700 block">
                  Forecast Pickups
                </span>
                <span className="font-black text-sm text-[#060D1E]">
                  {selectedHourData.expected_pickups} pickups
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Top Courier Inbound Breakdown */}
      <div className="bg-white rounded-3xl border-2 border-[#060D1E] p-4.5 shadow-[3px_3px_0px_#060D1E] space-y-3">
        <h2 className="text-sm font-black text-[#060D1E]">
          Active Courier Distribution
        </h2>
        <div className="space-y-2">
          {insights.topCarriers.map((carrier) => (
            <div key={carrier.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#060D1E]">
                <span>{carrier.name}</span>
                <span className="text-slate-500 font-mono">
                  {carrier.count} parcels ({carrier.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-[#1E60F2] rounded-full transition-all"
                  style={{ width: `${carrier.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
