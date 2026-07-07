-- ==========================================================================
-- Vayita Grow — 0005 EXTENSIONS
-- Domains/columns flagged EXTENSION in lib/types/* that are NOT in DBML v1.2.0
-- but are confirmed product requirements: statements, field reports, product
-- marketing details, customer state/status, and public-form persistence.
-- ==========================================================================

-- EXTENSION enums -----------------------------------------------------------
CREATE TYPE field_report_status AS ENUM ('Completed', 'Follow_Up_Required');
CREATE TYPE customer_status AS ENUM ('Active', 'Inactive', 'New');

-- Customers: dashboard-facing state + relationship status -------------------
ALTER TABLE customers
  ADD COLUMN state  VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN status customer_status NOT NULL DEFAULT 'New';
CREATE INDEX idx_customers_status ON customers(status);

-- Products: public URL slug + marketing detail set --------------------------
ALTER TABLE products
  ADD COLUMN slug VARCHAR(120) UNIQUE;
-- Backfill-safe: slug is nullable at add time; the app enforces presence on write.

CREATE TABLE product_details (
  product_id        INTEGER PRIMARY KEY REFERENCES products(product_id) ON DELETE CASCADE,
  short_description TEXT NOT NULL DEFAULT '',
  benefits          TEXT[] NOT NULL DEFAULT '{}',
  dosage            TEXT NOT NULL DEFAULT '',
  composition       TEXT,
  pack_sizes        TEXT[] NOT NULL DEFAULT '{}',
  image_cutout_url  VARCHAR(500)                     -- Cloudinary background-removed cutout
);

-- Statements: dealer account statements uploaded by staff -------------------
CREATE TABLE statements (
  statement_id     SERIAL PRIMARY KEY,
  statement_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id      INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  period_label     VARCHAR(100) NOT NULL,
  upload_date      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by      INTEGER NOT NULL REFERENCES users(user_id)
);
CREATE INDEX idx_statements_customer_id ON statements(customer_id);
CREATE INDEX idx_statements_uploaded_by ON statements(uploaded_by);

-- Field reports: field staff visit reports ----------------------------------
CREATE TABLE field_reports (
  report_id   SERIAL PRIMARY KEY,
  visit_date  DATE NOT NULL,
  customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
  dealer_name VARCHAR(150) NOT NULL,
  location    VARCHAR(255) NOT NULL,
  summary     TEXT NOT NULL,
  status      field_report_status NOT NULL,
  created_by  INTEGER NOT NULL REFERENCES users(user_id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_field_reports_created_by  ON field_reports(created_by);
CREATE INDEX idx_field_reports_status      ON field_reports(status);
CREATE INDEX idx_field_reports_customer_id ON field_reports(customer_id);

-- Public contact inquiries (persisted; also emailed via Resend in Phase 3) ---
CREATE TABLE contact_inquiries (
  inquiry_id   SERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  organization VARCHAR(150),
  phone        VARCHAR(20) NOT NULL,
  email        VARCHAR(255),
  subject      VARCHAR(40) NOT NULL,               -- dealership | order | product | other
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at);

-- Public site feedback (distinct from internal `feedback` tickets) ----------
CREATE TABLE public_feedback (
  feedback_id SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  role        VARCHAR(40) NOT NULL,                -- dealer | distributor | retailer | farmer | other
  email       VARCHAR(255),
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_public_feedback_created_at ON public_feedback(created_at);
