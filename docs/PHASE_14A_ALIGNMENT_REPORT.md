# Phase 14A — Product & RBAC Alignment Report

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Frontend-only alignment with backend RBAC model and alpha product rules.

---

## Summary

Phase 14A unifies Leadership Console access behind a single helper, removes member-facing Finance from navigation and routing, and adds preview badges to non-live member UI surfaces.

---

## 1. Leadership Console Visibility Rules

Access is granted when **either** condition is true:

1. **`leadership.access` permission** is present in the session user's `permissions[]` array.
2. **Normalized role** matches a leadership role slug.

### Role normalization

All roles from `/auth/me` are normalized before comparison:

- Trimmed
- Lowercased
- Spaces replaced with underscores (e.g. `Church Admin` → `church_admin`, `SUPER_ADMIN` → `super_admin`)

### Leadership roles (normalized slugs)

| Role slug | Notes |
|-----------|-------|
| `super_admin` | Backend `SUPER_ADMIN` |
| `admin` | Backend `ADMIN` |
| `church_admin` | Church Admin |
| `church_owner` | Church owner |
| `owner` | Owner alias |
| `pastor` | Pastor |
| `elder` | Elder |
| `finance_officer` | Finance officer |
| `finance` | Finance role alias |
| `leader` | General leader |
| `ministry_leader` | Ministry leader |

### Helper

**File:** `src/lib/auth/leadership-access.ts`

```typescript
canAccessLeadershipConsole({ role, permissions })
```

**Session wrapper:** `canAccessLeadershipConsoleFromSession()` in `src/lib/permissions.ts`

### Where the helper is used

| Surface | Behavior |
|---------|----------|
| Member topbar — Leadership Console button | Shown when `canAccessLeadershipConsole()` is true |
| `ProtectedRoute requireLeadership` | Blocks `/admin` layout when false |
| `AdminRouteGuard` | Redirects to `/dashboard` when false |
| `AdminSidebar` | Hides all admin nav when false |

### Per-route admin permissions (unchanged)

Granular permission checks still apply inside the Leadership Console:

| Route prefix | Required any |
|--------------|--------------|
| `/admin/finance` | `finance:record`, `finance:approve` |
| `/admin/members` | `members:create`, `members:update` |
| `/admin/counselling` | `counselling:view`, `counselling:manage` |
| `/admin/follow-ups` | `followups:assign` |
| `/admin/communication` | `announcements:create`, `messages:send` |

---

## 2. RBAC Matrix

| User example | `leadership.access` | Role | Button | `/admin` layout | Finance nav |
|--------------|---------------------|------|--------|-----------------|-------------|
| Member | — | `member` | Hidden | Blocked | Hidden |
| Member + finance perms only | — | `member` | Hidden | Blocked | Hidden |
| Church admin | — | `church_admin` | Visible | Allowed | If finance perms |
| Super admin | — | `super_admin` | Visible | Allowed | If finance perms |
| Any role | `leadership.access` | any | Visible | Allowed | If finance perms |
| Pastor | — | `pastor` | Visible | Allowed | If finance perms |

**Note:** Leadership Console entry is now **role- or flag-based**. Module-level nav still requires granular permissions.

---

## 3. Removed Routes & Navigation Changes

### Member portal — removed

| Item | Change |
|------|--------|
| `/finance` sidebar link | **Removed** |
| `/finance` in `memberAlphaPaths` | **Removed** |
| `/finance` direct access | **Redirects to `/giving`** (page redirect + alpha guard) |
| Quick Actions → member `/finance` | **Removed** — `Record Transaction` → `/admin/finance`, `Review Giving` → `/admin/giving` |

### Member portal — alpha navigation (5 modules)

1. Dashboard (`/dashboard`) — Beta
2. Profile (`/profile`) — Beta
3. Attendance (`/attendance`)
4. Giving (`/giving`)
5. Settings (`/settings`) — Beta

### Unchanged

