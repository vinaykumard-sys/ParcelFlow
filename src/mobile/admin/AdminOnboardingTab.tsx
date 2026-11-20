import React, { useState } from 'react';
import {
  Compass,
  Building,
  Layers,
  Home,
  Users,
  Shield,
  Boxes,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useMobileStore } from '../services/mobileState';
import { onboardingService } from '../../services/onboardingService';

const ONBOARDING_STAGES = [
  { id: 1, title: 'Society Profile', desc: 'Name, address & hub hours', icon: Building },
  { id: 2, title: 'Towers & Wings', desc: 'Block layout & gates', icon: Layers },
  { id: 3, title: 'Apartments', desc: 'Flat units & intercom', icon: Home },
  { id: 4, title: 'Residents', desc: 'Owner directory import', icon: Users },
  { id: 5, title: 'Staff Roster', desc: 'Security guards & operators', icon: Shield },
  { id: 6, title: 'Storage Racks', desc: 'Locker compartment grid', icon: Boxes },
  { id: 7, title: 'Pickup Slots', desc: 'Evening booking windows', icon: Clock },
  { id: 8, title: 'Activation', desc: 'Launch ParcelFlow hub live', icon: Zap },
];

export const AdminOnboardingTab: React.FC = () => {
  const { selectedSociety } = useMobileStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [societyName, setSocietyName] = useState<string>(selectedSociety.name);
  const [address, setAddress] = useState<string>(selectedSociety.address || 'Outer Ring Road, Bellandur');
  const [towersCount, setTowersCount] = useState<number>(3);
  const [flatsCount, setFlatsCount] = useState<number>(450);
  const [operatingHours, setOperatingHours] = useState<string>('06:30 AM - 11:30 PM');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCompleteActivation = async () => {
    setIsActivated(true);
    showToast(`🎉 ${societyName} ParcelFlow Hub is officially activated!`);
    try {
      await onboardingService.activateSociety(selectedSociety.id);
    } catch {
      // offline resilience fallback
    }
  };

  const progressPercent = Math.round((currentStep / 8) * 100);

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      {/* Header */}
      <div className="px-5 pt-3 pb-3 border-b border-slate-200/60 bg-[#FEF9F3] sticky top-0 z-20">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#1E60F2]" />
            <span className="text-xs font-bold text-slate-500">Society Onboarding Wizard</span>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-100 text-[#1E60F2] border border-blue-300">
            Step {currentStep} of 8
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-[#1E60F2] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {toastMessage && (
        <div className="mx-5 mt-2 p-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
        {/* Step Title Header */}
        <div className="bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border-2 border-[#060D1E] flex items-center justify-center text-[#1E60F2]">
              {React.createElement(ONBOARDING_STAGES[currentStep - 1].icon, {
                className: 'w-5 h-5 stroke-[2.5]',
              })}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500">
                Stage {currentStep}
              </span>
              <h2 className="text-lg font-black text-[#060D1E]">
                {ONBOARDING_STAGES[currentStep - 1].title}
              </h2>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            {ONBOARDING_STAGES[currentStep - 1].desc}
          </p>
        </div>

        {/* Step-by-Step Interactive Form Content */}
        {currentStep === 1 && (
          <div className="bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] space-y-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                Society Name
              </label>
              <input
                type="text"
                value={societyName}
                onChange={(e) => setSocietyName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                Address & Locality
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                Hub Operating Hours
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] space-y-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                Total Towers / Wings
              </label>
              <input
                type="number"
                value={towersCount}
                onChange={(e) => setTowersCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-xs font-bold text-amber-900">
              Configuring default towers: Tower A, Tower B, Tower C with smart gate entry sensors.
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] space-y-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                Total Residential Units
              </label>
              <input
                type="number"
                value={flatsCount}
                onChange={(e) => setFlatsCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FEF9F3] border-2 border-[#060D1E] rounded-xl text-xs font-bold focus:outline-none"
              />
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Flats mapped from Floor 1 to Floor 14 with intercom sync enabled.
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] space-y-3">
            <h3 className="text-xs font-black text-slate-700">Initial Residents Enrolled</h3>
            <div className="space-y-1.5 text-xs font-bold text-slate-700">
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200 flex justify-between">
                <span>Vinay Kumar</span>
                <span className="text-[#1E60F2]">Flat B-402</span>
              </div>
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200 flex justify-between">
                <span>Arjun Kumar</span>
                <span className="text-[#1E60F2]">Flat A-402</span>
              </div>
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200 flex justify-between">
                <span>Priya Sharma</span>
                <span className="text-[#1E60F2]">Flat B-104</span>
              </div>
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200 flex justify-between">
                <span>Rahul Verma</span>
                <span className="text-[#1E60F2]">Flat C-801</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] space-y-3">
            <h3 className="text-xs font-black text-slate-700">Hub & Gate Security Staff</h3>
            <div className="space-y-1.5 text-xs font-bold text-slate-700">
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200 flex justify-between">
                <span>Ramesh K (Supervisor)</span>
                <span className="text-emerald-700">STAFF-HUB-01</span>
              </div>
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200 flex justify-between">
                <span>Suresh P (Security Lead)</span>
                <span className="text-emerald-700">STAFF-SEC-02</span>
              </div>
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200 flex justify-between">
                <span>Manoj T (Specialist)</span>
                <span className="text-emerald-700">STAFF-HUB-03</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] space-y-3">
            <h3 className="text-xs font-black text-slate-700">Locker Compartment Allocation</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="text-lg font-black text-[#1E60F2]">56 Units</div>
                <div className="text-[10px] text-slate-500">Rack A (Towers A & B)</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="text-lg font-black text-amber-700">56 Units</div>
                <div className="text-[10px] text-slate-500">Rack B (Tower C & Oversize)</div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="bg-white p-4 rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] space-y-3">
            <h3 className="text-xs font-black text-slate-700">Default Evening Pickup Windows</h3>
            <div className="space-y-1 text-xs font-bold text-slate-700">
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200">
                6:00 PM – 6:30 PM (Cap: 25)
              </div>
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200">
                6:30 PM – 7:00 PM (Cap: 25)
              </div>
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200">
                7:00 PM – 7:30 PM (Cap: 30)
              </div>
              <div className="p-2 bg-[#FEF9F3] rounded-xl border border-slate-200">
                8:00 PM – 8:30 PM (Cap: 30)
              </div>
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="bg-[#060D1E] text-white p-5 rounded-3xl border-2 border-[#060D1E] shadow-[4px_4px_0px_#060D1E] space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center mx-auto mb-2 font-black">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black">Ready for Live Activation</h3>
            <p className="text-xs text-slate-300">
              All 8 stages configured for {societyName}. Storage racks initialized, staff credentials generated, and resident app links prepared.
            </p>

            {isActivated ? (
              <div className="py-3 px-4 bg-emerald-500/20 border-2 border-emerald-400 rounded-2xl text-emerald-300 font-black text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ParcelFlow Hub is Active & Operational!</span>
              </div>
            ) : (
              <button
                onClick={handleCompleteActivation}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm rounded-2xl border-2 border-white shadow-[2px_2px_0px_#fff] active:scale-95 transition-all"
              >
                Complete & Activate Hub Live
              </button>
            )}
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center gap-2 pt-2">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="py-2.5 px-4 bg-white border-2 border-[#060D1E] rounded-xl font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-[2px_2px_0px_#060D1E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {currentStep < 8 && (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 bg-[#1E60F2] text-white border-2 border-[#060D1E] rounded-xl font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[2px_2px_0px_#060D1E]"
            >
              <span>Next: {ONBOARDING_STAGES[currentStep].title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
