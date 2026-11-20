-- ============================================================================
-- PARCELFLOW AUTHENTICATION, PROFILES & ROLE-BASED ACCESS CONTROL (RLS)
-- File: database/auth_and_admin_setup.sql
-- Target: Supabase PostgreSQL (auth.users + public.profiles + RLS)
-- Version: 2.0.0 - Permanent Identity & 4-Tier RBAC Architecture
-- Roles: SUPER_ADMIN, SOCIETY_ADMIN, SECURITY, RESIDENT
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. PROFILES TABLE DEFINITION
-- ============================================================================
-- Profile structure strictly linked to authenticated auth.users(id)
-- Identity invariant: auth.uid() is the permanent source of truth.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'RESIDENT' CHECK (role IN ('SUPER_ADMIN', 'SOCIETY_ADMIN', 'SECURITY', 'RESIDENT')),
    society_id UUID REFERENCES public.societies(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Upgrade existing profiles check constraint if upgrading in-place
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('SUPER_ADMIN', 'SOCIETY_ADMIN', 'SECURITY', 'RESIDENT'));

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
-- 3. SECURITY & ROLE HELPER FUNCTIONS (4-TIER RBAC)
-- ============================================================================

-- Check if current authenticated user has 'SUPER_ADMIN' role
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Fixed Root Owner UID verification
    IF auth.uid() = '0c9c3244-8680-4141-b119-ffecf87c804d'::UUID THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'SUPER_ADMIN' OR UPPER(role) = 'ADMIN')
    ) OR EXISTS (
        SELECT 1 FROM public.users
        WHERE (auth_user_id = auth.uid() OR id = auth.uid()) AND (UPPER(role) = 'SUPER_ADMIN' OR UPPER(role) = 'ADMIN')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current authenticated user has 'SOCIETY_ADMIN' role for a given society
CREATE OR REPLACE FUNCTION public.is_society_admin(target_society_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN TRUE;
    END IF;

    IF target_society_id IS NULL THEN
        RETURN EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'SOCIETY_ADMIN'
        );
    ELSE
        RETURN EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'SOCIETY_ADMIN' AND society_id = target_society_id
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current authenticated user has operational 'SECURITY' role
CREATE OR REPLACE FUNCTION public.is_security(target_society_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN TRUE;
    END IF;

    IF target_society_id IS NULL THEN
        RETURN EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('SECURITY', 'SOCIETY_ADMIN')
        ) OR EXISTS (
            SELECT 1 FROM public.staff s
            WHERE s.user_id = auth.uid() OR s.user_id IN (
                SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid()
            )
        );
    ELSE
        RETURN EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('SECURITY', 'SOCIETY_ADMIN') AND society_id = target_society_id
        ) OR EXISTS (
            SELECT 1 FROM public.staff s
            WHERE (s.user_id = auth.uid() OR s.user_id IN (
                SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid()
            )) AND s.society_id = target_society_id
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Backward compatibility helpers for legacy queries
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.is_super_admin() OR public.is_society_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.is_security();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get current authenticated user's canonical role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    IF auth.uid() = '0c9c3244-8680-4141-b119-ffecf87c804d'::UUID THEN
        RETURN 'SUPER_ADMIN';
    END IF;

    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_role IS NOT NULL THEN
        IF UPPER(v_role) = 'ADMIN' THEN RETURN 'SUPER_ADMIN'; END IF;
        IF UPPER(v_role) = 'STAFF' THEN RETURN 'SECURITY'; END IF;
        RETURN UPPER(v_role);
    END IF;

    -- Fallback to public.users if profiles row has not synced yet
    SELECT UPPER(role) INTO v_role
    FROM public.users
    WHERE auth_user_id = auth.uid() OR id = auth.uid()
    LIMIT 1;

    IF v_role IS NOT NULL THEN
        IF v_role = 'ADMIN' THEN RETURN 'SUPER_ADMIN'; END IF;
        IF v_role = 'STAFF' THEN RETURN 'SECURITY'; END IF;
        RETURN v_role;
    END IF;

    RETURN 'ANONYMOUS';
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
-- 4. AUTOMATIC NEW USER HANDLER (WITH FIXED VINAYKUMARD45678@GMAIL.COM ADMIN RULE)
-- ============================================================================
-- Business Rules:
-- 1. Fixed Admin: vinaykumard45678@gmail.com / 0c9c3244-8680-4141-b119-ffecf87c804d strictly maps to SUPER_ADMIN.
-- 2. Default role for all public new signups is strictly RESIDENT.
-- 3. Client-side role selection/metadata tampering is completely ignored.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role TEXT := 'RESIDENT';
    v_full_name TEXT;
    v_phone TEXT;
    v_society_id UUID := NULL;
    v_email TEXT;
BEGIN
    v_email := LOWER(TRIM(COALESCE(NEW.email, '')));

    -- Critical Security Invariant: Fixed Super Admin Account
    IF v_email = 'vinaykumard45678@gmail.com' OR NEW.id = '0c9c3244-8680-4141-b119-ffecf87c804d'::UUID THEN
        v_role := 'SUPER_ADMIN';
    ELSE
        -- Default role for new users is RESIDENT. Client cannot self-promote.
        v_role := 'RESIDENT';
    END IF;

    -- Resolve Full Name
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'user_name',
        NULLIF(split_part(v_email, '@', 1), ''),
        'ParcelFlow Resident'
    );

    IF (v_email = 'vinaykumard45678@gmail.com' OR NEW.id = '0c9c3244-8680-4141-b119-ffecf87c804d'::UUID) 
       AND (v_full_name IS NULL OR v_full_name = 'vinaykumard45678') THEN
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
        END IF;
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
        role = CASE 
            WHEN LOWER(TRIM(COALESCE(EXCLUDED.email, public.profiles.email, ''))) = 'vinaykumard45678@gmail.com' 
                 OR EXCLUDED.id = '0c9c3244-8680-4141-b119-ffecf87c804d'::UUID THEN 'SUPER_ADMIN'
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
                v_role,
                NEW.raw_user_meta_data->>'avatar_url',
                TRUE,
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                auth_user_id = EXCLUDED.auth_user_id,
                email = EXCLUDED.email,
                full_name = EXCLUDED.full_name,
                role = CASE
                    WHEN LOWER(TRIM(COALESCE(EXCLUDED.email, public.users.email, ''))) = 'vinaykumard45678@gmail.com' 
                         OR EXCLUDED.id = '0c9c3244-8680-4141-b119-ffecf87c804d'::UUID THEN 'SUPER_ADMIN'
                    ELSE public.users.role
                END,
                avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
                updated_at = NOW();
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END IF;
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
-- 5. ANTI-ROLE-ELEVATION SECURITY TRIGGERS
-- ============================================================================
-- 1. SUPER_ADMIN can NEVER be self-assigned or created by society admins.
-- 2. SECURITY staff accounts can ONLY be created by authorized Admin/Society Admin.
CREATE OR REPLACE FUNCTION public.prevent_role_elevation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Rule 1: SUPER_ADMIN can never be self-assigned or created by society admins
        IF NEW.role = 'SUPER_ADMIN' THEN
            IF NOT (auth.uid() = '0c9c3244-8680-4141-b119-ffecf87c804d'::UUID OR public.is_super_admin()) THEN
                RAISE EXCEPTION 'Access Denied: SUPER_ADMIN role can never be self-assigned or created by society admins.';
            END IF;
        END IF;

        -- Rule 2: SOCIETY_ADMIN or SECURITY can only be assigned by Super Admin or authorized Society Admin
        IF NEW.role IN ('SOCIETY_ADMIN', 'SECURITY') THEN
            IF NOT (public.is_super_admin() OR (public.is_society_admin(NEW.society_id) AND NEW.society_id IS NOT NULL)) THEN
                RAISE EXCEPTION 'Access Denied: SECURITY staff accounts can ONLY be created by authorized Admin/Society Admin.';
            END IF;
        END IF;

        -- Rule 3: Normal users cannot alter roles
        IF NOT (public.is_super_admin() OR public.is_society_admin()) THEN
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

