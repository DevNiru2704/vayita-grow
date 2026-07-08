# VayitaGrow Bioorganics - Design System

> Living document. Update whenever a visual decision changes (AGENTS.md documentation policy).
> Derived from the Design Constitution for this specific business: a B2B agricultural-inputs
> manufacturer whose site must communicate trust, operational maturity, and natural growth
> to dealers, distributors, and investors.

## 1. Brand foundation

- **Personality**: grounded, scientific-yet-natural, dependable. An established company preparing for expansion - not a startup template.
- **Visual tone**: calm, confident, warm-professional.
- **Visual complexity**: Level 2-3 (modern professional, leaning premium). Credibility beats spectacle; restraint is the premium signal.
- **Emotional targets**: trust, confidence, growth.

## 2. Color

Defined in `app/globals.css` (`@theme` + `:root`). All UI color flows through tokens - raw hex values in components are forbidden.

### Brand scale (green - derived from the brand primary `#14833B`)

| Token | Value | Use |
|---|---|---|
| `brand-50` | `#f2faf4` | Tinted page sections |
| `brand-100` | `#eaf6ed` | Soft fills, secondary/accent surfaces |
| `brand-200` | `#c9e8d2` | Hover fills, dividers on tinted surfaces |
| `brand-300` | `#9bd4ac` | Decorative accents, chart tint |
| `brand-400` | `#58b478` | Supporting data series |
| `brand-500` | `#2a9d4b` | Secondary brand green |
| `brand-600` | `#14833b` | **Primary** - CTAs, links, focus ring |
| `brand-700` | `#106b31` | Hover state of primary |
| `brand-800` | `#0d5628` | Active state, deep accents |
| `brand-900` | `#0a4520` | Dark surfaces, footer/hero depth |
| `brand-950` | `#052e18` | Deepest forest backdrop |

### Accent (harvest gold - used sparingly, one accent only)

`gold-100 #fbf3dd · gold-300 #ecc95e · gold-500 #d4a017 · gold-700 #a87d0f`

Use for: section-heading underline, small emphasis marks, chart accent series. Never for large surfaces or body text (contrast).

### Semantic status tokens (StatusBadge, alerts, form states)

| Status | Foreground | Soft background |
|---|---|---|
| success | `status-success #14833b` | `status-success-soft #eaf6ed` |
| warning | `status-warning #b45309` | `status-warning-soft #fef3e2` |
| danger | `status-danger #b91c1c` | `status-danger-soft #fdecec` |
| info | `status-info #1d4ed8` | `status-info-soft #e8effd` |
| neutral | `status-neutral #52525b` | `status-neutral-soft #f2f2f3` |

Status → token mapping (single source: `StatusBadge` component):
Delivered/Completed/Active/Resolved → success · Pending/Follow-up/Open → warning ·
Cancelled/Failed/Returned/Inactive → danger · Processing/Shipped/In-Transit/In-Progress/New → info · Closed/neutral facts → neutral.

### Neutrals & shadcn tokens

Foreground `#1c2620` (green-tinted near-black), muted-foreground `#57635b`, border/input `#e4e9e5`, muted surface `#f6f8f6`. shadcn `primary/secondary/accent/ring/sidebar/chart` tokens are all mapped to the brand scale in `:root`.

**Theme**: light only (deliberate - trust-first agri audience; constitution: never default to dark). Token structure is dark-ready; `@custom-variant dark` remains declared for shadcn compatibility but no `.dark` block ships.

### Charts

`--chart-1 #14833b · --chart-2 #58b478 · --chart-3 #d4a017 · --chart-4 #0a4520 · --chart-5 #9bd4ac`. Recharts components must read these CSS variables - never hardcode hex.

## 3. Typography

- **Display/headings**: Fraunces (variable, `next/font`, `--font-fraunces` → `font-display`). Warm, editorial serif signaling establishment + organic character. Applied to `h1-h6` globally with `letter-spacing: -0.01em` and `text-wrap: balance`.
- **Body/UI**: Inter (variable, `--font-inter` → `font-sans`). The dashboard is Inter throughout, including headings inside data-dense modules (utility context) - use `font-sans` explicitly on dashboard headings.
- **Scale** (Tailwind classes): display `text-5xl/6xl` (hero only) · h1 `text-4xl` · h2 `text-3xl` · h3 `text-xl` · h4 `text-lg` · body-lg `text-lg` · body `text-base` · small `text-sm` · caption/label `text-xs`-`text-sm` medium.
- **Reading width**: prose blocks max ~70ch (`max-w-prose` or `max-w-2xl`).
- Weights: Inter 400/500/600; Fraunces 500-700. No more than two weights per composition.

## 4. Spacing, layout, grid

