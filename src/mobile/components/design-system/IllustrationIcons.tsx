import React from 'react';

// ============================================================================
// ILLUSTRATION ICONS FOR PARCELFLOW
// Crisp SVG vector illustrations matching reference specs:
// Colors: Cream (#FFF8EE), Navy (#0B1E3F), Blue (#2563EB), Yellow (#FFC72C),
// Green (#22C55E), Red (#EF4444), Clean White (#FFFFFF).
// ============================================================================

interface IllustrationProps {
  size?: number | string;
  className?: string;
}

/**
 * 1. Resident Parcel Stack Illustration
 * Cheerful stacked parcels with ribbons, labels, and celebratory sparkles.
 * Perfect for Resident Greeting & Welcome Card.
 */
export const ResidentParcelStackIllustration: React.FC<IllustrationProps> = ({
  size = 110,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible ${className}`}
      aria-label="Resident Parcel Stack"
    >
      <defs>
        {/* Soft Base Shadow */}
        <ellipse id="base-shadow" cx="70" cy="116" rx="54" ry="9" fill="#0B1E3F" fillOpacity="0.18" />
        
        {/* Box Gradients */}
        <linearGradient id="bottom-box-blue" x1="20" y1="74" x2="120" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>

        <linearGradient id="mid-box-yellow" x1="32" y1="46" x2="108" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFDE59" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <linearGradient id="top-box-green" x1="48" y1="20" x2="92" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <use href="#base-shadow" />

      {/* Sparkles / Confetti */}
      {/* Top Left Sparkle */}
      <path
        d="M26 22L28.5 28L34.5 30.5L28.5 33L26 39L23.5 33L17.5 30.5L23.5 28L26 22Z"
        fill="#FFC72C"
        stroke="#0B1E3F"
        strokeWidth="1.5"
      />
      {/* Top Right Star */}
      <path
        d="M116 16L118 21L123 23L118 25L116 30L114 25L109 23L114 21L116 16Z"
        fill="#2563EB"
        stroke="#0B1E3F"
        strokeWidth="1.5"
      />
      {/* Floating mini dot particles */}
      <circle cx="18" cy="46" r="3" fill="#22C55E" stroke="#0B1E3F" strokeWidth="1.2" />
      <circle cx="122" cy="44" r="3.5" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.2" />
      <circle cx="112" cy="70" r="2.5" fill="#EF4444" stroke="#0B1E3F" strokeWidth="1.2" />

      {/* --- BOTTOM PARCEL (Royal Blue) --- */}
      <g id="bottom-parcel">
        <rect
          x="22"
          y="74"
          width="96"
          height="38"
          rx="8"
          fill="url(#bottom-box-blue)"
          stroke="#0B1E3F"
          strokeWidth="3"
        />
        {/* White Strapping Tape */}
        <rect x="42" y="74" width="12" height="38" fill="#FFFFFF" stroke="#0B1E3F" strokeWidth="2.2" />
        {/* Barcode Shipping Sticker */}
        <rect x="74" y="82" width="34" height="20" rx="3" fill="#FFFFFF" stroke="#0B1E3F" strokeWidth="2" />
        <line x1="79" y1="87" x2="79" y2="97" stroke="#0B1E3F" strokeWidth="2" strokeLinecap="round" />
        <line x1="83" y1="87" x2="83" y2="97" stroke="#0B1E3F" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="87" y1="87" x2="87" y2="97" stroke="#0B1E3F" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="91" y1="87" x2="91" y2="97" stroke="#0B1E3F" strokeWidth="1" strokeLinecap="round" />
        <line x1="95" y1="87" x2="95" y2="97" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="99" y1="87" x2="99" y2="97" stroke="#0B1E3F" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* --- MIDDLE PARCEL (Amber Yellow) --- */}
      <g id="mid-parcel">
        <rect
          x="32"
          y="46"
          width="76"
          height="32"
          rx="6"
          fill="url(#mid-box-yellow)"
          stroke="#0B1E3F"
          strokeWidth="3"
        />
        {/* Sealing tape down middle */}
        <line x1="70" y1="46" x2="70" y2="78" stroke="#0B1E3F" strokeWidth="2.5" strokeDasharray="3 2" />
        {/* Parcel Priority Stamp / Fragile Glass Icon */}
        <rect x="40" y="52" width="16" height="18" rx="2" fill="#FEF9F3" stroke="#0B1E3F" strokeWidth="1.8" />
        <path d="M44 56H52L50 63H46L44 56Z" fill="#EF4444" stroke="#0B1E3F" strokeWidth="1.2" />
        <line x1="48" y1="63" x2="48" y2="67" stroke="#0B1E3F" strokeWidth="1.5" />
        <line x1="45" y1="67" x2="51" y2="67" stroke="#0B1E3F" strokeWidth="1.5" />
      </g>

      {/* --- TOP PARCEL (Mint Green Gift Box) --- */}
      <g id="top-parcel">
        <rect
          x="46"
          y="20"
          width="48"
          height="28"
          rx="5"
          fill="url(#top-box-green)"
          stroke="#0B1E3F"
          strokeWidth="3"
        />
        {/* Vertical Red Ribbon */}
        <rect x="66" y="20" width="8" height="28" fill="#EF4444" stroke="#0B1E3F" strokeWidth="2" />
        {/* Horizontal Red Ribbon */}
        <rect x="46" y="31" width="48" height="6" fill="#EF4444" stroke="#0B1E3F" strokeWidth="2" />
        
        {/* Cute Bow on Top */}
        <path
          d="M70 20C65 14 56 12 58 19C59 22 66 21 70 20Z"
          fill="#EF4444"
          stroke="#0B1E3F"
          strokeWidth="2"
        />
        <path
          d="M70 20C75 14 84 12 82 19C81 22 74 21 70 20Z"
          fill="#EF4444"
          stroke="#0B1E3F"
          strokeWidth="2"
        />
        <circle cx="70" cy="20" r="3.5" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="2" />
      </g>

      {/* Checkmark Tag badge hanging off side */}
      <g id="check-badge">
        <circle cx="106" cy="40" r="11" fill="#22C55E" stroke="#0B1E3F" strokeWidth="2.5" />
        <path
          d="M101 40L104.5 43.5L111 37"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

/**
 * 2. Security Officer Illustration
 * Friendly officer in uniform with smart tablet scanner scanning an incoming parcel.
 * Perfect for Security Hub / Staff Greeting.
 */
export const SecurityOfficerIllustration: React.FC<IllustrationProps> = ({
  size = 110,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible ${className}`}
      aria-label="Security Officer with Tablet"
    >
      <defs>
        <radialGradient id="sec-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B1E3F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0B1E3F" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="sec-scan-beam" x1="72" y1="78" x2="114" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="70" cy="118" rx="54" ry="8" fill="url(#sec-shadow)" />

      {/* Security Shield Badge Floating Top Right */}
      <path
        d="M115 14L128 20V32C128 40 122 47 115 50C108 47 102 40 102 32V20L115 14Z"
        fill="#22C55E"
        stroke="#0B1E3F"
        strokeWidth="2.5"
      />
      <path
        d="M110 32L113.5 35.5L120 28.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Officer Body */}
      {/* Torso / Uniform Jacket */}
      <path
        d="M28 116V86C28 78 35 72 44 72H68C77 72 84 78 84 86V116H28Z"
        fill="#0B1E3F"
        stroke="#0B1E3F"
        strokeWidth="3"
      />
      {/* Shirt Collar / Tie */}
      <polygon points="56,72 50,86 62,86" fill="#FFFFFF" stroke="#0B1E3F" strokeWidth="1.8" />
      <polygon points="54,86 58,86 60,98 56,102 52,98" fill="#1E60F2" stroke="#0B1E3F" strokeWidth="1.5" />
      {/* Gold Epaulets / Stars */}
      <rect x="30" y="76" width="10" height="5" rx="2" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.5" />
      <rect x="72" y="76" width="10" height="5" rx="2" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.5" />

      {/* Officer Head & Face */}
      <ellipse cx="56" cy="48" rx="16" ry="18" fill="#FFDFC4" stroke="#0B1E3F" strokeWidth="2.8" />
      {/* Eyes & Smile */}
      <circle cx="50" cy="48" r="2.2" fill="#0B1E3F" />
      <circle cx="62" cy="48" r="2.2" fill="#0B1E3F" />
      <path d="M52 56C54 58 58 58 60 56" stroke="#0B1E3F" strokeWidth="2" strokeLinecap="round" />
      {/* Cheerful blush */}
      <ellipse cx="46" cy="53" rx="2.5" ry="1.5" fill="#F87171" opacity="0.6" />
      <ellipse cx="66" cy="53" rx="2.5" ry="1.5" fill="#F87171" opacity="0.6" />

      {/* Officer Security Cap */}
      <path
        d="M38 38C38 27 46 22 56 22C66 22 74 27 74 38H38Z"
        fill="#0B1E3F"
        stroke="#0B1E3F"
        strokeWidth="2.8"
      />
      {/* Cap Visor */}
      <path
        d="M36 38C42 41 70 41 76 38H36Z"
        fill="#1E293B"
        stroke="#0B1E3F"
        strokeWidth="2"
      />
      {/* Gold Cap Badge */}
      <circle cx="56" cy="30" r="4.5" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.8" />
      <path d="M56 28L57 31H55L56 28Z" fill="#0B1E3F" />

      {/* Arms holding Smart Tablet */}
      <path
        d="M40 88L54 94"
        stroke="#FFDFC4"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M72 88L62 94"
        stroke="#FFDFC4"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Smart Scanner Tablet */}
      <rect
        x="50"
        y="82"
        width="26"
        height="32"
        rx="4"
        fill="#FFFFFF"
        stroke="#0B1E3F"
        strokeWidth="2.5"
        transform="rotate(-10 63 98)"
      />
      <rect
        x="53"
        y="85"
        width="20"
        height="22"
        rx="2.5"
        fill="#0284C7"
        stroke="#0B1E3F"
        strokeWidth="1.5"
        transform="rotate(-10 63 98)"
      />
      {/* Scanner Screen Content (Barcode & Green Check) */}
      <line x1="56" y1="91" x2="68" y2="89" stroke="#38BDF8" strokeWidth="2" />
      <line x1="57" y1="96" x2="67" y2="94" stroke="#4ADE80" strokeWidth="2.5" />

      {/* Laser Scan Cone Projection Beam */}
      <polygon
        points="70,96 116,92 120,116 74,106"
        fill="url(#sec-scan-beam)"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />

      {/* Incoming Delivery Parcel being scanned */}
      <rect
        x="98"
        y="96"
        width="30"
        height="20"
        rx="3"
        fill="#FFC72C"
        stroke="#0B1E3F"
        strokeWidth="2.4"
      />
      {/* Box tape */}
      <line x1="113" y1="96" x2="113" y2="116" stroke="#0B1E3F" strokeWidth="2" />
      {/* Box barcode */}
      <rect x="101" y="100" width="10" height="9" fill="#FFFFFF" stroke="#0B1E3F" strokeWidth="1" />
      <line x1="103" y1="102" x2="103" y2="107" stroke="#0B1E3F" strokeWidth="1" />
      <line x1="106" y1="102" x2="106" y2="107" stroke="#0B1E3F" strokeWidth="1.2" />
      <line x1="108" y1="102" x2="108" y2="107" stroke="#2563EB" strokeWidth="1" />
    </svg>
  );
};

