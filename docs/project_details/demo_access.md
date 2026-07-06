# Demo Portal Access (frontend-only phase)

Authentication in this phase is DEMO-GRADE (HMAC-signed cookie over an
in-memory user table). It exists so the investor demo has a working,
role-aware portal. It will be replaced by real authentication (Supabase
Auth per the DB design) in the backend phase.

Credentials are intentionally NOT shown anywhere in the UI.

| Username | Password | Role |
|---|---|---|
| `manish` | `admin@vayita2026` | admin - full access incl. Users module |
| `nirmalya` | `dev@vayita2026` | dev - full access |
| `sourav.field` | `field@vayita2026` | sub_admin - no Users module |
| `prakash.field` | `field@vayita2026` | sub_admin |

Notes:

- Accounts created via Dashboard → Users receive a generated temp password
  and can log in within the same server session.
- The mock database resets on server restart (in-memory by design).
- Set `SESSION_SECRET` in production-like deployments of the demo.
