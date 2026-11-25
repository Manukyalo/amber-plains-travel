-- ==============================================================================
-- Amber Plains Travel - Least-Privilege RLS Policies & Audit Triggers (Part 2)
-- ==============================================================================

-- 1. ROLE HELPERS (Reads ONLY app_metadata.role, never user_metadata)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'guest');
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_user_role() = ANY(allowed_roles);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_user_role() = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.current_guest_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.guests WHERE user_id = (SELECT auth.uid()) LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_driver_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.drivers WHERE user_id = (SELECT auth.uid()) LIMIT 1;
$$;

-- Revoke public execute on SECURITY DEFINER helpers and grant only to authenticated
REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_any_role(TEXT[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_guest_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_driver_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_any_role(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_guest_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_driver_id() TO authenticated;

-- 2. DRIVER-SCOPED VIEW (security_invoker = true: strips financial & passport PII)
CREATE OR REPLACE VIEW public.driver_assigned_trips
WITH (security_invoker = true)
AS
SELECT
  a.id AS assignment_id,
  a.driver_id,
  a.status AS assignment_status,
  b.id AS booking_id,
  b.reference_code,
  b.custom_title,
  b.start_date,
  b.end_date,
  b.duration_days,
  b.adults_count,
  b.children_count,
  g.full_name AS lead_guest_name,
  g.dietary_requirements,
  v.registration_plate,
  v.make_model
FROM public.assignments a
JOIN public.bookings b ON b.id = a.booking_id
LEFT JOIN public.guests g ON g.id = b.guest_id
LEFT JOIN public.vehicles v ON v.id = a.vehicle_id;

GRANT SELECT ON public.driver_assigned_trips TO authenticated;

-- 3. ENABLE RLS ON EVERY TABLE IN PUBLIC
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl.tablename);
  END LOOP;
END $$;

-- 4. PUBLIC CATALOG READ POLICIES (Non-sensitive published content only)
CREATE POLICY "Public read published destinations" ON public.destinations
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Public read published experiences" ON public.experiences
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Public read published packages" ON public.packages
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Public read package_days" ON public.package_days
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.packages p WHERE p.id = package_id AND (p.is_published = true OR public.has_any_role(ARRAY['admin', 'sales', 'operations'])))
  );

CREATE POLICY "Public read inclusions" ON public.inclusions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read exclusions" ON public.exclusions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read published gallery_collections" ON public.gallery_collections
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin());

CREATE POLICY "Public read published gallery_assets" ON public.gallery_assets
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin());

CREATE POLICY "Public read published testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin());

CREATE POLICY "Public read published journal_posts" ON public.journal_posts
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin());

CREATE POLICY "Public read public site_settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (is_public = true OR public.is_admin());

CREATE POLICY "Public read published products" ON public.products
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_any_role(ARRAY['admin', 'operations']));

CREATE POLICY "Public read product_variants" ON public.product_variants
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND (p.is_published = true OR public.has_any_role(ARRAY['admin', 'operations'])))
  );

-- 5. PROFILES, ROLES, PERMISSIONS & AUDIT
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id OR public.has_any_role(ARRAY['admin', 'operations', 'sales', 'finance']));

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id AND primary_role = (SELECT primary_role FROM public.profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "Admin manage profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage roles" ON public.roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin manage permissions" ON public.permissions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin manage role_permissions" ON public.role_permissions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin manage user_roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin and finance read audit_events" ON public.audit_events
  FOR SELECT TO authenticated USING (public.has_any_role(ARRAY['admin', 'finance']));

-- 6. GUESTS, CONTACTS, ENQUIRIES & NOTES
DROP POLICY IF EXISTS "Admins full access to guests" ON public.guests;
DROP POLICY IF EXISTS "Deny anon access to guests" ON public.guests;

CREATE POLICY "Guest read own guest record" ON public.guests
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.has_any_role(ARRAY['admin', 'sales', 'operations', 'finance']));

