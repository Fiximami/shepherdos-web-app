# Phase 16B — Frontend Leadership Console & Module Access Fix

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Fix Leadership Console visibility and admin module access for tenant RBAC

---

## Summary

Leadership Console visibility was failing for live SaaS users (e.g. `SUPER_ADMIN`) because the frontend only read a single `role` field and ignored `roles[]` from `/auth/me`. Admin sidebar navigation also used a stale `useMemo([])` that never re-evaluated after session hydration.

A single RBAC source of truth now drives console access, admin module visibility, route guards, and an alpha-only debug panel in the user menu.

**Build:** `npm run build` — **passed** (exit 0)

---

## Root cause

| Issue | Impact |
|-------|--------|
| **`roles[]` not mapped** | Backend tenant roles like `SUPER_ADMIN` in `roles[]` were dropped; `mapApiUserToSession` defaulted missing `role` to `member` |
| **Permissions over-filtered** | Unknown backend permission strings were stripped against a fixed allowlist before leadership checks |
| **Admin sidebar stale memo** | `useMemo(..., [])` in `admin-sidebar.tsx` evaluated access once at mount — often before session was ready |
| **No role-based module map** | Any leadership role saw the same admin nav items; finance/leader scopes were not enforced |
| **Member denial not explicit** | Pure `member` users could theoretically pass if session shape was ambiguous |

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/auth/leadership-access.ts` | Role normalization aliases, `getUserRoles`, `resolvePrimaryRole`, `isSuperAdmin`, expanded `canAccessLeadershipConsole` |
| `src/lib/auth/admin-module-access.ts` | **New** — role-based admin path access + permission overrides |
| `src/lib/auth/map-user.ts` | Map `roles[]`, resolve primary role, preserve all API permissions |
| `src/lib/api/types.ts` | `ApiUser.roles`, `SessionUser.roles`, `permissions: string[]` |
| `src/lib/permissions.ts` | Session helpers use full user object; `canAccessAdminPathFromSession` |
| `src/lib/auth/display-identity.ts` | Normalized role labels (`super_admin`, `elder`) |
| `src/lib/mock-user.ts` | Added `leadership.access` to demo permissions |
| `src/components/dashboard/layout/topbar.tsx` | Leadership check uses full `currentUser` |
| `src/components/dashboard/layout/user-menu.tsx` | Alpha debug panel (role, roles, permissions count, leadership flag) |
| `src/components/dashboard/layout/quick-actions.tsx` | Accept `string[]` permissions |
| `src/components/admin/layout/admin-sidebar.tsx` | Reactive nav filtering via `useCurrentUser` + module access |
| `src/components/admin/layout/admin-route-guard.tsx` | Path + role + permission guard using live session |

---

## Access rules (source of truth)

### `canAccessLeadershipConsole(user)`

Returns **true** when any of:

- `permissions` includes `leadership.access` (case-insensitive)
- `roles[]` or `role` includes a recognized leadership role after normalization

Returns **false** when:

- User is member-only (`roles` all `member`) and lacks `leadership.access`

### Recognized leadership roles (normalized)

`super_admin`, `admin`, `church_admin`, `church_owner`, `owner`, `pastor`, `elder`, `finance_officer`, `finance`, `leader`, `ministry_leader`

### Raw inputs supported

`SUPER_ADMIN`, `super_admin`, `ADMIN`, `admin`, `CHURCH_ADMIN`, `church_admin`, `Church Admin`, `PASTOR`, `pastor`, `LEADER`, `leader`, `FINANCE_OFFICER`, `finance_officer`, etc.

### Admin module visibility

| Role | Modules |
|------|---------|
| **SUPER_ADMIN** | All admin modules |
| **ADMIN / CHURCH_ADMIN / PASTOR / OWNER** | Core: overview, members, attendance, giving, events, communication, prayer, counselling, follow-ups, settings, notifications |
| **FINANCE_OFFICER** | Overview, finance, giving management, reports |
| **LEADER / ELDER / MINISTRY_LEADER** | Overview, attendance, members, events, follow-ups |
| **MEMBER** | No admin modules |

**Finance** (`/admin/finance`) is admin/finance-officer scoped — not member-facing.

**Giving** remains dual: member `/giving` + admin `/admin/giving`.

Permission overrides still apply (e.g. `finance:record` grants finance paths even when role mapping alone would not).

---

## Alpha debug panel

Visible in the **user menu dropdown** when `NEXT_PUBLIC_ALPHA_MODE=true`.

Shows:

- `role`
- `roles[]`
- `permissions` count
- `canAccessLeadershipConsole` true/false

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run build` | **Pass** — TypeScript clean, 45 routes |
| Linter | No new issues on changed files |

### Logic verification (unit-level)

| Scenario | `canAccessLeadershipConsole` | Notes |
|----------|-------------------------------|-------|
| `roles: ["SUPER_ADMIN"]`, no `role` | **true** | Primary bug fix |
| `role: "member"` only | **false** | Member portal only |
| `permissions: ["leadership.access"]` | **true** | Permission grant path |
| `role: "church_admin"` | **true** | Existing demo path |
| Demo `mockUser` (`church_admin`) | **true** | Unchanged preview behavior |

### Manual test checklist

| Test | Expected |
|------|----------|
| `alphaadmin1@test.com` with backend `SUPER_ADMIN` | Leadership Console button visible; `/admin` opens; debug panel shows `super_admin` |
| Member-only user | No Leadership Console button; `/admin` redirects to `/dashboard` |
| Finance officer | Finance + giving + reports modules; not full admin catalog |
| Leader | Attendance, members, events, follow-ups only |
| Member `/giving` | Still works independently of admin access |
| Alpha debug panel | Visible in user menu when alpha mode enabled |

*Live login against `alphaadmin1@test.com` was not executed in this build session (requires credentials). Behavior follows mapped `/auth/me` response shape above.*

---

## Remaining RBAC gaps

| Gap | Notes |
|-----|-------|
| Backend permission catalog sync | Frontend still defines known permissions in `mock-user.ts` for nav `requiredAny` checks |
| Per-tenant custom roles | Only documented SaaS roles are mapped; unknown roles need backend alignment |
| Fine-grained module ACL | No per-church module assignment UI; rules are frontend role presets |
| Admin preview routes | Alpha hidden admin routes still use `alpha-routes.ts` preview badges |
| Server-side enforcement | All checks are client-side; backend must remain authoritative |
| Multi-role conflict UI | Highest-priority role used for display; all roles considered for access |
| Audit logging | No client trace when access is denied |

---

## Recommended next phase

1. Align backend `/auth/me` contract docs with `role` + `roles[]` + `permissions[]` shape
2. Add integration test for `mapApiUserToSession` with SaaS fixture payloads
3. Wire admin nav `requiredAny` to backend permission names as they stabilize
4. Remove alpha debug panel before GA (or gate behind `NEXT_PUBLIC_SHOW_PREVIEW_ROUTES`)
5. Server middleware route protection for `/admin/*` when Next.js auth middleware is introduced
