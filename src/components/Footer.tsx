import React from 'react';
import { Box, Twitter, Linkedin, Instagram, Github, ArrowUpRight, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../utils/constants';

interface FooterProps {
  onOpenModal?: (type: 'pilot' | 'society_login' | 'resident_login' | 'download_app') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  return (
    <footer className="relative bg-[#070A11] border-t border-slate-800/80 text-slate-400 text-sm overflow-hidden pt-16 pb-12">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 p-[1px]">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <Box className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                {BRAND.name}
              </span>
            </div>

            <p className="text-base font-medium text-slate-200">
              {BRAND.tagline}
            </p>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier smart parcel locker infrastructure for gated residential societies, IT parks, and student housing. Eliminate gatehouse chaos, protect deliveries with dual-factor OTP, and retrieve anytime 24/7.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>All 480+ Hubs Operational (99.99% Uptime)</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onOpenModal?.('pilot')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  Society Pilot Program <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenModal?.('resident_login')}
                  className="hover:text-white transition-colors"
                >
                  Resident Mobile App
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal?.('society_login')}
                  className="hover:text-white transition-colors"
                >
                  RWA Command Center
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Courier Integration API
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Cold-Chain & Grocery Pods
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> ISO 27001 Certified
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{BRAND.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-white transition-colors">
                  {BRAND.supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{BRAND.phone}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ParcelFlow Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/faq" className="hover:text-white transition-colors">Help Center</a>
            <a href="/download" className="hover:text-white transition-colors">Download App</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
