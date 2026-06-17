# FaithBaseOS — Controlled Beta Readiness Report

**Project:** shepherdos-web-app  
**Phase:** 14E — Controlled Beta Readiness Audit  
**Date:** June 2026  
**Deployment target:** `app.faithbaseos.com`  
**API:** `https://shepherdos-api.onrender.com`  
**Audit type:** Read-only code review (no changes made)

---

## Executive summary

| Verdict | Detail |
|---------|--------|
| **Controlled beta** | **Approved with scope limits** |
| **Overall score** | **58 / 100** |
| **Member portal** | Read-focused beta for linked accounts |
| **Leadership Console** | Read-focused beta for six admin modules |
| **Not in beta scope** | Events, Prayer, Counselling, password reset, member writes |

FaithBaseOS is suitable for a **church pilot** when positioned as a **read-only member experience** plus **leadership oversight dashboards** — not as a full church operations platform.

---

## Readiness legend

| Status | Meaning |
|--------|---------|
| **READY** | Live API wired; core user journey works end-to-end for beta |
| **PARTIAL** | Some live data or UI; gaps, preview areas, or backend dependency |
| **BLOCKED** | Not alpha-visible, no API, or non-functional for beta users |

---

## Feature classification matrix

| Feature / module | Status | Alpha visible | Live API | Write actions | Primary blocker |
|------------------|--------|---------------|----------|---------------|-----------------|
| **Authentication — Login** | PARTIAL | Yes | `POST /auth/login` | Login only | No refresh token; client-only guards |
| **Authentication — Session** | PARTIAL | Yes | `GET /auth/me` | — | Permissions filtered; 401 = hard logout |
| **Authentication — Logout** | PARTIAL | Yes | — | Client clear | No server invalidation |
| **Authentication — Password reset** | BLOCKED | No* | — | — | Mock UI; flag off; no API |
| **Authentication — Demo mode** | PARTIAL | Dev only | — | — | Must be `false` in production |
| **RBAC — Leadership access** | PARTIAL | Yes | Via `/auth/me` | — | Backend role/permission contract |
| **RBAC — Granular permissions** | PARTIAL | Yes | Via `/auth/me` | — | Unknown perms silently dropped |
| **RBAC — Route enforcement** | PARTIAL | Yes | — | — | Client-side only; no middleware |
| **Leadership Console — Entry** | PARTIAL | Yes | — | — | Requires leadership role or `leadership.access` |
| **Leadership Console — Overview** | PARTIAL | Yes | `/members/summary`, `/attendance/summary`, `/finance/summary` | — | Care queues / insights are preview |
| **Leadership Console — Members** | PARTIAL | Yes | `GET /members`, `/members/summary` | — | Create/edit/import are placeholders |
| **Leadership Console — Attendance** | PARTIAL | Yes | `/attendance/summary`, `/sessions`, `/records` | — | Charts, absentee lists are preview |
| **Leadership Console — Finance** | PARTIAL | Yes | `/finance/summary`, `/transactions`, `/audit-logs` | — | Approvals, budgets, exports are preview |
| **Leadership Console — Giving** | PARTIAL | Yes | `/giving/*` (finance fallback) | — | Pledges, receipt templates preview |
| **Leadership Console — Settings** | PARTIAL | Yes | `GET /settings`, `/settings/church`, `/settings/profile` | — | Branding, roles, toggles are preview |
| **Leadership Console — Other 13 modules** | BLOCKED | No | — | — | Static mock; hidden in alpha |
| **Member Portal — Navigation** | READY | Yes | — | — | Five routes; finance redirects to giving |
| **Member Portal — Dashboard** | PARTIAL | Yes | `/members/me`, `/attendance/me`, `/giving/me` | — | Events, prayer, feed widgets are preview |
| **Member Portal — Profile** | PARTIAL | Yes | `GET /members/me` | — | Read-only; ministry/skills are preview |
| **Member Portal — Unlinked state** | PARTIAL | Yes | `/me` endpoints | — | Notice shown; no self-link workflow |
| **Attendance — View history** | PARTIAL | Yes | `GET /attendance/me` | — | Read-only |
| **Attendance — Check-in** | BLOCKED | No | — | — | Only on hidden `/events` (localStorage) |
| **Attendance — Leader actions** | BLOCKED | Yes (UI) | — | — | Buttons present but unwired |
| **Giving — View history** | PARTIAL | Yes | `GET /giving/me` | — | Requires linked member |
| **Giving — Submit / pay** | BLOCKED | Yes (UI) | — | — | Local preview only; no POST |
| **Giving — Receipts / statements** | BLOCKED | Yes (UI) | — | — | Mock PDF feedback strings |
| **Giving — Pledges** | BLOCKED | Yes (UI) | — | — | Preview badge; static data |
| **Settings — View identity** | PARTIAL | Yes | `GET /members/me` | — | Read-only from profile hook |
| **Settings — Save preferences** | BLOCKED | Yes (UI) | — | — | Local React state; lost on refresh |
| **Settings — Password / security** | BLOCKED | Yes (UI) | — | — | Placeholder section |
| **Events** | BLOCKED | No | — | — | Mock data; alpha-hidden |
| **Prayer** | BLOCKED | No | — | — | Mock data; alpha-hidden |
| **Counselling** | BLOCKED | No | — | — | Mock data; alpha-hidden |

