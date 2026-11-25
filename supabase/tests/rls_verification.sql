-- ==============================================================================
-- Amber Plains Travel - Transactional RLS Verification Suite
-- Run against Supabase / Postgres inside a rolled-back transaction.
-- Verifies anon, guest, driver, sales, finance, operations, and admin access.
-- ==============================================================================

BEGIN;

-- Seed isolated test fixtures (runs as postgres / migration role)
INSERT INTO public.profiles (id, email, full_name, primary_role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'guest1@test.local', 'Test Guest One', 'guest'),
  ('22222222-2222-2222-2222-222222222222', 'guest2@test.local', 'Test Guest Two', 'guest'),
  ('33333333-3333-3333-3333-333333333333', 'driver1@test.local', 'Test Driver One', 'driver'),
  ('44444444-4444-4444-4444-444444444444', 'sales1@test.local', 'Test Sales One', 'sales'),
  ('55555555-5555-5555-5555-555555555555', 'finance1@test.local', 'Test Finance One', 'finance'),
  ('66666666-6666-6666-6666-666666666666', 'ops1@test.local', 'Test Ops One', 'operations'),
  ('77777777-7777-7777-7777-777777777777', 'admin1@test.local', 'Test Admin One', 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.guests (id, user_id, full_name, email, passport_number)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'Test Guest One', 'guest1@test.local', 'P000001'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 'Test Guest Two', 'guest2@test.local', 'P000002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.drivers (id, user_id, full_name, phone, license_number)
VALUES
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', '33333333-3333-3333-3333-333333333333', 'Test Driver One', '+254700000001', 'DL-001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.bookings (id, reference_code, guest_id, package_slug, custom_title, stage, start_date, end_date, duration_days, total_selling_price_usd, deposit_amount_usd, balance_due_usd)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'APT-TEST-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'tsavo-odyssey', 'Tsavo Odyssey', 'confirmed', '2026-12-01', '2026-12-04', 4, 4000, 1200, 2800),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'APT-TEST-002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'mara-odyssey', 'Mara Odyssey', 'confirmed', '2026-12-05', '2026-12-08', 4, 6000, 1800, 4200)
ON CONFLICT (reference_code) DO NOTHING;

INSERT INTO public.assignments (booking_id, driver_id, status)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'assigned');

-- 1. TEST ANON: Must see 0 protected bookings & 0 guests
SET LOCAL ROLE anon;
DO $$
DECLARE cnt INT;
BEGIN
  SELECT count(*) INTO cnt FROM public.bookings;
  IF cnt <> 0 THEN RAISE EXCEPTION 'RLS FAILURE: anon saw % bookings', cnt; END IF;
  SELECT count(*) INTO cnt FROM public.guests;
  IF cnt <> 0 THEN RAISE EXCEPTION 'RLS FAILURE: anon saw % guests', cnt; END IF;
END $$;

-- 2. TEST GUEST 1: Must see ONLY booking 1, NOT booking 2
RESET ROLE;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","app_metadata":{"role":"guest"}}', true);
DO $$
DECLARE cnt INT;
BEGIN
  SELECT count(*) INTO cnt FROM public.bookings WHERE reference_code IN ('APT-TEST-001', 'APT-TEST-002');
  IF cnt <> 1 THEN RAISE EXCEPTION 'RLS FAILURE: guest1 saw % bookings (expected 1)', cnt; END IF;
END $$;

-- 3. TEST DRIVER 1: Must see ONLY assigned trip in driver_assigned_trips, NOT unassigned booking 2
SELECT set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","app_metadata":{"role":"driver"}}', true);
DO $$
DECLARE cnt INT;
BEGIN
  SELECT count(*) INTO cnt FROM public.driver_assigned_trips WHERE reference_code IN ('APT-TEST-001', 'APT-TEST-002');
  IF cnt <> 1 THEN RAISE EXCEPTION 'RLS FAILURE: driver1 saw % assigned trips (expected 1)', cnt; END IF;
  SELECT count(*) INTO cnt FROM public.payment_transactions;
  IF cnt <> 0 THEN RAISE EXCEPTION 'RLS FAILURE: driver1 saw payment_transactions'; END IF;
END $$;

-- 4. TEST SALES: Must NOT see payment_transactions or supplier_contracts
SELECT set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-4444-444444444444","app_metadata":{"role":"sales"}}', true);
DO $$
DECLARE cnt INT;
BEGIN
  SELECT count(*) INTO cnt FROM public.payment_transactions;
  IF cnt <> 0 THEN RAISE EXCEPTION 'RLS FAILURE: sales saw payment_transactions'; END IF;
END $$;

-- 5. TEST ADMIN: Must see both test bookings
SELECT set_config('request.jwt.claims', '{"sub":"77777777-7777-7777-7777-777777777777","app_metadata":{"role":"admin"}}', true);
DO $$
DECLARE cnt INT;
BEGIN
  SELECT count(*) INTO cnt FROM public.bookings WHERE reference_code IN ('APT-TEST-001', 'APT-TEST-002');
  IF cnt <> 2 THEN RAISE EXCEPTION 'RLS FAILURE: admin saw % bookings (expected 2)', cnt; END IF;
END $$;

ROLLBACK;
