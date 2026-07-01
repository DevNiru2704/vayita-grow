import "server-only";
import { redirect } from "next/navigation";
import type { RoleName } from "@/lib/types/database";
import type { SessionUser } from "@/lib/types/user";
import { getSession } from "./session";

/**
 * Authoritative auth checks used by the dashboard layout and by every
 * server action (actions are public POST endpoints and must self-verify).
 */

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(roles: RoleName[]): Promise<SessionUser> {
  const session = await requireSession();
  if (!roles.includes(session.role)) redirect("/dashboard");
  return session;
}
