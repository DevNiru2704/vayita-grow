import "server-only";
import { buildSeedDb, type MockDb } from "./seed";

/**
 * In-memory mock database for the frontend-only phase.
 *
 * MOCK IMPLEMENTATION - the real backend (PostgreSQL via Supabase, see
 * docs/project_details/vayita-grow-dbdesign.md) replaces this module.
 * State is cached on globalThis so it survives HMR and per-request module
 * re-evaluation in dev; it resets on server restart, which is acceptable
 * and expected for the demo.
 */

declare global {
  var __vayitaMockDb: MockDb | undefined;
}

export function db(): MockDb {
  globalThis.__vayitaMockDb ??= buildSeedDb();
  return globalThis.__vayitaMockDb;
}

/** Next sequential id for a table keyed by `idKey`. */
export function nextId<T, K extends keyof T>(rows: T[], idKey: K): number {
  return rows.reduce((max, row) => Math.max(max, Number(row[idKey])), 0) + 1;
}

/**
 * Simulated network/database latency so loading, pending, and optimistic
 * states are actually exercised by the UI.
 */
export function latency(): Promise<void> {
  const ms = 120 + Math.random() * 230;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function nowIso(): string {
  return new Date().toISOString();
}