/**
 * 3. Society Apartment Building Illustration
 * Modern residential towers with smart locker bay, gate arch, and green trees.
 * Perfect for Society Admin & Community Management.
 */
export const SocietyBuildingIllustration: React.FC<IllustrationProps> = ({
  size = 110,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible ${className}`}
      aria-label="Society Apartment Building"
    >
      <defs>
        <radialGradient id="soc-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B1E3F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0B1E3F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="70" cy="118" rx="58" ry="8" fill="url(#soc-shadow)" />

      {/* Sun in background */}
      <circle cx="112" cy="24" r="12" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="2" />
      {/* Friendly cloud */}
      <path
        d="M22 28C22 25 24.5 22 28 22C29 19 32 17 36 17C40 17 43 19 44 22C47 22 49 24.5 49 28C49 31 46.5 33 43 33H27C24 33 22 31 22 28Z"
        fill="#FFFFFF"
        stroke="#0B1E3F"
        strokeWidth="1.8"
      />

      {/* --- BACK TOWER (Right) --- */}
      <rect
        x="74"
        y="30"
        width="44"
        height="84"
        rx="4"
        fill="#E0E7FF"
        stroke="#0B1E3F"
        strokeWidth="2.8"
      />
      {/* Windows on back tower */}
      <rect x="80" y="38" width="8" height="10" rx="1.5" fill="#FFDE59" stroke="#0B1E3F" strokeWidth="1.2" />
      <rect x="94" y="38" width="8" height="10" rx="1.5" fill="#BAE6FD" stroke="#0B1E3F" strokeWidth="1.2" />
      <rect x="104" y="38" width="8" height="10" rx="1.5" fill="#FFDE59" stroke="#0B1E3F" strokeWidth="1.2" />
      <rect x="80" y="54" width="8" height="10" rx="1.5" fill="#BAE6FD" stroke="#0B1E3F" strokeWidth="1.2" />
      <rect x="94" y="54" width="8" height="10" rx="1.5" fill="#FFDE59" stroke="#0B1E3F" strokeWidth="1.2" />
      <rect x="104" y="54" width="8" height="10" rx="1.5" fill="#BAE6FD" stroke="#0B1E3F" strokeWidth="1.2" />
      <rect x="80" y="70" width="8" height="10" rx="1.5" fill="#FFDE59" stroke="#0B1E3F" strokeWidth="1.2" />
      <rect x="94" y="70" width="8" height="10" rx="1.5" fill="#BAE6FD" stroke="#0B1E3F" strokeWidth="1.2" />
      <rect x="104" y="70" width="8" height="10" rx="1.5" fill="#FFDE59" stroke="#0B1E3F" strokeWidth="1.2" />

      {/* --- MAIN TOWER (Left / Front) --- */}
      <rect
        x="24"
        y="42"
        width="56"
        height="72"
        rx="4"
        fill="#FFFFFF"
        stroke="#0B1E3F"
        strokeWidth="3"
      />
      {/* Balcony / Accent stripes */}
      <rect x="24" y="42" width="56" height="6" fill="#2563EB" stroke="#0B1E3F" strokeWidth="2" />
      {/* Windows Grid on Main Tower */}
      <rect x="32" y="54" width="10" height="10" rx="2" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.5" />
      <rect x="47" y="54" width="10" height="10" rx="2" fill="#BAE6FD" stroke="#0B1E3F" strokeWidth="1.5" />
      <rect x="62" y="54" width="10" height="10" rx="2" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.5" />

      <rect x="32" y="70" width="10" height="10" rx="2" fill="#BAE6FD" stroke="#0B1E3F" strokeWidth="1.5" />
      <rect x="47" y="70" width="10" height="10" rx="2" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.5" />
      <rect x="62" y="70" width="10" height="10" rx="2" fill="#BAE6FD" stroke="#0B1E3F" strokeWidth="1.5" />

      {/* Ground Floor ParcelFlow Smart Locker Hub */}
      <rect
        x="30"
        y="88"
        width="44"
        height="26"
        rx="3"
        fill="#FEF9F3"
        stroke="#0B1E3F"
        strokeWidth="2.2"
      />
      {/* Smart Locker Compartments Grid (Yellow Locker Bay) */}
      <rect x="34" y="93" width="9" height="9" rx="1.5" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.2" />
      <circle cx="41" cy="97" r="0.8" fill="#0B1E3F" />
      <rect x="46" y="93" width="9" height="9" rx="1.5" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.2" />
      <circle cx="53" cy="97" r="0.8" fill="#0B1E3F" />
      <rect x="58" y="93" width="9" height="9" rx="1.5" fill="#22C55E" stroke="#0B1E3F" strokeWidth="1.2" />
      <circle cx="65" cy="97" r="0.8" fill="#FFFFFF" />

      <rect x="34" y="104" width="9" height="8" rx="1.5" fill="#2563EB" stroke="#0B1E3F" strokeWidth="1.2" />
      <circle cx="41" cy="107" r="0.8" fill="#FFFFFF" />
      <rect x="46" y="104" width="9" height="8" rx="1.5" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.2" />
      <circle cx="53" cy="107" r="0.8" fill="#0B1E3F" />
      <rect x="58" y="104" width="9" height="8" rx="1.5" fill="#FFC72C" stroke="#0B1E3F" strokeWidth="1.2" />
      <circle cx="65" cy="107" r="0.8" fill="#0B1E3F" />

      {/* Green Landscape Bush/Tree (Left) */}
      <path
        d="M10 114C10 106 15 101 22 101C29 101 34 106 34 114H10Z"
        fill="#22C55E"
        stroke="#0B1E3F"
        strokeWidth="2.5"
      />

      {/* Gated Security Barrier (Right) */}
      <rect x="114" y="98" width="6" height="18" fill="#0B1E3F" stroke="#0B1E3F" strokeWidth="1.5" />
      <line x1="88" y1="104" x2="114" y2="104" stroke="#EF4444" strokeWidth="3" strokeDasharray="5 3" />
    </svg>
  );
};

/**
 * 4. Platform Admin Illustration
 * Platform owner / system architect with workstation laptop, cloud sync, and metrics graph.
 * Perfect for Platform Owner / Master Admin.
 */
export const PlatformAdminIllustration: React.FC<IllustrationProps> = ({
  size = 110,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible ${className}`}
      aria-label="Platform Admin with Laptop"
    >
      <defs>
        <radialGradient id="adm-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B1E3F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0B1E3F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="70" cy="118" rx="54" ry="8" fill="url(#adm-shadow)" />

      {/* Floating Cloud & Network Nodes (Top Left) */}
      <path
        d="M24 28C24 24 27 21 31 21C32.5 17 36 15 40 15C44 15 47.5 17 49 21C53 21 56 24 56 28C56 32 53 35 49 35H30C26.5 35 24 32 24 28Z"
        fill="#BAE6FD"
        stroke="#0B1E3F"
        strokeWidth="2.2"
      />
      <circle cx="40" cy="25" r="3" fill="#2563EB" stroke="#0B1E3F" strokeWidth="1.2" />

      {/* Floating Golden Crown / Key (Top Right) */}
      <path
        d="M104 22L110 32L118 20L126 32L132 22V36H104V22Z"
        fill="#FFC72C"
        stroke="#0B1E3F"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="118" cy="27" r="2.2" fill="#EF4444" stroke="#0B1E3F" strokeWidth="1" />

      {/* Desk Workstation */}
      <rect
        x="18"
        y="96"
        width="104"
        height="8"
        rx="3"
        fill="#0B1E3F"
        stroke="#0B1E3F"
        strokeWidth="2"
      />
      <rect x="26" y="104" width="8" height="14" fill="#64748B" stroke="#0B1E3F" strokeWidth="1.8" />
      <rect x="106" y="104" width="8" height="14" fill="#64748B" stroke="#0B1E3F" strokeWidth="1.8" />

      {/* Admin Character Behind Desk */}
      {/* Body */}
      <path
        d="M48 96V78C48 70 54 66 64 66H76C86 66 92 70 92 78V96H48Z"
        fill="#1E60F2"
        stroke="#0B1E3F"
        strokeWidth="3"
      />
      {/* Head */}
      <ellipse cx="70" cy="48" rx="14" ry="16" fill="#FFDFC4" stroke="#0B1E3F" strokeWidth="2.8" />
      {/* Modern Hair */}
      <path
        d="M56 46C56 36 62 32 72 32C80 32 84 36 84 42C80 40 74 41 72 44C68 44 64 45 56 46Z"
        fill="#0B1E3F"
        stroke="#0B1E3F"
        strokeWidth="2"
      />
      {/* Smart Glasses */}
      <rect x="60" y="44" width="8" height="6" rx="2" fill="none" stroke="#0B1E3F" strokeWidth="1.8" />
      <rect x="72" y="44" width="8" height="6" rx="2" fill="none" stroke="#0B1E3F" strokeWidth="1.8" />
      <line x1="68" y1="47" x2="72" y2="47" stroke="#0B1E3F" strokeWidth="1.8" />
      {/* Smile */}
      <path d="M66 54C68 56 72 56 74 54" stroke="#0B1E3F" strokeWidth="1.8" strokeLinecap="round" />

      {/* Laptop on Desk */}
      {/* Laptop Screen */}
      <rect
        x="52"
        y="72"
        width="36"
        height="24"
        rx="3"
        fill="#FFFFFF"
        stroke="#0B1E3F"
        strokeWidth="2.5"
      />
      {/* Screen Dashboard Display (Analytics charts) */}
      <rect x="55" y="75" width="30" height="18" rx="1.5" fill="#0B1E3F" />
      {/* Green Uptime Trendline */}
      <path
        d="M58 88L64 84L68 86L74 79L82 82"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="82" cy="82" r="1.5" fill="#FFC72C" />
      {/* Laptop Base */}
      <polygon
        points="46,96 94,96 98,100 42,100"
        fill="#94A3B8"
        stroke="#0B1E3F"
        strokeWidth="2"
      />

      {/* Coffee Mug on Desk */}
      <rect x="24" y="86" width="10" height="10" rx="2" fill="#EF4444" stroke="#0B1E3F" strokeWidth="1.8" />
      <path d="M34 88C36 88 37 90 37 92C37 94 36 96 34 96" stroke="#0B1E3F" strokeWidth="1.5" fill="none" />
      {/* Steam curl */}
      <path d="M28 82C29 80 27 78 28 76" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

// ============================================================================
// CARRIER LOGOS
// Authentic, high-precision SVG vector carrier logos:
// Amazon, Flipkart, Myntra, Gmail, BlueDart, DTDC, Delhivery
// ============================================================================

export interface CarrierLogoProps {
  size?: number | 'sm' | 'md' | 'lg';
  className?: string;
}

/** Amazon Carrier Logo */
export const AmazonCarrierLogo: React.FC<CarrierLogoProps> = ({ size = 'md', className = '' }) => {
  const getDims = () => {
    if (typeof size === 'number') return { w: size * 2.4, h: size };
    if (size === 'sm') return { w: 56, h: 22 };
    if (size === 'lg') return { w: 96, h: 36 };
    return { w: 76, h: 28 };
  };
  const { w, h } = getDims();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 90 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="Amazon Logo"
      >
        {/* "amazon" wordmark */}
        <text
          x="1"
          y="18"
          fill="#0B1E3F"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="-0.6px"
        >
          amazon
        </text>
        {/* Iconic Orange Smile Arrow from a to z */}
        <path
          d="M6 23C22 30 52 29 65 21"
          stroke="#FF9900"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Arrowhead */}
        <path
          d="M62 17.5L67 21L64 24.5"
          fill="#FF9900"
          stroke="#FF9900"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/** Flipkart Carrier Logo */
export const FlipkartCarrierLogo: React.FC<CarrierLogoProps> = ({ size = 'md', className = '' }) => {
  const getDims = () => {
    if (typeof size === 'number') return { w: size * 2.6, h: size };
    if (size === 'sm') return { w: 64, h: 22 };
    if (size === 'lg') return { w: 108, h: 36 };
    return { w: 84, h: 28 };
  };
  const { w, h } = getDims();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 100 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="Flipkart Logo"
      >
        {/* Flipkart Shopping Bag */}
        <rect x="2" y="5" width="22" height="23" rx="4" fill="#2874F0" stroke="#0B1E3F" strokeWidth="1.8" />
        {/* Handle */}
        <path d="M8 6V3C8 2 10 1 13 1C16 1 18 2 18 3V6" stroke="#FFC72C" strokeWidth="2.2" strokeLinecap="round" />
        {/* Italic 'f' with speed trail */}
        <text
          x="8.5"
          y="22"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="17"
        >
          f
        </text>
        {/* Wordmark */}
        <text
          x="28"
          y="21"
          fill="#2874F0"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="15.5"
          letterSpacing="-0.3px"
        >
          Flipkart
        </text>
      </svg>
    </div>
  );
};

/** Myntra Carrier Logo */
export const MyntraCarrierLogo: React.FC<CarrierLogoProps> = ({ size = 'md', className = '' }) => {
  const getDims = () => {
    if (typeof size === 'number') return { w: size * 2.5, h: size };
    if (size === 'sm') return { w: 60, h: 22 };
    if (size === 'lg') return { w: 104, h: 36 };
    return { w: 80, h: 28 };
  };
  const { w, h } = getDims();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 94 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="Myntra Logo"
      >
        {/* Signature overlapping colorful M symbol */}
        <g transform="translate(2, 4)">
          <path d="M0 22L7 4L14 18L7 22H0Z" fill="#FF3F6C" />
          <path d="M7 22L14 8L21 22H14L7 22Z" fill="#F4C430" />
          <path d="M14 22L21 4L28 22H21L14 22Z" fill="#FF905A" />
        </g>
        {/* Wordmark */}
        <text
          x="33"
          y="21"
          fill="#0B1E3F"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="15.5"
          letterSpacing="-0.3px"
        >
          Myntra
        </text>
      </svg>
    </div>
  );
};

