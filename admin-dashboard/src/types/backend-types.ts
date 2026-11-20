// ============================================================================
// PARCELFLOW BACKEND TYPES (backend/types.ts)
// Complete TypeScript definitions for Supabase Database & Domain Models
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ----------------------------------------------------------------------------
// Core Domain Enums & Statuses
// ----------------------------------------------------------------------------

export type UserRole = 'SUPER_ADMIN' | 'SOCIETY_ADMIN' | 'SECURITY' | 'RESIDENT' | 'ADMIN' | 'STAFF';

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
  | 'EXPIRED';

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

export type NotificationType =
  | 'PARCEL_RECEIVED'
  | 'SLOT_SCHEDULED'
  | 'READY_FOR_PICKUP'
  | 'HANDOVER_COMPLETED'
  | 'DELAY_ALERT'
  | 'SECURITY_NOTICE'
  | 'SYSTEM';

export type NotificationChannel =
  | 'IN_APP'
  | 'WHATSAPP'
  | 'SMS'
  | 'EMAIL'
  | 'PUSH';

export type NotificationStatus =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'READ';

export type IssueCategory =
  | 'DAMAGED_PACKAGE'
  | 'WRONG_ITEM'
  | 'MISSING_PACKAGE'
  | 'OTP_FAILURE'
  | 'HUB_DELAY'
  | 'OTHER';

export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';

export type AppPlatform = 'ANDROID' | 'IOS' | 'WEB';

// ----------------------------------------------------------------------------
// Table Interfaces
// ----------------------------------------------------------------------------

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
  settings: Record<string, any>;
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

export type ProfileRole = 'SUPER_ADMIN' | 'SOCIETY_ADMIN' | 'SECURITY' | 'RESIDENT' | 'resident' | 'staff' | 'admin';

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
}

export interface Resident {
  id: string;
  user_id: string;
  society_id: string;
  apartment_id: string;
  is_primary: boolean;
  emergency_contact: string | null;
  delivery_preferences: {
    allow_locker?: boolean;
    allow_security_drop?: boolean;
    sms_alerts?: boolean;
    whatsapp_alerts?: boolean;
    preferred_pickup_window?: string;
  };
  created_at: string;
  updated_at: string;
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

export interface ParcelEvent {
  id: string;
  parcel_id: string;
  from_status: ParcelStatus | null;
  to_status: ParcelStatus;
  description: string;
  actor_id: string | null;
  actor_name: string | null;
  actor_role: UserRole | 'SYSTEM' | 'COURIER' | null;
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

export interface Notification {
  id: string;
  user_id: string;
  society_id: string | null;
  parcel_id: string | null;
  type: NotificationType;
  title: string;
  body: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  read_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AuthorizedCollector {
  id: string;
  resident_id: string;
  name: string;
  phone: string;
  relation: string;
  government_id_type: string | null;
  government_id_last4: string | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
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

export interface Issue {
  id: string;
  parcel_id: string | null;
  society_id: string;
  reported_by_user_id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppVersion {
  id: string;
  platform: AppPlatform;
  version_number: string;
  build_number: number;
  release_notes: string | null;
  min_supported_version: string;
  is_mandatory_update: boolean;
  download_url: string | null;
  released_at: string;
  created_at: string;
}

export interface PilotRequest {
  id: string;
  society_name: string;
  city: string;
  total_units: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  role: string;
  notes: string | null;
  status: 'PENDING' | 'CONTACTED' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  platform: 'android' | 'ios' | 'general';
  created_at: string;
}

// ----------------------------------------------------------------------------
// Joined / Enriched Models for UI & Admin Dashboards
// ----------------------------------------------------------------------------

export interface EnrichedParcel extends Parcel {
  society?: Society;
  apartment?: Apartment;
  resident?: Resident & { user?: User };
  storage_location?: StorageLocation;
  active_token?: HandoverToken;
  pickup_booking?: PickupBooking;
}

export interface SocietyDashboardKPIs {
  todayParcels: number;
  collectedToday: number;
  scheduledToday: number;
  pendingStorage: number;
  totalHubInventory: number;
  readyForPickup: number;
  activeStaffCount: number;
  registeredResidentsCount: number;
}

// ----------------------------------------------------------------------------
// Supabase Generic Database Schema Interface
// ----------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Profile>;
      };
      societies: {
        Row: Society;
        Insert: Omit<Society, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Society>;
      };
      apartments: {
        Row: Apartment;
        Insert: Omit<Apartment, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Apartment>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<User>;
      };
      residents: {
        Row: Resident;
        Insert: Omit<Resident, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Resident>;
      };
      staff: {
        Row: Staff;
        Insert: Omit<Staff, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Staff>;
      };
      storage_locations: {
        Row: StorageLocation;
        Insert: Omit<StorageLocation, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<StorageLocation>;
      };
      parcels: {
        Row: Parcel;
        Insert: Omit<Parcel, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Parcel>;
      };
      parcel_events: {
        Row: ParcelEvent;
        Insert: Omit<ParcelEvent, 'id' | 'event_time'> & { id?: string; event_time?: string };
        Update: Partial<ParcelEvent>;
      };
      pickup_slots: {
        Row: PickupSlot;
        Insert: Omit<PickupSlot, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<PickupSlot>;
      };
      pickup_bookings: {
        Row: PickupBooking;
        Insert: Omit<PickupBooking, 'id' | 'booked_at' | 'updated_at'> & { id?: string; booked_at?: string; updated_at?: string };
        Update: Partial<PickupBooking>;
      };
      handover_tokens: {
        Row: HandoverToken;
        Insert: Omit<HandoverToken, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<HandoverToken>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Notification>;
      };
      authorized_collectors: {
        Row: AuthorizedCollector;
        Insert: Omit<AuthorizedCollector, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<AuthorizedCollector>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<AuditLog>;
      };
      issues: {
        Row: Issue;
        Insert: Omit<Issue, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Issue>;
      };
      app_versions: {
        Row: AppVersion;
        Insert: Omit<AppVersion, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<AppVersion>;
      };
      pilot_requests: {
        Row: PilotRequest;
        Insert: Omit<PilotRequest, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<PilotRequest>;
      };
      waitlist: {
        Row: WaitlistEntry;
        Insert: Omit<WaitlistEntry, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<WaitlistEntry>;
      };
    };
  };
}
