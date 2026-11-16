-- ============================================================================
-- PARCELFLOW 100% IDEMPOTENT MASTER DATABASE SETUP
-- File: database/00_PARCELFLOW_ALL_IN_ONE.sql
-- Safe to run repeatedly. All triggers and policies have DROP ... IF EXISTS.
-- All table inserts have ON CONFLICT DO NOTHING / UPDATE.
-- Zero superuser / session_replication_role requirements.
-- ============================================================================

-- SECTION 1: CORE SCHEMA
-- ============================================================================
-- PARCELFLOW DATABASE SCHEMA (Supabase / PostgreSQL)
-- Description: Core schema for ParcelFlow smart locker & gated community hub
-- Version: 0.1.0
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Generic trigger function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper to safely extract current auth user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role INTO v_role
    FROM public.users
    WHERE auth_user_id = auth.uid() OR id = auth.uid()
    LIMIT 1;

    RETURN COALESCE(v_role, 'ANONYMOUS');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper to safely extract current user's society_id
CREATE OR REPLACE FUNCTION get_current_user_society_id()
RETURNS UUID AS $$
DECLARE
    v_society_id UUID;
BEGIN
    -- Check staff first
    SELECT society_id INTO v_society_id
    FROM public.staff s
    JOIN public.users u ON s.user_id = u.id
    WHERE u.auth_user_id = auth.uid() OR u.id = auth.uid()
    LIMIT 1;

    IF v_society_id IS NOT NULL THEN
        RETURN v_society_id;
    END IF;

    -- Then check residents
    SELECT society_id INTO v_society_id
    FROM public.residents r
    JOIN public.users u ON r.user_id = u.id
    WHERE u.auth_user_id = auth.uid() OR u.id = auth.uid()
    LIMIT 1;

    RETURN v_society_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. CORE ENTITIES
-- ============================================================================

-- Table 1: societies
CREATE TABLE IF NOT EXISTS public.societies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    total_towers INT NOT NULL DEFAULT 1,
    total_flats INT NOT NULL DEFAULT 0,
    hub_phone TEXT,
    hub_operating_hours TEXT DEFAULT '07:00 AM - 11:00 PM',
    settings JSONB DEFAULT '{"allow_courier_direct_gate": true, "auto_notify_whatsapp": true, "require_otp_handover": true}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_societies_updated_at ON public.societies;
DROP TRIGGER IF EXISTS trg_societies_updated_at ON public.societies;
DROP TRIGGER IF EXISTS trg_societies_updated_at ON public.societies;
CREATE TRIGGER trg_societies_updated_at BEFORE UPDATE ON public.societies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 2: apartments
CREATE TABLE IF NOT EXISTS public.apartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    tower TEXT NOT NULL, -- e.g., 'Tower A', 'Tower B', 'Tower C'
    floor INT,
    unit_number TEXT NOT NULL, -- e.g., 'A-402', 'B-104', 'C-801'
    intercom_number TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_society_tower_unit UNIQUE (society_id, tower, unit_number)
);

CREATE INDEX IF NOT EXISTS idx_apartments_society ON public.apartments(society_id);
CREATE INDEX IF NOT EXISTS idx_apartments_tower_unit ON public.apartments(tower, unit_number);

DROP TRIGGER IF EXISTS trg_apartments_updated_at ON public.apartments;
DROP TRIGGER IF EXISTS trg_apartments_updated_at ON public.apartments;
DROP TRIGGER IF EXISTS trg_apartments_updated_at ON public.apartments;
CREATE TRIGGER trg_apartments_updated_at BEFORE UPDATE ON public.apartments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 3: users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- References auth.users(id) in Supabase Auth
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('RESIDENT', 'STAFF', 'ADMIN')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 4: residents
CREATE TABLE IF NOT EXISTS public.residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    apartment_id UUID NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    emergency_contact TEXT,
    delivery_preferences JSONB NOT NULL DEFAULT '{
        "allow_locker": true,
        "allow_security_drop": true,
        "sms_alerts": true,
        "whatsapp_alerts": true,
        "preferred_pickup_window": "19:00-21:00"
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_resident_user_apartment UNIQUE (user_id, apartment_id)
);

CREATE INDEX IF NOT EXISTS idx_residents_society ON public.residents(society_id);
CREATE INDEX IF NOT EXISTS idx_residents_apartment ON public.residents(apartment_id);
CREATE INDEX IF NOT EXISTS idx_residents_user ON public.residents(user_id);

DROP TRIGGER IF EXISTS trg_residents_updated_at ON public.residents;
DROP TRIGGER IF EXISTS trg_residents_updated_at ON public.residents;
DROP TRIGGER IF EXISTS trg_residents_updated_at ON public.residents;
CREATE TRIGGER trg_residents_updated_at BEFORE UPDATE ON public.residents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 5: staff
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    badge_number TEXT UNIQUE NOT NULL,
    designation TEXT NOT NULL, -- 'Hub Supervisor', 'Gate Security Lead', 'Parcel Specialist'
    shift TEXT NOT NULL DEFAULT 'Morning (07:00 - 15:00)',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_society ON public.staff(society_id);
CREATE INDEX IF NOT EXISTS idx_staff_badge ON public.staff(badge_number);

DROP TRIGGER IF EXISTS trg_staff_updated_at ON public.staff;
DROP TRIGGER IF EXISTS trg_staff_updated_at ON public.staff;
DROP TRIGGER IF EXISTS trg_staff_updated_at ON public.staff;
CREATE TRIGGER trg_staff_updated_at BEFORE UPDATE ON public.staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 6: storage_locations
CREATE TABLE IF NOT EXISTS public.storage_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    zone TEXT NOT NULL DEFAULT 'Hub Alpha', -- e.g. 'Hub Alpha', 'Gate 1 Staging'
    rack TEXT NOT NULL, -- e.g. 'Rack A', 'Rack B'
    shelf TEXT NOT NULL, -- e.g. 'Shelf A-01', 'Shelf B-08'
    compartment_type TEXT NOT NULL CHECK (
        compartment_type IN ('SMALL', 'MEDIUM', 'LARGE', 'OVERSIZE', 'COLD_STORAGE', 'SECURE_LOCKER')
    ) DEFAULT 'MEDIUM',
    is_occupied BOOLEAN NOT NULL DEFAULT FALSE,
    current_parcel_id UUID, -- Updated dynamically when parcel is assigned
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_storage_rack_shelf UNIQUE (society_id, rack, shelf)
);

CREATE INDEX IF NOT EXISTS idx_storage_society ON public.storage_locations(society_id);
CREATE INDEX IF NOT EXISTS idx_storage_occupancy ON public.storage_locations(society_id, is_occupied);

