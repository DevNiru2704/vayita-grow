/**
 * Data-source switch. `DATA_SOURCE=supabase` routes reads/writes to Postgres
 * (via the `pg` pool); anything else keeps the in-memory mock layer so the
 * investor demo runs with zero infrastructure. Imported by every domain
 * service/action to pick its implementation.
 */

export type DataSource = "mock" | "supabase";

export const SOURCE: DataSource =
  process.env.DATA_SOURCE === "supabase" ? "supabase" : "mock";

export const isSupabase = SOURCE === "supabase";
