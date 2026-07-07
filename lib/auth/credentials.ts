import "server-only";
import { queryOne } from "@/lib/db/query";
import { isSupabase } from "@/lib/db/source";
import { ROLE_BY_ID } from "@/lib/mock/seed/users";
import { db } from "@/lib/mock/store";
import type { RoleName } from "@/lib/types/database";
import { get2fa } from "./two-factor-store";
import { verifyPassword } from "./password";

/**
 * Source-aware credential verification. Postgres verifies the Argon2 hash;
 * the mock demo checks its plaintext demo credentials. Returns the user's
 * identity plus whether 2FA is enabled so the login flow can branch.
 */

export interface VerifiedUser {
  userId: number;
  username: string;
  role: RoleName;
  is2faEnabled: boolean;
}

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<VerifiedUser | null> {
  const name = username.trim();

  if (isSupabase) {
    const row = await queryOne<{
      userId: number;
      username: string;
      passwordHash: string;
      roleName: RoleName;
      is2faEnabled: boolean;
    }>(
      `SELECT u.user_id, u.username, u.password_hash, u.is_2fa_enabled, r.role_name
       FROM users u JOIN roles r ON r.role_id = u.role_id
       WHERE lower(u.username) = lower($1)`,
      [name],
    );
    if (!row) return null;
    if (!(await verifyPassword(row.passwordHash, password))) return null;
    return {
      userId: row.userId,
      username: row.username,
      role: row.roleName,
      is2faEnabled: row.is2faEnabled,
    };
  }

  // Mock demo: plaintext credentials + in-memory 2FA state.
  const data = db();
  const user = data.users.find((u) => u.username.toLowerCase() === name.toLowerCase());
  if (!user) return null;
  const credential = data.credentials.find((c) => c.userId === user.userId);
  if (!credential || credential.password !== password) return null;
  const status = await get2fa(user.userId);
  return {
    userId: user.userId,
    username: user.username,
    role: ROLE_BY_ID[user.roleId] ?? "staff",
    is2faEnabled: status.enabled,
  };
}
