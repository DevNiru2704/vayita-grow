/**
 * Catalog-only seeder for a REAL/production database.
 *
 * Unlike `scripts/seed.ts` (which TRUNCATEs everything and loads the full demo
 * dataset), this script is additive and touches only:
 *   1. the product catalog  — categories, products, product_details
 *   2. Cloudinary            — uploads each product image, stores the secure URL
 *   3. one `dev` account     — username & password read from .env.local
 *
 * It never deletes existing rows and can be re-run safely (upserts + Cloudinary
 * overwrite by deterministic public_id).
 *
 * Usage:
 *   npx tsx scripts/seed-catalog.ts
 *
 * Requires in .env.local:
 *   DATABASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
 *   CLOUDINARY_API_SECRET, SEED_DEV_USERNAME, SEED_DEV_PASSWORD
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import argon2 from "argon2";
import { v2 as cloudinary } from "cloudinary";
import { pool } from "../lib/db/pool";
import { buildSeedDb } from "../lib/mock/seed";

// --- .env.local loader (tsx does not auto-load env files) -------------------
function loadEnvLocal(): void {
  const file = path.join(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const clean = line.startsWith("export ") ? line.slice(7) : line;
    const eq = clean.indexOf("=");
    if (eq === -1) continue;
    const key = clean.slice(0, eq).trim();
    let val = clean.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val; // real env wins
  }
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name} (set it in .env.local)`);
  return value;
}

// Mirror the app's password policy for the highest-privilege account.
function assertStrongPassword(pw: string): void {
  const ok =
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /\d/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw);
  if (!ok) {
    throw new Error(
      "SEED_DEV_PASSWORD is too weak. Use at least 8 characters with an " +
        "uppercase letter, a lowercase letter, a digit, and a special symbol.",
    );
  }
}

/** Uploads a public/ image to Cloudinary and returns its secure URL. */
async function upload(publicRelPath: string, publicId: string): Promise<string> {
  const abs = path.join(process.cwd(), "public", publicRelPath);
  if (!existsSync(abs)) throw new Error(`Image file not found: ${abs}`);
  const res = await cloudinary.uploader.upload(abs, {
    folder: "vayita/products",
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });
  return res.secure_url;
}

async function main() {
  loadEnvLocal();

  const databaseUrl = required("DATABASE_URL");
  if (databaseUrl.includes("db.") && databaseUrl.includes(".supabase.co")) {
    console.warn(
      "⚠️  DATABASE_URL looks like the direct (IPv6-only) connection. If this " +
        "script can't connect, use the Session pooler URL instead.",
    );
  }
  const devUsername = required("SEED_DEV_USERNAME");
  const devPassword = required("SEED_DEV_PASSWORD");
  assertStrongPassword(devPassword);

  cloudinary.config({
    cloud_name: required("CLOUDINARY_CLOUD_NAME"),
    api_key: required("CLOUDINARY_API_KEY"),
    api_secret: required("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  const db = buildSeedDb();
  const client = await pool().connect();

  try {
    await client.query("BEGIN");

    // --- Roles + the dev account -------------------------------------------
    // Ensure the base roles exist (idempotent; also created by seed.sql).
    await client.query(
      `INSERT INTO roles (role_id, role_name) VALUES (1,'dev'),(2,'admin'),(3,'staff')
       ON CONFLICT (role_name) DO NOTHING`,
    );
    const { rows: roleRows } = await client.query<{ role_id: number }>(
      "SELECT role_id FROM roles WHERE role_name = 'dev'",
    );
    const devRoleId = roleRows[0]?.role_id;
    if (!devRoleId) throw new Error("'dev' role missing after upsert.");

    const passwordHash = await argon2.hash(devPassword, { type: argon2.argon2id });
    await client.query(
      `INSERT INTO users (username, password_hash, is_2fa_enabled, role_id, created_at)
       VALUES ($1, $2, false, $3, now())
       ON CONFLICT (username)
       DO UPDATE SET password_hash = EXCLUDED.password_hash, role_id = EXCLUDED.role_id`,
      [devUsername, passwordHash, devRoleId],
    );
    console.log(`👤 dev account ready: ${devUsername}`);

    // --- Categories --------------------------------------------------------
    for (const cat of db.categories) {
      await client.query(
        `INSERT INTO product_categories (category_id, category_name, description, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (category_id)
         DO UPDATE SET category_name = EXCLUDED.category_name,
                       description   = EXCLUDED.description`,
        [cat.categoryId, cat.categoryName, cat.description, cat.createdAt],
      );
    }
    console.log(`🗂️  categories upserted: ${db.categories.length}`);

    // --- Products (+ Cloudinary upload + details) --------------------------
    for (const p of db.products) {
      process.stdout.write(`📦 ${p.slug}: uploading images… `);
      const imageUrl = p.imageUrl ? await upload(p.imageUrl, p.slug) : null;
      const cutoutUrl = p.details.imageCutoutUrl
        ? await upload(p.details.imageCutoutUrl, `${p.slug}-cutout`)
        : null;
      process.stdout.write("done\n");

      await client.query(
        `INSERT INTO products (product_id, name, slug, category_id, sku, description, base_price, image_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (product_id)
         DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug,
                       category_id = EXCLUDED.category_id, sku = EXCLUDED.sku,
                       description = EXCLUDED.description, base_price = EXCLUDED.base_price,
                       image_url = EXCLUDED.image_url`,
        [p.productId, p.name, p.slug, p.categoryId, p.sku, p.description, p.basePrice, imageUrl, p.createdAt],
      );

      const d = p.details;
      await client.query(
        `INSERT INTO product_details (product_id, short_description, benefits, dosage, composition, pack_sizes, image_cutout_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (product_id)
         DO UPDATE SET short_description = EXCLUDED.short_description,
                       benefits = EXCLUDED.benefits, dosage = EXCLUDED.dosage,
                       composition = EXCLUDED.composition, pack_sizes = EXCLUDED.pack_sizes,
                       image_cutout_url = EXCLUDED.image_cutout_url`,
        [p.productId, d.shortDescription, d.benefits, d.dosage, d.composition, d.packSizes, cutoutUrl],
      );
    }
    console.log(`✅ products upserted: ${db.products.length}`);

    // Keep SERIAL sequences ahead of the explicit ids we inserted.
    for (const [table, column] of [
      ["roles", "role_id"],
      ["product_categories", "category_id"],
      ["products", "product_id"],
      ["users", "user_id"],
    ] as const) {
      await client.query(
        `SELECT setval(pg_get_serial_sequence($1, $2),
                       GREATEST((SELECT COALESCE(MAX(${column}), 1) FROM ${table}), 1))`,
        [table, column],
      );
    }

    await client.query("COMMIT");
    console.log("🌱 Catalog seed complete.");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool().end();
  }
}

main().catch((err) => {
  console.error("❌ Catalog seed failed:", err);
  process.exit(1);
});
