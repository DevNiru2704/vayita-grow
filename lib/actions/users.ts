"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { recordActivity } from "@/lib/mock/activity";
import { ROLE_ID_BY_NAME } from "@/lib/mock/seed/users";
import { db, latency, nextId, nowIso } from "@/lib/mock/store";
import type { ActionResult } from "@/lib/types/common";
import type { CreateStaffInput } from "@/lib/types/user";

// MOCK IMPLEMENTATION - replace store mutations with Supabase Auth admin APIs.
// Role model per client call: only admin (or dev) manages accounts; staff
// have no self-service password changes.

function generateTempPassword(): string {
  return `vg-${randomBytes(4).toString("hex")}`;
}

const staffSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .regex(/^[a-z0-9._-]+$/i, "Only letters, numbers, dots, hyphens, underscores"),
  role: z.enum(["admin", "sub_admin"], "Select a role"),
});

export async function createStaffUser(
  input: CreateStaffInput,
): Promise<ActionResult<{ id: number; tempPassword: string }>> {
  const session = await requireRole(["admin", "dev"]);
  await latency();
  const parsed = staffSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const store = db();
  if (
    store.users.some((u) => u.username.toLowerCase() === parsed.data.username.toLowerCase())
  ) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { username: ["Username already exists"] },
    };
  }

  const userId = nextId(store.users, "userId");
  const tempPassword = generateTempPassword();
  store.users.push({
    userId,
    username: parsed.data.username,
    roleId: ROLE_ID_BY_NAME[parsed.data.role],
    createdBy: session.userId,
    updatedBy: null,
    createdAt: nowIso(),
  });
  store.credentials.push({ userId, password: tempPassword });

  recordActivity(session.userId, "CREATE", "USER", userId);
  revalidatePath("/dashboard/users");
  return { ok: true, data: { id: userId, tempPassword } };
}

export async function resetUserPassword(
  userId: number,
): Promise<ActionResult<{ tempPassword: string }>> {
  const session = await requireRole(["admin", "dev"]);
  await latency();

  const store = db();
  const user = store.users.find((u) => u.userId === userId);
  if (!user) return { ok: false, error: "User not found." };
  if (user.userId === session.userId) {
    return { ok: false, error: "Use a different admin account to reset your own password." };
  }

  const tempPassword = generateTempPassword();
  const credential = store.credentials.find((c) => c.userId === userId);
  if (credential) {
    credential.password = tempPassword;
  } else {
    store.credentials.push({ userId, password: tempPassword });
  }
  user.updatedBy = session.userId;

  recordActivity(session.userId, "UPDATE", "USER", userId);
  revalidatePath("/dashboard/users");
  return { ok: true, data: { tempPassword } };
}
