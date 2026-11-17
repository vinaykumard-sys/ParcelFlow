import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'green' | 'blue' | 'yellow' | 'purple' | 'gray' | 'red';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'blue', size = 'sm' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'green':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'yellow':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'red':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : 'px-3 py-1 text-sm font-bold';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${getStyles()} ${sizeClasses} tracking-tight`}
    >
      {label}
    </span>
  );
};
