import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Smartphone, Building2, Lock, ArrowRight, QrCode, Phone, Mail, User, Sparkles } from 'lucide-react';
import { submitPilotRequest } from '../utils/supabase';
import { Sticker } from './Sticker';

interface PilotModalProps {
  isOpen: boolean;
  type: 'pilot' | 'society_login' | 'resident_login' | 'download_app';
  onClose: () => void;
}

export const PilotModal: React.FC<PilotModalProps> = ({ isOpen, type, onClose }) => {
  // Pilot Form State
  const [pilotForm, setPilotForm] = useState({
    fullName: '',
    societyName: '',
    city: 'Bengaluru',
    totalFlats: '250',
    phone: '',
    email: '',
    role: 'rwa_member',
    notes: '',
  });
  const [pilotSubmitted, setPilotSubmitted] = useState(false);

  // Resident Login Mock State
  const [residentPhone, setResidentPhone] = useState('');
  const [residentOtp, setResidentOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [residentLoggedIn, setResidentLoggedIn] = useState(false);

  // Society Login Mock State
  const [societyId, setSocietyId] = useState('BLR-PRESTIGE-04');
  const [societyPass, setSocietyPass] = useState('');
  const [societyLoggedIn, setSocietyLoggedIn] = useState(false);

  // Download App SMS State
  const [appPhone, setAppPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  if (!isOpen) return null;

  const handlePilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPilotSubmitted(true);
    await submitPilotRequest({
      society_name: pilotForm.societyName,
      city: pilotForm.city,
      total_units: parseInt(pilotForm.totalFlats, 10) || 100,
      contact_name: pilotForm.fullName,
      contact_email: pilotForm.email,
      contact_phone: pilotForm.phone,
      role: pilotForm.role,
      notes: pilotForm.notes,
    });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (residentPhone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (residentOtp === '849201' || residentOtp.length === 6) {
      setResidentLoggedIn(true);
    }
  };

  const handleSocietyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSocietyLoggedIn(true);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    setSmsSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#FAF7F2] border-[3px] border-[#0F172A] rounded-3xl shadow-[8px_8px_0px_#0F172A] p-6 sm:p-8 z-10 text-[#0F172A] animate-in zoom-in-95 duration-150 my-8">
        
        {/* Playful Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#0F172A] bg-white hover:bg-rose-100 border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* 1. JOIN SOCIETY PILOT MODAL */}
        {type === 'pilot' && (
          <div>
            {!pilotSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-2xl bg-amber-400 border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] text-[#0F172A]">
                    <Sparkles className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                      Join 30-Day Society Pilot
                    </h3>
                    <p className="text-xs font-bold text-blue-600">
                      Zero cost • Installed in 7 days • Free RWA approval kit
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3.5 rounded-2xl bg-amber-100 border-2 border-[#0F172A] shadow-[2.5px_2.5px_0px_#0F172A] text-xs font-semibold text-[#0F172A] flex items-start gap-2">
                  <span className="text-base">🎁</span>
                  <span>
                    <strong>Free Pilot Includes:</strong> 1x 24-compartment modular locker kiosk, 4G cloud telemetry, CCTV recording, and resident app onboarding.
                  </span>
                </div>

                <form onSubmit={handlePilotSubmit} className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] mb-1">Your Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 stroke-[2.5]" />
                        <input
                          type="text"
                          required
                          placeholder="Arjun Mehta"
                          value={pilotForm.fullName}
                          onChange={(e) => setPilotForm({ ...pilotForm, fullName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-blue-600 focus:shadow-[2px_2px_0px_#2563EB]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] mb-1">Society Name</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3 stroke-[2.5]" />
                        <input
                          type="text"
                          required
                          placeholder="Prestige Falcon City"
                          value={pilotForm.societyName}
                          onChange={(e) => setPilotForm({ ...pilotForm, societyName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-blue-600 focus:shadow-[2px_2px_0px_#2563EB]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] mb-1">City</label>
                      <select
                        value={pilotForm.city}
                        onChange={(e) => setPilotForm({ ...pilotForm, city: e.target.value })}
                        className="w-full px-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-blue-600"
                      >
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Other">Other City</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] mb-1">Total Flats / Units</label>
                      <input
                        type="number"
                        min="20"
                        required
                        value={pilotForm.totalFlats}
                        onChange={(e) => setPilotForm({ ...pilotForm, totalFlats: e.target.value })}
                        className="w-full px-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3 stroke-[2.5]" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={pilotForm.phone}
                          onChange={(e) => setPilotForm({ ...pilotForm, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] mb-1">Work / Society Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 stroke-[2.5]" />
                        <input
                          type="email"
                          required
                          placeholder="arjun@falcon.org"
                          value={pilotForm.email}
                          onChange={(e) => setPilotForm({ ...pilotForm, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0F172A] mb-1">Your Role in Society</label>
                    <select
                      value={pilotForm.role}
                      onChange={(e) => setPilotForm({ ...pilotForm, role: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-blue-600"
                    >
                      <option value="rwa_member">RWA President / Secretary / Committee Member</option>
                      <option value="facility_manager">Estate Manager / Facility Ops</option>
                      <option value="resident">Active Resident / Proposer</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl font-black text-sm bg-blue-600 hover:bg-blue-500 text-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit Pilot Application</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-400 border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] text-[#0F172A] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-black text-[#0F172A]">Pilot Application Received!</h3>
                <p className="text-xs font-medium text-slate-700 max-w-sm mx-auto">
                  Thank you, <strong>{pilotForm.fullName}</strong>. Our Bengaluru deployment team will review <strong>{pilotForm.societyName}</strong> and contact you at <strong>{pilotForm.phone}</strong> within 24 hours.
                </p>
                <div className="p-4 rounded-2xl bg-white border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] text-xs text-slate-700 text-left max-w-sm mx-auto">
                  <p className="font-black text-[#0F172A] mb-1.5">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-1 font-semibold">
                    <li>Site feasibility check (power & 4G/fiber signal)</li>
                    <li>RWA demo presentation & approval kit</li>
                    <li>Locker kiosk dispatch & installation in 7 days</li>
                  </ol>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0F172A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0px_#0F172A] text-xs font-black"
                >
                  Back to Website
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. RESIDENT LOGIN MODAL */}
        {type === 'resident_login' && (
          <div>
            {!residentLoggedIn ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-2xl bg-blue-500 border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] text-white">
                    <Smartphone className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A]">Resident Portal</h3>
                    <p className="text-xs font-bold text-slate-600">Track active deliveries & pickup OTPs</p>
                  </div>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-[#0F172A] mb-1">
                        Registered Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3 stroke-[2.5]" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={residentPhone}
                          onChange={(e) => setResidentPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#0F172A] rounded-xl text-sm font-bold text-[#0F172A] focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 mt-1.5">
                        We will send a one-time login code to your society-registered phone.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl font-black text-sm bg-blue-600 hover:bg-blue-500 text-white border-[2.5px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
                    >
                      Get Verification Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-3 rounded-2xl bg-emerald-100 border-2 border-[#0F172A] text-xs font-bold text-emerald-900 shadow-[2px_2px_0px_#0F172A]">
                      ✨ Code sent to <strong>{residentPhone}</strong>. (Demo code: <strong>849201</strong>)
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0F172A] mb-1">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="849201"
                        value={residentOtp}
                        onChange={(e) => setResidentOtp(e.target.value)}
                        className="w-full text-center tracking-widest text-xl font-mono font-black py-2.5 bg-white border-2 border-[#0F172A] rounded-xl text-[#0F172A] focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl font-black text-sm bg-emerald-400 hover:bg-emerald-300 text-[#0F172A] border-[2.5px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
                    >
                      Verify & Open Resident Portal
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="py-2 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#0F172A]/20 pb-3">
                  <div>
                    <h4 className="font-black text-[#0F172A] text-base">Flat B-402 • Prestige Falcon</h4>
                    <p className="text-xs font-bold text-slate-600">Resident: Rohan Verma</p>
                  </div>
                  <Sticker color="mint" size="sm">1 Active Parcel</Sticker>
                </div>

                {/* Cartoon Locker Card */}
                <div className="p-4 rounded-2xl bg-white border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider">
                        Main Gate Hub Kiosk #1
                      </span>
                      <h5 className="font-black text-[#0F172A] text-sm">Locker Pod #14 (Medium)</h5>
                      <p className="text-xs font-medium text-slate-600">Carrier: Amazon Logistics (AWB: 98124912)</p>
                    </div>
                    <span className="text-xs font-mono font-black text-[#0F172A] bg-amber-300 border border-[#0F172A] px-2 py-0.5 rounded-lg">
                      Ready ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border-2 border-[#0F172A]">
                    <div>
                      <div className="text-[10px] font-black text-slate-600 uppercase">Your Pickup PIN</div>
                      <div className="text-2xl font-mono font-black text-blue-600 tracking-widest">
                        6 9 2 0 4 1
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border-2 border-[#0F172A] text-[#0F172A]">
                      <QrCode className="w-8 h-8" />
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Scan QR or punch PIN at the kiosk touch display. Active for 36 hours.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setResidentLoggedIn(false);
                    setOtpSent(false);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 border-2 border-[#0F172A] shadow-[2.5px_2.5px_0px_#0F172A] text-xs font-black rounded-xl text-[#0F172A]"
                >
                  Close Portal
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. SOCIETY / RWA LOGIN MODAL */}
        {type === 'society_login' && (
          <div>
            {!societyLoggedIn ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-2xl bg-emerald-400 border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] text-[#0F172A]">
                    <Shield className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A]">Society Admin Console</h3>
                    <p className="text-xs font-bold text-slate-600">Gatehouse security & parcel custody ledger</p>
                  </div>
                </div>

                <form onSubmit={handleSocietyLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-black text-[#0F172A] mb-1">
                      Society ID / License Code
                    </label>
                    <input
                      type="text"
                      required
                      value={societyId}
                      onChange={(e) => setSocietyId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-mono font-bold text-[#0F172A] focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0F172A] mb-1">
                      Admin Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 stroke-[2.5]" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={societyPass}
                        onChange={(e) => setSocietyPass(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-100 border-2 border-[#0F172A] text-[11px] font-semibold text-[#0F172A]">
                    💡 <strong>Demo Mode:</strong> Leave blank or enter any password to view the simulated RWA Command Dashboard.
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl font-black text-sm bg-emerald-400 hover:bg-emerald-300 text-[#0F172A] border-[2.5px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
                    >
                      Enter RWA Command Center (Demo)
                    </button>
                    <a
                      href="/admin"
                      className="w-full text-center py-2.5 px-4 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-500 text-white border-[2.5px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all"
                    >
                      <span>Launch Full Admin Console App (/admin)</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </a>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-2 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#0F172A]/20 pb-3">
                  <div>
                    <h4 className="font-black text-[#0F172A] text-base">Prestige Falcon City Hub</h4>
                    <p className="text-xs font-bold text-slate-600">Live Kiosk Status: Connected (4G High Speed)</p>
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-[#0F172A] animate-pulse"></span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 rounded-2xl bg-white border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                    <div className="text-xl font-black text-[#0F172A] font-mono">48</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Total Pods</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                    <div className="text-xl font-black text-blue-600 font-mono">36</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Occupied</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
                    <div className="text-xl font-black text-emerald-600 font-mono">12</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Free Pods</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] text-xs space-y-2">
                  <div className="font-black text-[#0F172A]">Recent Gate Activity Log:</div>
                  <div className="text-slate-700 text-[11px] font-semibold flex justify-between">
                    <span>📦 BlueDart deposited in Pod #08</span>
                    <span className="font-mono text-slate-500">2m ago</span>
                  </div>
                  <div className="text-slate-700 text-[11px] font-semibold flex justify-between">
                    <span>🔑 Resident #C-801 retrieved Pod #22</span>
                    <span className="font-mono text-slate-500">14m ago</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="/admin"
                    className="w-full text-center py-2.5 px-4 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-500 text-white border-[2px] border-[#0F172A] shadow-[2.5px_2.5px_0px_#0F172A] flex items-center justify-center gap-1.5"
                  >
                    <span>Open Full Production Admin (/admin)</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </a>
                  <button
                    onClick={() => {
                      setSocietyLoggedIn(false);
                      onClose();
                    }}
                    className="w-full py-2 bg-white hover:bg-slate-100 border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] text-xs font-black rounded-xl text-[#0F172A]"
                  >
                    Close Console
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. DOWNLOAD APP MODAL */}
        {type === 'download_app' && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 border-[2.5px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] mx-auto flex items-center justify-center text-white">
              <Smartphone className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#0F172A]">Get ParcelFlow App</h3>
              <p className="text-xs font-bold text-slate-600 mt-1">
                One-tap Bluetooth locker unlocking, live drop alerts, and instant OTP sharing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] flex flex-col items-center">
              <div className="p-3 bg-amber-50 rounded-xl border-2 border-[#0F172A]">
                <QrCode className="w-28 h-28 text-[#0F172A]" />
              </div>
              <p className="text-[11px] font-bold text-slate-600 mt-2">
                Scan with smartphone camera to open download link directly
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="/downloads/android/ParcelFlow.apk"
                download="ParcelFlow.apk"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white border-[2.5px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
              >
                <span>Direct Download Android APK (2.0 MB)</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
              <a
                href="/download"
                onClick={onClose}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline mt-1"
              >
                View APK Details, iOS Status & Checksum →
              </a>
            </div>

            {!smsSent ? (
              <form onSubmit={handleSendSms} className="flex gap-2 pt-2">
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={appPhone}
                  onChange={(e) => setAppPhone(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border-2 border-[#0F172A] rounded-xl text-xs font-bold text-[#0F172A] focus:outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#0F172A] border-2 border-[#0F172A] shadow-[2.5px_2.5px_0px_#0F172A] rounded-xl text-xs font-black whitespace-nowrap hover:-translate-y-0.5 transition-all"
                >
                  Text Link
                </button>
              </form>
            ) : (
              <p className="text-xs text-emerald-700 font-bold bg-emerald-100 p-2 rounded-xl border border-emerald-400">
                ✓ Download link sent via SMS to {appPhone}!
              </p>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#0F172A] text-xs text-[#0F172A] font-bold shadow-[2px_2px_0px_#0F172A]">
                🍏 iOS 15.0+
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#0F172A] text-xs text-[#0F172A] font-bold shadow-[2px_2px_0px_#0F172A]">
                🤖 Android 9.0+
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
