import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  Sparkles,
  ArrowRight,
  MessageCircleQuestion,
  CheckCircle2,
  Package
} from 'lucide-react';
import { Sticker } from './Sticker';

export interface FAQItem {
  id: string;
  category: 'general' | 'resident' | 'society' | 'security';
  categoryLabel: string;
  categoryColor: 'blue' | 'yellow' | 'mint' | 'orange';
  question: string;
  answer: string;
  highlight?: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'what-is-parcelflow',
    category: 'general',
    categoryLabel: 'Basics',
    categoryColor: 'yellow',
    question: 'What is ParcelFlow?',
    answer: 'ParcelFlow is a friendly parcel management platform built specifically for apartment complexes and gated societies. Instead of couriers dropping off packages chaotically or calling residents in the middle of meetings, ParcelFlow logs packages safely at your society parcel hub and lets residents choose a convenient evening pickup time.',
    highlight: 'Your parcel. Your schedule. Zero missed courier calls.'
  },
  {
    id: 'society-dependency',
    category: 'society',
    categoryLabel: 'Societies',
    categoryColor: 'blue',
    question: 'Do I need to be part of a society using ParcelFlow?',
    answer: 'Yes! ParcelFlow works as a community-level service. When a residential society partners with ParcelFlow, our digital hub check-in system is deployed at the gate or clubhouse. Residents can then download the mobile app, link their flat number, and immediately start receiving real-time delivery notifications and scheduling pickups.',
    highlight: 'If your society isn’t onboarded yet, you can invite your RWA / committee to request a free pilot!'
  },
  {
    id: 'storage-location',
    category: 'security',
    categoryLabel: 'Security',
    categoryColor: 'mint',
    question: 'Where is my parcel stored?',
    answer: 'Parcels are stored in a designated, secure ParcelFlow hub area inside your society premises (such as the security office, management facility, or designated parcel room). Each package is tagged with a digital tracking ID and monitored until handover.',
    highlight: 'CCTV-monitored, weather-protected, and guarded around the clock.'
  },
  {
    id: 'proxy-collection',
    category: 'resident',
    categoryLabel: 'Residents',
    categoryColor: 'orange',
    question: 'Can someone else collect my parcel on my behalf?',
    answer: 'Yes! You can easily delegate pickup to a family member, roommate, or trusted neighbor. Simply share your 4-digit collection OTP or forwarding QR token directly through WhatsApp or SMS from inside the ParcelFlow app. The security desk will verify the token and hand over the parcel securely.',
    highlight: 'Single-use cryptographic OTP protects against unauthorized pick-ups.'
  },
  {
    id: 'qr-otp-verification',
    category: 'security',
    categoryLabel: 'Verification',
    categoryColor: 'mint',
    question: 'How does QR/OTP verification work?',
    answer: 'When a courier logs your package at the gate hub, ParcelFlow generates a unique, time-stamped digital token. When you arrive at the hub during your chosen window, the security personnel scans your app’s dynamic QR code (or enters your 4-digit OTP). The system instantly confirms resident identity, matching parcel ID, and logs the timestamp in an immutable society audit trail.',
    highlight: 'Eliminates lost packages, false deliveries, and sign-sheet disputes.'
  },
  {
    id: 'doorstep-delivery',
    category: 'general',
    categoryLabel: 'Delivery',
    categoryColor: 'yellow',
    question: 'Does ParcelFlow deliver the parcel to my apartment doorstep?',
    answer: 'In our standard Phase 1 model, ParcelFlow operates the society central hub where residents pick up their parcels at their convenience on their way back home from work, gym, or errands. In Phase 2, societies can opt-in to scheduled internal doorstep shuttle runs during defined evening windows (e.g., 7:00 PM – 9:00 PM).',
    highlight: 'No random courier strangers wandering inside your apartment towers.'
  },
  {
    id: 'missed-window',
    category: 'resident',
    categoryLabel: 'Pickup Slots',
    categoryColor: 'orange',
    question: 'What happens if I miss my scheduled pickup window?',
    answer: 'No worries at all! If your meeting runs late or you get stuck in traffic, your parcel remains completely safe inside the secure hub. You can simply tap "Reschedule" in the ParcelFlow app to choose a later slot that evening or the following day.',
    highlight: 'No penalty or return-to-sender panic. Your item stays guarded.'
  },
  {
    id: 'how-to-get-started',
    category: 'society',
    categoryLabel: 'Onboarding',
    categoryColor: 'blue',
    question: 'How does my society get started with ParcelFlow?',
    answer: 'Getting started takes less than 48 hours. Society managers or RWA members can click "Join Society Pilot". Our onboarding team provides tablet devices, barcode scanners, and full staff training free of charge during our pilot evaluation period.',
    highlight: 'Zero capital expenditure. Plug-and-play operations.'
  }
];

