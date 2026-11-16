import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Apple, 
  Building2,
  ExternalLink
} from 'lucide-react';

interface DownloadCTAProps {
  onOpenPilotModal?: () => void;
}

export const DownloadCTA: React.FC<DownloadCTAProps> = ({ onOpenPilotModal }) => {
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  return (
    <section className="relative py-24 overflow-hidden bg-slate-950 text-white border-y border-slate-800/80">
      {/* Background Decorative Gradients & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -top-40 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/80 p-8 sm:p-12 lg:p-16 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Internal Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Pilot Release Available Now</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Take control of your <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                  deliveries today.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Experience scheduled, stress-free parcel collection with zero gate queues and total peace of mind. Android pilot build v0.1.0 is available now for partner societies.
              </p>

              {/* Feature checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Instant OTP & QR verification</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Choose custom evening pickup times</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>100% Free for pilot community residents</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Real-time delivery hub arrival alerts</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="/download"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK (v0.1.0)</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                </a>

                {onOpenPilotModal && (
                  <button
                    onClick={onOpenPilotModal}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 hover:text-white font-medium text-sm transition-all duration-200"
                  >
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>Join Society Pilot</span>
                  </button>
                )}

                <button
                  onClick={() => setShowQrModal(!showQrModal)}
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-sm transition-all"
                  title="Show QR Code for mobile install"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Scan to Phone</span>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Android 8.0+ supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <Apple className="w-3.5 h-3.5 text-slate-400" />
                  <span>iOS version in Phase 2</span>
                </div>
              </div>
            </div>

            {/* Right Card / QR Showcase Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 p-6 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">ParcelFlow Android</div>
                      <div className="text-xs text-emerald-400 font-mono">v0.1.0 • Release Ready</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    Pilot Build
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-5 rounded-xl flex flex-col items-center justify-center text-center shadow-inner relative group">
                  <div className="w-44 h-44 bg-slate-950 rounded-lg p-2 flex items-center justify-center">
                    {/* High fidelity SVG QR code representation */}
                    <svg viewBox="0 0 120 120" className="w-full h-full text-white fill-current">
                      {/* Top Left Marker */}
                      <rect x="10" y="10" width="30" height="30" rx="3" fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" />
                      <rect x="20" y="20" width="10" height="10" fill="#3B82F6" />
                      {/* Top Right Marker */}
                      <rect x="80" y="10" width="30" height="30" rx="3" fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" />
                      <rect x="90" y="20" width="10" height="10" fill="#3B82F6" />
                      {/* Bottom Left Marker */}
                      <rect x="10" y="80" width="30" height="30" rx="3" fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" />
                      <rect x="20" y="90" width="10" height="10" fill="#3B82F6" />
                      
                      {/* Mock QR data pixels */}
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

                      <rect x="48" y="100" width="16" height="6" fill="#0F172A" />
                      <rect x="70" y="100" width="6" height="6" fill="#0F172A" />
                      <rect x="82" y="100" width="16" height="6" fill="#0F172A" />
                      <rect x="104" y="100" width="6" height="6" fill="#0F172A" />
                    </svg>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-800">
                    Scan with camera to install
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Direct APK download for Android
                  </p>
                </div>

                {/* Footer notes on card */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>SHA-256 Verified</span>
                  </div>
                  <a 
                    href="/download" 
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    Details <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
