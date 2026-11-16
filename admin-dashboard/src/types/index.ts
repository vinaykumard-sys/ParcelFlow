// Admin Dashboard Domain Types & Enums
import type {
  Society,
  Apartment,
  Resident as BackendResident,
  Staff as BackendStaff,
  Parcel as BackendParcel,
  EnrichedParcel as BackendEnrichedParcel,
  ParcelStatus,
  StorageLocation,
  PickupSlot,
  HandoverToken,
  Issue,
  Notification,
  AuditLog,
  UserRole,
  User,
  IssueStatus,
  IssueCategory,
  IssuePriority
} from './backend-types';

export type {
  Society,
  Apartment,
  ParcelStatus,
  StorageLocation,
  PickupSlot,
  HandoverToken,
  Issue,
  Notification,
  AuditLog,
  UserRole,
  User,
  IssueStatus,
  IssueCategory,
  IssuePriority
};

export type EnrichedParcel = AdminParcel;
export type Resident = AdminResident;
export type Staff = AdminStaff;
export type Parcel = AdminParcel;

export interface AdminResident extends Omit<BackendResident, 'created_at' | 'updated_at'> {
  created_at?: string;
  updated_at?: string;
  flat_number: string;
  phone: string;
  is_active: boolean;
  user?: User;
  apartment?: Apartment;
}

export interface AdminStaff extends BackendStaff {
  staff_code: string;
  role_type: string;
  shift_timings: string;
  user?: User;
}

export interface AdminParcel extends BackendEnrichedParcel {
  courier_company: string;
  recipient_name_on_package: string;
  notes?: string;
  active_token?: HandoverToken;
}

export type AdminTab =
  | 'splash'
  | 'society-selection'
  | 'dashboard'
  | 'role-switcher'
  | 'residents'
  | 'staff'
  | 'hub-inventory'
  | 'tracking'
  | 'pickup-slots'
  | 'otp-scanner'
  | 'notifications'
  | 'reports'
  | 'issues'
  | 'settings';

export interface HubInventorySlot {
  code: string; // e.g. "A1", "A2", "B1"
  rack: 'Rack A' | 'Rack B';
  shelf: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'OVERSIZE';
  occupied: boolean;
  parcelId?: string;
  trackingNumber?: string;
  residentName?: string;
  flatNumber?: string;
  timeWindow?: string;
  status?: ParcelStatus;
}

export interface PickupWindowSlotConfig {
  id: string;
  timeWindow: string; // "6:00 PM – 6:30 PM"
  startTime: string;
  endTime: string;
  enabled: boolean;
  maxCapacity: number;
  bookedCount: number;
}
