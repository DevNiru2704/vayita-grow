# Portal Access & Authentication

The portal uses **JWT cookie sessions** (signed with `jose`, HS256, httpOnly,
`vg_session`). Passwords are hashed with **Argon2id** on the Postgres data
source; the mock demo keeps plaintext demo credentials so the investor demo runs
with zero infrastructure. Logout revokes the token via a blacklist
(`user_token_blacklist` in Postgres, in-memory in mock mode).

Credentials are intentionally NOT shown anywhere in the UI.

| Username | Password | Role |
|---|---|---|
| `manish` | `admin@vayita2026` | admin - full access incl. Users module |
| `nirmalya` | `dev@vayita2026` | dev - full access |
| `sourav.field` | `field@vayita2026` | staff - no Users module |
| `prakash.field` | `field@vayita2026` | staff |

## Two-factor authentication (Google Authenticator)

- Admin/dev accounts can enable TOTP 2FA in **Dashboard → Settings** (scan the
  QR with Google Authenticator, confirm a code). If already enabled, the card
  shows a confirmation message and a **Disable 2FA** option (requires a current
  code).
- When 2FA is enabled, login is two-step: after the password, a **5-minute
  challenge** JWT (`vg_2fa`) is issued and the user is redirected to
  `/login/2fa`, which shows a live countdown. The challenge token is single-use
  (blacklisted after a successful verification).

## Data source & environment

- `DATA_SOURCE=mock` (default) → in-memory demo, resets on server restart, no
  infra required. `DATA_SOURCE=supabase` → Postgres via `DATABASE_URL`.
- Accounts created via **Dashboard → Users** receive a generated temp password
  (Argon2-hashed in Postgres) and can log in immediately.
- Required secrets: `JWT_SECRET` (session signing; **required** in supabase
  mode), `JWT_ISSUER`, `TOTP_ISSUER`. See `.env.example`. `SESSION_SECRET` is a
  legacy fallback for mock mode only.
- Login and 2FA verification are rate-limited (per IP + username) to blunt
  brute-force attempts.

## Password & account management (RBAC)

- **Everyone** can change their own password in Settings (current + new +
  confirm). Policy: ≥8 chars with uppercase, lowercase, digit, and special
  symbol.
- **dev** creates dev/admin/staff accounts and recovers any account (issues a
  temporary password — used for admin account recovery when a password is lost).
- **admin** creates **staff** accounts only, and can reset a **staff**
  password only by supplying that staff member's current password. Admin can
  never change or reset a dev or admin password.
- **staff** manage no accounts.
- New accounts and recoveries receive a one-time temporary password to be
  changed on first sign-in.
