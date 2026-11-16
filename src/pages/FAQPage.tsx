import React from 'react';
import { FAQ } from '../components/FAQ';
import { DownloadCTA } from '../components/DownloadCTA';
import { Mail, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';

interface FAQPageProps {
  onOpenPilotModal?: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenPilotModal }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16">
      
      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Knowledge Base & Support</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Help Center & <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Frequently Asked Questions.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Find comprehensive answers about parcel collection, privacy, security protocols, and bringing ParcelFlow to your residential society.
        </p>
      </div>

      {/* Main FAQ Component with Search & Categories Enabled */}
      <FAQ showCategories={true} showSearch={true} />

      {/* Contact Channels Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white">Can’t find what you’re looking for?</h3>
          <p className="text-sm text-slate-400 mt-1">Our support team is active 7 days a week.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white">Email Inquiries</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">For general inquiries and pilot info.</p>
            <a 
              href="mailto:support@parcelflow.app" 
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              support@parcelflow.app
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white">Society Pilot Desk</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">For RWAs & Management Committees.</p>
            <button 
              onClick={onOpenPilotModal}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Book 15-min Pilot Call
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white">Security Desk Support</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">Urgent terminal / scanner assistance.</p>
            <span className="text-xs text-indigo-300 font-mono">
              +91 (080) 4120-PARCEL
            </span>
          </div>
        </div>
      </div>

      {/* Download CTA */}
      <DownloadCTA onOpenPilotModal={onOpenPilotModal} />

    </div>
  );
};
