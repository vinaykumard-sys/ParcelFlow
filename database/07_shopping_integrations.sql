-- ============================================================================
-- PARCELFLOW MIGRATION 07: AUTOMATIC ORDER & SHIPMENT AGGREGATION
-- Enables legitimate one-time connection to shopping accounts & Gmail
-- Auto-discovers inbound orders without manual tracking number entry
-- ============================================================================

-- 1. Connected Shopping & Email Accounts Table
CREATE TABLE IF NOT EXISTS public.connected_shopping_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('GMAIL', 'AMAZON', 'FLIPKART', 'MYNTRA')),
  account_email TEXT,
  status TEXT NOT NULL DEFAULT 'CONNECTED' CHECK (status IN ('CONNECTED', 'DISCONNECTED', 'ERROR', 'SYNCING')),
  last_synced_at TIMESTAMPTZ,
  auth_scope TEXT,
  auto_sync_enabled BOOLEAN DEFAULT true,
  orders_discovered_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- 2. Enhance Parcels Table with Auto-Discovery Metadata (Non-destructive)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'parcels' AND column_name = 'order_amount'
  ) THEN
    ALTER TABLE public.parcels ADD COLUMN order_amount NUMERIC(10, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'parcels' AND column_name = 'estimated_delivery'
  ) THEN
    ALTER TABLE public.parcels ADD COLUMN estimated_delivery TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'parcels' AND column_name = 'synced_from_provider'
  ) THEN
    ALTER TABLE public.parcels ADD COLUMN synced_from_provider TEXT;
  END IF;
END $$;

-- 3. Row Level Security (RLS) on connected_shopping_accounts
ALTER TABLE public.connected_shopping_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own connected accounts" ON public.connected_shopping_accounts;
CREATE POLICY "Users can view their own connected accounts"
  ON public.connected_shopping_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own connected accounts" ON public.connected_shopping_accounts;
CREATE POLICY "Users can insert their own connected accounts"
  ON public.connected_shopping_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own connected accounts" ON public.connected_shopping_accounts;
CREATE POLICY "Users can update their own connected accounts"
  ON public.connected_shopping_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own connected accounts" ON public.connected_shopping_accounts;
CREATE POLICY "Users can delete their own connected accounts"
  ON public.connected_shopping_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Audit Log Trigger for Connected Account changes
CREATE OR REPLACE FUNCTION public.log_connected_account_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    entity_type,
    entity_id,
    action,
    performed_by,
    details
  ) VALUES (
    'CONNECTED_ACCOUNT',
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    COALESCE(NEW.user_id, OLD.user_id),
    jsonb_build_object(
      'provider', COALESCE(NEW.provider, OLD.provider),
      'status', COALESCE(NEW.status, OLD.status),
      'last_synced_at', COALESCE(NEW.last_synced_at, OLD.last_synced_at)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_connected_account_audit ON public.connected_shopping_accounts;
CREATE TRIGGER trg_connected_account_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.connected_shopping_accounts
  FOR EACH ROW EXECUTE FUNCTION public.log_connected_account_change();
