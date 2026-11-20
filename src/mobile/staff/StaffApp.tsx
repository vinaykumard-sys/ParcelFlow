import React, { useState } from 'react';
import { Home, Package, ScanLine, History, User, QrCode, PlusCircle } from 'lucide-react';
import { MobileStatusBar } from '../components/MobileStatusBar';
import { StaffSplashAndLogin } from './StaffSplashAndLogin';
import { StaffDashboard } from './StaffDashboard';
import { StaffReceiveParcel } from './StaffReceiveParcel';
import { StaffAssignResident } from './StaffAssignResident';
import { StaffStorageLocation } from './StaffStorageLocation';
import { StaffHandoverVerification } from './StaffHandoverVerification';
import { StaffHandoverComplete } from './StaffHandoverComplete';
import { StaffParcelsTab } from './StaffParcelsTab';
import { StaffFindResidentTab } from './StaffFindResidentTab';
import { StaffHistoryTab } from './StaffHistoryTab';
import { StaffProfileTab } from './StaffProfileTab';
import type { ResidentUser, MobileParcel } from '../types';
import { useMobileStore } from '../services/mobileState';

interface StaffAppProps {
  onLogoutSession?: () => void;
}

export type StaffView =
  | 'login'
  | 'dashboard'
  | 'receive_step1'
  | 'receive_step2'
  | 'receive_step3'
  | 'handover_verify'
  | 'handover_complete'
  | 'find_resident';

export type StaffTab = 'home' | 'parcels' | 'scan' | 'history' | 'profile';

export const StaffApp: React.FC<StaffAppProps> = ({ onLogoutSession }) => {
  const { parcels, isAuthenticated, logout } = useMobileStore();
  const [view, setView] = useState<StaffView>(isAuthenticated ? 'dashboard' : 'login');
  const [activeTab, setActiveTab] = useState<StaffTab>('home');

  // Multi-step intake flow state
  const [inboundTracking, setInboundTracking] = useState('AMZ-99412-BLR');
  const [inboundCarrier, setInboundCarrier] = useState<
    'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other'
  >('Amazon');
  const [inboundResident, setInboundResident] = useState<ResidentUser | null>(null);

  // Handover flow state
  const [completedParcel, setCompletedParcel] = useState<MobileParcel>(parcels[0]);

  if (view === 'login') {
    return (
      <StaffSplashAndLogin
        onLoginSuccess={() => setView('dashboard')}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FEF9F3] text-[#060D1E] select-none relative overflow-hidden">
      <MobileStatusBar />

      <div className="flex-1 overflow-hidden relative">
        {view === 'dashboard' && (
          <>
            {activeTab === 'home' && (
              <StaffDashboard
                onReceiveParcel={() => setView('receive_step1')}
                onHandoverParcel={() => setView('handover_verify')}
                onOpenParcelList={() => setActiveTab('parcels')}
                onFindResident={() => setView('find_resident')}
              />
            )}
            {activeTab === 'parcels' && (
              <StaffParcelsTab
                onVerifyHandover={(p) => {
                  setCompletedParcel(p);
                  setView('handover_verify');
                }}
              />
            )}
            {activeTab === 'history' && <StaffHistoryTab />}
            {activeTab === 'profile' && (
              <StaffProfileTab
                onLogout={() => {
                  logout();
                  if (onLogoutSession) onLogoutSession();
                  setView('login');
                }}
              />
            )}
          </>
        )}

        {view === 'find_resident' && (
          <StaffFindResidentTab
            onBack={() => setView('dashboard')}
            onSelectResident={(res) => {
              setInboundResident(res);
              setView('dashboard');
            }}
          />
        )}

        {view === 'receive_step1' && (
          <StaffReceiveParcel
            onBack={() => setView('dashboard')}
            onNext={(data) => {
              setInboundTracking(data.trackingNumber);
              setInboundCarrier(data.carrier);
              setView('receive_step2');
            }}
          />
        )}

        {view === 'receive_step2' && (
          <StaffAssignResident
            trackingNumber={inboundTracking}
            carrier={inboundCarrier}
            onBack={() => setView('receive_step1')}
            onNext={(resident) => {
              setInboundResident(resident);
              setView('receive_step3');
            }}
          />
        )}

        {view === 'receive_step3' && inboundResident && (
          <StaffStorageLocation
            trackingNumber={inboundTracking}
            carrier={inboundCarrier}
            resident={inboundResident}
            onBack={() => setView('receive_step2')}
            onSaved={(parcel) => {
              setCompletedParcel(parcel);
              setView('dashboard');
              setActiveTab('parcels');
            }}
          />
        )}

        {view === 'handover_verify' && (
          <StaffHandoverVerification
            onBack={() => setView('dashboard')}
            onSuccess={(parcel) => {
              setCompletedParcel(parcel);
              setView('handover_complete');
            }}
          />
        )}

        {view === 'handover_complete' && (
          <StaffHandoverComplete
            parcel={completedParcel}
            onDone={() => setView('dashboard')}
          />
        )}
      </div>

      {/* Staff Bottom Nav (Home, Parcels, Scan, History, Profile) */}
      {view === 'dashboard' && (
        <div className="w-full bg-white border-t-2 border-[#060D1E] px-3 py-2 flex items-center justify-around z-30 shadow-[0px_-2px_10px_rgba(0,0,0,0.04)]">
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
            className={`flex flex-col items-center gap-1 transition-all ${
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
          </button>

          {/* Central Highlighted Scan Button */}
          <button
            onClick={() => setView('receive_step1')}
            className="flex flex-col items-center -mt-5 transition-transform active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#1E60F2] border-2 border-[#060D1E] shadow-[2px_2px_0px_#060D1E] flex items-center justify-center text-white">
              <ScanLine className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black text-[#060D1E] mt-1">Scan</span>
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
