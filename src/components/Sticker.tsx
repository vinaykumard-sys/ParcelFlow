import React from 'react';

export type StickerColor = 'blue' | 'orange' | 'yellow' | 'mint' | 'white' | 'purple' | 'pink' | 'red';
export type StickerRotation = 'left' | 'right' | 'slight-left' | 'slight-right' | 'wild' | 'none' | number;
export type StickerSize = 'sm' | 'md' | 'lg';

export interface StickerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  color?: StickerColor;
  rotate?: StickerRotation;
  size?: StickerSize;
  className?: string;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  interactive?: boolean;
}

const colorStyles: Record<StickerColor, string> = {
  blue: 'bg-blue-500 text-white border-[#0F172A]',
  orange: 'bg-orange-500 text-white border-[#0F172A]',
  yellow: 'bg-amber-400 text-[#0F172A] border-[#0F172A]',
  mint: 'bg-emerald-400 text-[#0F172A] border-[#0F172A]',
  white: 'bg-white text-[#0F172A] border-[#0F172A]',
  purple: 'bg-indigo-500 text-white border-[#0F172A]',
  pink: 'bg-pink-400 text-[#0F172A] border-[#0F172A]',
  red: 'bg-rose-500 text-white border-[#0F172A]',
};

const shadowStyles = {
  none: '',
  sm: 'shadow-[2px_2px_0px_#0F172A]',
  md: 'shadow-[3px_3px_0px_#0F172A]',
  lg: 'shadow-[5px_5px_0px_#0F172A]',
};

const sizeStyles: Record<StickerSize, string> = {
  sm: 'text-xs px-2.5 py-1 gap-1.5 font-bold rounded-lg',
  md: 'text-sm px-3.5 py-1.5 gap-2 font-black rounded-xl',
  lg: 'text-base px-5 py-2.5 gap-2.5 font-black rounded-2xl',
};

export const Sticker: React.FC<StickerProps> = ({
  children,
  icon,
  color = 'yellow',
  rotate = 'none',
  size = 'md',
  className = '',
  shadow = 'md',
  interactive = true,
  style,
  ...props
}) => {
  let rotationClass = '';
  let inlineRotateStyle = {};

  if (typeof rotate === 'number') {
    inlineRotateStyle = { transform: `rotate(${rotate}deg)` };
  } else {
    switch (rotate) {
      case 'left':
        rotationClass = '-rotate-2';
        break;
      case 'right':
        rotationClass = 'rotate-2';
        break;
      case 'slight-left':
        rotationClass = '-rotate-1';
        break;
      case 'slight-right':
        rotationClass = 'rotate-1';
        break;
      case 'wild':
        rotationClass = '-rotate-3.5';
        break;
      case 'none':
      default:
        rotationClass = 'rotate-0';
        break;
    }
  }

  return (
    <div
      className={`inline-flex items-center select-none border-2 sm:border-[2.5px] border-[#0F172A] transition-all duration-150 ${colorStyles[color]} ${shadowStyles[shadow]} ${sizeStyles[size]} ${rotationClass} ${
        interactive ? 'hover:-translate-y-0.5 hover:scale-[1.02] cursor-default' : ''
      } ${className}`}
      style={{ ...inlineRotateStyle, ...style }}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </div>
  );
};