/** Gmail / Google Workspace Delivery Logo */
export const GmailCarrierLogo: React.FC<CarrierLogoProps> = ({ size = 'md', className = '' }) => {
  const getDims = () => {
    if (typeof size === 'number') return { w: size * 2.3, h: size };
    if (size === 'sm') return { w: 56, h: 22 };
    if (size === 'lg') return { w: 96, h: 36 };
    return { w: 76, h: 28 };
  };
  const { w, h } = getDims();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 88 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="Gmail Logo"
      >
        {/* Official 4-Color Envelope M */}
        <g transform="translate(2, 6)">
          {/* Blue Left leg */}
          <path d="M0 3.5V17C0 18.5 1.2 19.5 2.5 19.5H5V7L0 3.5Z" fill="#4285F4" />
          {/* Green Right leg */}
          <path d="M22 3.5V17C22 18.5 20.8 19.5 19.5 19.5H17V7L22 3.5Z" fill="#34A853" />
          {/* Red Left Diagonal */}
          <path d="M5 7L11 11.5L17 7V2.5C17 0.8 15 -0.3 13.8 0.5L11 2.8L8.2 0.5C7 -0.3 5 0.8 5 2.5V7Z" fill="#EA4335" />
          {/* Yellow Corner Accent */}
          <path d="M17 2.5L22 6.5V3.5L19.5 1.5C18.2 0.5 17 1.4 17 2.5Z" fill="#FBBC04" />
          <path d="M5 2.5L0 6.5V3.5L2.5 1.5C3.8 0.5 5 1.4 5 2.5Z" fill="#C5221F" />
        </g>
        {/* Wordmark */}
        <text
          x="28"
          y="21"
          fill="#475569"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="15"
          letterSpacing="-0.2px"
        >
          Gmail
        </text>
      </svg>
    </div>
  );
};