\* Forgot/reset password routes exist but are gated off when `NEXT_PUBLIC_ENABLE_PASSWORD_RESET=false`.

---

## Detailed findings

### 1. Authentication — PARTIAL

**What works (READY path):**
- Email + password login via `POST /auth/login` with church slug
- Bearer token stored in `localStorage`; session bootstrap via `GET /auth/me`
- Protected member and admin layouts redirect unauthenticated users to `/login`
- 401 responses clear token and sign out
- Demo mode disabled in production config (`NEXT_PUBLIC_ENABLE_DEMO_MODE=false`)

**Gaps:**
- No refresh token — session ends on token expiry or 401
- No Next.js middleware — routes briefly reachable before client redirect
- Token in `localStorage` (XSS-sensitive)
- Logout is client-only (no `POST /auth/logout`)
- Password reset forms are stubs with no backend wiring

**Beta requirement:** Valid pilot accounts on API; CORS allows `app.faithbaseos.com`; church slug matches `NEXT_PUBLIC_CHURCH_SLUG`.

---

### 2. RBAC — PARTIAL

**What works:**
- Unified `canAccessLeadershipConsole()` in `src/lib/auth/leadership-access.ts`
- Supports `leadership.access` permission and leadership role slugs (`super_admin`, `admin`, `church_admin`, `pastor`, etc.)
- Role normalization on login (lowercase, underscore slugs)
- Leadership button, `/admin` layout, `AdminRouteGuard`, and `AdminSidebar` use the same helper
- Per-route admin guards for finance, members, counselling, follow-ups, communication

**Gaps:**
- Enforcement is **client-side only**
- Permissions from API must match `availablePermissions` in `mock-user.ts` or they are dropped
- Member with finance permissions but `member` role cannot access Leadership Console (by design)
- Demo user lacks several granular permissions (counselling, communication, follow-ups)

**Beta requirement:** Admin test accounts must return correct `role` and/or `leadership.access` plus module permissions from `/auth/me`.

---

### 3. Leadership Console — PARTIAL

**Alpha-visible modules (6):**

| Module | Live reads | Preview / blocked writes |
|--------|------------|--------------------------|
| Overview | Member, attendance, finance summaries | Shepherd insights, care queues |
| Members | List + summary | Create, edit, import |
| Attendance | Summary, sessions, records | Department charts, trust scores |
| Finance | Summary, transactions, audit logs | Approvals, budgets, PDF export |
| Giving | Summary, records (finance fallback) | Pledge management, receipt templates |
| Settings | Church + profile settings GET | Logo upload, role matrix, toggles |

**Blocked in alpha:** Departments, Communication, Events, Community, Prayer Requests, Counselling, Follow-ups, Inventory, Celebrations, Notifications, Messages, Analytics, Reports — all static mock UIs.

**No admin write endpoints** (POST/PUT/PATCH/DELETE) are wired in the frontend.

---

### 4. Member Portal — PARTIAL

**READY elements:**
- Five-route alpha navigation (Dashboard, Profile, Attendance, Giving, Settings)
- Route guard and sidebar aligned with `alpha-routes.ts`
- `/finance` redirects to `/giving`
- Preview badges on non-live sections (profile ministry/skills, settings toggles, pledge tracking)
- `MemberLinkedNotice` when `/me` returns `linked: false`

**PARTIAL elements:**
- Dashboard live summaries when member is linked
- Profile identity fields from `/members/me`
- API connection notices on each page

**Not beta-ready:**
- Dashboard preview widgets (events, prayer, celebrations, feed, notifications)
- Profile edit, ministry/skills data
- Any member write workflow

---

### 5. Attendance — PARTIAL

**READY for beta (read path):** Personal summary cards and session history from `GET /attendance/me` when linked.

