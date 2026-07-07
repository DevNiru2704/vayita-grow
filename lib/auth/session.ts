import "server-only";
import { cookies } from "next/headers";
import { ROLE_NAMES, type RoleName } from "@/lib/types/database";
import type { SessionUser } from "@/lib/types/user";
import { blacklist, isBlacklisted } from "./blacklist";
import { newJti, signToken, verifyToken } from "./jwt";

/**
 * Cookie-based auth. A signed session JWT (`vg_session`) carries identity; a
 * short-lived 2FA challenge JWT (`vg_2fa`) bridges password → TOTP during
 * login. Both are httpOnly and revocable via the token blacklist.
 */

export const SESSION_COOKIE = "vg_session";
export const CHALLENGE_COOKIE = "vg_2fa";

const SESSION_TTL = 60 * 60 * 8; // 8 hours
const CHALLENGE_TTL = 60 * 5; // 5 minutes

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
  };
}

function toSessionUser(claims: { sub?: string; username: string; role: string }): SessionUser | null {
  const userId = Number(claims.sub);
  if (!Number.isInteger(userId) || !ROLE_NAMES.includes(claims.role as RoleName)) return null;
  return { userId, username: claims.username, role: claims.role as RoleName };
}

// --- Session -----------------------------------------------------------------

export async function createSession(user: SessionUser): Promise<void> {
  const { token } = await signToken(
    { sub: String(user.userId), username: user.username, role: user.role },
    { jti: newJti(), ttlSeconds: SESSION_TTL },
  );
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(SESSION_TTL));
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const claims = await verifyToken(token);
  if (!claims || claims.purpose) return null; // reject 2FA challenge tokens here
  if (claims.jti && (await isBlacklisted(claims.jti))) return null;
  return toSessionUser(claims);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const claims = await verifyToken(token);
    if (claims?.jti && claims.exp) await blacklist(Number(claims.sub), claims.jti, claims.exp);
  }
  store.delete(SESSION_COOKIE);
}

// --- 2FA challenge -----------------------------------------------------------

/** Issues the challenge cookie; returns its expiry (unix seconds) for the UI countdown. */
export async function createChallenge(user: SessionUser): Promise<number> {
  const { token, exp } = await signToken(
    { sub: String(user.userId), username: user.username, role: user.role, purpose: "2fa" },
    { jti: newJti(), ttlSeconds: CHALLENGE_TTL },
  );
  (await cookies()).set(CHALLENGE_COOKIE, token, cookieOptions(CHALLENGE_TTL));
  return exp;
}

export async function getChallenge(): Promise<{ user: SessionUser; jti: string; exp: number } | null> {
  const token = (await cookies()).get(CHALLENGE_COOKIE)?.value;
  if (!token) return null;
  const claims = await verifyToken(token);
  if (!claims || claims.purpose !== "2fa" || !claims.jti || !claims.exp) return null;
  if (await isBlacklisted(claims.jti)) return null;
  const user = toSessionUser(claims);
  return user ? { user, jti: claims.jti, exp: claims.exp } : null;
}

export async function clearChallenge(): Promise<void> {
  (await cookies()).delete(CHALLENGE_COOKIE);
}
