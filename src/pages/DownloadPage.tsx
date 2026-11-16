import React, { useState } from 'react';
import { submitWaitlistEmail } from '../utils/supabase';
import { useModal } from '../context/ModalContext';
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Apple, 
  Sparkles, 
  QrCode, 
  Building2, 
  Info, 
  Copy,
  Check,
  Package,
  Layers,
  ArrowRight,
  Users,
  UserCheck,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { Sticker } from '../components/Sticker';

interface DownloadPageProps {
  onOpenPilotModal?: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onOpenPilotModal }) => {
  const { openModal } = useModal();
  const handleOpenPilot = onOpenPilotModal || (() => openModal('pilot'));
  const [copiedHash, setCopiedHash] = useState(false);
  const [iosEmail, setIosEmail] = useState('');
  const [iosSubmitted, setIosSubmitted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const sha256Checksum = "9d7069714dddac3177c8e3b504c45fc9d17bb1ac9809c99303a7a7b53283829a";

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Checksum);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleIosNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (iosEmail) {
      setIosSubmitted(true);
      await submitWaitlistEmail(iosEmail, 'ios');
      setIosEmail('');
    }
  };

  const triggerDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/downloads/android/ParcelFlow.apk';
    link.setAttribute('download', 'ParcelFlow.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FEF9F3] text-[#0A1128] pt-28 pb-20 relative overflow-hidden selection:bg-amber-300 selection:text-[#0A1128]">
      
      {/* Decorative cartoon background bubbles */}
      <div className="absolute top-20 right-10 w-24 h-24 rounded-full border-[3px] border-[#0A1128] bg-amber-300 opacity-20 hidden lg:block pointer-events-none" />
      <div className="absolute top-80 left-8 w-16 h-16 rounded-2xl rotate-12 border-[3px] border-[#0A1128] bg-blue-400 opacity-20 hidden lg:block pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sticker color="blue" rotate="slight-left" size="sm">
              <Smartphone className="w-3.5 h-3.5 inline mr-1 text-white" />
              Unified Mobile Release
            </Sticker>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A1128] leading-tight">
            Get <span className="text-blue-600 underline decoration-amber-400 decoration-wavy decoration-2">ParcelFlow</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium">
            Download the official Android APK. One unified application powering verified residents, society hub staff, and RWA management.
          </p>

          {/* Pilot Info Sticker Card */}
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-100 border-[2.5px] border-[#0A1128] text-[#0A1128] text-xs sm:text-sm shadow-[3px_3px_0px_#0A1128] text-left">
            <span className="text-lg">📢</span>
            <span>
              <strong>Pilot Community Release:</strong> Preferred MVP architecture active in partner apartment societies. Single APK with automated role-based navigation.
            </span>
            <button
              onClick={handleOpenPilot}
              className="ml-auto underline font-black text-blue-700 hover:text-blue-900 shrink-0"
            >
              Request Pilot →
            </button>
          </div>
        </div>

        {/* Main Grid: Android Card vs iOS & QR Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Android Card (Dominant, 7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white border-[3px] border-[#0A1128] p-7 sm:p-9 shadow-[6px_6px_0px_#0A1128] relative overflow-hidden">
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-[2.5px] border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-500 border-[2.5px] border-[#0A1128] flex items-center justify-center shadow-[3px_3px_0px_#0A1128]">
                  <Smartphone className="w-7 h-7 text-white stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0A1128]">One Unified Android APK</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-black text-[#0A1128] bg-amber-300 px-2 py-0.5 rounded-lg border-[1.5px] border-[#0A1128] shadow-[1px_1px_0px_#0A1128]">
                      Version 0.1.0
                    </span>
                    <span className="text-xs font-bold text-slate-500">Updated: November 16, 2026</span>
                  </div>
                </div>
              </div>

              <Sticker color="mint" rotate="slight-right" size="sm">
                ✓ Ready to Install
              </Sticker>
            </div>

            {/* Specifications row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-7">
              <div className="p-3 rounded-xl bg-blue-50 border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">OS Requirement</div>
                <div className="text-sm font-black text-[#0A1128] mt-0.5">Android 8.0+</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">APK Size</div>
                <div className="text-sm font-black text-[#0A1128] mt-0.5">2.0 MB</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Architecture</div>
                <div className="text-sm font-black text-[#0A1128] mt-0.5">arm64 / Universal</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Release Date</div>
                <div className="text-sm font-black text-[#0A1128] mt-0.5">Nov 16, 2026</div>
              </div>
            </div>

            {/* Preferred MVP Architecture: Role-Based Explanation */}
            <div className="mb-7 bg-[#FEF9F3] p-5 rounded-2xl border-[2px] border-[#0A1128] shadow-[3px_3px_0px_#0A1128] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                  Preferred MVP Architecture: Unified Role-Based App
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-300">
                  Single APK
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Instead of requiring users to download separate disconnected applications, ParcelFlow packages all functionality into <strong>one unified Android APK</strong>. After logging in with your verified phone number, your assigned role automatically determines your interface:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-white border border-[#0A1128] shadow-sm">
                  <div className="text-xs font-black text-[#0A1128] flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Resident</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight">
                    Delivery tracking, slot scheduling, and dynamic OTP/QR pass generation.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#0A1128] shadow-sm">
                  <div className="text-xs font-black text-[#0A1128] flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Hub Staff</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight">
                    Barcode intake scanner, shelf bin assignment, and handover verification.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#0A1128] shadow-sm">
                  <div className="text-xs font-black text-[#0A1128] flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Society Admin</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight">
                    RWA oversight, staff management, resident directory, and slot capacity.
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] font-semibold text-slate-600">
                🔒 <strong>Security Protocol:</strong> Secure handover using OTP/QR verification through the ParcelFlow app.
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-1">
              <button
                onClick={triggerDownload}
                type="button"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>{downloadStarted ? 'Downloading ParcelFlow.apk...' : 'Download APK (Version 0.1.0)'}</span>
              </button>

              {onOpenPilotModal && (
                <button
                  onClick={onOpenPilotModal}
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#0A1128] font-black text-sm border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-0.5 transition-all"
                >
                  <Building2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Request Society Pilot</span>
                </button>
              )}
            </div>

            {/* Direct Link Fallback */}
            <div className="mt-3 text-center sm:text-left">
              <a 
                href="/downloads/android/ParcelFlow.apk" 
                download="ParcelFlow.apk"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Direct Download Link: /downloads/android/ParcelFlow.apk</span>
              </a>
            </div>

            {/* Checksum & verification */}
            <div className="mt-7 pt-5 border-t-[2px] border-slate-200 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  SHA-256 Checksum Integrity:
                </span>
                <button
                  onClick={handleCopyHash}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border-[1.5px] border-[#0A1128] font-black text-[#0A1128] flex items-center gap-1 text-[11px] shadow-[1px_1px_0px_#0A1128] transition-all"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> : <Copy className="w-3 h-3 stroke-[2.5]" />}
                  <span>{copiedHash ? 'Copied!' : 'Copy Hash'}</span>
                </button>
              </div>
              <p className="font-mono bg-slate-100 p-2.5 rounded-xl border-[1.5px] border-[#0A1128] break-all text-slate-700 text-[11px] font-semibold">
                {sha256Checksum}
              </p>
            </div>
          </div>

          {/* iOS & Scan Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* QR Code Quick Install */}
            <div className="rounded-3xl bg-white border-[3px] border-[#0A1128] p-7 shadow-[5px_5px_0px_#0A1128] text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-3 text-base font-black text-[#0A1128]">
                <QrCode className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                <span>Scan with Phone Camera</span>
              </div>

              <p className="text-xs text-slate-600 font-medium mb-3">
                Point your mobile camera at this code to open direct download link to <strong>/downloads/android/ParcelFlow.apk</strong> on your device.
              </p>
              
              <div className="inline-block bg-white p-3.5 rounded-2xl border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] my-1">
                <div className="w-44 h-44 bg-slate-50 rounded-xl p-2 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full text-[#0A1128] fill-current">
                    <rect x="8" y="8" width="34" height="34" rx="4" fill="#2563EB" stroke="#0A1128" strokeWidth="4" />
                    <rect x="18" y="18" width="14" height="14" fill="#FFFFFF" rx="2" />
                    <rect x="78" y="8" width="34" height="34" rx="4" fill="#2563EB" stroke="#0A1128" strokeWidth="4" />
                    <rect x="88" y="18" width="14" height="14" fill="#FFFFFF" rx="2" />
                    <rect x="8" y="78" width="34" height="34" rx="4" fill="#2563EB" stroke="#0A1128" strokeWidth="4" />
                    <rect x="18" y="88" width="14" height="14" fill="#FFFFFF" rx="2" />
                    <rect x="48" y="12" width="8" height="8" fill="#0A1128" rx="1" />
                    <rect x="60" y="12" width="12" height="8" fill="#0A1128" rx="1" />
                    <rect x="48" y="24" width="10" height="8" fill="#F59E0B" rx="1" />
                    <rect x="64" y="24" width="8" height="8" fill="#0A1128" rx="1" />
                    <rect x="52" y="36" width="16" height="8" fill="#0A1128" rx="1" />
                    <rect x="12" y="48" width="10" height="8" fill="#0A1128" rx="1" />
                    <rect x="28" y="48" width="12" height="8" fill="#0A1128" rx="1" />
                    <rect x="46" y="48" width="8" height="8" fill="#10B981" rx="1" />
                    <rect x="58" y="48" width="16" height="8" fill="#0A1128" rx="1" />
                    <rect x="80" y="48" width="8" height="8" fill="#0A1128" rx="1" />
                    <rect x="94" y="48" width="16" height="8" fill="#0A1128" rx="1" />
                    <rect x="12" y="60" width="16" height="8" fill="#0A1128" rx="1" />
                    <rect x="34" y="60" width="8" height="8" fill="#0A1128" rx="1" />
                    <rect x="48" y="60" width="12" height="8" fill="#0A1128" rx="1" />
                    <rect x="66" y="60" width="16" height="8" fill="#2563EB" rx="1" />
                    <rect x="88" y="60" width="8" height="8" fill="#0A1128" rx="1" />
                    <rect x="100" y="60" width="10" height="8" fill="#0A1128" rx="1" />
                    <rect x="48" y="74" width="14" height="8" fill="#0A1128" rx="1" />
                    <rect x="68" y="74" width="8" height="8" fill="#0A1128" rx="1" />
                    <rect x="80" y="74" width="16" height="8" fill="#0A1128" rx="1" />
                    <rect x="100" y="74" width="10" height="8" fill="#0A1128" rx="1" />
                    <rect x="48" y="88" width="8" height="8" fill="#0A1128" rx="1" />
                    <rect x="60" y="88" width="16" height="8" fill="#F59E0B" rx="1" />
                    <rect x="80" y="88" width="8" height="8" fill="#0A1128" rx="1" />
                    <rect x="94" y="88" width="16" height="8" fill="#0A1128" rx="1" />
                  </svg>
                </div>
              </div>

              <div className="mt-3 inline-block">
                <Sticker color="yellow" rotate="none" size="sm">
                  ⚡ Direct Android APK Link
                </Sticker>
              </div>
            </div>

            {/* iOS Status Card */}
            <div className="rounded-3xl bg-white border-[3px] border-[#0A1128] p-7 shadow-[5px_5px_0px_#0A1128]">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 border-[2px] border-[#0A1128] flex items-center justify-center text-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                    <Apple className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#0A1128]">Apple iOS Status</h4>
                    <p className="text-xs text-blue-600 font-bold">In Active Development</p>
                  </div>
                </div>

                <Sticker color="purple" rotate="slight-right" size="sm">
                  Phase 2
                </Sticker>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium mb-5">
                Our native iOS and Apple Watch companion app is currently undergoing internal testing. Sign up for instant TestFlight invitations!
              </p>

              {iosSubmitted ? (
                <div className="p-3.5 rounded-2xl bg-emerald-100 border-[2px] border-[#0A1128] text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#0A1128]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 stroke-[2.5]" />
                  <span>You're on the list! We'll email you when TestFlight opens.</span>
                </div>
              ) : (
                <form onSubmit={handleIosNotify} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email for TestFlight"
                    value={iosEmail}
                    onChange={(e) => setIosEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border-[2px] border-[#0A1128] text-[#0A1128] placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[2px_2px_0px_#0A1128]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border-[2px] border-[#0A1128] text-xs font-black shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 transition-all whitespace-nowrap"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Step-by-Step Installation Guide */}
        <div className="rounded-3xl bg-white border-[3px] border-[#0A1128] p-7 sm:p-10 shadow-[6px_6px_0px_#0A1128] mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Sticker color="mint" rotate="none" size="sm" className="mb-3 inline-flex">
              Simple 3-Step Setup
            </Sticker>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
              How to Install the Unified Android APK
            </h3>
            <p className="text-slate-600 font-medium text-sm mt-1">
              Takes less than 60 seconds to get your society account connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FEF9F3] border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center text-base mb-4 border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                01
              </div>
              <h4 className="text-base font-black text-[#0A1128] mb-1.5">Download the APK</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Tap <strong>Download APK</strong> above or direct link <code>/downloads/android/ParcelFlow.apk</code>. If your browser prompts confirmation, tap <em>Keep</em>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FEF9F3] border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#0A1128] font-black flex items-center justify-center text-base mb-4 border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                02
              </div>
              <h4 className="text-base font-black text-[#0A1128] mb-1.5">Allow Install</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                When opening the downloaded file, tap <em>Settings → Allow from this source</em>. ParcelFlow is 100% verified and secure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FEF9F3] border-[2.5px] border-[#0A1128] shadow-[4px_4px_0px_#0A1128] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#0A1128] font-black flex items-center justify-center text-base mb-4 border-[2px] border-[#0A1128] shadow-[2px_2px_0px_#0A1128]">
                03
              </div>
              <h4 className="text-base font-black text-[#0A1128] mb-1.5">Login by Phone Number</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Authenticate with your mobile number. Your assigned role (Resident, Staff, or Admin) instantly loads the corresponding interface.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
