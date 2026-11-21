-- ============================================================================
-- PARCELFLOW MIGRATION 09: AI ASSISTANT & NEXT-LEVEL OPERATIONAL ARCHITECTURE
-- Implements database schema, tables, foreign keys, indexes, and RLS policies for:
-- 1. pickup_authorizations (Family & delegate pickup permits with OTP/QR)
-- 2. parcel_incidents (Photo evidence, damage tracking, and resolution workflow)
-- 3. offline_sync_events (Zero-data-loss offline security queue & reconciliation)
-- 4. delivery_predictions (Predictive courier volume, peak times, and staffing alerts)
-- 5. ai_conversations & ai_tool_audit (Gemini AI session history and tamper-evident tool executions)
-- ============================================================================

-- 1. Family & Delegate Pickup Authorizations
CREATE TABLE IF NOT EXISTS public.pickup_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  authorized_name TEXT NOT NULL,
  relationship TEXT NOT NULL, -- e.g. 'Spouse', 'Family Member', 'Friend', 'House Help', 'Neighbor'
  authorized_phone TEXT,
  allowed_parcel_ids UUID[] NOT NULL DEFAULT '{}',
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED', 'USED')),
  otp_code TEXT,
  notes TEXT,
  used_at TIMESTAMPTZ,
  used_by_staff_id UUID REFERENCES public.staff(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pickup_auth_resident ON public.pickup_authorizations(resident_id);
CREATE INDEX IF NOT EXISTS idx_pickup_auth_society ON public.pickup_authorizations(society_id);
CREATE INDEX IF NOT EXISTS idx_pickup_auth_status ON public.pickup_authorizations(status);
CREATE INDEX IF NOT EXISTS idx_pickup_auth_valid_until ON public.pickup_authorizations(valid_until);

-- 2. Parcel Damage & Incident Reporting
CREATE TABLE IF NOT EXISTS public.parcel_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  parcel_id UUID REFERENCES public.parcels(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name TEXT,
  reporter_role TEXT NOT NULL DEFAULT 'STAFF',
  issue_type TEXT NOT NULL CHECK (
    issue_type IN ('DAMAGED_PARCEL', 'WRONG_PARCEL', 'MISSING_PARCEL', 'OPENED_PACKAGE', 'LABEL_UNREADABLE', 'OTHER')
  ),
  description TEXT NOT NULL,
  photos TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (
    status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED')
  ),
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parcel_incidents_society ON public.parcel_incidents(society_id);
CREATE INDEX IF NOT EXISTS idx_parcel_incidents_parcel ON public.parcel_incidents(parcel_id);
CREATE INDEX IF NOT EXISTS idx_parcel_incidents_status ON public.parcel_incidents(status);
CREATE INDEX IF NOT EXISTS idx_parcel_incidents_created ON public.parcel_incidents(created_at DESC);

-- 3. Offline Sync Events (Guard Gate & Hub Zero Data Loss)
CREATE TABLE IF NOT EXISTS public.offline_sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  society_id UUID REFERENCES public.societies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'PENDING_SYNC' CHECK (
    status IN ('PENDING_SYNC', 'SYNCED', 'SYNC_FAILED')
  ),
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_offline_sync_user ON public.offline_sync_events(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_society ON public.offline_sync_events(society_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_status ON public.offline_sync_events(status);
CREATE INDEX IF NOT EXISTS idx_offline_sync_created ON public.offline_sync_events(created_at DESC);

-- 4. Predictive Delivery & Peak Times
CREATE TABLE IF NOT EXISTS public.delivery_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  expected_count INTEGER NOT NULL DEFAULT 0,
  peak_window TEXT NOT NULL DEFAULT '6 PM - 8 PM',
  hourly_distribution JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 0.92,
  insights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (society_id, date)
);

CREATE INDEX IF NOT EXISTS idx_delivery_predictions_society_date ON public.delivery_predictions(society_id, date);

-- 5. AI Conversations (Gemini Session Storage)
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  society_id UUID REFERENCES public.societies(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Parcel Assistant Chat',
  role TEXT NOT NULL DEFAULT 'RESIDENT',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_society ON public.ai_conversations(society_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated ON public.ai_conversations(updated_at DESC);

-- 6. AI Tool Execution Audit (Strict Observability & Confirmation)
CREATE TABLE IF NOT EXISTS public.ai_tool_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  society_id UUID REFERENCES public.societies(id) ON DELETE SET NULL,
  tool_name TEXT NOT NULL,
  tool_arguments JSONB NOT NULL DEFAULT '{}'::jsonb,
  tool_result JSONB,
  is_state_mutation BOOLEAN NOT NULL DEFAULT false,
  confirmed_by_user BOOLEAN NOT NULL DEFAULT false,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_tool_audit_user ON public.ai_tool_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_audit_tool ON public.ai_tool_audit(tool_name);
CREATE INDEX IF NOT EXISTS idx_ai_tool_audit_created ON public.ai_tool_audit(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- RLS: pickup_authorizations
ALTER TABLE public.pickup_authorizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Residents can manage their own pickup authorizations" ON public.pickup_authorizations;
CREATE POLICY "Residents can manage their own pickup authorizations"
  ON public.pickup_authorizations
  FOR ALL
  TO authenticated
  USING (
    resident_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid())
    OR public.is_super_admin()
  )
  WITH CHECK (
    resident_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid())
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "Staff can view active authorizations for their society" ON public.pickup_authorizations;
CREATE POLICY "Staff can view active authorizations for their society"
  ON public.pickup_authorizations
  FOR SELECT
  TO authenticated
  USING (
    society_id IN (SELECT society_id FROM public.staff WHERE user_id = auth.uid())
    OR public.is_security()
    OR public.is_super_admin()
  );

-- RLS: parcel_incidents
ALTER TABLE public.parcel_incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Society members can view incidents in their society" ON public.parcel_incidents;
CREATE POLICY "Society members can view incidents in their society"
  ON public.parcel_incidents
  FOR SELECT
  TO authenticated
  USING (
    society_id IN (
      SELECT society_id FROM public.residents WHERE user_id = auth.uid()
      UNION
      SELECT society_id FROM public.staff WHERE user_id = auth.uid()
    )
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "Authenticated users can create parcel incidents" ON public.parcel_incidents;
CREATE POLICY "Authenticated users can create parcel incidents"
  ON public.parcel_incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Staff and Admins can update incidents" ON public.parcel_incidents;
CREATE POLICY "Staff and Admins can update incidents"
  ON public.parcel_incidents
  FOR UPDATE
  TO authenticated
  USING (
    public.is_security()
    OR public.is_society_admin()
    OR public.is_super_admin()
  );

-- RLS: offline_sync_events
ALTER TABLE public.offline_sync_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view and record their own offline sync events" ON public.offline_sync_events;
CREATE POLICY "Users can view and record their own offline sync events"
  ON public.offline_sync_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- RLS: delivery_predictions
ALTER TABLE public.delivery_predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Society members can read delivery predictions" ON public.delivery_predictions;
CREATE POLICY "Society members can read delivery predictions"
  ON public.delivery_predictions
  FOR SELECT
  TO authenticated
  USING (
    society_id IN (
      SELECT society_id FROM public.residents WHERE user_id = auth.uid()
      UNION
      SELECT society_id FROM public.staff WHERE user_id = auth.uid()
    )
    OR public.is_super_admin()
  );

DROP POLICY IF EXISTS "Admins can manage delivery predictions" ON public.delivery_predictions;
CREATE POLICY "Admins can manage delivery predictions"
  ON public.delivery_predictions
  FOR ALL
  TO authenticated
  USING (public.is_society_admin() OR public.is_super_admin())
  WITH CHECK (public.is_society_admin() OR public.is_super_admin());

-- RLS: ai_conversations
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own their AI conversations" ON public.ai_conversations;
CREATE POLICY "Users own their AI conversations"
  ON public.ai_conversations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- RLS: ai_tool_audit
ALTER TABLE public.ai_tool_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can see their own AI tool audits" ON public.ai_tool_audit;
CREATE POLICY "Users can see their own AI tool audits"
  ON public.ai_tool_audit
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin());

DROP POLICY IF EXISTS "System can insert AI tool audit entries" ON public.ai_tool_audit;
CREATE POLICY "System can insert AI tool audit entries"
  ON public.ai_tool_audit
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_super_admin());
