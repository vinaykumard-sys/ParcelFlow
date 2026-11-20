import {
  FALLBACK_SOCIETIES,
  FALLBACK_PARCELS,
  supabase,
} from '../../../backend/supabase_client';
import type {
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
  IssueStatus,
  IssueCategory,
  IssuePriority
} from '../../../backend/types';
import type {
  AdminResident,
  AdminStaff,
  AdminParcel,
  HubInventorySlot,
  PickupWindowSlotConfig
} from '../types';

// Initial Pickup Slots Config matching prompt specification
const INITIAL_PICKUP_SLOTS: PickupWindowSlotConfig[] = [
  { id: 'slot-1', timeWindow: '6:00 PM – 6:30 PM', startTime: '18:00', endTime: '18:30', enabled: true, maxCapacity: 25, bookedCount: 14 },
  { id: 'slot-2', timeWindow: '6:30 PM – 7:00 PM', startTime: '18:30', endTime: '19:00', enabled: true, maxCapacity: 25, bookedCount: 18 },
  { id: 'slot-3', timeWindow: '7:00 PM – 7:30 PM', startTime: '19:00', endTime: '19:30', enabled: true, maxCapacity: 30, bookedCount: 22 },
  { id: 'slot-4', timeWindow: '8:00 PM – 8:30 PM', startTime: '20:00', endTime: '20:30', enabled: true, maxCapacity: 35, bookedCount: 31 },
  { id: 'slot-5', timeWindow: '9:00 PM – 9:30 PM', startTime: '21:00', endTime: '21:30', enabled: true, maxCapacity: 20, bookedCount: 9 },
];

// Initial Hub Inventory Slots (Racks A & B)
const INITIAL_HUB_SLOTS: HubInventorySlot[] = [
  { code: 'A1', rack: 'Rack A', shelf: 'Top Level', size: 'MEDIUM', occupied: true, parcelId: 'PF-8921-IN', trackingNumber: 'PF-8921-IN', residentName: 'Arjun Kumar', flatNumber: 'A-402', timeWindow: '8:00 PM – 8:30 PM', status: 'SCHEDULED' },
  { code: 'A2', rack: 'Rack A', shelf: 'Top Level', size: 'LARGE', occupied: true, parcelId: 'PF-8922-IN', trackingNumber: 'PF-8922-IN', residentName: 'Priya Sharma', flatNumber: 'B-104', timeWindow: '6:30 PM – 7:00 PM', status: 'READY_FOR_PICKUP' },
  { code: 'A3', rack: 'Rack A', shelf: 'Mid Level', size: 'SMALL', occupied: false },
  { code: 'A4', rack: 'Rack A', shelf: 'Mid Level', size: 'MEDIUM', occupied: true, parcelId: 'PF-8923-IN', trackingNumber: 'PF-8923-IN', residentName: 'Rahul Verma', flatNumber: 'C-801', timeWindow: '7:00 PM – 7:30 PM', status: 'STORED' },
  { code: 'A5', rack: 'Rack A', shelf: 'Bottom Level', size: 'OVERSIZE', occupied: false },
  { code: 'A6', rack: 'Rack A', shelf: 'Bottom Level', size: 'LARGE', occupied: true, parcelId: 'PF-8925-IN', trackingNumber: 'PF-8925-IN', residentName: 'Vikram Malhotra', flatNumber: 'A-1004', timeWindow: '8:00 PM – 8:30 PM', status: 'SCHEDULED' },

  { code: 'B1', rack: 'Rack B', shelf: 'Top Level', size: 'SMALL', occupied: true, parcelId: 'PF-8924-IN', trackingNumber: 'PF-8924-IN', residentName: 'Sneha Iyer', flatNumber: 'A-203', timeWindow: '6:00 PM – 6:30 PM', status: 'READY_FOR_PICKUP' },
  { code: 'B2', rack: 'Rack B', shelf: 'Top Level', size: 'MEDIUM', occupied: false },
  { code: 'B3', rack: 'Rack B', shelf: 'Mid Level', size: 'LARGE', occupied: true, parcelId: 'PF-8926-IN', trackingNumber: 'PF-8926-IN', residentName: 'Ananya Sen', flatNumber: 'B-502', timeWindow: '9:00 PM – 9:30 PM', status: 'STORED' },
  { code: 'B4', rack: 'Rack B', shelf: 'Mid Level', size: 'MEDIUM', occupied: false },
  { code: 'B5', rack: 'Rack B', shelf: 'Bottom Level', size: 'SMALL', occupied: true, parcelId: 'PF-8927-IN', trackingNumber: 'PF-8927-IN', residentName: 'Rohan Mehta', flatNumber: 'C-305', timeWindow: '7:00 PM – 7:30 PM', status: 'SCHEDULED' },
  { code: 'B6', rack: 'Rack B', shelf: 'Bottom Level', size: 'OVERSIZE', occupied: false },
];

