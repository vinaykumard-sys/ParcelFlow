-- ============================================================================
-- PARCELFLOW MIGRATION 08: FCM DEVICE TOKENS & APP RELEASES
-- Supports real device push token registration, token rotation,
-- multi-device tracking, and platform owner release publishing.
-- ============================================================================

-- 1. Device Push Tokens Table
CREATE TABLE IF NOT EXISTS public.device_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL UNIQUE,
  device_id TEXT,
  device_model TEXT,
  platform TEXT NOT NULL DEFAULT 'android' CHECK (platform IN ('android', 'ios', 'web')),
  app_version_name TEXT,
  app_version_code INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_user ON public.device_push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_active ON public.device_push_tokens(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_device_tokens_fcm ON public.device_push_tokens(fcm_token);

-- 2. App Releases Table (Source of truth for versioning & updates)
CREATE TABLE IF NOT EXISTS public.app_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_name TEXT NOT NULL,
  version_code INTEGER NOT NULL UNIQUE,
  minimum_supported_version_code INTEGER NOT NULL DEFAULT 1,
  apk_url TEXT NOT NULL,
  apk_size_bytes BIGINT NOT NULL,
  sha256 TEXT NOT NULL,
  release_notes TEXT[] NOT NULL DEFAULT '{}',
  mandatory BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  notifications_dispatched_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_app_releases_code ON public.app_releases(version_code DESC);

-- 3. Row Level Security (RLS) on device_push_tokens
ALTER TABLE public.device_push_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own device tokens" ON public.device_push_tokens;
CREATE POLICY "Users can view their own device tokens"
  ON public.device_push_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin());

DROP POLICY IF EXISTS "Users can insert their own device tokens" ON public.device_push_tokens;
CREATE POLICY "Users can insert their own device tokens"
  ON public.device_push_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own device tokens" ON public.device_push_tokens;
CREATE POLICY "Users can update their own device tokens"
  ON public.device_push_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

DROP POLICY IF EXISTS "Users can delete their own device tokens" ON public.device_push_tokens;
CREATE POLICY "Users can delete their own device tokens"
  ON public.device_push_tokens
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin());

-- 4. Row Level Security on app_releases
ALTER TABLE public.app_releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published releases" ON public.app_releases;
CREATE POLICY "Anyone can view published releases"
  ON public.app_releases
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Only super admin can manage app releases" ON public.app_releases;
CREATE POLICY "Only super admin can manage app releases"
  ON public.app_releases
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- 5. Seed initial current release (1.2.0 / Code: 5)
INSERT INTO public.app_releases (
  version_name,
  version_code,
  minimum_supported_version_code,
  apk_url,
  apk_size_bytes,
  sha256,
  release_notes,
  mandatory,
  is_published
) VALUES (
  '1.2.0',
  5,
  4,
  '/downloads/android/ParcelFlow.apk',
  9954228,
  '91e54050942122d73bbd39827e13ce376f31dedc8a8de1ce20159cf1c0f7422f',
  ARRAY[
    'Faster parcel barcode scanning & instant carrier auto-detection',
    'Real-time hub express counter arrival alerts (On My Way)',
    'Enhanced digital pickup pass QR verification security',
    'Automatic offline sync resilience & performance improvements'
  ],
  false,
  true
) ON CONFLICT (version_code) DO UPDATE SET
  apk_size_bytes = EXCLUDED.apk_size_bytes,
  sha256 = EXCLUDED.sha256,
  release_notes = EXCLUDED.release_notes,
  updated_at = NOW();
