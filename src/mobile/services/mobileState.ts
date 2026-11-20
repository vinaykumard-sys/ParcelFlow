import { useState, useEffect } from 'react';
import type {
  MobileRole,
  MobileParcel,
  PickupSlot,
  ResidentUser,
  StaffMember,
  SocietyOption,
  SocietyReport,
  AuthenticatedUser,
} from '../types';
import { supabase } from '../../services/supabaseClient';

export const SOCIETIES: SocietyOption[] = [
  { id: 'soc-1', name: 'Greenview Heights', address: 'Hebbal, Outer Ring Rd', city: 'Bengaluru' },
  { id: 'soc-2', name: 'Lakeview Residency', address: 'Bellary Rd, Hebbal', city: 'Bengaluru' },
  { id: 'soc-3', name: 'Greenwood Heights', address: 'Doddaballapur Rd, Yelahanka', city: 'Bengaluru' },
  { id: 'soc-4', name: 'Skyline Apartments', address: 'Ganganagar, RT Nagar', city: 'Bengaluru' },
  { id: 'soc-5', name: 'Maple Residency', address: 'Agrahara, Jakkur', city: 'Bengaluru' },
];

// Production State: Empty defaults — real records are fetched and persisted live
export const INITIAL_PARCELS: MobileParcel[] = [];

export const INITIAL_SLOTS: PickupSlot[] = [
  { id: 's-1', timeWindow: '6:00 PM - 6:30 PM', dateLabel: 'Today', bookedCount: 0, capacity: 25, isAvailable: true },
  { id: 's-2', timeWindow: '6:30 PM - 7:00 PM', dateLabel: 'Today', bookedCount: 0, capacity: 25, isAvailable: true },
  { id: 's-3', timeWindow: '7:00 PM - 7:30 PM', dateLabel: 'Today', bookedCount: 0, capacity: 30, isAvailable: true },
  { id: 's-4', timeWindow: '8:00 PM - 8:30 PM', dateLabel: 'Today', bookedCount: 0, capacity: 35, isAvailable: true },
  { id: 's-5', timeWindow: '9:00 PM - 9:30 PM', dateLabel: 'Today', bookedCount: 0, capacity: 20, isAvailable: true },
];

export const INITIAL_RESIDENTS: ResidentUser[] = [];

export const INITIAL_STAFF: StaffMember[] = [];

interface MobileStoreState {
  currentRole: MobileRole;
  isAuthenticated: boolean;
  currentUser: AuthenticatedUser | null;
  selectedSociety: SocietyOption;
  parcels: MobileParcel[];
  slots: PickupSlot[];
  residents: ResidentUser[];
  staff: StaffMember[];
  report: SocietyReport;
  activeParcelId: string | null;
}

class MobileStateStore {
  private state: MobileStoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  /** De-duplicate an array by a string key extractor, keeping first occurrence */
  private dedup<T>(arr: T[], keyFn: (item: T) => string): T[] {
    const seen = new Set<string>();
    return arr.filter((item) => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private loadState(): MobileStoreState {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('parcelflow_mobile_state_v1');
      }
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('parcelflow_mobile_state_v3') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        // De-duplicate all arrays on load to fix any stale duplicates persisted in localStorage
        const rawParcels: MobileParcel[] = Array.isArray(parsed.parcels) ? parsed.parcels : [];
        const rawResidents: ResidentUser[] = Array.isArray(parsed.residents) ? parsed.residents : [];
        const rawStaff: StaffMember[] = Array.isArray(parsed.staff) ? parsed.staff : [];
        const rawSlots: PickupSlot[] = Array.isArray(parsed.slots) && parsed.slots.length > 0 ? parsed.slots : INITIAL_SLOTS;
        const user = parsed.currentUser || null;
        return {
          ...parsed,
          isAuthenticated: !!user && (parsed.isAuthenticated ?? false),
          currentUser: user,
          currentRole: user?.role || parsed.currentRole || 'RESIDENT',
          selectedSociety: parsed.selectedSociety || SOCIETIES[0],
          parcels: this.dedup(rawParcels, (p) => p.id),
          slots: this.dedup(rawSlots, (s) => s.id),
          residents: this.dedup(rawResidents, (r) => r.id),
          staff: this.dedup(rawStaff, (s) => s.id),
          report: parsed.report || {
            period: 'Daily',
            totalParcels: rawParcels.length,
            collected: rawParcels.filter((p) => p.status === 'COLLECTED').length,
            scheduled: rawParcels.filter((p) => p.status === 'SCHEDULED').length,
            pending: rawParcels.filter((p) => p.status === 'WAITING').length,
            collectionRate: rawParcels.length > 0 ? Math.round((rawParcels.filter((p) => p.status === 'COLLECTED').length / rawParcels.length) * 100) : 0,
            hourlyStats: [],
          },
        };
      }
    } catch {
      // ignore
    }

