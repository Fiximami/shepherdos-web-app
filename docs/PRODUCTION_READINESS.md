# FaithBaseOS — Production Readiness

This document describes how the `shepherdos-web-app` frontend is configured for alpha deployment at `app.faithbaseos.com`.

## Architecture

| Domain | Purpose |
|--------|---------|
| `faithbaseos.com` | Marketing site (separate project recommended) |
| `app.faithbaseos.com` | This Next.js application (Vercel) |
| `shepherdos-api.onrender.com` | API today (`api.faithbaseos.com` later) |

## Vercel environment variables

**Full setup guide:** [VERCEL_PRODUCTION.md](./VERCEL_PRODUCTION.md)

Set these in the Vercel project for **Production**:

```env
NEXT_PUBLIC_API_BASE_URL=https://shepherdos-api.onrender.com
NEXT_PUBLIC_PRODUCT_NAME=FaithBaseOS
NEXT_PUBLIC_PRODUCT_TAGLINE=Church operations, cared for well.
NEXT_PUBLIC_APP_URL=https://app.faithbaseos.com
NEXT_PUBLIC_ALPHA_MODE=true
NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=false
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
NEXT_PUBLIC_ENABLE_PASSWORD_RESET=false
NEXT_PUBLIC_CHURCH_SLUG=alpha-grace-church
```

**Production branch (current):** `setup/webapp-foundation` — set in Vercel → Settings → Git until merged to `main`.

### Local development

Copy `.env.example` to `.env.local`. For full route visibility during development:

```env
NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=true
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

## Render CORS

Add these origins on the API service:

```
https://app.faithbaseos.com
https://<your-vercel-project>.vercel.app
http://localhost:3000
```

Allow headers: `Authorization`, `Content-Type`, `Accept`.

## Alpha route policy

When `NEXT_PUBLIC_ALPHA_MODE=true` and `NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=false`:

### Member routes (visible)

| Route | Badge | Notes |
|-------|-------|-------|
| `/dashboard` | Beta | Live `/me` summaries; preview widgets for events/prayer |
| `/profile` | Beta | `/members/me`; ministry/skills sections are preview |
| `/attendance` | — | `/attendance/me` |
| `/finance` | — | `/finance/me` |
| `/giving` | — | `/giving/me` |
| `/settings` | Beta | Profile fields from API; toggles are local-only |

### Member routes (hidden — redirect to `/dashboard`)

`/feed`, `/events`, `/prayer-requests`, `/counselling`, `/store`, `/celebrations`, `/notifications`, `/messages`, `/members`, `/communication`, `/analytics`, `/engagement`

### Admin routes (visible)

| Route | Badge |
|-------|-------|
| `/admin` | Beta |
| `/admin/members` | — |
| `/admin/attendance` | Beta |
| `/admin/finance` | Beta |
| `/admin/giving` | Beta |
| `/admin/settings` | Beta |

### Admin routes (hidden — redirect to `/admin`)

All other `/admin/*` modules (departments, events, prayer-requests, analytics, reports, etc.)

### Auth routes

| Route | Availability |
|-------|----------------|
| `/login` | Always |
| `/forgot-password` | Only when `NEXT_PUBLIC_ENABLE_PASSWORD_RESET=true` |
| `/reset-password` | Only when `NEXT_PUBLIC_ENABLE_PASSWORD_RESET=true` |

## Demo mode

- Controlled by `NEXT_PUBLIC_ENABLE_DEMO_MODE` (defaults to `true` in development, `false` in production unless set).
- When disabled: demo button hidden on login, existing demo sessions cleared on refresh.
- Demo uses mock data only — never call live protected endpoints.

## SEO and indexing

- Root layout sets `robots: { index: false, follow: false }`.
- `src/app/robots.ts` disallows authenticated app paths.
- Login remains reachable but is not intended for public indexing.

## Deployment checklist

1. [ ] Push branch to GitHub and connect Vercel project
2. [ ] Set production environment variables (see above)
3. [ ] Add `app.faithbaseos.com` custom domain in Vercel
4. [ ] Configure Namecheap CNAME: `app` → Vercel DNS target
5. [ ] Update Render CORS for `app.faithbaseos.com`
6. [ ] Run `npm run build` locally or verify Vercel build
7. [ ] Smoke test: login → dashboard → profile → attendance → finance → giving
8. [ ] Smoke test admin: `/admin` → members → attendance → finance → giving → settings
9. [ ] Confirm hidden routes redirect (e.g. `/feed` → `/dashboard`)
10. [ ] Confirm demo button absent on production login
11. [ ] Confirm forgot-password link absent until backend ready

## Build and test

```bash
npm run build
npm run start
```

### Route visibility test (alpha mode)

With production env flags (`ALPHA_MODE=true`, `SHOW_PREVIEW_ROUTES=false`):

- Sidebar shows 6 member items (dashboard, profile, attendance, finance, giving, settings)
- Admin sidebar shows 6 leadership items
- Visiting `/feed` redirects to `/dashboard`
- Visiting `/admin/analytics` redirects to `/admin`
- Visiting `/forgot-password` redirects to `/login`

## Known follow-ups (post-alpha)

- Server middleware for auth (client guards only today)
- Wire password reset to backend
- Role-based admin gate when API omits `permissions`
- Replace mock global search
- FaithBaseOS logo asset in `public/images/branding/`
- Marketing site at `faithbaseos.com`

## Implementation reference

| Concern | Location |
|---------|----------|
| Product branding | `src/lib/config/product.ts` |
| Alpha route lists | `src/lib/config/alpha-routes.ts` |
| Route redirect guard | `src/components/shared/route-availability-guard.tsx` |
| Nav preview badges | `src/components/shared/preview-badge.tsx` |
| Demo gating | `src/lib/api/token-storage.ts`, `src/components/auth/login-form.tsx` |
| Robots | `src/app/robots.ts`, `src/app/layout.tsx` |
