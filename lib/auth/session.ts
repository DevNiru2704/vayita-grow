import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ROLE_NAMES } from "@/lib/types/database";
import type { SessionUser } from "@/lib/types/user";

/**
 * DEMO SESSION - swap point for Supabase Auth / real JWT sessions.
 * The cookie carries an HMAC-signed JSON payload; good enough to keep the
 * demo portal honest (no forgeable role escalation via cookie editing),
 * NOT production authentication.
 */

export const SESSION_COOKIE = "vg_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8-hour demo session

function secret(): string {
  return process.env.SESSION_SECRET ?? "vayitagrow-demo-secret-not-for-production";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encodeSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as SessionUser).userId === "number" &&
      typeof (parsed as SessionUser).username === "string" &&
      ROLE_NAMES.includes((parsed as SessionUser).role)
    ) {
      return parsed as SessionUser;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
