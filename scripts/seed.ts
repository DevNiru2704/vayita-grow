/**
 * Seed the Postgres (Supabase) database with the same demo dataset the mock
 * layer uses, so the `DATA_SOURCE=supabase` path has identical investor-demo
 * content. Staff passwords are hashed with Argon2id (never stored plaintext).
 *
 * Usage:
 *   DATABASE_URL="postgres://…" npx tsx scripts/seed.ts
 *
 * Idempotent: truncates the app tables, then re-inserts with explicit ids and
 * resets the SERIAL sequences. Run AFTER applying supabase/migrations/*.sql.
 */
import argon2 from "argon2";
import { pool } from "../lib/db/pool";
import { buildSeedDb } from "../lib/mock/seed";
import { ROLE_BY_ID } from "../lib/mock/seed/users";

// Tables truncated (children first via CASCADE handles the rest).
const TABLES = [
  "public_feedback", "contact_inquiries",
  "activity_logs", "feedback", "system_settings",
  "quotation_items", "quotations",
  "delivery_updates", "deliveries", "payments", "order_items", "orders",
  "field_reports", "statements",
  "inventory_logs", "inventory", "suppliers",
  "product_details", "product_images", "products", "product_categories",
  "customer_notes", "customers",
  "user_token_blacklist", "login_history", "users", "roles",
];

