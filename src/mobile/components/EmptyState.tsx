import React from 'react';
import { Package, Calendar, Clock, CheckCircle2, Shield, Users, CreditCard, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'package' | 'calendar' | 'clock' | 'history' | 'security' | 'users' | 'payment';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'package',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'calendar':
        return <Calendar className="w-10 h-10 text-blue-500" />;
      case 'clock':
        return <Clock className="w-10 h-10 text-amber-500" />;
      case 'history':
        return <CheckCircle2 className="w-10 h-10 text-emerald-500" />;
      case 'security':
        return <Shield className="w-10 h-10 text-indigo-500" />;
      case 'users':
        return <Users className="w-10 h-10 text-purple-500" />;
      case 'payment':
        return <CreditCard className="w-10 h-10 text-emerald-500" />;
      case 'package':
      default:
        return <Package className="w-10 h-10 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#060D1E] shadow-[3px_3px_0px_#060D1E] p-6 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-[#FEF9F3] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center mx-auto mb-3">
        {renderIcon()}
      </div>

      <h3 className="text-sm font-black text-[#060D1E] mb-1">{title}</h3>
      <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-[#1E60F2] hover:bg-blue-600 text-white rounded-xl text-xs font-black border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] active:scale-95 transition-all inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
