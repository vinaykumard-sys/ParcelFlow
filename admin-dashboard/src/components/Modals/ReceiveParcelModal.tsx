import React, { useState } from 'react';
import { X, PackagePlus, CheckCircle2, Truck, Box, User, Home, MapPin } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface ReceiveParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReceiveParcelModal: React.FC<ReceiveParcelModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [courier, setCourier] = useState('Amazon Logistics');
  const [trackingNumber, setTrackingNumber] = useState(`PF-${Math.floor(1000 + Math.random() * 9000)}-IN`);
  const [residentName, setResidentName] = useState('Arjun Kumar');
  const [flatNumber, setFlatNumber] = useState('A-402');
  const [category, setCategory] = useState('ELECTRONICS');
  const [storageCode, setStorageCode] = useState('A3');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName.trim() || !flatNumber.trim() || !trackingNumber.trim()) {
      setErrorMsg('All fields marked with an asterisk are required.');
      return;
    }

    adminService.receiveParcel({
      tracking_number: trackingNumber.trim().toUpperCase(),
      courier_company: courier,
      resident_name: residentName.trim(),
      flat_number: flatNumber.trim().toUpperCase(),
      category,
      storage_code: storageCode,
    });

    setTrackingNumber(`PF-${Math.floor(1000 + Math.random() * 9000)}-IN`);
    setErrorMsg(null);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1128]/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#FEF9F3] border-3 border-[#0A1128] rounded-2xl shadow-[8px_8px_0px_#0A1128] p-5 sm:p-6 overflow-hidden relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-rose-100 transition-all text-[#0A1128]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-white">
            <PackagePlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#0A1128]">Receive & Register Parcel</h3>
            <p className="text-xs font-semibold text-slate-600">Society Intake Counter • Gate 2 Hub</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                Courier Partner
              </label>
              <div className="relative">
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
                >
                  <option value="Amazon Logistics">Amazon Logistics</option>
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="Delhivery">Delhivery</option>
                  <option value="Ekart Express">Ekart Express</option>
                  <option value="DTDC">DTDC</option>
                  <option value="Shadowfax">Shadowfax</option>
                  <option value="Blinkit">Blinkit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                Resident Name
              </label>
              <input
                type="text"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                required
                className="w-full text-xs font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                Flat / Unit #
              </label>
              <input
                type="text"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                placeholder="e.g. A-402, B-104"
                required
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
              >
                <option value="GENERAL">General Package</option>
                <option value="ELECTRONICS">Electronics (Fragile)</option>
                <option value="CLOTHING">Clothing & Apparel</option>
                <option value="PERISHABLE">Perishable Grocery</option>
                <option value="DOCUMENT">Important Document</option>
                <option value="MEDICINE">Medicine / Healthcare</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                Storage Rack & Shelf
              </label>
              <select
                value={storageCode}
                onChange={(e) => setStorageCode(e.target.value)}
                className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
              >
                <option value="A3">Rack A - Shelf A3 (Available)</option>
                <option value="A5">Rack A - Shelf A5 (Oversize)</option>
                <option value="B2">Rack B - Shelf B2 (Available)</option>
                <option value="B4">Rack B - Shelf B4 (Medium)</option>
                <option value="B6">Rack B - Shelf B6 (Oversize)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-amber-100 rounded-xl border-2 border-[#0A1128] text-xs font-medium text-slate-800">
            💡 On registration, ParcelFlow generates a unique 4-digit OTP and dispatches an instant WhatsApp and push notification to the resident.
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white text-[#0A1128] font-bold text-xs border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A1128] active:translate-y-0 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Intake</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
