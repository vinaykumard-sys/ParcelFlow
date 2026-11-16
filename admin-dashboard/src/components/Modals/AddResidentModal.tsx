import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, User, Phone, Mail, Building } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddResidentModal: React.FC<AddResidentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [tower, setTower] = useState('Tower A');
  const [flatNumber, setFlatNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !flatNumber) return;

    adminService.addResident({
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      tower,
      flat_number: flatNumber,
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1128]/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#FEF9F3] border-3 border-[#0A1128] rounded-2xl shadow-[8px_8px_0px_#0A1128] p-5 sm:p-6 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] hover:bg-rose-100 transition-all text-[#0A1128]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-amber-400 border-2 border-[#0A1128] shadow-[2px_2px_0px_#0A1128] flex items-center justify-center text-[#0A1128]">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#0A1128]">Add Resident</h3>
            <p className="text-xs font-semibold text-slate-600">Register resident in society directory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram Malhotra"
              className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                Tower
              </label>
              <select
                value={tower}
                onChange={(e) => setTower(e.target.value)}
                className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
              >
                <option value="Tower A">Tower A</option>
                <option value="Tower B">Tower B</option>
                <option value="Tower C">Tower C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
                Flat Number
              </label>
              <input
                type="text"
                required
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                placeholder="e.g. A-301"
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
              Mobile Phone
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98450 12345"
              className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#0A1128] mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="resident@email.com"
              className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border-2 border-[#0A1128] bg-white text-[#0A1128] shadow-[2px_2px_0px_#0A1128] focus:outline-none"
            />
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
              className="flex-1 py-2.5 rounded-xl bg-amber-400 text-[#0A1128] font-extrabold text-xs border-2 border-[#0A1128] shadow-[3px_3px_0px_#0A1128] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0A1128] active:translate-y-0 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Resident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
