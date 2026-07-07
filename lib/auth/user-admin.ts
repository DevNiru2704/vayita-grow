import "server-only";
import { randomBytes } from "node:crypto";
import { queryOne, withActor } from "@/lib/db/query";
import { isSupabase } from "@/lib/db/source";
import { ROLE_ID_BY_NAME } from "@/lib/mock/seed/users";
import { db, nextId, nowIso } from "@/lib/mock/store";
import type { RoleName } from "@/lib/types/database";
import { hashPassword } from "./password";

/**
 * Source-aware account administration: creating accounts and issuing temporary
 * passwords (recovery). Activity logging is done by the calling action.
 */

/** Auto-generated temp password that always satisfies the strength policy. */
export function generateTempPassword(): string {
  return `Vg${randomBytes(4).toString("hex")}!9`;
}

export async function usernameExists(username: string): Promise<boolean> {
  if (isSupabase) {
    return (await queryOne("SELECT 1 FROM users WHERE lower(username) = lower($1)", [username])) !== null;
  }
  return db().users.some((u) => u.username.toLowerCase() === username.toLowerCase());
}

export async function createUserAccount(
  username: string,
  role: RoleName,
  createdBy: number,
): Promise<{ userId: number; tempPassword: string }> {
  const tempPassword = generateTempPassword();

  if (isSupabase) {
    const passwordHash = await hashPassword(tempPassword);
    const roleId = ROLE_ID_BY_NAME[role];
    const userId = await withActor(createdBy, async (c) => {
      const { rows } = await c.query(
        "INSERT INTO users (username, password_hash, role_id, created_by) VALUES ($1, $2, $3, $4) RETURNING user_id",
        [username, passwordHash, roleId, createdBy],
      );
      return rows[0].user_id as number;
    });
    return { userId, tempPassword };
  }

  const store = db();
  const userId = nextId(store.users, "userId");
  store.users.push({
    userId,
    username,
    roleId: ROLE_ID_BY_NAME[role],
    createdBy,
    updatedBy: null,
    createdAt: nowIso(),
  });
  store.credentials.push({ userId, password: tempPassword });
  return { userId, tempPassword };
}

/** Recovery: set a fresh temp password on an account (returned once). */
export async function resetUserPasswordToTemp(userId: number, actorId: number): Promise<string> {
  const tempPassword = generateTempPassword();

  if (isSupabase) {
    const hash = await hashPassword(tempPassword);
    await withActor(actorId, async (c) => {
      await c.query("UPDATE users SET password_hash = $1, updated_by = $2 WHERE user_id = $3", [
        hash,
        actorId,
        userId,
      ]);
    });
    return tempPassword;
  }

  const store = db();
  const credential = store.credentials.find((c) => c.userId === userId);
  if (credential) credential.password = tempPassword;
  else store.credentials.push({ userId, password: tempPassword });
  const user = store.users.find((u) => u.userId === userId);
  if (user) user.updatedBy = actorId;
  return tempPassword;
}
