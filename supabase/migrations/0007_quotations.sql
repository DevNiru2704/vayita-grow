-- ==========================================================================
-- Vayita Grow — 0007 QUOTATIONS (EXTENSION module)
-- Sales quotations that admins draft and assign ("send") to a staff member.
-- Mirrors the orders module structure. Adds QUOTATION to the audit entity enum.
-- ==========================================================================

CREATE TYPE quotation_status AS ENUM ('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired');

-- Extend the audit entity enum (ADD VALUE runs outside a txn block via psql).
ALTER TYPE entity_type ADD VALUE IF NOT EXISTS 'QUOTATION';

CREATE TABLE quotations (
  quotation_id      SERIAL PRIMARY KEY,
  quotation_number  VARCHAR(50) UNIQUE NOT NULL,
  customer_id       INTEGER NOT NULL REFERENCES customers(customer_id),
  created_by        INTEGER NOT NULL REFERENCES users(user_id),
  assigned_staff_id INTEGER REFERENCES users(user_id),
  status            quotation_status NOT NULL DEFAULT 'Draft',
  total_amount      DECIMAL(12,2) NOT NULL,
  valid_until       DATE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_quotations_customer_id       ON quotations(customer_id);
CREATE INDEX idx_quotations_status            ON quotations(status);
CREATE INDEX idx_quotations_assigned_staff_id ON quotations(assigned_staff_id);
CREATE INDEX idx_quotations_created_by        ON quotations(created_by);

CREATE TABLE quotation_items (
  item_id      SERIAL PRIMARY KEY,
  quotation_id INTEGER NOT NULL REFERENCES quotations(quotation_id) ON DELETE CASCADE,
  product_id   INTEGER NOT NULL REFERENCES products(product_id),
  quantity     INTEGER NOT NULL,
  unit_price   DECIMAL(10,2) NOT NULL
);
CREATE INDEX idx_quotation_items_quotation_id ON quotation_items(quotation_id);
CREATE INDEX idx_quotation_items_product_id   ON quotation_items(product_id);

-- RLS: deny-by-default, matching 0006_rls.sql (backend connection bypasses RLS).
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['quotations', 'quotation_items'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE format('REVOKE ALL ON TABLE %I FROM anon;', t);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      EXECUTE format('REVOKE ALL ON TABLE %I FROM authenticated;', t);
    END IF;
    EXECUTE format('REVOKE ALL ON TABLE %I FROM PUBLIC;', t);
  END LOOP;
END $$;
