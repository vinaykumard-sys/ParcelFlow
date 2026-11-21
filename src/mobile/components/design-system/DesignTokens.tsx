import React from 'react';
import { Package, Clock, CheckCircle2, Shield, Search, Sparkles, Loader2 } from 'lucide-react';

// ============================================================================
// PARCELFLOW OFFICIAL DESIGN SYSTEM TOKENS & COMPONENTS
// Reference Specs:
// - Colors: Cream (#FFF8EE / #FEF9F3), Navy (#0B1E3F / #060D1E), Blue (#2563EB / #1E60F2),
//           Yellow/Amber (#FFC72C / #F59E0B), Green (#22C55E / #10B981), Red (#EF4444),
//           Clean White (#FFFFFF).
// - Typography: Bold high-contrast headings, modern sans-serif, clean hierarchy.
// - Cards: White background, rounded corners (rounded-2xl / rounded-3xl),
//          clean border (border-2 border-[#0B1E3F] or border-slate-200),
//          cartoon shadow shadow-[2px_2px_0px_#0B1E3F] or shadow-sm.
// ============================================================================

export const DESIGN_COLORS = {
  cream: '#FFF8EE',
  creamWarm: '#FEF9F3',
  navy: '#0B1E3F',
  navyDark: '#060D1E',
  blue: '#2563EB',
  blueVibrant: '#1E60F2',
  yellow: '#FFC72C',
  amber: '#F59E0B',
  green: '#22C55E',
  emerald: '#10B981',
  red: '#EF4444',
  white: '#FFFFFF',
} as const;

// ============================================================================
// 1. DesignCard
// White container with clean border, subtle shadow, rounded corners.
// ============================================================================