// Tables whose SERIAL/identity sequence must be bumped past the explicit ids.
const SEQUENCES: Array<[table: string, column: string]> = [
  ["roles", "role_id"], ["users", "user_id"], ["login_history", "history_id"],
  ["customers", "customer_id"], ["customer_notes", "note_id"],
  ["product_categories", "category_id"], ["products", "product_id"],
  ["suppliers", "supplier_id"], ["inventory", "inventory_id"],
  ["inventory_logs", "log_id"], ["orders", "order_id"], ["order_items", "item_id"],
  ["payments", "payment_id"], ["deliveries", "delivery_id"],
  ["delivery_updates", "update_id"], ["statements", "statement_id"],
  ["field_reports", "report_id"], ["feedback", "feedback_id"],
  ["activity_logs", "log_id"], ["system_settings", "setting_id"],
  ["quotations", "quotation_id"], ["quotation_items", "item_id"],
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Point it at your Supabase database.");
  }

  const db = buildSeedDb();
  const passwordByUserId = new Map(db.credentials.map((c) => [c.userId, c.password]));
  const client = await pool().connect();

  try {
    await client.query("BEGIN");
    await client.query(`TRUNCATE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`);

    // Roles ------------------------------------------------------------------
    for (const [id, name] of Object.entries(ROLE_BY_ID)) {
      await client.query(
        "INSERT INTO roles (role_id, role_name) VALUES ($1, $2)",
        [Number(id), name],
      );
    }

    // Users (Argon2id hashed passwords) --------------------------------------
    for (const u of db.users) {
      const plaintext = passwordByUserId.get(u.userId) ?? "changeme@vayita";
      const passwordHash = await argon2.hash(plaintext, { type: argon2.argon2id });
      await client.query(
        `INSERT INTO users (user_id, username, password_hash, is_2fa_enabled,
                            two_fa_secret, role_id, created_by, updated_by, created_at)
         VALUES ($1, $2, $3, false, NULL, $4, $5, $6, $7)`,
        [u.userId, u.username, passwordHash, u.roleId, u.createdBy, u.updatedBy, u.createdAt],
      );
    }

    for (const h of db.loginHistory) {
      await client.query(
        `INSERT INTO login_history (history_id, user_id, login_time, ip_address, device_info)
         VALUES ($1, $2, $3, $4, $5)`,
        [h.historyId, h.userId, h.loginTime, h.ipAddress, h.deviceInfo],
      );
    }

    // Customers --------------------------------------------------------------
    for (const c of db.customers) {
      await client.query(
        `INSERT INTO customers (customer_id, full_name, email, phone, address, state, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [c.customerId, c.fullName, c.email, c.phone, c.address, c.state, c.status, c.createdAt],
      );
    }
    for (const n of db.customerNotes) {
      await client.query(
        `INSERT INTO customer_notes (note_id, customer_id, created_by, note_text, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [n.noteId, n.customerId, n.createdBy, n.noteText, n.createdAt],
      );
    }

    // Catalog ----------------------------------------------------------------
    for (const cat of db.categories) {
      await client.query(
        `INSERT INTO product_categories (category_id, category_name, description, created_at)
         VALUES ($1, $2, $3, $4)`,
        [cat.categoryId, cat.categoryName, cat.description, cat.createdAt],
      );
    }
    for (const p of db.products) {
      await client.query(
        `INSERT INTO products (product_id, name, slug, category_id, sku, description, base_price, image_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [p.productId, p.name, p.slug, p.categoryId, p.sku, p.description, p.basePrice, p.imageUrl, p.createdAt],
      );
      const d = p.details;
      await client.query(
        `INSERT INTO product_details (product_id, short_description, benefits, dosage, composition, pack_sizes, image_cutout_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [p.productId, d.shortDescription, d.benefits, d.dosage, d.composition, d.packSizes, d.imageCutoutUrl],
      );
    }

    // Inventory --------------------------------------------------------------
    for (const s of db.suppliers) {
      await client.query(
        `INSERT INTO suppliers (supplier_id, company_name, contact_email, phone)
         VALUES ($1, $2, $3, $4)`,
        [s.supplierId, s.companyName, s.contactEmail, s.phone],
      );
    }
    for (const i of db.inventory) {
      await client.query(
        `INSERT INTO inventory (inventory_id, product_id, supplier_id, quantity, last_updated)
         VALUES ($1, $2, $3, $4, $5)`,
        [i.inventoryId, i.productId, i.supplierId, i.quantity, i.lastUpdated],
      );
    }
    for (const l of db.inventoryLogs) {
      await client.query(
        `INSERT INTO inventory_logs (log_id, inventory_id, user_id, change_amount, reason, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [l.logId, l.inventoryId, l.userId, l.changeAmount, l.reason, l.createdAt],
      );
    }

    // Orders → items → payments → deliveries → updates -----------------------
    for (const o of db.orders) {
      await client.query(
        `INSERT INTO orders (order_id, customer_id, status, total_amount, created_by, updated_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [o.orderId, o.customerId, o.status, o.totalAmount, o.createdBy, o.updatedBy, o.createdAt],
      );
    }
    for (const it of db.orderItems) {
      await client.query(
        `INSERT INTO order_items (item_id, order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [it.itemId, it.orderId, it.productId, it.quantity, it.unitPrice],
      );
    }
    for (const pay of db.payments) {
      await client.query(
        `INSERT INTO payments (payment_id, order_id, amount, payment_method, payment_status, processed_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [pay.paymentId, pay.orderId, pay.amount, pay.paymentMethod, pay.paymentStatus, pay.processedAt],
      );
    }
    for (const del of db.deliveries) {
      await client.query(
        `INSERT INTO deliveries (delivery_id, order_id, courier_name, tracking_num, status, delivered_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [del.deliveryId, del.orderId, del.courierName, del.trackingNum, del.status, del.deliveredAt],
      );
    }
    for (const up of db.deliveryUpdates) {
      await client.query(
        `INSERT INTO delivery_updates (update_id, delivery_id, status, location, updated_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [up.updateId, up.deliveryId, up.status, up.location, up.updatedAt],
      );
    }

    // Quotations -------------------------------------------------------------
    for (const q of db.quotations) {
      await client.query(
        `INSERT INTO quotations (quotation_id, quotation_number, customer_id, created_by, assigned_staff_id, status, total_amount, valid_until, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [q.quotationId, q.quotationNumber, q.customerId, q.createdBy, q.assignedStaffId, q.status, q.totalAmount, q.validUntil, q.notes, q.createdAt],
      );
    }
    for (const qi of db.quotationItems) {
      await client.query(
        `INSERT INTO quotation_items (item_id, quotation_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [qi.itemId, qi.quotationId, qi.productId, qi.quantity, qi.unitPrice],
      );
    }

    // Ops --------------------------------------------------------------------
    for (const st of db.statements) {
      await client.query(
        `INSERT INTO statements (statement_id, statement_number, customer_id, period_label, upload_date, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [st.statementId, st.statementNumber, st.customerId, st.periodLabel, st.uploadDate, st.uploadedBy],
      );
    }
    for (const r of db.fieldReports) {
      await client.query(
        `INSERT INTO field_reports (report_id, visit_date, customer_id, dealer_name, location, summary, status, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [r.reportId, r.visitDate, r.customerId, r.dealerName, r.location, r.summary, r.status, r.createdBy, r.createdAt],
      );
    }
    for (const f of db.feedback) {
      await client.query(
        `INSERT INTO feedback (feedback_id, user_id, subject, message, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [f.feedbackId, f.userId, f.subject, f.message, f.status, f.createdAt],
      );
    }
    for (const a of db.activityLogs) {
      await client.query(
        `INSERT INTO activity_logs (log_id, user_id, action_type, entity_type, entity_id, ip_address, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [a.logId, a.userId, a.actionType, a.entityType, a.entityId, a.ipAddress, a.createdAt],
      );
    }
    for (const s of db.systemSettings) {
      await client.query(
        `INSERT INTO system_settings (setting_id, setting_key, setting_value)
         VALUES ($1, $2, $3)`,
        [s.settingId, s.settingKey, s.settingValue],
      );
    }

    // Bump every SERIAL sequence past the explicit ids we inserted.
    for (const [table, column] of SEQUENCES) {
      await client.query(
        `SELECT setval(pg_get_serial_sequence($1, $2),
                       GREATEST((SELECT COALESCE(MAX(${column}), 1) FROM ${table}), 1))`,
        [table, column],
      );
    }

    await client.query("COMMIT");
    console.log("✅ Seed complete.");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool().end();
  }
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
