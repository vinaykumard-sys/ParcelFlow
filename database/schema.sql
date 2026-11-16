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