export interface DesignCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'flat' | 'cream' | 'accent-blue' | 'accent-yellow';
  rounded?: 'xl' | '2xl' | '3xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: 'navy' | 'slate' | 'none';
  onClick?: () => void;
  className?: string;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  children,
  variant = 'default',
  rounded = '2xl',
  padding = 'md',
  border = 'navy',
  onClick,
  className = '',
}) => {
  // Rounded corners
  const roundedClasses = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  }[rounded];

  // Padding
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2.5 sm:p-3',
    md: 'p-3.5 sm:p-4',
    lg: 'p-5 sm:p-6',
  }[padding];

  // Border & Shadow
  const getVariantStyles = () => {
    switch (variant) {
      case 'interactive':
        return 'bg-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#0B1E3F] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0B1E3F] cursor-pointer transition-all';
      case 'flat':
        return 'bg-white border border-slate-200/80 shadow-sm';
      case 'cream':
        return 'bg-[#FEF9F3] border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'accent-blue':
        return 'bg-blue-50/70 border-2 border-[#1E60F2] shadow-[2px_2px_0px_#0B1E3F]';
      case 'accent-yellow':
        return 'bg-amber-50/70 border-2 border-[#FFC72C] shadow-[2px_2px_0px_#0B1E3F]';
      case 'default':
      default:
        return border === 'slate'
          ? 'bg-white border border-slate-200 shadow-sm'
          : 'bg-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`select-none ${roundedClasses} ${paddingClasses} ${getVariantStyles()} ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================================================
// 2. StatCard
// KPI stat card with icon, number, label, and color accent.
// ============================================================================

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sublabel?: string;
  accent?: 'yellow' | 'blue' | 'green' | 'navy' | 'red' | 'purple';
  trend?: { value: string; isPositive?: boolean };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  sublabel,
  accent = 'yellow',
  trend,
  onClick,
  className = '',
}) => {
  const getAccentStyles = () => {
    switch (accent) {
      case 'blue':
        return {
          iconBg: 'bg-blue-50 text-[#1E60F2] border-blue-200',
          labelText: 'text-[#1E60F2]',
        };
      case 'green':
        return {
          iconBg: 'bg-emerald-50 text-[#10B981] border-emerald-200',
          labelText: 'text-emerald-700',
        };
      case 'navy':
        return {
          iconBg: 'bg-slate-100 text-[#0B1E3F] border-slate-300',
          labelText: 'text-[#0B1E3F]',
        };
      case 'red':
        return {
          iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
          labelText: 'text-rose-600',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
          labelText: 'text-purple-600',
        };
      case 'yellow':
      default:
        return {
          iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
          labelText: 'text-amber-700',
        };
    }
  };

  const styles = getAccentStyles();

  return (
    <div
      onClick={onClick}
      className={`bg-white p-3 sm:p-3.5 rounded-2xl border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex flex-col justify-between select-none transition-all ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Top Row: Label and Icon */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${styles.labelText}`}>
          {label}
        </span>
        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${styles.iconBg}`}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: 'w-3.5 h-3.5',
              })
            : icon}
        </div>
      </div>

      {/* Main KPI Value */}
      <div className="text-2xl sm:text-3xl font-black text-[#0B1E3F] leading-none tracking-tight">
        {value}
      </div>

      {/* Sublabel or Trend */}
      {(sublabel || trend) && (
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mt-1 pt-1 border-t border-slate-100">
          {sublabel && <span className="truncate">{sublabel}</span>}
          {trend && (
            <span
              className={`font-black ${
                trend.isPositive ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. FilterChip
// Clean pill button with active/inactive states.
// ============================================================================

export interface FilterChipProps {
  label: string;
  active: boolean;
  count?: number;
  icon?: React.ReactNode;
  onClick: () => void;
  color?: 'navy' | 'blue' | 'yellow' | 'green';
  size?: 'sm' | 'md';
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active,
  count,
  icon,
  onClick,
  color = 'navy',
  size = 'md',
  className = '',
}) => {
  const getActiveStyles = () => {
    switch (color) {
      case 'blue':
        return 'bg-[#1E60F2] text-white border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'yellow':
        return 'bg-[#FFC72C] text-[#0B1E3F] border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'green':
        return 'bg-[#22C55E] text-white border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'navy':
      default:
        return 'bg-[#0B1E3F] text-white border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
    }
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-[11px] gap-1'
      : 'px-3.5 py-1.5 text-xs gap-1.5';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 font-black transition-all inline-flex items-center shrink-0 select-none active:scale-95 ${sizeClasses} ${
        active
          ? getActiveStyles()
          : 'bg-white text-slate-700 hover:text-[#0B1E3F] border-slate-200 shadow-sm hover:border-[#0B1E3F]'
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            active
              ? color === 'yellow'
                ? 'bg-[#0B1E3F] text-white'
                : 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// ============================================================================
// 4. StatusBadge
// Clean badge with dot indicator (Expected, Received, Stored, Ready for Pickup, Collected).
// ============================================================================

export type ParcelFlowStatus =
  | 'Expected'
  | 'Received'
  | 'Stored'
  | 'Ready for Pickup'
  | 'Collected'
  | 'WAITING'
  | 'SCHEDULED'
  | 'READY_FOR_PICKUP'
  | 'IN_LOCKER'
  | 'COLLECTED'
  | string;

export interface StatusBadgeProps {
  status: ParcelFlowStatus;
  size?: 'sm' | 'md';
  pulse?: boolean;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  pulse,
  showDot = true,
  className = '',
}) => {
  // Normalize status key
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  const getBadgeConfig = () => {
    switch (normalized) {
      case 'EXPECTED':
      case 'SCHEDULED':
        return {
          label: 'Expected',
          dotBg: 'bg-[#F59E0B]',
          badgeBg: 'bg-amber-50 text-amber-900 border-amber-300',
          shouldPulse: false,
        };
      case 'RECEIVED':
      case 'WAITING':
      case 'AT_HUB':
        return {
          label: 'Received',
          dotBg: 'bg-[#1E60F2]',
          badgeBg: 'bg-blue-50 text-blue-900 border-blue-300',
          shouldPulse: false,
        };
      case 'STORED':
      case 'IN_LOCKER':
      case 'LOCKER':
        return {
          label: 'Stored',
          dotBg: 'bg-purple-500',
          badgeBg: 'bg-purple-50 text-purple-900 border-purple-300',
          shouldPulse: false,
        };
      case 'READY_FOR_PICKUP':
      case 'READY':
        return {
          label: 'Ready for Pickup',
          dotBg: 'bg-[#22C55E]',
          badgeBg: 'bg-emerald-50 text-emerald-950 border-emerald-400 font-black',
          shouldPulse: true,
        };
      case 'COLLECTED':
      case 'DELIVERED':
      case 'HANDED_OVER':
        return {
          label: 'Collected',
          dotBg: 'bg-slate-500',
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
          shouldPulse: false,
        };
      default:
        return {
          label: status,
          dotBg: 'bg-slate-400',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
          shouldPulse: false,
        };
    }
  };

  const config = getBadgeConfig();
  const isPulsing = pulse !== undefined ? pulse : config.shouldPulse;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px]'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-black tracking-tight select-none ${config.badgeBg} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {isPulsing && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotBg}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotBg}`} />
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
};

// ============================================================================
// 5. PrimaryButton
// High-contrast rounded button with colors (Navy, Blue, Yellow, Green, Red).
// ============================================================================

export interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'navy' | 'blue' | 'yellow' | 'green' | 'red' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  variant = 'navy',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return 'bg-[#1E60F2] hover:bg-blue-600 text-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'yellow':
        return 'bg-[#FFC72C] hover:bg-amber-400 text-[#0B1E3F] border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'green':
        return 'bg-[#22C55E] hover:bg-emerald-600 text-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'red':
        return 'bg-[#EF4444] hover:bg-rose-600 text-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'outline':
        return 'bg-white hover:bg-slate-50 text-[#0B1E3F] border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-100 text-[#0B1E3F] border-2 border-transparent';
      case 'navy':
      default:
        return 'bg-[#0B1E3F] hover:bg-[#060D1E] text-white border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-1.5 px-3 text-xs rounded-xl gap-1.5';
      case 'lg':
        return 'py-3.5 px-6 text-base rounded-2xl gap-2.5';
      case 'md':
      default:
        return 'py-2.5 px-4 text-sm rounded-xl gap-2';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-black tracking-tight inline-flex items-center justify-center transition-all select-none active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0px_0px_0px_#0B1E3F] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${
        fullWidth ? 'w-full' : ''
      } ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};

// ============================================================================
// 6. EmptyState
// Clean empty state with icon, message, and action.
// ============================================================================

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode | 'package' | 'search' | 'clock' | 'check' | 'security';
  illustration?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'package',
  illustration,
  actionLabel,
  onAction,
  className = '',
}) => {
  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;

    switch (icon) {
      case 'search':
        return <Search className="w-8 h-8 text-[#1E60F2]" />;
      case 'clock':
        return <Clock className="w-8 h-8 text-[#F59E0B]" />;
      case 'check':
        return <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />;
      case 'security':
        return <Shield className="w-8 h-8 text-[#0B1E3F]" />;
      case 'package':
      default:
        return <Package className="w-8 h-8 text-[#F59E0B]" />;
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border-2 border-[#0B1E3F] shadow-[3px_3px_0px_#0B1E3F] p-6 text-center select-none ${className}`}
    >
      {illustration ? (
        <div className="flex justify-center mb-4">{illustration}</div>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-[#FEF9F3] border-2 border-[#0B1E3F] shadow-[2px_2px_0px_#0B1E3F] flex items-center justify-center mx-auto mb-3.5">
          {renderIcon()}
        </div>
      )}

      <h3 className="text-base font-black text-[#0B1E3F] mb-1">{title}</h3>
      <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-4 flex justify-center">
          <PrimaryButton
            variant="blue"
            size="sm"
            onClick={onAction}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            {actionLabel}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