**BLOCKED:**
- Member check-in (exists only on alpha-hidden `/events` via `localStorage`)
- "Record Attendance" and "Create Service Session" header buttons (no handlers)
- Attendance insights section (preview mock)
- Row "View" action (no handler)

---

### 6. Giving — PARTIAL

**READY for beta (read path):** Giving history and summary from `GET /giving/me` when linked.

**BLOCKED:**
- "Give now" / payment submit (local state only; no `POST`)
- Receipt download and annual statement (mock feedback)
- Pledge tracking (preview badge + static rows)

**Product alignment:** Member money surface is correctly scoped to `/giving` only; `/finance` is not member-facing.

---

### 7. Settings — PARTIAL

**READY for beta (read path):** Display name, email, phone, branch from `/members/me`.

**BLOCKED:**
- All preference toggles (account, notifications, privacy) — local state, not persisted
- Security section (password change, sessions)
- Member page does not call `GET /settings/profile` (admin settings page does)

---

### 8. Events — BLOCKED

- Route hidden in production alpha (`/events` → `/dashboard`)
- All data is hardcoded mock (`events-page-view.tsx`)
- Smart check-in uses geolocation + `localStorage` — not synced to `/attendance/me`
- No events API module in `src/lib/api`
- Not suitable for church pilot under current alpha policy

---

### 9. Prayer — BLOCKED

- Route hidden in production alpha
- Submissions append to local React state only
- No prayer API
- Dashboard prayer widget is preview-only
- Not suitable for church pilot under current alpha policy

---

### 10. Counselling — BLOCKED

- Route hidden in production alpha (member and admin counselling)
- Booking form stores local mock rows only
- No counselling API
- Copy explicitly states mock data and no leader notification
- Not suitable for church pilot under current alpha policy

---

## Environment prerequisites

Production beta requires these Vercel variables (see `docs/VERCEL_PRODUCTION.md`):

```env
NEXT_PUBLIC_API_BASE_URL=https://shepherdos-api.onrender.com
NEXT_PUBLIC_CHURCH_SLUG=alpha-grace-church
NEXT_PUBLIC_ALPHA_MODE=true
NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=false
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
NEXT_PUBLIC_ENABLE_PASSWORD_RESET=false
```

Render API CORS must include `https://app.faithbaseos.com`.

---

## Backend dependencies (critical path)

| Dependency | Impact if missing |
|------------|-------------------|
| `POST /auth/login` + `GET /auth/me` | No access |
| `/auth/me` returns leadership `role` or `leadership.access` | Admin users blocked from Leadership Console |
| `/auth/me` returns granular permissions | Admin nav modules hidden |
| `GET /members/me` with `linked: true` | Member pages show empty/placeholder data |
| `GET /attendance/me`, `GET /giving/me` | Attendance and giving pages empty |
| Church-wide admin GET endpoints | Leadership dashboards empty |

---

## Beta scope statement (for stakeholders)

### In scope — safe to pilot

- Member login and session
- View personal profile, attendance history, giving history (linked members)
- Leadership Console read-only oversight (six modules)
- Alpha route gating and preview labeling

### Out of scope — do not promise

- Online giving / payments
- Receipt PDFs
- Settings persistence
- Profile editing
- Member check-in
- Events, prayer requests, counselling
- Password reset
- Admin create/update/approve workflows
- Hidden admin modules (communication, analytics, etc.)

---

## Risk register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Unlinked member accounts | High | Pre-link pilot users in backend; document notice |
| Admin role not recognized | High | Verify `/auth/me` payload before pilot |
| Users expect live giving | High | Train pilot church; preview labels on give form |
| Non-functional attendance buttons | Medium | Brief leaders; fix in Phase 14B |
| Client-only RBAC | Medium | Accept for controlled pilot; document URL direct-access limit |
| API cold start (Render) | Low | Warm API before demos; show loading states |

---

## Recommended phases after beta

| Phase | Focus |
|-------|-------|
| 14F | Wire settings preferences; remove misleading attendance buttons |
| 15A | Giving POST + receipt generation |
| 15B | Member profile update API |
| 15C | Events + check-in API; promote route to alpha |
| 15D | Prayer + counselling APIs; promote routes |
| 16 | Admin write endpoints (members, finance approvals) |

---

## Overall beta verdict

**Proceed with a controlled church pilot** limited to:

1. **Members** — view dashboard, profile, attendance, giving history  
2. **Leaders** — view Leadership Console summaries and lists (six modules)  
3. **Explicit exclusions** — events, prayer, counselling, payments, settings saves  

Score **58/100** reflects a solid read-only foundation with clear product boundaries and honest preview labeling — not full operational readiness.
