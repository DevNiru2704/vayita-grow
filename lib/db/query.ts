import type { PoolClient } from "pg";
import { pool } from "./pool";

/**
 * Thin query helpers over the `pg` pool. All callers pass PARAMETERIZED SQL
 * ($1, $2, …) — never string-concatenated user input — so SQL injection is
 * structurally prevented. Result rows are mapped snake_case → camelCase to
 * match the TypeScript domain types the services return.
 */

function toCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

export function mapRow<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(row)) out[toCamel(key)] = row[key];
  return out as T;
}

type Executor = Pick<PoolClient, "query">;

export async function query<T>(
  text: string,
  params?: unknown[],
  client?: Executor,
): Promise<T[]> {
  const runner = client ?? pool();
  const res = await runner.query(text, params as unknown[]);
  return res.rows.map((r) => mapRow<T>(r as Record<string, unknown>));
}

export async function queryOne<T>(
  text: string,
  params?: unknown[],
  client?: Executor,
): Promise<T | null> {
  const rows = await query<T>(text, params, client);
  return rows[0] ?? null;
}

/** Number of rows affected by a write, when no RETURNING is needed. */
export async function execute(
  text: string,
  params?: unknown[],
  client?: Executor,
): Promise<number> {
  const runner = client ?? pool();
  const res = await runner.query(text, params as unknown[]);
  return res.rowCount ?? 0;
}

/**
 * Runs `fn` inside a transaction with `app.user_id` set for the duration, so
 * DB-side audit context / RLS policies can read `current_setting('app.user_id')`.
 * Commits on success, rolls back on throw.
 */
export async function withActor<T>(
  userId: number,
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT set_config('app.user_id', $1, true)", [String(userId)]);
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
