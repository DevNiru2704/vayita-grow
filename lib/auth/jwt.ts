import "server-only";
import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * JWT signing/verification for cookie-based sessions and 2FA challenge tokens
 * (HS256 via `jose`). One signing key is shared by both token kinds; the
 * `purpose` claim distinguishes a 2FA challenge from a full session.
 */

const ISSUER = process.env.JWT_ISSUER ?? "vayita-grow";
const encoder = new TextEncoder();

function signingKey(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? process.env.SESSION_SECRET;
  if (secret) return encoder.encode(secret);
  if (process.env.DATA_SOURCE === "supabase") {
    throw new Error("JWT_SECRET must be set when DATA_SOURCE=supabase.");
  }
  // Mock/demo fallback only — never used against a real database.
  return encoder.encode("vayitagrow-dev-insecure-secret-change-me");
}

export interface TokenClaims extends JWTPayload {
  username: string;
  role: string;
  purpose?: "2fa";
}

export function newJti(): string {
  return randomUUID();
}

export async function signToken(
  claims: { sub: string; username: string; role: string; purpose?: "2fa" },
  opts: { jti: string; ttlSeconds: number },
): Promise<{ token: string; exp: number }> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + opts.ttlSeconds;
  const token = await new SignJWT({
    username: claims.username,
    role: claims.role,
    ...(claims.purpose ? { purpose: claims.purpose } : {}),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setJti(opts.jti)
    .setIssuer(ISSUER)
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(signingKey());
  return { token, exp };
}

export async function verifyToken(token: string): Promise<TokenClaims | null> {
  try {
    const { payload } = await jwtVerify(token, signingKey(), { issuer: ISSUER });
    return payload as TokenClaims;
  } catch {
    return null;
  }
}
