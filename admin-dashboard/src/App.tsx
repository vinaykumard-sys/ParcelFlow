import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SplashScreen } from './screens/SplashScreen';
import { SocietySelectionScreen } from './screens/SocietySelectionScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { RoleSwitcherScreen } from './screens/RoleSwitcherScreen';
import { ResidentManagementScreen } from './screens/ResidentManagementScreen';
import { StaffManagementScreen } from './screens/StaffManagementScreen';
import { ParcelHubInventoryScreen } from './screens/ParcelHubInventoryScreen';
import { ParcelTrackingScreen } from './screens/ParcelTrackingScreen';
import { PickupSlotConfigScreen } from './screens/PickupSlotConfigScreen';
import { OtpScannerScreen } from './screens/OtpScannerScreen';
import { NotificationsCenterScreen } from './screens/NotificationsCenterScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { IssuesSupportScreen } from './screens/IssuesSupportScreen';
import { SettingsScreen } from './screens/SettingsScreen';

import { ScanOtpModal } from './components/Modals/ScanOtpModal';
import { ReceiveParcelModal } from './components/Modals/ReceiveParcelModal';
import { AddResidentModal } from './components/Modals/AddResidentModal';
import { BroadcastNotificationModal } from './components/Modals/BroadcastNotificationModal';

import { adminService } from './services/adminService';
import type { AdminTab } from './types';
import type { UserRole } from '../../backend/types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal open states
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const forceRefresh = () => setRefreshTrigger((prev) => prev + 1);

  // Sync with live Supabase database on mount & on society switches
  useEffect(() => {
    adminService.syncFromSupabase().then(() => {
      forceRefresh();
    });
  }, []);

  const handleRoleChanged = (role: UserRole) => {
    forceRefresh();
  };

  const handleSelectSociety = (societyId: string) => {
    adminService.syncFromSupabase().then(() => {
      forceRefresh();
    });
  };

  return (
    <div className="min-h-screen bg-[#FEF9F3] text-[#0A1128] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenScanModal={() => setIsScanModalOpen(true)}
        onOpenReceiveModal={() => setIsReceiveModalOpen(true)}
        onOpenAddResidentModal={() => setIsAddResidentModalOpen(true)}
        refreshTrigger={refreshTrigger}
      />

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          unreadCount={adminService.getNotifications().filter((n) => n.status !== 'READ').length}
          openIssuesCount={adminService.getIssues().filter((i) => i.status === 'OPEN').length}
        />

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'splash' && (
            <SplashScreen
              onNavigate={setCurrentTab}
              onOpenScanModal={() => setIsScanModalOpen(true)}
            />
          )}

          {currentTab === 'society-selection' && (
            <SocietySelectionScreen
              onSelectSociety={handleSelectSociety}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardScreen
              onNavigate={setCurrentTab}
              onOpenScanModal={() => setIsScanModalOpen(true)}
              onOpenReceiveModal={() => setIsReceiveModalOpen(true)}
              onOpenAddResidentModal={() => setIsAddResidentModalOpen(true)}
            />
          )}

          {currentTab === 'role-switcher' && (
            <RoleSwitcherScreen
              onRoleChanged={handleRoleChanged}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'residents' && (
            <ResidentManagementScreen
              onOpenAddModal={() => setIsAddResidentModalOpen(true)}
              refreshTrigger={refreshTrigger}
            />
          )}

          {currentTab === 'staff' && (
            <StaffManagementScreen refreshTrigger={refreshTrigger} />
          )}

          {currentTab === 'hub-inventory' && (
            <ParcelHubInventoryScreen
              onOpenScanModal={() => setIsScanModalOpen(true)}
              onOpenReceiveModal={() => setIsReceiveModalOpen(true)}
              refreshTrigger={refreshTrigger}
            />
          )}

          {currentTab === 'tracking' && (
            <ParcelTrackingScreen
              onOpenScanModal={() => setIsScanModalOpen(true)}
              refreshTrigger={refreshTrigger}
            />
          )}

          {currentTab === 'pickup-slots' && (
            <PickupSlotConfigScreen refreshTrigger={refreshTrigger} />
          )}

          {currentTab === 'otp-scanner' && (
            <OtpScannerScreen refreshTrigger={refreshTrigger} />
          )}

          {currentTab === 'notifications' && (
            <NotificationsCenterScreen
              onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
              refreshTrigger={refreshTrigger}
            />
          )}

          {currentTab === 'reports' && <ReportsScreen />}

          {currentTab === 'issues' && (
            <IssuesSupportScreen refreshTrigger={refreshTrigger} />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen refreshTrigger={refreshTrigger} />
          )}
        </main>
      </div>

      {/* Modals */}
      <ScanOtpModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onSuccess={() => {
          setIsScanModalOpen(false);
          forceRefresh();
        }}
      />

      <ReceiveParcelModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        onSuccess={() => {
          setIsReceiveModalOpen(false);
          forceRefresh();
        }}
      />

      <AddResidentModal
        isOpen={isAddResidentModalOpen}
        onClose={() => setIsAddResidentModalOpen(false)}
        onSuccess={() => {
          setIsAddResidentModalOpen(false);
          forceRefresh();
        }}
      />

      <BroadcastNotificationModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSuccess={() => {
          setIsBroadcastModalOpen(false);
          forceRefresh();
        }}
      />
    </div>
  );
};

export default App;