DROP TRIGGER IF EXISTS trg_storage_locations_updated_at ON public.storage_locations;
DROP TRIGGER IF EXISTS trg_storage_locations_updated_at ON public.storage_locations;
DROP TRIGGER IF EXISTS trg_storage_locations_updated_at ON public.storage_locations;
CREATE TRIGGER trg_storage_locations_updated_at BEFORE UPDATE ON public.storage_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 7: parcels
CREATE TABLE IF NOT EXISTS public.parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number TEXT UNIQUE NOT NULL, -- e.g. 'PF-8921-IN', 'PF-8922-IN', 'PF-8923-IN'
    carrier_name TEXT NOT NULL, -- 'Amazon', 'Myntra', 'Blue Dart', 'Flipkart', 'Delhivery'
    courier_tracking_id TEXT,
    courier_phone TEXT,
    courier_rider_name TEXT,
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    apartment_id UUID NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
    resident_id UUID REFERENCES public.residents(id) ON DELETE SET NULL,
    storage_location_id UUID REFERENCES public.storage_locations(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (
        status IN (
            'CREATED',
            'RECEIVED',
            'STORED',
            'NOTIFIED',
            'SCHEDULED',
            'READY_FOR_PICKUP',
            'VERIFIED',
            'HANDED_OVER',
            'COMPLETED',
            'CANCELLED',
            'EXPIRED'
        )
    ) DEFAULT 'CREATED',
    description TEXT,
    category TEXT NOT NULL CHECK (
        category IN ('GENERAL', 'ELECTRONICS', 'CLOTHING', 'PERISHABLE', 'FRAGILE', 'DOCUMENT', 'MEDICINE')
    ) DEFAULT 'GENERAL',
    weight_kg NUMERIC(6, 2) DEFAULT 1.0,
    dimensions JSONB DEFAULT '{"length": 25, "width": 18, "height": 10}'::jsonb,
    is_fragile BOOLEAN NOT NULL DEFAULT FALSE,
    is_perishable BOOLEAN NOT NULL DEFAULT FALSE,
    received_at TIMESTAMPTZ,
    received_by_staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    handover_at TIMESTAMPTZ,
    handed_over_by_staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parcels_society_status ON public.parcels(society_id, status);
CREATE INDEX IF NOT EXISTS idx_parcels_resident ON public.parcels(resident_id);
CREATE INDEX IF NOT EXISTS idx_parcels_apartment ON public.parcels(apartment_id);
CREATE INDEX IF NOT EXISTS idx_parcels_tracking_number ON public.parcels(tracking_number);

DROP TRIGGER IF EXISTS trg_parcels_updated_at ON public.parcels;
DROP TRIGGER IF EXISTS trg_parcels_updated_at ON public.parcels;
DROP TRIGGER IF EXISTS trg_parcels_updated_at ON public.parcels;
CREATE TRIGGER trg_parcels_updated_at BEFORE UPDATE ON public.parcels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Circular foreign key resolution for storage_locations.current_parcel_id
ALTER TABLE public.storage_locations 
    DROP CONSTRAINT IF EXISTS fk_storage_current_parcel;
ALTER TABLE public.storage_locations 
    ADD CONSTRAINT fk_storage_current_parcel FOREIGN KEY (current_parcel_id) REFERENCES public.parcels(id) ON DELETE SET NULL;

-- Table 8: parcel_events
CREATE TABLE IF NOT EXISTS public.parcel_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
    from_status TEXT CHECK (
        from_status IS NULL OR from_status IN (
            'CREATED', 'RECEIVED', 'STORED', 'NOTIFIED', 'SCHEDULED', 
            'READY_FOR_PICKUP', 'VERIFIED', 'HANDED_OVER', 'COMPLETED', 'CANCELLED', 'EXPIRED'
        )
    ),
    to_status TEXT NOT NULL CHECK (
        to_status IN (
            'CREATED', 'RECEIVED', 'STORED', 'NOTIFIED', 'SCHEDULED', 
            'READY_FOR_PICKUP', 'VERIFIED', 'HANDED_OVER', 'COMPLETED', 'CANCELLED', 'EXPIRED'
        )
    ),
    description TEXT NOT NULL,
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    actor_name TEXT,
    actor_role TEXT CHECK (actor_role IN ('RESIDENT', 'STAFF', 'ADMIN', 'SYSTEM', 'COURIER')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    event_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parcel_events_parcel ON public.parcel_events(parcel_id);
CREATE INDEX IF NOT EXISTS idx_parcel_events_time ON public.parcel_events(event_time DESC);

-- Automatic Parcel Event Logger Trigger
CREATE OR REPLACE FUNCTION log_parcel_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.parcel_events (
            parcel_id, from_status, to_status, description, actor_role, metadata
        ) VALUES (
            NEW.id, NULL, NEW.status, 'Parcel registered in ParcelFlow system', 'SYSTEM', 
            jsonb_build_object('carrier', NEW.carrier_name, 'tracking_number', NEW.tracking_number)
        );
    ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.parcel_events (
            parcel_id, from_status, to_status, description, actor_role, metadata
        ) VALUES (
            NEW.id, OLD.status, NEW.status, 
            'Parcel status transitioned from ' || OLD.status || ' to ' || NEW.status, 
            COALESCE(get_current_user_role(), 'SYSTEM'),
            jsonb_build_object('storage_location_id', NEW.storage_location_id, 'updated_at', NEW.updated_at)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_parcel_status ON public.parcels;
DROP TRIGGER IF EXISTS trg_log_parcel_status ON public.parcels;
DROP TRIGGER IF EXISTS trg_log_parcel_status ON public.parcels;
CREATE TRIGGER trg_log_parcel_status AFTER INSERT OR UPDATE ON public.parcels
    FOR EACH ROW EXECUTE FUNCTION log_parcel_status_change();

-- Table 9: pickup_slots
CREATE TABLE IF NOT EXISTS public.pickup_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT NOT NULL DEFAULT 25,
    current_bookings_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('AVAILABLE', 'FULL', 'RESERVED', 'INACTIVE')) DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pickup_slot_schedule UNIQUE (society_id, slot_date, start_time, end_time)
);

CREATE INDEX IF NOT EXISTS idx_pickup_slots_lookup ON public.pickup_slots(society_id, slot_date, status);

DROP TRIGGER IF EXISTS trg_pickup_slots_updated_at ON public.pickup_slots;
DROP TRIGGER IF EXISTS trg_pickup_slots_updated_at ON public.pickup_slots;
DROP TRIGGER IF EXISTS trg_pickup_slots_updated_at ON public.pickup_slots;
CREATE TRIGGER trg_pickup_slots_updated_at BEFORE UPDATE ON public.pickup_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 10: pickup_bookings
CREATE TABLE IF NOT EXISTS public.pickup_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID REFERENCES public.societies(id) ON DELETE CASCADE,
    parcel_id UUID NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
    pickup_slot_id UUID NOT NULL REFERENCES public.pickup_slots(id) ON DELETE RESTRICT,
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    booking_status TEXT NOT NULL CHECK (
        booking_status IN ('CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
    ) DEFAULT 'CONFIRMED',
    scheduled_time_window TEXT NOT NULL, -- e.g. "8:00 PM – 8:30 PM"
    notes TEXT,
    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure society_id column exists if table was already created earlier
ALTER TABLE public.pickup_bookings ADD COLUMN IF NOT EXISTS society_id UUID REFERENCES public.societies(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_pickup_bookings_resident ON public.pickup_bookings(resident_id);
CREATE INDEX IF NOT EXISTS idx_pickup_bookings_parcel ON public.pickup_bookings(parcel_id);

DROP TRIGGER IF EXISTS trg_pickup_bookings_updated_at ON public.pickup_bookings;
DROP TRIGGER IF EXISTS trg_pickup_bookings_updated_at ON public.pickup_bookings;
DROP TRIGGER IF EXISTS trg_pickup_bookings_updated_at ON public.pickup_bookings;
CREATE TRIGGER trg_pickup_bookings_updated_at BEFORE UPDATE ON public.pickup_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 11: handover_tokens
CREATE TABLE IF NOT EXISTS public.handover_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    token_code TEXT UNIQUE NOT NULL, -- e.g. 'PF-TOKEN-7492'
    otp_code VARCHAR(8) NOT NULL, -- e.g. '7492'
    qr_code_data TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED', 'REVOKED')) DEFAULT 'ACTIVE',
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    verified_by_staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_handover_tokens_code ON public.handover_tokens(token_code);
CREATE INDEX IF NOT EXISTS idx_handover_tokens_otp ON public.handover_tokens(otp_code);
CREATE INDEX IF NOT EXISTS idx_handover_tokens_parcel ON public.handover_tokens(parcel_id);

DROP TRIGGER IF EXISTS trg_handover_tokens_updated_at ON public.handover_tokens;
DROP TRIGGER IF EXISTS trg_handover_tokens_updated_at ON public.handover_tokens;
DROP TRIGGER IF EXISTS trg_handover_tokens_updated_at ON public.handover_tokens;
CREATE TRIGGER trg_handover_tokens_updated_at BEFORE UPDATE ON public.handover_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 12: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    society_id UUID REFERENCES public.societies(id) ON DELETE CASCADE,
    parcel_id UUID REFERENCES public.parcels(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (
        type IN (
            'PARCEL_RECEIVED',
            'SLOT_SCHEDULED',
            'READY_FOR_PICKUP',
            'HANDOVER_COMPLETED',
            'DELAY_ALERT',
            'SECURITY_NOTICE',
            'SYSTEM'
        )
    ),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (
        channel IN ('IN_APP', 'WHATSAPP', 'SMS', 'EMAIL', 'PUSH')
    ) DEFAULT 'IN_APP',
    status TEXT NOT NULL CHECK (
        status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ')
    ) DEFAULT 'SENT',
    read_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON public.notifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- Table 13: authorized_collectors
CREATE TABLE IF NOT EXISTS public.authorized_collectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relation TEXT NOT NULL, -- 'Family Member', 'Domestic Helper', 'Neighbor', 'Friend'
    government_id_type TEXT, -- 'Aadhaar', 'Driving License', 'Passport'
    government_id_last4 TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_authorized_collectors_resident ON public.authorized_collectors(resident_id);

DROP TRIGGER IF EXISTS trg_authorized_collectors_updated_at ON public.authorized_collectors;
DROP TRIGGER IF EXISTS trg_authorized_collectors_updated_at ON public.authorized_collectors;
DROP TRIGGER IF EXISTS trg_authorized_collectors_updated_at ON public.authorized_collectors;
CREATE TRIGGER trg_authorized_collectors_updated_at BEFORE UPDATE ON public.authorized_collectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 14: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID REFERENCES public.societies(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g. 'PARCEL_SCAN_IN', 'TOKEN_VERIFIED', 'HANDOVER_DISPATCHED', 'PICKUP_RESCHEDULED'
    entity_type TEXT NOT NULL, -- 'parcels', 'handover_tokens', 'pickup_bookings', 'storage_locations'
    entity_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_society_action ON public.audit_logs(society_id, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- Table 15: issues
CREATE TABLE IF NOT EXISTS public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID REFERENCES public.parcels(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    reported_by_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN ('DAMAGED_PACKAGE', 'WRONG_ITEM', 'MISSING_PACKAGE', 'OTP_FAILURE', 'HUB_DELAY', 'OTHER')
    ) DEFAULT 'OTHER',
    priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'MEDIUM',
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED')) DEFAULT 'OPEN',
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_issues_society_status ON public.issues(society_id, status);

DROP TRIGGER IF EXISTS trg_issues_updated_at ON public.issues;
DROP TRIGGER IF EXISTS trg_issues_updated_at ON public.issues;
DROP TRIGGER IF EXISTS trg_issues_updated_at ON public.issues;
CREATE TRIGGER trg_issues_updated_at BEFORE UPDATE ON public.issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table 16: app_versions
CREATE TABLE IF NOT EXISTS public.app_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL CHECK (platform IN ('ANDROID', 'IOS', 'WEB')),
    version_number TEXT NOT NULL, -- e.g. '0.1.0'
    build_number INT NOT NULL DEFAULT 1,
    release_notes TEXT,
    min_supported_version TEXT NOT NULL DEFAULT '0.1.0',
    is_mandatory_update BOOLEAN NOT NULL DEFAULT FALSE,
    download_url TEXT,
    released_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_versions_platform ON public.app_versions(platform, released_at DESC);

-- Supplementary Table: pilot_requests (for landing page pilot demo onboarding)
CREATE TABLE IF NOT EXISTS public.pilot_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_name TEXT NOT NULL,
    city TEXT NOT NULL,
    total_units INT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    role TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'CONTACTED', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supplementary Table: waitlist (for app launch notifications)
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'ios', 'general')) DEFAULT 'general',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_collectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- POLICIES: app_versions, pilot_requests, waitlist (Public/Anon accessible)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view app versions" ON public.app_versions;
DROP POLICY IF EXISTS "Public can view app versions" ON public.app_versions;
DROP POLICY IF EXISTS "Public can view app versions" ON public.app_versions;
CREATE POLICY "Public can view app versions" ON public.app_versions
    FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Public can submit pilot requests" ON public.pilot_requests;
DROP POLICY IF EXISTS "Public can submit pilot requests" ON public.pilot_requests;
DROP POLICY IF EXISTS "Public can submit pilot requests" ON public.pilot_requests;
CREATE POLICY "Public can submit pilot requests" ON public.pilot_requests
    FOR INSERT TO PUBLIC WITH CHECK (true);

DROP POLICY IF EXISTS "Public can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Public can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Public can join waitlist" ON public.waitlist;
CREATE POLICY "Public can join waitlist" ON public.waitlist
    FOR INSERT TO PUBLIC WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- POLICIES: societies & apartments
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone authenticated can view active societies" ON public.societies;
DROP POLICY IF EXISTS "Anyone authenticated can view active societies" ON public.societies;
DROP POLICY IF EXISTS "Anyone authenticated can view active societies" ON public.societies;
CREATE POLICY "Anyone authenticated can view active societies" ON public.societies
    FOR SELECT TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access on societies" ON public.societies;
DROP POLICY IF EXISTS "Admin full access on societies" ON public.societies;
DROP POLICY IF EXISTS "Admin full access on societies" ON public.societies;
CREATE POLICY "Admin full access on societies" ON public.societies
    FOR ALL TO authenticated USING (get_current_user_role() = 'ADMIN');

DROP POLICY IF EXISTS "Users can view apartments in their society" ON public.apartments;
DROP POLICY IF EXISTS "Users can view apartments in their society" ON public.apartments;
DROP POLICY IF EXISTS "Users can view apartments in their society" ON public.apartments;
CREATE POLICY "Users can view apartments in their society" ON public.apartments
    FOR SELECT TO authenticated USING (society_id = get_current_user_society_id());

DROP POLICY IF EXISTS "Admin full access on apartments" ON public.apartments;
DROP POLICY IF EXISTS "Admin full access on apartments" ON public.apartments;
DROP POLICY IF EXISTS "Admin full access on apartments" ON public.apartments;
CREATE POLICY "Admin full access on apartments" ON public.apartments
    FOR ALL TO authenticated USING (get_current_user_role() = 'ADMIN');

-- ----------------------------------------------------------------------------
-- POLICIES: users
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT TO authenticated USING (id = auth.uid() OR auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Staff and Admin can view users in their society" ON public.users;
DROP POLICY IF EXISTS "Staff and Admin can view users in their society" ON public.users;
DROP POLICY IF EXISTS "Staff and Admin can view users in their society" ON public.users;
CREATE POLICY "Staff and Admin can view users in their society" ON public.users
    FOR SELECT TO authenticated USING (get_current_user_role() IN ('STAFF', 'ADMIN'));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE TO authenticated USING (id = auth.uid() OR auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Admin full access on users" ON public.users;
DROP POLICY IF EXISTS "Admin full access on users" ON public.users;
DROP POLICY IF EXISTS "Admin full access on users" ON public.users;
CREATE POLICY "Admin full access on users" ON public.users
    FOR ALL TO authenticated USING (get_current_user_role() = 'ADMIN');

-- ----------------------------------------------------------------------------
-- POLICIES: residents & staff
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Residents can view own record" ON public.residents;
DROP POLICY IF EXISTS "Residents can view own record" ON public.residents;
DROP POLICY IF EXISTS "Residents can view own record" ON public.residents;
CREATE POLICY "Residents can view own record" ON public.residents
    FOR SELECT TO authenticated USING (
        user_id = auth.uid() OR 
        user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Staff can view residents in their society" ON public.residents;
DROP POLICY IF EXISTS "Staff can view residents in their society" ON public.residents;
DROP POLICY IF EXISTS "Staff can view residents in their society" ON public.residents;
CREATE POLICY "Staff can view residents in their society" ON public.residents
    FOR SELECT TO authenticated USING (
        society_id = get_current_user_society_id() AND get_current_user_role() IN ('STAFF', 'ADMIN')
    );

DROP POLICY IF EXISTS "Staff can view staff in their society" ON public.staff;
DROP POLICY IF EXISTS "Staff can view staff in their society" ON public.staff;
DROP POLICY IF EXISTS "Staff can view staff in their society" ON public.staff;
CREATE POLICY "Staff can view staff in their society" ON public.staff
    FOR SELECT TO authenticated USING (society_id = get_current_user_society_id());

DROP POLICY IF EXISTS "Admin manage staff" ON public.staff;
DROP POLICY IF EXISTS "Admin manage staff" ON public.staff;
DROP POLICY IF EXISTS "Admin manage staff" ON public.staff;
CREATE POLICY "Admin manage staff" ON public.staff
    FOR ALL TO authenticated USING (get_current_user_role() = 'ADMIN');

-- ----------------------------------------------------------------------------
-- POLICIES: storage_locations
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff and Admin manage storage locations" ON public.storage_locations;
DROP POLICY IF EXISTS "Staff and Admin manage storage locations" ON public.storage_locations;
DROP POLICY IF EXISTS "Staff and Admin manage storage locations" ON public.storage_locations;
CREATE POLICY "Staff and Admin manage storage locations" ON public.storage_locations
    FOR ALL TO authenticated USING (
        society_id = get_current_user_society_id() AND get_current_user_role() IN ('STAFF', 'ADMIN')
    );

DROP POLICY IF EXISTS "Residents view storage locations" ON public.storage_locations;
DROP POLICY IF EXISTS "Residents view storage locations" ON public.storage_locations;
DROP POLICY IF EXISTS "Residents view storage locations" ON public.storage_locations;
CREATE POLICY "Residents view storage locations" ON public.storage_locations
    FOR SELECT TO authenticated USING (society_id = get_current_user_society_id());

-- ----------------------------------------------------------------------------
-- POLICIES: parcels
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Residents view own parcels" ON public.parcels;
DROP POLICY IF EXISTS "Residents view own parcels" ON public.parcels;
DROP POLICY IF EXISTS "Residents view own parcels" ON public.parcels;
CREATE POLICY "Residents view own parcels" ON public.parcels
    FOR SELECT TO authenticated USING (
        resident_id IN (
            SELECT r.id FROM public.residents r 
            JOIN public.users u ON r.user_id = u.id 
            WHERE u.auth_user_id = auth.uid() OR u.id = auth.uid()
        )
        OR
        apartment_id IN (
            SELECT r.apartment_id FROM public.residents r
            JOIN public.users u ON r.user_id = u.id
            WHERE u.auth_user_id = auth.uid() OR u.id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff and Admin manage society parcels" ON public.parcels;
DROP POLICY IF EXISTS "Staff and Admin manage society parcels" ON public.parcels;
DROP POLICY IF EXISTS "Staff and Admin manage society parcels" ON public.parcels;
CREATE POLICY "Staff and Admin manage society parcels" ON public.parcels
    FOR ALL TO authenticated USING (
        society_id = get_current_user_society_id() AND get_current_user_role() IN ('STAFF', 'ADMIN')
    );

-- ----------------------------------------------------------------------------
-- POLICIES: parcel_events
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Residents view parcel events for their parcels" ON public.parcel_events;
DROP POLICY IF EXISTS "Residents view parcel events for their parcels" ON public.parcel_events;
DROP POLICY IF EXISTS "Residents view parcel events for their parcels" ON public.parcel_events;
CREATE POLICY "Residents view parcel events for their parcels" ON public.parcel_events
    FOR SELECT TO authenticated USING (
        parcel_id IN (
            SELECT p.id FROM public.parcels p
            JOIN public.residents r ON p.resident_id = r.id
            JOIN public.users u ON r.user_id = u.id
            WHERE u.auth_user_id = auth.uid() OR u.id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff and Admin view and add parcel events" ON public.parcel_events;
DROP POLICY IF EXISTS "Staff and Admin view and add parcel events" ON public.parcel_events;
DROP POLICY IF EXISTS "Staff and Admin view and add parcel events" ON public.parcel_events;
CREATE POLICY "Staff and Admin view and add parcel events" ON public.parcel_events
    FOR ALL TO authenticated USING (get_current_user_role() IN ('STAFF', 'ADMIN'));

-- ----------------------------------------------------------------------------
-- POLICIES: pickup_slots & pickup_bookings
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone in society can view pickup slots" ON public.pickup_slots;
DROP POLICY IF EXISTS "Anyone in society can view pickup slots" ON public.pickup_slots;
DROP POLICY IF EXISTS "Anyone in society can view pickup slots" ON public.pickup_slots;
CREATE POLICY "Anyone in society can view pickup slots" ON public.pickup_slots
    FOR SELECT TO authenticated USING (society_id = get_current_user_society_id());

DROP POLICY IF EXISTS "Staff and Admin manage pickup slots" ON public.pickup_slots;
DROP POLICY IF EXISTS "Staff and Admin manage pickup slots" ON public.pickup_slots;
DROP POLICY IF EXISTS "Staff and Admin manage pickup slots" ON public.pickup_slots;
CREATE POLICY "Staff and Admin manage pickup slots" ON public.pickup_slots
    FOR ALL TO authenticated USING (
        society_id = get_current_user_society_id() AND get_current_user_role() IN ('STAFF', 'ADMIN')
    );

DROP POLICY IF EXISTS "Residents manage own bookings" ON public.pickup_bookings;
DROP POLICY IF EXISTS "Residents manage own bookings" ON public.pickup_bookings;
DROP POLICY IF EXISTS "Residents manage own bookings" ON public.pickup_bookings;
CREATE POLICY "Residents manage own bookings" ON public.pickup_bookings
    FOR ALL TO authenticated USING (
        resident_id IN (
            SELECT r.id FROM public.residents r 
            JOIN public.users u ON r.user_id = u.id 
            WHERE u.auth_user_id = auth.uid() OR u.id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff view and manage society bookings" ON public.pickup_bookings;
DROP POLICY IF EXISTS "Staff view and manage society bookings" ON public.pickup_bookings;
DROP POLICY IF EXISTS "Staff view and manage society bookings" ON public.pickup_bookings;
CREATE POLICY "Staff view and manage society bookings" ON public.pickup_bookings
    FOR ALL TO authenticated USING (get_current_user_role() IN ('STAFF', 'ADMIN'));

-- ----------------------------------------------------------------------------
-- POLICIES: handover_tokens
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Residents view own handover tokens" ON public.handover_tokens;
DROP POLICY IF EXISTS "Residents view own handover tokens" ON public.handover_tokens;
DROP POLICY IF EXISTS "Residents view own handover tokens" ON public.handover_tokens;
CREATE POLICY "Residents view own handover tokens" ON public.handover_tokens
    FOR SELECT TO authenticated USING (
        resident_id IN (
            SELECT r.id FROM public.residents r 
            JOIN public.users u ON r.user_id = u.id 
            WHERE u.auth_user_id = auth.uid() OR u.id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff verify handover tokens" ON public.handover_tokens;
DROP POLICY IF EXISTS "Staff verify handover tokens" ON public.handover_tokens;
DROP POLICY IF EXISTS "Staff verify handover tokens" ON public.handover_tokens;
CREATE POLICY "Staff verify handover tokens" ON public.handover_tokens
    FOR ALL TO authenticated USING (get_current_user_role() IN ('STAFF', 'ADMIN'));

-- ----------------------------------------------------------------------------
-- POLICIES: notifications
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR SELECT TO authenticated USING (
        user_id = auth.uid() OR
        user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users update own notification read state" ON public.notifications;
DROP POLICY IF EXISTS "Users update own notification read state" ON public.notifications;
DROP POLICY IF EXISTS "Users update own notification read state" ON public.notifications;
CREATE POLICY "Users update own notification read state" ON public.notifications
    FOR UPDATE TO authenticated USING (
        user_id = auth.uid() OR
        user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    );

-- ----------------------------------------------------------------------------
-- POLICIES: authorized_collectors
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Residents manage their authorized collectors" ON public.authorized_collectors;
DROP POLICY IF EXISTS "Residents manage their authorized collectors" ON public.authorized_collectors;
DROP POLICY IF EXISTS "Residents manage their authorized collectors" ON public.authorized_collectors;
CREATE POLICY "Residents manage their authorized collectors" ON public.authorized_collectors
    FOR ALL TO authenticated USING (
        resident_id IN (
            SELECT r.id FROM public.residents r 
            JOIN public.users u ON r.user_id = u.id 
            WHERE u.auth_user_id = auth.uid() OR u.id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff view authorized collectors" ON public.authorized_collectors;
DROP POLICY IF EXISTS "Staff view authorized collectors" ON public.authorized_collectors;
DROP POLICY IF EXISTS "Staff view authorized collectors" ON public.authorized_collectors;
CREATE POLICY "Staff view authorized collectors" ON public.authorized_collectors
    FOR SELECT TO authenticated USING (get_current_user_role() IN ('STAFF', 'ADMIN'));

-- ----------------------------------------------------------------------------
-- POLICIES: issues
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Residents view and create own issues" ON public.issues;
DROP POLICY IF EXISTS "Residents view and create own issues" ON public.issues;
DROP POLICY IF EXISTS "Residents view and create own issues" ON public.issues;
CREATE POLICY "Residents view and create own issues" ON public.issues
    FOR ALL TO authenticated USING (
        reported_by_user_id = auth.uid() OR
        reported_by_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Staff and Admin manage society issues" ON public.issues;
DROP POLICY IF EXISTS "Staff and Admin manage society issues" ON public.issues;
DROP POLICY IF EXISTS "Staff and Admin manage society issues" ON public.issues;
CREATE POLICY "Staff and Admin manage society issues" ON public.issues
    FOR ALL TO authenticated USING (
        society_id = get_current_user_society_id() AND get_current_user_role() IN ('STAFF', 'ADMIN')
    );

-- ----------------------------------------------------------------------------
-- POLICIES: audit_logs
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin view society audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin view society audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin view society audit logs" ON public.audit_logs;
CREATE POLICY "Admin view society audit logs" ON public.audit_logs
    FOR SELECT TO authenticated USING (get_current_user_role() = 'ADMIN');

DROP POLICY IF EXISTS "System and Staff can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System and Staff can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System and Staff can insert audit logs" ON public.audit_logs;
CREATE POLICY "System and Staff can insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);


-- SECTION 2: AUTH & ADMIN TRIGGER (vinaykumard45678@gmail.com -> ADMIN)
-- ============================================================================
-- PARCELFLOW AUTHENTICATION, PROFILES & ROLE-BASED ACCESS CONTROL (RLS)
-- File: database/auth_and_admin_setup.sql
-- Target: Supabase PostgreSQL (auth.users + public.profiles + RLS)
-- Version: 1.0.0
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. PROFILES TABLE DEFINITION
-- ============================================================================
-- Profile structure strictly linked to authenticated auth.users(id)
-- Identity rule: auth.uid() is the source of truth, never raw email alone.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'resident' CHECK (role IN ('resident', 'staff', 'admin')),
    society_id UUID REFERENCES public.societies(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Essential Performance & Search Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_society_id ON public.profiles(society_id);

-- Profile timestamp auto-update trigger
CREATE OR REPLACE FUNCTION public.handle_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_profile_updated_at();

-- ============================================================================
-- 3. SECURITY & ROLE HELPER FUNCTIONS
-- ============================================================================

-- Check if current authenticated user has 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current authenticated user has 'staff' role
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('staff', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get current authenticated user's role ('resident', 'staff', 'admin', or 'anonymous')
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_role IS NOT NULL THEN
        RETURN v_role;
    END IF;

    -- Fallback to public.users if profiles row has not synced yet
    SELECT LOWER(role) INTO v_role
    FROM public.users
    WHERE auth_user_id = auth.uid() OR id = auth.uid()
    LIMIT 1;

    RETURN COALESCE(v_role, 'anonymous');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get current authenticated user's society_id
CREATE OR REPLACE FUNCTION public.get_auth_society_id()
RETURNS UUID AS $$
DECLARE
    v_society_id UUID;
BEGIN
    -- 1. Check profiles
    SELECT society_id INTO v_society_id
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_society_id IS NOT NULL THEN
        RETURN v_society_id;
    END IF;

    -- 2. Check staff table
    SELECT society_id INTO v_society_id
    FROM public.staff s
    WHERE s.user_id = auth.uid() OR s.user_id IN (
        SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid()
    )
    LIMIT 1;

    IF v_society_id IS NOT NULL THEN
        RETURN v_society_id;
    END IF;

    -- 3. Check residents table
    SELECT society_id INTO v_society_id
    FROM public.residents r
    WHERE r.user_id = auth.uid() OR r.user_id IN (
        SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid()
    )
    LIMIT 1;

    RETURN v_society_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- 4. AUTOMATIC NEW USER HANDLER (WITH VINAYKUMARD45678@GMAIL.COM ADMIN RULE)
-- ============================================================================
-- When a user signs up via Supabase Auth (Email, Phone OTP, or Google OAuth):
-- 1. Automatically inserts a row into public.profiles
-- 2. If email is 'vinaykumard45678@gmail.com', automatically assigns role = 'admin'
-- 3. Otherwise assigns role = 'resident' (or staff if explicitly requested via metadata)
-- 4. Also keeps public.users table in sync for legacy compatibility
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role TEXT := 'resident';
    v_full_name TEXT;
    v_phone TEXT;
    v_society_id UUID := NULL;
    v_email TEXT;
BEGIN
    v_email := LOWER(TRIM(COALESCE(NEW.email, '')));

    -- Critical Business Rule: Automatic Admin Assignment for Designated Owner
    IF v_email = 'vinaykumard45678@gmail.com' THEN
        v_role := 'admin';
    ELSE
        -- Support role hint from user metadata (e.g. staff invited during onboarding)
        -- Guard: non-admins cannot request 'admin' role through raw metadata
        IF NEW.raw_user_meta_data->>'role' IN ('resident', 'staff') THEN
            v_role := NEW.raw_user_meta_data->>'role';
        ELSE
            v_role := 'resident';
        END IF;
    END IF;

    -- Resolve Full Name (from metadata or email username fallback)
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'user_name',
        NULLIF(split_part(v_email, '@', 1), ''),
        'ParcelFlow Resident'
    );

    -- Special display name for designated admin if not set
    IF v_email = 'vinaykumard45678@gmail.com' AND (v_full_name IS NULL OR v_full_name = 'vinaykumard45678') THEN
        v_full_name := 'Vinay Kumar (System Administrator)';
    END IF;

    -- Resolve Phone
    v_phone := COALESCE(
        NEW.phone,
        NEW.raw_user_meta_data->>'phone',
        NULL
    );

    -- Resolve Society ID if provided in signup metadata
    IF NEW.raw_user_meta_data->>'society_id' IS NOT NULL THEN
        BEGIN
            v_society_id := (NEW.raw_user_meta_data->>'society_id')::UUID;
        EXCEPTION WHEN OTHERS THEN
            v_society_id := NULL;
        END;
    END IF;

    -- 1. Insert or update public.profiles
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        phone,
        role,
        society_id,
        avatar_url,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        v_full_name,
        NULLIF(v_email, ''),
        v_phone,
        v_role,
        v_society_id,
        NEW.raw_user_meta_data->>'avatar_url',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = COALESCE(EXCLUDED.email, public.profiles.email),
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        -- Always promote designated admin even if profile already existed
        role = CASE 
            WHEN LOWER(TRIM(COALESCE(EXCLUDED.email, public.profiles.email, ''))) = 'vinaykumard45678@gmail.com' THEN 'admin'
            ELSE public.profiles.role 
        END,
        society_id = COALESCE(EXCLUDED.society_id, public.profiles.society_id),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW();

    -- 2. Synchronize legacy public.users table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        BEGIN
            INSERT INTO public.users (
                id,
                auth_user_id,
                email,
                phone,
                full_name,
                role,
                avatar_url,
                is_active,
                created_at,
                updated_at
            )
            VALUES (
                NEW.id,
                NEW.id,
                COALESCE(NULLIF(v_email, ''), NEW.id::TEXT || '@auth.parcelflow.in'),
                COALESCE(v_phone, '+910000000000'),
                v_full_name,
                UPPER(v_role),
                NEW.raw_user_meta_data->>'avatar_url',
                TRUE,
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                auth_user_id = EXCLUDED.auth_user_id,
                email = EXCLUDED.email,
                full_name = EXCLUDED.full_name,
                role = UPPER(v_role),
                avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
                updated_at = NOW();
        EXCEPTION WHEN OTHERS THEN
            -- Ignore duplicate conflicts in users table during sync
            NULL;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. ANTI-ROLE-ELEVATION SECURITY TRIGGER
-- ============================================================================
-- Non-admins CANNOT elevate role to 'admin' (strictly enforced at DB level)
CREATE OR REPLACE FUNCTION public.prevent_role_elevation()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if role is being altered
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Only an existing authenticated user who is already an admin can change roles
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Access Denied: You do not have permission to alter user roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_elevation ON public.profiles;
CREATE TRIGGER trg_prevent_role_elevation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_role_elevation();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Staff can view profiles in their society" ON public.profiles;
CREATE POLICY "Staff can view profiles in their society" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        society_id IS NOT NULL 
        AND society_id = public.get_auth_society_id() 
        AND public.is_staff()
    );

DROP POLICY IF EXISTS "Users can update own profile non-role" ON public.profiles;
CREATE POLICY "Users can update own profile non-role" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() 
        AND (role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()) OR public.is_admin())
    );

DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
CREATE POLICY "Admin can update any profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete any profile" ON public.profiles;
CREATE POLICY "Admin can delete any profile" ON public.profiles
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- PARCELS POLICIES (STRICT RESIDENT, STAFF, ADMIN ISOLATION)
-- ----------------------------------------------------------------------------
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage all parcels" ON public.parcels;
CREATE POLICY "Admin manage all parcels" ON public.parcels
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff manage society parcels" ON public.parcels;
CREATE POLICY "Staff manage society parcels" ON public.parcels
    FOR ALL TO authenticated
    USING (
        society_id = public.get_auth_society_id() 
        AND public.is_staff()
    )
    WITH CHECK (
        society_id = public.get_auth_society_id() 
        AND public.is_staff()
    );

DROP POLICY IF EXISTS "Residents view own parcels" ON public.parcels;
CREATE POLICY "Residents view own parcels" ON public.parcels
    FOR SELECT TO authenticated
    USING (
        -- User directly linked as resident
        resident_id = auth.uid()
        OR resident_id IN (
            SELECT r.id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
        -- Or matching apartment
        OR apartment_id IN (
            SELECT r.apartment_id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Residents update own parcel delivery notes" ON public.parcels;
CREATE POLICY "Residents update own parcel delivery notes" ON public.parcels
    FOR UPDATE TO authenticated
    USING (
        resident_id = auth.uid()
        OR resident_id IN (
            SELECT r.id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
    )
    WITH CHECK (
        -- Residents can only schedule or add notes; cannot arbitrarily mark handed over
        status IN ('CREATED', 'RECEIVED', 'STORED', 'NOTIFIED', 'SCHEDULED', 'READY_FOR_PICKUP')
    );

-- ----------------------------------------------------------------------------
-- SOCIETIES & APARTMENTS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users view active societies" ON public.societies;
CREATE POLICY "Authenticated users view active societies" ON public.societies
    FOR SELECT TO authenticated
    USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admin manage societies" ON public.societies;
CREATE POLICY "Admin manage societies" ON public.societies
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Residents and staff view apartments in their society" ON public.apartments;
CREATE POLICY "Residents and staff view apartments in their society" ON public.apartments
    FOR SELECT TO authenticated
    USING (society_id = public.get_auth_society_id() OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage apartments" ON public.apartments;
CREATE POLICY "Admin manage apartments" ON public.apartments
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- STAFF & RESIDENTS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff and Admin view society staff roster" ON public.staff;
CREATE POLICY "Staff and Admin view society staff roster" ON public.staff
    FOR SELECT TO authenticated
    USING (society_id = public.get_auth_society_id() OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage staff members" ON public.staff;
CREATE POLICY "Admin manage staff members" ON public.staff
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Residents view own record" ON public.residents;
CREATE POLICY "Residents view own record" ON public.residents
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() 
        OR user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Staff view society residents" ON public.residents;
CREATE POLICY "Staff view society residents" ON public.residents
    FOR SELECT TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_staff())
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Admin manage residents" ON public.residents;
CREATE POLICY "Admin manage residents" ON public.residents
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- STORAGE LOCATIONS & PICKUP SLOTS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Society members view storage racks" ON public.storage_locations;
CREATE POLICY "Society members view storage racks" ON public.storage_locations
    FOR SELECT TO authenticated
    USING (society_id = public.get_auth_society_id() OR public.is_admin());

DROP POLICY IF EXISTS "Staff and admin manage storage racks" ON public.storage_locations;
CREATE POLICY "Staff and admin manage storage racks" ON public.storage_locations
    FOR ALL TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_staff())
        OR public.is_admin()
    )
    WITH CHECK (
        (society_id = public.get_auth_society_id() AND public.is_staff())
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Society members view pickup slots" ON public.pickup_slots;
CREATE POLICY "Society members view pickup slots" ON public.pickup_slots
    FOR SELECT TO authenticated
    USING (society_id = public.get_auth_society_id() OR public.is_admin());

DROP POLICY IF EXISTS "Staff and admin manage pickup slots" ON public.pickup_slots;
CREATE POLICY "Staff and admin manage pickup slots" ON public.pickup_slots
    FOR ALL TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_staff())
        OR public.is_admin()
    )
    WITH CHECK (
        (society_id = public.get_auth_society_id() AND public.is_staff())
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Residents view and create pickup bookings" ON public.pickup_bookings;
CREATE POLICY "Residents view and create pickup bookings" ON public.pickup_bookings
    FOR ALL TO authenticated
    USING (
        resident_id = auth.uid()
        OR resident_id IN (
            SELECT r.id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
        OR (
            pickup_slot_id IN (SELECT ps.id FROM public.pickup_slots ps WHERE ps.society_id = public.get_auth_society_id())
            AND public.is_staff()
        )
        OR public.is_admin()
    )
    WITH CHECK (
        resident_id = auth.uid()
        OR resident_id IN (
            SELECT r.id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Residents view own handover tokens" ON public.handover_tokens;
CREATE POLICY "Residents view own handover tokens" ON public.handover_tokens
    FOR SELECT TO authenticated
    USING (
        resident_id = auth.uid()
        OR resident_id IN (
            SELECT r.id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Staff and admin verify handover tokens" ON public.handover_tokens;
CREATE POLICY "Staff and admin verify handover tokens" ON public.handover_tokens
    FOR ALL TO authenticated
    USING (public.is_staff() OR public.is_admin())
    WITH CHECK (public.is_staff() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- ISSUES, AUDIT LOGS & NOTIFICATIONS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Residents view own reported issues" ON public.issues;
CREATE POLICY "Residents view own reported issues" ON public.issues
    FOR ALL TO authenticated
    USING (
        reported_by_user_id = auth.uid()
        OR reported_by_user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        OR (society_id = public.get_auth_society_id() AND public.is_staff())
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Staff and admin manage society issues" ON public.issues;
CREATE POLICY "Staff and admin manage society issues" ON public.issues
    FOR ALL TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_staff())
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Admin view audit logs" ON public.audit_logs;
CREATE POLICY "Admin view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Staff and admin insert audit logs" ON public.audit_logs;
CREATE POLICY "Staff and admin insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (public.is_staff() OR public.is_admin());

DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR ALL TO authenticated
    USING (
        user_id = auth.uid()
        OR user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        OR public.is_admin()
    );

-- ============================================================================
-- 7. BACKFILL & MANUAL PROMOTION SCRIPT FOR VINAYKUMARD45678@GMAIL.COM
-- ============================================================================
-- If user vinaykumard45678@gmail.com has already registered in auth.users,
-- run immediate backfill promotion to assign role = 'admin'.
DO $$
DECLARE
    v_admin_auth_id UUID;
    v_first_society_id UUID;
BEGIN
    -- Locate existing user ID from auth.users
    SELECT id INTO v_admin_auth_id
    FROM auth.users
    WHERE LOWER(TRIM(email)) = 'vinaykumard45678@gmail.com'
    LIMIT 1;

    -- Fetch default society (Lakeview Residency)
    SELECT id INTO v_first_society_id
    FROM public.societies
    LIMIT 1;

    IF v_admin_auth_id IS NOT NULL THEN
        -- Upsert admin profile
        INSERT INTO public.profiles (
            id,
            full_name,
            email,
            phone,
            role,
            society_id,
            created_at,
            updated_at
        )
        VALUES (
            v_admin_auth_id,
            'Vinay Kumar (System Administrator)',
            'vinaykumard45678@gmail.com',
            '+91 99999 88888',
            'admin',
            v_first_society_id,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            full_name = 'Vinay Kumar (System Administrator)',
            email = 'vinaykumard45678@gmail.com',
            updated_at = NOW();

        -- Also promote legacy public.users if row exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
            UPDATE public.users
            SET role = 'ADMIN',
                updated_at = NOW()
            WHERE auth_user_id = v_admin_auth_id OR LOWER(TRIM(email)) = 'vinaykumard45678@gmail.com';
        END IF;

        RAISE NOTICE 'SUCCESS: vinaykumard45678@gmail.com verified and assigned ADMIN role.';
    ELSE
        RAISE NOTICE 'INFO: vinaykumard45678@gmail.com is not yet registered in auth.users. The handle_new_user() trigger will automatically promote the account to ADMIN when they sign up.';
    END IF;
END $$;

-- Admin promotion helper utility for database operators
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
    v_uid UUID;
BEGIN
    SELECT id INTO v_uid
    FROM auth.users
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(target_email))
    LIMIT 1;

    IF v_uid IS NULL THEN
        RETURN 'Error: User not found in auth.users with email ' || target_email;
    END IF;

    UPDATE public.profiles
    SET role = 'admin', updated_at = NOW()
    WHERE id = v_uid;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        UPDATE public.users
        SET role = 'ADMIN', updated_at = NOW()
        WHERE auth_user_id = v_uid OR LOWER(TRIM(email)) = LOWER(TRIM(target_email));
    END IF;

    RETURN 'Success: User ' || target_email || ' (' || v_uid || ') elevated to admin.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- SECTION 3: SEED DATA (SOCIETIES, FLATS, STAFF, RESIDENTS, RACKS, SLOTS)
-- ============================================================================
-- PARCELFLOW SEED DATA (database/seed.sql)
-- Comprehensive seed data matching user reference:
-- Societies: Lakeview Residency, Greenview Heights, Skyline Apartments, Maple Residency
-- Towers: Tower A, Tower B, Tower C
-- Staff: Ramesh K, Suresh P, Manoj T (12 total staff members)
-- Residents: Arjun Kumar, Priya Sharma, Rahul Verma, Sneha Iyer
-- Parcels: PF-8921-IN, PF-8922-IN, PF-8923-IN (+ lifecycle test parcels)
-- Storage Racks: Rack A, Rack B
-- Pickup Slots: 6:00-6:30, 6:30-7:00, 7:00-7:30, 8:00-8:30, 9:00-9:30
-- App Versions: 0.1.0 for Android, iOS, Web
-- ============================================================================

-- Triggers and foreign keys are preserved in valid dependency order

-- ----------------------------------------------------------------------------
-- 1. SOCIETIES
-- ----------------------------------------------------------------------------
INSERT INTO public.societies (id, name, code, address, city, state, postal_code, total_towers, total_flats, hub_phone, hub_operating_hours, settings, is_active)
VALUES
    (
        'a1111111-1111-1111-1111-111111111111',
        'Lakeview Residency',
        'LVR-BLR',
        'Outer Ring Road, Bellandur',
        'Bengaluru',
        'Karnataka',
        '560103',
        3,
        450,
        '+91 80 4120 7801',
        '06:30 AM - 11:30 PM',
        '{"allow_courier_direct_gate": true, "auto_notify_whatsapp": true, "require_otp_handover": true, "sms_fallback": true}'::jsonb,
        true
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        'Greenview Heights',
        'GVH-BLR',
        '24th Main, Sector 1, HSR Layout',
        'Bengaluru',
        'Karnataka',
        '560102',
        3,
        380,
        '+91 80 4120 7802',
        '07:00 AM - 11:00 PM',
        '{"allow_courier_direct_gate": true, "auto_notify_whatsapp": true, "require_otp_handover": true, "sms_fallback": true}'::jsonb,
        true
    ),
    (
        'a3333333-3333-3333-3333-333333333333',
        'Skyline Apartments',
        'SKA-BLR',
        'Sarjapur Main Road',
        'Bengaluru',
        'Karnataka',
        '560035',
        4,
        520,
        '+91 80 4120 7803',
        '07:00 AM - 10:30 PM',
        '{"allow_courier_direct_gate": false, "auto_notify_whatsapp": true, "require_otp_handover": true, "sms_fallback": false}'::jsonb,
        true
    ),
    (
        'a4444444-4444-4444-4444-444444444444',
        'Maple Residency',
        'MPR-BLR',
        'Whitefield Main Road',
        'Bengaluru',
        'Karnataka',
        '560066',
        2,
        240,
        '+91 80 4120 7804',
        '07:30 AM - 10:00 PM',
        '{"allow_courier_direct_gate": true, "auto_notify_whatsapp": true, "require_otp_handover": true, "sms_fallback": true}'::jsonb,
        true
    )
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    hub_phone = EXCLUDED.hub_phone;

-- ----------------------------------------------------------------------------
-- 2. APARTMENTS (Towers A, B, C for Lakeview & Greenview)
-- ----------------------------------------------------------------------------
INSERT INTO public.apartments (id, society_id, tower, floor, unit_number, intercom_number, is_active)
VALUES
    -- Lakeview Residency (Towers A, B, C)
    ('f1010001-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'Tower A', 4, 'A-402', '1402', true),
    ('f1010001-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', 'Tower A', 2, 'A-203', '1203', true),
    ('f1010001-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', 'Tower A', 10, 'A-1004', '1004', true),
    ('f1010001-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'Tower B', 1, 'B-104', '2104', true),
    ('f1010001-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111111', 'Tower B', 5, 'B-502', '2502', true),
    ('f1010001-0000-0000-0000-000000000006', 'a1111111-1111-1111-1111-111111111111', 'Tower C', 8, 'C-801', '3801', true),
    ('f1010001-0000-0000-0000-000000000007', 'a1111111-1111-1111-1111-111111111111', 'Tower C', 3, 'C-305', '3305', true),

    -- Greenview Heights
    ('f2020001-0000-0000-0000-000000000001', 'a2222222-2222-2222-2222-222222222222', 'Tower A', 4, 'A-402', '4402', true),
    ('f2020001-0000-0000-0000-000000000002', 'a2222222-2222-2222-2222-222222222222', 'Tower B', 1, 'B-104', '4104', true),
    ('f2020001-0000-0000-0000-000000000003', 'a2222222-2222-2222-2222-222222222222', 'Tower C', 8, 'C-801', '4801', true)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. USERS (Admin, Staff, Residents)
-- ----------------------------------------------------------------------------
INSERT INTO public.users (id, email, phone, full_name, role, avatar_url, is_active)
VALUES
    -- Admin
    ('b0000000-0000-0000-0000-000000000000', 'admin@parcelflow.in', '+91 98450 00001', 'Vikram Malhotra', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', true),

    -- 12 Staff Members (Ramesh K, Suresh P, Manoj T, etc.)
    ('b1111111-1111-1111-1111-111111111111', 'ramesh.k@parcelflow.in', '+91 98451 11001', 'Ramesh K', 'STAFF', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', true),
    ('b2222222-2222-2222-2222-222222222222', 'suresh.p@parcelflow.in', '+91 98451 11002', 'Suresh P', 'STAFF', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', true),
    ('b3333333-3333-3333-3333-333333333333', 'manoj.t@parcelflow.in', '+91 98451 11003', 'Manoj T', 'STAFF', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', true),
    ('b4444444-4444-4444-4444-444444444444', 'anil.d@parcelflow.in', '+91 98451 11004', 'Anil Deshmukh', 'STAFF', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', true),
    ('b5555555-5555-5555-5555-555555555555', 'kavita.n@parcelflow.in', '+91 98451 11005', 'Kavita Nair', 'STAFF', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', true),
    ('b6666666-6666-6666-6666-666666666666', 'rajesh.y@parcelflow.in', '+91 98451 11006', 'Rajesh Yadav', 'STAFF', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', true),
    ('b7777777-7777-7777-7777-777777777777', 'deepak.c@parcelflow.in', '+91 98451 11007', 'Deepak Chauhan', 'STAFF', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', true),
    ('b8888888-8888-8888-8888-888888888888', 'santosh.r@parcelflow.in', '+91 98451 11008', 'Santosh Rao', 'STAFF', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', true),
    ('b9999999-9999-9999-9999-999999999999', 'pooja.s@parcelflow.in', '+91 98451 11009', 'Pooja Singh', 'STAFF', 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150', true),
    ('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'vijay.m@parcelflow.in', '+91 98451 11010', 'Vijay Murthy', 'STAFF', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'arun.b@parcelflow.in', '+91 98451 11011', 'Arun Barua', 'STAFF', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', true),
    ('bccccccc-cccc-cccc-cccc-cccccccccccc', 'sunil.g@parcelflow.in', '+91 98451 11012', 'Sunil Gowda', 'STAFF', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', true),

    -- Residents (Arjun Kumar, Priya Sharma, Rahul Verma, Sneha Iyer)
    ('d1111111-1111-1111-1111-111111111111', 'arjun.kumar@gmail.com', '+91 98860 12345', 'Arjun Kumar', 'RESIDENT', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', true),
    ('d2222222-2222-2222-2222-222222222222', 'priya.sharma@gmail.com', '+91 98860 23456', 'Priya Sharma', 'RESIDENT', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', true),
    ('d3333333-3333-3333-3333-333333333333', 'rahul.verma@outlook.com', '+91 98860 34567', 'Rahul Verma', 'RESIDENT', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150', true),
    ('d4444444-4444-4444-4444-444444444444', 'sneha.iyer@gmail.com', '+91 98860 45678', 'Sneha Iyer', 'RESIDENT', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', true)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. STAFF ROSTER (12 Members across Security, Hub, Maintenance)
-- ----------------------------------------------------------------------------
INSERT INTO public.staff (id, user_id, society_id, badge_number, designation, shift, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-01', 'Hub Supervisor', 'Morning (07:00 - 15:00)', true),
    ('c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-02', 'Security & Gate Dispatch', 'Evening (15:00 - 23:00)', true),
    ('c3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-03', 'Parcel Specialist', 'Evening (15:00 - 23:00)', true),
    ('c4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-04', 'Gate Lead Officer', 'Morning (07:00 - 15:00)', true),
    ('c5555555-5555-5555-5555-555555555555', 'b5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-05', 'Inventory Controller', 'Morning (07:00 - 15:00)', true),
    ('c6666666-6666-6666-6666-666666666666', 'b6666666-6666-6666-6666-666666666666', 'a1111111-1111-1111-1111-111111111111', 'STAFF-MNT-06', 'Hardware & Locker Tech', 'Flexible', true),
    ('c7777777-7777-7777-7777-777777777777', 'b7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-07', 'Night Security Guard', 'Night (23:00 - 07:00)', true),
    ('c8888888-8888-8888-8888-888888888888', 'b8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-08', 'Handover Specialist', 'Evening (15:00 - 23:00)', true),
    ('c9999999-9999-9999-9999-999999999999', 'b9999999-9999-9999-9999-999999999999', 'a1111111-1111-1111-1111-111111111111', 'STAFF-MNT-09', 'Facility Coordinator', 'Morning (07:00 - 15:00)', true),
    ('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-10', 'Entry Barrier Monitor', 'Morning (07:00 - 15:00)', true),
    ('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a1111111-1111-1111-1111-111111111111', 'STAFF-HUB-11', 'Dispatch Associate', 'Evening (15:00 - 23:00)', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bccccccc-cccc-cccc-cccc-cccccccccccc', 'a1111111-1111-1111-1111-111111111111', 'STAFF-SEC-12', 'Relief Guard', 'Flexible', true)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. RESIDENTS
-- ----------------------------------------------------------------------------
INSERT INTO public.residents (id, user_id, society_id, apartment_id, is_primary, emergency_contact, delivery_preferences)
VALUES
    (
        'e1111111-1111-1111-1111-111111111111',
        'd1111111-1111-1111-1111-111111111111',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000001', -- A-402
        true,
        '+91 98860 99991',
        '{"allow_locker": true, "allow_security_drop": true, "sms_alerts": true, "whatsapp_alerts": true, "preferred_pickup_window": "20:00-20:30"}'::jsonb
    ),
    (
        'e2222222-2222-2222-2222-222222222222',
        'd2222222-2222-2222-2222-222222222222',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000004', -- B-104
        true,
        '+91 98860 99992',
        '{"allow_locker": true, "allow_security_drop": false, "sms_alerts": true, "whatsapp_alerts": true, "preferred_pickup_window": "18:30-19:00"}'::jsonb
    ),
    (
        'e3333333-3333-3333-3333-333333333333',
        'd3333333-3333-3333-3333-333333333333',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000006', -- C-801
        true,
        '+91 98860 99993',
        '{"allow_locker": true, "allow_security_drop": true, "sms_alerts": false, "whatsapp_alerts": true, "preferred_pickup_window": "19:00-19:30"}'::jsonb
    ),
    (
        'e4444444-4444-4444-4444-444444444444',
        'd4444444-4444-4444-4444-444444444444',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000002', -- A-203
        true,
        '+91 98860 99994',
        '{"allow_locker": true, "allow_security_drop": true, "sms_alerts": true, "whatsapp_alerts": true, "preferred_pickup_window": "21:00-21:30"}'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. STORAGE LOCATIONS (Racks A & B)
-- ----------------------------------------------------------------------------
INSERT INTO public.storage_locations (id, society_id, zone, rack, shelf, compartment_type, is_occupied)
VALUES
    -- Rack A (Shelves A-01 through A-10)
    ('s0000001-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-01', 'SMALL', false),
    ('s0000001-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-02', 'MEDIUM', false),
    ('s0000001-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-03', 'MEDIUM', true), -- Occupied by PF-8922-IN
    ('s0000001-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-04', 'LARGE', false),
    ('s0000001-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-05', 'SMALL', false),
    ('s0000001-0000-0000-0000-000000000006', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-06', 'MEDIUM', false),
    ('s0000001-0000-0000-0000-000000000007', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-07', 'SECURE_LOCKER', false),
    ('s0000001-0000-0000-0000-000000000008', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack A', 'Shelf A-08', 'COLD_STORAGE', false),

    -- Rack B (Shelves B-01 through B-12)
    ('s0000002-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-01', 'SMALL', false),
    ('s0000002-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-02', 'MEDIUM', false),
    ('s0000002-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-03', 'LARGE', false),
    ('s0000002-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-04', 'MEDIUM', false),
    ('s0000002-0000-0000-0000-000000000008', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-08', 'MEDIUM', true), -- Occupied by PF-8921-IN
    ('s0000002-0000-0000-0000-000000000012', 'a1111111-1111-1111-1111-111111111111', 'Hub Alpha', 'Rack B', 'Shelf B-12', 'LARGE', true)   -- Occupied by PF-8923-IN
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. PICKUP SLOTS (Today and Daily Recurring)
-- ----------------------------------------------------------------------------
INSERT INTO public.pickup_slots (id, society_id, slot_date, start_time, end_time, max_capacity, current_bookings_count, status)
VALUES
    ('sl000001-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '18:00:00', '18:30:00', 25, 4, 'AVAILABLE'),
    ('sl000001-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '18:30:00', '19:00:00', 25, 8, 'AVAILABLE'),
    ('sl000001-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '19:00:00', '19:30:00', 30, 12, 'AVAILABLE'),
    ('sl000001-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '20:00:00', '20:30:00', 30, 18, 'AVAILABLE'),
    ('sl000001-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '21:00:00', '21:30:00', 20, 6, 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. PARCELS (PF-8921-IN, PF-8922-IN, PF-8923-IN and lifecycle tests)
-- ----------------------------------------------------------------------------
INSERT INTO public.parcels (
    id, tracking_number, carrier_name, courier_tracking_id, courier_phone, courier_rider_name,
    society_id, apartment_id, resident_id, storage_location_id, status, description,
    category, weight_kg, dimensions, is_fragile, is_perishable, received_at, received_by_staff_id
)
VALUES
    -- Parcel 1: PF-8921-IN (Arjun Kumar, Scheduled 8:00 - 8:30 PM, Shelf B-08)
    (
        'p1111111-1111-1111-1111-111111111111',
        'PF-8921-IN',
        'Amazon',
        'AMZN-IN-88912903',
        '+91 91234 56789',
        'Mohan Lal',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000001',
        'e1111111-1111-1111-1111-111111111111',
        's0000002-0000-0000-0000-000000000008', -- Shelf B-08
        'SCHEDULED',
        'Wireless Bluetooth Noise-Cancelling Headphones',
        'ELECTRONICS',
        0.90,
        '{"length": 22, "width": 16, "height": 9}'::jsonb,
        true,
        false,
        NOW() - INTERVAL '3 hours',
        'c1111111-1111-1111-1111-111111111111'
    ),
    -- Parcel 2: PF-8922-IN (Priya Sharma, Ready for Pickup, Shelf A-03)
    (
        'p2222222-2222-2222-2222-222222222222',
        'PF-8922-IN',
        'Myntra',
        'MYN-BLR-401923',
        '+91 91234 56790',
        'Kishore Kumar',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000004',
        'e2222222-2222-2222-2222-222222222222',
        's0000001-0000-0000-0000-000000000003', -- Shelf A-03
        'READY_FOR_PICKUP',
        'Athletic Running Shoes & Apparel',
        'CLOTHING',
        1.40,
        '{"length": 32, "width": 20, "height": 12}'::jsonb,
        false,
        false,
        NOW() - INTERVAL '2 hours',
        'c2222222-2222-2222-2222-222222222222'
    ),
    -- Parcel 3: PF-8923-IN (Rahul Verma, Stored, Shelf B-12)
    (
        'p3333333-3333-3333-3333-333333333333',
        'PF-8923-IN',
        'Blue Dart',
        'BD-EXP-772109',
        '+91 91234 56791',
        'Girish N',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000006',
        'e3333333-3333-3333-3333-333333333333',
        's0000002-0000-0000-0000-000000000012', -- Shelf B-12
        'STORED',
        'Financial Documents & Bank Cheque Books',
        'DOCUMENT',
        2.20,
        '{"length": 35, "width": 25, "height": 8}'::jsonb,
        false,
        false,
        NOW() - INTERVAL '1 hour',
        'c3333333-3333-3333-3333-333333333333'
    ),
    -- Parcel 4: PF-8924-IN (Sneha Iyer, Completed Handover)
    (
        'p4444444-4444-4444-4444-444444444444',
        'PF-8924-IN',
        'Flipkart',
        'FK-IN-10928374',
        '+91 91234 56792',
        'Tanveer S',
        'a1111111-1111-1111-1111-111111111111',
        'f1010001-0000-0000-0000-000000000002',
        'e4444444-4444-4444-4444-444444444444',
        NULL,
        'COMPLETED',
        'Kitchen Cookware Set',
        'GENERAL',
        3.10,
        '{"length": 40, "width": 30, "height": 20}'::jsonb,
        false,
        false,
        NOW() - INTERVAL '8 hours',
        'c1111111-1111-1111-1111-111111111111'
    )
ON CONFLICT (id) DO NOTHING;

-- Link occupied storage locations to their active parcels
UPDATE public.storage_locations SET current_parcel_id = 'p1111111-1111-1111-1111-111111111111' WHERE id = 's0000002-0000-0000-0000-000000000008';
UPDATE public.storage_locations SET current_parcel_id = 'p2222222-2222-2222-2222-222222222222' WHERE id = 's0000001-0000-0000-0000-000000000003';
UPDATE public.storage_locations SET current_parcel_id = 'p3333333-3333-3333-3333-333333333333' WHERE id = 's0000002-0000-0000-0000-000000000012';

-- ----------------------------------------------------------------------------
-- 9. PICKUP BOOKINGS
-- ----------------------------------------------------------------------------
INSERT INTO public.pickup_bookings (id, parcel_id, pickup_slot_id, resident_id, booking_status, scheduled_time_window, notes)
VALUES
    (
        'b0000001-0000-0000-0000-000000000001',
        'p1111111-1111-1111-1111-111111111111',
        'sl000001-0000-0000-0000-000000000004', -- 20:00 - 20:30
        'e1111111-1111-1111-1111-111111111111',
        'CONFIRMED',
        '8:00 PM – 8:30 PM',
        'Will collect right after evening gym session.'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 10. HANDOVER TOKENS (OTP & QR)
-- ----------------------------------------------------------------------------
INSERT INTO public.handover_tokens (id, parcel_id, resident_id, token_code, otp_code, qr_code_data, status, expires_at)
VALUES
    (
        't1111111-1111-1111-1111-111111111111',
        'p1111111-1111-1111-1111-111111111111',
        'e1111111-1111-1111-1111-111111111111',
        'PF-TOKEN-7492',
        '7492',
        'PF://VERIFY?pkg=PF-8921-IN&otp=7492&apt=A-402&ts=' || EXTRACT(EPOCH FROM NOW())::TEXT,
        'ACTIVE',
        NOW() + INTERVAL '24 hours'
    ),
    (
        't2222222-2222-2222-2222-222222222222',
        'p2222222-2222-2222-2222-222222222222',
        'e2222222-2222-2222-2222-222222222222',
        'PF-TOKEN-3194',
        '3194',
        'PF://VERIFY?pkg=PF-8922-IN&otp=3194&apt=B-104&ts=' || EXTRACT(EPOCH FROM NOW())::TEXT,
        'ACTIVE',
        NOW() + INTERVAL '24 hours'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 11. PARCEL AUDIT & STATUS EVENTS
-- ----------------------------------------------------------------------------
INSERT INTO public.parcel_events (id, parcel_id, from_status, to_status, description, actor_name, actor_role, metadata, event_time)
VALUES
    (
        'ev000001-0000-0000-0000-000000000001',
        'p1111111-1111-1111-1111-111111111111',
        NULL,
        'RECEIVED',
        'Courier Mohan Lal checked in package at Society Hub Gate',
        'Suresh P',
        'STAFF',
        '{"courier": "Amazon", "gate": "Main Entry 1"}'::jsonb,
        NOW() - INTERVAL '3 hours'
    ),
    (
        'ev000001-0000-0000-0000-000000000002',
        'p1111111-1111-1111-1111-111111111111',
        'RECEIVED',
        'STORED',
        'Placed in Storage Rack B, Shelf B-08 by supervisor',
        'Ramesh K',
        'STAFF',
        '{"rack": "Rack B", "shelf": "Shelf B-08"}'::jsonb,
        NOW() - INTERVAL '2 hours 45 minutes'
    ),
    (
        'ev000001-0000-0000-0000-000000000003',
        'p1111111-1111-1111-1111-111111111111',
        'STORED',
        'NOTIFIED',
        'Notification sent to resident Arjun Kumar via WhatsApp & In-App',
        'ParcelFlow Bot',
        'SYSTEM',
        '{"channels": ["WHATSAPP", "IN_APP"]}'::jsonb,
        NOW() - INTERVAL '2 hours 44 minutes'
    ),
    (
        'ev000001-0000-0000-0000-000000000004',
        'p1111111-1111-1111-1111-111111111111',
        'NOTIFIED',
        'SCHEDULED',
        'Resident scheduled pickup window for 8:00 PM – 8:30 PM',
        'Arjun Kumar',
        'RESIDENT',
        '{"slot": "20:00-20:30", "token": "PF-TOKEN-7492"}'::jsonb,
        NOW() - INTERVAL '1 hour 30 minutes'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 12. NOTIFICATIONS
-- ----------------------------------------------------------------------------
INSERT INTO public.notifications (id, user_id, society_id, parcel_id, type, title, body, channel, status)
VALUES
    (
        'n1111111-1111-1111-1111-111111111111',
        'd1111111-1111-1111-1111-111111111111', -- Arjun
        'a1111111-1111-1111-1111-111111111111',
        'p1111111-1111-1111-1111-111111111111',
        'SLOT_SCHEDULED',
        'Pickup Scheduled for 8:00 PM',
        'Your Amazon parcel is scheduled for pickup at Shelf B-08. Show OTP 7492 at the counter.',
        'IN_APP',
        'SENT'
    ),
    (
        'n2222222-2222-2222-2222-222222222222',
        'd2222222-2222-2222-2222-222222222222', -- Priya
        'a1111111-1111-1111-1111-111111111111',
        'p2222222-2222-2222-2222-222222222222',
        'READY_FOR_PICKUP',
        'Your Myntra package has arrived!',
        'Checked into Shelf A-03. Please select a convenient pickup time in the app.',
        'WHATSAPP',
        'DELIVERED'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 13. AUTHORIZED COLLECTORS
-- ----------------------------------------------------------------------------
INSERT INTO public.authorized_collectors (id, resident_id, name, phone, relation, government_id_type, government_id_last4)
VALUES
    (
        'ac000001-0000-0000-0000-000000000001',
        'e1111111-1111-1111-1111-111111111111', -- Arjun
        'Rohan Kumar',
        '+91 98860 11223',
        'Family Member',
        'Aadhaar',
        '4829'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 14. AUDIT LOGS
-- ----------------------------------------------------------------------------
INSERT INTO public.audit_logs (id, society_id, user_id, action, entity_type, entity_id, payload)
VALUES
    (
        'al000001-0000-0000-0000-000000000001',
        'a1111111-1111-1111-1111-111111111111',
        'b2222222-2222-2222-2222-222222222222',
        'PARCEL_SCAN_IN',
        'parcels',
        'p1111111-1111-1111-1111-111111111111',
        '{"carrier": "Amazon", "tracking_number": "PF-8921-IN", "gate": 1}'::jsonb
    ),
    (
        'al000001-0000-0000-0000-000000000002',
        'a1111111-1111-1111-1111-111111111111',
        'b1111111-1111-1111-1111-111111111111',
        'STORAGE_ASSIGNED',
        'storage_locations',
        's0000002-0000-0000-0000-000000000008',
        '{"rack": "Rack B", "shelf": "Shelf B-08"}'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 15. ISSUES
-- ----------------------------------------------------------------------------
INSERT INTO public.issues (id, parcel_id, society_id, reported_by_user_id, title, description, category, priority, status)
VALUES
    (
        'is000001-0000-0000-0000-000000000001',
        'p3333333-3333-3333-3333-333333333333',
        'a1111111-1111-1111-1111-111111111111',
        'd3333333-3333-3333-3333-333333333333',
        'Outer cardboard seal slightly torn upon arrival',
        'Courier Blue Dart noted seal tear during gate handoff. Hub specialist inspected contents: intact.',
        'DAMAGED_PACKAGE',
        'LOW',
        'RESOLVED'
    )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 16. APP VERSIONS (Version 0.1.0)
-- ----------------------------------------------------------------------------
INSERT INTO public.app_versions (id, platform, version_number, build_number, release_notes, min_supported_version, is_mandatory_update, download_url, released_at)
VALUES
    (
        'v0000001-0000-0000-0000-000000000001',
        'ANDROID',
        '0.1.0',
        1001,
        'Initial MVP release: Unified Resident, Staff & Admin portals, QR/OTP verification, slot scheduling, and real-time alerts.',
        '0.1.0',
        false,
        '/downloads/android/ParcelFlow.apk',
        NOW()
    ),
    (
        'v0000001-0000-0000-0000-000000000002',
        'IOS',
        '0.1.0',
        1001,
        'Initial TestFlight beta release: Slot booking and secure handover verification.',
        '0.1.0',
        false,
        'https://testflight.apple.com/join/parcelflow',
        NOW()
    ),
    (
        'v0000001-0000-0000-0000-000000000003',
        'WEB',
        '0.1.0',
        1001,
        'Web portal & Admin dashboard release.',
        '0.1.0',
        false,
        'https://parcelflow.in',
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- End of seed data