CREATE POLICY "Sales operations admin manage guests" ON public.guests
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'sales', 'operations']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Guest manage own contacts" ON public.guest_contacts
  FOR ALL TO authenticated
  USING (guest_id = public.current_guest_id() OR public.has_any_role(ARRAY['admin', 'sales', 'operations']))
  WITH CHECK (guest_id = public.current_guest_id() OR public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Public insert enquiries" ON public.enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Sales admin manage enquiries" ON public.enquiries
  FOR SELECT TO authenticated USING (public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Sales admin update enquiries" ON public.enquiries
  FOR UPDATE TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'sales', 'operations']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Staff manage customer_notes" ON public.customer_notes
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'sales', 'operations']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'sales', 'operations']));

-- 7. BOOKINGS, ITINERARIES, ASSIGNMENTS, QUOTATIONS
DROP POLICY IF EXISTS "Admins full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Deny anon access to bookings" ON public.bookings;

CREATE POLICY "Guest read own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    guest_id = public.current_guest_id()
    OR public.has_any_role(ARRAY['admin', 'sales', 'operations', 'finance'])
    OR EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.booking_id = bookings.id AND a.driver_id = public.current_driver_id()
    )
  );

CREATE POLICY "Staff manage bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'sales', 'operations']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Guest and staff read booking_guests" ON public.booking_guests
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.guest_id = public.current_guest_id())
    OR public.has_any_role(ARRAY['admin', 'sales', 'operations'])
  );

CREATE POLICY "Guest driver staff read itineraries" ON public.itineraries
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.guest_id = public.current_guest_id())
    OR EXISTS (SELECT 1 FROM public.assignments a WHERE a.booking_id = itineraries.booking_id AND a.driver_id = public.current_driver_id())
    OR public.has_any_role(ARRAY['admin', 'sales', 'operations'])
  );

CREATE POLICY "Driver read own assignments" ON public.assignments
  FOR SELECT TO authenticated
  USING (driver_id = public.current_driver_id() OR public.has_any_role(ARRAY['admin', 'operations', 'sales']));

CREATE POLICY "Operations admin manage assignments" ON public.assignments
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'operations']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'operations']));

CREATE POLICY "Sales finance admin manage quotations" ON public.quotations
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'sales', 'finance']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'sales', 'finance']));

CREATE POLICY "Sales finance admin manage quotation_versions" ON public.quotation_versions
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'sales', 'finance']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'sales', 'finance']));

CREATE POLICY "Sales finance admin manage quotation_items" ON public.quotation_items
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'sales', 'finance']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'sales', 'finance']));

-- 8. SUPPLIERS & CONFIDENTIAL RATES (Strictly Finance + Admin, Ops read-only on contracts)
DROP POLICY IF EXISTS "Admins full access to suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Deny anon access to suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Admins full access to contracts" ON public.contracts;
DROP POLICY IF EXISTS "Deny anon access to contracts" ON public.contracts;

CREATE POLICY "Finance admin manage suppliers" ON public.suppliers
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'finance']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'finance']));

CREATE POLICY "Ops sales read suppliers" ON public.suppliers
  FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['operations', 'sales']));

CREATE POLICY "Finance admin manage supplier_contracts" ON public.supplier_contracts
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'finance']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'finance']));

CREATE POLICY "Finance admin manage accommodation_rates" ON public.accommodation_rates
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'finance', 'sales']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'finance']));

-- 9. FLEET & DRIVERS
CREATE POLICY "Driver read own driver profile" ON public.drivers
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.has_any_role(ARRAY['admin', 'operations']));

CREATE POLICY "Ops admin manage fleet and drivers" ON public.vehicles
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'operations']) OR EXISTS (
    SELECT 1 FROM public.assignments a WHERE a.vehicle_id = vehicles.id AND a.driver_id = public.current_driver_id()
  ))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'operations']));

CREATE POLICY "Ops admin manage maintenance" ON public.maintenance_records
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'operations']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'operations']));

