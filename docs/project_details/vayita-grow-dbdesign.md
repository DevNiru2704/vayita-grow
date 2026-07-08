# Page 1

Vayita Grow Bioorganics
Database Design Document
Prepared By:
Development Team:
Mr. Nirmalya Mandal
Version: 1.0.0
Date: June 28, 2026


---

# Page 2

Executive Summary
This document presents the finalized database architecture for the Vayita Grow Bioorganics
platform.
The database has been designed to support the complete operational lifecycle of a bioorganics
manufacturer, encompassing rigorous user access control, dynamic product and category
management, inventory control, order processing, delivery tracking, and system auditing.
The database follows a relational design using PostgreSQL (hosted via Supabase) and has
been structured to maintain data integrity, support scalability, enforce robust security (including
Argon2 password hashing and 2FA), and facilitate future system expansion. Strict indexing
strategies and an automated trigger-based data retention policy for activity logging are
implemented to ensure optimal database performance.


---

# Page 3

Database Overview
To ensure maintainability, security, and separation of concerns, the database is organized into
the following seven modules:
1. User & Access Management Handles user accounts, passwords, security tokens, roles,
and session history.
2. Customer Management Manages client data profiles, locations, and internal notes.
3. Product & Category Management (CMS Ready) Features a decoupled category
management schema to support a custom Content Management System.
4. Inventory & Supplier Management Tracks stock levels, material sourcing, and inventory
log modifications.
5. Order & Payment Management Manages client transactions, invoice items, methods,
and processing states.
6. Delivery Management Handles shipping logistics, tracking status, and transit milestone
updates.
7. System Feedback & Auditing Ensures operational compliance through systematic audit
logging, system settings, and feedback tickets.


---

# Page 4

ERD (Entity Relationship Diagram):
‘


---

# Page 5

Database Design Principles
The database architecture for Vayita Grow is designed in accordance with the following core
principles:
Relational Database Architecture
The design utilizes PostgreSQL, taking advantage of strong typing, ACID compliance, and
robust relational mapping.
Enumerated Types (ENUMs)
To prevent dirty data and ensure rigid schema validation, all state-specific, categorical, and
event attributes are strictly mapped to custom PostgreSQL ENUM types rather than loosely
typed VARCHAR fields.
Third Normal Form (3NF)
The database has been normalized to eliminate redundant data storage and maintain update
consistency. Information is stored in dedicated tables and linked through relationships.
Security First
Passwords are never stored in plaintext; they utilize the memory-hard Argon2 hashing
algorithm. Additionally, a Two-Factor Authentication (2FA) mechanism is built into the schema
via a challenge-token approach, supported by a JSON Web Token (JWT) blacklisting table for
secure logouts.
Auditability & Automated Data Retention
The system maintains historical records for critical business operations. Rather than overwriting
critical financial or access information, changes are recorded in dedicated history and tracking
tables. To prevent infinite storage bloat on hosting platforms, an automated SQL trigger-based
cleanup policy is configured for high-frequency activity logging.


---

# Page 6

Database Performance and Scalability Considerations
As Vayita Grow scales, database latency must be kept minimal. This schema incorporates
several optimization vectors:
Indexing Strategy
Indexes are applied to frequently accessed columns to improve query performance and reduce
execution times.
● Primary Key Indexes: Automatically indexed by PostgreSQL (e.g., user_id, product_id).
● Foreign Key Indexes: Foreign key columns are heavily indexed to improve JOIN
performance between related tables (e.g., order_items.order_id, inventory.product_id).
● Search Field Indexes: Frequently searched fields are indexed to support quick lookup
operations (e.g., products.sku, users.username, customers.email).
● Status Field Indexes: Operational screens filter records by status. Indexing these fields
improves dashboard performance (e.g., orders.status, deliveries.status).
N+1 Query Prevention Strategy
The database and application architecture are designed to prevent N+1 query problems,
particularly on the Admin Dashboard where lists of orders and their associated items are
displayed. The backend leverages structured JOIN queries and batch retrieval to reduce
database round trips.
External Media Storage
Product images are stored outside the database using Cloudinary. The database only stores the
secure URL (image_url), dramatically reducing database size and improving query performance.
1. User & Access Management Module


