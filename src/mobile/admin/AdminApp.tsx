import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Compass,
} from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminManageTab } from './AdminManageTab';
import { AdminLockersTab } from './AdminLockersTab';
import { AdminSubscriptionsTab } from './AdminSubscriptionsTab';
import { AdminOnboardingTab } from './AdminOnboardingTab';
import { AdminReportsTab } from './AdminReportsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { Forbidden403 } from '../components/Forbidden403';
import { useMobileStore } from '../services/mobileState';

interface AdminAppProps {
  onLogoutSession?: () => void;
  onReturnToPortal?: () => void;
}

export type AdminTab =
  | 'dashboard'
  | 'lockers'
  | 'manage'
  | 'subscriptions'
  | 'onboarding'
  | 'reports'
  | 'settings';

export const AdminApp: React.FC<AdminAppProps> = ({
  onLogoutSession,
  onReturnToPortal,
}) => {
  const { currentRole, isAuthenticated, logout } = useMobileStore();
  const isAdminRole =
    currentRole === 'ADMIN' ||
    currentRole === 'SOCIETY_ADMIN' ||
    currentRole === 'SUPER_ADMIN';

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [manageSubtab, setManageSubtab] = useState<'residents' | 'staff' | 'slots'>('residents');

  // Strict route protection: If authenticated user is NOT an admin, display 403 Forbidden!
  if (isAuthenticated && !isAdminRole) {
    return (
      <Forbidden403
        currentRole={currentRole}
        requiredRole="SOCIETY_ADMIN"
        attemptedPath="/admin"
        onReturnToPortal={onReturnToPortal}
        onLogout={() => {
          logout();
          if (onLogoutSession) onLogoutSession();
          setIsLoggedIn(false);
        }}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  const handleQuickAction = (action: 'scan' | 'receive' | 'add_resident' | 'lockers' | 'subscriptions' | 'onboarding') => {
    if (action === 'lockers') {
      setActiveTab('lockers');
    } else if (action === 'subscriptions') {
      setActiveTab('subscriptions');
    } else if (action === 'onboarding') {
      setActiveTab('onboarding');
    } else {
      setManageSubtab('residents');
      setActiveTab('manage');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none relative overflow-hidden">
      <MobileStatusBar />

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            onOpenManage={(sub) => {
              if (sub) setManageSubtab(sub);
              setActiveTab('manage');
            }}
            onOpenLockers={() => setActiveTab('lockers')}
            onOpenSubscriptions={() => setActiveTab('subscriptions')}
            onOpenOnboarding={() => setActiveTab('onboarding')}
            onOpenReports={() => setActiveTab('reports')}
            onQuickAction={handleQuickAction}
          />
        )}

        {activeTab === 'lockers' && <AdminLockersTab />}

        {activeTab === 'manage' && (
          <AdminManageTab initialSubtab={manageSubtab} />
        )}

        {activeTab === 'subscriptions' && <AdminSubscriptionsTab />}

        {activeTab === 'onboarding' && <AdminOnboardingTab />}

        {activeTab === 'reports' && <AdminReportsTab />}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            onOpenSubscriptions={() => setActiveTab('subscriptions')}
            onOpenOnboarding={() => setActiveTab('onboarding')}
            onOpenLockers={() => setActiveTab('lockers')}
            onLogout={() => {
              logout();
              if (onLogoutSession) onLogoutSession();
              setIsLoggedIn(false);
            }}
          />
        )}
      </div>

      {/* Admin Bottom Navigation Bar */}
      <div className="w-full bg-white border-t-2 border-[#060D1E] px-2 py-2 flex items-center justify-around z-30 shadow-[0px_-2px_10px_rgba(0,0,0,0.04)]">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'dashboard' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'dashboard' ? 'bg-blue-50 border border-blue-200' : ''
            }`}
          >
            <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-black">Home</span>
        </button>

        {/* Lockers */}
        <button
          onClick={() => setActiveTab('lockers')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'lockers' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'lockers' ? 'bg-blue-50 border border-blue-200' : ''
            }`}
          >
            <Boxes className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-black">Lockers</span>
        </button>

        {/* Directory (Manage) */}
        <button
          onClick={() => setActiveTab('manage')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'manage' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'manage' ? 'bg-blue-50 border border-blue-200' : ''
            }`}
          >
            <Users className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-black">Directory</span>
        </button>

        {/* Subscriptions */}
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'subscriptions' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'subscriptions' ? 'bg-blue-50 border border-blue-200' : ''
            }`}
          >
            <CreditCard className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-black">Plan</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'settings' || activeTab === 'onboarding' || activeTab === 'reports'
              ? 'text-[#1E60F2] scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'settings' || activeTab === 'onboarding' || activeTab === 'reports'
                ? 'bg-blue-50 border border-blue-200'
                : ''
            }`}
          >
            <Settings className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-black">Settings</span>
        </button>
      </div>
    </div>
  );
};
