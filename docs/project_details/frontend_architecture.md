# Architecture (full-stack)

State as of July 2026. The production-quality UI sits over a **dual data
source**: an in-memory mock layer (default, zero-infra demo) and a real
PostgreSQL backend, selected by `DATA_SOURCE=mock|supabase`. Pages and
components are unchanged across sources — only the data layer differs.

## Data source seam (`DATA_SOURCE`)

Each domain has `lib/services/<domain>.mock.ts` (in-memory) and
`<domain>.pg.ts` (parameterized SQL via `lib/db/`), re-exported by a thin
`<domain>.ts` dispatcher. Server actions in `lib/actions/*` run auth + Zod
validation once, then dispatch to the mock body or the `.pg` writer by source.
`lib/db/`: `source.ts` (the flag), `pool.ts` (pg pool + type parsers),
`query.ts` (`query`/`queryOne`/`withActor`), `list.ts` (SQL filter/sort/
paginate, sort-key whitelisted). Schema: `supabase/migrations/*.sql`; seed:
`supabase/seed.sql` + `scripts/seed.ts`.

## Auth (real)

`lib/auth/`: JWT cookie sessions (`jose`), Argon2 passwords, Google
Authenticator 2FA (TOTP challenge token, 5-min, single-use), token blacklist,
role matrix (`dev`/`admin`/`staff`). `proxy.ts` stays optimistic; the dashboard
layout + every action are authoritative. Rate limiting in `lib/security/`.

## Integrations & added modules

Resend (`lib/email/`), Cloudinary (`lib/media/`), Quotations module, Excel
exports (`app/dashboard/export/[entity]`), dashboard charts + PDF, quotation
PDF, `FilterSelect` filters, self-service password change + admin resets. See
`docs/guidelines/guidelines4-security.md` for the security posture.

## Layers

```text
app/            route entry points (server components; client leaves colocated per route)
components/
├── layout/     public Header/Footer
├── dashboard/  DashboardShell/Sidebar/Topbar + chart client leaves
├── shared/     StatusBadge, StatCard, PageHeader, SectionHeading, EmptyState,
│               DataTable, SortableHeader, DataTablePagination, FilterPills,
│               SearchInput, FormField, ConfirmDialog, MotionReveal, AnimatedNumber,
│               ProductCard
└── ui/         shadcn (base-nova / Base UI) primitives, token-themed
lib/
├── config/     company.ts (facts + PLACEHOLDER contacts), navigation.ts, site.ts, marketing.ts
├── types/      domain types mirroring the DB design (ERD v1.2.0) + EXTENSION domains
├── mock/       in-memory MockDb (globalThis-cached) + seeds; REAL product data in seed/catalog.ts
├── services/   async READ API - pages import only this          ← Supabase swap seam
├── actions/    'use server' MUTATIONS (zod-validated, auth-checked) ← Supabase swap seam
├── auth/       demo cookie session (HMAC) + guards               ← Supabase Auth swap seam
├── url.ts      URL-as-state helpers   · format.ts  en-IN formatting
proxy.ts        optimistic /dashboard cookie gate (Node runtime)
```

## Contracts to preserve when building the backend

- Every `lib/services/*` and `lib/actions/*` signature is the contract; rewrite
  bodies only. All return `Paginated<T>` / `ActionResult<T>` from `lib/types/common.ts`.
- Every action verifies the session (`requireSession`/`requireRole`) - keep this;
  server actions are public POST endpoints.
- Schema gaps flagged `EXTENSION` in `lib/types/`: statements, field reports,
  product slug + marketing fields (`product_details`), customer state/status.
  These need DB-design additions.
- Demo auth (`lib/auth/`, `proxy.ts`) is replaced by real sessions; `proxy.ts`
  stays optimistic-only, authorization lives in the data layer and actions.
- `basePrice` is demo pricing for the dashboard only - never render prices on
  the public site (B2B inquiry model).

## Route map

Public: `/` `/about` `/products` (`?category=`) `/products/[slug]` (SSG +
generateMetadata) `/contact` (`?subject=&product=` prefill) `/feedback` `/login`
plus `sitemap.ts`, `robots.ts`, `manifest.ts`, global `not-found.tsx`.

Dashboard (all session-gated, noindex): overview · clients (+`[id]`) · orders
(+`new`, `[id]`) · deliveries (+`[id]`) · statements · catalog/products
(+`new`, `[id]`) · catalog/categories · inventory · suppliers · field-reports
(+`[id]`) · feedback · activity · users (admin/dev only) · settings.

## Conventions

- Server-first: pages are async server components; interactivity lives in small
  colocated `"use client"` leaves (forms, dialogs, selects).
- List state lives in the URL (`?query=&page=&sort=&dir=&status=…`);
  services filter/sort/paginate server-side.
- All colors flow through tokens in `app/globals.css`; status colors only via
  `StatusBadge`; chart colors via `--chart-*`. See docs/design_systems/design-system.md.
- Icons: lucide-react only. No emojis.
- Motion: `MotionReveal`/`AnimatedNumber` (motion library), reduced-motion safe.

## Verification snapshot (2026-07-05)

- `tsc --noEmit`, `eslint`, `next build` all clean (Next 16.2.9, Turbopack).
- HTTP smoke test: all 11 public + 21 dashboard routes 200; `/dashboard` without
  cookie → 307 `/login?from=…`; tampered session cookie rejected; fabricated
  stats ("10+ states", "150+ dealers", "5000+ farmers") confirmed absent from
  the public site; per-product metadata present.
- Remaining manual QA (needs a browser): axe scan, keyboard walk, Lighthouse,
  reduced-motion emulation, and the investor-path CRUD script in
  docs/project_details/demo_access.md.

## Known issue: `next dev` memory growth (Next 16.2.x / Turbopack)

The dev server retains ~1-2 MB per dynamically-rendered request (measured on
this app; public static routes stay flat, all `/dashboard/*` and other dynamic
routes grow). This is a known upstream Turbopack dev issue - production is
unaffected (`next start` stays at ~170 MB under sustained load, verified).

Mitigations:
- `experimental.turbopackFileSystemCacheForDev` is enabled in `next.config.ts`
  (moves compile cache to disk). After changing `next.config.ts`, clear
  `.next/dev` if routes 404 or the proxy errors - stale dev cache.
- Restart `next dev` when a long session gets sluggish; optionally run
  `NODE_OPTIONS=--max-old-space-size=4096 npm run dev` to fail fast instead of
  freezing the machine.
- Track upstream: vercel/next.js #73921, #81161.
