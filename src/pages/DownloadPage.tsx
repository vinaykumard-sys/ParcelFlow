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
  Check
} from 'lucide-react';

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
    // Link to public APK or fallback download
    const link = document.createElement('a');
    link.href = '/downloads/ParcelFlow.apk';
    link.setAttribute('download', 'ParcelFlow-v0.1.0-pilot.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/10 blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Mobile Client</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Get <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">ParcelFlow</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Download the official Android pilot APK or join the waitlist for your society. Take total control over parcel delivery timings.
          </p>

          {/* Pilot Banner */}
          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm text-left">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Pilot Release:</strong> Currently rolling out across pilot apartment communities. Ask your society committee to enable ParcelFlow.
            </span>
          </div>
        </div>

        {/* Main Grid: Android Card vs iOS Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Android Card (Dominant, 7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-blue-500/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">ParcelFlow for Android</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      v0.1.0-pilot
                    </span>
                    <span className="text-xs text-slate-400">Release Build</span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready to Install
              </span>
            </div>

            {/* Specifications row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-xs text-slate-400">OS Requirement</div>
                <div className="text-sm font-semibold text-white mt-1">Android 8.0+</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-xs text-slate-400">Package Size</div>
                <div className="text-sm font-semibold text-white mt-1">18.4 MB</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-xs text-slate-400">Architecture</div>
                <div className="text-sm font-semibold text-white mt-1">Universal (arm64)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-xs text-slate-400">Updated</div>
                <div className="text-sm font-semibold text-white mt-1">November 2026</div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>One-tap pickup scheduling with customizable evening slots (6:00 PM – 9:30 PM).</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Single-use dynamic QR codes and encrypted 4-digit OTPs for tamper-proof collection.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Proxy delegation: forward your collection token to flatmates or neighbors via WhatsApp.</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={triggerDownload}
                type="button"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>{downloadStarted ? 'Downloading ParcelFlow.apk...' : 'Download APK (v0.1.0)'}</span>
              </button>

              {onOpenPilotModal && (
                <button
                  onClick={onOpenPilotModal}
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-medium text-sm transition-all"
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Request Society Pilot</span>
                </button>
              )}
            </div>

            {/* Checksum & verification */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  SHA-256 Checksum:
                </span>
                <button
                  onClick={handleCopyHash}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? 'Copied!' : 'Copy Hash'}</span>
                </button>
              </div>
              <p className="font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 break-all text-slate-400 text-[11px]">
                {sha256Checksum}
              </p>
            </div>
          </div>

          {/* iOS & Scan Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* QR Code Quick Install */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 mb-4 text-sm font-semibold text-white">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Scan to Download Directly</span>
              </div>
              
              <div className="inline-block bg-white p-4 rounded-2xl shadow-inner my-2">
                <div className="w-44 h-44 bg-slate-950 rounded-xl p-2 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full text-white fill-current">
                    <rect x="10" y="10" width="30" height="30" rx="3" fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" />
                    <rect x="20" y="20" width="10" height="10" fill="#3B82F6" />
                    <rect x="80" y="10" width="30" height="30" rx="3" fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" />
                    <rect x="90" y="20" width="10" height="10" fill="#3B82F6" />
                    <rect x="10" y="80" width="30" height="30" rx="3" fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" />
                    <rect x="20" y="90" width="10" height="10" fill="#3B82F6" />
                    <rect x="48" y="12" width="6" height="6" fill="#0F172A" />
                    <rect x="58" y="12" width="14" height="6" fill="#0F172A" />
                    <rect x="48" y="24" width="8" height="6" fill="#0F172A" />
                    <rect x="62" y="24" width="6" height="6" fill="#0F172A" />
                    <rect x="52" y="34" width="16" height="6" fill="#0F172A" />
                    <rect x="12" y="48" width="8" height="6" fill="#0F172A" />
                    <rect x="26" y="48" width="12" height="6" fill="#0F172A" />
                    <rect x="44" y="48" width="6" height="6" fill="#0F172A" />
                    <rect x="56" y="48" width="18" height="6" fill="#3B82F6" />
                    <rect x="80" y="48" width="8" height="6" fill="#0F172A" />
                    <rect x="94" y="48" width="14" height="6" fill="#0F172A" />
                    <rect x="12" y="60" width="14" height="6" fill="#0F172A" />
                    <rect x="34" y="60" width="6" height="6" fill="#0F172A" />
                    <rect x="48" y="60" width="10" height="6" fill="#0F172A" />
                    <rect x="66" y="60" width="14" height="6" fill="#0F172A" />
                    <rect x="88" y="60" width="6" height="6" fill="#0F172A" />
                    <rect x="100" y="60" width="8" height="6" fill="#0F172A" />
                    <rect x="48" y="74" width="12" height="6" fill="#0F172A" />
                    <rect x="68" y="74" width="6" height="6" fill="#0F172A" />
                    <rect x="80" y="74" width="14" height="6" fill="#0F172A" />
                    <rect x="100" y="74" width="8" height="6" fill="#0F172A" />
                    <rect x="48" y="88" width="6" height="6" fill="#0F172A" />
                    <rect x="60" y="88" width="14" height="6" fill="#3B82F6" />
                    <rect x="80" y="88" width="8" height="6" fill="#0F172A" />
                    <rect x="94" y="88" width="14" height="6" fill="#0F172A" />
                  </svg>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Point your phone camera at this QR code to download the APK directly onto your mobile browser.
              </p>
            </div>

            {/* iOS Status Card */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Apple iOS Status</h4>
                  <p className="text-xs text-blue-400 font-medium">Coming in Phase 2</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-6">
                Our native iOS and watchOS companions are currently under active development and TestFlight review. Sign up below to get early beta access.
              </p>

              {iosSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You're on the list! We'll email you the moment TestFlight opens.</span>
                </div>
              ) : (
                <form onSubmit={handleIosNotify} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={iosEmail}
                    onChange={(e) => setIosEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold whitespace-nowrap"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Step-by-Step Installation Guide */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              How to Install the Android APK
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Three quick steps to install and start receiving delivery updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-sm mb-4 border border-blue-500/30">
                01
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Download the APK</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click the <strong>Download APK</strong> button above on your Android smartphone. If prompted, confirm that you wish to keep the file.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-sm mb-4 border border-indigo-500/30">
                02
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Allow Unknown Sources</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When opening the downloaded file, your browser may ask for permission. Tap <em>Settings → Allow from this source</em> to proceed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center text-sm mb-4 border border-emerald-500/30">
                03
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Connect Your Society</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Launch ParcelFlow, enter your mobile number, and select your registered society and apartment tower to start scheduling deliveries.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