-- Guard legacy public.users against unauthorized role modifications
CREATE OR REPLACE FUNCTION public.prevent_user_role_elevation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF NOT public.is_super_admin() THEN
            RAISE EXCEPTION 'Access Denied: You do not have permission to alter user roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        DROP TRIGGER IF EXISTS trg_prevent_user_role_elevation ON public.users;
        CREATE TRIGGER trg_prevent_user_role_elevation
            BEFORE UPDATE ON public.users
            FOR EACH ROW EXECUTE FUNCTION public.prevent_user_role_elevation();
    END IF;
END $$;

-- Staff table creation validator: only Super Admin or Society Admin of that society
CREATE OR REPLACE FUNCTION public.validate_staff_creation()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (public.is_super_admin() OR (public.is_society_admin(NEW.society_id) AND NEW.society_id IS NOT NULL)) THEN
        RAISE EXCEPTION 'Access Denied: SECURITY staff accounts can ONLY be created by authorized Admin/Society Admin.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_validate_staff_creation ON public.staff;
CREATE TRIGGER trg_validate_staff_creation
    BEFORE INSERT OR UPDATE ON public.staff
    FOR EACH ROW EXECUTE FUNCTION public.validate_staff_creation();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        id = auth.uid()
        OR public.is_super_admin()
        OR (society_id IS NOT NULL AND society_id = public.get_auth_society_id() AND public.is_security())
    );