    return {
      currentRole: 'RESIDENT',
      isAuthenticated: false,
      currentUser: null,
      selectedSociety: SOCIETIES[0], // Greenview Heights
      parcels: [],
      slots: INITIAL_SLOTS,
      residents: [],
      staff: [],
      activeParcelId: null,
      report: {
        period: 'Daily',
        totalParcels: 0,
        collected: 0,
        scheduled: 0,
        pending: 0,
        collectionRate: 0,
        hourlyStats: [],
      },
    };
  }

  private saveState() {
    try {
      if (typeof localStorage !== 'undefined') {
        // Always de-duplicate before persisting to prevent stale duplicates accumulating
        const cleanState = {
          ...this.state,
          parcels: this.dedup(this.state.parcels, (p) => p.id),
          slots: this.dedup(this.state.slots, (s) => s.id),
          residents: this.dedup(this.state.residents, (r) => r.id),
          staff: this.dedup(this.state.staff, (s) => s.id),
        };
        this.state = cleanState;
        localStorage.setItem('parcelflow_mobile_state_v3', JSON.stringify(cleanState));
      }
    } catch {
      // ignore
    }
    this.notify();
  }

  logout() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('parcelflow_mobile_state_v3');
        localStorage.removeItem('parcelflow_mobile_state_v2');
        localStorage.removeItem('parcelflow_mobile_state_v1');
        localStorage.removeItem('parcelflow_auth_user');
        localStorage.removeItem('parcelflow_active_role');
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    } catch {
      // ignore
    }

    this.state.isAuthenticated = false;
    this.state.currentUser = null;
    this.state.currentRole = 'RESIDENT';
    this.state.parcels = [];
    this.saveState();
  }

  login(user: AuthenticatedUser) {
    this.state.isAuthenticated = true;
    this.state.currentUser = user;
    this.state.currentRole = user.role;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('parcelflow_auth_user', JSON.stringify(user));
        localStorage.setItem('parcelflow_active_role', user.role);
      }
    } catch {
      // ignore
    }
    this.saveState();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): MobileStoreState {
    return this.state;
  }

  setRole(role: MobileRole) {
    this.state.currentRole = role;
    if (this.state.currentUser) {
      this.state.currentUser.role = role;
    }
    this.saveState();
  }

  setSociety(society: SocietyOption) {
    this.state.selectedSociety = society;
    this.saveState();
  }

  setActiveParcelId(id: string | null) {
    this.state.activeParcelId = id;
    this.saveState();
  }

  addExpectedOrder(data: {
    trackingNumber?: string;
    carrier: 'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other';
    description: string;
    recipientName?: string;
    recipientPhone?: string;
    flat?: string;
    tower?: string;
  }): { parcel?: MobileParcel; isDuplicate: boolean; existingParcel?: MobileParcel } {
    const trackingNumber =
      data.trackingNumber?.trim().toUpperCase() ||
      `PF-${Math.floor(1000 + Math.random() * 9000)}-EXP`;

    // Strict uniqueness check: reject if tracking number already exists
    const existing = this.state.parcels.find(
      (p) => p.trackingNumber.toUpperCase() === trackingNumber
    );
    if (existing) {
      return { isDuplicate: true, existingParcel: existing };
    }

    const newParcel: MobileParcel = {
      id: 'p-exp-' + Date.now(),
      trackingNumber,
      carrier: data.carrier,
      description: data.description || 'Expected Inbound Order',
      recipientName: data.recipientName || this.state.currentUser?.name || 'Resident',
      recipientPhone: data.recipientPhone || this.state.currentUser?.phone || '+91 98000 00000',
      flat: data.flat || this.state.currentUser?.flatNumber || '',
      tower: data.tower || (this.state.currentUser?.flatNumber ? `Tower ${this.state.currentUser.flatNumber.charAt(0)}` : 'Main Tower'),
      storageLocation: 'Awaiting Hub Intake',
      status: 'WAITING',
      receivedAt: 'Expected Today',
      timeline: [
        { label: 'Order Registered in App', sublabel: `Expected delivery via ${data.carrier}`, time: 'Just now', completed: true, current: true },
        { label: 'Received at Society Hub', sublabel: 'Pending courier delivery at security desk', completed: false },
        { label: 'Pickup Scheduled', sublabel: 'Select 30-min window when stored', completed: false },
        { label: 'Handover Completed', sublabel: 'Single-use 6-digit OTP verification', completed: false },
      ],
    };

    this.state.parcels = [newParcel, ...this.state.parcels];
    this.state.report.totalParcels += 1;
    this.state.report.pending += 1;
    this.saveState();
    return { parcel: newParcel, isDuplicate: false };
  }

  schedulePickup(parcelId: string, slotId: string): { success: boolean; otp: string; error?: string } {
    const slot = this.state.slots.find((s) => s.id === slotId);

    if (slot && (!slot.isAvailable || slot.bookedCount >= slot.capacity)) {
      return { success: false, otp: '', error: 'FULL: Slot has reached maximum capacity.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const timeWindow = slot ? slot.timeWindow : '6:00 PM - 6:30 PM';

    this.state.parcels = this.state.parcels.map((p) => {
      if (p.id === parcelId) {
        return {
          ...p,
          status: 'SCHEDULED',
          scheduledSlot: `Today, ${timeWindow}`,
          otpCode: otp,
          timeline: [
            p.timeline[0] || { label: 'Picked by Courier', completed: true },
            p.timeline[1] || { label: 'Received at Society Hub', completed: true },
            { label: 'Pickup Scheduled', sublabel: `Today, ${timeWindow}`, time: 'Just now', completed: true, current: true },
            { label: 'Handover Completed', sublabel: 'Show 6-digit OTP or QR pass to staff', completed: false },
          ],
        };
      }
      return p;
    });

    if (slot) {
      slot.bookedCount = Math.min(slot.capacity, slot.bookedCount + 1);
      if (slot.bookedCount >= slot.capacity) {
        slot.isAvailable = false;
      }
    }

    this.saveState();
    return { success: true, otp };
  }

  receiveParcel(data: {
    trackingNumber: string;
    carrier: 'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other';
    recipientName: string;
    recipientPhone: string;
    flat: string;
    storageLocation: string;
    tower?: string;
  }): { parcel?: MobileParcel; isDuplicate: boolean; existingParcel?: MobileParcel } {
    const cleanTracking = data.trackingNumber.trim().toUpperCase();

    // Strict uniqueness check: reject if tracking number already exists
    const existing = this.state.parcels.find(
      (p) => p.trackingNumber.toUpperCase() === cleanTracking
    );
    if (existing) {
      return { isDuplicate: true, existingParcel: existing };
    }

    const newParcel: MobileParcel = {
      id: 'p-' + Date.now(),
      trackingNumber: cleanTracking,
      carrier: data.carrier,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      flat: data.flat,
      tower: data.tower || 'Tower B',
      storageLocation: data.storageLocation,
      status: 'WAITING',
      receivedAt: 'Just now',
      timeline: [
        { label: 'Picked by Courier', sublabel: `Dispatched via ${data.carrier}`, time: 'Today', completed: true },
        { label: 'Received at Society Hub', sublabel: `Stored in ${data.storageLocation}`, time: 'Just now', completed: true, current: true },
        { label: 'Pickup Scheduled', sublabel: 'Awaiting resident booking', completed: false },
        { label: 'Handover Completed', sublabel: 'Verify OTP or QR at hub counter', completed: false },
      ],
    };

    this.state.parcels = [newParcel, ...this.state.parcels];
    this.state.report.totalParcels += 1;
    this.state.report.pending += 1;
    this.saveState();
    return { parcel: newParcel, isDuplicate: false };
  }

  verifyHandover(otpOrCode: string): { success: boolean; parcel?: MobileParcel; message: string } {
    const clean = otpOrCode.trim().toUpperCase();
    const parcel = this.state.parcels.find((p) => {
      if (p.otpCode && p.otpCode === clean) return true;
      if (p.trackingNumber && p.trackingNumber.toUpperCase() === clean) return true;
      return false;
    });

    if (!parcel) {
      return { success: false, message: 'Invalid OTP or QR code. Please check and try again.' };
    }

    return this.completeHandover(parcel.id);
  }

  completeHandover(parcelId: string): { success: boolean; parcel?: MobileParcel; message: string } {
    let targetParcel: MobileParcel | undefined;

    this.state.parcels = this.state.parcels.map((p) => {
      if (p.id === parcelId) {
        targetParcel = {
          ...p,
          status: 'COLLECTED',
          collectedAt: 'Just now',
          timeline: p.timeline.map((t, idx) => ({
            ...t,
            completed: true,
            current: idx === 3,
            time: idx === 3 ? 'Just now' : t.time,
          })),
        };
        return targetParcel;
      }
      return p;
    });

    if (targetParcel) {
      this.state.report.collected += 1;
      this.state.report.pending = Math.max(0, this.state.report.pending - 1);
      this.saveState();
      return { success: true, parcel: targetParcel, message: 'Parcel handover verified successfully!' };
    }

    return { success: false, message: 'Parcel not found.' };
  }

  addResident(resident: Omit<ResidentUser, 'id' | 'status'>) {
    // Uniqueness check: reject if same flat + phone already exists
    const existing = this.state.residents.find(
      (r) =>
        r.phone === resident.phone ||
        (r.flat === resident.flat && r.email === resident.email)
    );
    if (existing) {
      return { resident: null, isDuplicate: true, existingResident: existing };
    }
    const newRes: ResidentUser = {
      ...resident,
      id: 'res-' + Date.now(),
      status: 'Active',
    };
    this.state.residents = [newRes, ...this.state.residents];
    this.saveState();
    return { resident: newRes, isDuplicate: false };
  }

  addStaff(staffMember: Omit<StaffMember, 'id' | 'status'>) {
    // Uniqueness check: reject if same badge number or phone already exists
    const existing = this.state.staff.find(
      (s) =>
        s.phone === staffMember.phone ||
        s.badgeNumber === staffMember.badgeNumber
    );
    if (existing) {
      return { staff: null, isDuplicate: true, existingStaff: existing };
    }
    const newStaff: StaffMember = {
      ...staffMember,
      id: 'stf-' + Date.now(),
      status: 'On Duty',
    };
    this.state.staff = [newStaff, ...this.state.staff];
    this.saveState();
    return { staff: newStaff, isDuplicate: false };
  }
}

export const mobileStore = new MobileStateStore();

export function useMobileStore() {
  const [state, setState] = useState(mobileStore.getState());

  useEffect(() => {
    return mobileStore.subscribe(() => {
      setState({ ...mobileStore.getState() });
    });
  }, []);

  return {
    ...state,
    setRole: (role: MobileRole) => mobileStore.setRole(role),
    setSociety: (society: SocietyOption) => mobileStore.setSociety(society),
    setActiveParcelId: (id: string | null) => mobileStore.setActiveParcelId(id),
    schedulePickup: (parcelId: string, slotId: string) => mobileStore.schedulePickup(parcelId, slotId),
    receiveParcel: (data: any) => mobileStore.receiveParcel(data),
    addExpectedOrder: (data: any) => mobileStore.addExpectedOrder(data),    verifyHandover: (otp: string) => mobileStore.verifyHandover(otp),
    completeHandover: (parcelId: string) => mobileStore.completeHandover(parcelId),
    addResident: (resident: any) => mobileStore.addResident(resident),
    addStaff: (staff: any) => mobileStore.addStaff(staff),
    login: (user: AuthenticatedUser) => mobileStore.login(user),
    logout: () => mobileStore.logout(),
  };
}