---

# Page 7

This module manages roles, user data, sessions, and secure login states.
1.1. Roles Table
Purpose: Stores user roles available within the system to enforce Role-Based Access Control
(RBAC).
Field Name Data Type Constraints Description
role_id SERIAL Primary Key Unique Role Identifier
role_name role_name_enum Unique, Not Null ENUM: dev, admin,
staff
created_at TIMESTAMP Default NOW() Creation Timestamp
1.2. Users Table
Purpose: Stores staff account information, authentication data, and hierarchical creation
tracking.
Field Name Data Type Constraints Description
user_id SERIAL Primary Key Unique User Identifier
username VARCHAR(50) Unique, Not Null Login identifier
password_hash VARCHAR(255) Not Null Argon2 Encrypted
Password
is_2fa_enabled BOOLEAN Default FALSE 2FA Status Toggle
two_fa_secret VARCHAR(255) Nullable Google Auth Secret
Key
role_id INT Foreign Key, Not Null References
roles(role_id)
created_by INT Foreign Key References
users(user_id)
(Self-referencing)
updated_by INT Foreign Key References
users(user_id)
(Self-referencing)
created_at TIMESTAMP Default NOW() Account Creation Date
1.3. Login History Table
Purpose: Maintains login and logout records for auditing and security monitoring.
Field Name Data Type Constraints Description
history_id SERIAL Primary Key Login Record ID
user_id INT Foreign Key, Not Null References
users(user_id)
login_time TIMESTAMP Default NOW() Login Timestamp
ip_address VARCHAR(100) Nullable User IP Address
device_info TEXT Nullable Browser/Device


---

# Page 8

Field Name Data Type Constraints Description
Information
1.4. User Token Blacklist Table
Purpose: Stores revoked JWT tokens after logout to prevent reuse before their natural
expiration.
Field Name Data Type Constraints Description
blacklist_id SERIAL Primary Key Unique Record
Identifier
user_id INT Foreign Key, Not Null References
users(user_id)
token_jti VARCHAR(255) Not Null JWT Unique Identifier
expires_at TIMESTAMP Not Null Token Expiry Time
2. Customer Management Module


---

# Page 9

Enables management of client accounts, delivery locations, and relationship annotations.
2.1. Customers Table
Purpose: Stores B2B and B2C customer master records for order processing.
Field Name Data Type Constraints Description
customer_id SERIAL Primary Key Customer Identifier
full_name VARCHAR(150) Not Null Customer/Business
Name
email VARCHAR(255) Unique, Nullable Contact Email
phone VARCHAR(20) Unique, Not Null Contact Number
address TEXT Not Null Shipping/Billing
Address
created_at TIMESTAMP Default NOW() Record Creation Date
2.2. Customer Notes Table
Purpose: Stores internal notes related to customer accounts.
Field Name Data Type Constraints Description
note_id SERIAL Primary Key Note Identifier
customer_id INT Foreign Key, Not Null References
customers(customer_id
)
created_by INT Foreign Key, Not Null References
users(user_id)
note_text TEXT Not Null Note Content
created_at TIMESTAMP Default NOW() Note Creation Date
3. Product & Category Management Module


---

# Page 10

