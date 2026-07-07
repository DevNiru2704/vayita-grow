import "server-only";
import { execute, queryOne } from "@/lib/db/query";
import { isSupabase } from "@/lib/db/source";
import { ROLE_BY_ID } from "@/lib/mock/seed/users";
import { db } from "@/lib/mock/store";
import type { RoleName } from "@/lib/types/database";
import { hashPassword, verifyPassword } from "./password";

/**
 * Source-aware password verification/update for a target user. Postgres uses
 * Argon2 hashes; the mock demo compares its plaintext demo credentials.
 */

export async function getUserRoleById(userId: number): Promise<RoleName | null> {
  if (isSupabase) {
    const row = await queryOne<{ roleName: RoleName }>(
      "SELECT r.role_name FROM users u JOIN roles r ON r.role_id = u.role_id WHERE u.user_id = $1",
      [userId],
    );
    return row?.roleName ?? null;
  }
  const user = db().users.find((u) => u.userId === userId);
  return user ? (ROLE_BY_ID[user.roleId] ?? null) : null;
}

export async function verifyUserPassword(userId: number, plaintext: string): Promise<boolean> {
  if (isSupabase) {
    const row = await queryOne<{ passwordHash: string }>(
      "SELECT password_hash FROM users WHERE user_id = $1",
      [userId],
    );
    return row ? verifyPassword(row.passwordHash, plaintext) : false;
  }
  const credential = db().credentials.find((c) => c.userId === userId);
  return credential ? credential.password === plaintext : false;
}

export async function setUserPassword(userId: number, plaintext: string): Promise<void> {
  if (isSupabase) {
    const hash = await hashPassword(plaintext);
    await execute("UPDATE users SET password_hash = $1 WHERE user_id = $2", [hash, userId]);
    return;
  }
  const store = db();
  const credential = store.credentials.find((c) => c.userId === userId);
  if (credential) credential.password = plaintext;
  else store.credentials.push({ userId, password: plaintext });
}
