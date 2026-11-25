-- ==============================================================================
-- Amber Plains Travel - Shared Authoritative Backend Schema (Part 1: Tables)
-- Covers all 4 interfaces: Public Website, Guest App, Driver App, Admin Ops
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. IDENTITY, RBAC & AUDIT
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL CHECK (name IN ('admin', 'operations', 'sales', 'finance', 'driver', 'guest')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  primary_role TEXT NOT NULL DEFAULT 'guest' CHECK (primary_role IN ('admin', 'operations', 'sales', 'finance', 'driver', 'guest')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. GUESTS, CONTACTS, ENQUIRIES & NOTES
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.guest_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('primary', 'emergency', 'travel_companion', 'billing')),
  full_name TEXT NOT NULL,
  relationship TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  source TEXT NOT NULL CHECK (source IN ('website', 'whatsapp', 'phone_ai', 'email', 'referral')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  preferred_dates TEXT,
  adults_count INTEGER NOT NULL DEFAULT 2,
  children_count INTEGER NOT NULL DEFAULT 0,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'quoted', 'converted', 'archived')),
  assigned_sales_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  author_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  note_text TEXT NOT NULL,
  is_internal_only BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. PUBLIC CATALOG: DESTINATIONS, EXPERIENCES, PACKAGES
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  summary TEXT NOT NULL,
  hero_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  start_location TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Moderate',
  indicative_price_usd_cents BIGINT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  cache_version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.package_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number > 0),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  meals TEXT,
  accommodation_summary TEXT,
  UNIQUE (package_id, day_number)
);

CREATE TABLE IF NOT EXISTS public.inclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.exclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 4. CMS & MEDIA
CREATE TABLE IF NOT EXISTS public.gallery_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.gallery_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.gallery_collections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location_tag TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_origin TEXT NOT NULL,
  safari_title TEXT,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.journal_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  cover_image_url TEXT,
  author_name TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. SUPPLIER CONTRACTS & CONFIDENTIAL RATES
CREATE TABLE IF NOT EXISTS public.supplier_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  contract_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'suspended')),
  validity_start DATE NOT NULL,
  validity_end DATE NOT NULL,
  blackout_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  cancellation_policy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.contract_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_contract_id UUID NOT NULL REFERENCES public.supplier_contracts(id) ON DELETE CASCADE,
  version_label TEXT NOT NULL,
  effective_from DATE NOT NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  is_current BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.contract_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_contract_id UUID NOT NULL REFERENCES public.supplier_contracts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  verified_by_legal BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.seasonal_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_contract_id UUID NOT NULL REFERENCES public.supplier_contracts(id) ON DELETE CASCADE,
  season_name TEXT NOT NULL CHECK (season_name IN ('peak', 'high', 'mid', 'green')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.accommodation_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_contract_id UUID NOT NULL REFERENCES public.supplier_contracts(id) ON DELETE CASCADE,
  seasonal_rate_id UUID REFERENCES public.seasonal_rates(id) ON DELETE SET NULL,
  room_category TEXT NOT NULL,
  meal_plan TEXT NOT NULL,
  rate_basis TEXT NOT NULL CHECK (rate_basis IN ('per_person_per_night', 'per_room_per_night')),
  net_rate_cents BIGINT NOT NULL CHECK (net_rate_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD'
);

CREATE TABLE IF NOT EXISTS public.transport_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_contract_id UUID REFERENCES public.supplier_contracts(id) ON DELETE SET NULL,
  vehicle_category TEXT NOT NULL,
  route_description TEXT NOT NULL,
  rate_basis TEXT NOT NULL CHECK (rate_basis IN ('per_vehicle_per_day', 'per_transfer')),
  net_rate_cents BIGINT NOT NULL CHECK (net_rate_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD'
);

CREATE TABLE IF NOT EXISTS public.guide_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpsga_level TEXT NOT NULL CHECK (kpsga_level IN ('Bronze', 'Silver', 'Gold')),
  rate_basis TEXT NOT NULL DEFAULT 'per_day',
  net_rate_cents BIGINT NOT NULL CHECK (net_rate_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'KES'
);

CREATE TABLE IF NOT EXISTS public.park_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_name TEXT NOT NULL,
  residency_tier TEXT NOT NULL CHECK (residency_tier IN ('non_resident', 'resident', 'citizen')),
  age_tier TEXT NOT NULL CHECK (age_tier IN ('adult', 'child')),
  fee_cents BIGINT NOT NULL CHECK (fee_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_contract_id UUID REFERENCES public.supplier_contracts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  net_rate_cents BIGINT NOT NULL CHECK (net_rate_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD'
);

-- 6. FLEET, DRIVERS, GUIDES & AVAILABILITY
CREATE TABLE IF NOT EXISTS public.vehicle_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  seat_capacity INTEGER NOT NULL CHECK (seat_capacity > 0)
);

CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.vehicle_categories(id) ON DELETE SET NULL,
  registration_plate TEXT UNIQUE NOT NULL,
  make_model TEXT NOT NULL,
  passenger_capacity INTEGER NOT NULL DEFAULT 6,
  has_inverter_220v BOOLEAN NOT NULL DEFAULT true,
  has_fridge BOOLEAN NOT NULL DEFAULT true,
  current_kilometers INTEGER NOT NULL DEFAULT 0,
  next_service_kilometers INTEGER NOT NULL DEFAULT 10000,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_safari', 'scheduled_maintenance', 'retired')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_safari', 'off_duty')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  kpsga_level TEXT NOT NULL CHECK (kpsga_level IN ('Bronze', 'Silver', 'Gold')),
  license_number TEXT UNIQUE NOT NULL,
  languages TEXT[] NOT NULL DEFAULT ARRAY['English'],
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_safari', 'off_duty'))
);