This module has been upgraded to implement a highly adaptable relational category structure.
3.1. Product Categories Table
Purpose: Stores dynamic product categories managed via the Admin CMS Dashboard.
Field Name Data Type Constraints Description
category_id SERIAL Primary Key Category Configuration
ID
category_name VARCHAR(100) Unique, Not Null Category Title (e.g.,
Fertilizers, Enhancers)
description TEXT Nullable Category Description
created_at TIMESTAMP Default NOW() Category Deployment
Timestamp
3.2. Products Table
Purpose: Core catalog of Vayita Grow bioorganic products.
Field Name Data Type Constraints Description
product_id SERIAL Primary Key Unique item identifier
name VARCHAR(100) Not Null Product name
category_id INT Foreign Key, Not Null References
product_categories(cat
egory_id)
sku VARCHAR(20) Unique, Not Null Stock Keeping Unit
description TEXT Nullable Detailed product
description
base_price DECIMAL(10,2) Not Null Standard retail price
image_url VARCHAR(500) Nullable Cloudinary CDN
Storage URL
created_at TIMESTAMP Default NOW() Product Entry Date
3.3. Product Images Table
Purpose: Allows for multiple gallery images per product, referencing Cloudinary CDN
resources.
Field Name Data Type Constraints Description
image_id SERIAL Primary Key Image Identifier
product_id INT Foreign Key, Not Null References
products(product_id)
image_url VARCHAR(500) Not Null Secondary Storage
Location URL
is_primary BOOLEAN Default FALSE Indicates main
thumbnail image


---

# Page 11

4. Inventory & Supplier Management Module
Bridges item stock with sourcing metadata and records manual changes.


---

# Page 12

