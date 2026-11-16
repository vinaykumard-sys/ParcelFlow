import React, { useState, useEffect } from 'react';
import { Package, Smartphone, Shield, Menu, X, ChevronDown, Sparkles, UserCheck } from 'lucide-react';
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b-[2.5px] border-[#0F172A] shadow-[0_4px_0px_#0F172A] py-2.5'
          : 'bg-[#FAF7F2] border-b-2 border-[#0F172A]/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Playful Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            {/* Cartoon Package Cube */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-amber-400 border-[2.5px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] group-hover:rotate-6 group-hover:-translate-y-0.5 transition-all duration-200">
              {/* Tape Detail */}
              <div className="absolute top-0 bottom-0 w-2.5 bg-orange-400/50 border-x border-[#0F172A]/40" />
              <Package className="w-6 h-6 text-[#0F172A] relative z-10 stroke-[2.5]" />
              {/* Little playful sparkle sticker */}
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-[1.5px] border-[#0F172A] flex items-center justify-center text-[8px] text-white font-black">
                ★
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-1 font-sans">
                {BRAND.name}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 border border-[#0F172A] animate-pulse"></span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 -mt-1">
                Smart Parcel Lockers
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-2xl bg-white border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-bold text-[#0F172A] hover:bg-amber-300 hover:rounded-xl transition-all duration-150"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA Section */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Portal Login Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-[#0F172A] bg-white hover:bg-amber-100 border-[2px] border-[#0F172A] rounded-xl shadow-[2.5px_2.5px_0px_#0F172A] hover:-translate-y-0.5 transition-all"
                aria-expanded={loginDropdownOpen}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                <span>Portal Login</span>
                <ChevronDown className="w-3 h-3 text-[#0F172A] stroke-[2.5]" />
              </button>

              {loginDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border-[2.5px] border-[#0F172A] shadow-[5px_5px_0px_#0F172A] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setLoginDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenModal('resident_login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-amber-100 border border-transparent hover:border-[#0F172A] transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 border border-[#0F172A] text-blue-600 group-hover:bg-blue-200">
                      <Smartphone className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#0F172A]">Resident Portal</div>
                      <div className="text-[11px] font-medium text-slate-500">Track OTP & active lockers</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenModal('society_login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-emerald-100 border border-transparent hover:border-[#0F172A] transition-all group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 border border-[#0F172A] text-emerald-600 group-hover:bg-emerald-200">
                      <Shield className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#0F172A]">Society / RWA Admin</div>
                      <div className="text-[11px] font-medium text-slate-500">Security & parcel ledger</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Download App CTA (Bright Blue with dark outline & hover lift) */}
            <button
              onClick={() => onOpenModal('download_app')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-500 border-[2.5px] border-[#0F172A] rounded-xl shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download App</span>
            </button>

            {/* Request Society Pilot Badge Button */}
            <button
              onClick={() => onOpenModal('pilot')}
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-[#0F172A] bg-emerald-400 hover:bg-emerald-300 border-[2.5px] border-[#0F172A] rounded-xl shadow-[3px_3px_0px_#0F172A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0F172A] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F172A] stroke-[2.5]" />
              <span>Free Society Pilot</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenModal('download_app')}
              className="px-3 py-1.5 text-xs font-black text-white bg-blue-600 border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] rounded-lg"
            >
              App
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] text-[#0F172A]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF7F2] border-b-[3px] border-[#0F172A] px-4 pt-3 pb-6 mt-2 space-y-3 shadow-[0_6px_0px_#0F172A] animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1.5 bg-white p-3 rounded-2xl border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-amber-300 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('resident_login');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black bg-white border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] text-[#0F172A] rounded-xl"
            >
              <Smartphone className="w-4 h-4 text-blue-600 stroke-[2.5]" /> Resident Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('society_login');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black bg-white border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] text-[#0F172A] rounded-xl"
            >
              <Shield className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Society / RWA Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('download_app');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black bg-blue-600 text-white border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] rounded-xl"
            >
              <Smartphone className="w-4 h-4 stroke-[2.5]" /> Download App (iOS & Android)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('pilot');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black bg-amber-400 text-[#0F172A] border-2 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] rounded-xl"
            >
              <Sparkles className="w-4 h-4 text-[#0F172A] stroke-[2.5]" /> Request Free Society Pilot
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
