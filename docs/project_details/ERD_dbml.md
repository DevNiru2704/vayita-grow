# DBML Source Code for ERD & Indexes

```dbml
// ==========================================
// VAYITA GROW: BIOORGANICS DATABASE SCHEMA
// VERSION 1.2.0 (STRICT TYPE HARDENING)
// ==========================================

// ------------------------------------------
// SCHEMA ENUMS
// ------------------------------------------
Enum role_name_enum {
dev
admin
staff
}

Enum order_status {
Pending
Processing
Shipped
Delivered
Cancelled
}

Enum payment_method {
Bank_Transfer
Credit_Card
UPI
Cash
}

Enum payment_status {
Pending
Completed
Failed
Refunded
}

Enum delivery_status {
Dispatching
In_Transit
Delivered
Returned
}

Enum feedback_status {
Open
In_Progress
Resolved
Closed
}

Enum action_type {
CREATE
UPDATE
DELETE
LOGIN
LOGOUT
}

Enum entity_type {
USER
PRODUCT
ORDER
INVENTORY
DELIVERY
SYSTEM
}

// ------------------------------------------
// 1. USER & ACCESS MANAGEMENT
// ------------------------------------------
Table roles {
role_id integer [primary key, increment]
role_name role_name_enum [unique, not null]
created_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table users {
user_id integer [primary key, increment]
username varchar(50) [unique, not null]
password_hash varchar(255) [not null]
is_2fa_enabled boolean [default: false]
two_fa_secret varchar(255)
role_id integer [not null]
created_by integer
updated_by integer
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
username
role_id
}
}

Table login_history {
history_id integer [primary key, increment]
user_id integer [not null]
login_time timestamp [default: `CURRENT_TIMESTAMP`]
ip_address varchar(100)
device_info text

Indexes {
user_id
login_time
}
}

Table user_token_blacklist {
blacklist_id integer [primary key, increment]
user_id integer [not null]
token_jti varchar(255) [not null]
expires_at timestamp [not null]

Indexes {
user_id
token_jti
expires_at
}
}

// ------------------------------------------
// 2. CUSTOMER MANAGEMENT
// ------------------------------------------
Table customers {
customer_id integer [primary key, increment]
full_name varchar(150) [not null]
email varchar(255) [unique]
phone varchar(20) [unique, not null]
address text [not null]
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
email
phone
}
}

Table customer_notes {
note_id integer [primary key, increment]
customer_id integer [not null]
created_by integer [not null]
note_text text [not null]
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
customer_id
}
}

// ------------------------------------------
// 3. PRODUCT & CATEGORY MANAGEMENT
// ------------------------------------------
Table product_categories {
category_id integer [primary key, increment]
category_name varchar(100) [unique, not null]
description text
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
category_name
}
}

Table products {
product_id integer [primary key, increment]
name varchar(100) [not null]
category_id integer [not null]
sku varchar(20) [unique, not null]
description text
base_price decimal(10,2) [not null]
image_url varchar(500)
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
sku
category_id
}
}

Table product_images {
image_id integer [primary key, increment]
product_id integer [not null]
image_url varchar(500) [not null]
is_primary boolean [default: false]

Indexes {
product_id
}
}

// ------------------------------------------
// 4. INVENTORY & SUPPLIER MANAGEMENT
// ------------------------------------------
Table suppliers {
supplier_id integer [primary key, increment]
company_name varchar(150) [not null]
contact_email varchar(100)
phone varchar(20)
}

Table inventory {
inventory_id integer [primary key, increment]
product_id integer [not null]
supplier_id integer
quantity integer [default: 0]
last_updated timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
product_id
supplier_id
}
}

Table inventory_logs {
log_id integer [primary key, increment]
inventory_id integer [not null]
user_id integer [not null]
change_amount integer [not null]
reason varchar(150) [not null]
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
inventory_id
user_id
created_at
}
}

// ------------------------------------------
// 5. ORDER & PAYMENT MANAGEMENT
// ------------------------------------------
Table orders {
order_id integer [primary key, increment]
customer_id integer [not null]
status order_status [not null]
total_amount decimal(12,2) [not null]
created_by integer [not null]
updated_by integer
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
customer_id
status
created_by
}
}

Table order_items {
item_id integer [primary key, increment]
order_id integer [not null]
product_id integer [not null]
quantity integer [not null]
unit_price decimal(10,2) [not null]

Indexes {
order_id
product_id
}
}

Table payments {
payment_id integer [primary key, increment]
order_id integer [not null]
amount decimal(12,2) [not null]
payment_method payment_method [not null]
payment_status payment_status [not null]
processed_at timestamp

Indexes {
order_id
payment_status
}
}

// ------------------------------------------
// 6. DELIVERY MANAGEMENT
// ------------------------------------------
Table deliveries {
delivery_id integer [primary key, increment]
order_id integer [not null]
courier_name varchar(150)
tracking_num varchar(100)
status delivery_status [not null]
delivered_at timestamp

Indexes {
order_id
status
tracking_num
}
}

Table delivery_updates {
update_id integer [primary key, increment]
delivery_id integer [not null]
status delivery_status [not null]
location varchar(255)
updated_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
delivery_id
}
}

// ------------------------------------------
// 7. SYSTEM FEEDBACK & AUDITING
// ------------------------------------------
Table feedback {
feedback_id integer [primary key, increment]
user_id integer [not null]
subject varchar(150) [not null]
message text [not null]
status feedback_status [default: 'Open']
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
user_id
status
}
}

Table activity_logs {
log_id integer [primary key, increment]
user_id integer [not null]
action_type action_type [not null]
entity_type entity_type [not null]
entity_id integer
ip_address varchar(100)
created_at timestamp [default: `CURRENT_TIMESTAMP`]

Indexes {
user_id
action_type
entity_type
created_at
}
}

Table system_settings {
setting_id integer [primary key, increment]
setting_key varchar(100) [unique, not null]
setting_value text [not null]
}

// ==========================================
// RELATIONSHIPS (FOREIGN KEY DECLARATIONS)
// ==========================================
Ref: users.role_id > roles.role_id
Ref: users.created_by > users.user_id
Ref: users.updated_by > users.user_id
Ref: login_history.user_id > users.user_id
Ref: user_token_blacklist.user_id > users.user_id
Ref: customer_notes.customer_id > customers.customer_id
Ref: customer_notes.created_by > users.user_id

// Decoupled CMS Categories
Ref: products.category_id > product_categories.category_id

Ref: product_images.product_id > products.product_id
Ref: inventory.product_id > products.product_id
Ref: inventory.supplier_id > suppliers.supplier_id
Ref: inventory_logs.inventory_id > inventory.inventory_id
Ref: inventory_logs.user_id > users.user_id
Ref: orders.customer_id > customers.customer_id
Ref: orders.created_by > users.user_id
Ref: orders.updated_by > users.user_id
Ref: order_items.order_id > orders.order_id
Ref: order_items.product_id > products.product_id
Ref: payments.order_id > orders.order_id
Ref: deliveries.order_id > orders.order_id
Ref: delivery_updates.delivery_id > deliveries.delivery_id
Ref: feedback.user_id > users.user_id
Ref: activity_logs.user_id > users.user_id
```

