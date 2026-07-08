import { Pool, types } from "pg";

/**
 * Singleton `pg` connection pool for the Postgres (Supabase) data source.
 * Cached on globalThis so HMR / per-request module re-evaluation reuse one pool.
 *
 * Not marked `server-only` on purpose: this factory is also used by the
 * standalone `scripts/seed.ts`. It is otherwise only imported by `*.pg.ts`
 * service/action modules (all `server-only`) and never reaches a client bundle
 * (`pg` is a Node-only package).
 */

// --- Type parsers: return values that match our TypeScript domain types. ---
// DECIMAL/NUMERIC (1700) → number (pg returns strings to avoid precision loss;
// our monetary values are within JS-safe range for this catalog).
types.setTypeParser(1700, (v) => (v === null ? null : Number(v)));
// TIMESTAMPTZ (1184) / TIMESTAMP (1114) → ISO-8601 string (types use `string`).
const toIso = (v: string | null) => (v === null ? null : new Date(v).toISOString());
types.setTypeParser(1184, toIso as (v: string) => string);
types.setTypeParser(1114, toIso as (v: string) => string);
// DATE (1082) → keep the plain YYYY-MM-DD string (no timezone shifting).
types.setTypeParser(1082, (v) => v);

declare global {
  var __vayitaPgPool: Pool | undefined;
}

export function pool(): Pool {
  globalThis.__vayitaPgPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    // Small by default: Supabase poolers cap concurrent clients (session mode
    // is ~15), and a build prerenders several DB routes at once. Serverless
    // runtimes also favour tiny per-instance pools.
    max: Number(process.env.PG_POOL_MAX ?? 3),
    idleTimeoutMillis: 30_000,
    // Supabase requires TLS; allow the pooled cert chain without a local CA file.
    ssl: process.env.PG_SSL === "disable" ? undefined : { rejectUnauthorized: false },
  });
  return globalThis.__vayitaPgPool;
}