interface FAQProps {
  limit?: number;
  showCategories?: boolean;
  showSearch?: boolean;
}

export const FAQ: React.FC<FAQProps> = ({ 
  limit, 
  showCategories = true, 
  showSearch = false 
}) => {
  const [openIds, setOpenIds] = useState<string[]>(['what-is-parcelflow', 'proxy-collection']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleAccordion = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(item => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedFaqs = limit ? filteredFaqs.slice(0, limit) : filteredFaqs;

  return (
    <section id="faq" className="relative py-24 bg-[#FEF9F3] text-[#0A1128] overflow-hidden">
      {/* Decorative cartoon elements in background */}
      <div className="absolute top-10 left-8 opacity-25 pointer-events-none hidden md:block">
        <div className="w-16 h-16 rounded-full border-[3px] border-[#0A1128] bg-amber-300 shadow-[3px_3px_0px_#0A1128]" />
      </div>
      <div className="absolute bottom-12 right-10 opacity-25 pointer-events-none hidden md:block">
        <div className="w-12 h-12 rounded-xl rotate-12 border-[3px] border-[#0A1128] bg-blue-400 shadow-[3px_3px_0px_#0A1128]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sticker color="yellow" rotate="slight-left" size="sm">
              <MessageCircleQuestion className="w-3.5 h-3.5 inline mr-1 text-[#0A1128]" />
              Got Questions?
            </Sticker>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0A1128]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            Everything you need to know about parcel pickup windows, security checks, and bringing ParcelFlow to your society.
          </p>
        </div>

        {/* Optional Search Bar */}
        {showSearch && (
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g. OTP, timing, flat delegate)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-[2.5px] border-[#0A1128] rounded-2xl text-[#0A1128] font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 shadow-[4px_4px_0px_#0A1128] text-sm"
            />
          </div>
        )}

        {/* Category Filter Pills */}
        {showCategories && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {[
              { id: 'all', label: 'All Questions', emoji: '✨' },
              { id: 'resident', label: 'For Residents', emoji: '🏠' },
              { id: 'society', label: 'For Societies & RWAs', emoji: '🏢' },
              { id: 'security', label: 'Security & Verification', emoji: '🔐' },
              { id: 'general', label: 'General Info', emoji: '📦' },
            ].map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-[2px] border-[#0A1128] transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-[3px_3px_0px_#0A1128] -translate-y-0.5'
                      : 'bg-white hover:bg-amber-50 text-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {displayedFaqs.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128]">
              <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-700 font-semibold text-sm">No questions found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 px-4 py-1.5 bg-amber-400 border-[2px] border-[#0A1128] rounded-xl text-xs font-bold shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 transition-all"
              >
                Reset search
              </button>
            </div>
          ) : (
            displayedFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border-[2.5px] border-[#0A1128] transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'bg-white shadow-[5px_5px_0px_#0A1128] -translate-y-0.5' 
                      : 'bg-white/95 hover:bg-white shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    type="button"
                    className="w-full px-5 sm:px-6 py-4.5 flex items-center justify-between text-left gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <span className="hidden sm:inline-block">
                        <Sticker color={faq.categoryColor} size="sm" rotate="none" shadow="sm">
                          {faq.categoryLabel}
                        </Sticker>
                      </span>
                      <span className="font-extrabold text-base sm:text-lg text-[#0A1128] leading-snug">
                        {faq.question}
                      </span>
                    </div>

                    <div className={`w-8 h-8 rounded-xl border-[2px] border-[#0A1128] flex items-center justify-center shrink-0 transition-transform duration-200 shadow-[2px_2px_0px_#0A1128] ${
                      isOpen ? 'bg-amber-400 rotate-180' : 'bg-slate-100 hover:bg-slate-200'
                    }`}>
                      <ChevronDown className="w-4 h-4 text-[#0A1128] stroke-[2.5]" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-700 text-sm sm:text-base leading-relaxed border-t-[2px] border-slate-200 space-y-3 bg-[#FEF9F3]">
                      <p className="font-medium text-slate-800">{faq.answer}</p>
                      {faq.highlight && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-100/70 border-[2px] border-amber-300 text-amber-950 text-xs sm:text-sm font-bold shadow-sm">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Support Prompt */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border-[2.5px] border-[#0A1128] shadow-[5px_5px_0px_#0A1128] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-[#0A1128]" />
              <h4 className="text-base font-black text-[#0A1128]">Still have more questions?</h4>
            </div>
            <p className="text-sm font-medium text-slate-600">Our team in Bengaluru is always happy to explain how it fits your building.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/faq"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1128] border-[2px] border-[#0A1128] text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 transition-all"
            >
              <span>Full FAQ Hub</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
            <a
              href="mailto:support@parcelflow.app"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border-[2px] border-[#0A1128] text-xs font-black shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
