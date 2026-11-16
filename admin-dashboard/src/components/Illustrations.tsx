import React from 'react';

export const PackageBoxIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shadow */}
    <ellipse cx="50" cy="85" rx="36" ry="7" fill="#0A1128" fillOpacity="0.25" />
    {/* Main Isometric Box */}
    <path d="M50 18 L86 36 L50 54 L14 36 Z" fill="#FBBF24" stroke="#0A1128" strokeWidth="3" strokeLinejoin="round" />
    <path d="M14 36 L50 54 L50 82 L14 64 Z" fill="#D97706" stroke="#0A1128" strokeWidth="3" strokeLinejoin="round" />
    <path d="M86 36 L50 54 L50 82 L86 64 Z" fill="#F59E0B" stroke="#0A1128" strokeWidth="3" strokeLinejoin="round" />
    {/* Blue Tape with Brand Accent */}
    <path d="M42 22 L58 30 L58 58 L42 50 Z" fill="#2563EB" stroke="#0A1128" strokeWidth="2.5" />
    <path d="M50 54 L50 82" stroke="#0A1128" strokeWidth="2.5" strokeDasharray="3 3" />
    {/* Express Star */}
    <circle cx="74" cy="30" r="4" fill="#10B981" stroke="#0A1128" strokeWidth="1.5" />
    {/* Speed Lines */}
    <path d="M8 28 L2 28" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 34 L0 34" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 40 L4 40" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const HubLockerIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="70" height="72" rx="8" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3.5" />
    {/* Top Header */}
    <rect x="22" y="22" width="56" height="12" rx="4" fill="#2563EB" stroke="#0A1128" strokeWidth="2.5" />
    <circle cx="28" cy="28" r="2.5" fill="#10B981" />
    <rect x="36" y="26" width="36" height="4" rx="2" fill="#FFFFFF" />
    {/* Lockers Grid */}
    <rect x="22" y="40" width="25" height="18" rx="4" fill="#FEF9F3" stroke="#0A1128" strokeWidth="2" />
    <circle cx="41" cy="49" r="2" fill="#F97316" />
    <rect x="53" y="40" width="25" height="18" rx="4" fill="#FEF9F3" stroke="#0A1128" strokeWidth="2" />
    <circle cx="72" cy="49" r="2" fill="#10B981" />
    
    <rect x="22" y="62" width="25" height="18" rx="4" fill="#FEF9F3" stroke="#0A1128" strokeWidth="2" />
    <circle cx="41" cy="71" r="2" fill="#10B981" />
    <rect x="53" y="62" width="25" height="18" rx="4" fill="#FEF9F3" stroke="#0A1128" strokeWidth="2" />
    <circle cx="72" cy="71" r="2" fill="#2563EB" />
  </svg>
);

export const SocietyBuildingIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Left Tower */}
    <rect x="14" y="26" width="32" height="64" rx="4" fill="#FEF9F3" stroke="#0A1128" strokeWidth="3" />
    <rect x="20" y="34" width="8" height="8" rx="2" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="32" y="34" width="8" height="8" rx="2" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="20" y="48" width="8" height="8" rx="2" fill="#2563EB" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="32" y="48" width="8" height="8" rx="2" fill="#FEF9F3" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="20" y="62" width="8" height="8" rx="2" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="32" y="62" width="8" height="8" rx="2" fill="#FBBF24" stroke="#0A1128" strokeWidth="1.5" />
    {/* Right Tower */}
    <rect x="52" y="15" width="36" height="75" rx="4" fill="#FFFFFF" stroke="#0A1128" strokeWidth="3" />
    <rect x="60" y="24" width="8" height="8" rx="2" fill="#10B981" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="74" y="24" width="8" height="8" rx="2" fill="#10B981" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="60" y="38" width="8" height="8" rx="2" fill="#FEF9F3" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="74" y="38" width="8" height="8" rx="2" fill="#F97316" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="60" y="52" width="8" height="8" rx="2" fill="#10B981" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="74" y="52" width="8" height="8" rx="2" fill="#10B981" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="60" y="66" width="8" height="8" rx="2" fill="#2563EB" stroke="#0A1128" strokeWidth="1.5" />
    <rect x="74" y="66" width="8" height="8" rx="2" fill="#FEF9F3" stroke="#0A1128" strokeWidth="1.5" />
    {/* Green Society Tree */}
    <circle cx="8" cy="80" r="7" fill="#10B981" stroke="#0A1128" strokeWidth="2" />
    <rect x="7" y="80" width="2" height="10" fill="#0A1128" />
  </svg>
);

export const SecureOtpShieldIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 12 L80 24 C80 54 50 82 50 82 C50 82 20 54 20 24 Z"
      fill="#10B981"
      stroke="#0A1128"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path
      d="M50 20 L72 30 C72 54 50 74 50 74 C50 74 28 54 28 30 Z"
      fill="#34D399"
      stroke="#0A1128"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Checkmark */}
    <path
      d="M38 46 L46 54 L62 38"
      stroke="#0A1128"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
