import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  Building2,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  Calculator,
  CheckCircle2,
  PhoneCall,
  Download,
  Smartphone,
  Star,
  Layers,
} from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { Sticker } from '../components/Sticker';
import { DownloadCTA } from '../components/DownloadCTA';

interface PricingPageProps {
  onOpenPilotModal?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onOpenPilotModal }) => {
  const { openModal } = useModal();
  const handleOpenPilot = onOpenPilotModal || (() => openModal('pilot'));

  const [isAnnual, setIsAnnual] = useState(false);
  const [flatCount, setFlatCount] = useState<number>(250);

  const plans = [
    {
      id: 'starter',
      name: 'Starter Society',
      badge: 'Boutique Societies',
      tagline: 'Ideal for small standalone apartments up to 150 flats',
      monthlyPrice: 2999,
      annualPrice: 2399,
      flatsLimit: 'Up to 150 Flats',
      parcelsLimit: '1,500 Parcels / mo',
      color: 'bg-white',
      border: 'border-[#0A1128]',
      accentColor: 'bg-blue-100 text-blue-900 border-blue-300',
      popular: false,
      features: [
        'Full Resident Android App & Web Pass',
        'Security Guard Fast QR Barcode Scanner',
        'Standard Evening Pickup Windows (2 slots)',
        'Dual-OTP & QR Code Handover Verification',
        'Single Hub Rack Inventory Management',
        'Email & WhatsApp Resident Notifications',
        'Standard 24-hr Support Resolution',
      ],
      ctaText: 'Start 30-Day Free Pilot',
    },
    {
      id: 'growth',
      name: 'Growth Society',
      badge: 'Most Popular ⭐',
      tagline: 'For mid-size gated communities requiring high throughput',
      monthlyPrice: 4999,
      annualPrice: 3999,
      flatsLimit: 'Up to 500 Flats',
      parcelsLimit: '5,000 Parcels / mo',
      color: 'bg-amber-100',
      border: 'border-[#0A1128]',
      accentColor: 'bg-amber-300 text-[#0A1128] border-[#0A1128]',
      popular: true,
      features: [
        'Everything in Starter Society, plus:',
        'Unlimited Express Counters & Multi-Rack Hubs',
        'Automated Amazon & Flipkart Inbound Matching',
        'Custom Resident Pickup Windows & Rush Alerts',
        'RWA Admin Analytics & Loss Prevention Audit',
        'Live Resident Directory Sync & Move-in Portal',
        'Priority 4-hr Dedicated Support Manager',
      ],
      ctaText: 'Launch Growth Pilot',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Township',
      badge: 'High Volume',
      tagline: 'For large residential townships & integrated smart communities',
      monthlyPrice: 9999,
      annualPrice: 7999,
      flatsLimit: 'Unlimited Flats',
      parcelsLimit: 'Unlimited Parcels',
      color: 'bg-white',
      border: 'border-[#0A1128]',
      accentColor: 'bg-purple-100 text-purple-900 border-purple-300',
      popular: false,
      features: [
        'Everything in Growth Society, plus:',
        'Multi-Gate Township Decentralized Hubs',
        'Temperature-Controlled Pod Integration',
        'Automated Courier Manifest Verification',
        'Custom Society Management ERP / Gate API Integration',
        'Dedicated On-site Implementation Team',
        '99.99% SLA & 24/7 Telephone Escalation',
      ],
      ctaText: 'Schedule Custom Demo',
    },
  ];

  // Flat ROI Calculator
  const estimatedParcelsPerMonth = flatCount * 8; // average 8 packages / flat / mo in India
  const monthlyCost = flatCount <= 150 ? 2999 : flatCount <= 500 ? 4999 : 9999;
  const costPerFlatPerMonth = (monthlyCost / flatCount).toFixed(0);

  const faqs = [
    {
      q: 'Is there a setup or hardware installation fee?',
      a: 'Zero setup fees for our standard mobile & staff scanner rollout. For societies choosing smart modular hardware lockers or security counter racks, hardware is provided on a flexible monthly lease or one-time capital purchase.',
    },
    {
      q: 'How does the 30-day free community pilot work?',
      a: 'We deploy ParcelFlow in your society for 30 days completely free. Our team provides security guard onboarding, resident welcome kits, and dedicated support. If your society is not 100% satisfied, you can cancel with zero obligation.',
    },
    {
      q: 'Can residents download and use the app for free?',
      a: 'Yes, absolutely. The ParcelFlow Resident App is 100% free for all residents, tenants, and family members within subscribed societies.',
    },
    {
      q: 'How are payments collected for society subscriptions?',
      a: 'We accept RWA cheque, direct NEFT/RTGS bank transfer, or automated recurring credit card / UPI payments through our compliant Razorpay gateway with complete GST invoices.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FEF9F3] text-[#0A1128] pt-28 pb-20 relative overflow-hidden selection:bg-amber-300 selection:text-[#0A1128]">
      {/* Decorative Neo-brutalist Background Bubbles */}
      <div className="absolute top-20 right-10 w-28 h-28 rounded-full border-[3px] border-[#0A1128] bg-amber-300 opacity-20 hidden lg:block pointer-events-none" />
      <div className="absolute top-96 left-8 w-20 h-20 rounded-2xl rotate-12 border-[3px] border-[#0A1128] bg-blue-400 opacity-20 hidden lg:block pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sticker color="mint" rotate="slight-left" size="sm">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#0A1128]" />
              Simple, Transparent Society Plans
            </Sticker>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A1128] leading-tight">
            Predictable Pricing for <br />
            <span className="text-[#1E60F2] underline decoration-amber-400 decoration-wavy decoration-2">
              Every Apartment Community
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium">
            From boutique 50-flat apartments to 2,000+ home townships. Flat community pricing with zero per-parcel hidden fees.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                !isAnnual
                  ? 'bg-[#0A1128] text-white shadow-sm'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all ${
                isAnnual
                  ? 'bg-[#1E60F2] text-white shadow-sm'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-amber-400 text-[#0A1128] font-black px-2 py-0.5 rounded-full border border-[#0A1128]">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl border-3 ${plan.border} ${plan.color} p-7 sm:p-8 flex flex-col justify-between relative transition-all duration-200 ${
                  plan.popular
                    ? 'shadow-[7px_7px_0px_#0A1128] md:-translate-y-2'
                    : 'shadow-[5px_5px_0px_#0A1128] hover:-translate-y-1'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 border-2 border-[#0A1128] text-[#0A1128] px-4 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_#0A1128] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#0A1128]" />
                    <span>Most Popular Community Choice</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-black uppercase px-3 py-1 rounded-xl border ${plan.accentColor}`}
                    >
                      {plan.badge}
                    </span>
                    <span className="text-xs font-black text-slate-500">{plan.flatsLimit}</span>
                  </div>

                  <h3 className="text-2xl font-black text-[#0A1128] mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-600 font-semibold mb-6">{plan.tagline}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b-2 border-[#0A1128]/15">
                    <span className="text-4xl sm:text-5xl font-black text-[#0A1128]">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      / month {isAnnual ? '(billed annually)' : ''}
                    </span>
                  </div>

                  {/* Limits Badge */}
                  <div className="mb-6 bg-white/70 p-3 rounded-2xl border border-[#0A1128]/20 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Delivery Capacity:</span>
                    <strong className="text-[#0A1128] font-black">{plan.parcelsLimit}</strong>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-black uppercase tracking-wider text-[#0A1128]">
                      Included Features:
                    </p>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs font-bold text-slate-800">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div>
                  <button
                    type="button"
                    onClick={handleOpenPilot}
                    className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black border-2 border-[#0A1128] flex items-center justify-center gap-2 active:scale-95 transition-all ${
                      plan.popular
                        ? 'bg-[#1E60F2] hover:bg-blue-600 text-white shadow-[3px_3px_0px_#0A1128]'
                        : 'bg-white hover:bg-slate-50 text-[#0A1128] shadow-[3px_3px_0px_#0A1128]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <p className="text-[10px] text-center text-slate-500 font-bold mt-2">
                    Includes 30-day risk-free pilot • No credit card needed
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Society Cost / Flat ROI Calculator */}
        <div className="bg-white rounded-3xl border-3 border-[#0A1128] p-7 sm:p-10 shadow-[6px_6px_0px_#0A1128] mb-20 relative overflow-hidden">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1E60F2] mb-2">
              <Calculator className="w-4 h-4" />
              <span>Society Budget Estimator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-3">
              Calculate Cost Per Flat for Your Society
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-8">
              Adjust the slider to see how minimal the monthly investment is per flat compared to lost courier time and security gate chaos.
            </p>

            {/* Slider */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-sm font-black">
                <span className="text-slate-700">Total Flats in Community:</span>
                <span className="text-xl font-black text-[#1E60F2] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                  {flatCount} Flats
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={flatCount}
                onChange={(e) => setFlatCount(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E60F2]"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                <span>50 Flats (Boutique)</span>
                <span>500 Flats (Mid-size)</span>
                <span>1000+ Flats (Township)</span>
              </div>
            </div>

            {/* Calculation Result Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#FEF9F3] border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
              <div className="p-3 text-center sm:text-left">
                <div className="text-[11px] font-black uppercase text-slate-500">Monthly Society Cost</div>
                <div className="text-2xl font-black text-[#0A1128] mt-1">₹{monthlyCost.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500 font-bold">Fixed RWA maintenance expense</div>
              </div>

              <div className="p-3 text-center sm:text-left border-y sm:border-y-0 sm:border-x border-[#0A1128]/15">
                <div className="text-[11px] font-black uppercase text-emerald-700">Cost Per Flat / Month</div>
                <div className="text-3xl font-black text-emerald-600 mt-1">₹{costPerFlatPerMonth}</div>
                <div className="text-[10px] text-slate-500 font-bold">Less than a single cup of tea ☕</div>
              </div>

              <div className="p-3 text-center sm:text-left flex flex-col justify-center">
                <div className="text-[11px] font-black uppercase text-slate-500">Est. Deliveries Managed</div>
                <div className="text-xl font-black text-[#0A1128] mt-1">~{estimatedParcelsPerMonth.toLocaleString('en-IN')} / mo</div>
                <div className="text-[10px] text-slate-500 font-bold">Zero lost packages or gate chaos</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleOpenPilot}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-[#0A1128] font-black text-xs sm:text-sm rounded-xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span>Request Custom Society Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              Have questions about billing, deployment, or hardware? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]"
              >
                <h3 className="text-sm font-black text-[#0A1128] mb-2 flex items-start gap-2">
                  <span className="text-[#1E60F2] font-black">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-slate-700 font-semibold pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* High-Impact CTA */}
        <DownloadCTA onOpenPilotModal={handleOpenPilot} />
      </div>
    </div>
  );
};
