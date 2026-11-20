import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  UserCheck,
  Boxes,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  Layers,
  AlertCircle
} from 'lucide-react';
import { onboardingService, type CompleteOnboardingPayload } from '../../../src/services/onboardingService';

export const OnboardingScreen: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successSummary, setSuccessSummary] = useState<any>(null);

  // Stage 1: Society Info
  const [societyName, setSocietyName] = useState('Palm Meadows Heights');
  const [societyCode, setSocietyCode] = useState('PMH');
  const [address, setAddress] = useState('Varthur Main Road, Whitefield');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560066');
  const [operatingHours, setOperatingHours] = useState('07:00 AM – 11:00 PM');

  // Stage 2: Towers
  const [towers, setTowers] = useState<string[]>(['Tower A', 'Tower B', 'Tower C']);
  const [newTowerName, setNewTowerName] = useState('');

  // Stage 3: Apartments
  const [flatsPerTower, setFlatsPerTower] = useState<number>(20);

  // Stage 4: Residents
  const [sampleResidents, setSampleResidents] = useState([
    { fullName: 'Aditya Roy', flatNumber: 'A-101', tower: 'Tower A', phone: '9845012345', email: 'aditya@pmh.org' },
    { fullName: 'Meera Nambiar', flatNumber: 'B-204', tower: 'Tower B', phone: '9845023456', email: 'meera@pmh.org' },
  ]);
  const [newResName, setNewResName] = useState('');
  const [newResFlat, setNewResFlat] = useState('');
  const [newResPhone, setNewResPhone] = useState('');

  // Stage 5: Staff
  const [staffRoster, setStaffRoster] = useState([
    { fullName: 'Ramesh Gowda', phone: '9845034567', badgeNumber: 'SEC-01', designation: 'Security Supervisor', shift: 'Morning (07:00 – 15:00)' },
    { fullName: 'Suresh Patil', phone: '9845045678', badgeNumber: 'HUB-01', designation: 'Locker Hub Lead', shift: 'Evening (14:00 – 22:00)' },
  ]);

  // Stage 6: Storage
  const [storageRacks, setStorageRacks] = useState([
    { rack: 'Rack A', zone: 'Ground Floor Kiosk', shelvesCount: 20, compartmentType: 'MEDIUM' as const },
    { rack: 'Rack B', zone: 'Ground Floor Kiosk', shelvesCount: 20, compartmentType: 'LARGE' as const },
    { rack: 'Cold Storage', zone: 'Hub Refrigerated Unit', shelvesCount: 5, compartmentType: 'COLD_STORAGE' as const },
  ]);

  // Stage 7: Pickup Slots
  const [pickupSlots, setPickupSlots] = useState([
    { startTime: '18:00:00', endTime: '18:30:00', maxCapacity: 25 },
    { startTime: '18:30:00', endTime: '19:00:00', maxCapacity: 25 },
    { startTime: '19:00:00', endTime: '19:30:00', maxCapacity: 30 },
    { startTime: '20:00:00', endTime: '20:30:00', maxCapacity: 35 },
    { startTime: '21:00:00', endTime: '21:30:00', maxCapacity: 20 },
  ]);

  // Stage 8: Plan
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'>('PROFESSIONAL');

  const handleAddTower = () => {
    if (newTowerName.trim() && !towers.includes(newTowerName.trim())) {
      setTowers([...towers, newTowerName.trim()]);
      setNewTowerName('');
    }
  };

  const handleAddResident = () => {
    if (newResName.trim() && newResFlat.trim() && newResPhone.trim()) {
      setSampleResidents([
        ...sampleResidents,
        {
          fullName: newResName.trim(),
          flatNumber: newResFlat.trim(),
          tower: towers[0] || 'Tower A',
          phone: newResPhone.trim(),
          email: `${newResPhone.replace(/\D/g, '')}@pmh.org`,
        },
      ]);
      setNewResName('');
      setNewResFlat('');
      setNewResPhone('');
    }
  };

  const handleExecuteOnboarding = async () => {
    setLoading(true);
    setErrorMsg(null);

    // Build generated apartments list
    const generatedApartments: any[] = [];
    towers.forEach((tower) => {
      for (let f = 1; f <= Math.min(flatsPerTower, 30); f++) {
        const floor = Math.ceil(f / 4);
        const unit = `${tower.charAt(tower.length - 1)}-${floor}0${(f % 4) + 1}`;
        generatedApartments.push({ tower, floor, unitNumber: unit });
      }
    });

    const payload: CompleteOnboardingPayload = {
      society: {
        name: societyName,
        code: societyCode,
        address,
        city,
        state,
        postalCode,
        totalTowers: towers.length,
        totalFlats: generatedApartments.length,
        hubOperatingHours: operatingHours,
      },
      towers: towers.map((t) => ({ name: t, floors: 10, flatsPerFloor: 4 })),
      apartments: generatedApartments,
      residents: sampleResidents,
      staff: staffRoster,
      storage: storageRacks,
      pickupSlots,
      selectedPlan,
      adminUserId: '0c9c3244-8680-4141-b119-ffecf87c804d',
    };

    const result = await onboardingService.executeSocietyOnboarding(payload);
    setLoading(false);

    if (result.success && result.summary) {
      setSuccessSummary(result.summary);
      setStep(9); // Completed view
    } else {
      setErrorMsg(result.error || 'Failed to complete onboarding');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#0A1128] tracking-tight">
          Society Onboarding Pipeline
        </h1>
        <p className="text-xs text-slate-500 font-bold mt-1">
          Complete end-to-end setup: Society ➔ Towers ➔ Apartments ➔ Residents ➔ Staff ➔ Storage ➔ Pickup Slots ➔ Activation
        </p>
      </div>

      {/* 8-Step Breadcrumb Progress Bar */}
      <div className="bg-white p-3.5 rounded-2xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {[
            { s: 1, label: 'Society' },
            { s: 2, label: 'Towers' },
            { s: 3, label: 'Flats' },
            { s: 4, label: 'Residents' },
            { s: 5, label: 'Staff' },
            { s: 6, label: 'Storage' },
            { s: 7, label: 'Slots' },
            { s: 8, label: 'Activation' },
          ].map((item) => (
            <div key={item.s} className="flex items-center gap-2">
              <button
                onClick={() => step < 9 && setStep(item.s)}
                className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center border-2 transition-all ${
                  step === item.s
                    ? 'bg-[#1E60F2] text-white border-[#0A1128] shadow-[1px_1px_0px_#0A1128]'
                    : step > item.s
                    ? 'bg-emerald-500 text-white border-emerald-700'
                    : 'bg-slate-100 text-slate-400 border-slate-300'
                }`}
              >
                {step > item.s ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.s}
              </button>
              <span
                className={`text-xs font-extrabold ${
                  step === item.s ? 'text-[#1E60F2]' : step > item.s ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {item.s < 8 && <div className="w-6 h-0.5 bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl flex items-center gap-2 text-xs font-black text-rose-700">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-3xl border-2 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-6">
        {/* Step 1: Society Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#1E60F2]" /> Step 1: Society Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Society Name
                </label>
                <input
                  type="text"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-[#1E60F2] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Unique Society Code (3-4 Letters)
                </label>
                <input
                  type="text"
                  value={societyCode}
                  onChange={(e) => setSocietyCode(e.target.value.toUpperCase())}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-[#1E60F2] outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-[#1E60F2] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-[#1E60F2] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-[#1E60F2] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Towers */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1E60F2]" /> Step 2: Define Society Towers / Blocks
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Tower D or Wing 4"
                value={newTowerName}
                onChange={(e) => setNewTowerName(e.target.value)}
                className="flex-1 p-3 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-[#1E60F2] outline-none"
              />
              <button
                type="button"
                onClick={handleAddTower}
                className="px-4 py-2 bg-[#0A1128] text-white font-black text-xs rounded-xl shadow-[2px_2px_0px_#000]"
              >
                + Add Tower
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {towers.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-between text-xs font-black text-blue-900"
                >
                  <span>{t}</span>
                  <span className="text-[10px] text-blue-600 font-bold">Configured</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Apartments */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#1E60F2]" /> Step 3: Apartment & Unit Configuration
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              Automatically provision apartment units for all {towers.length} configured towers.
            </p>
            <div className="max-w-xs">
              <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                Flats per Tower
              </label>
              <input
                type="number"
                min={4}
                max={200}
                value={flatsPerTower}
                onChange={(e) => setFlatsPerTower(parseInt(e.target.value, 10) || 20)}
                className="w-full p-3 rounded-xl border-2 border-slate-300 font-bold text-xs focus:border-[#1E60F2] outline-none"
              />
            </div>
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900">
              Total Apartments to be created: <strong>{towers.length * flatsPerTower} units</strong> across {towers.join(', ')}.
            </div>
          </div>
        )}

        {/* Step 4: Residents */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1E60F2]" /> Step 4: Primary Residents Directory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newResName}
                onChange={(e) => setNewResName(e.target.value)}
                className="p-3 rounded-xl border-2 border-slate-300 font-bold text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Flat (e.g. A-101)"
                value={newResFlat}
                onChange={(e) => setNewResFlat(e.target.value)}
                className="p-3 rounded-xl border-2 border-slate-300 font-bold text-xs outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Mobile Phone"
                  value={newResPhone}
                  onChange={(e) => setNewResPhone(e.target.value)}
                  className="flex-1 p-3 rounded-xl border-2 border-slate-300 font-bold text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddResident}
                  className="px-3 bg-[#0A1128] text-white text-xs font-black rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {sampleResidents.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700"
                >
                  <span>{r.fullName}</span>
                  <span className="text-[#1E60F2] font-black">{r.flatNumber} ({r.tower})</span>
                  <span>{r.phone}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Staff */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#1E60F2]" /> Step 5: Security & Hub Staff Roster
            </h2>
            <div className="space-y-2">
              {staffRoster.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700"
                >
                  <div>
                    <span className="font-black text-slate-900">{s.fullName}</span>
                    <span className="ml-2 text-slate-500 font-medium">({s.designation})</span>
                  </div>
                  <span className="font-mono bg-blue-100 text-blue-900 px-2 py-0.5 rounded-lg border border-blue-200">
                    Badge: {s.badgeNumber}
                  </span>
                  <span className="text-slate-500">{s.shift}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Storage */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#1E60F2]" /> Step 6: Provision Storage Compartments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {storageRacks.map((rack, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border-2 border-slate-300 rounded-2xl shadow-[2px_2px_0px_#0A1128]"
                >
                  <h3 className="text-sm font-black text-[#0A1128]">{rack.rack}</h3>
                  <p className="text-[11px] text-slate-500 font-bold mt-1">{rack.zone}</p>
                  <p className="text-xs font-black text-[#1E60F2] mt-3">
                    {rack.shelvesCount} Shelves • {rack.compartmentType}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Pickup Slots */}
        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1E60F2]" /> Step 7: Configure 30-min Pickup Windows
            </h2>
            <div className="space-y-2">
              {pickupSlots.map((ps, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-black text-amber-950"
                >
                  <span>Window {idx + 1}: {ps.startTime.slice(0, 5)} – {ps.endTime.slice(0, 5)}</span>
                  <span className="bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    Capacity: {ps.maxCapacity} bookings/batch
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Activation & Plan Selection */}
        {step === 8 && (
          <div className="space-y-5">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Step 8: Select Plan & Activate Live
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { plan: 'STARTER' as const, title: 'Starter Hub', price: '₹2,999/mo', desc: 'Up to 500 parcels/mo' },
                { plan: 'PROFESSIONAL' as const, title: 'Professional Society', price: '₹6,999/mo', desc: 'Up to 2,500 parcels/mo' },
                { plan: 'ENTERPRISE' as const, title: 'Enterprise Custom', price: 'Custom SLA', desc: 'Unlimited volume' },
              ].map((p) => (
                <div
                  key={p.plan}
                  onClick={() => setSelectedPlan(p.plan)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === p.plan
                      ? 'border-[#1E60F2] bg-blue-50/60 ring-2 ring-blue-400 shadow-[3px_3px_0px_#1E60F2]'
                      : 'border-slate-300 bg-white hover:border-[#0A1128]'
                  }`}
                >
                  <h3 className="text-xs font-black text-[#0A1128]">{p.title}</h3>
                  <p className="text-base font-black text-[#1E60F2] my-1">{p.price}</p>
                  <p className="text-[11px] text-slate-500 font-bold">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl">
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                Ready to Provision {societyName} ({societyCode})
              </h4>
              <p className="text-xs text-emerald-800 font-bold mt-1">
                Clicking "Activate Society Live" will insert society records, towers, apartments, residents, staff roster, storage slots, and evening pickup batch windows into Supabase with live tamper-proof audit trails.
              </p>
            </div>
          </div>
        )}

        {/* Step 9: Success Confirmation */}
        {step === 9 && successSummary && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-600 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-[3px_3px_0px_#10B981]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-xl font-black text-[#0A1128]">
              {successSummary.societyName} ({successSummary.societyCode}) is Live!
            </h2>
            <p className="text-xs text-slate-600 font-bold max-w-md mx-auto">
              Society successfully onboarded and activated on the <strong>{successSummary.plan}</strong> subscription plan.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left mt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Towers</span>
                <span className="text-sm font-black text-[#0A1128]">{successSummary.towersCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Apartments</span>
                <span className="text-sm font-black text-[#0A1128]">{successSummary.apartmentsCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Storage Slots</span>
                <span className="text-sm font-black text-[#1E60F2]">{successSummary.storageSlotsCount}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Pickup Batches</span>
                <span className="text-sm font-black text-emerald-600">{successSummary.pickupSlotsCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 border-t-2 border-slate-100 mt-6">
          {step > 1 && step < 9 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-[#0A1128] text-xs font-black rounded-xl border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 8 && (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-[#1E60F2] hover:bg-blue-600 text-white text-xs font-black rounded-xl border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center gap-1.5"
            >
              <span>Next Stage</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 8 && (
            <button
              onClick={handleExecuteOnboarding}
              disabled={loading}
              className="px-6 py-3 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-black rounded-xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Activating Society Live...' : 'Activate Society Live'}</span>
            </button>
          )}

          {step === 9 && (
            <button
              onClick={() => {
                setStep(1);
                setSuccessSummary(null);
              }}
              className="px-5 py-2.5 bg-[#0A1128] text-white text-xs font-black rounded-xl shadow-[2px_2px_0px_#000] ml-auto"
            >
              Onboard Another Society
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
