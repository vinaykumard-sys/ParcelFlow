import React from 'react';

interface StickerProps {
  children: React.ReactNode;
  color?: 'mint' | 'yellow' | 'blue' | 'purple' | 'orange' | 'white';
  rotate?: 'slight-left' | 'slight-right' | 'left' | 'right' | 'none';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Sticker: React.FC<StickerProps> = ({
  children,
  color = 'yellow',
  rotate = 'none',
  size = 'sm',
  className = '',
}) => {
  const colorStyles = {
    yellow: 'bg-amber-300 text-[#0A1128] border-[#0A1128]',
    mint: 'bg-emerald-300 text-[#0A1128] border-[#0A1128]',
    blue: 'bg-blue-600 text-white border-[#0A1128]',
    purple: 'bg-purple-300 text-[#0A1128] border-[#0A1128]',
    orange: 'bg-orange-400 text-white border-[#0A1128]',
    white: 'bg-white text-[#0A1128] border-[#0A1128]',
  };

  const rotateStyles = {
    'slight-left': '-rotate-1',
    'slight-right': 'rotate-1',
    'left': '-rotate-3',
    'right': 'rotate-3',
    'none': 'rotate-0',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 font-bold',
    sm: 'text-xs px-2.5 py-1 font-black',
    md: 'text-sm px-3.5 py-1.5 font-black',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border-2 shadow-[2px_2px_0px_#0A1128] uppercase tracking-wider select-none transform transition-transform duration-100 ${colorStyles[color]} ${rotateStyles[rotate]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
