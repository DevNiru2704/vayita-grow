import "server-only";

/**
 * Fixed-window, per-key rate limiter kept in process memory. Good enough for a
 * single-instance deployment to blunt brute-force on login / 2FA / public
 * forms. For a multi-instance deployment, back this with a `rate_limits` table
 * or Redis — the call sites stay the same.
 */

interface Window {
  count: number;
  resetAt: number;
}

declare global {
  var __vayitaRateLimit: Map<string, Window> | undefined;
}
function store(): Map<string, Window> {
  globalThis.__vayitaRateLimit ??= new Map();
  return globalThis.__vayitaRateLimit;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const map = store();
  const existing = map.get(key);

  if (!existing || existing.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfterMs: 0 };
}
