import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://czhxktgdrhdflmfmvggx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EjBHVFvH5qL7_WcZhQZmew_IeEtie5K';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type UserRole = 'RESIDENT' | 'STAFF' | 'ADMIN';

export interface MobileUserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  society_id: string;
  society_name: string;
  flat_number: string;
}

export interface MobileParcel {
  id: string;
  tracking_number: string;
  carrier: 'AMAZON' | 'FLIPKART' | 'BLUEDART' | 'DELHIVERY' | 'MYNTRA' | 'OTHER';
  status: 'EXPECTED' | 'RECEIVED_AT_HUB' | 'READY_FOR_PICKUP' | 'COLLECTED';
  recipient_name: string;
  recipient_flat: string;
  recipient_phone: string;
  storage_location: string;
  otp_code: string;
  scheduled_slot?: string;
  received_at: string;
  collected_at?: string;
  weight_kg?: number;
}

export interface PickupSlotOption {
  id: string;
  label: string;
  dateStr: string;
  timeWindow: string;
  availableCapacity: number;
  totalCapacity: number;
}

// Initial demo seed parcels
const INITIAL_PARCELS: MobileParcel[] = [
  {
    id: 'p-1',
    tracking_number: 'PF-8921-IN',
    carrier: 'AMAZON',
    status: 'READY_FOR_PICKUP',
    recipient_name: 'Vinay Kumar',
    recipient_flat: 'B-402',
    recipient_phone: '+91 98765 43210',
    storage_location: 'Rack A — Bin 12',
    otp_code: '839214',
    scheduled_slot: 'Today 17:00 - 18:00',
    received_at: '2026-11-16T09:30:00Z',
    weight_kg: 1.25,
  },
  {
    id: 'p-2',
    tracking_number: 'FK-77402-BLR',
    carrier: 'FLIPKART',
    status: 'READY_FOR_PICKUP',
    recipient_name: 'Vinay Kumar',
    recipient_flat: 'B-402',
    recipient_phone: '+91 98765 43210',
    storage_location: 'Rack B — Locker 04',
    otp_code: '419082',
    scheduled_slot: 'Today 17:00 - 18:00',
    received_at: '2026-11-16T11:15:00Z',
    weight_kg: 0.85,
  },
  {
    id: 'p-3',
    tracking_number: 'BD-33910-DEL',
    carrier: 'BLUEDART',
    status: 'EXPECTED',
    recipient_name: 'Vinay Kumar',
    recipient_flat: 'B-402',
    recipient_phone: '+91 98765 43210',
    storage_location: 'Awaiting Hub Intake',
    otp_code: '552910',
    received_at: '2026-11-16T12:00:00Z',
    weight_kg: 2.1,
  },
  {
    id: 'p-4',
    tracking_number: 'AMZN-99120-KA',
    carrier: 'AMAZON',
    status: 'COLLECTED',
    recipient_name: 'Vinay Kumar',
    recipient_flat: 'B-402',
    recipient_phone: '+91 98765 43210',
    storage_location: 'Handover Completed',
    otp_code: '128472',
    received_at: '2026-11-15T14:20:00Z',
    collected_at: '2026-11-15T18:45:00Z',
    weight_kg: 0.4,
  },
];

export const AVAILABLE_SLOTS: PickupSlotOption[] = [
  {
    id: 'slot-1',
    label: 'Today Evening Peak',
    dateStr: 'Today, Nov 16',
    timeWindow: '17:00 - 18:00',
    availableCapacity: 4,
    totalCapacity: 15,
  },
  {
    id: 'slot-2',
    label: 'Today Night Window',
    dateStr: 'Today, Nov 16',
    timeWindow: '18:30 - 19:30',
    availableCapacity: 8,
    totalCapacity: 15,
  },
  {
    id: 'slot-3',
    label: 'Today Late Locker Pickup',
    dateStr: 'Today, Nov 16',
    timeWindow: '20:00 - 21:00',
    availableCapacity: 12,
    totalCapacity: 15,
  },
  {
    id: 'slot-4',
    label: 'Tomorrow Morning',
    dateStr: 'Tomorrow, Nov 17',
    timeWindow: '09:00 - 10:00',
    availableCapacity: 14,
    totalCapacity: 15,
  },
  {
    id: 'slot-5',
    label: 'Tomorrow Evening Window',
    dateStr: 'Tomorrow, Nov 17',
    timeWindow: '17:30 - 18:30',
    availableCapacity: 10,
    totalCapacity: 15,
  },
];

