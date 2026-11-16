import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Truck, 
  Key, 
  Sparkles,
  Users,
  Layers
} from 'lucide-react';
import { DownloadCTA } from '../components/DownloadCTA';

interface HowItWorksPageProps {
  onOpenPilotModal?: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onOpenPilotModal }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Courier Arrival & Fast Gate Check-In',
      role: 'Courier & Security Desk',
      summary: 'Delivery agents hand off packages in under 30 seconds at the society gate, eliminating the hassle of waiting for elevators or calling residents multiple times.',
      details: [
        'Courier presents parcel at the society Parcel Hub check-in terminal.',
        'Barcode or label is scanned with our smart optical handheld scanner.',
        'Recipient tower and flat number are automatically linked to the resident database.',
        'Courier is issued a digital sign-off receipt instantly.'
      ],
      icon: Truck,
      accent: 'from-blue-600 to-indigo-600',
      badge: 'Gate Level'
    },
    {
      step: '02',
      title: 'Digital Logging & Secure Hub Storing',
      role: 'Society Parcel Hub Staff',
      summary: 'Parcels are organized into labeled storage bays under continuous 24/7 CCTV surveillance, protected from weather, tampering, and misplacement.',
      details: [
        'System assigns an intelligent shelf and bin location based on parcel dimensions.',
        'Tamper-evident status is verified and parcel is placed in the designated bay.',
        'Package status is updated in real-time on the society operations dashboard.',
        'Zero messy package piles sitting around the guardhouse or lobby.'
      ],
      icon: Layers,
      accent: 'from-indigo-600 to-purple-600',
      badge: 'Hub Storage'
    },
    {
      step: '03',
      title: 'Resident Notification & Slot Selection',
      role: 'Resident in ParcelFlow App',
      summary: 'You receive an instant alert on your phone. Instead of rushing home or asking the courier to leave it outside your door, you select an evening slot.',
      details: [
        'Instant push notification and WhatsApp alert: "📦 Your parcel has arrived at Hub A".',
        'Open the ParcelFlow app to view item details, courier name, and photos.',
        'Select an evening pickup window that fits your schedule (e.g. 7:30 PM – 8:00 PM).',
        'Need to change times? Tap "Reschedule" at any time with zero hassle.'
      ],
      icon: Smartphone,
      accent: 'from-blue-500 to-cyan-500',
      badge: 'Mobile App'
    },
    {
      step: '04',
      title: 'Encrypted QR / OTP Verification',
      role: 'Security & Verification Engine',
      summary: 'A cryptographic single-use QR token and 4-digit backup OTP are generated exclusively for your device to ensure authorized collection.',
      details: [
        'Dynamic QR refreshes periodically to prevent screenshot abuse.',
        'Want someone else to pick it up? Forward the single-use OTP via WhatsApp to your flatmate or spouse.',
        'Ensures 100% fraud prevention and eliminates neighbor handover mixups.',
        'High privacy: your phone number is never exposed to delivery strangers.'
      ],
      icon: Key,
      accent: 'from-emerald-600 to-teal-600',
      badge: 'Encrypted Auth'
    },
    {
      step: '05',
      title: '15-Second Handover & Audit Log',
      role: 'Resident & Security Desk',
      summary: 'Walk by the parcel hub on your way home, present your QR code, collect your parcel in 15 seconds flat, and walk up to your flat completely stress-free.',
      details: [
        'Staff scans your QR code on the hub terminal.',
        'Hub bay light illuminates the exact shelf location for rapid retrieval.',
        'Handover is confirmed and status automatically flips to "Collected".',
        'An immutable timestamped digital receipt is recorded in your app history.'
      ],
      icon: CheckCircle2,
      accent: 'from-emerald-500 to-green-600',
      badge: 'Collection Complete'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16">
      
      {/* Hero Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The ParcelFlow Lifecycle</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          How ParcelFlow works from <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            society gate to your hands.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          A seamless, 5-stage closed loop designed specifically for modern gated apartment communities. No missed calls, no lost packages, and complete schedule freedom.
        </p>
      </div>

      {/* Interactive Step Explorer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Step Navigation Buttons */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Select a stage to explore:
            </h3>

            {steps.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    isActive 
                      ? 'bg-slate-900 border-blue-500/60 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30' 
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-blue-400">{s.badge}</span>
                      <span className="text-xs text-slate-500">{s.role}</span>
                    </div>
                    <div className={`font-semibold text-base mt-0.5 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {s.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Stage View */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${steps[activeStep].accent} flex items-center justify-center shadow-lg`}>
                    {React.createElement(steps[activeStep].icon, { className: 'w-6 h-6 text-white' })}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-mono">Stage {steps[activeStep].step} of 05</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{steps[activeStep].title}</h2>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                  {steps[activeStep].role}
                </span>
              </div>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8">
                {steps[activeStep].summary}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                What happens during this step:
              </h4>

              <div className="space-y-3.5 mb-8">
                {steps[activeStep].details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300 leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Navigation arrows for steps */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  ← Previous Stage
                </button>

                <div className="flex items-center gap-1.5">
                  {steps.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveStep(dotIdx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeStep === dotIdx ? 'w-6 bg-blue-500' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-xs font-semibold text-white shadow-md shadow-blue-500/20"
                >
                  Next Stage →
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Special Deep Dives: Proxy Collection & Edge Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">Thoughtfully Engineered for Real Life</h2>
          <p className="text-slate-400 text-sm mt-2">
            Everyday edge cases solved cleanly without friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Proxy Delegation</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traveling or stuck at work? One click in the ParcelFlow app sends a secure forwarding OTP to your roommate, partner, or trusted neighbor via WhatsApp. They show it at the hub and collect your parcel safely.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Rescheduling</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Plans change. If you can’t make your 7:30 PM slot, you can reschedule to 9:00 PM or the next morning with zero penalty. Your package remains locked safely in the hub.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zero Lost Packages</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every parcel state change is logged to an immutable digital audit trail with exact staff IDs and timestamps. No more looking through handwritten paper logbooks or blaming security guards.
            </p>
          </div>

        </div>
      </div>

      {/* Download CTA component */}
      <DownloadCTA onOpenPilotModal={onOpenPilotModal} />

    </div>
  );
};
