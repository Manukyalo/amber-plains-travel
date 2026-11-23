-- ==============================================================================
-- Amber Plains Travel - Database Schema & Row Level Security (RLS)
-- Target Project: fvlusambjkzcnrfvnome (Axelo Industries)
-- Description: Enforces strict RBAC (admin only) on all operational data
-- ==============================================================================

-- 1. Helper function to verify admin role from JWT app_metadata
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- 2. Guests Table (PII Protection)
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  passport_number TEXT,
  dietary_requirements TEXT,
  medical_notes TEXT,
  total_trips INTEGER DEFAULT 0,
  vip_status BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Safari Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT UNIQUE NOT NULL,
  guest_id UUID REFERENCES public.guests(id) ON DELETE RESTRICT,
  package_slug TEXT NOT NULL,
  custom_title TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('new_inquiry', 'quote_drafted', 'quote_sent', 'deposit_pending', 'confirmed', 'in_safari', 'completed', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  adults_count INTEGER NOT NULL DEFAULT 2,
  children_count INTEGER DEFAULT 0,
  assigned_guide_id TEXT,
  assigned_vehicle_id TEXT,
  total_selling_price_usd NUMERIC(10, 2) NOT NULL,
  deposit_amount_usd NUMERIC(10, 2) NOT NULL,
  deposit_paid BOOLEAN DEFAULT false,
  balance_due_usd NUMERIC(10, 2) NOT NULL,
  balance_due_date DATE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Supplier Records Table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('luxury_lodge', 'tented_camp', 'domestic_aviation', 'marine_charter', 'conservation_trust')),
  location TEXT NOT NULL,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contract_version TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'review_pending', 'expired', 'blacklisted')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Supplier Contracts & Confidential Rates
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  contract_version TEXT NOT NULL,
  validity_start DATE NOT NULL,
  validity_end DATE NOT NULL,
  blackout_dates JSONB DEFAULT '[]'::jsonb,
  document_attachment_url TEXT,
  document_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Payments & Ledger (Immutable Financial Transactions)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE RESTRICT,
  booking_reference TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'intasend', 'mpesa', 'direct_wire')),
  provider_transaction_id TEXT,
  amount_cents BIGINT NOT NULL, -- Integer cents for exact money math
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  type TEXT NOT NULL CHECK (type IN ('deposit', 'interim_installment', 'final_balance', 'merchandise', 'refund')),
  verified_at TIMESTAMPTZ,
  raw_webhook_payload JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Only Authenticated Users with app_metadata.role = 'admin'
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 1. Guests RLS
DROP POLICY IF EXISTS "Admins full access to guests" ON public.guests;
CREATE POLICY "Admins full access to guests"
  ON public.guests
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. Bookings RLS
DROP POLICY IF EXISTS "Admins full access to bookings" ON public.bookings;
CREATE POLICY "Admins full access to bookings"
  ON public.bookings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Suppliers RLS
DROP POLICY IF EXISTS "Admins full access to suppliers" ON public.suppliers;
CREATE POLICY "Admins full access to suppliers"
  ON public.suppliers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Contracts RLS
DROP POLICY IF EXISTS "Admins full access to contracts" ON public.contracts;
CREATE POLICY "Admins full access to contracts"
  ON public.contracts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Payments Ledger RLS
DROP POLICY IF EXISTS "Admins full access to payments" ON public.payments;
CREATE POLICY "Admins full access to payments"
  ON public.payments
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Prevent any anonymous access across all tables
DROP POLICY IF EXISTS "Deny anon access to guests" ON public.guests;
CREATE POLICY "Deny anon access to guests" ON public.guests FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS "Deny anon access to bookings" ON public.bookings;
CREATE POLICY "Deny anon access to bookings" ON public.bookings FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS "Deny anon access to suppliers" ON public.suppliers;
CREATE POLICY "Deny anon access to suppliers" ON public.suppliers FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS "Deny anon access to contracts" ON public.contracts;
CREATE POLICY "Deny anon access to contracts" ON public.contracts FOR ALL TO anon USING (false);

DROP POLICY IF EXISTS "Deny anon access to payments" ON public.payments;
CREATE POLICY "Deny anon access to payments" ON public.payments FOR ALL TO anon USING (false);