CREATE TABLE IF NOT EXISTS public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  odometer_km INTEGER NOT NULL,
  description TEXT NOT NULL,
  cost_kes_cents BIGINT NOT NULL DEFAULT 0,
  logged_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('vehicle', 'driver', 'guide')),
  resource_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('booked', 'maintenance', 'blocked')),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE
);

-- 7. BOOKINGS, ITINERARIES, ASSIGNMENTS & QUOTATIONS
CREATE TABLE IF NOT EXISTS public.booking_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  is_lead_guest BOOLEAN NOT NULL DEFAULT false,
  age_group TEXT NOT NULL DEFAULT 'adult' CHECK (age_group IN ('adult', 'child')),
  dietary_requirements TEXT
);

CREATE TABLE IF NOT EXISTS public.booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD'
);

CREATE TABLE IF NOT EXISTS public.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  trip_date DATE NOT NULL,
  title TEXT NOT NULL,
  route_summary TEXT NOT NULL,
  lodge_name TEXT,
  pickup_instructions TEXT,
  UNIQUE (booking_id, day_number)
);

CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  guide_id UUID REFERENCES public.guides(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'en_route', 'completed', 'cancelled')),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  default_markup_bps INTEGER NOT NULL DEFAULT 2800,
  min_gross_margin_bps INTEGER NOT NULL DEFAULT 1800,
  contingency_buffer_bps INTEGER NOT NULL DEFAULT 500,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  rate NUMERIC(12, 6) NOT NULL CHECK (rate > 0),
  effective_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  reference_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'expired', 'rejected')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.quotation_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  total_net_cost_cents BIGINT NOT NULL,
  selling_price_cents BIGINT NOT NULL,
  gross_margin_bps INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  rates_revalidated_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  UNIQUE (quotation_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_version_id UUID NOT NULL REFERENCES public.quotation_versions(id) ON DELETE CASCADE,
  supplier_contract_id UUID REFERENCES public.supplier_contracts(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  unit_cost_cents BIGINT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  multiplier INTEGER NOT NULL DEFAULT 1,
  is_confidential_rate BOOLEAN NOT NULL DEFAULT true
);

-- 8. PAYMENTS, REFUNDS & INVOICES
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE RESTRICT,
  guest_id UUID REFERENCES public.guests(id) ON DELETE RESTRICT,
  idempotency_key TEXT UNIQUE NOT NULL,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'intasend', 'mpesa', 'direct_wire')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'expired')),
  checkout_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_request_id UUID REFERENCES public.payment_requests(id) ON DELETE RESTRICT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE RESTRICT,
  guest_id UUID REFERENCES public.guests(id) ON DELETE RESTRICT,
  idempotency_key TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'intasend', 'mpesa', 'direct_wire')),
  provider_event_id TEXT UNIQUE,
  provider_transaction_id TEXT,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_transaction_id UUID NOT NULL REFERENCES public.payment_transactions(id) ON DELETE RESTRICT,
  idempotency_key TEXT UNIQUE NOT NULL,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE RESTRICT,
  total_cents BIGINT NOT NULL,
  balance_cents BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'partially_paid', 'paid', 'void')),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  due_date DATE
);