/** BlueDart Carrier Logo */
export const BlueDartCarrierLogo: React.FC<CarrierLogoProps> = ({ size = 'md', className = '' }) => {
  const getDims = () => {
    if (typeof size === 'number') return { w: size * 2.8, h: size };
    if (size === 'sm') return { w: 68, h: 22 };
    if (size === 'lg') return { w: 116, h: 36 };
    return { w: 90, h: 28 };
  };
  const { w, h } = getDims();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 106 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="BlueDart Logo"
      >
        {/* Forward Red Speed Dart */}
        <polygon points="4,6 18,16 4,26 10,16" fill="#ED1C24" stroke="#0B1E3F" strokeWidth="1.2" />
        <polygon points="12,8 24,16 12,24 17,16" fill="#ED1C24" opacity="0.6" />
        {/* BlueDart Italic Bold Wordmark */}
        <text
          x="26"
          y="21"
          fill="#003399"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="14.5"
          letterSpacing="-0.3px"
        >
          BLUE DART
        </text>
      </svg>
    </div>
  );
};

/** DTDC Carrier Logo */
export const DTDCCarrierLogo: React.FC<CarrierLogoProps> = ({ size = 'md', className = '' }) => {
  const getDims = () => {
    if (typeof size === 'number') return { w: size * 2.4, h: size };
    if (size === 'sm') return { w: 58, h: 22 };
    if (size === 'lg') return { w: 100, h: 36 };
    return { w: 78, h: 28 };
  };
  const { w, h } = getDims();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 88 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="DTDC Logo"
      >
        {/* Globe / Runner Motif */}
        <circle cx="12" cy="16" r="10" fill="#0054A6" stroke="#0B1E3F" strokeWidth="1.5" />
        <path d="M6 14C10 9 18 10 20 18" stroke="#ED1C24" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="3.5" fill="#FFFFFF" />
        {/* DTDC Wordmark */}
        <text
          x="26"
          y="22"
          fill="#0054A6"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="16"
          letterSpacing="0.5px"
        >
          DTDC
        </text>
      </svg>
    </div>
  );
};

