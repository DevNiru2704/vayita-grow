"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { TWO_FA_ROLES } from "@/lib/auth/roles";
import { generateSecret, otpauthUrl, qrDataUrl, verifyTotp } from "@/lib/auth/totp";
import { disable2fa, enable2fa, get2fa, setPendingSecret } from "@/lib/auth/two-factor-store";
import { recordActivity } from "@/lib/audit";
import type { ActionResult } from "@/lib/types/common";

/**
 * Two-factor authentication management (Google Authenticator TOTP). Offered to
 * admin/dev accounts. Enrollment is two-step: generate a secret + QR, then
 * confirm with a live code before 2FA is switched on.
 */

export interface EnrollmentData {
  alreadyEnabled: boolean;
  qr?: string;
  secret?: string;
}

export async function begin2faEnrollment(): Promise<ActionResult<EnrollmentData>> {
  const session = await requireRole(TWO_FA_ROLES);
  const status = await get2fa(session.userId);
  if (status.enabled) return { ok: true, data: { alreadyEnabled: true } };

  const secret = generateSecret();
  await setPendingSecret(session.userId, secret);
  const qr = await qrDataUrl(otpauthUrl(session.username, secret));
  return { ok: true, data: { alreadyEnabled: false, qr, secret } };
}

export async function confirm2faEnrollment(code: string): Promise<ActionResult> {
  const session = await requireRole(TWO_FA_ROLES);
  const status = await get2fa(session.userId);
  if (status.enabled) return { ok: false, error: "Two-factor authentication is already enabled." };
  if (!status.secret || !verifyTotp(code.trim(), status.secret)) {
    return { ok: false, error: "That code isn't valid. Try again with a fresh code." };
  }

  await enable2fa(session.userId, status.secret);
  await recordActivity(session.userId, "UPDATE", "USER", session.userId);
  revalidatePath("/dashboard/settings");
  return { ok: true, data: undefined };
}

export async function disable2faForCurrentUser(code: string): Promise<ActionResult> {
  const session = await requireRole(TWO_FA_ROLES);
  const status = await get2fa(session.userId);
  if (!status.enabled) return { ok: false, error: "Two-factor authentication is not enabled." };
  if (!status.secret || !verifyTotp(code.trim(), status.secret)) {
    return { ok: false, error: "Enter a valid current code to turn off 2FA." };
  }

  await disable2fa(session.userId);
  await recordActivity(session.userId, "UPDATE", "USER", session.userId);
  revalidatePath("/dashboard/settings");
  return { ok: true, data: undefined };
}
