import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'general' | 'resident' | 'society' | 'security';
  question: string;
  answer: string;
  highlight?: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'what-is-parcelflow',
    category: 'general',
    question: 'What is ParcelFlow?',
    answer: 'ParcelFlow is a modern parcel management platform built specifically for apartment complexes and gated societies. Instead of couriers dropping off packages chaotically or calling residents in the middle of meetings, ParcelFlow logs packages safely at your society parcel hub and lets residents choose a convenient evening pickup time.',
    highlight: 'Your parcel. Your schedule. Zero missed calls.'
  },
  {
    id: 'society-dependency',
    category: 'society',
    question: 'Do I need to be part of a society using ParcelFlow?',
    answer: 'Yes. ParcelFlow works as a community-level infrastructure. When a residential society partners with ParcelFlow, our digital hub check-in system is deployed at the gate or clubhouse. Residents can then download the mobile app, link their flat number, and immediately start receiving real-time delivery notifications and scheduling pickups.',
    highlight: 'If your society isn’t onboarded yet, you can invite your RWA / management committee to request a pilot!'
  },
  {
    id: 'storage-location',
    category: 'security',
    question: 'Where is my parcel stored?',
    answer: 'Parcels are stored in a designated, secure ParcelFlow hub area inside your society premises (such as the security office, management facility, or designated parcel room). Each package is tagged with a digital tracking ID and monitored until handover.',
    highlight: 'CCTV-monitored, weather-protected, and guarded around the clock.'
  },
  {
    id: 'proxy-collection',
    category: 'resident',
    question: 'Can someone else collect my parcel on my behalf?',
    answer: 'Yes! You can easily delegate pickup to a family member, roommate, or trusted neighbor. Simply share your 4-digit collection OTP or forwarding QR token directly through WhatsApp or SMS from inside the ParcelFlow app. The security desk will verify the token and hand over the parcel securely.',
    highlight: 'Single-use cryptographic OTP protects against unauthorized pick-ups.'
  },
  {
    id: 'qr-otp-verification',
    category: 'security',
    question: 'How does QR/OTP verification work?',
    answer: 'When a courier logs your package at the gate hub, ParcelFlow generates a unique, time-stamped digital token. When you arrive at the hub during your chosen window, the security personnel scans your app’s dynamic QR code (or enters your 4-digit OTP). The system instantly confirms resident identity, matching parcel ID, and logs the timestamp in an immutable society audit trail.',
    highlight: 'Eliminates lost packages, false deliveries, and sign-sheet disputes.'
  },
  {
    id: 'doorstep-delivery',
    category: 'general',
    question: 'Does ParcelFlow deliver the parcel to my apartment doorstep?',
    answer: 'In our standard Phase 1 model, ParcelFlow operates the society central hub where residents pick up their parcels at their convenience on their way back home from work, gym, or errands. In Phase 2, societies can opt-in to scheduled internal doorstep shuttle runs during defined evening windows (e.g., 7:00 PM – 9:00 PM).',
    highlight: 'No random courier strangers wandering inside your apartment towers.'
  },
  {
    id: 'missed-window',
    category: 'resident',
    question: 'What happens if I miss my scheduled pickup window?',
    answer: 'No worries at all! If your meeting runs late or you get stuck in traffic, your parcel remains safe inside the secure hub. You can simply tap "Reschedule" in the ParcelFlow app to choose a later slot that evening or the following day.',
    highlight: 'No penalty or return-to-sender panic. Your item stays guarded.'
  },
  {
    id: 'how-to-get-started',
    category: 'society',
    question: 'How does my society get started with ParcelFlow?',
    answer: 'Getting started takes less than 48 hours. Society managers or RWA members can click "Join Society Pilot". Our onboarding team provides tablet devices, barcode scanners, and full 1-hour staff training free of charge during our pilot evaluation period.',
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
  const [openIds, setOpenIds] = useState<string[]>(['what-is-parcelflow']);
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
    <section id="faq" className="relative py-24 bg-slate-900/60 text-slate-100 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We’ve Got Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Everything you need to know about how ParcelFlow transforms delivery management for residents and societies.
          </p>
        </div>

        {/* Optional Search Bar */}
        {showSearch && (
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g., OTP, storage, society pilot)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-inner"
            />
          </div>
        )}

        {/* Category Filter Pills */}
        {showCategories && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'resident', label: 'For Residents' },
              { id: 'society', label: 'For Societies & RWAs' },
              { id: 'security', label: 'Security & Verification' },
              { id: 'general', label: 'General' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {displayedFaqs.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-800">
              <p className="text-slate-400 text-sm">No questions found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 text-blue-400 text-xs font-semibold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            displayedFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'bg-slate-800/80 border-blue-500/40 shadow-xl shadow-blue-500/5' 
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700/80 hover:bg-slate-800/60'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    type="button"
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-base sm:text-lg text-white">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-500/20 text-blue-400 rotate-180' : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-700/40 space-y-3">
                      <p>{faq.answer}</p>
                      {faq.highlight && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs sm:text-sm font-medium">
                          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
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
        <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-base font-semibold text-white">Still have more questions?</h4>
            <p className="text-sm text-slate-400">Our engineering and onboarding teams are always here to help.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/faq"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <span>View Full FAQ Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:support@parcelflow.app"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-md shadow-blue-500/20"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