DROP POLICY IF EXISTS "Users can update own profile non-role" ON public.profiles;
CREATE POLICY "Users can update own profile non-role" ON public.profiles
    FOR UPDATE TO authenticated
    USING (
        id = auth.uid() 
        OR public.is_super_admin() 
        OR (society_id = public.get_auth_society_id() AND public.is_society_admin())
    )
    WITH CHECK (
        (id = auth.uid() AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
        OR public.is_super_admin()
        OR (society_id = public.get_auth_society_id() AND public.is_society_admin() AND role != 'SUPER_ADMIN')
    );

DROP POLICY IF EXISTS "Admin can delete any profile" ON public.profiles;
CREATE POLICY "Admin can delete any profile" ON public.profiles
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

-- ----------------------------------------------------------------------------
-- PARCELS POLICIES (STRICT RESIDENT & SECURITY ISOLATION)
-- ----------------------------------------------------------------------------
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage all parcels" ON public.parcels;
DROP POLICY IF EXISTS "Staff manage society parcels" ON public.parcels;
DROP POLICY IF EXISTS "Residents view own parcels" ON public.parcels;
DROP POLICY IF EXISTS "Residents update own parcel delivery notes" ON public.parcels;

CREATE POLICY "Residents view own parcels" ON public.parcels
    FOR SELECT TO authenticated
    USING (
        -- Resident views only parcels linked to their UID or flat
        resident_id = auth.uid()
        OR resident_id IN (
            SELECT r.id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
        OR apartment_id IN (
            SELECT r.apartment_id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
        -- Security & Society Admin view only operational parcels in their society
        OR (society_id = public.get_auth_society_id() AND public.is_security())
        -- Super Admin views all
        OR public.is_super_admin()
    );

CREATE POLICY "Security and Admin insert society parcels" ON public.parcels
    FOR INSERT TO authenticated
    WITH CHECK (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    );

CREATE POLICY "Security and Admin update society parcels" ON public.parcels
    FOR UPDATE TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
        OR (
            (resident_id = auth.uid() OR resident_id IN (SELECT r.id FROM public.residents r WHERE r.user_id = auth.uid()))
            AND status NOT IN ('HANDED_OVER', 'COMPLETED', 'CANCELLED', 'EXPIRED')
        )
    )
    WITH CHECK (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
        OR (
            (resident_id = auth.uid() OR resident_id IN (SELECT r.id FROM public.residents r WHERE r.user_id = auth.uid()))
            AND status NOT IN ('HANDED_OVER', 'COMPLETED', 'CANCELLED', 'EXPIRED')
        )
    );

CREATE POLICY "Admins delete society parcels" ON public.parcels
    FOR DELETE TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_society_admin())
        OR public.is_super_admin()
    );

