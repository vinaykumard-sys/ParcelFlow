import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Building, Sparkles, UserCheck } from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { SOCIETIES, useMobileStore } from '../services/mobileState';

interface StaffSplashAndLoginProps {
  onLoginSuccess: () => void;
}

export const StaffSplashAndLogin: React.FC<StaffSplashAndLoginProps> = ({
  onLoginSuccess,
}) => {
  const { selectedSociety, setSociety, login } = useMobileStore();
  const [email, setEmail] = useState('staff@parcelflow.in');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return; // Prevent double-tap
    setLoading(true);
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const isStaffDomain = cleanEmail.endsWith('@parcelflow.in') || cleanEmail === 'staff@parcelflow.in' || cleanEmail.includes('security');

    if (!isStaffDomain) {
      setLoading(false);
      setErrorMessage(
        'Unauthorized: Only registered security staff accounts (e.g. staff@parcelflow.in) can access the Gate Security portal.'
      );
      return;
    }

    try {
      login({
        id: 'stf-gate-1',
        email: cleanEmail,
        name: cleanEmail.includes('ramesh') ? 'Ramesh Gowda (Lead)' : 'Gate Security Attendant',
        role: 'SECURITY',
        societyId: selectedSociety.id,
      });
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess();
      }, 350);
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || 'Login failed. Please retry.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <MobileStatusBar />

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-white font-black text-sm">
                PF
              </div>
              <span className="font-extrabold text-lg text-[#060D1E]">ParcelFlow</span>
            </div>
            <span className="text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full">
              Hub Staff Portal
            </span>
          </div>

          {/* Title Area */}
          <div className="mb-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-500 border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center mb-4 text-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-[#060D1E] tracking-tight">
              Staff & Gate Login
            </h1>
            <p className="text-xs font-bold text-slate-600 mt-1">
              Authorized gate security and parcel hub attendants only.
            </p>
          </div>

          {/* Society Selector */}
          <div className="mb-4 bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <label className="text-[11px] font-black uppercase text-slate-500 flex items-center gap-1.5 mb-1.5">
              <Building className="w-3.5 h-3.5 text-[#1E60F2]" /> Assigned Society Hub
            </label>
            <select
              value={selectedSociety.id}
              onChange={(e) => {
                const soc = SOCIETIES.find((s) => s.id === e.target.value);
                if (soc) setSociety(soc);
              }}
              className="w-full bg-[#FEF9F3] text-[#060D1E] font-bold text-xs p-2 rounded-xl border border-slate-300 focus:outline-none"
            >
              {SOCIETIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Staff ID / Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@parcelflow.in"
                  className="w-full bg-white text-xs font-bold text-[#060D1E] py-3 pl-3 pr-10 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Hub Security PIN / Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff password / PIN"
                  className="w-full bg-white text-xs font-bold text-[#060D1E] py-3 pl-3 pr-10 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 active:scale-95 disabled:opacity-50 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Staff'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