- 4-px mathematical scale only (Tailwind default steps; no arbitrary values like `p-[13px]`).
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` everywhere on the public site.
- **Section rhythm**: `py-20 lg:py-28` standard, `py-16` compact. One rhythm per page - no ad-hoc paddings.
- Dashboard content: `p-4 lg:p-6`, cards `gap-4 lg:gap-6` grid.
- Whitespace is a feature: prefer more space over more decoration.

## 5. Shape & elevation

- **Radius**: base `--radius: 0.75rem`; cards/inputs `rounded-lg`-`rounded-xl`; pills `rounded-full`. Consistent per component class.
- **Elevation ladder**: 0 background · 1 card (`border` + `shadow-xs`, flat & trustworthy) · 2 sticky nav (`shadow-sm` + blur) · 3 dropdown/popover (`shadow-md`) · 4 modal/sheet (`shadow-lg` + overlay). Never mix levels.
- Borders: thin (`border-border`), purposeful. No decorative outlines.

## 6. Iconography & imagery

- **Icons**: Lucide outline only, default stroke, sizes 16/20/24. No emojis anywhere (AGENTS.md rule). No mixed icon families.
- **Product imagery**: real photography. Background-removed PNGs (`*_rbg.png`) on `brand-50`/`brand-100` tinted surfaces for cards & heroes; full JPGs for detail pages/OG images.
- **No stock-photo mismatches**: never repeat one stock face/photo for different entities. People imagery only when real photos exist; otherwise initials avatars.
- Custom SVG: only purposeful (single brand growth motif allowed); no decorative clutter.

## 7. Motion language - "calm confidence"

Library: `motion` (`motion/react`) for reveals and micro-interactions. All motion honors `prefers-reduced-motion` (global CSS damper + `useReducedMotion` in JS components).

| Tier | Duration | Pattern |
|---|---|---|
| Micro (buttons, icons) | 100-200ms | opacity/color/2px translate |
| Standard UI (cards, dropdowns) | 200-300ms | fade + 8-12px rise |
| Section reveals | 300-500ms | fade + 16-24px rise, stagger 60-100ms |
| Hero (one signature moment) | 500-800ms | staged sequence: headline → product → stats |

- Easing tokens: `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)` (default), `--ease-in-out-soft` for two-way transitions.
- Reveals trigger once (`whileInView` + `viewport={{ once: true }}`), rise only (no zoom/rotate/parallax).
- Counters animate on first view; reduced motion renders final values.
- Forbidden: scroll-jacking, parallax layers, custom cursors, marquee, continuous ambient motion.

## 8. Component language

- All primitives are shadcn (base-nova / Base UI) themed exclusively by tokens in `components/ui/`.
- **Variants flow through CVA** - pages never override component colors with inline brand classes.
- Buttons: primary (solid brand-600), secondary (soft brand-100), outline, ghost, destructive. One primary CTA per view.
- Cards: flat, `border` + subtle shadow, `rounded-xl`; interactive cards get `hover:shadow-md hover:-translate-y-0.5` (200ms).
- Shared components (single implementations, no inline copies): `StatusBadge`, `StatCard`, `PageHeader`, `SectionHeading`, `EmptyState`, `DataTable`, `FormField`, `ConfirmDialog`, `MotionReveal`, `AnimatedNumber`.
- Focus: every interactive element shows `focus-visible:ring-2 ring-ring ring-offset-2`. Never remove outlines without replacement.

## 9. Accessibility

- WCAG AA contrast minimum; brand-600 on white passes for text ≥ 14px bold / 18px regular - body text uses foreground, not brand green.
- Semantic landmarks per page: `header / nav / main / footer`, one `h1`, ordered heading levels.
- Forms: visible labels (`htmlFor`/`id`), errors linked via `aria-describedby`, submit states announced.
- Keyboard: full traversal, dialog focus trap + restore, Escape closes overlays.
- Scrollbars are never hidden (prototype's global hiding was removed).
- Touch targets ≥ 44px on mobile.

## 10. Responsive strategy

Mobile-first. Breakpoints: base (≤640) → `sm` → `md` → `lg` (desktop nav appears) → `xl`.
Components adapt, not shrink: tables gain horizontal-scroll containers on small screens; dashboard sidebar becomes a sheet drawer; multi-column grids collapse 4→2→1; hero stacks with product image after copy.

## 11. Content rules

- Product data (names, descriptions, benefits, dosage, composition, pack sizes) is REAL client data - never edit without approval; source of truth `lib/mock/seed/catalog.ts`.
- Only verifiable facts on the public site: 2 operating states (West Bengal, Jharkhand), 10 products, real category count. No invented testimonials, statistics, certifications, or people.
- Placeholder contact details live only in `lib/config/company.ts`, clearly marked, pending client delivery.
- Currency: INR, formatted `₹1,23,456` via `Intl.NumberFormat("en-IN")` - dashboard only (public site shows no prices; inquiry-based B2B).

## 12. Backend-phase component additions

- **Filters:** `FilterSelect` (compact, URL-driven dropdown) replaced the old
  filter-pill rows everywhere (all dashboard lists + public products) — scales
  to many options and keeps toolbars tight.
- **Charts:** `DashboardCharts` (Recharts) with a chart-type dropdown that shows
  only the selected chart + a "Export PDF" (SVG-rasterized, not html2canvas —
  Tailwind v4 oklch is not rasterizable). Chart internals use hex literals that
  mirror the `--chart-*` tokens so PDF and screen match.
- **Exports:** every list page has an outline "Export" button (server-side
  `.xlsx`); the quotation detail has a branded "Export PDF" (logo + jsPDF).
- **Auth UI:** Settings hosts the change-password card and the 2FA
  enable/disable card; the Users page exposes role-gated create/reset/recover
  dialogs. Password inputs follow the standard `FormField` pattern.
- All new controls use the existing tokens, `Button`/`Input`/`Dialog` primitives,
  lucide icons, and light-theme-only styling.
