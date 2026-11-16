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
  Lock,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { DownloadCTA } from '../components/DownloadCTA';
import { Sticker } from '../components/Sticker';

interface FeaturesPageProps {
  onOpenPilotModal?: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onOpenPilotModal }) => {
  const [activeTab, setActiveTab] = useState<'residents' | 'societies' | 'security'>('residents');

  const roleMeta = {
    residents: {
      title: 'For Apartment Residents',
      tagline: 'Take back control over your delivery schedule. Zero missed calls.',
      stickerColor: 'orange' as const,
      stickerLabel: '🏠 Residents First',
      badgeColor: 'bg-orange-100 text-orange-950 border-orange-300'
    },
    societies: {
      title: 'For Societies & RWAs',
      tagline: 'Transform chaotic gate piles into an organized community amenity.',
      stickerColor: 'blue' as const,
      stickerLabel: '🏢 Society Management',
      badgeColor: 'bg-blue-100 text-blue-950 border-blue-300'
    },
    security: {
      title: 'For Security & Gate Staff',
      tagline: 'Fast 30-second intakes and foolproof QR code handovers.',
      stickerColor: 'mint' as const,
      stickerLabel: '🔐 Gate Operations',
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300'
    }
  };

  const residentFeatures = [
    {
      icon: Clock,
      color: 'bg-amber-100 text-amber-800',
      badge: 'Time Freedom',
      title: 'Custom Evening Pickup Windows',
      description: 'Choose when you want to collect your parcels: 6:30 PM, 7:30 PM, 8:30 PM, or next day. No more rushing home or having couriers wait outside.'
    },
    {
      icon: Bell,
      color: 'bg-blue-100 text-blue-800',
      badge: 'Live Alerts',
      title: 'Instant Arrival Notifications',
      description: 'Receive real-time notifications with photos of the parcel label, carrier details (Amazon, Flipkart, Bluedart, etc.), and assigned hub location.'
    },
    {
      icon: QrCode,
      color: 'bg-emerald-100 text-emerald-800',
      badge: 'Tamper-Proof',
      title: 'Cryptographic QR & OTP Collection',
      description: 'Collect your package in under 15 seconds with a high-security dynamic QR code or 4-digit backup OTP. Never sign a messy paper register again.'
    },
    {
      icon: Users,
      color: 'bg-purple-100 text-purple-800',
      badge: 'WhatsApp Share',
      title: 'One-Tap Proxy Delegation',
      description: 'Easily send your pickup token to family members, roommates, or neighbors via WhatsApp with a single tap from the app.'
    },
    {
      icon: Lock,
      color: 'bg-rose-100 text-rose-800',
      badge: '100% Privacy',
      title: 'Complete Contact Privacy',
      description: 'Never share your personal mobile number with unknown delivery personnel. Couriers interface solely with the society hub.'
    },
    {
      icon: Layers,
      color: 'bg-cyan-100 text-cyan-800',
      badge: 'Consolidated',
      title: 'Multi-Parcel Batch Pickup',
      description: 'Got 4 deliveries arriving across the day? Collect all of them together in one single trip when you return home in the evening.'
    }
  ];

  const societyFeatures = [
    {
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-800',
      badge: 'Clean Lobby',
      title: 'Zero Gate & Lobby Congestion',
      description: 'Eliminates couriers parking bikes haphazardly, blocking vehicle boom gates, or leaving piles of unattended packages in reception lobbies.'
    },
    {
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-800',
      badge: 'Live Analytics',
      title: 'Real-Time Society Parcel Dashboard',
      description: 'Full live metrics on total daily inbound parcels, collection rates, peak hour distributions, and pending collections across all towers.'
    },
    {
      icon: FileText,
      color: 'bg-amber-100 text-amber-800',
      badge: 'Accountability',
      title: 'Digital Audit Logs & Dispute Defense',
      description: 'Every parcel movement has an immutable digital trail with exact timestamps, staff IDs, and verification receipts. Zero lost package disputes.'
    },
    {
      icon: Zap,
      color: 'bg-orange-100 text-orange-800',
      badge: '48-Hour Setup',
      title: 'Rapid 48-Hour Onboarding',
      description: 'Plug-and-play setup. We supply dedicated tablets, optical scanners, and train your security staff in under 60 minutes free of charge.'
    },
    {
      icon: Users,
      color: 'bg-purple-100 text-purple-800',
      badge: 'Easy Sync',
      title: 'Resident Directory Sync',
      description: 'Seamless integration with existing resident rosters (MyGate, NoBrokerHood, Adda, or custom CSV rosters) with automated tenant handover.'
    },
    {
      icon: Building2,
      color: 'bg-indigo-100 text-indigo-800',
      badge: 'Smart Space',
      title: 'Optimized Real Estate Utilization',
      description: 'Transforms small unused clubhouse rooms, basement alcoves, or guardhouses into organized, high-density parcel storage hubs.'
    }
  ];

  const securityFeatures = [
    {
      icon: Zap,
      color: 'bg-amber-100 text-amber-800',
      badge: '30s Check-In',
      title: '30-Second Courier Ingestion',
      description: 'Scan carrier tracking barcodes using handheld camera scanners with auto-recognition. Hands-free, fast, and effortless.'
    },
    {
      icon: QrCode,
      color: 'bg-emerald-100 text-emerald-800',
      badge: 'Foolproof',
      title: 'Instant QR / OTP Verification',
      description: 'Scan resident app QR codes with a green checkmark confirmation. Security guards never need to guess or verify handwritten signatures.'
    },
    {
      icon: Layers,
      color: 'bg-blue-100 text-blue-800',
      badge: 'Numbered Shelves',
      title: 'Color-Coded Bay Management',
      description: 'Intelligent bin assignment guides staff directly to the exact shelf row (e.g. Shelf B-04) within 5 seconds.'
    },
    {
      icon: Eye,
      color: 'bg-rose-100 text-rose-800',
      badge: 'Tower Safety',
      title: 'Restricted Tower Access',
      description: 'No unverified external delivery delivery boys wandering through residential corridors, elevators, or floor lobbies.'
    },
    {
      icon: Lock,
      color: 'bg-purple-100 text-purple-800',
      badge: 'Role Logins',
      title: 'Role-Based Staff Access',
      description: 'Strict individual staff logins ensure each handover is recorded under the active duty officer, preventing confusion.'
    },
    {
      icon: Smartphone,
      color: 'bg-cyan-100 text-cyan-800',
      badge: 'Offline Safe',
      title: 'Offline-Resilient Operation',
      description: 'Hub check-in continues running even if the gate Wi-Fi momentarily drops, syncing automatically when connectivity resumes.'
    }
  ];

  const activeFeatures = 
    activeTab === 'residents' ? residentFeatures :
    activeTab === 'societies' ? societyFeatures : securityFeatures;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] pt-28 pb-16 selection:bg-amber-300 selection:text-[#0F172A]">
      
      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sticker color="yellow" rotate="slight-left" size="sm">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#0F172A]" />
            Feature Architecture
          </Sticker>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
          Engineered for everyone in <br />
          <span className="text-blue-600 underline decoration-amber-400 decoration-wavy decoration-2">
            the apartment parcel chain.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto">
          Tailored tools and friendly experiences designed specifically for residents, society management committees, and security gate staff.
        </p>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setActiveTab('residents')}
            type="button"
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black border-[2.5px] border-[#0F172A] transition-all cursor-pointer ${
              activeTab === 'residents'
                ? 'bg-amber-400 text-[#0F172A] shadow-[4px_4px_0px_#0F172A] -translate-y-0.5'
                : 'bg-white text-[#0F172A] hover:bg-amber-50 shadow-[2px_2px_0px_#0F172A]'
            }`}
          >
            <Smartphone className="w-4 h-4 stroke-[2.5]" />
            <span>For Residents</span>
          </button>

          <button
            onClick={() => setActiveTab('societies')}
            type="button"
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black border-[2.5px] border-[#0F172A] transition-all cursor-pointer ${
              activeTab === 'societies'
                ? 'bg-blue-600 text-white shadow-[4px_4px_0px_#0F172A] -translate-y-0.5'
                : 'bg-white text-[#0F172A] hover:bg-blue-50 shadow-[2px_2px_0px_#0F172A]'
            }`}
          >
            <Building2 className="w-4 h-4 stroke-[2.5]" />
            <span>For Societies & RWAs</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            type="button"
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black border-[2.5px] border-[#0F172A] transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-500 text-[#0F172A] shadow-[4px_4px_0px_#0F172A] -translate-y-0.5'
                : 'bg-white text-[#0F172A] hover:bg-emerald-50 shadow-[2px_2px_0px_#0F172A]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>For Security & Gate Staff</span>
          </button>
        </div>
      </div>

      {/* Role Banner Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-[3px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Sticker color={roleMeta[activeTab].stickerColor} rotate="none" size="md">
              {roleMeta[activeTab].stickerLabel}
            </Sticker>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                {roleMeta[activeTab].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {roleMeta[activeTab].tagline}
              </p>
            </div>
          </div>
          {onOpenPilotModal && activeTab === 'societies' && (
            <button
              onClick={onOpenPilotModal}
              className="px-4.5 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs border-[2px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
            >
              Request 48-Hr Pilot →
            </button>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] hover:shadow-[6px_6px_0px_#0F172A] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl border-[2px] border-[#0F172A] flex items-center justify-center shadow-[2px_2px_0px_#0F172A] ${feat.color}`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 border-[1.5px] border-[#0F172A] text-slate-700 shadow-[1px_1px_0px_#0F172A]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0F172A] mb-2 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Sticker color="mint" rotate="slight-left" size="sm" className="mb-3 inline-flex">
            Head-to-Head Comparison
          </Sticker>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
            Traditional Gate Chaos vs ParcelFlow
          </h2>
          <p className="text-slate-600 font-medium text-sm sm:text-base mt-2">
            Why forward-thinking apartment communities are making the switch.
          </p>
        </div>

        <div className="rounded-3xl bg-white border-[3px] border-[#0F172A] overflow-hidden shadow-[6px_6px_0px_#0F172A]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-[#FAF7F2] text-xs font-black uppercase tracking-wider text-[#0F172A] border-b-[2.5px] border-[#0F172A]">
                <tr>
                  <th className="py-4 px-6">Operational Area</th>
                  <th className="py-4 px-6 text-rose-700 bg-rose-50/70 border-l-[2px] border-[#0F172A]">
                    ❌ Traditional Gate Mess
                  </th>
                  <th className="py-4 px-6 text-emerald-800 bg-emerald-50/70 border-l-[2px] border-[#0F172A]">
                    ✅ With ParcelFlow
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-[2px] divide-[#0F172A] text-slate-700 font-medium">
                <tr>
                  <td className="py-4 px-6 font-black text-[#0F172A]">Delivery Timing</td>
                  <td className="py-4 px-6 bg-rose-50/30 border-l-[2px] border-[#0F172A] text-slate-600">
                    Random midday calls during office meetings or client pitches
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/30 border-l-[2px] border-[#0F172A] text-emerald-950 font-bold">
                    Choose your own evening pickup slot when you are actually home
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black text-[#0F172A]">Gate & Lobby Space</td>
                  <td className="py-4 px-6 bg-rose-50/30 border-l-[2px] border-[#0F172A] text-slate-600">
                    Piles of cardboard boxes dumped near security desks and lobby sofas
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/30 border-l-[2px] border-[#0F172A] text-emerald-950 font-bold">
                    Designated, organized parcel storage bays with CCTV surveillance
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black text-[#0F172A]">Collection Verification</td>
                  <td className="py-4 px-6 bg-rose-50/30 border-l-[2px] border-[#0F172A] text-slate-600">
                    Unverified verbal flat claiming or smudged paper registers
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/30 border-l-[2px] border-[#0F172A] text-emerald-950 font-bold">
                    Dynamic QR / 4-digit backup OTP verified on scanner in 15 seconds
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black text-[#0F172A]">Tower Security</td>
                  <td className="py-4 px-6 bg-rose-50/30 border-l-[2px] border-[#0F172A] text-slate-600">
                    Dozens of unknown delivery riders roaming elevator lobbies and hallways
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/30 border-l-[2px] border-[#0F172A] text-emerald-950 font-bold">
                    Controlled gate hub handover; zero delivery foot traffic inside towers
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-black text-[#0F172A]">Lost Package Defense</td>
                  <td className="py-4 px-6 bg-rose-50/30 border-l-[2px] border-[#0F172A] text-slate-600">
                    Arguments and finger-pointing over misplaced or claimed boxes
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/30 border-l-[2px] border-[#0F172A] text-emerald-950 font-bold">
                    100% immutable digital audit trail with staff timestamp and photos
                  </td>
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
