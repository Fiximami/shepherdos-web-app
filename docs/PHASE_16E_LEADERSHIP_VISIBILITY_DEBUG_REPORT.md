# Phase 16E — Leadership Console Visibility Debug

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Debug and fix live Leadership Console visibility in the member topbar

---

## Summary

Leadership Console remained hidden after Phase 16B because `/auth/me` responses were consumed without unwrapping nested user payloads. Role and permission fields on wrapped objects never reached `mapApiUserToSession`, so the session stayed `member` with empty permissions.

Added robust `/auth/me` unwrapping, a dedicated `useLeadershipAccess` hook, alpha debug surfaces, and removed CSS that hid the button below the `md` breakpoint.

**Build:** `npm run build` — **passed** (exit 0)

---

## Root cause

| Finding | Detail |
|---------|--------|
| **Primary** | `fetchCurrentUser()` cast the raw JSON body to `ApiUser` without unwrapping `{ data: { ... } }` or `{ user: { ... } }` shapes |
| **Effect** | `roles[]`, `role`, and `permissions[]` were undefined → session mapped as `member` with `permissions: []` |
| **Secondary** | Leadership button used `hidden md:inline-flex` — invisible below 768px width even when access was granted |
| **Tertiary** | `useCurrentUser()` returned empty member during `authStatus: loading`, which could briefly hide the button (expected until session resolves) |

Phase 16B role logic was correct; the session never received backend role data.

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/auth/unwrap-api-user.ts` | **New** — unwrap nested `/auth/me` payloads; normalize roles/permissions from multiple field names |
| `src/lib/api/auth.ts` | `fetchCurrentUser()` uses `unwrapApiUserResponse` |
| `src/hooks/use-leadership-access.ts` | **New** — `showLeadershipConsole` gated on `status !== "loading"` |
| `src/hooks/use-current-user.ts` | Added `useSessionUserOrNull()` |
| `src/components/shared/leadership-access-debug.tsx` | **New** — alpha debug card |
| `src/components/dashboard/layout/topbar.tsx` | Uses `useLeadershipAccess`; debug strip; button visible from `sm` |
| `src/components/dashboard/layout/user-menu.tsx` | Leadership link + debug card; uses shared debug component |

---

## Inspection checklist

| Check | Result after fix |
|-------|------------------|
| `roles[]` from `/auth/me` stored in session | Yes — via `unwrapApiUserResponse` → `mapApiUserToSession` |
| `role` normalized to `super_admin` | Yes — `normalizeRole("SUPER_ADMIN")` → `super_admin` |
| `permissions[]` includes `leadership.access` | Yes — preserved from API; case-normalized |
| `canAccessLeadershipConsole(user)` returns true for SUPER_ADMIN | Yes |
| Topbar receives `showLeadershipConsole=true` | Yes when session ready and access granted |
| Hidden by layout/CSS | **Was** — `hidden md:inline-flex` removed; button now `sm:inline-flex` |
| Hidden by alpha/route config | No — alpha mode does not gate Leadership Console button |
| Stale session | No — `AuthProvider` refreshes on mount; sidebar memo fixed in 16B |

---

## `/auth/me` unwrapping

`unwrapApiUserResponse` now handles:

- Top-level user object
- `{ data: user }`, `{ user }`, `{ data: { user } }`, `{ result: { user } }`
- Role sources: `role`, `roles`, `tenantRoles`, `tenantRole`, `userRoles`, `authorities`
- Role values as strings or objects (`{ name, slug, code }`)
- Permission sources: `permissions`, `permissionKeys`, `scopes`, `grants` (strings or objects)

---

## Alpha debug panel

Visible when `NEXT_PUBLIC_ALPHA_MODE=true` (defaults to true if unset).

**Topbar** — amber debug strip below the main row showing:

- `authStatus`
- `role`
- `roles[]`
- `permissions` count
- `has leadership.access`
- `canAccessLeadershipConsole`
- `showLeadershipConsole`

**User menu** — same debug block inside the dropdown.

Use this to confirm live session shape after sign-in without opening devtools.

---

## Access flow (after fix)

```
GET /auth/me
  → unwrapApiUserResponse()
  → mapApiUserToSession()
  → AuthProvider.user + session-store
  → useLeadershipAccess()
  → showLeadershipConsole
  → Topbar button + User menu link
```

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run build` | **Pass** — TypeScript clean, 45 routes |
| Linter | No new issues on changed files |

### Logic verification

| Input shape | Mapped `role` | `canAccessLeadershipConsole` |
|-------------|---------------|------------------------------|
| `{ roles: ["SUPER_ADMIN"] }` | `super_admin` | `true` |
| `{ data: { roles: ["SUPER_ADMIN"] } }` | `super_admin` | `true` |
| `{ user: { role: "church_admin" } }` | `church_admin` | `true` |
| `{ permissions: ["leadership.access"] }` | `member` (no role) | `true` |
| `{ role: "member" }` | `member` | `false` |
| Unwrapped empty `{}` | `member` | `false` |

### Manual test checklist

| Test | Expected |
|------|----------|
| Sign in as `alphaadmin1@test.com` with backend `SUPER_ADMIN` | Debug shows `super_admin`; button visible; `/admin` opens |
| Member account | Debug shows `member`; no button; `/admin` redirects |
| Viewport &lt; 768px | Button shows as “Admin” (sm+) or via user menu link |
| Alpha debug | Strip visible in topbar + user menu |

---

## Remaining gaps

| Gap | Notes |
|-----|-------|
| Live login not run in CI | Manual sign-in required to validate production API shape |
| Debug panel in production alpha | Remove or gate before GA |
| Unknown backend field names | If API uses undocumented keys, extend `unwrap-api-user.ts` |
| Server-side RBAC | Client checks only; backend remains authoritative |
| Login response user | Login still only stores token; session always from `/auth/me` |

---

## Recommended next steps

1. Sign in live and confirm debug panel shows `roles: [super_admin]` for `alphaadmin1@test.com`
2. Capture actual `/auth/me` JSON from network tab and add to backend contract doc
3. Remove alpha debug strip after pilot validation
4. Add unit tests for `unwrapApiUserResponse` with fixture payloads
