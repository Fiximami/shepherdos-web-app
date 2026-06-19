# Phase 17B — Identity Consistency Audit Report

**Project:** shepherdos-web-app  
**Date:** 2026-06-13  
**Scope:** Frontend only (no backend changes)

## Objective

Ensure all user identity displays in the member and leadership shells originate from the same authenticated session source.

---

## Root Causes Found

### 1. Dual identity sources in `useDisplayIdentity`

`useDisplayIdentity` previously merged **session user** (`/auth/me` via `AuthProvider`) with **`/members/me` profile** overrides for `displayName`, `churchName`, `churchSlug`, `churchLogo`, and `email`. Shell chrome could show different names or church labels than the authenticated session.

### 2. Duplicate display-name logic in `useMemberProfileFields`

`useMemberProfileFields` independently resolved `displayName` from the member profile API when linked, then overwrote `sessionUser.name`. Profile header and shell could diverge for linked members.

### 3. Split hooks in topbar

`Topbar` called both `useCurrentUser()` (role, permissions) and `useDisplayIdentity()` (name, church, role label). `UserMenu` received identity via props but also called `useCurrentUser()` for debug, creating two derivation paths.

### 4. Inconsistent role labels

`resolveRoleLabel` preferred the API `roleLabel` string (e.g. "Church Admin") over normalized role slugs. Different surfaces showed "Church Admin", "Admin", or slug-based labels for the same user.

### 5. Demo flash during auth loading

When `!isLive`, the old `useDisplayIdentity` fell back to `getDemoSessionUser()` even while live auth was still loading, briefly showing demo identity to authenticated users.

### 6. Admin topbar fallback

`AdminTopbar` used `roleLabel || currentUser.roleLabel`, allowing stale session `roleLabel` to override the display hook.

---

## Canonical Identity Source (Implemented)

```
AuthProvider
  └─ mapApiUserToSession(unwrapApiUserResponse(/auth/me))
       └─ SessionUser
            └─ useSessionIdentity()          ← canonical hook
                 └─ deriveSessionIdentity()   ← pure session resolvers
                      └─ useDisplayIdentity() ← workspace label helpers only
```

### New files

| File | Purpose |
|------|---------|
| `src/lib/auth/session-identity.ts` | Session-only resolvers: `deriveSessionIdentity`, `resolvePublicRoleCode`, `resolveCanonicalRoleLabel` |
| `src/hooks/use-session-identity.ts` | Canonical React hook; resolves demo/empty/live session without profile API |

### Role resolution (four public buckets)

| `publicRoleCode` | Display label | Source roles |
|------------------|---------------|--------------|
| `SUPER_ADMIN` | Super Admin | `super_admin` |
| `ADMIN` | Admin | `admin`, `church_admin`, `church_owner`, `owner`, `pastor`, `finance_officer`, `finance` |
| `LEADER` | Leader | `leader`, `ministry_leader`, `elder` |
| `MEMBER` | Member | default |

`mapApiUserToSession` and `getDemoSessionUser` now set `roleLabel` via `resolveCanonicalRoleLabel` at mapping time.

### Church identity

