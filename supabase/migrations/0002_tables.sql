-- ==========================================================================
-- Vayita Grow — 0002 CORE TABLES
-- The 20 tables of DBML v1.2.0 (docs/project_details/ERD_dbml.md), across the
-- 7 documented modules. EXTENSION tables/columns live in 0005_extensions.sql.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. USER & ACCESS MANAGEMENT
-- --------------------------------------------------------------------------
CREATE TABLE roles (
  role_id    SERIAL PRIMARY KEY,
  role_name  role_name_enum UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  user_id        SERIAL PRIMARY KEY,
  username       VARCHAR(50) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,          -- Argon2id encoded hash
  is_2fa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  two_fa_secret  VARCHAR(255),                   -- base32 TOTP secret (nullable)
  role_id        INTEGER NOT NULL REFERENCES roles(role_id),
  created_by     INTEGER REFERENCES users(user_id),
  updated_by     INTEGER REFERENCES users(user_id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE login_history (
  history_id  SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  login_time  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address  VARCHAR(100),
  device_info TEXT
);

-- Revoked JWT ids (challenge + session), pruned by expiry. Supports secure logout.
CREATE TABLE user_token_blacklist (
  blacklist_id SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token_jti    VARCHAR(255) NOT NULL,
  expires_at   TIMESTAMPTZ NOT NULL
);

-- --------------------------------------------------------------------------
-- 2. CUSTOMER MANAGEMENT
-- --------------------------------------------------------------------------
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  full_name   VARCHAR(150) NOT NULL,
  email       VARCHAR(255) UNIQUE,
  phone       VARCHAR(20) UNIQUE NOT NULL,
  address     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE customer_notes (
  note_id     SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  created_by  INTEGER NOT NULL REFERENCES users(user_id),
  note_text   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 3. PRODUCT & CATEGORY MANAGEMENT (CMS-ready)
-- --------------------------------------------------------------------------
CREATE TABLE product_categories (
  category_id   SERIAL PRIMARY KEY,
  category_name VARCHAR(100) UNIQUE NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  product_id  SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES product_categories(category_id),
  sku         VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  base_price  DECIMAL(10,2) NOT NULL,
  image_url   VARCHAR(500),                       -- Cloudinary secure URL
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_images (
  image_id   SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  image_url  VARCHAR(500) NOT NULL,               -- Cloudinary secure URL
  is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

-- --------------------------------------------------------------------------
-- 4. INVENTORY & SUPPLIER MANAGEMENT
-- --------------------------------------------------------------------------
CREATE TABLE suppliers (
  supplier_id   SERIAL PRIMARY KEY,
  company_name  VARCHAR(150) NOT NULL,
  contact_email VARCHAR(100),
  phone         VARCHAR(20)
);

CREATE TABLE inventory (
  inventory_id SERIAL PRIMARY KEY,
  product_id   INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  supplier_id  INTEGER REFERENCES suppliers(supplier_id),
  quantity     INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory_logs (
  log_id        SERIAL PRIMARY KEY,
  inventory_id  INTEGER NOT NULL REFERENCES inventory(inventory_id) ON DELETE CASCADE,
  user_id       INTEGER NOT NULL REFERENCES users(user_id),
  change_amount INTEGER NOT NULL,
  reason        VARCHAR(150) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 5. ORDER & PAYMENT MANAGEMENT
-- --------------------------------------------------------------------------
CREATE TABLE orders (
  order_id     SERIAL PRIMARY KEY,
  customer_id  INTEGER NOT NULL REFERENCES customers(customer_id),
  status       order_status NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  created_by   INTEGER NOT NULL REFERENCES users(user_id),
  updated_by   INTEGER REFERENCES users(user_id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  item_id    SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  quantity   INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL               -- locked at checkout
);

CREATE TABLE payments (
  payment_id     SERIAL PRIMARY KEY,
  order_id       INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  amount         DECIMAL(12,2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL,
  processed_at   TIMESTAMPTZ
);

-- --------------------------------------------------------------------------
-- 6. DELIVERY MANAGEMENT
-- --------------------------------------------------------------------------
CREATE TABLE deliveries (
  delivery_id  SERIAL PRIMARY KEY,
  order_id     INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  courier_name VARCHAR(150),
  tracking_num VARCHAR(100),
  status       delivery_status NOT NULL,
  delivered_at TIMESTAMPTZ
);

CREATE TABLE delivery_updates (
  update_id   SERIAL PRIMARY KEY,
  delivery_id INTEGER NOT NULL REFERENCES deliveries(delivery_id) ON DELETE CASCADE,
  status      delivery_status NOT NULL,
  location    VARCHAR(255),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 7. SYSTEM FEEDBACK & AUDITING
-- --------------------------------------------------------------------------
CREATE TABLE feedback (
  feedback_id SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(user_id),
  subject     VARCHAR(150) NOT NULL,
  message     TEXT NOT NULL,
  status      feedback_status NOT NULL DEFAULT 'Open',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_logs (
  log_id      SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(user_id),
  action_type action_type NOT NULL,
  entity_type entity_type NOT NULL,
  entity_id   INTEGER,
  ip_address  VARCHAR(100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE system_settings (
  setting_id    SERIAL PRIMARY KEY,
  setting_key   VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL
);
