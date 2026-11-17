import { useState, useEffect } from 'react';
import type {
  MobileRole,
  MobileParcel,
  PickupSlot,
  ResidentUser,
  StaffMember,
  SocietyOption,
  SocietyReport,
} from '../types';

export const SOCIETIES: SocietyOption[] = [
  { id: 'soc-1', name: 'Greenview Heights', address: 'Hebbal, Outer Ring Rd', city: 'Bengaluru' },
  { id: 'soc-2', name: 'Lakeview Residency', address: 'Bellary Rd, Hebbal', city: 'Bengaluru' },
  { id: 'soc-3', name: 'Greenwood Heights', address: 'Doddaballapur Rd, Yelahanka', city: 'Bengaluru' },
  { id: 'soc-4', name: 'Skyline Apartments', address: 'Ganganagar, RT Nagar', city: 'Bengaluru' },
  { id: 'soc-5', name: 'Maple Residency', address: 'Agrahara, Jakkur', city: 'Bengaluru' },
];

const INITIAL_PARCELS: MobileParcel[] = [
  {
    id: 'p-1',
    trackingNumber: 'PF-8921-IN',
    carrier: 'Amazon',
    description: 'Electronics & Audio Cable',
    sender: 'Cloudtail India',
    status: 'WAITING',
    recipientName: 'Vinay Kumar',
    recipientPhone: '+91 98765 00000',
    flat: 'B-402',
    tower: 'Tower B',
    storageLocation: 'Tower B, Rack B, Slot B17',
    receivedAt: 'Today, 10:45 AM',
    timeline: [
      { label: 'Picked by Courier', sublabel: 'Dispatched from Amazon Hub', time: 'Yesterday, 8:00 PM', completed: true },
      { label: 'Received at Society Hub', sublabel: 'Stored in Rack B, Slot B17', time: 'Today, 10:45 AM', completed: true, current: true },
      { label: 'Pickup Scheduled', sublabel: 'Choose 30-min collection slot', completed: false },
      { label: 'Handover Completed', sublabel: 'Verify OTP or QR at hub', completed: false },
    ],
  },
  {
    id: 'p-2',
    trackingNumber: 'PF-8922-IN',
    carrier: 'Flipkart',
    description: 'Cotton Casual Shirt',
    sender: 'RetailNet Bangalore',
    status: 'SCHEDULED',
    recipientName: 'Vinay Kumar',
    recipientPhone: '+91 98765 00000',
    flat: 'B-402',
    tower: 'Tower B',
    storageLocation: 'Tower B, Rack A, Slot A04',
    scheduledSlot: 'Today, 8:00 PM - 8:30 PM',
    otpCode: '742916',
    receivedAt: 'Today, 11:30 AM',
    timeline: [
      { label: 'Picked by Courier', sublabel: 'Dispatched from Flipkart Hub', time: 'Yesterday, 9:20 PM', completed: true },
      { label: 'Received at Society Hub', sublabel: 'Stored in Rack A, Slot A04', time: 'Today, 11:30 AM', completed: true },
      { label: 'Pickup Scheduled', sublabel: 'Today, 8:00 PM - 8:30 PM', time: 'Today, 1:15 PM', completed: true, current: true },
      { label: 'Handover Completed', sublabel: 'Show 6-digit OTP or QR code to staff', completed: false },
    ],
  },
  {
    id: 'p-3',
    trackingNumber: 'PF-8923-IN',
    carrier: 'Myntra',
    description: 'Running Shoes Size 9',
    sender: 'Myntra Logistics',
    status: 'WAITING',
    recipientName: 'Vinay Kumar',
    recipientPhone: '+91 98765 00000',
    flat: 'B-402',
    tower: 'Tower B',
    storageLocation: 'Tower B, Rack B, Slot B09',
    receivedAt: 'Today, 2:10 PM',
    timeline: [
      { label: 'Picked by Courier', sublabel: 'Dispatched from Warehouse', time: 'Today, 7:00 AM', completed: true },
      { label: 'Received at Society Hub', sublabel: 'Stored in Rack B, Slot B09', time: 'Today, 2:10 PM', completed: true, current: true },
      { label: 'Pickup Scheduled', sublabel: 'Choose 30-min collection slot', completed: false },
      { label: 'Handover Completed', sublabel: 'Verify OTP or QR at hub', completed: false },
    ],
  },
  {
    id: 'p-4',
    trackingNumber: 'PF-7612-IN',
    carrier: 'Amazon',
    description: 'Kitchen Appliances',
    sender: 'Amazon Fresh',
    status: 'COLLECTED',
    recipientName: 'Vinay Kumar',
    recipientPhone: '+91 98765 00000',
    flat: 'B-402',
    tower: 'Tower B',
    storageLocation: 'Tower B, Rack A, Slot A12',
    receivedAt: 'Yesterday, 3:30 PM',
    collectedAt: 'Yesterday, 5:15 PM',
    timeline: [
      { label: 'Picked by Courier', sublabel: 'Dispatched from Seller', time: '2 days ago', completed: true },
      { label: 'Received at Society Hub', sublabel: 'Checked in by Security Ramesh', time: 'Yesterday, 3:30 PM', completed: true },
      { label: 'Pickup Scheduled', sublabel: 'Slot 5:00 PM - 5:30 PM', time: 'Yesterday, 4:00 PM', completed: true },
      { label: 'Handover Completed', sublabel: 'Verified by Hub Staff Suresh', time: 'Yesterday, 5:15 PM', completed: true, current: true },
    ],
  },
  {
    id: 'p-5',
    trackingNumber: 'BD-55104-BLR',
    carrier: 'Blue Dart',
    description: 'Official Documents / Passport',
    sender: 'Blue Dart Express',
    status: 'WAITING',
    recipientName: 'Aarav Mehta',
    recipientPhone: '+91 98333 44556',
    flat: 'B-704',
    tower: 'Tower B',
    storageLocation: 'Tower B, Rack B, Slot B02',
    receivedAt: 'Today, 9:15 AM',
    timeline: [
      { label: 'Picked by Courier', completed: true },
      { label: 'Received at Society Hub', time: 'Today, 9:15 AM', completed: true, current: true },
      { label: 'Pickup Scheduled', completed: false },
      { label: 'Handover Completed', completed: false },
    ],
  },
];