class MobileStore {
  private parcels: MobileParcel[] = [];
  private activeRole: UserRole = 'RESIDENT';
  private currentUser: MobileUserProfile = {
    id: 'user-vinay-1',
    name: 'Vinay Kumar',
    email: 'vinaykumard45678@gmail.com',
    phone: '+91 98765 43210',
    role: 'ADMIN', // auto-admin for vinaykumard45678@gmail.com
    society_id: 'soc-lvr-1',
    society_name: 'Lakeview Residency (Bellandur, BLR)',
    flat_number: 'B-402',
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedParcels = localStorage.getItem('pf_mobile_parcels');
      if (savedParcels) {
        this.parcels = JSON.parse(savedParcels);
      } else {
        this.parcels = [...INITIAL_PARCELS];
        this.saveParcels();
      }

      const savedRole = localStorage.getItem('pf_mobile_role') as UserRole;
      if (savedRole) {
        this.activeRole = savedRole;
      }
    } catch {
      this.parcels = [...INITIAL_PARCELS];
    }
  }

  private saveParcels() {
    try {
      localStorage.setItem('pf_mobile_parcels', JSON.stringify(this.parcels));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  public getParcels(): MobileParcel[] {
    return this.parcels;
  }

  public getActiveRole(): UserRole {
    return this.activeRole;
  }

  public setActiveRole(role: UserRole) {
    this.activeRole = role;
    this.currentUser.role = role;
    localStorage.setItem('pf_mobile_role', role);
  }

  public getCurrentUser(): MobileUserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: Partial<MobileUserProfile>) {
    this.currentUser = { ...this.currentUser, ...user };
    if (this.currentUser.email === 'vinaykumard45678@gmail.com') {
      this.currentUser.role = 'ADMIN';
      this.activeRole = 'ADMIN';
    }
  }

  public scheduleSlot(parcelId: string, slotTime: string): boolean {
    const p = this.parcels.find((x) => x.id === parcelId || x.tracking_number === parcelId);
    if (p) {
      p.scheduled_slot = slotTime;
      this.saveParcels();
      return true;
    }
    return false;
  }

  public regenerateOtp(parcelId: string): string {
    const p = this.parcels.find((x) => x.id === parcelId || x.tracking_number === parcelId);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    if (p) {
      p.otp_code = newOtp;
      this.saveParcels();
    }
    return newOtp;
  }

  public verifyAndRelease(otpOrQr: string): { success: boolean; parcel?: MobileParcel; message: string } {
    const clean = otpOrQr.trim();
    // Check if QR formatted: e.g. PF://HANDOVER?pkg=...&otp=...
    let targetOtp = clean;
    let targetTracking = '';

    if (clean.includes('PF://') || clean.includes('otp=')) {
      try {
        const urlParams = new URLSearchParams(clean.split('?')[1] || clean);
        targetOtp = urlParams.get('otp') || targetOtp;
        targetTracking = urlParams.get('pkg') || '';
      } catch {}
    }

    const match = this.parcels.find((p) => {
      if (targetTracking && p.tracking_number === targetTracking) {
        return p.otp_code === targetOtp;
      }
      return p.otp_code === targetOtp || p.tracking_number.toUpperCase() === clean.toUpperCase();
    });

    if (!match) {
      return {
        success: false,
        message: 'Invalid OTP or QR code. No active parcel matches verification.',
      };
    }

    if (match.status === 'COLLECTED') {
      return {
        success: false,
        parcel: match,
        message: `Parcel ${match.tracking_number} was already collected at ${match.collected_at || 'earlier today'}.`,
      };
    }

    match.status = 'COLLECTED';
    match.collected_at = new Date().toISOString();
    this.saveParcels();

    return {
      success: true,
      parcel: match,
      message: `Verified successfully! Parcel ${match.tracking_number} released to Flat ${match.recipient_flat} (${match.recipient_name}).`,
    };
  }

  public intakeBarcode(barcode: string): { success: boolean; parcel?: MobileParcel; isNew: boolean } {
    const clean = barcode.trim().toUpperCase();
    const existing = this.parcels.find((p) => p.tracking_number.toUpperCase() === clean);
    if (existing) {
      return { success: true, parcel: existing, isNew: false };
    }

    // Auto-create newly intake package
    const newP: MobileParcel = {
      id: `p-${Date.now()}`,
      tracking_number: clean,
      carrier: clean.startsWith('AMZN') ? 'AMAZON' : clean.startsWith('FK') ? 'FLIPKART' : 'BLUEDART',
      status: 'READY_FOR_PICKUP',
      recipient_name: 'Resident Unit B-402',
      recipient_flat: 'B-402',
      recipient_phone: '+91 98765 43210',
      storage_location: `Rack ${String.fromCharCode(65 + Math.floor(Math.random() * 3))} — Bin ${Math.floor(10 + Math.random() * 30)}`,
      otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
      received_at: new Date().toISOString(),
      weight_kg: 1.1,
    };
    this.parcels.unshift(newP);
    this.saveParcels();
    return { success: true, parcel: newP, isNew: true };
  }
}

export const mobileStore = new MobileStore();
