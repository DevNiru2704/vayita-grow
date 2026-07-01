import "server-only";
import { ROLE_BY_ID } from "@/lib/mock/seed/users";
import { db } from "@/lib/mock/store";
import type { SessionUser } from "@/lib/types/user";

/**
 * DEMO AUTHENTICATION ONLY - swap point for Supabase Auth.
 * Verifies against the mock credentials table so accounts created by the
 * admin in the Users module can log in during the same demo session.
 * Demo credentials are documented in docs/, never rendered in the UI.
 */
export function verifyDemoCredentials(username: string, password: string): SessionUser | null {
  const data = db();
  const user = data.users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase(),
  );
  if (!user) return null;

  const credential = data.credentials.find((c) => c.userId === user.userId);
  if (!credential || credential.password !== password) return null;

  return {
    userId: user.userId,
    username: user.username,
    role: ROLE_BY_ID[user.roleId] ?? "sub_admin",
  };
}
