-- ============================================================================
-- PARCELFLOW MIGRATION: SOCIETY SUBSCRIPTIONS & AUDIT TRAIL HARDENING
-- File: database/05_subscriptions_and_audit_hardening.sql
-- Description: Adds society_subscriptions table, RLS policies, and seed data
-- ============================================================================

-- 1. Create society_subscriptions table
CREATE TABLE IF NOT EXISTS public.society_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    plan TEXT NOT NULL CHECK (plan IN ('STARTER', 'PROFESSIONAL', 'ENTERPRISE')),
    amount_inr NUMERIC NOT NULL DEFAULT 2999,
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('MONTHLY', 'ANNUAL')) DEFAULT 'MONTHLY',
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'TRIAL', 'EXPIRED', 'CANCELLED', 'PAST_DUE')) DEFAULT 'ACTIVE',
    parcel_limit_monthly INT NOT NULL DEFAULT 500,
    storage_slots_limit INT NOT NULL DEFAULT 25,
    features JSONB NOT NULL DEFAULT '{"cctv": false, "dedicated_lockers": false, "priority_support": false, "custom_batching": false}'::jsonb,
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_society_subscription UNIQUE (society_id)
);

CREATE INDEX IF NOT EXISTS idx_society_subscriptions_society ON public.society_subscriptions(society_id);
CREATE INDEX IF NOT EXISTS idx_society_subscriptions_status ON public.society_subscriptions(status);

-- 2. Trigger for updated_at
DROP TRIGGER IF EXISTS trg_society_subscriptions_updated_at ON public.society_subscriptions;
CREATE TRIGGER trg_society_subscriptions_updated_at BEFORE UPDATE ON public.society_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Enable RLS
ALTER TABLE public.society_subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Admins can view and manage all subscriptions" ON public.society_subscriptions;
CREATE POLICY "Admins can view and manage all subscriptions" ON public.society_subscriptions
    FOR ALL TO authenticated USING (
        get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
    );

DROP POLICY IF EXISTS "Staff and residents can view own society subscription" ON public.society_subscriptions;
CREATE POLICY "Staff and residents can view own society subscription" ON public.society_subscriptions
    FOR SELECT TO authenticated USING (
        society_id = get_current_user_society_id()
    );

-- 5. Seed default subscriptions for Lakeview, Greenview, and Skyline
INSERT INTO public.society_subscriptions (society_id, plan, amount_inr, billing_cycle, status, parcel_limit_monthly, storage_slots_limit, features)
SELECT 
    s.id,
    CASE 
        WHEN s.code = 'LVR' THEN 'PROFESSIONAL'
        WHEN s.code = 'GVH' THEN 'STARTER'
        ELSE 'ENTERPRISE'
    END AS plan,
    CASE 
        WHEN s.code = 'LVR' THEN 6999
        WHEN s.code = 'GVH' THEN 2999
        ELSE 14999
    END AS amount_inr,
    'MONTHLY' AS billing_cycle,
    'ACTIVE' AS status,
    CASE 
        WHEN s.code = 'LVR' THEN 2500
        WHEN s.code = 'GVH' THEN 500
        ELSE 10000
    END AS parcel_limit_monthly,
    CASE 
        WHEN s.code = 'LVR' THEN 100
        WHEN s.code = 'GVH' THEN 20
        ELSE 500
    END AS storage_slots_limit,
    jsonb_build_object(
        'cctv', s.code = 'LVR' OR s.code NOT IN ('LVR', 'GVH'),
        'dedicated_lockers', s.code NOT IN ('LVR', 'GVH'),
        'priority_support', s.code = 'LVR' OR s.code NOT IN ('LVR', 'GVH'),
        'custom_batching', s.code = 'LVR' OR s.code NOT IN ('LVR', 'GVH')
    ) AS features
FROM public.societies s
ON CONFLICT (society_id) DO UPDATE SET
    plan = EXCLUDED.plan,
    amount_inr = EXCLUDED.amount_inr,
    parcel_limit_monthly = EXCLUDED.parcel_limit_monthly,
    storage_slots_limit = EXCLUDED.storage_slots_limit,
    features = EXCLUDED.features,
    updated_at = NOW();
