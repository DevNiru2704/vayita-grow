# Security Guidelines & Pre-Launch Checklist

Adapted from the client-provided "Vibe Coder Security Checklist" and mapped to
how the Vayita Grow portal addresses each item. Use the mapping tables before
every launch; anything marked **TODO** must be resolved before go-live.

> Enforcement lives in code, not just this doc: auth guards
> (`lib/auth/guards.ts`), the JWT session layer (`lib/auth/*`), the parameterized
> `pg` data layer (`lib/db/*`), Zod validation in every server action, the
> rate limiter (`lib/security/rate-limit.ts`), and the CSP/headers in
> `next.config.ts`.

---

## Frontend

| Item | Status | How it's handled |
|---|---|---|
| Exposed API keys | ✅ | All secrets are server-only. The only `NEXT_PUBLIC_*` value is the Cloudinary **cloud name** (public by design). See `.env.example`. |
| Input validation | ✅ | Every form validates client-side and again server-side with Zod in `lib/actions/*`. |
| Unsafe forms | ✅ | Fixed field sets + Zod enums; public forms add a honeypot (`website`) and rate limiting. |
| Weak password rules | ✅ | `lib/auth/password-policy.ts`: ≥8 chars incl. upper/lower/digit/symbol, enforced on every chosen password. |
| Error handling | ✅ | User-facing messages are generic; technical details go to server logs only. |
| Exposed admin pages | ✅ | `/dashboard/*` gated by `proxy.ts` (optimistic) + authoritative `getSession()` in the layout + `requireRole` in actions. Users module is admin/dev only. |
| Unsafe redirects | ✅ | Post-login redirect is whitelisted to `/dashboard*` (`safeRedirectTarget` in `lib/actions/auth.ts`). |
| Content Security Policy | ✅ | Production CSP + security headers in `next.config.ts` (see below). |
| Sensitive data in localStorage | ✅ | Auth uses httpOnly cookies; nothing sensitive is stored in the browser. |
| Rate limit on public forms | ✅ | Login, 2FA, contact, feedback, and password change are rate-limited per IP/user. |

## Backend

| Item | Status | How it's handled |
|---|---|---|
| Broken access control | ✅ | `requireSession`/`requireRole` on every mutation; per-role password matrix (`lib/actions/users.ts`); export routes re-check auth. |
| Authentication check | ✅ | JWT cookie sessions (`jose`), verified + blacklist-checked on every request; server actions self-verify. |
| SQL injection | ✅ | 100% parameterized queries via `lib/db/query.ts`; `?sort=` is whitelisted in `lib/db/list.ts`. No string-built SQL. |
| Insecure API routes | ✅ | The only route handlers are the export routes — each authenticates and (for users) authorizes. |
| Exposed environment variables | ✅ | Secrets never logged or returned; `JWT_SECRET` required in supabase mode (fails fast). |
| Weak session handling | ✅ | httpOnly + `secure` (prod) + `sameSite=lax` cookies, 8h expiry, jti blacklist on logout, single-use 2FA challenge tokens. |
| Server-side validation | ✅ | Zod on every action; enum values validated before hitting Postgres enums. |
| Unsafe file uploads | ✅ | Cloudinary upload validates MIME + size (≤5 MB) server-side (`lib/actions/media.ts`). |
| Missing rate limits | ✅ | See above. In-memory limiter is single-instance — swap to a table/Redis for horizontal scale. |
| Poor error messages | ✅ | Generic client errors; Postgres/internal details stay server-side. |
| Security logging | ✅ | Logins → `login_history`; mutations + auth events → `activity_logs` (30-day auto-purge). |
| Payment/checkout logic | N/A | No online payments; payments are recorded manually by staff. |

## Practical habits

- Secrets are managed via env vars only (`.env*` is git-ignored); never pasted into chats.
- 2FA (Google Authenticator TOTP) available for admin/dev accounts.
- HTTPS enforced in production via HSTS + `upgrade-insecure-requests`.
- Run `npm audit` before each release (see Known advisories).

---

## Content-Security-Policy & headers (`next.config.ts`)

Applied in **production** (dev is relaxed for Turbopack HMR):

- `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`
- `img-src 'self' data: blob: https://res.cloudinary.com`, `connect-src 'self'`
- `script-src`/`style-src` allow `'unsafe-inline'` (Next hydration bootstrap + Tailwind inline styles). Tightening to nonce-based CSP is a future hardening step.
- Always on: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo off).
- Production only: `Strict-Transport-Security` (2y, preload).

## Known advisories (accepted)

`npm audit` reports **4 moderate, 0 high/critical**. Both are transitive and not
exploitable in our usage; the offered fixes are breaking downgrades (Next → 9,
exceljs → 3) and are intentionally **not** applied:

- `postcss <8.5.10` — pulled in by Next's own toolchain (CSS stringify XSS; we never process untrusted CSS).
- `uuid <11.1.1` — pulled in by `exceljs` (bounds check only when a `buf` is passed; we never do).

Re-evaluate when Next / exceljs ship patched transitive deps.

## Final pre-launch checklist

- [ ] Rotate all secrets; set real `JWT_SECRET`, DB, Resend, Cloudinary values.
- [ ] Run migrations + seed against the production database.
- [ ] Confirm a `staff` account cannot reach the Users module, admin routes, or the users export.
- [ ] Test login → 2FA → logout; verify a logged-out (blacklisted) token is rejected.
- [ ] Verify password change + reset flows and the strength policy.
- [ ] `npm audit` — no new high/critical.
- [ ] Confirm CSP doesn't block images/fonts/charts in production.