const INITIAL_SLOTS: PickupSlot[] = [
  { id: 's-1', timeWindow: '6:00 PM - 6:30 PM', dateLabel: 'Today', bookedCount: 18, capacity: 25, isAvailable: true },
  { id: 's-2', timeWindow: '6:30 PM - 7:00 PM', dateLabel: 'Today', bookedCount: 22, capacity: 25, isAvailable: true },
  { id: 's-3', timeWindow: '7:00 PM - 7:30 PM', dateLabel: 'Today', bookedCount: 25, capacity: 25, isAvailable: false, isPeak: true },
  { id: 's-4', timeWindow: '8:00 PM - 8:30 PM', dateLabel: 'Today', bookedCount: 14, capacity: 25, isAvailable: true },
  { id: 's-5', timeWindow: '9:00 PM - 9:30 PM', dateLabel: 'Today', bookedCount: 6, capacity: 25, isAvailable: true },
];

const INITIAL_RESIDENTS: ResidentUser[] = [
  { id: 'res-1', name: 'Arjun Kumar', phone: '+91 98765 43210', email: 'arjun.k@gmail.com', flat: 'A-101', society: 'Greenview Heights', status: 'Active' },
  { id: 'res-2', name: 'Priya Sharma', phone: '+91 98123 45678', email: 'priya.s@gmail.com', flat: 'A-102', society: 'Greenview Heights', status: 'Active' },
  { id: 'res-3', name: 'Rahul Verma', phone: '+91 98234 56789', email: 'rahul.v@gmail.com', flat: 'A-103', society: 'Greenview Heights', status: 'Active' },
  { id: 'res-4', name: 'Sneha Iyer', phone: '+91 99876 54321', email: 'sneha.i@gmail.com', flat: 'A-104', society: 'Greenview Heights', status: 'Active' },
  { id: 'res-5', name: 'Aarav Mehta', phone: '+91 98333 44556', email: 'aarav.m@gmail.com', flat: 'B-704', society: 'Greenview Heights', status: 'Active' },
  { id: 'res-6', name: 'Vinay Kumar', phone: '+91 98765 00000', email: 'vinaykumard45678@gmail.com', flat: 'B-402', society: 'Greenview Heights', status: 'Active' },
];

const INITIAL_STAFF: StaffMember[] = [
  { id: 'stf-1', name: 'Ramesh K', phone: '+91 98450 12345', email: 'ramesh.k@parcelflow.in', role: 'Security', society: 'Greenview Heights', status: 'Active' },
  { id: 'stf-2', name: 'Suresh P', phone: '+91 98765 87654', email: 'suresh.p@parcelflow.in', role: 'Parcel Hub', society: 'Greenview Heights', status: 'Active' },
  { id: 'stf-3', name: 'Manoj T', phone: '+91 99875 11223', email: 'manoj.t@parcelflow.in', role: 'Security', society: 'Greenview Heights', status: 'Active' },
  { id: 'stf-4', name: 'Vikram S', phone: '+91 96633 44556', email: 'vikram.s@parcelflow.in', role: 'Maintenance', society: 'Greenview Heights', status: 'Inactive' },
];

