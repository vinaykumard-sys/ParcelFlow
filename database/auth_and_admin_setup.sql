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
