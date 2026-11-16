import React, { useState, useEffect } from 'react';
import { Box, Shield, Smartphone, Menu, X, ChevronRight, LogIn, Sparkles } from 'lucide-react';
import { NAV_LINKS, BRAND } from '../utils/constants';

interface NavbarProps {
  onOpenModal: (type: 'pilot' | 'society_login' | 'resident_login' | 'download_app') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Box className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                {BRAND.name}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Smart Locker Infra
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/60 backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA Section */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Login Dropdown / Selector */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all"
                aria-expanded={loginDropdownOpen}
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Portal Login</span>
              </button>

              {loginDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setLoginDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenModal('resident_login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Resident Portal</div>
                      <div className="text-[11px] text-slate-400">Track OTP & active lockers</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenModal('society_login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-slate-800/80 transition-colors group mt-1"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">RWA / Society Admin</div>
                      <div className="text-[11px] text-slate-400">Security & parcel ledger</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Download App CTA */}
            <button
              onClick={() => onOpenModal('download_app')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Get App</span>
            </button>

            {/* Pilot CTA */}
            <button
              onClick={() => onOpenModal('pilot')}
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 group-hover:opacity-90 transition-opacity"></span>
              <span className="relative flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-[#0B0F19] text-white group-hover:bg-opacity-80 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Join Society Pilot</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenModal('pilot')}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              Pilot
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0F172A] border-b border-slate-800 px-4 pt-3 pb-6 mt-3 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('resident_login');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-slate-800 text-slate-200 rounded-xl"
            >
              <Smartphone className="w-4 h-4 text-blue-400" /> Resident Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('society_login');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-slate-800 text-slate-200 rounded-xl"
            >
              <Shield className="w-4 h-4 text-emerald-400" /> RWA / Society Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('download_app');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-slate-800 text-slate-200 rounded-xl"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" /> Download App (iOS & Android)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('pilot');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl shadow-lg"
            >
              <Sparkles className="w-4 h-4" /> Request Free 30-Day Society Pilot
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
