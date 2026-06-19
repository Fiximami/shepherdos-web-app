# Phase 17A — Tenant Branding & Workspace Identity

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Tenant-branded member and leadership workspace identity

---

## Summary

Member and leadership shells now prioritize the signed-in church’s name, logo, and workspace labels from session/API data. FaithBaseOS remains the platform fallback when tenant branding is unavailable (login marketing pages, metadata, unauthenticated states).

**Build:** `npm run build` — **passed** (exit 0)

---

## Tenant identity audit

| Location | Before | After |
|----------|--------|-------|
| Member topbar title | `churchName \|\| FaithBaseOS` | `tenantDisplayName` (church name) |
| Member topbar context | `Dashboard · FaithBaseOS workspace` | `Dashboard · Alpha Grace Church Workspace` |
| Member sidebar header | `FaithBaseOS` + Church icon | Church logo + `tenantDisplayName` |
| Member sidebar welcome | `Grace Community Church member` (demo only) | `memberWorkspaceLabel` from live/demo church |
| User menu workspace | `Member workspace` or church name only | `{Church} Workspace` |
| Dashboard welcome | Generic copy | `{Church} · Your member dashboard…` |
| Admin sidebar | Partial (name only) | `TenantLogo` + `tenantDisplayName` |
| Admin topbar | Generic “Leadership Console” | `{Church} Leadership Console` + church in context line |
| Auth/login pages | FaithBaseOS marketing | **Unchanged** (platform sign-in surface) |
| Root metadata | FaithBaseOS | **Unchanged** (platform SEO) |

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/tenant/workspace-identity.ts` | **New** — workspace label helpers, tenant name/logo resolution, platform fallback |
| `src/lib/auth/display-identity.ts` | Added `resolveChurchSlug()` |
| `src/lib/api/types.ts` | `churchSlug` on `ApiUser` / `SessionUser` |
| `src/lib/auth/map-user.ts` | Map `churchSlug` into session |
| `src/lib/auth/unwrap-api-user.ts` | Extract `church.slug` / `churchSlug` from `/auth/me` |
| `src/lib/mock-user.ts` | Demo tenant: Alpha Grace Church + `alpha-grace-church` slug |
| `src/hooks/use-display-identity.ts` | Extended with tenant branding fields and label formatters |
| `src/components/shared/tenant-logo.tsx` | **New** — church logo with platform fallback + initials |
| `src/components/dashboard/layout/topbar.tsx` | Tenant name, workspace label, `TenantLogo` |
| `src/components/dashboard/layout/sidebar.tsx` | Tenant header + welcome footer labels |
| `src/components/dashboard/layout/user-menu.tsx` | Receives `workspaceName` from parent |
| `src/components/dashboard/shared/dashboard-home.tsx` | Welcome description includes church name |
| `src/components/admin/layout/admin-sidebar.tsx` | `TenantLogo` + `tenantDisplayName` |
| `src/components/admin/layout/admin-topbar.tsx` | Church-prefixed leadership title and context |

---

## Branding locations fixed

### Dynamic church identity

- **Name:** `useDisplayIdentity().churchName` / `tenantDisplayName`
- **Slug:** `useDisplayIdentity().churchSlug` (session + member profile)
- **Source:** `/auth/me` → `church.name`, `church.slug`, `church.logo` / `logoUrl`; member profile enrichment when linked

### Dynamic logo

- `TenantLogo` uses `church.logo` when available
- Fallback: `/images/branding/shepherdos-logo.png` (platform default)
- Second fallback: church initials or generic church icon

### Workspace labels

| Helper | Example output |
|--------|----------------|
| `formatWorkspaceName()` | `Alpha Grace Church Workspace` |
| `formatPageWorkspaceLabel("Dashboard")` | `Dashboard · Alpha Grace Church Workspace` |
| `formatMemberWorkspaceLabel()` | `Alpha Grace Church member` |
| `formatWelcomeDescription()` | `Alpha Grace Church · Your member dashboard…` |
| `formatLeadershipContextLine()` | `Alpha Grace Church · Jane Doe · Structured oversight…` |

### Welcome areas

- Dashboard: `Welcome back, {firstName}` + church name in description
- Sidebar footer: `Welcome, {name}` + `{church} member`

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run build` | **Pass** — TypeScript clean, 45 routes |
| Linter | No new issues on changed files |

### Manual verification

| Surface | Expected |
|---------|----------|
| Demo dashboard topbar | `Alpha Grace Church` + `Dashboard · Alpha Grace Church Workspace` |
| Demo sidebar | Alpha Grace Church header + welcome footer |
| Live sign-in | Church name/logo from `/auth/me` when API returns them |
| No church data | Falls back to `FaithBaseOS` / platform logo |
| Admin console | Church name in sidebar and topbar |

**Screenshots:** Not captured in this build session (no browser automation). Verify visually after deploy or local `npm run dev`.

---

## Remaining branding gaps

| Gap | Notes |
|-----|-------|
| Auth/login marketing copy | Still FaithBaseOS platform voice (intentional for SaaS sign-in) |
| Page-level copy | Some pages still say “ShepherdOS” in receipts, profile description, admin settings |
| Email/PDF templates | Receipt header “ShepherdOS Giving Receipt” not tenant-branded |
| Favicon / browser tab | Still platform metadata in root `layout.tsx` |
| Per-tenant theme colors | Not in API contract; accent remains global |
| Church tagline | Not surfaced in workspace chrome yet |
| Mobile sidebar | Same tenant header as desktop (no separate mobile brand strip) |
| Dynamic logo CDN failures | Falls back to initials/platform icon; no retry |

---

## Recommended next phase

1. Tenant-brand receipt and statement headers (`{church.name} Giving Receipt`)
2. Optional `church.tagline` in sidebar/topbar when API provides it
3. Tenant favicon/title via `document.title` hook per route
4. White-label login when church slug is known pre-auth (subdomain/slug route)
5. Theme tokens from church branding settings when backend supports them
