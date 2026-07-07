-- ==========================================================================
-- Vayita Grow — 0001 ENUMS
-- Mirrors the PostgreSQL ENUM types in docs/project_details/ERD_dbml.md
-- (schema v1.2.0). Value casing intentionally matches lib/types/database.ts
-- so the application layer is a drop-in swap.
--
-- NOTE: role_name_enum uses `staff` (renamed from the documented `sub_admin`
-- per the current product decision). See 0005_extensions.sql for the
-- EXTENSION enums that are not part of DBML v1.2.0.
-- ==========================================================================

CREATE TYPE role_name_enum AS ENUM ('dev', 'admin', 'staff');

CREATE TYPE order_status AS ENUM (
  'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
);

CREATE TYPE payment_method AS ENUM (
  'Bank_Transfer', 'Credit_Card', 'UPI', 'Cash'
);

CREATE TYPE payment_status AS ENUM (
  'Pending', 'Completed', 'Failed', 'Refunded'
);

CREATE TYPE delivery_status AS ENUM (
  'Dispatching', 'In_Transit', 'Delivered', 'Returned'
);

CREATE TYPE feedback_status AS ENUM (
  'Open', 'In_Progress', 'Resolved', 'Closed'
);

CREATE TYPE action_type AS ENUM (
  'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
);

CREATE TYPE entity_type AS ENUM (
  'USER', 'PRODUCT', 'ORDER', 'INVENTORY', 'DELIVERY', 'SYSTEM'
);