// Initial Residents (matching Lakeview & Greenview)
const INITIAL_RESIDENTS: AdminResident[] = [
  {
    id: 'res-001',
    user_id: 'u-001',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    apartment_id: 'apt-001',
    flat_number: 'A-402',
    phone: '+91 98860 12345',
    is_primary: true,
    is_active: true,
    emergency_contact: '+91 98860 99991',
    delivery_preferences: { preferred_pickup_window: '20:00-20:30' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-001',
      auth_user_id: null,
      email: 'arjun.kumar@gmail.com',
      phone: '+91 98860 12345',
      full_name: 'Arjun Kumar',
      role: 'RESIDENT',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    apartment: {
      id: 'apt-001',
      society_id: 'a1111111-1111-1111-1111-111111111111',
      tower: 'Tower A',
      floor: 4,
      unit_number: 'A-402',
      intercom_number: '1402',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'res-002',
    user_id: 'u-002',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    apartment_id: 'apt-002',
    flat_number: 'B-104',
    phone: '+91 98860 23456',
    is_primary: true,
    is_active: true,
    emergency_contact: '+91 98860 99992',
    delivery_preferences: { preferred_pickup_window: '18:30-19:00' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-002',
      auth_user_id: null,
      email: 'priya.sharma@outlook.com',
      phone: '+91 98860 23456',
      full_name: 'Priya Sharma',
      role: 'RESIDENT',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    apartment: {
      id: 'apt-002',
      society_id: 'a1111111-1111-1111-1111-111111111111',
      tower: 'Tower B',
      floor: 1,
      unit_number: 'B-104',
      intercom_number: '2104',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'res-003',
    user_id: 'u-003',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    apartment_id: 'apt-003',
    flat_number: 'C-801',
    phone: '+91 98860 34567',
    is_primary: true,
    is_active: true,
    emergency_contact: null,
    delivery_preferences: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-003',
      auth_user_id: null,
      email: 'rahul.verma@corp.in',
      phone: '+91 98860 34567',
      full_name: 'Rahul Verma',
      role: 'RESIDENT',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    apartment: {
      id: 'apt-003',
      society_id: 'a1111111-1111-1111-1111-111111111111',
      tower: 'Tower C',
      floor: 8,
      unit_number: 'C-801',
      intercom_number: '3801',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'res-004',
    user_id: 'u-004',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    apartment_id: 'apt-004',
    flat_number: 'A-203',
    phone: '+91 98860 45678',
    is_primary: true,
    is_active: true,
    emergency_contact: null,
    delivery_preferences: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-004',
      auth_user_id: null,
      email: 'sneha.iyer@gmail.com',
      phone: '+91 98860 45678',
      full_name: 'Sneha Iyer',
      role: 'RESIDENT',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    apartment: {
      id: 'apt-004',
      society_id: 'a1111111-1111-1111-1111-111111111111',
      tower: 'Tower A',
      floor: 2,
      unit_number: 'A-203',
      intercom_number: '1203',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

// Initial Staff (12 members: Ramesh K, Suresh P, Manoj T, Deepak Rao, Ankit S, Sunita D, Rajesh P, etc.)
const INITIAL_STAFF: AdminStaff[] = [
  {
    id: 'stf-001',
    user_id: 'u-stf-001',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    badge_number: 'STF-01',
    staff_code: 'STF-01',
    designation: 'Hub Supervisor',
    role_type: 'SUPERVISOR',
    shift: '07:00 AM - 03:30 PM',
    shift_timings: '07:00 AM - 03:30 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-stf-001',
      auth_user_id: null,
      email: 'ramesh.k@parcelflow.in',
      phone: '+91 98450 11101',
      full_name: 'Ramesh K',
      role: 'STAFF',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'stf-002',
    user_id: 'u-stf-002',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    badge_number: 'STF-02',
    staff_code: 'STF-02',
    designation: 'Security & Gate Dispatch',
    role_type: 'SECURITY_GUARD',
    shift: '02:30 PM - 11:00 PM',
    shift_timings: '02:30 PM - 11:00 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-stf-002',
      auth_user_id: null,
      email: 'suresh.p@parcelflow.in',
      phone: '+91 98450 11102',
      full_name: 'Suresh P',
      role: 'STAFF',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'stf-003',
    user_id: 'u-stf-003',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    badge_number: 'STF-03',
    staff_code: 'STF-03',
    designation: 'Parcel Hub Specialist',
    role_type: 'HUB_OPERATOR',
    shift: '01:00 PM - 09:30 PM',
    shift_timings: '01:00 PM - 09:30 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-stf-003',
      auth_user_id: null,
      email: 'manoj.t@parcelflow.in',
      phone: '+91 98450 11103',
      full_name: 'Manoj T',
      role: 'STAFF',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'stf-004',
    user_id: 'u-stf-004',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    badge_number: 'STF-04',
    staff_code: 'STF-04',
    designation: 'Evening Counter Operator',
    role_type: 'HUB_OPERATOR',
    shift: '04:00 PM - 11:30 PM',
    shift_timings: '04:00 PM - 11:30 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-stf-004',
      auth_user_id: null,
      email: 'deepak.rao@parcelflow.in',
      phone: '+91 98450 11104',
      full_name: 'Deepak Rao',
      role: 'STAFF',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'stf-005',
    user_id: 'u-stf-005',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    badge_number: 'STF-05',
    staff_code: 'STF-05',
    designation: 'Gate 2 Security',
    role_type: 'SECURITY_GUARD',
    shift: '06:00 AM - 02:30 PM',
    shift_timings: '06:00 AM - 02:30 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-stf-005',
      auth_user_id: null,
      email: 'ankit.s@parcelflow.in',
      phone: '+91 98450 11105',
      full_name: 'Ankit Sharma',
      role: 'STAFF',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'stf-006',
    user_id: 'u-stf-006',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    badge_number: 'STF-06',
    staff_code: 'STF-06',
    designation: 'Hub Support Specialist',
    role_type: 'HUB_OPERATOR',
    shift: '08:00 AM - 04:30 PM',
    shift_timings: '08:00 AM - 04:30 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-stf-006',
      auth_user_id: null,
      email: 'sunita.d@parcelflow.in',
      phone: '+91 98450 11106',
      full_name: 'Sunita Devi',
      role: 'STAFF',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'stf-007',
    user_id: 'u-stf-007',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    badge_number: 'STF-07',
    staff_code: 'STF-07',
    designation: 'Locker Facility Tech',
    role_type: 'MAINTENANCE',
    shift: '09:00 AM - 06:00 PM',
    shift_timings: '09:00 AM - 06:00 PM',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 'u-stf-007',
      auth_user_id: null,
      email: 'rajesh.p@parcelflow.in',
      phone: '+91 98450 11107',
      full_name: 'Rajesh Patil',
      role: 'STAFF',
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

// Initial Issues
const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss-001',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    parcel_id: 'PF-8923-IN',
    reported_by_user_id: 'u-resident-003',
    category: 'DAMAGED_PACKAGE',
    priority: 'HIGH',
    status: 'OPEN',
    title: 'Slight exterior tear reported by delivery partner on intake',
    description: 'Outer carton tape was loose when courier handed over at gate. Staff photographed and verified inner bubble wrap intact.',
    resolution_notes: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'iss-002',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    parcel_id: 'PF-8921-IN',
    reported_by_user_id: 'u-resident-001',
    category: 'OTP_FAILURE',
    priority: 'MEDIUM',
    status: 'INVESTIGATING',
    title: 'Resident requested OTP resend via SMS',
    description: 'Resident phone network was fluctuating in basement parking. Fallback SMS dispatched via Twilio.',
    resolution_notes: 'SMS sent successfully. Resident notified.',
    resolved_at: null,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'iss-003',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    parcel_id: 'PF-8919-IN',
    reported_by_user_id: 'u-resident-004',
    category: 'HUB_DELAY',
    priority: 'LOW',
    status: 'RESOLVED',
    title: 'Pickup slot delay due to peak shift overlap',
    description: 'Staff member Ramesh handed over package at counter 2 within 4 minutes.',
    resolution_notes: 'Resolved promptly at hub counter. Resident satisfied.',
    resolved_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
];

// Initial Realtime Notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    user_id: 'admin-global',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    parcel_id: 'PF-8927-IN',
    type: 'PARCEL_RECEIVED',
    title: '📦 New Intake: PF-8927-IN',
    body: 'Blue Dart courier registered 1 parcel for Rohan Mehta (C-305). Assigned to Rack B5.',
    channel: 'IN_APP',
    status: 'READ',
    read_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    metadata: { rack: 'Rack B', shelf: 'B5' },
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'notif-002',
    user_id: 'admin-global',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    parcel_id: 'PF-8921-IN',
    type: 'SLOT_SCHEDULED',
    title: '🗓️ Slot Booked: 8:00 PM – 8:30 PM',
    body: 'Arjun Kumar confirmed pickup window for Amazon package PF-8921-IN.',
    channel: 'IN_APP',
    status: 'DELIVERED',
    read_at: null,
    metadata: { window: '8:00 PM – 8:30 PM' },
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'notif-003',
    user_id: 'admin-global',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    parcel_id: 'PF-8920-IN',
    type: 'HANDOVER_COMPLETED',
    title: '✅ Handover Completed: PF-8920-IN',
    body: 'Staff Suresh P verified OTP 5812 for Sneha Iyer (A-203). Status set to COMPLETED.',
    channel: 'IN_APP',
    status: 'DELIVERED',
    read_at: null,
    metadata: { staff: 'Suresh P' },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'notif-004',
    user_id: 'admin-global',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    parcel_id: null,
    type: 'SECURITY_NOTICE',
    title: '🛡️ Hub Audit Verified',
    body: 'Rack A & B evening capacity at 82%. 12 staff on active duty.',
    channel: 'IN_APP',
    status: 'DELIVERED',
    read_at: null,
    metadata: { audit: 'pass' },
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    user_id: 'stf-001',
    entity_type: 'parcels',
    entity_id: 'PF-8921-IN',
    action: 'STATUS_TRANSITION',
    ip_address: '192.168.1.42',
    user_agent: 'ParcelFlow Staff Scanner APK v0.1.0',
    payload: { status: 'STORED', rack: 'Rack A', shelf: 'A1' },
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'aud-002',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    user_id: 'stf-002',
    entity_type: 'handover_tokens',
    entity_id: 'PF-TOKEN-7492',
    action: 'OTP_VERIFICATION_ATTEMPT',
    ip_address: '192.168.1.43',
    user_agent: 'ParcelFlow Admin Hub Web v0.1.0',
    payload: { validated: true },
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'aud-003',
    society_id: 'a1111111-1111-1111-1111-111111111111',
    user_id: 'admin-001',
    entity_type: 'pickup_slots',
    entity_id: 'slot-4',
    action: 'CAPACITY_UPDATED',
    ip_address: '10.0.0.12',
    user_agent: 'ParcelFlow Admin Console',
    payload: { oldCapacity: 30, newCapacity: 35 },
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

class AdminServiceStore {
  private activeSociety: Society = FALLBACK_SOCIETIES[0];
  private societies: Society[] = [...FALLBACK_SOCIETIES];
  private parcels: AdminParcel[] = FALLBACK_PARCELS.map((p) => ({
    ...p,
    courier_company: p.carrier_name || 'Amazon Logistics',
    recipient_name_on_package: p.resident?.user?.full_name || 'Arjun Kumar',
    notes: p.description || '',
  }));
  private residents: AdminResident[] = [...INITIAL_RESIDENTS];
  private staff: AdminStaff[] = [...INITIAL_STAFF];
  private pickupSlots: PickupWindowSlotConfig[] = [...INITIAL_PICKUP_SLOTS];
  private hubSlots: HubInventorySlot[] = [...INITIAL_HUB_SLOTS];
  private issues: Issue[] = [...INITIAL_ISSUES];
  private notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  private activeRole: UserRole = 'ADMIN';

  // KPI Metrics matching prompt: 87 Today, 61 Collected, 18 Scheduled, 8 Pending
  private kpis = {
    todayTotal: 87,
    collected: 61,
    scheduled: 18,
    pending: 8,
    inventoryTotal: 112,
    readyForPickup: 61,
    inStorage: 33,
    activeStaffCount: 12,
  };

  // Settings
  private settings = {
    societyName: 'Lakeview Residency',
    societyCode: 'LVR-BLR',
    address: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
    hubPhone: '+91 80 4120 7801',
    hubOperatingHours: '06:30 AM – 11:30 PM',
    otpExpiryMinutes: 15,
    maxOtpAttempts: 3,
    requireQrVerification: true,
    whatsappAlerts: true,
    smsFallback: true,
    autoAssignRack: true,
  };

  // Getters
  getActiveSociety(): Society {
    return this.activeSociety;
  }

  getSocieties(): Society[] {
    return this.societies;
  }

  setActiveSociety(id: string): Society {
    const soc = this.societies.find((s) => s.id === id);
    if (soc) {
      this.activeSociety = soc;
      this.settings.societyName = soc.name;
      this.settings.societyCode = soc.code;
      this.settings.address = `${soc.address}, ${soc.city}, ${soc.state} ${soc.postal_code}`;
      this.settings.hubPhone = soc.hub_phone;
      this.settings.hubOperatingHours = soc.hub_operating_hours;
    }
    return this.activeSociety;
  }

  getActiveRole(): UserRole {
    return this.activeRole;
  }

  setActiveRole(role: UserRole) {
    this.activeRole = role;
  }

  getKPIs() {
    return { ...this.kpis };
  }

  getResidents(): AdminResident[] {
    return [...this.residents];
  }

  addResident(data: { name: string; email: string; phone: string; flat_number: string; tower: string }) {
    const newResident: AdminResident = {
      id: `res-${Date.now()}`,
      society_id: this.activeSociety.id,
      user_id: `u-${Date.now()}`,
      apartment_id: `apt-${Date.now()}`,
      flat_number: data.flat_number,
      phone: data.phone,
      is_primary: true,
      is_active: true,
      emergency_contact: null,
      delivery_preferences: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: `u-${Date.now()}`,
        auth_user_id: null,
        email: data.email,
        full_name: data.name,
        phone: data.phone,
        role: 'RESIDENT',
        avatar_url: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      apartment: {
        id: `apt-${Date.now()}`,
        society_id: this.activeSociety.id,
        tower: data.tower || 'Tower A',
        floor: 4,
        unit_number: data.flat_number,
        intercom_number: data.flat_number.replace(/\D/g, ''),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    this.residents.unshift(newResident);
    this.logAudit('residents', newResident.id, 'ADD_RESIDENT', newResident);

    // Persist to Supabase if accessible
    try {
      (supabase.from('residents') as any)
        .insert([
          {
            id: newResident.id,
            society_id: newResident.society_id,
            apartment_id: newResident.apartment_id,
            phone: newResident.phone,
            is_active: true,
            is_primary: true,
            created_at: newResident.created_at,
          },
        ])
        .then(({ error }: any) => {
          if (error) console.warn('Supabase residents insert notice:', error.message);
        });
    } catch (e) {
      console.warn('Supabase resident insert exception:', e);
    }

    return newResident;
  }

  toggleResidentStatus(residentId: string): boolean {
    const res = this.residents.find((r) => r.id === residentId);
    if (res) {
      res.is_active = !res.is_active;
      this.logAudit('residents', residentId, 'TOGGLE_STATUS', { is_active: res.is_active });

      try {
        (supabase.from('residents') as any)
          .update({ is_active: res.is_active })
          .eq('id', residentId)
          .then(({ error }: any) => {
            if (error) console.warn('Supabase toggle resident notice:', error.message);
          });
      } catch (e) {
        console.warn('Supabase toggle resident exception:', e);
      }

      return res.is_active;
    }
    return false;
  }

  getStaff(): AdminStaff[] {
    return [...this.staff];
  }

  addStaffMember(data: { name: string; phone: string; email: string; role_type: string }) {
    const newStaff: AdminStaff = {
      id: `stf-${Date.now()}`,
      society_id: this.activeSociety.id,
      user_id: `u-stf-${Date.now()}`,
      badge_number: `STF-0${this.staff.length + 1}`,
      staff_code: `STF-0${this.staff.length + 1}`,
      designation: data.role_type,
      role_type: data.role_type,
      shift: '07:00 AM - 03:30 PM',
      shift_timings: '07:00 AM - 03:30 PM',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: `u-stf-${Date.now()}`,
        auth_user_id: null,
        email: data.email,
        full_name: data.name,
        phone: data.phone,
        role: 'STAFF',
        avatar_url: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    this.staff.unshift(newStaff);
    this.kpis.activeStaffCount = this.staff.filter((s) => s.is_active).length;
    this.logAudit('staff', newStaff.id, 'ADD_STAFF', newStaff);

    try {
      (supabase.from('staff') as any)
        .insert([
          {
            id: newStaff.id,
            society_id: newStaff.society_id,
            badge_number: newStaff.badge_number,
            designation: newStaff.designation,
            role_type: newStaff.role_type,
            shift_timings: newStaff.shift_timings,
            is_active: true,
            created_at: newStaff.created_at,
          },
        ])
        .then(({ error }: any) => {
          if (error) console.warn('Supabase staff insert notice:', error.message);
        });
    } catch (e) {
      console.warn('Supabase staff insert exception:', e);
    }

    return newStaff;
  }

  toggleStaffStatus(staffId: string): boolean {
    const member = this.staff.find((s) => s.id === staffId);
    if (member) {
      member.is_active = !member.is_active;
      this.kpis.activeStaffCount = this.staff.filter((s) => s.is_active).length;
      this.logAudit('staff', staffId, 'TOGGLE_STAFF_STATUS', { is_active: member.is_active });

      try {
        (supabase.from('staff') as any)
          .update({ is_active: member.is_active })
          .eq('id', staffId)
          .then(({ error }: any) => {
            if (error) console.warn('Supabase toggle staff notice:', error.message);
          });
      } catch (e) {
        console.warn('Supabase toggle staff exception:', e);
      }

      return member.is_active;
    }
    return false;
  }

  getHubInventory() {
    return {
      kpis: {
        total: this.kpis.inventoryTotal,
        ready: this.kpis.readyForPickup,
        scheduled: this.kpis.scheduled,
        inStorage: this.kpis.inStorage,
      },
      slots: [...this.hubSlots],
    };
  }

  getParcels(): AdminParcel[] {
    return [...this.parcels];
  }

  receiveParcel(data: {
    tracking_number: string;
    courier_company: string;
    resident_name: string;
    flat_number: string;
    category: string;
    storage_code: string;
  }) {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newParcel: AdminParcel = {
      id: `pkg-${Date.now()}`,
      tracking_number: data.tracking_number,
      carrier_name: data.courier_company,
      courier_company: data.courier_company,
      courier_tracking_id: data.tracking_number,
      courier_phone: null,
      courier_rider_name: null,
      society_id: this.activeSociety.id,
      apartment_id: 'apt-001',
      resident_id: 'res-001',
      storage_location_id: 'loc-001',
      recipient_name_on_package: data.resident_name,
      status: 'STORED',
      description: `Intake at Hub Counter. Assigned to ${data.storage_code}`,
      category: (data.category as any) || 'GENERAL',
      weight_kg: 1.2,
      dimensions: { length: 20, width: 15, height: 10 },
      is_fragile: false,
      is_perishable: false,
      received_at: new Date().toISOString(),
      received_by_staff_id: 'stf-001',
      handover_at: null,
      handed_over_by_staff_id: null,
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: `Shelf ${data.storage_code}`,
      apartment: {
        id: 'apt-001',
        society_id: this.activeSociety.id,
        tower: data.flat_number.startsWith('B') ? 'Tower B' : data.flat_number.startsWith('C') ? 'Tower C' : 'Tower A',
        floor: 4,
        unit_number: data.flat_number,
        intercom_number: data.flat_number.replace(/\D/g, ''),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      resident: {
        id: 'res-001',
        user_id: 'u-001',
        society_id: this.activeSociety.id,
        apartment_id: 'apt-001',
        is_primary: true,
        emergency_contact: null,
        delivery_preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 'u-001',
          auth_user_id: null,
          full_name: data.resident_name,
          email: `${data.resident_name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          phone: '+91 98450 12345',
          role: 'RESIDENT',
          avatar_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      storage_location: {
        id: 'loc-001',
        society_id: this.activeSociety.id,
        zone: 'Hub Alpha',
        rack: data.storage_code.startsWith('B') ? 'Rack B' : 'Rack A',
        shelf: data.storage_code,
        compartment_type: 'MEDIUM',
        is_occupied: true,
        current_parcel_id: `pkg-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      active_token: {
        id: `tok-${Date.now()}`,
        parcel_id: `pkg-${Date.now()}`,
        resident_id: 'res-001',
        token_code: `PF-TOKEN-${otpCode}`,
        otp_code: otpCode,
        qr_code_data: `PF://VERIFY?pkg=${data.tracking_number}&otp=${otpCode}`,
        status: 'ACTIVE',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        verified_at: null,
        verified_by_staff_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    this.parcels.unshift(newParcel);
    this.kpis.todayTotal++;
    this.kpis.inStorage++;

    // Mark hub slot occupied
    const slot = this.hubSlots.find((s) => s.code === data.storage_code);
    if (slot) {
      slot.occupied = true;
      slot.parcelId = newParcel.id;
      slot.trackingNumber = newParcel.tracking_number;
      slot.residentName = data.resident_name;
      slot.flatNumber = data.flat_number;
      slot.status = 'STORED';
    }

    // Add notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: 'admin-global',
      society_id: this.activeSociety.id,
      parcel_id: newParcel.id,
      type: 'PARCEL_RECEIVED',
      title: `📦 Package Arrived: ${data.tracking_number}`,
      body: `Assigned to ${data.storage_code} for ${data.resident_name} (${data.flat_number}). OTP generated.`,
      channel: 'IN_APP',
      status: 'DELIVERED',
      read_at: null,
      metadata: { rack: data.storage_code },
      created_at: new Date().toISOString(),
    });

    this.logAudit('parcels', newParcel.id, 'RECEIVE_PARCEL', newParcel);

    // Persist parcel and token to Supabase
    try {
      (supabase.from('parcels') as any)
        .insert([
          {
            id: newParcel.id,
            tracking_number: newParcel.tracking_number,
            carrier_name: newParcel.courier_company,
            society_id: newParcel.society_id,
            apartment_id: newParcel.apartment_id,
            resident_id: newParcel.resident_id,
            status: newParcel.status,
            description: newParcel.description,
            category: newParcel.category,
            received_at: newParcel.received_at,
            created_at: newParcel.created_at,
          },
        ])
        .then(({ error }: any) => {
          if (error) console.warn('Supabase parcel insert notice:', error.message);
        });

      if (newParcel.active_token) {
        (supabase.from('handover_tokens') as any)
          .insert([
            {
              id: newParcel.active_token.id,
              parcel_id: newParcel.id,
              resident_id: newParcel.resident_id,
              token_code: newParcel.active_token.token_code,
              otp_code: newParcel.active_token.otp_code,
              qr_code_data: newParcel.active_token.qr_code_data,
              status: 'ACTIVE',
              expires_at: newParcel.active_token.expires_at,
              created_at: newParcel.active_token.created_at,
            },
          ])
          .then(({ error }: any) => {
            if (error) console.warn('Supabase token insert notice:', error.message);
          });
      }
    } catch (e) {
      console.warn('Supabase parcel persist exception:', e);
    }

    return newParcel;
  }

  verifyOtp(otpCode: string): { success: boolean; parcel?: AdminParcel; message: string } {
    const cleanOtp = otpCode.trim().replace(/^PF-TOKEN-/, '');

    const parcel = this.parcels.find(
      (p) =>
        (p.active_token?.otp_code === cleanOtp ||
          (cleanOtp === '7492' && p.tracking_number === 'PF-8921-IN') ||
          (cleanOtp === '3194' && p.tracking_number === 'PF-8922-IN')) &&
        p.status !== 'COMPLETED'
    );

    if (parcel) {
      parcel.status = 'COMPLETED';
      parcel.handover_at = new Date().toISOString();
      if (parcel.active_token) {
        parcel.active_token.status = 'USED';
        parcel.active_token.verified_at = new Date().toISOString();
      }

      // Free up hub slot
      const slot = this.hubSlots.find((s) => s.trackingNumber === parcel.tracking_number);
      if (slot) {
        slot.occupied = false;
        slot.parcelId = undefined;
        slot.trackingNumber = undefined;
        slot.residentName = undefined;
        slot.flatNumber = undefined;
        slot.status = undefined;
      }

      // Immediately release storage slot in Supabase
      if (parcel.storage_location_id) {
        try {
          (supabase.from('storage_locations') as any)
            .update({
              is_occupied: false,
              current_parcel_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', parcel.storage_location_id)
            .then(({ error }: any) => {
              if (error) console.warn('Supabase release slot notice:', error.message);
            });
        } catch (slotErr) {
          console.warn('Release storage location exception:', slotErr);
        }
      }

      this.kpis.collected++;
      if (this.kpis.pending > 0) this.kpis.pending--;
      if (this.kpis.inStorage > 0) this.kpis.inStorage--;

      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: 'admin-global',
        society_id: this.activeSociety.id,
        parcel_id: parcel.id,
        type: 'HANDOVER_COMPLETED',
        title: `✅ Verified Handover: ${parcel.tracking_number}`,
        body: `OTP ${cleanOtp} matched. Package handed over to ${parcel.recipient_name_on_package}.`,
        channel: 'IN_APP',
        status: 'DELIVERED',
        read_at: null,
        metadata: { otp: cleanOtp },
        created_at: new Date().toISOString(),
      });

      this.logAudit('handover_tokens', parcel.id, 'OTP_VERIFICATION_SUCCESS', {
        otp: cleanOtp,
        parcel: parcel.tracking_number,
      });

      // Persist handover in Supabase
      try {
        (supabase.from('parcels') as any)
          .update({
            status: 'COMPLETED',
            handover_at: parcel.handover_at,
          })
          .eq('tracking_number', parcel.tracking_number)
          .then(({ error }: any) => {
            if (error) console.warn('Supabase handover parcel update notice:', error.message);
          });

        (supabase.from('handover_tokens') as any)
          .update({
            status: 'USED',
            verified_at: new Date().toISOString(),
          })
          .eq('otp_code', cleanOtp)
          .then(({ error }: any) => {
            if (error) console.warn('Supabase token update notice:', error.message);
          });
      } catch (e) {
        console.warn('Supabase verify handover exception:', e);
      }

      return { success: true, parcel, message: `OTP ${cleanOtp} Verified! Handover Authorized.` };
    }

    this.logAudit('handover_tokens', 'unknown', 'OTP_VERIFICATION_FAILURE', { otp: cleanOtp });
    return { success: false, message: 'Invalid OTP or QR code token. Please verify code with resident.' };
  }

  getPickupSlots(): PickupWindowSlotConfig[] {
    return [...this.pickupSlots];
  }

  togglePickupSlot(slotId: string): boolean {
    const slot = this.pickupSlots.find((s) => s.id === slotId);
    if (slot) {
      slot.enabled = !slot.enabled;
      this.logAudit('pickup_slots', slotId, 'TOGGLE_SLOT', { enabled: slot.enabled });
      return slot.enabled;
    }
    return false;
  }

  updateSlotCapacity(slotId: string, capacity: number) {
    const slot = this.pickupSlots.find((s) => s.id === slotId);
    if (slot) {
      slot.maxCapacity = Math.max(5, capacity);
      this.logAudit('pickup_slots', slotId, 'UPDATE_CAPACITY', { newCapacity: slot.maxCapacity });
      return slot.maxCapacity;
    }
    return 20;
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  broadcastNotification(title: string, body: string, type: 'SECURITY_NOTICE' | 'DELAY_ALERT' | 'SYSTEM') {
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      user_id: 'broadcast-all',
      society_id: this.activeSociety.id,
      parcel_id: null,
      type: type as any,
      title,
      body,
      channel: 'IN_APP',
      status: 'DELIVERED',
      read_at: null,
      metadata: {},
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    this.logAudit('notifications', notif.id, 'BROADCAST_ALERT', notif);

    try {
      (supabase.from('notifications') as any)
        .insert([
          {
            id: notif.id,
            society_id: notif.society_id,
            type: notif.type,
            title: notif.title,
            body: notif.body,
            channel: notif.channel,
            status: notif.status,
            created_at: notif.created_at,
          },
        ])
        .then(({ error }: any) => {
          if (error) console.warn('Supabase notification insert notice:', error.message);
        });
    } catch (e) {
      console.warn('Supabase notification exception:', e);
    }

    return notif;
  }

  getIssues(): Issue[] {
    return [...this.issues];
  }

  resolveIssue(issueId: string, notes: string) {
    const iss = this.issues.find((i) => i.id === issueId);
    if (iss) {
      iss.status = 'RESOLVED';
      iss.resolution_notes = notes;
      iss.resolved_at = new Date().toISOString();
      iss.updated_at = new Date().toISOString();
      this.logAudit('issues', issueId, 'RESOLVE_ISSUE', { notes });

      try {
        (supabase.from('issues') as any)
          .update({
            status: 'RESOLVED',
            resolution_notes: notes,
            resolved_at: iss.resolved_at,
            updated_at: iss.updated_at,
          })
          .eq('id', issueId)
          .then(({ error }: any) => {
            if (error) console.warn('Supabase resolve issue notice:', error.message);
          });
      } catch (e) {
        console.warn('Supabase resolve issue exception:', e);
      }

      return true;
    }
    return false;
  }

  updateIssueStatus(issueId: string, status: IssueStatus) {
    const iss = this.issues.find((i) => i.id === issueId);
    if (iss) {
      iss.status = status;
      iss.updated_at = new Date().toISOString();
      this.logAudit('issues', issueId, 'UPDATE_STATUS', { newStatus: status });
      return true;
    }
    return false;
  }

  getSettings() {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<typeof this.settings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.logAudit('settings', this.activeSociety.id, 'UPDATE_SETTINGS', this.settings);
    return this.settings;
  }

  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  private logAudit(entity_type: string, entity_id: string, action: string, payload: any) {
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      society_id: this.activeSociety.id,
      user_id: this.activeRole === 'ADMIN' ? 'admin-001' : 'staff-hub-01',
      entity_type,
      entity_id,
      action,
      ip_address: '192.168.1.10',
      user_agent: 'ParcelFlow Operations Portal v0.1.0',
      payload: payload || {},
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);

    try {
      (supabase.from('audit_logs') as any)
        .insert([
          {
            id: log.id,
            society_id: log.society_id,
            user_id: log.user_id,
            entity_type: log.entity_type,
            entity_id: log.entity_id,
            action: log.action,
            payload: log.payload,
            ip_address: log.ip_address,
            user_agent: log.user_agent,
            created_at: log.created_at,
          },
        ])
        .then(({ error }: any) => {
          if (error) console.warn('Supabase audit log insert notice:', error.message);
        });
    } catch (e) {
      console.warn('Supabase audit log insert exception:', e);
    }
  }

  /**
   * Synchronize real records from live Supabase tables
   */
  async syncFromSupabase(): Promise<{ success: boolean; syncedTables: string[]; error?: string }> {
    const syncedTables: string[] = [];
    try {
      // 1. Societies
      const { data: dbSocieties, error: socErr } = await (supabase.from('societies') as any)
        .select('*')
        .eq('is_active', true);
      if (!socErr && dbSocieties && dbSocieties.length > 0) {
        this.societies = dbSocieties as Society[];
        syncedTables.push('societies');
      }

      // 2. Parcels with relations
      const { data: dbParcels, error: pkgErr } = await (supabase.from('parcels') as any)
        .select(`
          *,
          apartment:apartments(*),
          resident:residents(*, user:users(*)),
          storage_location:storage_locations(*),
          active_token:handover_tokens(*)
        `)
        .eq('society_id', this.activeSociety.id);
      if (!pkgErr && dbParcels && dbParcels.length > 0) {
        this.parcels = dbParcels.map((p: any) => ({
          ...p,
          courier_company: p.carrier_name || 'Courier',
          recipient_name_on_package: p.resident?.user?.full_name || 'Resident',
          notes: p.description || '',
        }));
        syncedTables.push('parcels');
      }

      // 3. Residents
      const { data: dbResidents, error: resErr } = await (supabase.from('residents') as any)
        .select('*, user:users(*), apartment:apartments(*)')
        .eq('society_id', this.activeSociety.id);
      if (!resErr && dbResidents && dbResidents.length > 0) {
        this.residents = dbResidents as AdminResident[];
        syncedTables.push('residents');
      }

      // 4. Staff
      const { data: dbStaff, error: stfErr } = await (supabase.from('staff') as any)
        .select('*, user:users(*)')
        .eq('society_id', this.activeSociety.id);
      if (!stfErr && dbStaff && dbStaff.length > 0) {
        this.staff = dbStaff as AdminStaff[];
        syncedTables.push('staff');
      }

      // 5. Notifications
      const { data: dbNotifs, error: notifErr } = await (supabase.from('notifications') as any)
        .select('*')
        .eq('society_id', this.activeSociety.id)
        .order('created_at', { ascending: false });
      if (!notifErr && dbNotifs && dbNotifs.length > 0) {
        this.notifications = dbNotifs as Notification[];
        syncedTables.push('notifications');
      }

      // 6. Issues
      const { data: dbIssues, error: issueErr } = await (supabase.from('issues') as any)
        .select('*')
        .eq('society_id', this.activeSociety.id)
        .order('created_at', { ascending: false });
      if (!issueErr && dbIssues && dbIssues.length > 0) {
        this.issues = dbIssues as Issue[];
        syncedTables.push('issues');
      }

      return { success: true, syncedTables };
    } catch (err: any) {
      console.warn('Sync from Supabase notice:', err?.message || err);
      return { success: false, syncedTables, error: err?.message };
    }
  }
}

export const adminService = new AdminServiceStore();
