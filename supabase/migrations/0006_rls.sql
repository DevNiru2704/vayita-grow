-- ==========================================================================
-- Vayita Grow — 0006 ROW-LEVEL SECURITY (defense-in-depth)
--
-- MODEL (important): this app uses CUSTOM authentication (JWT cookie + Argon2)
-- and talks to Postgres through ONE trusted, server-side connection (the `pg`
-- pool over DATABASE_URL). Authorization is enforced in the application layer
-- (`requireSession`/`requireRole` on every server action). RLS here is NOT the
-- primary control — it is a safety net whose main job is to ensure that
-- Supabase's auto-generated PostgREST API roles (`anon`, `authenticated`) and
-- any other non-privileged role CANNOT read or write these tables directly.
--
-- The backend connects as a role that bypasses RLS (Supabase `postgres`/service
-- role, i.e. table owner with RLS not FORCED). Enabling RLS with NO permissive
-- policies for anon/authenticated makes the default answer "deny" for them.
--
-- If you later run the backend as a dedicated least-privilege login role,
-- create it as BYPASSRLS or add explicit policies — see the commented block at
-- the end. Only move to `auth.uid()`-based per-row policies if the app ever
-- switches to client-side Supabase access (not planned).
-- ==========================================================================

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'roles','users','login_history','user_token_blacklist',
    'customers','customer_notes',
    'product_categories','products','product_images','product_details',
    'suppliers','inventory','inventory_logs',
    'orders','order_items','payments',
    'deliveries','delivery_updates',
    'feedback','activity_logs','system_settings',
    'statements','field_reports','contact_inquiries','public_feedback'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- Deny-by-default: RLS on, and no policies means non-bypassing roles see nothing.
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);

    -- Strip any table grants from the public API roles if they exist.
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE format('REVOKE ALL ON TABLE %I FROM anon;', t);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      EXECUTE format('REVOKE ALL ON TABLE %I FROM authenticated;', t);
    END IF;
    EXECUTE format('REVOKE ALL ON TABLE %I FROM PUBLIC;', t);
  END LOOP;
END $$;

-- --------------------------------------------------------------------------
-- OPTIONAL: dedicated least-privilege backend role.
-- Uncomment and point DATABASE_URL at it to avoid connecting as a superuser.
-- BYPASSRLS keeps the app working while RLS still blocks anon/authenticated.
-- --------------------------------------------------------------------------
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'vayita_app') THEN
--     CREATE ROLE vayita_app LOGIN PASSWORD 'CHANGE_ME' BYPASSRLS;
--   END IF;
-- END $$;
-- GRANT USAGE ON SCHEMA public TO vayita_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO vayita_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO vayita_app;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
--   GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO vayita_app;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
--   GRANT USAGE, SELECT ON SEQUENCES TO vayita_app;