/** Delhivery Carrier Logo */
export const DelhiveryCarrierLogo: React.FC<CarrierLogoProps> = ({ size = 'md', className = '' }) => {
  const getDims = () => {
    if (typeof size === 'number') return { w: size * 2.8, h: size };
    if (size === 'sm') return { w: 70, h: 22 };
    if (size === 'lg') return { w: 120, h: 36 };
    return { w: 94, h: 28 };
  };
  const { w, h } = getDims();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 108 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
        aria-label="Delhivery Logo"
      >
        {/* Signature Red Diamond / Wing symbol */}
        <polygon points="8,5 15,16 8,27 1,16" fill="#E31E24" stroke="#0B1E3F" strokeWidth="1.2" />
        <polygon points="12,10 17,16 12,22 8,16" fill="#FFFFFF" />
        {/* Wordmark */}
        <text
          x="20"
          y="21"
          fill="#0B1E3F"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="14.5"
          letterSpacing="0.5px"
        >
          DELHIVERY
        </text>
      </svg>
    </div>
  );
};

/**
 * Universal Carrier Logo Dispatcher
 * Automatically displays the right crisp SVG logo given carrier name string.
 */
export const CarrierLogo: React.FC<{
  carrier?: string;
  size?: number | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ carrier = '', size = 'md', className = '' }) => {
  const clean = carrier.toLowerCase().trim();

  if (clean.includes('amazon')) return <AmazonCarrierLogo size={size} className={className} />;
  if (clean.includes('flipkart')) return <FlipkartCarrierLogo size={size} className={className} />;
  if (clean.includes('myntra')) return <MyntraCarrierLogo size={size} className={className} />;
  if (clean.includes('gmail') || clean.includes('google')) return <GmailCarrierLogo size={size} className={className} />;
  if (clean.includes('blue') || clean.includes('dart') || clean.includes('bluedart')) return <BlueDartCarrierLogo size={size} className={className} />;
  if (clean.includes('dtdc')) return <DTDCCarrierLogo size={size} className={className} />;
  if (clean.includes('delhivery')) return <DelhiveryCarrierLogo size={size} className={className} />;

  // Stylish fallback badge for other couriers (FedEx, Shadowfax, DHL, etc.)
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-300 text-[#0B1E3F] text-xs font-black ${className}`}>
      <span className="w-2 h-2 rounded-full bg-[#1E60F2]" />
      <span className="truncate max-w-[90px]">{carrier || 'Courier'}</span>
    </div>
  );
};