-- ----------------------------------------------------------------------------
-- SOCIETIES & APARTMENTS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users view active societies" ON public.societies;
CREATE POLICY "Authenticated users view active societies" ON public.societies
    FOR SELECT TO authenticated
    USING (is_active = TRUE OR public.is_super_admin());

DROP POLICY IF EXISTS "Admin manage societies" ON public.societies;
CREATE POLICY "Admin manage societies" ON public.societies
    FOR ALL TO authenticated
    USING (public.is_super_admin() OR (id = public.get_auth_society_id() AND public.is_society_admin()))
    WITH CHECK (public.is_super_admin() OR (id = public.get_auth_society_id() AND public.is_society_admin()));

DROP POLICY IF EXISTS "Residents and staff view apartments in their society" ON public.apartments;
CREATE POLICY "Residents and staff view apartments in their society" ON public.apartments
    FOR SELECT TO authenticated
    USING (society_id = public.get_auth_society_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "Admin manage apartments" ON public.apartments;
CREATE POLICY "Admin manage apartments" ON public.apartments
    FOR ALL TO authenticated
    USING (public.is_super_admin() OR (society_id = public.get_auth_society_id() AND public.is_society_admin()))
    WITH CHECK (public.is_super_admin() OR (society_id = public.get_auth_society_id() AND public.is_society_admin()));

-- ----------------------------------------------------------------------------
-- STAFF & RESIDENTS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff and Admin view society staff roster" ON public.staff;
CREATE POLICY "Staff and Admin view society staff roster" ON public.staff
    FOR SELECT TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "Admin manage staff members" ON public.staff;
CREATE POLICY "Admin manage staff members" ON public.staff
    FOR ALL TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_society_admin())
        OR public.is_super_admin()
    )
    WITH CHECK (
        (society_id = public.get_auth_society_id() AND public.is_society_admin())
        OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "Residents view own record" ON public.residents;
CREATE POLICY "Residents view own record" ON public.residents
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() 
        OR user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        OR (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "Admin manage residents" ON public.residents;
CREATE POLICY "Admin manage residents" ON public.residents
    FOR ALL TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_society_admin())
        OR public.is_super_admin()
        OR (user_id = auth.uid())
    )
    WITH CHECK (
        (society_id = public.get_auth_society_id() AND public.is_society_admin())
        OR public.is_super_admin()
        OR (user_id = auth.uid())
    );

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
    USING (society_id = public.get_auth_society_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "Staff and admin manage storage racks" ON public.storage_locations;
CREATE POLICY "Staff and admin manage storage racks" ON public.storage_locations
    FOR ALL TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    )
    WITH CHECK (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "Society members view pickup slots" ON public.pickup_slots;
CREATE POLICY "Society members view pickup slots" ON public.pickup_slots
    FOR SELECT TO authenticated
    USING (society_id = public.get_auth_society_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "Staff and admin manage pickup slots" ON public.pickup_slots;
CREATE POLICY "Staff and admin manage pickup slots" ON public.pickup_slots
    FOR ALL TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    )
    WITH CHECK (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
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
        OR (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    )
    WITH CHECK (
        resident_id = auth.uid()
        OR resident_id IN (
            SELECT r.id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
        OR (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
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
        OR (
            public.is_security() 
            AND parcel_id IN (SELECT p.id FROM public.parcels p WHERE p.society_id = public.get_auth_society_id())
        )
        OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "Residents create own handover tokens" ON public.handover_tokens;
CREATE POLICY "Residents create own handover tokens" ON public.handover_tokens
    FOR INSERT TO authenticated
    WITH CHECK (
        resident_id = auth.uid()
        OR resident_id IN (
            SELECT r.id FROM public.residents r 
            WHERE r.user_id = auth.uid() 
               OR r.user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        )
        OR (
            public.is_security() 
            AND parcel_id IN (SELECT p.id FROM public.parcels p WHERE p.society_id = public.get_auth_society_id())
        )
        OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "Staff and admin verify handover tokens" ON public.handover_tokens;
CREATE POLICY "Staff and admin verify handover tokens" ON public.handover_tokens
    FOR UPDATE TO authenticated
    USING (
        (public.is_security() AND parcel_id IN (SELECT p.id FROM public.parcels p WHERE p.society_id = public.get_auth_society_id()))
        OR public.is_super_admin()
    )
    WITH CHECK (
        (public.is_security() AND parcel_id IN (SELECT p.id FROM public.parcels p WHERE p.society_id = public.get_auth_society_id()))
        OR public.is_super_admin()
    );

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
        OR (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "Staff and admin manage society issues" ON public.issues;
CREATE POLICY "Staff and admin manage society issues" ON public.issues
    FOR ALL TO authenticated
    USING (
        (society_id = public.get_auth_society_id() AND public.is_security())
        OR public.is_super_admin()
    );

DROP POLICY IF EXISTS "Admin view audit logs" ON public.audit_logs;
CREATE POLICY "Admin view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        public.is_super_admin()
        OR (society_id = public.get_auth_society_id() AND public.is_society_admin())
    );

DROP POLICY IF EXISTS "Staff and admin insert audit logs" ON public.audit_logs;
CREATE POLICY "Staff and admin insert audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR ALL TO authenticated
    USING (
        user_id = auth.uid()
        OR user_id IN (SELECT u.id FROM public.users u WHERE u.auth_user_id = auth.uid())
        OR public.is_super_admin()
    );

-- ============================================================================
-- 7. BACKFILL & MANUAL PROMOTION SCRIPT FOR VINAYKUMARD45678@GMAIL.COM
-- ============================================================================
DO $$
DECLARE
    v_admin_auth_id UUID := '0c9c3244-8680-4141-b119-ffecf87c804d'::UUID;
    v_first_society_id UUID;
BEGIN
    SELECT id INTO v_first_society_id FROM public.societies LIMIT 1;

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
        'SUPER_ADMIN',
        v_first_society_id,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'SUPER_ADMIN',
        full_name = 'Vinay Kumar (System Administrator)',
        email = 'vinaykumard45678@gmail.com',
        updated_at = NOW();

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
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
            v_admin_auth_id,
            v_admin_auth_id,
            'vinaykumard45678@gmail.com',
            '+91 99999 88888',
            'Vinay Kumar (System Administrator)',
            'SUPER_ADMIN',
            NULL,
            TRUE,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            auth_user_id = v_admin_auth_id,
            email = 'vinaykumard45678@gmail.com',
            role = 'SUPER_ADMIN',
            updated_at = NOW();
    END IF;

    RAISE NOTICE 'SUCCESS: Fixed SUPER_ADMIN 0c9c3244-8680-4141-b119-ffecf87c804d (vinaykumard45678@gmail.com) provisioned.';
END $$;

-- Admin promotion helper utility for database operators (only usable by super_admin)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email TEXT, target_role TEXT DEFAULT 'SOCIETY_ADMIN')
RETURNS TEXT AS $$
DECLARE
    v_uid UUID;
BEGIN
    IF NOT public.is_super_admin() THEN
        RETURN 'Error: Access Denied. Only SUPER_ADMIN can execute promotion.';
    END IF;

    SELECT id INTO v_uid
    FROM auth.users
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(target_email))
    LIMIT 1;

    IF v_uid IS NULL THEN
        RETURN 'Error: User not found in auth.users with email ' || target_email;
    END IF;

    UPDATE public.profiles
    SET role = target_role, updated_at = NOW()
    WHERE id = v_uid;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        UPDATE public.users
        SET role = target_role, updated_at = NOW()
        WHERE auth_user_id = v_uid OR LOWER(TRIM(email)) = LOWER(TRIM(target_email));
    END IF;

    RETURN 'Success: User ' || target_email || ' (' || v_uid || ') elevated to ' || target_role || '.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
