import React, { useState, useEffect } from 'react';
import {
  CreditCard,
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
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import {
  subscriptionService,
  SUBSCRIPTION_PLANS,
} from '../../services/subscriptionService';
import type {
  SubscriptionPlanTier,
  BillingCycle,
} from '../../services/subscriptionService';

export const AdminSubscriptionsTab: React.FC = () => {
  const { selectedSociety } = useMobileStore();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [activeTier, setActiveTier] = useState<SubscriptionPlanTier>('PROFESSIONAL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Sync current society subscription
    const currentSub = subscriptionService.getSubscription(selectedSociety.id);
    if (currentSub) {
      setActiveTier(currentSub.plan);
      setBillingCycle(currentSub.billing_cycle);
    }
  }, [selectedSociety.id]);

  const handleUpgradePlan = async (tier: SubscriptionPlanTier) => {
    setIsUpdating(true);
    try {
      const res = await subscriptionService.updateSubscription(selectedSociety.id, {
        plan: tier,
        billing_cycle: billingCycle,
      });
      if (res.success) {
        setActiveTier(tier);
        showToast(`Plan successfully updated to ${SUBSCRIPTION_PLANS[tier].name}!`);
      } else {
        showToast(res.error || 'Failed to update subscription.');
      }
    } catch {
      setActiveTier(tier);
      showToast(`Plan updated to ${SUBSCRIPTION_PLANS[tier].name}!`);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentPlan = SUBSCRIPTION_PLANS[activeTier];

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#1E60F2]" />
              <span className="text-xs font-bold text-slate-500">Society Subscriptions</span>
            </div>
            <h1 className="text-lg font-black text-[#060D1E]">
              {selectedSociety.name}
            </h1>
          </div>
          <span className="text-xs font-black px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300">
            Active Hub
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="mx-5 mt-2 p-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
        {/* Active Plan Card */}
        <div className="bg-[#060D1E] text-white p-5 rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Current Plan
            </span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              {billingCycle}
            </span>
          </div>

          <h2 className="text-2xl font-black mb-1">{currentPlan.name}</h2>
          <div className="text-2xl font-black text-amber-400 mb-3">
            ₹
            {billingCycle === 'MONTHLY'
              ? currentPlan.priceMonthlyINR.toLocaleString('en-IN')
              : currentPlan.priceAnnualINR.toLocaleString('en-IN')}
            <span className="text-xs text-slate-300 font-medium">
              /{billingCycle === 'MONTHLY' ? 'month' : 'year'}
            </span>
          </div>

          {/* Quota Utilization Gauges */}
          <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-300">Monthly Parcel Volume</span>
                <span className="text-amber-400 font-black">
                  182 / {currentPlan.parcelLimit === 999999 ? 'Unlimited' : currentPlan.parcelLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: '36%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-300">Storage Locker Racks</span>
                <span className="text-emerald-400 font-black">
                  21 / {currentPlan.storageSlotsLimit === 9999 ? 'Custom' : currentPlan.storageSlotsLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: '42%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="bg-white p-1.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-between">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              billingCycle === 'MONTHLY'
                ? 'bg-[#1E60F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('ANNUAL')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              billingCycle === 'ANNUAL'
                ? 'bg-[#1E60F2] text-white shadow-xs'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <span>Annual</span>
            <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-md">
              Save 17%
            </span>
          </button>
        </div>

        {/* Tier Upgrade Cards */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            Available Plans
          </h3>

          <div className="space-y-3">
            {(Object.keys(SUBSCRIPTION_PLANS) as SubscriptionPlanTier[]).map((tierKey) => {
              const plan = SUBSCRIPTION_PLANS[tierKey];
              const isCurrent = activeTier === tierKey;
              const price =
                billingCycle === 'MONTHLY'
                  ? plan.priceMonthlyINR
                  : plan.priceAnnualINR;

              return (
                <div
                  key={tierKey}
                  className={`bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] transition-all relative ${
                    isCurrent ? 'ring-2 ring-[#1E60F2] bg-blue-50/20' : ''
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-[#060D1E]">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-black text-[#060D1E]">{plan.name}</h4>
                  </div>

                  <p className="text-[11px] font-medium text-slate-600 mb-2">
                    {plan.description}
                  </p>

                  <div className="text-xl font-black text-[#060D1E] mb-3">
                    ₹{price.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-500 font-bold">
                      /{billingCycle === 'MONTHLY' ? 'mo' : 'yr'}
                    </span>
                  </div>

                  {/* Feature Bullets */}
                  <div className="space-y-1 mb-4 text-[11px] font-semibold text-slate-700">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-emerald-100 text-emerald-900 border-2 border-[#060D1E] rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Current Active Plan
                    </button>
                  ) : (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleUpgradePlan(tierKey)}
                      className="w-full py-2.5 bg-[#1E60F2] hover:bg-blue-600 text-white border-2 border-[#060D1E] rounded-xl font-black text-xs shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-all"
                    >
                      {tierKey === 'STARTER' ? 'Downgrade to Starter' : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
