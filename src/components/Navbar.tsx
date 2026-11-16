import React, { useState, useEffect } from 'react';
import { User, Download, Menu, X, ChevronDown, Smartphone, Shield, Sparkles } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FEF9F3]/95 backdrop-blur-md border-b-2 border-[#0A1128]/20 shadow-[0_3px_0px_#0A1128] py-2.5'
          : 'bg-[#FEF9F3] border-b border-[#0A1128]/10 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: ParcelFlow Brand Logo featuring 3D Isometric Blue Cube with Speed Trails */}
          <a href="/" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl">
            <img
              src="/parcelflow-brand-logo.png"
              alt="ParcelFlow Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                // If image fails, hide image and show fallback
                e.currentTarget.style.display = 'none';
              }}
            />
          </a>

          {/* Center: Clean Nav Links in font-semibold text-slate-800 hover:text-blue-600 */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Buttons: Portal Login (Pill Outline) & Download App (Royal Blue Pill) */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Portal Login (Pill Outline Button with User Icon) */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 border-2 border-[#0A1128] rounded-full shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                aria-expanded={loginDropdownOpen}
              >
                <User className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                <span>Portal Login</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" />
              </button>

              {/* Portal Dropdown Menu */}
              {loginDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border-2 border-[#0A1128] shadow-[4px_4px_0px_#0A1128] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setLoginDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenModal('resident_login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-amber-100 border border-transparent hover:border-[#0A1128] transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 border border-[#0A1128] text-blue-600 group-hover:bg-blue-200">
                      <Smartphone className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#0A1128]">Resident Portal</div>
                      <div className="text-[11px] font-medium text-slate-500">Track OTP & active pickup slots</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenModal('society_login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-emerald-100 border border-transparent hover:border-[#0A1128] transition-all group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 border border-[#0A1128] text-emerald-600 group-hover:bg-emerald-200">
                      <Shield className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#0A1128]">Society / RWA Admin</div>
                      <div className="text-[11px] font-medium text-slate-500">Gate security & parcel ledger</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Download App (Royal Blue Pill Button with Download Icon) */}
            <button
              onClick={() => onOpenModal('download_app')}
              className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#1D4ED8] hover:bg-blue-600 border-2 border-[#0A1128] rounded-full shadow-[2.5px_2.5px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_#0A1128] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0A1128] transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download App</span>
            </button>

            {/* Free Society Pilot Button */}
            <button
              onClick={() => onOpenModal('pilot')}
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0A1128] bg-amber-300 hover:bg-amber-200 border-2 border-[#0A1128] rounded-full shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0A1128]" />
              <span>Society Pilot</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenModal('download_app')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1D4ED8] border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] rounded-full"
            >
              Get App
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] text-[#0A1128]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FEF9F3] border-b-[3px] border-[#0A1128] px-4 pt-3 pb-6 mt-2 space-y-3 shadow-[0_6px_0px_#0A1128] animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1 bg-white p-3 rounded-2xl border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-amber-100 hover:text-blue-600 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('resident_login');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] text-[#0A1128] rounded-full"
            >
              <User className="w-4 h-4 text-blue-600 stroke-[2.5]" /> Resident Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('society_login');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] text-[#0A1128] rounded-full"
            >
              <Shield className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Society / RWA Admin
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('download_app');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#1D4ED8] text-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] rounded-full"
            >
              <Download className="w-4 h-4 stroke-[2.5]" /> Download App (Android & iOS)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('pilot');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-amber-300 text-[#0A1128] border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] rounded-full"
            >
              <Sparkles className="w-4 h-4 text-[#0A1128]" /> Request Free Society Pilot
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