## EXTENSION schema (implemented, not in v1.2.0)

Added during the backend build (`supabase/migrations/0005_extensions.sql`,
`0007_quotations.sql`). The `entity_type` enum gains `QUOTATION`; `role_name_enum`
uses `staff` (renamed from `sub_admin`).

```dbml
Enum field_report_status { Completed Follow_Up_Required }
Enum customer_status { Active Inactive New }
Enum quotation_status { Draft Sent Accepted Rejected Expired }

// customers gains: state varchar, status customer_status
// products gains:  slug varchar [unique]

Table product_details {
  product_id integer [pk] // FK products
  short_description text
  benefits text[]
  dosage text
  composition text
  pack_sizes text[]
  image_cutout_url varchar(500) // Cloudinary
}

Table statements {
  statement_id integer [pk, increment]
  statement_number varchar(50) [unique, not null]
  customer_id integer [not null]  // FK customers
  period_label varchar(100) [not null]
  upload_date timestamp
  uploaded_by integer [not null]  // FK users
}

Table field_reports {
  report_id integer [pk, increment]
  visit_date date [not null]
  customer_id integer            // FK customers (nullable)
  dealer_name varchar(150) [not null]
  location varchar(255) [not null]
  summary text [not null]
  status field_report_status [not null]
  created_by integer [not null]  // FK users
  created_at timestamp
}

Table quotations {
  quotation_id integer [pk, increment]
  quotation_number varchar(50) [unique, not null]
  customer_id integer [not null]       // FK customers
  created_by integer [not null]        // FK users
  assigned_staff_id integer            // FK users (nullable)
  status quotation_status [not null, default: 'Draft']
  total_amount decimal(12,2) [not null]
  valid_until date
  notes text
  created_at timestamp
}

Table quotation_items {
  item_id integer [pk, increment]
  quotation_id integer [not null]  // FK quotations
  product_id integer [not null]    // FK products
  quantity integer [not null]
  unit_price decimal(10,2) [not null]
}

// Public form persistence
Table contact_inquiries {
  inquiry_id integer [pk, increment]
  name varchar(150) [not null]
  organization varchar(150)
  phone varchar(20) [not null]
  email varchar(255)
  subject varchar(40) [not null]
  message text [not null]
  created_at timestamp
}

Table public_feedback {
  feedback_id integer [pk, increment]
  name varchar(150) [not null]
  role varchar(40) [not null]
  email varchar(255)
  message text [not null]
  created_at timestamp
}
```