| Route | Status |
|-------|--------|
| `/admin/finance` | Leadership church-wide finance — **unchanged** |
| `fetchMyFinance()` / `finance-page-view.tsx` | Code retained but member route no longer renders the view |

---

## 4. Preview Labels Added

| Location | Badge |
|----------|-------|
| Profile → Ministry involvement | Preview |
| Profile → Skills and interests | Preview |
| Settings → Account preferences (toggles) | Preview |
| Settings → Notification preferences | Preview |
| Settings → Privacy settings | Preview |
| Giving → Pledge tracking | Preview |

Existing `PreviewSectionNotice` on pledge tracking was retained.

---

## 5. Remaining Preview Features

### Member portal (alpha-visible)

| Module | Preview / non-live areas |
|--------|--------------------------|
| Dashboard | Events, prayer summary, celebrations, community feed, notifications |
| Profile | Ministry involvement, skills and interests |
| Attendance | Attendance insights section; leader action buttons (non-functional) |
| Giving | Give now form, receipt download, annual statement, pledge tracking |
| Settings | All preference toggles (local state only) |

### Member portal (hidden in alpha)

Feed, events, prayer requests, counselling, store, celebrations page, notifications page, messages, members, communication, analytics, engagement — redirect to dashboard when `ALPHA_MODE=true`.

### Leadership Console (alpha-visible)

| Module | Preview areas |
|--------|---------------|
| Overview | Partial live summaries |
| Members | Create/edit placeholders |
| Attendance | Local check-in merge |
| Finance | Approval workflows, many form panels |
| Giving | Fallback from finance endpoints |
| Settings | Partial live church/profile fields |

### Leadership Console (hidden in alpha)

Departments, communication, events, community, prayer requests, counselling, follow-ups, inventory, celebrations, notifications, messages, analytics, reports.

---

## 6. Files Changed

| File | Change |
|------|--------|
| `src/lib/auth/leadership-access.ts` | **New** — RBAC helper |
| `src/lib/permissions.ts` | Session wrapper |
| `src/lib/auth/map-user.ts` | Role normalization on login |
| `src/lib/mock-user.ts` | `leadership.access` permission type |
| `src/lib/config/alpha-routes.ts` | Finance removed from member alpha; redirect to giving |
| `src/components/auth/protected-route.tsx` | Uses unified helper |
| `src/components/admin/layout/admin-route-guard.tsx` | Uses unified helper |
| `src/components/admin/layout/admin-sidebar.tsx` | Uses unified helper |
| `src/components/dashboard/layout/topbar.tsx` | Uses unified helper |
| `src/components/dashboard/layout/dashboard-shell.tsx` | Removed duplicate role set |
| `src/components/dashboard/layout/sidebar.tsx` | Finance nav removed |
| `src/components/dashboard/layout/quick-actions.tsx` | Finance links → admin routes |
| `src/app/(dashboard)/finance/page.tsx` | Redirect to `/giving` |
| `src/components/shared/route-availability-guard.tsx` | Finance → giving redirect |
| Profile, settings, giving views | Preview badges |

---

## 7. Backend Expectations (no changes made)

For Leadership Console to work in production:

1. `/auth/me` should return a **normalized role slug** (`church_admin`, `super_admin`, `pastor`, etc.) **or** include `leadership.access` in `permissions[]`.
2. Granular permissions (`finance:record`, `members:create`, etc.) remain required for module-level admin nav and route guards.
3. Member money data should be consumed via **`GET /giving/me`** only in the member portal.

---

## 8. Recommended Next Phase (14B)

1. Wire settings preference toggles to a member preferences API.
2. Remove or relabel non-functional leader buttons on member Attendance.
3. Consolidate giving trend charts from legacy finance view into `/giving` if product wants charts.
4. Add integration tests for `canAccessLeadershipConsole()` with backend role payloads.
5. Confirm backend documents canonical role slugs and `leadership.access` contract.
