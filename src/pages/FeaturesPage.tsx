import React, { useState } from 'react';
import { 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Clock, 
  QrCode, 
  Sparkles, 
  Bell, 
  Users, 
  BarChart3, 
  Layers, 
  Zap, 
  Eye, 
  FileText, 
  Lock
} from 'lucide-react';
import { DownloadCTA } from '../components/DownloadCTA';

interface FeaturesPageProps {
  onOpenPilotModal?: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onOpenPilotModal }) => {
  const [activeTab, setActiveTab] = useState<'residents' | 'societies' | 'security'>('residents');

  const residentFeatures = [
    {
      icon: Clock,
      title: 'Custom Evening Pickup Windows',
      description: 'Choose when you want to collect your parcels: 6:30 PM, 7:30 PM, 8:30 PM, or next day. No more rushing home or stressing over couriers waiting outside.'
    },
    {
      icon: Bell,
      title: 'Instant Arrival Notifications',
      description: 'Receive real-time notifications with photos of the parcel label, carrier details (Amazon, Flipkart, Bluedart, etc.), and assigned hub location.'
    },
    {
      icon: QrCode,
      title: 'Cryptographic QR & OTP Collection',
      description: 'Collect your package in under 15 seconds with a high-security dynamic QR code or 4-digit backup OTP. Never sign a messy paper register again.'
    },
    {
      icon: Users,
      title: 'One-Tap Proxy Delegation',
      description: 'Easily send your pickup token to family members, roommates, or neighbors via WhatsApp with a single tap from the app.'
    },
    {
      icon: Lock,
      title: 'Complete Contact Privacy',
      description: 'Never share your personal mobile number with unknown delivery personnel. Couriers interface solely with the society hub.'
    },
    {
      icon: Layers,
      title: 'Consolidated Multi-Parcel Pickup',
      description: 'Got 4 deliveries arriving across the day? Collect all of them together in one single trip when you return home.'
    }
  ];

  const societyFeatures = [
    {
      icon: ShieldCheck,
      title: 'Zero Gate & Lobby Congestion',
      description: 'Eliminates couriers parking bikes haphazardly, blocking vehicle boom gates, or leaving piles of unattended packages in reception lobbies.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Society Parcel Dashboard',
      description: 'Full live metrics on total daily inbound parcels, collection rates, peak hour distributions, and pending collections across all towers.'
    },
    {
      icon: FileText,
      title: 'Digital Audit Logs & Accountability',
      description: 'Every parcel movement has an immutable digital trail with exact timestamps, staff IDs, and verification receipts. Zero lost package disputes.'
    },
    {
      icon: Zap,
      title: 'Rapid 48-Hour Deployment',
      description: 'Plug-and-play setup. We supply dedicated tablets, optical scanners, and train your security staff in under 60 minutes.'
    },
    {
      icon: Users,
      title: 'Resident Directory Sync',
      description: 'Seamless integration with existing resident rosters (MyGate, NoBrokerHood, Adda, or custom CSV rosters) with automated tenant handover.'
    },
    {
      icon: Building2,
      title: 'Optimized Real Estate Utilization',
      description: 'Transforms small unused clubhouse rooms, basement alcoves, or guardhouses into organized, high-density parcel storage hubs.'
    }
  ];

  const securityFeatures = [
    {
      icon: Zap,
      title: '30-Second Courier Ingestion',
      description: 'Scan carrier tracking barcodes using handheld camera scanners with auto-recognition. Hands-free and effortless.'
    },
    {
      icon: QrCode,
      title: 'Foolproof Resident Verification',
      description: 'Scan resident app QR codes with a green checkmark confirmation. Security guards never need to guess or verify handwritten signatures.'
    },
    {
      icon: Layers,
      title: 'Color-Coded Bay Management',
      description: 'Intelligent bin assignment guides staff directly to the exact shelf row (e.g. Shelf B-04) within 5 seconds.'
    },
    {
      icon: Eye,
      title: 'Restricted Tower Access',
      description: 'No unverified external delivery delivery boys wandering through residential corridors, elevators, or floor lobbies.'
    },
    {
      icon: Lock,
      title: 'Role-Based Staff Access',
      description: 'Strict role logins ensure that each staff member is tracked individually, protecting against internal shrink or mishandling.'
    },
    {
      icon: Smartphone,
      title: 'Offline-Resilient Operation',
      description: 'Hub check-in continues running even if the gate Wi-Fi momentarily drops, syncing automatically when connectivity resumes.'
    }
  ];

  const activeFeatures = 
    activeTab === 'residents' ? residentFeatures :
    activeTab === 'societies' ? societyFeatures : securityFeatures;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16">
      
      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Feature Architecture</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Engineered for everyone in <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            the apartment delivery chain.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Explore specialized capabilities designed specifically for residents, society committees, and security gate staff.
        </p>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setActiveTab('residents')}
            type="button"
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'residents'
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>For Residents</span>
          </button>

          <button
            onClick={() => setActiveTab('societies')}
            type="button"
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'societies'
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>For Societies & RWAs</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            type="button"
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>For Security & Gate Staff</span>
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">Traditional Gate Delivery vs ParcelFlow</h2>
          <p className="text-slate-400 text-sm mt-2">
            Why leading residential communities are upgrading their parcel infrastructure.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6 font-semibold">Operational Aspect</th>
                  <th className="py-4 px-6 font-semibold text-rose-400">Traditional Gate Mess</th>
                  <th className="py-4 px-6 font-semibold text-emerald-400">With ParcelFlow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-4 px-6 font-medium text-white">Delivery Timing</td>
                  <td className="py-4 px-6 text-slate-400">Random daytime calls during meetings or errands</td>
                  <td className="py-4 px-6 text-emerald-300 font-medium">Predictable evening pickup at your chosen time</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-4 px-6 font-medium text-white">Gate & Lobby Clutter</td>
                  <td className="py-4 px-6 text-slate-400">Piles of cardboard boxes dumped near security desks</td>
                  <td className="py-4 px-6 text-emerald-300 font-medium">Designated, organized parcel storage bays</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-4 px-6 font-medium text-white">Verification & Handover</td>
                  <td className="py-4 px-6 text-slate-400">Messy paper register or unverified verbal claiming</td>
                  <td className="py-4 px-6 text-emerald-300 font-medium">Dynamic QR / 4-digit OTP digital scan in 15 seconds</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-4 px-6 font-medium text-white">Tower Security</td>
                  <td className="py-4 px-6 text-slate-400">Dozens of unknown delivery riders roaming corridors</td>
                  <td className="py-4 px-6 text-emerald-300 font-medium">Restricted gate boundary; zero stranger foot traffic</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-4 px-6 font-medium text-white">Dispute Resolution</td>
                  <td className="py-4 px-6 text-slate-400">He-said-she-said arguments over misplaced packages</td>
                  <td className="py-4 px-6 text-emerald-300 font-medium">Tamper-proof digital audit log with photo proofs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Download CTA component */}
      <DownloadCTA onOpenPilotModal={onOpenPilotModal} />

    </div>
  );
};
