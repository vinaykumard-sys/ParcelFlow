import React, { useState } from 'react';
import { submitWaitlistEmail } from '../utils/supabase';
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
  ArrowRight
} from 'lucide-react';
import { Sticker } from '../components/Sticker';

interface DownloadPageProps {
  onOpenPilotModal?: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onOpenPilotModal }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [iosEmail, setIosEmail] = useState('');
  const [iosSubmitted, setIosSubmitted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const sha256Checksum = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

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
    link.href = '/downloads/ParcelFlow.apk';
    link.setAttribute('download', 'ParcelFlow-v0.1.0-pilot.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] pt-28 pb-20 relative overflow-hidden selection:bg-amber-300 selection:text-[#0F172A]">
      
      {/* Decorative cartoon background bubbles */}
      <div className="absolute top-20 right-10 w-24 h-24 rounded-full border-[3px] border-[#0F172A] bg-amber-300 opacity-20 hidden lg:block pointer-events-none" />
      <div className="absolute top-80 left-8 w-16 h-16 rounded-2xl rotate-12 border-[3px] border-[#0F172A] bg-blue-400 opacity-20 hidden lg:block pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sticker color="blue" rotate="slight-left" size="sm">
              <Smartphone className="w-3.5 h-3.5 inline mr-1 text-white" />
              Official Mobile Release
            </Sticker>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] leading-tight">
            Get <span className="text-blue-600 underline decoration-amber-400 decoration-wavy decoration-2">ParcelFlow</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium">
            Download the official Android pilot APK or scan the QR code. Take total control over when your society parcels reach your hands.
          </p>

          {/* Pilot Info Sticker Card */}
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-100 border-[2.5px] border-[#0F172A] text-[#0F172A] text-xs sm:text-sm shadow-[3px_3px_0px_#0F172A] text-left">
            <span className="text-lg">📢</span>
            <span>
              <strong>Pilot Community Release:</strong> Rolling out across partner apartment societies in Bengaluru. Is your society registered?
            </span>
            {onOpenPilotModal && (
              <button
                onClick={onOpenPilotModal}
                className="ml-auto underline font-black text-blue-700 hover:text-blue-900 shrink-0"
              >
                Request Pilot →
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Android Card vs iOS & QR Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Android Card (Dominant, 7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white border-[3px] border-[#0F172A] p-7 sm:p-9 shadow-[6px_6px_0px_#0F172A] relative overflow-hidden">
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-[2.5px] border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-500 border-[2.5px] border-[#0F172A] flex items-center justify-center shadow-[3px_3px_0px_#0F172A]">
                  <Smartphone className="w-7 h-7 text-white stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A]">ParcelFlow for Android</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-black text-[#0F172A] bg-amber-300 px-2 py-0.5 rounded-lg border-[1.5px] border-[#0F172A] shadow-[1px_1px_0px_#0F172A]">
                      v0.1.0-pilot
                    </span>
                    <span className="text-xs font-bold text-slate-500">Official Pilot Build</span>
                  </div>
                </div>
              </div>

              <Sticker color="mint" rotate="slight-right" size="sm">
                ✓ Ready to Install
              </Sticker>
            </div>

            {/* Specifications row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-7">
              <div className="p-3 rounded-xl bg-blue-50 border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">OS Requirement</div>
                <div className="text-sm font-black text-[#0F172A] mt-0.5">Android 8.0+</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">APK Size</div>
                <div className="text-sm font-black text-[#0F172A] mt-0.5">18.4 MB</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Architecture</div>
                <div className="text-sm font-black text-[#0F172A] mt-0.5">arm64-v8a</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Release Date</div>
                <div className="text-sm font-black text-[#0F172A] mt-0.5">Nov 2026</div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 mb-8 bg-[#FFFDF9] p-4.5 rounded-2xl border-[2px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A]">
              <div className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Key Features Included:</div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 stroke-[2.5]" />
                <span>One-tap evening pickup scheduling with flexible slots (6:00 PM – 9:30 PM).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Single-use dynamic QR codes and backup 4-digit OTPs for instant gate collection.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 stroke-[2.5]" />
                <span>Proxy delegation: forward your collection pass to roommates or family via WhatsApp.</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-1">
              <button
                onClick={triggerDownload}
                type="button"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>{downloadStarted ? 'Downloading ParcelFlow.apk...' : 'Download APK (18.4 MB)'}</span>
              </button>

              {onOpenPilotModal && (
                <button
                  onClick={onOpenPilotModal}
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#0F172A] font-black text-sm border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
                >
                  <Building2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Request Society Pilot</span>
                </button>
              )}
            </div>

            {/* Checksum & verification */}
            <div className="mt-8 pt-5 border-t-[2px] border-slate-200 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  SHA-256 Checksum Integrity:
                </span>
                <button
                  onClick={handleCopyHash}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border-[1.5px] border-[#0F172A] font-black text-[#0F172A] flex items-center gap-1 text-[11px] shadow-[1px_1px_0px_#0F172A] transition-all"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> : <Copy className="w-3 h-3 stroke-[2.5]" />}
                  <span>{copiedHash ? 'Copied!' : 'Copy Hash'}</span>
                </button>
              </div>
              <p className="font-mono bg-slate-100 p-2.5 rounded-xl border-[1.5px] border-[#0F172A] break-all text-slate-700 text-[11px] font-semibold">
                {sha256Checksum}
              </p>
            </div>
          </div>

          {/* iOS & Scan Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* QR Code Quick Install */}
            <div className="rounded-3xl bg-white border-[3px] border-[#0F172A] p-7 shadow-[5px_5px_0px_#0F172A] text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-3 text-base font-black text-[#0F172A]">
                <QrCode className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                <span>Scan with Phone Camera</span>
              </div>

              <p className="text-xs text-slate-600 font-medium mb-3">
                Point your mobile camera at this code to open direct APK download link on your phone.
              </p>
              
              <div className="inline-block bg-white p-3.5 rounded-2xl border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] my-1">
                <div className="w-44 h-44 bg-slate-50 rounded-xl p-2 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full text-[#0F172A] fill-current">
                    <rect x="8" y="8" width="34" height="34" rx="4" fill="#2563EB" stroke="#0F172A" strokeWidth="4" />
                    <rect x="18" y="18" width="14" height="14" fill="#FFFFFF" rx="2" />
                    <rect x="78" y="8" width="34" height="34" rx="4" fill="#2563EB" stroke="#0F172A" strokeWidth="4" />
                    <rect x="88" y="18" width="14" height="14" fill="#FFFFFF" rx="2" />
                    <rect x="8" y="78" width="34" height="34" rx="4" fill="#2563EB" stroke="#0F172A" strokeWidth="4" />
                    <rect x="18" y="88" width="14" height="14" fill="#FFFFFF" rx="2" />
                    <rect x="48" y="12" width="8" height="8" fill="#0F172A" rx="1" />
                    <rect x="60" y="12" width="12" height="8" fill="#0F172A" rx="1" />
                    <rect x="48" y="24" width="10" height="8" fill="#F59E0B" rx="1" />
                    <rect x="64" y="24" width="8" height="8" fill="#0F172A" rx="1" />
                    <rect x="52" y="36" width="16" height="8" fill="#0F172A" rx="1" />
                    <rect x="12" y="48" width="10" height="8" fill="#0F172A" rx="1" />
                    <rect x="28" y="48" width="12" height="8" fill="#0F172A" rx="1" />
                    <rect x="46" y="48" width="8" height="8" fill="#10B981" rx="1" />
                    <rect x="58" y="48" width="16" height="8" fill="#0F172A" rx="1" />
                    <rect x="80" y="48" width="8" height="8" fill="#0F172A" rx="1" />
                    <rect x="94" y="48" width="16" height="8" fill="#0F172A" rx="1" />
                    <rect x="12" y="60" width="16" height="8" fill="#0F172A" rx="1" />
                    <rect x="34" y="60" width="8" height="8" fill="#0F172A" rx="1" />
                    <rect x="48" y="60" width="12" height="8" fill="#0F172A" rx="1" />
                    <rect x="66" y="60" width="16" height="8" fill="#2563EB" rx="1" />
                    <rect x="88" y="60" width="8" height="8" fill="#0F172A" rx="1" />
                    <rect x="100" y="60" width="10" height="8" fill="#0F172A" rx="1" />
                    <rect x="48" y="74" width="14" height="8" fill="#0F172A" rx="1" />
                    <rect x="68" y="74" width="8" height="8" fill="#0F172A" rx="1" />
                    <rect x="80" y="74" width="16" height="8" fill="#0F172A" rx="1" />
                    <rect x="100" y="74" width="10" height="8" fill="#0F172A" rx="1" />
                    <rect x="48" y="88" width="8" height="8" fill="#0F172A" rx="1" />
                    <rect x="60" y="88" width="16" height="8" fill="#F59E0B" rx="1" />
                    <rect x="80" y="88" width="8" height="8" fill="#0F172A" rx="1" />
                    <rect x="94" y="88" width="16" height="8" fill="#0F172A" rx="1" />
                  </svg>
                </div>
              </div>

              <div className="mt-3 inline-block">
                <Sticker color="yellow" rotate="none" size="sm">
                  ⚡ Instant Mobile Link
                </Sticker>
              </div>
            </div>

            {/* iOS Status Card */}
            <div className="rounded-3xl bg-white border-[3px] border-[#0F172A] p-7 shadow-[5px_5px_0px_#0F172A]">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 border-[2px] border-[#0F172A] flex items-center justify-center text-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                    <Apple className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#0F172A]">Apple iOS Status</h4>
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
                <div className="p-3.5 rounded-2xl bg-emerald-100 border-[2px] border-[#0F172A] text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#0F172A]">
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
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border-[2px] border-[#0F172A] text-[#0F172A] placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[2px_2px_0px_#0F172A]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border-[2px] border-[#0F172A] text-xs font-black shadow-[2px_2px_0px_#0F172A] hover:-translate-y-0.5 transition-all whitespace-nowrap"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Step-by-Step Installation Guide */}
        <div className="rounded-3xl bg-white border-[3px] border-[#0F172A] p-7 sm:p-10 shadow-[6px_6px_0px_#0F172A] mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Sticker color="mint" rotate="none" size="sm" className="mb-3 inline-flex">
              Simple 3-Step Setup
            </Sticker>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              How to Install the Android APK
            </h3>
            <p className="text-slate-600 font-medium text-sm mt-1">
              Takes less than 60 seconds to get your society account connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center text-base mb-4 border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                01
              </div>
              <h4 className="text-base font-black text-[#0F172A] mb-1.5">Download the File</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Tap <strong>Download APK</strong> above on your Android phone. If your browser prompts you with a download confirmation, tap <em>Keep</em>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#0F172A] font-black flex items-center justify-center text-base mb-4 border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                02
              </div>
              <h4 className="text-base font-black text-[#0F172A] mb-1.5">Allow Install</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                When opening the downloaded file, tap <em>Settings → Allow from this source</em>. ParcelFlow is 100% verified and secure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#0F172A] font-black flex items-center justify-center text-base mb-4 border-[2px] border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                03
              </div>
              <h4 className="text-base font-black text-[#0F172A] mb-1.5">Link Your Apartment</h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Open ParcelFlow, enter your mobile number, and select your apartment tower to start receiving parcel notifications.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
