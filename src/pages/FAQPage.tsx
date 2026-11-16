import React from 'react';
import { FAQ } from '../components/FAQ';
import { DownloadCTA } from '../components/DownloadCTA';
import { Mail, MessageSquare, PhoneCall, Sparkles, HelpCircle } from 'lucide-react';
import { Sticker } from '../components/Sticker';

interface FAQPageProps {
  onOpenPilotModal?: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenPilotModal }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] pt-28 pb-16 selection:bg-amber-300 selection:text-[#0F172A]">
      
      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sticker color="blue" rotate="slight-left" size="sm">
            <HelpCircle className="w-3.5 h-3.5 inline mr-1 text-white" />
            Knowledge Base & Support
          </Sticker>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
          Help Center & <br />
          <span className="text-blue-600 underline decoration-amber-400 decoration-wavy decoration-2">
            Frequently Asked Questions.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
          Clear answers about parcel pickup windows, security protocols, proxy collection, and rolling out ParcelFlow in your apartment community.
        </p>

        {/* Fun floating stickers row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <Sticker color="mint" rotate="slight-left" size="sm">
            ✓ 100% Transparent
          </Sticker>
          <Sticker color="yellow" rotate="slight-right" size="sm">
            ⚡ Quick Answers
          </Sticker>
          <Sticker color="orange" rotate="slight-left" size="sm">
            🏢 Society Ready
          </Sticker>
        </div>
      </div>

      {/* Main FAQ Component with Search & Categories Enabled */}
      <FAQ showCategories={true} showSearch={true} />

      {/* Contact Channels Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <div className="text-center mb-10">
          <Sticker color="purple" rotate="none" size="sm" className="mb-3 inline-flex">
            Always Here To Help
          </Sticker>
          <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Can’t find what you’re looking for?</h3>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">Our support team is active 7 days a week.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Email */}
          <div className="p-6 rounded-2xl bg-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] text-center flex flex-col items-center hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 border-[2px] border-[#0F172A] text-blue-700 flex items-center justify-center mb-4 shadow-[2px_2px_0px_#0F172A]">
              <Mail className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-[#0F172A] text-lg">Email Inquiries</h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 mb-4">For general questions and pilot queries.</p>
            <a 
              href="mailto:support@parcelflow.app" 
              className="mt-auto px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
            >
              support@parcelflow.app
            </a>
          </div>

          {/* Society Pilot Desk */}
          <div className="p-6 rounded-2xl bg-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] text-center flex flex-col items-center hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-[2px] border-[#0F172A] text-amber-800 flex items-center justify-center mb-4 shadow-[2px_2px_0px_#0F172A]">
              <MessageSquare className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-[#0F172A] text-lg">Society Pilot Desk</h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 mb-4">For RWAs & Management Committees.</p>
            <button 
              onClick={onOpenPilotModal}
              className="mt-auto px-4 py-2 rounded-xl bg-amber-400 text-[#0F172A] font-black text-xs border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
            >
              Book 15-min Pilot Call
            </button>
          </div>

          {/* Security Desk Hotline */}
          <div className="p-6 rounded-2xl bg-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] text-center flex flex-col items-center hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-[2px] border-[#0F172A] text-emerald-800 flex items-center justify-center mb-4 shadow-[2px_2px_0px_#0F172A]">
              <PhoneCall className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h4 className="font-black text-[#0F172A] text-lg">Gate Staff Support</h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 mb-4">Immediate terminal & scanner guidance.</p>
            <span className="mt-auto px-3.5 py-2 rounded-xl bg-slate-100 text-[#0F172A] font-mono font-bold text-xs border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
              +91 (080) 4120-FLOW
            </span>
          </div>
        </div>
      </div>

      {/* Download CTA */}
      <DownloadCTA onOpenPilotModal={onOpenPilotModal} />

    </div>
  );
};