-- 9. MERCHANDISE & ORDERS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  price_cents BIGINT NOT NULL CHECK (price_cents >= 0),
  cost_cents BIGINT NOT NULL CHECK (cost_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD'
);

CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID UNIQUE NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
  reorder_threshold INTEGER NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE RESTRICT,
  total_cents BIGINT NOT NULL CHECK (total_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.fulfilments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'dispatched', 'delivered')),
  tracking_reference TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. AI RECEPTIONIST, LEADS, HUNTER, SEO & INTEGRATIONS
CREATE TABLE IF NOT EXISTS public.call_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('twilio', 'africas_talking')),
  call_sid TEXT UNIQUE NOT NULL,
  caller_number TEXT NOT NULL,
  caller_country TEXT,
  status TEXT NOT NULL CHECK (status IN ('completed', 'missed', 'voicemail', 'failed')),
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  recording_consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.call_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_event_id UUID UNIQUE NOT NULL REFERENCES public.call_events(id) ON DELETE CASCADE,
  transcript_snippet TEXT,
  extracted_intent JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_call_id UUID REFERENCES public.call_events(id) ON DELETE SET NULL,
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  full_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  estimated_budget_cents BIGINT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'done', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS public.ai_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_entity_type TEXT,
  target_entity_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  public_website_url TEXT UNIQUE NOT NULL,
  market_tier TEXT NOT NULL,
  robots_txt_status TEXT NOT NULL DEFAULT 'allowed',
  last_observed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.competitor_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  observed_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  detected_seo_gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES public.competitors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  opportunity TEXT NOT NULL,
  suggested_action TEXT NOT NULL,
  impact TEXT NOT NULL CHECK (impact IN ('low', 'medium', 'high')),
  effort TEXT NOT NULL CHECK (effort IN ('low', 'medium', 'high')),
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  title_length INTEGER NOT NULL,
  schema_type TEXT NOT NULL,
  keyword_rankings JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL,
  audited_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.seo_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seo_audit_id UUID REFERENCES public.seo_audits(id) ON DELETE SET NULL,
  path TEXT NOT NULL,
  proposed_changes JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'applied', 'rejected')),
  requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('itinerary_pdf', 'invoice', 'voucher', 'park_pass', 'contract')),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_guest_visible BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.integration_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  signature_verified BOOLEAN NOT NULL DEFAULT false,
  payload JSONB NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'received' CHECK (processing_status IN ('received', 'processed', 'ignored', 'failed')),
  received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (provider, provider_event_id)
);

-- INDEXES ON FOREIGN KEYS & QUERY FILTERS
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON public.audit_events (entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON public.bookings (guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_assignments_driver ON public.assignments (driver_id, booking_id);
CREATE INDEX IF NOT EXISTS idx_assignments_booking ON public.assignments (booking_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_booking ON public.itineraries (booking_id, day_number);
CREATE INDEX IF NOT EXISTS idx_payment_tx_booking ON public.payment_transactions (booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_guest ON public.payment_transactions (guest_id);
CREATE INDEX IF NOT EXISTS idx_invoices_guest ON public.invoices (guest_id);
CREATE INDEX IF NOT EXISTS idx_documents_guest ON public.documents (guest_id, is_guest_visible);
CREATE INDEX IF NOT EXISTS idx_orders_guest ON public.orders (guest_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id, is_read);
