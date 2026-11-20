import React, { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Crown } from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminManageTab } from './AdminManageTab';
import { AdminReportsTab } from './AdminReportsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { Forbidden403 } from '../components/Forbidden403';
import { useMobileStore } from '../services/mobileState';

interface AdminAppProps {
  onLogoutSession?: () => void;
  onReturnToPortal?: () => void;
}

export type AdminTab = 'dashboard' | 'manage' | 'reports' | 'settings';

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

  const handleQuickAction = (_action: 'scan' | 'receive' | 'add_resident') => {
    setManageSubtab('residents');
    setActiveTab('manage');
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
            onOpenReports={() => setActiveTab('reports')}
            onQuickAction={handleQuickAction}
          />
        )}

        {activeTab === 'manage' && (
          <AdminManageTab initialSubtab={manageSubtab} />
        )}

        {activeTab === 'reports' && <AdminReportsTab />}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            onLogout={() => {
              logout();
              if (onLogoutSession) onLogoutSession();
              setIsLoggedIn(false);
            }}
          />
        )}
      </div>

      {/* Admin Bottom Nav: Dashboard, Manage, Reports, Settings */}
      <div className="w-full bg-white border-t-2 border-[#060D1E] px-4 py-2 flex items-center justify-around z-30 shadow-[0px_-2px_10px_rgba(0,0,0,0.04)]">
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
            <LayoutDashboard className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black">Dashboard</span>
        </button>

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
            <Users className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black">Manage</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'reports' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'reports' ? 'bg-blue-50 border border-blue-200' : ''
            }`}
          >
            <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black">Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'settings' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl ${
              activeTab === 'settings' ? 'bg-blue-50 border border-blue-200' : ''
            }`}
          >
            <Settings className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black">Settings</span>
        </button>
      </div>
    </div>
  );
};