`church.name` is resolved once in `mapApiUserToSession` via `resolveChurchName({ church, churchName })` and flows through `SessionUser.churchName` to all shell components.

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/auth/session-identity.ts` | **New** — canonical session identity derivation |
| `src/hooks/use-session-identity.ts` | **New** — canonical identity hook |
| `src/hooks/use-display-identity.ts` | Refactored to wrap `useSessionIdentity`; removed `/members/me` overrides |
| `src/hooks/use-current-user.ts` | Delegates to `useSessionIdentity().sessionUser` |
| `src/hooks/use-member-profile-fields.ts` | Profile API for member record fields only; name/church from session |
| `src/lib/auth/map-user.ts` | Canonical `roleLabel` at session mapping |
| `src/components/dashboard/layout/topbar.tsx` | Single `useDisplayIdentity()` source |
| `src/components/dashboard/layout/user-menu.tsx` | Self-contained identity from `useDisplayIdentity()` |
| `src/components/admin/layout/admin-topbar.tsx` | Single identity hook; removed `currentUser.roleLabel` fallback |
| `src/components/dashboard/profile/profile-page-view.tsx` | Header uses session `displayName`, `roleLabel`, `churchName`, `email` |

### Unchanged (already session-derived)

| File | Notes |
|------|-------|
| `src/components/dashboard/layout/sidebar.tsx` | Already used `useDisplayIdentity()` |
| `src/components/dashboard/layout/dashboard-shell.tsx` | Composes sidebar + topbar only |
| `src/providers/auth-provider.tsx` | Session source unchanged |
| `src/components/admin/layout/admin-sidebar.tsx` | Uses `useDisplayIdentity()` + `useCurrentUser()` for RBAC (permissions), not display overrides |

---

## Inconsistencies Fixed

| Surface | Before | After |
|---------|--------|-------|
| Topbar user name | Session or profile name | Session `displayName` |
| User menu name / role | Props from topbar + `resolveRoleLabel` API override | `useDisplayIdentity()` session fields |
| Sidebar welcome | Session (with profile override risk) | Session only |
| Admin topbar role badge | `roleLabel \|\| currentUser.roleLabel` | Canonical `roleLabel` |
| Profile header | Profile API name; member email | Session name, role, church, email |
| Demo during load | Demo user flash | Empty session user until auth resolves |
| Role label | "Church Admin" vs "Admin" | Consistent Admin / Leader / Member / Super Admin |

---

## Validation Matrix

All four surfaces now read from `useDisplayIdentity()` → `useSessionIdentity()` → `AuthProvider` session:

| Field | Topbar | Sidebar | User Menu | Profile |
|-------|--------|---------|-----------|---------|
| Display name | ✓ `displayName` | ✓ `displayName` / `firstName` | ✓ `displayName` | ✓ `displayName` |
| Role label | ✓ (via user menu) | — | ✓ `roleLabel` | ✓ `roleLabel` |
| Church name | ✓ `tenantDisplayName` / logo | ✓ `tenantDisplayName` | ✓ `workspaceName` | ✓ `churchName` |
| Email | — | — | — | ✓ `email` (session) |

Member-specific fields (branch, member ID, membership status) remain on the profile page via `useMemberProfileFields` and are intentionally separate from shell identity.

---

## Remaining Identity Gaps

1. **Member profile email vs session email** — Personal information section may show `/members/me` email when linked; header uses session email. Intentional separation until backend unifies account and member records.

2. **`resolveRoleLabel` in `display-identity.ts`** — Still exists for legacy/API mapping contexts but is no longer used for shell display. Consider deprecating in a future phase.

3. **`useDisplayIdentity` stub fields** — `isLinked: false` and `memberQuery: null` remain for backward compatibility; no consumers rely on them for shell identity.

4. **Community feed composer** — Uses `useDisplayIdentity().displayName` and `role` for post attribution; now session-derived (no gap, noted for completeness).

5. **Settings page admin section** — `admin/settings/page.tsx` still composes `useCurrentUser` + `useDisplayIdentity` separately; both resolve from the same session source.

6. **Unauthenticated placeholder** — `getEmptySessionUser()` shows name "Member" and role "Member" before login; not conflated with demo user.

---

## Build Verification

```bash
npm run build
```

**Result:** ✓ Passed (Next.js 16.2.4, TypeScript clean, 45 static routes generated)

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                    AuthProvider                          │
│  GET /auth/me → unwrapApiUserResponse → SessionUser     │
└────────────────────────┬────────────────────────────────┘
                         │
              useSessionIdentity()  ← CANONICAL
                         │
         ┌───────────────┼───────────────┐
         │               │               │
  useDisplayIdentity  useCurrentUser  useMemberProfileFields
  (shell + workspace)  (RBAC/session)  (member record only)
         │
    Topbar · Sidebar · UserMenu · Profile header · AdminTopbar
```

**Demo mode:** `getDemoSessionUser()` from `mockUser` is the only non-session fallback, gated by `isDemo` in `AuthProvider`.