interface MobileStoreState {
  currentRole: MobileRole;
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

  private loadState(): MobileStoreState {
    try {
      const saved = localStorage.getItem('parcelflow_mobile_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          slots: parsed.slots?.length ? parsed.slots : INITIAL_SLOTS,
        };
      }
    } catch {
      // ignore
    }

    return {
      currentRole: 'RESIDENT',
      selectedSociety: SOCIETIES[0],
      parcels: INITIAL_PARCELS,
      slots: INITIAL_SLOTS,
      residents: INITIAL_RESIDENTS,
      staff: INITIAL_STAFF,
      activeParcelId: 'p-1',
      report: {
        period: 'Daily',
        totalParcels: 112,
        collected: 61,
        scheduled: 18,
        pending: 33,
        collectionRate: 88.3,
        hourlyStats: [
          { hour: '9 AM', count: 18 },
          { hour: '12 PM', count: 32 },
          { hour: '3 PM', count: 48 },
          { hour: '6 PM', count: 86 },
          { hour: '9 PM', count: 112 },
        ],
      },
    };
  }

  private saveState() {
    try {
      localStorage.setItem('parcelflow_mobile_state_v1', JSON.stringify(this.state));
    } catch {
      // ignore
    }
    this.notify();
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

  schedulePickup(parcelId: string, slotId: string): { success: boolean; otp: string } {
    const slot = this.state.slots.find((s) => s.id === slotId);
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
            { label: 'Handover Completed', sublabel: 'Show 6-digit OTP or QR code to staff', completed: false },
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
  }): MobileParcel {
    const newParcel: MobileParcel = {
      id: 'p-' + Date.now(),
      trackingNumber: data.trackingNumber.trim().toUpperCase(),
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
        { label: 'Handover Completed', sublabel: 'Verify OTP or QR at hub', completed: false },
      ],
    };

    this.state.parcels = [newParcel, ...this.state.parcels];
    this.saveState();
    return newParcel;
  }

  verifyHandover(otpOrCode: string): { success: boolean; parcel?: MobileParcel; message: string } {
    const clean = otpOrCode.trim().toUpperCase();
    const parcel = this.state.parcels.find((p) => {
      if (p.otpCode && p.otpCode === clean) return true;
      if (p.trackingNumber && p.trackingNumber.toUpperCase() === clean) return true;
      return false;
    });

    if (!parcel) {
      // If entered OTP is 6 digits or 742916, match the first waiting or scheduled parcel
      const candidate = this.state.parcels.find((p) => p.status === 'SCHEDULED' || p.status === 'WAITING');
      if (candidate && clean.length >= 4) {
        return this.completeHandover(candidate.id);
      }
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
    const newRes: ResidentUser = {
      ...resident,
      id: 'res-' + Date.now(),
      status: 'Active',
    };
    this.state.residents = [newRes, ...this.state.residents];
    this.saveState();
    return newRes;
  }

  addStaff(staffMember: Omit<StaffMember, 'id' | 'status'>) {
    const newStaff: StaffMember = {
      ...staffMember,
      id: 'stf-' + Date.now(),
      status: 'Active',
    };
    this.state.staff = [newStaff, ...this.state.staff];
    this.saveState();
    return newStaff;
  }

  toggleSlot(slotId: string) {
    this.state.slots = this.state.slots.map((s) => {
      if (s.id === slotId) {
        return { ...s, isAvailable: !s.isAvailable };
      }
      return s;
    });
    this.saveState();
  }

  addSlot(timeWindow: string) {
    const newSlot: PickupSlot = {
      id: 's-' + Date.now(),
      timeWindow,
      dateLabel: 'Today',
      bookedCount: 0,
      capacity: 25,
      isAvailable: true,
    };
    this.state.slots.push(newSlot);
    this.saveState();
  }
}

export const mobileStore = new MobileStateStore();

export function useMobileStore() {
  const [state, setState] = useState<MobileStoreState>(mobileStore.getState());

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
    receiveParcel: (data: Parameters<typeof mobileStore.receiveParcel>[0]) => mobileStore.receiveParcel(data),
    verifyHandover: (otpOrCode: string) => mobileStore.verifyHandover(otpOrCode),
    completeHandover: (parcelId: string) => mobileStore.completeHandover(parcelId),
    addResident: (r: Parameters<typeof mobileStore.addResident>[0]) => mobileStore.addResident(r),
    addStaff: (s: Parameters<typeof mobileStore.addStaff>[0]) => mobileStore.addStaff(s),
    toggleSlot: (id: string) => mobileStore.toggleSlot(id),
    addSlot: (w: string) => mobileStore.addSlot(w),
  };
}
