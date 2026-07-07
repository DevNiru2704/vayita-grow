"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { validatePassword } from "@/lib/auth/password-policy";
import {
  createUserAccount,
  resetUserPasswordToTemp,
  usernameExists,
} from "@/lib/auth/user-admin";
import { getUserRoleById, setUserPassword, verifyUserPassword } from "@/lib/auth/user-passwords";
import { recordActivity } from "@/lib/audit";
import type { ActionResult } from "@/lib/types/common";
import { ROLE_NAMES, type RoleName } from "@/lib/types/database";

/**
 * Account administration with a strict role matrix:
 * - dev creates dev/admin/staff and recovers any account (lost-password reset).
 * - admin creates staff only, and can reset a STAFF password only by supplying
 *   that staff member's current password.
 * - admin can never touch dev or admin accounts. staff manage nothing.
 * Self-service password change lives in lib/actions/account.ts.
 */

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(50)
  .regex(/^[a-z0-9._-]+$/i, "Only letters, numbers, dots, hyphens, underscores");

/** Which roles each actor role may create. */
function canCreate(actor: RoleName, target: RoleName): boolean {
  if (actor === "dev") return true; // dev creates dev/admin/staff
  if (actor === "admin") return target === "staff";
  return false;
}

export async function createUser(input: {
  username: string;
  role: RoleName;
}): Promise<ActionResult<{ id: number; tempPassword: string }>> {
  const session = await requireRole(ADMIN_ROLES);

  const parsedName = usernameSchema.safeParse(input.username);
  if (!parsedName.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: { username: z.flattenError(parsedName.error).formErrors },
    };
  }
  if (!ROLE_NAMES.includes(input.role)) return { ok: false, error: "Invalid role." };
  if (!canCreate(session.role, input.role)) {
    return { ok: false, error: `Your role cannot create ${input.role} accounts.` };
  }
  if (await usernameExists(parsedName.data)) {
    return {
      ok: false,
      error: "Validation failed.",
      fieldErrors: { username: ["Username already exists"] },
    };
  }

  const { userId, tempPassword } = await createUserAccount(parsedName.data, input.role, session.userId);
  await recordActivity(session.userId, "CREATE", "USER", userId);
  revalidatePath("/dashboard/users");
  return { ok: true, data: { id: userId, tempPassword } };
}

/** Admin/dev resets a STAFF password by supplying that staff's current password. */
export async function resetStaffPassword(input: {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const session = await requireRole(ADMIN_ROLES);

  const targetRole = await getUserRoleById(input.userId);
  if (targetRole === null) return { ok: false, error: "User not found." };
  if (targetRole !== "staff") {
    return { ok: false, error: "Only staff passwords can be reset here." };
  }

  if (input.newPassword !== input.confirmPassword) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: { confirmPassword: ["Passwords do not match"] },
    };
  }
  const policyError = validatePassword(input.newPassword);
  if (policyError) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: { newPassword: [policyError] },
    };
  }
  if (!(await verifyUserPassword(input.userId, input.currentPassword))) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: { currentPassword: ["Current staff password is incorrect"] },
    };
  }

  await setUserPassword(input.userId, input.newPassword);
  await recordActivity(session.userId, "UPDATE", "USER", input.userId);
  revalidatePath("/dashboard/users");
  return { ok: true, data: undefined };
}

/** dev-only recovery: issue a fresh temp password for a lost account. */
export async function recoverAccount(
  userId: number,
): Promise<ActionResult<{ tempPassword: string }>> {
  const session = await requireRole(["dev"]);
  if (userId === session.userId) {
    return { ok: false, error: "Use ‘Change my password’ for your own account." };
  }
  const targetRole = await getUserRoleById(userId);
  if (targetRole === null) return { ok: false, error: "User not found." };

  const tempPassword = await resetUserPasswordToTemp(userId, session.userId);
  await recordActivity(session.userId, "UPDATE", "USER", userId);
  revalidatePath("/dashboard/users");
  return { ok: true, data: { tempPassword } };
}
