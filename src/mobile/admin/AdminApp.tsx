import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Boxes,
  CreditCard,
  Compass,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { PlatformOwnerDashboard } from './PlatformOwnerDashboard';
import { AdminManageTab } from './AdminManageTab';
import { AdminLockersTab } from './AdminLockersTab';
import { AdminSubscriptionsTab } from './AdminSubscriptionsTab';
import { AdminOnboardingTab } from './AdminOnboardingTab';
import { AdminReportsTab } from './AdminReportsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { PlatformOwnerReleaseTab } from './PlatformOwnerReleaseTab';
import { PredictiveAnalyticsTab } from './PredictiveAnalyticsTab';
import { LiveHubMapTab } from './LiveHubMapTab';
import { IncidentManagementTab } from './IncidentManagementTab';
import { Forbidden403 } from '../components/Forbidden403';
import { useMobileStore } from '../services/mobileState';

interface AdminAppProps {
  onLogoutSession?: () => void;
  onReturnToPortal?: () => void;
}

export type AdminTab =
  | 'dashboard'
  | 'platform'
  | 'lockers'
  | 'manage'
  | 'subscriptions'
  | 'onboarding'
  | 'reports'
  | 'settings'
  | 'releases'
  | 'analytics'
  | 'hubmap'
  | 'incidents';

export const AdminApp: React.FC<AdminAppProps> = ({
  onLogoutSession,
  onReturnToPortal,
}) => {
  const { currentRole, isAuthenticated, logout } = useMobileStore();
  const isAdminRole =
    currentRole === 'ADMIN' ||
    currentRole === 'SOCIETY_ADMIN' ||
    currentRole === 'SUPER_ADMIN';

  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated && isAdminRole);
  const [activeTab, setActiveTab] = useState<AdminTab>(
    currentRole === 'SUPER_ADMIN' ? 'platform' : 'dashboard'
  );
  const [manageSubtab, setManageSubtab] = useState<'residents' | 'staff' | 'slots'>('residents');

  // Reactively sync login state with store auth and role changes
  useEffect(() => {
    setIsLoggedIn(isAuthenticated && isAdminRole);
  }, [isAuthenticated, isAdminRole]);

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

  const handleQuickAction = (action: 'scan' | 'receive' | 'add_resident' | 'lockers' | 'subscriptions' | 'onboarding' | 'analytics' | 'hubmap' | 'incidents') => {
    if (action === 'lockers') {
      setActiveTab('lockers');
    } else if (action === 'subscriptions') {
      setActiveTab('subscriptions');
    } else if (action === 'onboarding') {
      setActiveTab('onboarding');
    } else if (action === 'analytics') {
      setActiveTab('analytics');
    } else if (action === 'hubmap') {
      setActiveTab('hubmap');
    } else if (action === 'incidents') {
      setActiveTab('incidents');
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
            onOpenPlatformOwner={() => setActiveTab('platform')}
            onOpenAnalytics={() => setActiveTab('analytics')}
            onOpenHubMap={() => setActiveTab('hubmap')}
            onOpenIncidents={() => setActiveTab('incidents')}
            onQuickAction={handleQuickAction}
          />
        )}

        {activeTab === 'platform' && (
          <PlatformOwnerDashboard
            onBackToSocietyView={() => setActiveTab('dashboard')}
            onOpenSubscriptions={() => setActiveTab('subscriptions')}
            onOpenReleases={() => setActiveTab('releases')}
            onOpenSettings={() => setActiveTab('settings')}
            onSelectSociety={() => setActiveTab('dashboard')}
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
            onOpenReleases={() => setActiveTab('releases')}
            onOpenManage={(sub) => {
              if (sub) setManageSubtab(sub);
              setActiveTab('manage');
            }}
            onLogout={() => {
              logout();
              if (onLogoutSession) onLogoutSession();
              setIsLoggedIn(false);
            }}
          />
        )}

        {activeTab === 'releases' && (
          <PlatformOwnerReleaseTab onBack={() => setActiveTab('settings')} />
        )}

        {activeTab === 'analytics' && <PredictiveAnalyticsTab />}

        {activeTab === 'hubmap' && <LiveHubMapTab />}

        {activeTab === 'incidents' && <IncidentManagementTab />}
      </div>

      {/* Navigation tab bar: Dashboard, Parcels, Residents, More */}
      <div className="w-full bg-white border-t-2 border-[#060D1E] px-2 py-2 flex items-center justify-around z-30 shadow-[0px_-2px_10px_rgba(0,0,0,0.04)]">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'dashboard' || activeTab === 'platform'
              ? 'text-[#1E60F2] scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'dashboard' || activeTab === 'platform'
                ? 'bg-blue-50 border border-blue-200'
                : ''
            }`}
          >
            <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-black">Dashboard</span>
        </button>

        {/* Parcels (Lockers) */}
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
          <span className="text-[9px] font-black">Parcels</span>
        </button>

        {/* Residents (Manage Directory) */}
        <button
          onClick={() => {
            setManageSubtab('residents');
            setActiveTab('manage');
          }}
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
          <span className="text-[9px] font-black">Residents</span>
        </button>

        {/* More (Settings & Modules) */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'settings' ||
            activeTab === 'subscriptions' ||
            activeTab === 'onboarding' ||
            activeTab === 'reports' ||
            activeTab === 'releases'
              ? 'text-[#1E60F2] scale-105'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'settings' ||
              activeTab === 'subscriptions' ||
              activeTab === 'onboarding' ||
              activeTab === 'reports' ||
              activeTab === 'releases'
                ? 'bg-blue-50 border border-blue-200'
                : ''
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-black">More</span>
        </button>
      </div>
    </div>
  );
};
