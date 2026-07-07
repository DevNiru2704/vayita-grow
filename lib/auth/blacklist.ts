import "server-only";
import { execute, queryOne } from "@/lib/db/query";
import { isSupabase } from "@/lib/db/source";

/**
 * Revoked JWT ids (session tokens on logout, 2FA challenge tokens after single
 * use). Postgres uses `user_token_blacklist`; mock mode uses an in-memory map
 * (resets on restart, which is fine for the demo).
 */

declare global {
  var __vayitaBlacklist: Map<string, number> | undefined;
}
function mem(): Map<string, number> {
  globalThis.__vayitaBlacklist ??= new Map();
  return globalThis.__vayitaBlacklist;
}

export async function isBlacklisted(jti: string): Promise<boolean> {
  if (isSupabase) {
    const row = await queryOne(
      "SELECT 1 FROM user_token_blacklist WHERE token_jti = $1 AND expires_at > NOW()",
      [jti],
    );
    return row !== null;
  }
  const exp = mem().get(jti);
  if (exp === undefined) return false;
  if (exp * 1000 < Date.now()) {
    mem().delete(jti);
    return false;
  }
  return true;
}

/** Revoke a token id until its natural expiry (`expEpoch` = unix seconds). */
export async function blacklist(userId: number, jti: string, expEpoch: number): Promise<void> {
  if (isSupabase) {
    await execute(
      "INSERT INTO user_token_blacklist (user_id, token_jti, expires_at) VALUES ($1, $2, to_timestamp($3))",
      [userId, jti, expEpoch],
    );
    return;
  }
  mem().set(jti, expEpoch);
}
