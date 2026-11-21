// ============================================================================
// PARCELFLOW SERVICES TYPES (src/services/types.ts)
// TypeScript domain types and database interfaces for ParcelFlow services
// ============================================================================

export type UserRole = 'SUPER_ADMIN' | 'SOCIETY_ADMIN' | 'SECURITY' | 'RESIDENT';
export type ProfileRole =
  | 'SUPER_ADMIN'
  | 'SOCIETY_ADMIN'
  | 'SECURITY'
  | 'RESIDENT'
  | 'admin'
  | 'staff'
  | 'resident';

export const isSuperAdminRole = (role?: string | null): boolean =>
  role === 'SUPER_ADMIN' || role === 'admin';

export const isSocietyAdminRole = (role?: string | null): boolean =>
  role === 'SOCIETY_ADMIN' || isSuperAdminRole(role);

export const isSecurityRole = (role?: string | null): boolean =>
  role === 'SECURITY' || role === 'staff' || isSocietyAdminRole(role);

export const isResidentRole = (role?: string | null): boolean =>
  role === 'RESIDENT' || role === 'resident';

export type ParcelStatus =
  | 'CREATED'
  | 'RECEIVED'
  | 'STORED'
  | 'NOTIFIED'
  | 'SCHEDULED'
  | 'READY_FOR_PICKUP'
  | 'VERIFIED'
  | 'HANDED_OVER'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'WAITING'
  | 'READY';

export type ParcelCategory =
  | 'GENERAL'
  | 'ELECTRONICS'
  | 'CLOTHING'
  | 'PERISHABLE'
  | 'FRAGILE'
  | 'DOCUMENT'
  | 'MEDICINE';

export type StorageCompartmentType =
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE'
  | 'OVERSIZE'
  | 'COLD_STORAGE'
  | 'SECURE_LOCKER';

export type PickupSlotStatus = 'AVAILABLE' | 'FULL' | 'RESERVED' | 'INACTIVE';

export type PickupBookingStatus =
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type HandoverTokenStatus = 'ACTIVE' | 'USED' | 'EXPIRED' | 'REVOKED';

export interface Profile {
  id: string; // references auth.users(id)
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: ProfileRole;
  society_id: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface AuthSessionResponse {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  isAdmin: boolean;
  error?: string | null;
  message?: string | null;
}

export interface Society {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  total_towers: number;
  total_flats: number;
  hub_phone: string | null;
  hub_operating_hours: string;
  settings?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  id: string;
  society_id: string;
  tower: string;
  floor: number | null;
  unit_number: string;
  intercom_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_user_id: string | null;
  email: string;
  phone: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resident {
  id: string;
  user_id: string;
  society_id: string;
  apartment_id: string;
  is_primary: boolean;
  emergency_contact: string | null;
  delivery_preferences?: {
    allow_locker?: boolean;
    allow_security_drop?: boolean;
    sms_alerts?: boolean;
    whatsapp_alerts?: boolean;
    preferred_pickup_window?: string;
  };
  created_at: string;
  updated_at: string;
  user?: User;
  apartment?: Apartment;
}

export interface Staff {
  id: string;
  user_id: string;
  society_id: string;
  badge_number: string;
  designation: string;
  shift: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface StorageLocation {
  id: string;
  society_id: string;
  zone: string;
  rack: string;
  shelf: string;
  compartment_type: StorageCompartmentType;
  is_occupied: boolean;
  current_parcel_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Parcel {
  id: string;
  tracking_number: string;
  carrier_name: string;
  courier_tracking_id: string | null;
  courier_phone: string | null;
  courier_rider_name: string | null;
  society_id: string;
  apartment_id: string;
  resident_id: string | null;
  storage_location_id: string | null;
  status: ParcelStatus;
  description: string | null;
  category: ParcelCategory;
  weight_kg: number | null;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  } | null;
  is_fragile: boolean;
  is_perishable: boolean;
  received_at: string | null;
  received_by_staff_id: string | null;
  handover_at: string | null;
  handed_over_by_staff_id: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnrichedParcel extends Parcel {
  society?: Society;
  apartment?: Apartment;
  resident?: Resident;
  storage_location?: StorageLocation;
  active_token?: HandoverToken;
  pickup_booking?: PickupBooking;
}

export interface ParcelEvent {
  id: string;
  parcel_id: string;
  from_status: string | null;
  to_status: string;
  description: string;
  actor_id: string | null;
  actor_name: string | null;
  actor_role: string | null;
  metadata: Record<string, any>;
  event_time: string;
}

export interface PickupSlot {
  id: string;
  society_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings_count: number;
  status: PickupSlotStatus;
  created_at: string;
  updated_at: string;
}

export interface PickupBooking {
  id: string;
  society_id?: string;
  parcel_id: string;
  pickup_slot_id: string;
  resident_id: string;
  booking_status: PickupBookingStatus;
  scheduled_time_window: string;
  notes: string | null;
  booked_at: string;
  updated_at: string;
}

export interface HandoverToken {
  id: string;
  parcel_id: string;
  resident_id: string;
  token_code: string;
  otp_code: string;
  qr_code_data: string;
  status: HandoverTokenStatus;
  expires_at: string;
  verified_at: string | null;
  verified_by_staff_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  society_id: string | null;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  payload: Record<string, any>;
  created_at: string;
}

export interface SocietyStats {
  todayTotal: number;
  collectedCount: number;
  pendingCount: number;
  scheduledCount: number;
  collectionRate: number;
  storageCapacity: number;
  storageOccupied: number;
  hourlyDemand: Array<{ hour: string; intake: number; pickups: number }>;
  courierDistribution: Array<{ courier: string; count: number; percentage: number }>;
}
