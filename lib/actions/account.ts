"use server";

import { requireSession } from "@/lib/auth/guards";
import { validatePassword } from "@/lib/auth/password-policy";
import { setUserPassword, verifyUserPassword } from "@/lib/auth/user-passwords";
import { recordActivity } from "@/lib/audit";
import { rateLimit } from "@/lib/security/rate-limit";
import type { ActionResult } from "@/lib/types/common";

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Self-service password change, available to every signed-in role. Requires
 * the current password and enforces the strength policy. This is what users
 * use after their first login with a temporary password.
 */
export async function changeOwnPassword(input: ChangePasswordInput): Promise<ActionResult> {
  const session = await requireSession();
  if (!rateLimit(`pwchange:${session.userId}`, 5, 60_000).ok) {
    return { ok: false, error: "Too many attempts. Please wait a minute and try again." };
  }

  const { currentPassword, newPassword, confirmPassword } = input;

  if (newPassword !== confirmPassword) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: { confirmPassword: ["Passwords do not match"] },
    };
  }
  const policyError = validatePassword(newPassword);
  if (policyError) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: { newPassword: [policyError] },
    };
  }
  if (!(await verifyUserPassword(session.userId, currentPassword))) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: { currentPassword: ["Current password is incorrect"] },
    };
  }
  if (newPassword === currentPassword) {
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      fieldErrors: { newPassword: ["New password must differ from the current one"] },
    };
  }

  await setUserPassword(session.userId, newPassword);
  await recordActivity(session.userId, "UPDATE", "USER", session.userId);
  return { ok: true, data: undefined };
}
