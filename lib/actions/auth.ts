"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { blacklist } from "@/lib/auth/blacklist";
import { verifyCredentials } from "@/lib/auth/credentials";
import { recordLogin } from "@/lib/auth/login-history";
import {
  clearChallenge,
  createChallenge,
  createSession,
  destroySession,
  getChallenge,
  getSession,
} from "@/lib/auth/session";
import { verifyTotp } from "@/lib/auth/totp";
import { get2fa } from "@/lib/auth/two-factor-store";
import { recordActivity } from "@/lib/audit";
import { rateLimit } from "@/lib/security/rate-limit";
import type { SessionUser } from "@/lib/types/user";

export interface LoginFormState {
  error: string | null;
}
export interface TwoFactorFormState {
  error: string | null;
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  from: z.string().optional(),
});

async function clientMeta(): Promise<{ ip: string | null; device: string | null }> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
  return { ip, device: h.get("user-agent") };
}

function safeRedirectTarget(from: string | undefined): string {
  return from && from.startsWith("/dashboard") ? from : "/dashboard";
}

/** Completes sign-in: session cookie + audit trail, then redirect. */
async function establishSession(user: SessionUser, from: string | undefined): Promise<never> {
  await createSession(user);
  const { ip, device } = await clientMeta();
  await recordLogin(user.userId, ip, device);
  await recordActivity(user.userId, "LOGIN", "SYSTEM");
  redirect(safeRedirectTarget(from));
}

export async function loginDemo(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter both username and password." };

  const { ip } = await clientMeta();
  const limited = rateLimit(`login:${ip ?? "unknown"}:${parsed.data.username.toLowerCase()}`, 5, 60_000);
  if (!limited.ok) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }

  const user = await verifyCredentials(parsed.data.username, parsed.data.password);
  if (!user) return { error: "Invalid username or password." };

  if (user.is2faEnabled) {
    await createChallenge(user);
    const from = parsed.data.from ? `?from=${encodeURIComponent(parsed.data.from)}` : "";
    redirect(`/login/2fa${from}`);
  }

  return establishSession(user, parsed.data.from);
}

export async function verifyTwoFactor(
  _prevState: TwoFactorFormState,
  formData: FormData,
): Promise<TwoFactorFormState> {
  const code = String(formData.get("code") ?? "").trim();
  const from = String(formData.get("from") ?? "") || undefined;

  const challenge = await getChallenge();
  if (!challenge) redirect("/login");

  const limited = rateLimit(`2fa:${challenge.user.userId}`, 5, 60_000);
  if (!limited.ok) return { error: "Too many attempts. Please wait a minute and try again." };

  if (!/^\d{6}$/.test(code)) return { error: "Enter the 6-digit code from your authenticator app." };

  const status = await get2fa(challenge.user.userId);
  if (!status.secret || !verifyTotp(code, status.secret)) {
    return { error: "That code isn't valid. Check your authenticator app and try again." };
  }

  // Single-use: revoke the challenge token before establishing the session.
  await blacklist(challenge.user.userId, challenge.jti, challenge.exp);
  await clearChallenge();
  return establishSession(challenge.user, from);
}

export async function logoutDemo(): Promise<void> {
  const session = await getSession();
  if (session) await recordActivity(session.userId, "LOGOUT", "SYSTEM");
  await destroySession();
  redirect("/login");
}
