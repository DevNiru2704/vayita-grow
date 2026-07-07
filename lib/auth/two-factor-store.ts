import "server-only";
import { execute, queryOne } from "@/lib/db/query";
import { isSupabase } from "@/lib/db/source";

/**
 * Per-user 2FA state (Google Authenticator TOTP secret + enabled flag).
 * Postgres stores it on `users.two_fa_secret` / `users.is_2fa_enabled`; mock
 * mode keeps it in memory so the 2FA flow is fully demoable without a DB.
 */

export interface TwoFactorState {
  enabled: boolean;
  secret: string | null;
}

declare global {
  var __vayitaTwoFa: Map<number, TwoFactorState> | undefined;
}
function mem(): Map<number, TwoFactorState> {
  globalThis.__vayitaTwoFa ??= new Map();
  return globalThis.__vayitaTwoFa;
}

export async function get2fa(userId: number): Promise<TwoFactorState> {
  if (isSupabase) {
    const row = await queryOne<{ is2faEnabled: boolean; twoFaSecret: string | null }>(
      "SELECT is_2fa_enabled, two_fa_secret FROM users WHERE user_id = $1",
      [userId],
    );
    return { enabled: row?.is2faEnabled ?? false, secret: row?.twoFaSecret ?? null };
  }
  return mem().get(userId) ?? { enabled: false, secret: null };
}

/** Store a secret pending confirmation (2FA stays disabled until confirmed). */
export async function setPendingSecret(userId: number, secret: string): Promise<void> {
  if (isSupabase) {
    await execute("UPDATE users SET two_fa_secret = $1, is_2fa_enabled = false WHERE user_id = $2", [
      secret,
      userId,
    ]);
    return;
  }
  mem().set(userId, { enabled: false, secret });
}

export async function enable2fa(userId: number, secret: string): Promise<void> {
  if (isSupabase) {
    await execute("UPDATE users SET two_fa_secret = $1, is_2fa_enabled = true WHERE user_id = $2", [
      secret,
      userId,
    ]);
    return;
  }
  mem().set(userId, { enabled: true, secret });
}

export async function disable2fa(userId: number): Promise<void> {
  if (isSupabase) {
    await execute("UPDATE users SET two_fa_secret = NULL, is_2fa_enabled = false WHERE user_id = $1", [
      userId,
    ]);
    return;
  }
  mem().set(userId, { enabled: false, secret: null });
}
