import React, { useState } from 'react';
import { Crown, Mail, Lock, ArrowRight, Building, Sparkles, UserCheck } from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { SOCIETIES, useMobileStore } from '../services/mobileState';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onSwitchRole: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onSwitchRole }) => {
  const { selectedSociety, setSociety } = useMobileStore();
  const [email, setEmail] = useState('vinaykumard45678@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <MobileStatusBar />

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-amber-950 font-black text-sm">
                PF
              </div>
              <span className="font-extrabold text-lg text-[#060D1E]">ParcelFlow</span>
            </div>
            <span className="text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Society Admin
            </span>
          </div>

          <div className="mb-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-400 border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center mb-4 text-amber-950">
              <Crown className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-black text-[#060D1E] tracking-tight">
              Society Admin Login
            </h1>
            <p className="text-xs font-bold text-slate-600 mt-1">
              Management portal for society committee members & administrators.
            </p>
          </div>

          {/* Society Selector */}
          <div className="mb-4 bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
            <label className="text-[11px] font-black uppercase text-slate-500 flex items-center gap-1.5 mb-1.5">
              <Building className="w-3.5 h-3.5 text-amber-600" /> Society
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

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Admin Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vinaykumard45678@gmail.com"
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
              className="w-full mt-4 py-3.5 px-4 bg-amber-400 hover:bg-amber-500 active:scale-95 text-[#060D1E] font-black text-sm rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 transition-all"
            >
              <span>{loading ? 'Verifying Admin...' : 'Sign In as Admin'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Quick Demo Admin Card */}
          <div className="mt-5 p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-400 shadow-[2px_2px_0px_#F59E0B]">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-black text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>One-Click Demo Admin</span>
            </div>
            <p className="text-[11px] text-amber-900 font-semibold mb-2.5">
              Launch directly as Vinay Kumar (Admin for Greenview Heights).
            </p>
            <button
              type="button"
              onClick={() => handleLogin()}
              className="w-full py-2.5 px-3 bg-[#060D1E] hover:bg-slate-800 text-white font-black text-xs rounded-xl border border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch as Admin</span>
            </button>
          </div>
        </div>

        <button
          onClick={onSwitchRole}
          className="mt-6 py-2 text-xs font-extrabold text-slate-600 hover:text-black text-center"
        >
          Switch to Resident / Staff App →
        </button>
      </div>
    </div>
  );
};
