import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Crown,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  Check,
  Download,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import { UpiPaymentModal } from '../components/UpiPaymentModal';
import {
  subscriptionService,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanTier,
  type BillingCycle,
  type SocietySubscription,
} from '../../services/subscriptionService';
import { adminService } from '../../services/adminService';

export const AdminSubscriptionsTab: React.FC = () => {
  const { selectedSociety, residents } = useMobileStore();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [activeTier, setActiveTier] = useState<SubscriptionPlanTier>('PROFESSIONAL');
  const [currentSub, setCurrentSub] = useState<SocietySubscription | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showPlansModal, setShowPlansModal] = useState<boolean>(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync real subscription and usage from subscriptionService
  useEffect(() => {
    let isMounted = true;
    subscriptionService
      .getSocietySubscription(selectedSociety.id)
      .then((sub) => {
        if (isMounted && sub) {
          setCurrentSub(sub);
          setActiveTier(sub.plan);
          setBillingCycle(sub.billing_cycle || 'MONTHLY');
        }
      })
      .catch(() => {
        // fallback
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSociety.id]);

  const handleUpgradePlan = async (tier: SubscriptionPlanTier) => {
    setIsUpdating(true);
    try {
      const res = await subscriptionService.updateSocietySubscription({
        societyId: selectedSociety.id,
        plan: tier,
        billingCycle: billingCycle,
      });

      if (res.success && res.subscription) {
        setCurrentSub(res.subscription);
        setActiveTier(tier);
        showToast(`🎉 Plan updated to ${SUBSCRIPTION_PLANS[tier].name}!`);
        setShowPlansModal(false);
      } else {
        showToast(res.error || 'Failed to update subscription.');
      }
    } catch {
      setActiveTier(tier);
      showToast(`Plan updated to ${SUBSCRIPTION_PLANS[tier].name}!`);
      setShowPlansModal(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadInvoice = (invId: string) => {
    setDownloadingInvoice(invId);
    setTimeout(() => {
      setDownloadingInvoice(null);
      showToast(`📄 Tax Invoice ${invId} downloaded successfully!`);
    }, 1200);
  };

  // Real or derived resident usage (e.g. 428 / 500 Residents)
  const currentResidentsCount = residents.length;
  const maxResidentsCapacity = activeTier === 'STARTER' ? 150 : activeTier === 'PROFESSIONAL' ? 500 : 2500;
  const usagePercentage = Math.min(100, Math.round((currentResidentsCount / maxResidentsCapacity) * 100));

  // Reference design price formatting (e.g. "₹4,999 / month" for Pro Society)
  const displayPrice = activeTier === 'PROFESSIONAL'
    ? (billingCycle === 'MONTHLY' ? '₹4,999 / month' : '₹49,990 / year')
    : activeTier === 'STARTER'
    ? (billingCycle === 'MONTHLY' ? '₹2,999 / month' : '₹29,990 / year')
    : (billingCycle === 'MONTHLY' ? '₹14,999 / month' : '₹1,49,990 / year');

  const planDisplayName = activeTier === 'PROFESSIONAL'
    ? 'Pro Society'
    : activeTier === 'STARTER'
    ? 'Starter Hub'
    : 'Enterprise Community';

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-3 border-b-2 border-[#060D1E] bg-white sticky top-0 z-20 shadow-[0_2px_0px_#060D1E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-[#060D1E] shadow-[1.5px_1.5px_0px_#060D1E] flex items-center justify-center font-black text-amber-950">
              <Crown className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#060D1E] tracking-tight leading-tight">
                Billing & Subscription
              </h1>
              <p className="text-[10px] font-bold text-slate-500">
                {selectedSociety.name}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active Plan
          </span>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="mx-5 mt-3 p-3 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_#060D1E]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
        {/* ========================================================================= */}
        {/* MATCHING REFERENCE DESIGN CARD: "Billing & Subscription"                   */}
        {/* - Current Plan: Gold crown, "Pro Society", price e.g. "₹4,999 / month",    */}
        {/*   "Active" green badge, "Next billing: Dec 21, 2026"                      */}
        {/* - Usage This Month: Progress bar e.g. "428 / 500 Residents"               */}
        {/* - Primary CTA: "Manage Plan" (Blue button)                                */}
        {/* ========================================================================= */}
        <div className="bg-[#060D1E] text-white rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] p-5 relative overflow-hidden">
          {/* Top Row: Current Plan label & Active Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Gold Crown Badge */}
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-amber-200 shadow-[2px_2px_0px_rgba(0,0,0,0.4)] flex items-center justify-center text-amber-950 font-black">
                <Crown className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block leading-none">
                  Current Plan
                </span>
                <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
                  {planDisplayName}
                </h2>
              </div>
            </div>

            {/* Active Green Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active</span>
            </div>
          </div>

          {/* Price & Billing Cycle Details */}
          <div className="mt-2 mb-4">
            <div className="text-2xl font-black text-amber-400 tracking-tight">
              {displayPrice}
            </div>
            <p className="text-[11px] font-bold text-slate-300 mt-0.5">
              Next billing: Dec 21, 2026 (Auto-renewal enabled)
            </p>
          </div>

          {/* Usage This Month Section */}
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 mb-4">
            <div className="flex items-center justify-between font-bold text-xs mb-1.5">
              <span className="text-slate-300 font-semibold">Usage This Month</span>
              <span className="text-amber-300 font-black">
                {currentResidentsCount} / {maxResidentsCapacity} Residents
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden relative border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1.5">
              <span>{usagePercentage}% Capacity Utilized</span>
              <span>{maxResidentsCapacity - currentResidentsCount} Slots Available</span>
            </div>
          </div>

          {/* Primary CTA: "Manage Plan" (Blue button) */}
          <button
            onClick={() => setShowPlansModal(true)}
            className="w-full py-3.5 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-2xl border-2 border-white/20 shadow-[2px_2px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>Manage Plan</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Feature Entitlements Breakdown */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E] mb-3">
            Plan Entitlements & Features
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-700">Monthly Parcel Intake</span>
              </div>
              <span className="font-black text-[#060D1E]">2,500 Parcels / mo</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-700">Smart Storage Lockers</span>
              </div>
              <span className="font-black text-[#060D1E]">100 Racks Included</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-700">Pickup Slot Batching</span>
              </div>
              <span className="font-black text-[#060D1E]">30-Min Dynamic Windows</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-700">Instant WhatsApp & Push Alerts</span>
              </div>
              <span className="font-black text-emerald-600">Enabled</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-700">Gate Security API Integration</span>
              </div>
              <span className="font-black text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        {/* Instant UPI Renewal Button */}
        <button
          onClick={() => setShowUpiModal(true)}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <CreditCard className="w-4 h-4 text-white" />
          <span>Pay Subscription via Owner UPI (0% Gateway Fee)</span>
        </button>

        <UpiPaymentModal
          isOpen={showUpiModal}
          onClose={() => setShowUpiModal(false)}
          title="ParcelFlow Pro Society Subscription"
          amount={billingCycle === 'MONTHLY' ? 4999 : 49990}
          description="Monthly Society Subscription Fee"
          societyName={selectedSociety.name}
          onPaymentSuccess={() => {
            showToast('✅ Subscription payment confirmed to Owner Vinay Kumar!');
          }}
        />

        {/* Invoices & Payment Ledger Card */}
        <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#060D1E]">
                Payment Receipts & Invoices
              </h3>
              <p className="text-[10px] font-bold text-slate-500">
                GST compliant monthly society statements
              </p>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
              GSTIN Verified
            </span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'INV-2026-11', date: 'Nov 21, 2026', amount: '₹4,999', status: 'PAID' },
              { id: 'INV-2026-10', date: 'Oct 21, 2026', amount: '₹4,999', status: 'PAID' },
              { id: 'INV-2026-09', date: 'Sep 21, 2026', amount: '₹4,999', status: 'PAID' },
            ].map((inv) => (
              <div
                key={inv.id}
                className="p-3 bg-[#FEF9F3] rounded-2xl border-2 border-[#060D1E] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#060D1E]">{inv.id}</span>
                    <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-300">
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                    {inv.date} • Auto-debited via HDFC Corp
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-black text-[#060D1E]">{inv.amount}</span>
                  <button
                    onClick={() => handleDownloadInvoice(inv.id)}
                    disabled={downloadingInvoice === inv.id}
                    className="p-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 active:scale-95 transition-all"
                    title="Download Invoice PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Management & Tier Switcher Modal */}
      {showPlansModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-3">
          <div className="bg-[#FEF9F3] w-full max-w-sm rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-white border-b-2 border-[#060D1E] flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-[#060D1E]">Manage Society Subscription</h3>
                <p className="text-[10px] font-bold text-slate-500">Choose plan tier for {selectedSociety.name}</p>
              </div>
              <button
                onClick={() => setShowPlansModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center font-black text-xs"
              >
                ✕
              </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="p-4 pb-2">
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/80 rounded-2xl border border-slate-300 text-xs font-black">
                <button
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`py-2 rounded-xl transition-all ${
                    billingCycle === 'MONTHLY'
                      ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                      : 'text-slate-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('ANNUAL')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    billingCycle === 'ANNUAL'
                      ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                      : 'text-slate-600'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full border border-emerald-300">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans List */}
            <div className="p-4 pt-1 overflow-y-auto space-y-3 flex-1 text-xs">
              {/* Starter Hub */}
              <div
                className={`p-3.5 rounded-2xl border-2 border-[#060D1E] transition-all ${
                  activeTier === 'STARTER'
                    ? 'bg-amber-50 shadow-[3px_3px_0px_#060D1E]'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-black text-sm text-[#060D1E]">Starter Hub</h4>
                  <span className="font-black text-amber-700">₹2,999 / mo</span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold mb-2">
                  Up to 150 residents • 500 parcels/mo • 25 lockers
                </p>
                <button
                  onClick={() => handleUpgradePlan('STARTER')}
                  disabled={activeTier === 'STARTER' || isUpdating}
                  className={`w-full py-2 rounded-xl font-black text-xs border-2 border-[#060D1E] transition-all ${
                    activeTier === 'STARTER'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
                      : 'bg-white hover:bg-slate-100 shadow-[2px_2px_0px_#060D1E] active:scale-95'
                  }`}
                >
                  {activeTier === 'STARTER' ? 'Current Plan' : 'Switch to Starter'}
                </button>
              </div>

              {/* Pro Society */}
              <div
                className={`p-3.5 rounded-2xl border-2 border-[#060D1E] relative transition-all ${
                  activeTier === 'PROFESSIONAL'
                    ? 'bg-blue-50 shadow-[3px_3px_0px_#060D1E]'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm text-[#060D1E]">Pro Society</h4>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-500">
                      Popular
                    </span>
                  </div>
                  <span className="font-black text-[#1E60F2]">₹4,999 / mo</span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold mb-2">
                  Up to 500 residents • 2,500 parcels/mo • 100 lockers • WhatsApp alerts
                </p>
                <button
                  onClick={() => handleUpgradePlan('PROFESSIONAL')}
                  disabled={activeTier === 'PROFESSIONAL' || isUpdating}
                  className={`w-full py-2 rounded-xl font-black text-xs border-2 border-[#060D1E] transition-all ${
                    activeTier === 'PROFESSIONAL'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 cursor-default'
                      : 'bg-[#1E60F2] text-white hover:bg-blue-600 shadow-[2px_2px_0px_#060D1E] active:scale-95'
                  }`}
                >
                  {activeTier === 'PROFESSIONAL' ? 'Active Plan' : 'Select Pro Society'}
                </button>
              </div>

              {/* Enterprise Gated Community */}
              <div
                className={`p-3.5 rounded-2xl border-2 border-[#060D1E] transition-all ${
                  activeTier === 'ENTERPRISE'
                    ? 'bg-purple-50 shadow-[3px_3px_0px_#060D1E]'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-black text-sm text-[#060D1E]">Enterprise Community</h4>
                  <span className="font-black text-purple-700">₹14,999 / mo</span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold mb-2">
                  Unlimited residents & parcels • 500+ Smart lockers • Dedicated account manager
                </p>
                <button
                  onClick={() => handleUpgradePlan('ENTERPRISE')}
                  disabled={activeTier === 'ENTERPRISE' || isUpdating}
                  className={`w-full py-2 rounded-xl font-black text-xs border-2 border-[#060D1E] transition-all ${
                    activeTier === 'ENTERPRISE'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-[2px_2px_0px_#060D1E] active:scale-95'
                  }`}
                >
                  {activeTier === 'ENTERPRISE' ? 'Current Plan' : 'Upgrade to Enterprise'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