4.1. Suppliers Table
Purpose: Stores information regarding raw material and product suppliers.
Field Name Data Type Constraints Description
supplier_id SERIAL Primary Key Unique identifier for
supplier
company_name VARCHAR(150) Not Null Name of the supplier
contact_email VARCHAR(100) Nullable Supplier email address
phone VARCHAR(20) Nullable Contact number
4.2. Inventory Table
Purpose: Tracks current stock levels for each product.
Field Name Data Type Constraints Description
inventory_id SERIAL Primary Key Unique inventory
record
product_id INT Foreign Key, Not Null References
products(product_id)
supplier_id INT Foreign Key References
suppliers(supplier_id)
quantity INT Default 0 Current available stock
last_updated TIMESTAMP Default NOW() Timestamp of last stock
modification
4.3. Inventory Logs Table
Purpose: Provides an audit trail for stock adjustments (e.g., manual corrections, stock intake).
Field Name Data Type Constraints Description
log_id SERIAL Primary Key Log Identifier
inventory_id INT Foreign Key, Not Null References
inventory(inventory_id)
user_id INT Foreign Key, Not Null References
users(user_id)
change_amount INT Not Null Positive (intake) or
Negative (sale) amount
reason VARCHAR(150) Not Null Reason (e.g., 'New
Shipment', 'Damaged')
created_at TIMESTAMP Default NOW() Date of change log
entry
5. Order & Payment Management Module
Handles financial invoicing, checkout items, and transaction lifecycle tracking.


---

# Page 13

5.1. Orders Table
Purpose: Tracks customer orders. Enforces strict transactional audit tracking.
Field Name Data Type Constraints Description
order_id SERIAL Primary Key Unique order identifier
customer_id INT Foreign Key, Not Null References
customers(customer_id
)
status order_status Not Null ENUM: Pending,
Processing, Shipped,
Delivered, Cancelled
total_amount DECIMAL(12,2) Not Null Total order value
created_by INT Foreign Key, Not Null References
users(user_id)
updated_by INT Foreign Key References
users(user_id)
created_at TIMESTAMP Default NOW() Order Timestamp
5.2. Order Items Table
Purpose: Holds individual line items associated with customer orders.
Field Name Data Type Constraints Description
item_id SERIAL Primary Key Unique line item record
order_id INT Foreign Key, Not Null References
orders(order_id)
product_id INT Foreign Key, Not Null References
products(product_id)
quantity INT Not Null Number of units
ordered
unit_price DECIMAL(10,2) Not Null Unit price locked at
checkout
5.3. Payments Table
Purpose: Tracks payment processing, authorization state, and payment methods.
Field Name Data Type Constraints Description
payment_id SERIAL Primary Key Payment Identifier
order_id INT Foreign Key, Not Null References
orders(order_id)
amount DECIMAL(12,2) Not Null Paid Amount
payment_method payment_method Not Null ENUM: Bank_Transfer,
Credit_Card, UPI, Cash
payment_status payment_status Not Null ENUM: Pending,
Completed, Failed,


---

# Page 14

Field Name Data Type Constraints Description
Refunded
processed_at TIMESTAMP Nullable Final processing
completion timestamp
6. Delivery Management Module
Manages external routing, tracking updates, and delivery fulfillment logs.


---

# Page 15

6.1. Deliveries Table
Purpose: Stores shipment progress and assignment logistics.
Field Name Data Type Constraints Description
delivery_id SERIAL Primary Key Delivery Identifier
order_id INT Foreign Key, Not Null References
orders(order_id)
courier_name VARCHAR(150) Nullable Name of logistics
courier partner
tracking_num VARCHAR(100) Nullable Transit tracking code
status delivery_status Not Null ENUM: Dispatching,
In_Transit, Delivered,
Returned
delivered_at TIMESTAMP Nullable Confirmed delivery
timestamp
6.2. Delivery Updates Table
Purpose: Tracks granular transit updates for courier monitoring.
Field Name Data Type Constraints Description
update_id SERIAL Primary Key Update Identifier
delivery_id INT Foreign Key, Not Null References
deliveries(delivery_id)
status delivery_status Not Null ENUM: Milestone state
update
location VARCHAR(255) Nullable Physical/Transit
location details
updated_at TIMESTAMP Default NOW() Timeline update
timestamp
7. System Feedback & Auditing Module
Governs administrative settings, feedback collection, and database transaction logging.


---

# Page 16

7.1. Feedback Table
Purpose: Allows system administrators and staff to file internal support tickets.
Field Name Data Type Constraints Description
feedback_id SERIAL Primary Key Unique feedback
identifier
user_id INT Foreign Key, Not Null References
users(user_id)
subject VARCHAR(150) Not Null Subject line
message TEXT Not Null Detailed message
content
status feedback_status Default 'Open' ENUM: Open,
In_Progress, Resolved,
Closed
created_at TIMESTAMP Default NOW() Ticket generation
timestamp
7.2. Activity Logs Table
Purpose: Maintains a complete audit trail of system changes to ensure compliance.
Field Name Data Type Constraints Description
log_id SERIAL Primary Key Log event identifier
user_id INT Foreign Key, Not Null References
users(user_id)
action_type action_type Not Null ENUM: CREATE,
UPDATE, DELETE,
LOGIN, LOGOUT
entity_type entity_type Not Null ENUM: USER,
PRODUCT, ORDER,
INVENTORY,
DELIVERY, SYSTEM
entity_id INT Nullable Primary Key identifier
of updated entity
ip_address VARCHAR(100) Nullable Action execution IP
address
created_at TIMESTAMP Default NOW() Timestamp of log
creation
7.3. System Settings Table
Purpose: Stores configuration parameters (e.g., tax rules, store settings).
Field Name Data Type Constraints Description
setting_id SERIAL Primary Key Setting Identifier
setting_key VARCHAR(100) Unique, Not Null System variable name


---

# Page 17

Field Name Data Type Constraints Description
setting_value TEXT Not Null Variable configuration
parameter
Data Retention Policy (SQL Trigger Cleanup)
To prevent unlimited growth in the logging tables, a database-level cleaning cycle is


---

# Page 18

implemented.
Rolling Deletion Trigger Implementation
A native PostgreSQL trigger intercepts every insert operation on the activity_logs table and
purges log entries older than 30 days.
-- 1. Create the rolling cleanup function
CREATE OR REPLACE FUNCTION purge_old_activity_logs()
RETURNS TRIGGER AS $$
BEGIN
-- Automatically purges entries older than 30 days
DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL '30
days';
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 2. Bind trigger to execute post-insert on the activity_logs table
CREATE TRIGGER trg_monthly_cleanup_logs
AFTER INSERT ON activity_logs
FOR EACH STATEMENT
EXECUTE FUNCTION purge_old_activity_logs();
Database Summary
Total Operational Modules: 7
Total Tables: 20 (Expanded with the product_categories entity)
Core ENUM Classifications: 8
