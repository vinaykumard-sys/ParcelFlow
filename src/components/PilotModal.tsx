import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Smartphone, Building2, Lock, ArrowRight, QrCode, Phone, Mail, User, Sparkles } from 'lucide-react';
import { submitPilotRequest } from '../utils/supabase';

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
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 text-white animate-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. JOIN SOCIETY PILOT MODAL */}
        {type === 'pilot' && (
          <div>
            {!pilotSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Join 30-Day Society Pilot</h3>
                    <p className="text-xs text-slate-400">Zero upfront cost for gated communities & RWAs</p>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
                  🎁 <strong>Pilot includes:</strong> 1x 24-compartment modular locker kiosk, cloud telemetry, 24/7 security camera integration, & resident onboarding assistance.
                </div>

                <form onSubmit={handlePilotSubmit} className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Arjun Mehta"
                          value={pilotForm.fullName}
                          onChange={(e) => setPilotForm({ ...pilotForm, fullName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Society / Apartment Name</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Prestige Falcon City"
                          value={pilotForm.societyName}
                          onChange={(e) => setPilotForm({ ...pilotForm, societyName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                      <select
                        value={pilotForm.city}
                        onChange={(e) => setPilotForm({ ...pilotForm, city: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
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
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Total Flats / Units</label>
                      <input
                        type="number"
                        min="20"
                        required
                        value={pilotForm.totalFlats}
                        onChange={(e) => setPilotForm({ ...pilotForm, totalFlats: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={pilotForm.phone}
                          onChange={(e) => setPilotForm({ ...pilotForm, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Work / Personal Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="arjun@ falcon.org"
                          value={pilotForm.email}
                          onChange={(e) => setPilotForm({ ...pilotForm, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Role in the Society</label>
                    <select
                      value={pilotForm.role}
                      onChange={(e) => setPilotForm({ ...pilotForm, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="rwa_member">RWA President / Secretary / Committee Member</option>
                      <option value="facility_manager">Estate Manager / Facility Ops</option>
                      <option value="resident">Active Resident / Proposer</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit Pilot Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Pilot Application Received!</h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you, <strong>{pilotForm.fullName}</strong>. Our Bengaluru deployment team will review <strong>{pilotForm.societyName}</strong> and contact you at <strong>{pilotForm.phone}</strong> within 24 hours.
                </p>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-left max-w-sm mx-auto">
                  <p className="font-semibold text-slate-200 mb-1">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Site feasibility check (power & 4G/fiber signal)</li>
                    <li>RWA demo presentation & approval kit</li>
                    <li>Locker kiosk dispatch & installation in 7 days</li>
                  </ol>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
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
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Resident Quick Access</h3>
                    <p className="text-xs text-slate-400">View active packages & locker pickup PINs</p>
                  </div>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Registered Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={residentPhone}
                          onChange={(e) => setResidentPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        We will send a one-time login code to your society-registered phone.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                      Get Verification Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
                      Code sent to <strong>{residentPhone}</strong>. (Demo test code: <strong>849201</strong>)
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="849201"
                        value={residentOtp}
                        onChange={(e) => setResidentOtp(e.target.value)}
                        className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      Verify & Open Resident Portal
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base">Flat B-402 • Prestige Falcon</h4>
                    <p className="text-xs text-slate-400">Resident: Rohan Verma</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    1 Active Parcel
                  </span>
                </div>

                {/* Locker Card */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                        Main Gate Tower Hub
                      </span>
                      <h5 className="font-semibold text-white text-sm">Locker Pod #14 (Medium)</h5>
                      <p className="text-xs text-slate-400">Carrier: Amazon Logistics (AWB: 98124912)</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                      Ready
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400">YOUR RETRIEVAL PIN</div>
                      <div className="text-xl font-mono font-bold text-blue-400 tracking-wider">
                        6 9 2 0 4 1
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                      <QrCode className="w-8 h-8" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Scan QR or enter PIN at the kiosk screen. Valid for next 36 hours.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setResidentLoggedIn(false);
                    setOtpSent(false);
                    onClose();
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200"
                >
                  Done
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
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Society Admin Console</h3>
                    <p className="text-xs text-slate-400">Gatehouse security & parcel custody ledger</p>
                  </div>
                </div>

                <form onSubmit={handleSocietyLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Society ID / License Code
                    </label>
                    <input
                      type="text"
                      required
                      value={societyId}
                      onChange={(e) => setSocietyId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Admin Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={societyPass}
                        onChange={(e) => setSocietyPass(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                    💡 <strong>Demo Mode:</strong> Leave blank or enter any password to view the simulated RWA Command Dashboard.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    Enter RWA Command Center
                  </button>
                </form>
              </>
            ) : (
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base">Prestige Falcon City Hub</h4>
                    <p className="text-xs text-slate-400">Live Kiosk Status: Connected (4G High Speed)</p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xl font-bold text-white font-mono">48</div>
                    <div className="text-[10px] text-slate-400">Total Pods</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xl font-bold text-blue-400 font-mono">36</div>
                    <div className="text-[10px] text-slate-400">Occupied</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xl font-bold text-emerald-400 font-mono">12</div>
                    <div className="text-[10px] text-slate-400">Free Pods</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-slate-200">Recent Gate Activity Log:</div>
                  <div className="text-slate-400 text-[11px] flex justify-between">
                    <span>BlueDart Courier deposited Pod #08</span>
                    <span className="text-slate-500 font-mono">2m ago</span>
                  </div>
                  <div className="text-slate-400 text-[11px] flex justify-between">
                    <span>Resident #C-801 retrieved Pod #22</span>
                    <span className="text-slate-500 font-mono">14m ago</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSocietyLoggedIn(false);
                    onClose();
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200"
                >
                  Close Console
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. DOWNLOAD APP MODAL */}
        {type === 'download_app' && (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 mx-auto">
              <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-400" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Get ParcelFlow for Mobile</h3>
              <p className="text-xs text-slate-400 mt-1">
                One-tap Bluetooth locker unlocking, live CCTV drop recordings, and resident notifications.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <div className="p-3 bg-white rounded-xl shadow-lg">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Scan with your phone camera to download from App Store or Google Play
              </p>
            </div>

            {!smsSent ? (
              <form onSubmit={handleSendSms} className="flex gap-2">
                <input
                  type="tel"
                  required
                  placeholder="Enter phone number"
                  value={appPhone}
                  onChange={(e) => setAppPhone(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold whitespace-nowrap"
                >
                  Text Me Link
                </button>
              </form>
            ) : (
              <p className="text-xs text-emerald-400 font-medium">
                ✓ Download link sent via SMS to {appPhone}!
              </p>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium">
                iOS 15.0+ Supported
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium">
                Android 9.0+ Supported
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
