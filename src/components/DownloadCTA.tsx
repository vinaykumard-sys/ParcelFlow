import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  ExternalLink,
  Star
} from 'lucide-react';

interface DownloadCTAProps {
  onOpenPilotModal?: () => void;
}

export const DownloadCTA: React.FC<DownloadCTAProps> = ({ onOpenPilotModal }) => {
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  return (
    <section className="relative py-20 sm:py-28 bg-[#FAF7F2] text-slate-900 overflow-hidden border-b-2 border-slate-900">
      {/* Background polka dots */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0F172A 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Colorful Cartoon Box */}
        <div className="relative rounded-3xl bg-amber-300 border-3 border-slate-900 p-8 sm:p-12 lg:p-16 shadow-[8px_8px_0px_#0F172A] overflow-hidden">
          
          {/* Floating Cartoon Stickers */}
          <div className="absolute top-6 right-8 hidden lg:block -rotate-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-white text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] flex items-center gap-1.5">
              <span>⭐ Rated 4.9 / 5</span>
            </span>
          </div>

          <div className="absolute bottom-8 right-12 hidden lg:block rotate-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-400 text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] flex items-center gap-1.5">
              <span>🎉 100% Free For Residents</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A] text-slate-900 text-xs font-black uppercase tracking-wider -rotate-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Instant Android APK & iOS Beta</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Your parcel. <br />
                Your time.
              </h2>

              <p className="text-base sm:text-xl font-bold text-slate-800 leading-relaxed max-w-xl">
                Make parcel pickup fit your life. Download ParcelFlow now and experience guaranteed zero-rush deliveries right inside your society.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="/download"
                  className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F172A] transition-all flex items-center gap-2.5"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Free App</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="px-5 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-sm border-2 border-slate-900 shadow-[4px_4px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F172A] transition-all flex items-center gap-2"
                >
                  <QrCode className="w-5 h-5 text-slate-900" />
                  <span>{showQrModal ? 'Hide QR Code' : 'Scan to Install'}</span>
                </button>
              </div>

              {/* Feature Pills */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-white/80 text-slate-900 text-xs font-black border border-slate-900">
                  ⚡ 5-Minute Setup
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/80 text-slate-900 text-xs font-black border border-slate-900">
                  🔒 Zero Doorstep Thefts
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/80 text-slate-900 text-xs font-black border border-slate-900">
                  📱 iOS & Android Ready
                </span>
              </div>
            </div>

            {/* Right Column: Cartoon App Preview or QR Code */}
            <div className="lg:col-span-5 flex justify-center">
              {showQrModal ? (
                <div className="bg-white rounded-3xl p-6 border-3 border-slate-900 shadow-[6px_6px_0px_#0F172A] text-center max-w-xs animate-in fade-in duration-200">
                  <h4 className="text-sm font-black text-slate-900 mb-2">Scan with your phone</h4>
                  <div className="bg-amber-100 p-4 rounded-2xl border-2 border-slate-900 inline-block mb-3">
                    <svg viewBox="0 0 120 120" className="w-36 h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="120" height="120" fill="#FFFFFF" />
                      <rect x="10" y="10" width="30" height="30" fill="#0F172A" />
                      <rect x="16" y="16" width="18" height="18" fill="#FFFFFF" />
                      <rect x="80" y="10" width="30" height="30" fill="#0F172A" />
                      <rect x="86" y="16" width="18" height="18" fill="#FFFFFF" />
                      <rect x="10" y="80" width="30" height="30" fill="#0F172A" />
                      <rect x="16" y="86" width="18" height="18" fill="#FFFFFF" />
                      <rect x="48" y="48" width="24" height="24" fill="#0F172A" />
                      <rect x="54" y="54" width="12" height="12" fill="#FBBF24" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-700">Instant Android APK / TestFlight Beta</p>
                </div>
              ) : (
                /* Cartoon Phone Mockup */
                <div className="relative w-72 bg-white rounded-[32px] p-4 border-3 border-slate-900 shadow-[8px_8px_0px_#0F172A] rotate-2 hover:rotate-0 transition-transform">
                  {/* Phone Notch */}
                  <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto mb-3" />

                  {/* App Screen */}
                  <div className="bg-[#FAF7F2] rounded-2xl p-4 border-2 border-slate-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black text-slate-900">Good Evening, Ananya 👋</div>
                      <div className="w-6 h-6 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-[10px] font-black">
                        A
                      </div>
                    </div>

                    {/* Parcel Card */}
                    <div className="bg-white rounded-xl p-3 border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-900">📦 Amazon Express</span>
                        <span className="text-[10px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded border border-slate-900">At Hub</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600">Arrived at Gate 1 • Shelf B</div>
                      <div className="mt-2 text-xs font-black text-blue-700 bg-blue-50 p-1.5 rounded border border-blue-200 text-center">
                        Pickup: 8:00 PM – 8:30 PM
                      </div>
                    </div>

                    {/* Schedule Button */}
                    <div className="w-full py-2 bg-emerald-400 rounded-xl border-2 border-slate-900 text-center text-xs font-black text-slate-900 shadow-[1px_1px_0px_#0F172A]">
                      Collect with QR Code 📲
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default DownloadCTA;
