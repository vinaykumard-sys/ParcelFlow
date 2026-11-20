import React, { useState } from 'react';
import { Home, Package, History, User, Sparkles } from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { ResidentSplash } from './ResidentSplash';
import { ResidentLogin } from './ResidentLogin';
import { ResidentDashboard } from './ResidentDashboard';
import { ResidentParcelDetails } from './ResidentParcelDetails';
import { ResidentSchedulePickup } from './ResidentSchedulePickup';
import { ResidentPickupCode } from './ResidentPickupCode';
import { ResidentCollectedSuccess } from './ResidentCollectedSuccess';
import { ResidentParcelsTab } from './ResidentParcelsTab';
import { ResidentHistoryTab } from './ResidentHistoryTab';
import { ResidentProfileTab } from './ResidentProfileTab';
import { useMobileStore } from '../services/mobileState';
import type { MobileParcel } from '../types';

interface ResidentAppProps {
  onLogoutSession?: () => void;
}

export type ResidentView =
  | 'splash'
  | 'login'
  | 'dashboard'
  | 'parcel_details'
  | 'schedule_pickup'
  | 'pickup_code'
  | 'collected_success';

export type ResidentTab = 'home' | 'parcels' | 'history' | 'profile';

export const ResidentApp: React.FC<ResidentAppProps> = ({ onLogoutSession }) => {
  const { parcels, completeHandover, logout } = useMobileStore();

  const [view, setView] = useState<ResidentView>('dashboard');
  const [activeTab, setActiveTab] = useState<ResidentTab>('home');
  const [selectedParcel, setSelectedParcel] = useState<MobileParcel>(parcels[0] || {
    id: 'p-default',
    trackingNumber: 'AMZ-99412-BLR',
    carrier: 'Amazon',
    description: 'Sony WH-1000XM5 Headphones',
    status: 'WAITING',
    recipientName: 'Vinay Kumar',
    recipientPhone: '+91 98450 11223',
    flat: 'B-402',
    tower: 'Tower B',
    storageLocation: 'Tower B, Rack B, Slot B17',
    receivedAt: 'Today, 2:30 PM',
    otpCode: '742916',
    timeline: [
      { label: 'Dispatched by Amazon', completed: true },
      { label: 'Received at Society Hub', sublabel: 'Rack B, Slot B17', completed: true, current: true },
      { label: 'Pickup Scheduled', completed: false },
      { label: 'Handover Completed', completed: false },
    ],
  });
  const [generatedOtp, setGeneratedOtp] = useState<string>('742916');

  const handleSelectParcel = (p: MobileParcel) => {
    setSelectedParcel(p);
    setView('parcel_details');
  };

  const handleScheduleSlot = (p: MobileParcel) => {
    setSelectedParcel(p);
    setView('schedule_pickup');
  };

  const handleShowPickupCode = (p: MobileParcel) => {
    setSelectedParcel(p);
    setGeneratedOtp(p.otpCode || '742916');
    setView('pickup_code');
  };

  const handleConfirmSlotSuccess = (p: MobileParcel, otp: string) => {
    setSelectedParcel(p);
    setGeneratedOtp(otp);
    setView('pickup_code');
  };

  const handleMarkCollected = () => {
    if (selectedParcel) {
      completeHandover(selectedParcel.id);
    }
    setView('collected_success');
  };

  // If on Splash or Login, render full-screen view
  if (view === 'splash') {
    return (
      <ResidentSplash
        onGetStarted={() => setView('login')}
      />
    );
  }

  if (view === 'login') {
    return (
      <ResidentLogin
        onLoginSuccess={() => setView('dashboard')}
        onBack={() => setView('splash')}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none relative overflow-hidden">
      <MobileStatusBar />

      {/* Main Screen Body */}
      <div className="flex-1 overflow-hidden relative">
        {view === 'dashboard' && (
          <>
            {activeTab === 'home' && (
              <ResidentDashboard
                onSelectParcel={handleSelectParcel}
                onScheduleSlot={handleScheduleSlot}
                onShowPickupCode={handleShowPickupCode}
                onOpenNotifications={() => setActiveTab('parcels')}
              />
            )}
            {activeTab === 'parcels' && (
              <ResidentParcelsTab
                onSelectParcel={handleSelectParcel}
                onScheduleSlot={handleScheduleSlot}
                onShowPickupCode={handleShowPickupCode}
              />
            )}
            {activeTab === 'history' && (
              <ResidentHistoryTab onSelectParcel={handleSelectParcel} />
            )}
            {activeTab === 'profile' && (
              <ResidentProfileTab
                onLogout={() => {
                  logout();
                  if (onLogoutSession) onLogoutSession();
                  setView('login');
                }}
              />
            )}
          </>
        )}

        {view === 'parcel_details' && (
          <ResidentParcelDetails
            parcel={selectedParcel}
            onBack={() => setView('dashboard')}
            onScheduleSlot={handleScheduleSlot}
            onShowPickupCode={handleShowPickupCode}
          />
        )}

        {view === 'schedule_pickup' && (
          <ResidentSchedulePickup
            parcel={selectedParcel}
            onBack={() => setView('dashboard')}
            onConfirmSuccess={handleConfirmSlotSuccess}
          />
        )}

        {view === 'pickup_code' && (
          <ResidentPickupCode
            parcel={selectedParcel}
            otpCode={generatedOtp}
            onBack={() => setView('dashboard')}
            onCollected={handleMarkCollected}
          />
        )}

        {view === 'collected_success' && (
          <ResidentCollectedSuccess
            parcel={selectedParcel}
            onDone={() => setView('dashboard')}
          />
        )}
      </div>

      {/* Resident Bottom Navigation Bar (Visible on dashboard tabs) */}
      {view === 'dashboard' && (
        <div className="w-full bg-white border-t-2 border-[#060D1E] px-4 py-2 flex items-center justify-around z-30 shadow-[0px_-2px_10px_rgba(0,0,0,0.04)]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`p-1 rounded-xl ${
                activeTab === 'home' ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('parcels')}
            className={`flex flex-col items-center gap-1 transition-all relative ${
              activeTab === 'parcels' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`p-1 rounded-xl ${
                activeTab === 'parcels' ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <Package className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black">Parcels</span>
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#1E60F2]" />
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'history' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`p-1 rounded-xl ${
                activeTab === 'history' ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <History className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black">History</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'profile' ? 'text-[#1E60F2] scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div
              className={`p-1 rounded-xl ${
                activeTab === 'profile' ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <User className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};
