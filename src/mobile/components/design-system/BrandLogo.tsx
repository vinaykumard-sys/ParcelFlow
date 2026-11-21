import React from 'react';

export interface BrandLogoProps {
  /** Size variant: 'sm' (header), 'md' (standard), 'lg' (hero/splash), 'xl' (display) or number in pixels */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Whether to show the "ParcelFlow" text beside the box */
  showText?: boolean;
  /** Optional subtitle or badge below the brand name (e.g. 'SMART HUB', 'RESIDENT PORTAL') */
  subtitle?: string;
  /** Color theme variant */
  variant?: 'default' | 'monochrome' | 'dark' | 'light';
  /** Optional click handler */
  onClick?: () => void;
  /** Custom class names */
  className?: string;
}

/**
 * 3D Isometric Yellow Parcel Box SVG Icon with high-contrast black outline,
 * authentic tape seams, label sticker, and speed lines.
 */
export const ParcelBoxIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 overflow-visible transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="ParcelFlow 3D Box"
    >
      <defs>
        {/* Soft shadow under the box */}
        <radialGradient id="pf-box-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B1E3F" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0B1E3F" stopOpacity="0" />
        </radialGradient>

        {/* Top Face Gradients */}
        <linearGradient id="pf-top-face" x1="50" y1="12" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#FFC72C" />
        </linearGradient>

        {/* Left Face Gradients */}
        <linearGradient id="pf-left-face" x1="14" y1="46" x2="50" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#E69500" />
        </linearGradient>

        {/* Right Face Gradients */}
        <linearGradient id="pf-right-face" x1="50" y1="46" x2="86" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Tape Gradient */}
        <linearGradient id="pf-tape-grad" x1="50" y1="16" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1E3F" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="50" cy="85" rx="38" ry="8" fill="url(#pf-box-shadow)" />

      {/* Speed Trails / Motion Accents (left-behind energetic pills) */}
      <path
        d="M6 34C6 32.3431 7.34315 31 9 31H18C19.6569 31 21 32.3431 21 34C21 35.6569 19.6569 37 18 37H9C7.34315 37 6 35.6569 6 34Z"
        fill="#2563EB"
        stroke="#0B1E3F"
        strokeWidth="1.75"
      />
      <path
        d="M2 44C2 42.6193 3.11929 41.5 4.5 41.5H13.5C14.8807 41.5 16 42.6193 16 44C16 45.3807 14.8807 46.5 13.5 46.5H4.5C3.11929 46.5 2 45.3807 2 44Z"
        fill="#FFC72C"
        stroke="#0B1E3F"
        strokeWidth="1.75"
      />

      {/* 3D Box Geometry */}
      {/* 1. Left Face */}
      <polygon
        points="14,35 50,52 50,84 14,67"
        fill="url(#pf-left-face)"
        stroke="#0B1E3F"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* 2. Right Face */}
      <polygon
        points="50,52 86,35 86,67 50,84"
        fill="url(#pf-right-face)"
        stroke="#0B1E3F"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* 3. Top Face */}
      <polygon
        points="50,16 86,35 50,52 14,35"
        fill="url(#pf-top-face)"
        stroke="#0B1E3F"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Packaging Sealing Tape (Across Top Center) */}
      <polygon
        points="43,19.5 57,26.5 57,48.5 43,41.5"
        fill="url(#pf-tape-grad)"
        stroke="#0B1E3F"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Tape fold flap down front-right seam */}
      <polygon
        points="43,41.5 50,45 50,57 43,53"
        fill="#0B1E3F"
        stroke="#0B1E3F"
        strokeWidth="1.5"
      />

      {/* White Shipping / Barcode Label on Left Face */}
      <polygon
        points="22,46 38,53.5 38,65 22,57.5"
        fill="#FFFFFF"
        stroke="#0B1E3F"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Barcode Lines on Label */}
      <line x1="26" y1="50" x2="26" y2="58" stroke="#0B1E3F" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="29" y1="51.5" x2="29" y2="59.5" stroke="#0B1E3F" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="53" x2="32" y2="61" stroke="#0B1E3F" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="35" y1="54.5" x2="35" y2="62.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />

      {/* "UP" Arrows / Fragile Stamp on Right Face */}
      <path
        d="M66 52L72 49L72 61"
        stroke="#0B1E3F"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M74 48L80 45L80 57"
        stroke="#0B1E3F"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle highlight sheen on top edge */}
      <line
        x1="50"
        y1="19"
        x2="82"
        y2="36"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
    </svg>
  );
};

/**
 * Official ParcelFlow Brand Logo Component
 * Combines the 3D isometric yellow parcel box with bold high-contrast typography.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  subtitle,
  variant = 'default',
  onClick,
  className = '',
}) => {
  // Dimension calculation
  const getBoxSize = (): number => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm':
        return 30;
      case 'lg':
        return 46;
      case 'xl':
        return 58;
      case 'md':
      default:
        return 36;
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          title: 'text-base font-black tracking-tight leading-none',
          sub: 'text-[9px] font-black tracking-widest uppercase mt-0.5',
          gap: 'gap-2',
        };
      case 'lg':
        return {
          title: 'text-2xl font-black tracking-tight leading-none',
          sub: 'text-xs font-black tracking-wider uppercase mt-1',
          gap: 'gap-3',
        };
      case 'xl':
        return {
          title: 'text-3xl sm:text-4xl font-black tracking-tight leading-none',
          sub: 'text-xs sm:text-sm font-black tracking-widest uppercase mt-1.5',
          gap: 'gap-3.5',
        };
      case 'md':
      default:
        return {
          title: 'text-lg font-black tracking-tight leading-none',
          sub: 'text-[10px] font-black tracking-wider uppercase mt-0.5',
          gap: 'gap-2.5',
        };
    }
  };

  const boxSize = getBoxSize();
  const textStyles = getTextSizeClasses();

  const textColorParcel =
    variant === 'dark' || variant === 'light'
      ? 'text-white'
      : 'text-[#0B1E3F]';

  const textColorFlow =
    variant === 'monochrome'
      ? textColorParcel
      : 'text-[#2563EB]';

  const subtitleColor =
    variant === 'dark' || variant === 'light'
      ? 'text-slate-300'
      : 'text-slate-500';

  const content = (
    <div
      className={`inline-flex items-center select-none ${textStyles.gap} ${className} ${
        onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''
      }`}
      onClick={onClick}
    >
      {/* 3D Isometric Yellow Parcel Box */}
      <ParcelBoxIcon size={boxSize} />

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <span className={textColorParcel}>Parcel</span>
            <span className={textColorFlow}>Flow</span>
          </div>

          {subtitle && (
            <span className={`${textStyles.sub} ${subtitleColor}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return content;
};

export default BrandLogo;
