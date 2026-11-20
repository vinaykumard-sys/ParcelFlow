export type MobileRole =
  | 'SUPER_ADMIN'
  | 'SOCIETY_ADMIN'
  | 'SECURITY'
  | 'RESIDENT'
  | 'STAFF'
  | 'ADMIN';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: MobileRole;
  societyId?: string;
  flatNumber?: string;
}

export type ParcelStatus = 'WAITING' | 'SCHEDULED' | 'READY_FOR_PICKUP' | 'COLLECTED';

export interface TimelineStep {
  label: string;
  sublabel?: string;
  time?: string;
  completed: boolean;
  current?: boolean;
}

export interface MobileParcel {
  id: string;
  trackingNumber: string;
  carrier: 'Amazon' | 'Flipkart' | 'Myntra' | 'Blue Dart' | 'Delhivery' | 'Other';
  description?: string;
  sender?: string;
  status: ParcelStatus;
  recipientName: string;
  recipientPhone: string;
  flat: string;
  tower?: string;
  storageLocation: string; // e.g. "Tower B, Rack B, Slot B17"
  scheduledSlot?: string; // e.g. "Today, 6:00 PM - 6:30 PM"
  otpCode?: string; // e.g. "742916"
  receivedAt: string;
  collectedAt?: string;
  timeline: TimelineStep[];
}

export interface PickupSlot {
  id: string;
  timeWindow: string; // "6:00 PM - 6:30 PM"
  dateLabel: string; // "Today"
  bookedCount: number;
  capacity: number;
  isAvailable: boolean;
  isPeak?: boolean;
}

export interface ResidentUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  flat: string;
  society: string;
  avatarUrl?: string;
  status: 'Active' | 'Inactive';
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'Security' | 'Parcel Hub' | 'Maintenance' | 'Supervisor';
  society: string;
  status: 'Active' | 'Inactive';
}

export interface SocietyOption {
  id: string;
  name: string;
  address: string;
  city: string;
}

export interface SocietyReport {
  period: 'Daily' | 'Weekly' | 'Monthly';
  totalParcels: number;
  collected: number;
  scheduled: number;
  pending: number;
  collectionRate: number; // e.g. 88.3
  hourlyStats: { hour: string; count: number }[];
}
