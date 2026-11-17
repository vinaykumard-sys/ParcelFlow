import React, { useState } from 'react';
import { Mail, Phone, Lock, ArrowRight, Building, CheckCircle2, Sparkles, Shield, User } from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { SOCIETIES, useMobileStore } from '../services/mobileState';

interface ResidentLoginProps {
  onLoginSuccess: () => void;
  onBack?: () => void;
}

export const ResidentLogin: React.FC<ResidentLoginProps> = ({ onLoginSuccess, onBack }) => {
  const { selectedSociety, setSociety } = useMobileStore();
  const [tab, setTab] = useState<'phone' | 'email' | 'google'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  const handleSendOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtp('742916');
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <MobileStatusBar />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Header / Back */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1E60F2] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-white font-black text-sm">
              PF
            </div>
            <span className="font-extrabold text-lg text-[#060D1E]">ParcelFlow</span>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
            Resident
          </span>
        </div>

        {/* Greeting Banner */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#060D1E] tracking-tight flex items-center gap-2">
            Welcome to ParcelFlow 👋
          </h1>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            Access your society deliveries, schedule slots, and pick up in under 60 seconds.
          </p>
        </div>

        {/* Society Selector */}
        <div className="mb-5 bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
            <Building className="w-3.5 h-3.5 text-[#1E60F2]" /> Your Society
          </label>
          <select
            value={selectedSociety.id}
            onChange={(e) => {
              const soc = SOCIETIES.find((s) => s.id === e.target.value);
              if (soc) setSociety(soc);
            }}
            className="w-full bg-[#FEF9F3] text-[#060D1E] font-bold text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1E60F2]"
          >
            {SOCIETIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>

        {/* Auth Method Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-300 mb-5 text-xs font-black">
          <button
            type="button"
            onClick={() => setTab('phone')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'phone'
                ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('email')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'email'
                ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('google')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'google'
                ? 'bg-white text-[#060D1E] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <span className="font-extrabold text-[#1E60F2]">G</span>
            <span>Google</span>
          </button>
        </div>

        {/* Tab Forms */}
        {tab === 'phone' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full bg-white text-xs font-bold text-[#060D1E] py-3 pl-3 pr-24 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
                />
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="absolute right-2 top-2 px-3 py-1.5 bg-[#1E60F2] text-white text-[10px] font-black rounded-xl border border-[#060D1E] hover:bg-blue-600"
                  >
                    Get OTP
                  </button>
                ) : (
                  <span className="absolute right-3 top-3 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                  </span>
                )}
              </div>
            </div>

            {otpSent && (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">Enter 6-digit OTP</label>
                  <span className="text-[10px] font-extrabold text-[#1E60F2]">Auto-filled: 742916</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="7 4 2 9 1 6"
                  className="w-full bg-white text-center tracking-widest text-base font-black text-[#060D1E] py-2.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>{loading ? 'Verifying...' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}

        {tab === 'email' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white text-xs font-bold text-[#060D1E] py-3 px-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white text-xs font-bold text-[#060D1E] py-3 px-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>{loading ? 'Logging In...' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}

        {tab === 'google' && (
          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={() => handleLogin()}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-[#060D1E] font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-3 transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center font-black text-[#1E60F2]">
                G
              </div>
              <span>Continue with Google (vinay@gmail.com)</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Verified resident OAuth domain for Greenview Heights.
            </p>
          </div>
        )}

        

        <div className="mt-5 text-center">
          <p className="text-xs text-slate-600 font-semibold">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => handleLogin()}
              className="text-[#1E60F2] font-black hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
