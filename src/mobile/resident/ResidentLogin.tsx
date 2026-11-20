import React, { useState } from 'react';
import { Mail, Phone, Lock, ArrowRight, Building, Sparkles, User, KeyRound } from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { SOCIETIES, useMobileStore } from '../services/mobileState';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../../services/authService';
import { supabase } from '../../services/supabaseClient';

interface ResidentLoginProps {
  onLoginSuccess: () => void;
  onBack?: () => void;
}

export const ResidentLogin: React.FC<ResidentLoginProps> = ({ onLoginSuccess, onBack }) => {
  const { selectedSociety, setSociety, login } = useMobileStore();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [tab, setTab] = useState<'email' | 'phone' | 'google'>('email');

  const [fullName, setFullName] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (mode === 'SIGNUP') {
        if (!fullName.trim()) {
          setLoading(false);
          setErrorMessage('Please enter your full name.');
          return;
        }
        if (!flatNumber.trim()) {
          setLoading(false);
          setErrorMessage('Please enter your flat / unit number (e.g. B-402).');
          return;
        }
        if (!cleanEmail) {
          setLoading(false);
          setErrorMessage('Please enter your email address.');
          return;
        }
        if (!password || password.length < 6) {
          setLoading(false);
          setErrorMessage('Password must be at least 6 characters.');
          return;
        }

        const res = await signUpWithEmail(cleanEmail, password, fullName.trim(), phone.trim(), selectedSociety.id);
        if (res.error) {
          setLoading(false);
          setErrorMessage(res.error);
          return;
        }

        if (!res.session && res.user) {
          setLoading(false);
          setErrorMessage('Account created! Please check your email to confirm, or switch to the Google tab for instant 1-tap sign in.');
          setMode('LOGIN');
          return;
        }

        // Store active session
        login({
          id: res.user?.id || 'res-' + Date.now(),
          email: cleanEmail,
          name: fullName.trim(),
          phone: phone.trim() || undefined,
          role: 'RESIDENT',
          societyId: selectedSociety.id,
          flatNumber: flatNumber.trim().toUpperCase(),
        });
        setLoading(false);
        onLoginSuccess();
      } else {
        // LOGIN MODE
        if (!cleanEmail) {
          setLoading(false);
          setErrorMessage('Please enter your registered email address.');
          return;
        }
        if (!password) {
          setLoading(false);
          setErrorMessage('Please enter your account password.');
          return;
        }

        const res = await signInWithEmail(cleanEmail, password);
        if (res.error) {
          setLoading(false);
          if (res.error.toLowerCase().includes('not confirmed')) {
            setErrorMessage('Email not confirmed. Please check your verification email, or use the Google tab for instant login.');
          } else {
            setErrorMessage(res.error);
          }
          return;
        }

        const profile = res.profile;
        const isVinay = cleanEmail === 'vinaykumard45678@gmail.com';
        const role = isVinay ? 'SUPER_ADMIN' : profile?.role || 'RESIDENT';

        login({
          id: res.user?.id || profile?.id || 'res-' + Date.now(),
          email: cleanEmail,
          name: profile?.full_name || cleanEmail.split('@')[0],
          phone: profile?.phone || undefined,
          role,
          societyId: profile?.society_id || selectedSociety.id,
          flatNumber: (profile as any)?.flat_number || undefined,
        });

        setLoading(false);
        onLoginSuccess();
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signInWithGoogle();
      if (res.error) {
        setErrorMessage(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google Sign-in failed.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none">
      <MobileStatusBar />

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1E60F2] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-white font-black text-sm">
              PF
            </div>
            <span className="font-extrabold text-lg text-[#060D1E]">ParcelFlow</span>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
            Resident Portal
          </span>
        </div>

        {/* Greeting Banner */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-[#060D1E] tracking-tight">
            {mode === 'LOGIN' ? 'Welcome to ParcelFlow 👋' : 'Create Resident Account'}
          </h1>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            {mode === 'LOGIN'
              ? 'Your parcels. Your time. Your control.'
              : 'Connect your apartment and manage incoming deliveries securely.'}
          </p>

          {errorMessage && (
            <div className="mt-3 p-3 bg-rose-50 border-2 border-rose-400 rounded-xl flex items-center justify-between text-xs text-rose-700 font-bold">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-[10px] font-black underline hover:text-rose-900 ml-2"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Society Selector */}
        <div className="mb-4 bg-white p-3.5 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E]">
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
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/80 rounded-2xl border border-slate-300 mb-4 text-xs font-black">
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

        {/* Form Inputs */}
        {tab === 'email' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'SIGNUP' && (
              <>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vinay Kumar"
                    className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 px-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Flat / Unit</label>
                    <input
                      type="text"
                      required
                      value={flatNumber}
                      onChange={(e) => setFlatNumber(e.target.value)}
                      placeholder="e.g. B-402"
                      className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 px-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98..."
                      className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 px-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 px-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white text-xs font-bold text-[#060D1E] py-2.5 px-3 rounded-2xl border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-[#1E60F2] hover:bg-blue-600 text-white font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span>{loading ? 'Authenticating...' : mode === 'LOGIN' ? 'Log In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}

        {tab === 'google' && (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-[#060D1E] font-black text-xs rounded-2xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center font-black text-[#1E60F2]">
                G
              </div>
              <span>Continue with Google</span>
            </button>
            <p className="text-[11px] text-center text-slate-500 font-semibold">
              Official Supabase Google OAuth integration.
            </p>
          </div>
        )}

        {/* Switch mode */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-600 font-semibold">
            {mode === 'LOGIN' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                setErrorMessage(null);
              }}
              className="text-[#1E60F2] font-black hover:underline"
            >
              {mode === 'LOGIN' ? 'Create Account' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
