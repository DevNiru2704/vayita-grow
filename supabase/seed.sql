-- ==========================================================================
-- Vayita Grow — seed.sql (minimal reference data for a fresh database)
-- Safe to run repeatedly. This inserts ONLY the static reference rows a
-- production database needs to function. Demo content (staff accounts with
-- Argon2 passwords, catalog, customers, orders, …) is seeded by the Node
-- script `scripts/seed.ts`, which mirrors lib/mock/seed/* into the DB.
-- ==========================================================================

INSERT INTO roles (role_id, role_name) VALUES
  (1, 'dev'),
  (2, 'admin'),
  (3, 'staff')
ON CONFLICT (role_name) DO NOTHING;

-- Keep the SERIAL sequence ahead of the explicit ids above.
SELECT setval(pg_get_serial_sequence('roles', 'role_id'),
              (SELECT MAX(role_id) FROM roles));

INSERT INTO system_settings (setting_key, setting_value) VALUES
  ('company_display_name', 'VayitaGrow Bioorganics'),
  ('default_currency',     'INR'),
  ('financial_year_start', 'April'),
  ('low_stock_threshold',  '50'),
  ('order_id_prefix',      'ORD'),
  ('statement_id_prefix',  'STM')
ON CONFLICT (setting_key) DO NOTHING;
