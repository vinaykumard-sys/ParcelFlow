import React from 'react';
import { Package, ArrowUpRight, ShieldCheck, Mail, MapPin, Phone, Heart } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../utils/constants';
import { Sticker } from './Sticker';

interface FooterProps {
  onOpenModal?: (type: 'pilot' | 'society_login' | 'resident_login' | 'download_app') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  return (
    <footer className="relative bg-[#FEF9F3] border-t-[3px] border-[#0A1128] text-[#0A1128] text-sm overflow-hidden pt-16 pb-12">
      {/* Playful Stickers Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="p-6 bg-white border-[2.5px] border-[#0A1128] rounded-3xl shadow-[5px_5px_0px_#0A1128] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <div>
              <h4 className="text-sm font-black text-[#0A1128]">Certified Smart Community Network</h4>
              <p className="text-xs text-slate-600 font-medium">India's highest rated residential parcel locker infrastructure</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Sticker color="yellow" rotate="left" size="sm" icon={<span>📦</span>}>
              480+ Hubs Live
            </Sticker>
            <Sticker color="mint" rotate="right" size="sm" icon={<span>⚡</span>}>
              99.99% Uptime
            </Sticker>
            <Sticker color="orange" rotate="slight-left" size="sm" icon={<span>🛡️</span>}>
              Dual-OTP Security
            </Sticker>
            <Sticker color="blue" rotate="slight-right" size="sm" icon={<span>📍</span>}>
              Bengaluru • Mumbai • NCR
            </Sticker>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b-2 border-[#0A1128]/20">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-amber-400 border-[2.5px] border-[#0A1128] shadow-[3px_3px_0px_#0A1128]">
                <Package className="w-6 h-6 text-[#0A1128] stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-[#0A1128]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#0A1128] font-sans">
                {BRAND.name}
              </span>
            </div>

            <p className="text-base font-extrabold text-[#0A1128]">
              {BRAND.tagline}
            </p>
            
            <p className="text-xs text-slate-700 font-medium leading-relaxed max-w-sm">
              Smart automated parcel lockers built specifically for gated apartment communities, IT corridors, and modern townships across India. Say goodbye to security gate piles and missed deliveries.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onOpenModal?.('pilot')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#0A1128] border-2 border-[#0A1128] rounded-xl text-xs font-black shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 transition-all"
              >
                <span>Request Society Installation</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1128] mb-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-700">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-blue-600 hover:underline transition-colors inline-flex items-center gap-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onOpenModal?.('pilot')}
                  className="text-orange-600 hover:text-orange-700 font-black inline-flex items-center gap-1 transition-colors"
                >
                  Society Pilot Program <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Solutions */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1128] mb-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-700">
              <li>
                <button
                  onClick={() => onOpenModal?.('resident_login')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Resident Mobile App
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal?.('society_login')}
                  className="hover:text-blue-600 transition-colors"
                >
                  RWA Command Center
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                  Courier Drop Integration
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-600 transition-colors">
                  Temperature-Controlled Pods
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> ISO 27001 Certified
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1128] mb-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Connect
            </h4>
            <div className="space-y-2.5 text-xs font-medium text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span>{BRAND.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-blue-600 transition-colors">
                  {BRAND.supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0 stroke-[2.5]" />
                <span>{BRAND.phone}</span>
              </div>
            </div>

            {/* Neo-brutalist Social Buttons */}
            <div className="pt-3 flex items-center gap-2.5">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A1128] flex items-center justify-center text-[#0A1128] transition-all"
                aria-label="X / Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A1128] flex items-center justify-center text-[#0A1128] transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0A1128] flex items-center justify-center text-[#0A1128] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} ParcelFlow Technologies Pvt. Ltd. Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for India's gated communities.
          </p>
          <div className="flex items-center gap-6">
            <a href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="/faq" className="hover:text-blue-600 transition-colors">Help Center</a>
            <a href="/download" className="hover:text-blue-600 transition-colors">Download App</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