-- 10. PAYMENTS, INVOICES, DOCUMENTS, ORDERS & NOTIFICATIONS
DROP POLICY IF EXISTS "Admins full access to payments" ON public.payments;
DROP POLICY IF EXISTS "Deny anon access to payments" ON public.payments;

CREATE POLICY "Finance admin read payments" ON public.payments
  FOR SELECT TO authenticated USING (public.has_any_role(ARRAY['admin', 'finance']));

CREATE POLICY "Guest read own payment_requests" ON public.payment_requests
  FOR SELECT TO authenticated
  USING (guest_id = public.current_guest_id() OR public.has_any_role(ARRAY['admin', 'finance', 'sales']));

CREATE POLICY "Guest read own payment_transactions" ON public.payment_transactions
  FOR SELECT TO authenticated
  USING (guest_id = public.current_guest_id() OR public.has_any_role(ARRAY['admin', 'finance']));

CREATE POLICY "Finance admin manage refunds" ON public.refunds
  FOR ALL TO authenticated
  USING (public.has_any_role(ARRAY['admin', 'finance']))
  WITH CHECK (public.has_any_role(ARRAY['admin', 'finance']));

CREATE POLICY "Guest read own invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (guest_id = public.current_guest_id() OR public.has_any_role(ARRAY['admin', 'finance', 'sales']));

CREATE POLICY "Guest read own documents" ON public.documents
  FOR SELECT TO authenticated
  USING (
    (guest_id = public.current_guest_id() AND is_guest_visible = true)
    OR public.has_any_role(ARRAY['admin', 'operations', 'finance', 'sales'])
  );

CREATE POLICY "Guest manage own carts" ON public.carts
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Guest read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (guest_id = public.current_guest_id() OR public.has_any_role(ARRAY['admin', 'operations', 'finance']));

CREATE POLICY "User read own notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_admin())
  WITH CHECK (user_id = (SELECT auth.uid()) OR public.is_admin());

-- 11. AI RECEPTIONIST, HUNTER, SEO & WEBHOOK EVENTS (Staff/Admin only)
CREATE POLICY "Staff manage call_events" ON public.call_events
  FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin', 'sales', 'operations'])) WITH CHECK (public.has_any_role(ARRAY['admin', 'sales', 'operations']));

CREATE POLICY "Staff manage leads" ON public.leads
  FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin', 'sales'])) WITH CHECK (public.has_any_role(ARRAY['admin', 'sales']));

CREATE POLICY "Admin manage ai_action_logs" ON public.ai_action_logs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin manage webhook events" ON public.integration_webhook_events
  FOR SELECT TO authenticated USING (public.has_any_role(ARRAY['admin', 'finance']));

-- 12. AUDIT TRIGGER FOR SENSITIVE TABLES
CREATE OR REPLACE FUNCTION public.audit_sensitive_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_events (
    actor_user_id,
    actor_role,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'system'),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.audit_sensitive_mutation() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_audit_bookings ON public.bookings;
CREATE TRIGGER trg_audit_bookings AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_mutation();

DROP TRIGGER IF EXISTS trg_audit_payment_tx ON public.payment_transactions;
CREATE TRIGGER trg_audit_payment_tx AFTER INSERT OR UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_mutation();

DROP TRIGGER IF EXISTS trg_audit_pricing_rules ON public.pricing_rules;
CREATE TRIGGER trg_audit_pricing_rules AFTER INSERT OR UPDATE OR DELETE ON public.pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_mutation();

DROP TRIGGER IF EXISTS trg_audit_accommodation_rates ON public.accommodation_rates;
CREATE TRIGGER trg_audit_accommodation_rates AFTER INSERT OR UPDATE OR DELETE ON public.accommodation_rates
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_mutation();

DROP TRIGGER IF EXISTS trg_audit_user_roles ON public.user_roles;
CREATE TRIGGER trg_audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_mutation();
