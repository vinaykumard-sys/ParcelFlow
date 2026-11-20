import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
  Layers,
  Lock,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../services/adminService';
import {
  subscriptionService,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanTier,
  type BillingCycle,
  type SocietySubscription
} from '../../../src/services/subscriptionService';

export const SubscriptionScreen: React.FC = () => {
  const activeSociety = adminService.getActiveSociety();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [subscription, setSubscription] = useState<SocietySubscription | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    const sub = await subscriptionService.getSocietySubscription(activeSociety.id);
    const u = await subscriptionService.getSubscriptionUsage(activeSociety.id);
    setSubscription(sub);
    setUsage(u);
    if (sub.billing_cycle) setBillingCycle(sub.billing_cycle);
  };

  useEffect(() => {
    loadData();
  }, [activeSociety.id]);

  const handleSelectPlan = async (tier: SubscriptionPlanTier) => {
    setLoading(true);
    setSuccessMsg(null);
    const result = await subscriptionService.updateSocietySubscription({
      societyId: activeSociety.id,
      plan: tier,
      billingCycle,
    });
    setLoading(false);
    if (result.success && result.subscription) {
      setSubscription(result.subscription);
      setSuccessMsg(`Successfully updated society subscription to ${tier}!`);
      loadData();
    }
  };

  const currentTier = subscription?.plan || 'PROFESSIONAL';

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0A1128] tracking-tight">
              Society Subscription & Quotas
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-black bg-blue-100 text-[#1E60F2] rounded-full border border-blue-300">
              {activeSociety.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Manage society locker plan, monthly parcel volume allowances, and hardware telemetry.
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="flex items-center p-1 bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] rounded-xl self-start">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              billingCycle === 'MONTHLY'
                ? 'bg-[#0A1128] text-white'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('ANNUAL')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg flex items-center gap-1.5 transition-all ${
              billingCycle === 'ANNUAL'
                ? 'bg-[#1E60F2] text-white'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <span>Annual (Save 17%)</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 shadow-[2px_2px_0px_#10B981] rounded-2xl flex items-center gap-2 text-xs font-black text-emerald-950">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quota & Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-500 uppercase">Monthly Parcels</span>
            <span className="text-xs font-black text-[#1E60F2]">
              {usage?.parcelsUsed || 112} / {usage?.parcelsLimit || 2500}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-[#1E60F2] h-full rounded-full transition-all"
              style={{ width: `${usage?.parcelUsagePercent || 5}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 font-bold mt-2">
            {usage?.parcelUsagePercent || 5}% of monthly tier volume utilized
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-500 uppercase">Storage Compartments</span>
            <span className="text-xs font-black text-emerald-600">
              {usage?.storageSlotsUsed || 33} / {usage?.storageSlotsLimit || 100}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-[#10B981] h-full rounded-full transition-all"
              style={{ width: `${usage?.storageUsagePercent || 33}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 font-bold mt-2">
            {usage?.storageUsagePercent || 33}% active hub slots occupied
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-500 uppercase">Active Subscription</span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              {subscription?.status || 'ACTIVE'}
            </span>
          </div>
          <p className="text-lg font-black text-[#0A1128]">{SUBSCRIPTION_PLANS[currentTier].name}</p>
          <p className="text-[11px] text-slate-500 font-bold mt-1">
            Renews: {new Date(subscription?.current_period_end || Date.now() + 25 * 86400000).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Subscription Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div
          className={`bg-white rounded-3xl p-6 border-[3px] transition-all flex flex-col justify-between ${
            currentTier === 'STARTER'
              ? 'border-[#1E60F2] ring-4 ring-blue-100 shadow-[6px_6px_0px_#1E60F2]'
              : 'border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Starter Hub
              </span>
              {currentTier === 'STARTER' && (
                <span className="px-2.5 py-0.5 bg-blue-100 text-[#1E60F2] text-[10px] font-black rounded-full border border-blue-300">
                  Current Plan
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-black text-[#0A1128]">
                ₹{billingCycle === 'ANNUAL' ? '29,990' : '2,999'}
              </span>
              <span className="text-xs font-bold text-slate-500">
                /{billingCycle === 'ANNUAL' ? 'year' : 'mo'}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-bold mb-6">
              Essential smart parcel management for boutique societies and single-tower communities.
            </p>

            <ul className="space-y-3 mb-6">
              {SUBSCRIPTION_PLANS.STARTER.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('STARTER')}
            disabled={currentTier === 'STARTER' || loading}
            className={`w-full py-3 px-4 rounded-xl text-xs font-black border-2 transition-all ${
              currentTier === 'STARTER'
                ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-default'
                : 'bg-white hover:bg-slate-100 text-[#0A1128] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]'
            }`}
          >
            {currentTier === 'STARTER' ? 'Current Plan' : 'Downgrade to Starter'}
          </button>
        </div>

        {/* Professional Plan (Popular) */}
        <div
          className={`bg-white rounded-3xl p-6 border-[3px] transition-all flex flex-col justify-between relative ${
            currentTier === 'PROFESSIONAL'
              ? 'border-[#1E60F2] ring-4 ring-blue-100 shadow-[6px_6px_0px_#1E60F2]'
              : 'border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1'
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1E60F2] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
            Most Popular in Bangalore
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 mt-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#1E60F2]">
                Professional Society
              </span>
              {currentTier === 'PROFESSIONAL' && (
                <span className="px-2.5 py-0.5 bg-blue-100 text-[#1E60F2] text-[10px] font-black rounded-full border border-blue-300">
                  Current Plan
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-black text-[#0A1128]">
                ₹{billingCycle === 'ANNUAL' ? '69,990' : '6,999'}
              </span>
              <span className="text-xs font-bold text-slate-500">
                /{billingCycle === 'ANNUAL' ? 'year' : 'mo'}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-bold mb-6">
              Comprehensive locker infrastructure with 30-min evening batch windows and priority notifications.
            </p>

            <ul className="space-y-3 mb-6">
              {SUBSCRIPTION_PLANS.PROFESSIONAL.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1E60F2] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('PROFESSIONAL')}
            disabled={currentTier === 'PROFESSIONAL' || loading}
            className={`w-full py-3 px-4 rounded-xl text-xs font-black border-2 transition-all ${
              currentTier === 'PROFESSIONAL'
                ? 'bg-blue-50 text-[#1E60F2] border-blue-300 cursor-default font-extrabold'
                : 'bg-[#1E60F2] hover:bg-blue-600 text-white border-[#0A1128] shadow-[2px_2px_0px_#0A1128]'
            }`}
          >
            {currentTier === 'PROFESSIONAL' ? 'Active Plan' : 'Upgrade to Professional'}
          </button>
        </div>

        {/* Enterprise Custom Plan */}
        <div
          className={`bg-white rounded-3xl p-6 border-[3px] transition-all flex flex-col justify-between ${
            currentTier === 'ENTERPRISE'
              ? 'border-[#1E60F2] ring-4 ring-blue-100 shadow-[6px_6px_0px_#1E60F2]'
              : 'border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Enterprise Custom
              </span>
              {currentTier === 'ENTERPRISE' && (
                <span className="px-2.5 py-0.5 bg-blue-100 text-[#1E60F2] text-[10px] font-black rounded-full border border-blue-300">
                  Current Plan
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-black text-[#0A1128]">Custom</span>
              <span className="text-xs font-bold text-slate-500">/tailored SLA</span>
            </div>
            <p className="text-xs text-slate-600 font-bold mb-6">
              Multi-tower society federations with gate API integration, dedicated lockers, and 24/7 on-site support.
            </p>

            <ul className="space-y-3 mb-6">
              {SUBSCRIPTION_PLANS.ENTERPRISE.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('ENTERPRISE')}
            disabled={currentTier === 'ENTERPRISE' || loading}
            className={`w-full py-3 px-4 rounded-xl text-xs font-black border-2 transition-all ${
              currentTier === 'ENTERPRISE'
                ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-default'
                : 'bg-[#0A1128] hover:bg-black text-white border-[#0A1128] shadow-[2px_2px_0px_#0A1128]'
            }`}
          >
            {currentTier === 'ENTERPRISE' ? 'Current Plan' : 'Switch to Enterprise'}
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-3xl border-2 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-6">
        <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider mb-4">
          Recent Billing Statements & GST Invoices
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-slate-700">
            <thead className="border-b-2 border-slate-200 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="pb-3">Invoice ID</th>
                <th className="pb-3">Billing Period</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Amount (INR)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-mono">INV-2026-11-001</td>
                <td className="py-3">Nov 01, 2026 – Nov 30, 2026</td>
                <td className="py-3">Professional Society</td>
                <td className="py-3">₹6,999 + 18% GST</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    PAID
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button className="text-[#1E60F2] hover:underline flex items-center gap-1 justify-end ml-auto">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-mono">INV-2026-10-001</td>
                <td className="py-3">Oct 01, 2026 – Oct 31, 2026</td>
                <td className="py-3">Professional Society</td>
                <td className="py-3">₹6,999 + 18% GST</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    PAID
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button className="text-[#1E60F2] hover:underline flex items-center gap-1 justify-end ml-auto">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
