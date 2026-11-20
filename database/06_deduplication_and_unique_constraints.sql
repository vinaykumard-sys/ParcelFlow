-- ============================================================================
-- PARCELFLOW DEDUPLICATION & UNIQUE CONSTRAINT ENFORCEMENT MIGRATION
-- database/06_deduplication_and_unique_constraints.sql
-- Run this in the Supabase SQL Editor (project: czhxktgdrhdflmfmvggx)
-- ============================================================================

-- ============================================================================
-- STEP 1: Audit - Find duplicates before cleaning (READ ONLY - safe)
-- ============================================================================

-- Duplicate tracking numbers in public.parcels
SELECT tracking_number, COUNT(*) AS dup_count
FROM public.parcels
GROUP BY tracking_number
HAVING COUNT(*) > 1
ORDER BY dup_count DESC;

-- Duplicate flat numbers per society in public.apartments
SELECT society_id, tower, unit_number, COUNT(*) AS dup_count
FROM public.apartments
GROUP BY society_id, tower, unit_number
HAVING COUNT(*) > 1;

-- Duplicate residents (same user_id + apartment_id)
SELECT user_id, apartment_id, COUNT(*) AS dup_count
FROM public.residents
GROUP BY user_id, apartment_id
HAVING COUNT(*) > 1;

-- Duplicate staff badge numbers
SELECT badge_number, COUNT(*) AS dup_count
FROM public.staff
GROUP BY badge_number
HAVING COUNT(*) > 1;

-- Duplicate storage rack+shelf per society
SELECT society_id, rack, shelf, COUNT(*) AS dup_count
FROM public.storage_locations
GROUP BY society_id, rack, shelf
HAVING COUNT(*) > 1;

-- ============================================================================
-- STEP 2: Remove duplicate parcels (keep newest record per tracking_number)
-- ============================================================================
DELETE FROM public.parcels
WHERE id NOT IN (
  SELECT DISTINCT ON (tracking_number) id
  FROM public.parcels
  ORDER BY tracking_number, created_at DESC
);

-- ============================================================================
-- STEP 3: Remove duplicate residents (keep newest record per user_id+apartment_id)
-- ============================================================================
DELETE FROM public.residents
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, apartment_id) id
  FROM public.residents
  ORDER BY user_id, apartment_id, created_at DESC
);

-- ============================================================================
-- STEP 4: Remove duplicate staff (keep newest per badge_number)
-- ============================================================================
DELETE FROM public.staff
WHERE id NOT IN (
  SELECT DISTINCT ON (badge_number) id
  FROM public.staff
  ORDER BY badge_number, created_at DESC
);

-- ============================================================================
-- STEP 5: Remove duplicate storage_locations (keep newest per society+rack+shelf)
-- ============================================================================
DELETE FROM public.storage_locations
WHERE id NOT IN (
  SELECT DISTINCT ON (society_id, rack, shelf) id
  FROM public.storage_locations
  ORDER BY society_id, rack, shelf, created_at DESC
);

-- ============================================================================
-- STEP 6: Remove duplicate apartments (keep newest per society+tower+unit)
-- ============================================================================
DELETE FROM public.apartments
WHERE id NOT IN (
  SELECT DISTINCT ON (society_id, tower, unit_number) id
  FROM public.apartments
  ORDER BY society_id, tower, unit_number, created_at DESC
);

-- ============================================================================
-- STEP 7: Verify/add UNIQUE constraints (idempotent - ADD IF NOT EXISTS)
-- ============================================================================

-- parcels.tracking_number - already in schema; add as failsafe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'parcels' AND constraint_name = 'parcels_tracking_number_key'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.parcels ADD CONSTRAINT parcels_tracking_number_key UNIQUE (tracking_number);
  END IF;
END $$;

-- staff.badge_number - already in schema; add as failsafe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'staff' AND constraint_name = 'staff_badge_number_key'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.staff ADD CONSTRAINT staff_badge_number_key UNIQUE (badge_number);
  END IF;
END $$;

-- apartments: uq_society_tower_unit - already in schema; add as failsafe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'apartments' AND constraint_name = 'uq_society_tower_unit'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.apartments ADD CONSTRAINT uq_society_tower_unit UNIQUE (society_id, tower, unit_number);
  END IF;
END $$;

-- residents: uq_resident_user_apartment - already in schema; add as failsafe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'residents' AND constraint_name = 'uq_resident_user_apartment'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.residents ADD CONSTRAINT uq_resident_user_apartment UNIQUE (user_id, apartment_id);
  END IF;
END $$;

-- storage_locations: uq_storage_rack_shelf - already in schema; add as failsafe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'storage_locations' AND constraint_name = 'uq_storage_rack_shelf'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.storage_locations ADD CONSTRAINT uq_storage_rack_shelf UNIQUE (society_id, rack, shelf);
  END IF;
END $$;

-- ============================================================================
-- STEP 8: Performance indexes for duplicate-prevention lookup paths
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_parcels_tracking_number
  ON public.parcels (tracking_number);

CREATE INDEX IF NOT EXISTS idx_staff_badge_number
  ON public.staff (badge_number);

CREATE INDEX IF NOT EXISTS idx_apartments_society_tower_unit
  ON public.apartments (society_id, tower, unit_number);

CREATE INDEX IF NOT EXISTS idx_residents_user_apartment
  ON public.residents (user_id, apartment_id);

CREATE INDEX IF NOT EXISTS idx_storage_locations_rack_shelf
  ON public.storage_locations (society_id, rack, shelf);

-- ============================================================================
-- STEP 9: Verification - confirm zero duplicates remain
-- ============================================================================

SELECT 'parcels duplicates remaining' AS check_name, COUNT(*) AS count
FROM (
  SELECT tracking_number FROM public.parcels GROUP BY tracking_number HAVING COUNT(*) > 1
) sub
UNION ALL
SELECT 'residents duplicates remaining', COUNT(*)
FROM (
  SELECT user_id, apartment_id FROM public.residents GROUP BY user_id, apartment_id HAVING COUNT(*) > 1
) sub
UNION ALL
SELECT 'staff badge duplicates remaining', COUNT(*)
FROM (
  SELECT badge_number FROM public.staff GROUP BY badge_number HAVING COUNT(*) > 1
) sub
UNION ALL
SELECT 'storage_locations duplicates remaining', COUNT(*)
FROM (
  SELECT society_id, rack, shelf FROM public.storage_locations GROUP BY society_id, rack, shelf HAVING COUNT(*) > 1
) sub;

-- All rows above should return count = 0.
-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
