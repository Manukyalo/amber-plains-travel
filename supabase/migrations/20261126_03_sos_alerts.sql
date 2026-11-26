-- Amber Plains: SOS Alerts table (Phase 3)
-- Applied after 20261125_02_rls_and_audit.sql

-- Enum for emergency types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sos_emergency_type') THEN
    CREATE TYPE public.sos_emergency_type AS ENUM ('Emergency','Medical','Mechanical','Stuck');
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sos_status') THEN
    CREATE TYPE public.sos_status AS ENUM ('Active','Acknowledged','Resolved');
  END IF;
END;
$$;

-- Main SOS alerts table
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id         UUID          REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name       TEXT          NOT NULL,
  vehicle_plate     TEXT          NOT NULL,
  park_name         TEXT          NOT NULL,
  emergency_type    public.sos_emergency_type NOT NULL,
  status            public.sos_status         NOT NULL DEFAULT 'Active',
  notes             TEXT,
  latitude          NUMERIC(9,6),
  longitude         NUMERIC(9,6),
  acknowledged_by   UUID          REFERENCES public.profiles(id) ON DELETE SET NULL,
  acknowledged_at   TIMESTAMPTZ,
  resolved_by       UUID          REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT timezone('utc', now()),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS sos_alerts_status_idx    ON public.sos_alerts(status);
CREATE INDEX IF NOT EXISTS sos_alerts_created_idx   ON public.sos_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS sos_alerts_driver_idx    ON public.sos_alerts(driver_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_sos_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sos_alerts_updated_at ON public.sos_alerts;
CREATE TRIGGER sos_alerts_updated_at
  BEFORE UPDATE ON public.sos_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_sos_updated_at();

-- Enable RLS
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Admins and operations staff can read all SOS alerts
CREATE POLICY "sos_alerts_read_ops"
  ON public.sos_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin','operations')
    )
  );

-- Policy: Drivers can see only their own SOS alerts
CREATE POLICY "sos_alerts_read_driver"
  ON public.sos_alerts FOR SELECT
  TO authenticated
  USING (
    driver_id IN (
      SELECT id FROM public.drivers WHERE profile_id = auth.uid()
    )
  );

-- Policy: Drivers can insert their own SOS alerts
CREATE POLICY "sos_alerts_insert_driver"
  ON public.sos_alerts FOR INSERT
  TO authenticated
  WITH CHECK (
    driver_id IN (
      SELECT id FROM public.drivers WHERE profile_id = auth.uid()
    )
  );

-- Policy: Admins and operations can update (acknowledge / resolve)
CREATE POLICY "sos_alerts_update_ops"
  ON public.sos_alerts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin','operations')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin','operations')
    )
  );

-- Policy: Only admins can delete SOS records
CREATE POLICY "sos_alerts_delete_admin"
  ON public.sos_alerts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'admin'
    )
  );

-- Audit trigger for SOS state changes
CREATE OR REPLACE FUNCTION public.audit_sos_alert_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.audit_events (
    actor_id, module, action, record_id, before_state, after_state
  ) VALUES (
    auth.uid(),
    'sos_alerts',
    TG_OP,
    NEW.id,
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.audit_sos_alert_change() FROM PUBLIC;

DROP TRIGGER IF EXISTS sos_alerts_audit ON public.sos_alerts;
CREATE TRIGGER sos_alerts_audit
  AFTER UPDATE ON public.sos_alerts
  FOR EACH ROW EXECUTE FUNCTION public.audit_sos_alert_change();
