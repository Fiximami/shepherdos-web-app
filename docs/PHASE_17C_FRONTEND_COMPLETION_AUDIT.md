# Phase 17C-B — Frontend Module & Route Completion Audit

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** 2026-06-19  
**Scope:** Audit only — no code changes  
**API base (configured):** `https://shepherdos-api.onrender.com` (`NEXT_PUBLIC_API_BASE_URL`)

---

## Executive Summary

| Area | Routes | Complete | Partial | Preview/Mock | Disconnected |
|------|--------|----------|---------|--------------|--------------|
| **Member portal** | 18 | 0 | 8 | 9 | 1 |
| **Leadership console** | 19 | 0 | 7 | 12 | 0 |
| **Auth** | 3 | 1 | 0 | 2 | 0 |
| **Total** | **40** | **1** | **15** | **23** | **1** |

**Alpha deployment** (`NEXT_PUBLIC_ALPHA_MODE=true`, default): only **8 member** and **7 admin** routes are directly reachable; **21 routes** are hidden behind `RouteAvailabilityGuard` unless `NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=true`.

**Beta readiness:** Core member journeys (profile, attendance, giving, prayer, counselling, settings) are **Needs Work** with live API reads/writes but significant mock UI. Leadership console has **7 partial** modules with read APIs; **12 admin modules** are UI-only mock. **23 modules** are **Blocked** or **Preview** for beta without backend + frontend completion.

---

## 1. Route Enumeration

### 1.1 Auth routes

| Route | Page | Component | Nav |
|-------|------|-----------|-----|
| `/` | `src/app/page.tsx` | redirect → `/login` | — |
| `/login` | `src/app/(auth)/login/page.tsx` | `LoginForm` | public |
| `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | `ForgotPasswordScreen` | login link (gated by `NEXT_PUBLIC_ENABLE_PASSWORD_RESET`) |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | `ResetPasswordScreen` | email link (gated) |

### 1.2 Member routes (`src/app/(dashboard)/`)

| Route | Page | Primary view |
|-------|------|--------------|
| `/dashboard` | `dashboard/page.tsx` | `DashboardHome` |
| `/profile` | `profile/page.tsx` | `ProfilePageView` |
| `/attendance` | `attendance/page.tsx` | `AttendancePageView` |
| `/giving` | `giving/page.tsx` | `MemberGivingPageView` |
| `/settings` | `settings/page.tsx` | `SettingsPageView` |
| `/prayer-requests` | `prayer-requests/page.tsx` | `PrayerRequestsPageView` |
| `/counselling` | `counselling/page.tsx` | `CounsellingPageView` |
| `/events` | `events/page.tsx` | `EventsPageView` |
| `/feed` | `feed/page.tsx` | inline + `CommunityFeed` |
| `/store` | `store/page.tsx` | `StorePageView` |
| `/celebrations` | `celebrations/page.tsx` | `CelebrationsPageView` |
| `/notifications` | `notifications/page.tsx` | `NotificationsPageView` |
| `/messages` | `messages/page.tsx` | `MessagesPageView` |
| `/members` | `members/page.tsx` | `MembersPageView` |
| `/finance` | `finance/page.tsx` | **redirect → `/giving`** (`FinancePageView` orphaned) |
| `/communication` | `communication/page.tsx` | `CommunicationPageView` |
| `/analytics` | `analytics/page.tsx` | `AnalyticsPageView` |
| `/engagement` | `engagement/page.tsx` | `EngagementPageView` |

### 1.3 Leadership / admin routes (`src/app/(admin)/admin/`)

| Route | Page |
|-------|------|
| `/admin` | `page.tsx` |
| `/admin/members` | `members/page.tsx` |
| `/admin/departments` | `departments/page.tsx` |
| `/admin/attendance` | `attendance/page.tsx` |
| `/admin/finance` | `finance/page.tsx` |
| `/admin/communication` | `communication/page.tsx` |
| `/admin/events` | `events/page.tsx` |
| `/admin/community` | `community/page.tsx` |
| `/admin/prayer-requests` | `prayer-requests/page.tsx` |
| `/admin/counselling` | `counselling/page.tsx` |
| `/admin/follow-ups` | `follow-ups/page.tsx` |
| `/admin/giving` | `giving/page.tsx` |
| `/admin/inventory` | `inventory/page.tsx` |
| `/admin/celebrations` | `celebrations/page.tsx` |
| `/admin/notifications` | `notifications/page.tsx` |
| `/admin/messages` | `messages/page.tsx` |
| `/admin/analytics` | `analytics/page.tsx` |
| `/admin/reports` | `reports/page.tsx` |
| `/admin/settings` | `settings/page.tsx` |

**Leadership entry:** member `Topbar` → `/admin` when `useLeadershipAccess().showLeadershipConsole` is true.

---

## 2. Per-Route Classification

**Legend:**  
- **Complete** — live API covers primary read/write flows  
- **Partial** — live API + mock sections, placeholder actions, or missing writes  
- **Preview** — UI exists; alpha-hidden or labeled preview; no/minimal API  
- **Mock** — hardcoded/local state only  
- **Disconnected** — route does not render intended module  

### 2.1 Member routes

| Route | Status | APIs used | Mock / preview signals |
|-------|--------|-----------|------------------------|
| `/dashboard` | **Partial** | `fetchMyAttendance`, `fetchMyGiving`, `fetchMyMemberProfile` | Demo widgets; mock events/prayer/celebrations/notifications; `PreviewSectionNotice` |
| `/profile` | **Partial** | `fetchMyMemberProfile`, `updateMyProfile` | `PreviewBadge` ministry/skills; security placeholder |
| `/attendance` | **Partial** | `fetchMyAttendance`, `checkInAttendance` | Demo sessions; mock insights; View button no-op |
| `/giving` | **Partial** | `fetchMyGiving`, statements, pledges, receipts, `createPledge`, `updatePledge` | Give/pay → local state only; demo receipts |
| `/settings` | **Partial** | `fetchMyMemberProfile`, `updateMyPreferences` | Privacy/language/security placeholders |
| `/prayer-requests` | **Partial** | `fetchMyPrayerRequests`, `submitPrayerRequest` | Demo mode → local list |
| `/counselling` | **Partial** | `fetchMyCounsellingRequests`, `submitCounsellingRequest` | Demo mode → local list |
| `/events` | **Partial** | `fetchMyEventRegistrations`, `registerForEvent` | Event catalog hardcoded; geo check-in → `localStorage` |
| `/feed` | **Mock** | — | `CommunityFeed` local posts/likes/comments |
| `/store` | **Mock** | — | `storeItems`, local orders, Paystack placeholder |
| `/celebrations` | **Mock** | — | Hardcoded sections |
| `/notifications` | **Mock** | — | `initialNotifications`; topbar dropdown also mock |
| `/messages` | **Mock** | — | `mockConversations`; no composer |
| `/members` | **Mock** | — (`fetchMembers` exists, unused) | Hardcoded `membersData`; Add/Export no-op |
| `/finance` | **Disconnected** | `fetchMyFinance` in orphaned view | Page redirects to `/giving` |
| `/communication` | **Mock** | — | Static announcements; header CTAs no handlers |
| `/analytics` | **Mock** | — | Hardcoded charts |
| `/engagement` | **Mock** | — | Hardcoded prayer/testimony/follow-up |

### 2.2 Admin routes

| Route | Status | APIs used | Mock / preview signals |
|-------|--------|-----------|------------------------|
| `/admin` | **Partial** | `fetchLeadershipDashboardSummary` | Care queue + insights static; `PreviewSectionNotice` |
| `/admin/members` | **Partial** | `fetchMembers`, `fetchMembersSummary` | Add/Import/Export no handlers; no create/update API calls |
| `/admin/attendance` | **Partial** | `fetchAttendanceSummary`, sessions, records | Smart rows preview; session CRUD → `setFeedback` |
| `/admin/finance` | **Partial** | `fetchFinanceSummary`, transactions, `fetchAuditLogs` | Budget/reports preview; `@/lib/mock-receipts`; CTAs disconnected |
| `/admin/giving` | **Partial** | `fetchGivingSummary`, `fetchGivingRecords` | Trend/pledges preview; export CTAs disconnected |
| `/admin/settings` | **Partial** | `fetchSettings`, church, profile | Read-only; save/category tiles → `setFeedback` |
| `/admin/departments` | **Mock** | — | Inline ministries/groups; all actions placeholder |
| `/admin/communication` | **Mock** | — | Inline announcements/logs |
| `/admin/events` | **Mock** | — | `allEvents` array; no admin events API in client |
| `/admin/community` | **Mock** | — | Mock moderation feed |
| `/admin/prayer-requests` | **Mock** | — | No admin prayer endpoints in client |
| `/admin/counselling` | **Mock** | — | No admin counselling endpoints in client |
| `/admin/follow-ups` | **Mock** | — | Inline queue |
| `/admin/inventory` | **Mock** | — | Local state only |
| `/admin/celebrations` | **Mock** | — | Inline calendar |
| `/admin/notifications` | **Mock** | — | Summary cards labeled mock |
| `/admin/messages` | **Mock** | — | Mock threads; reply disabled |
| `/admin/analytics` | **Mock** | — | Hardcoded series; no analytics API module |
| `/admin/reports` | **Mock** | — | Client-side CSV simulation |

### 2.3 Auth routes

| Route | Status | APIs | Notes |
|-------|--------|------|-------|
| `/login` | **Complete** | `POST /auth/login`, session via `GET /auth/me` | Demo mode optional (`NEXT_PUBLIC_ENABLE_DEMO_MODE`) |
| `/forgot-password` | **Preview** | — | Simulated delay; explicit “email not sent” preview copy |
| `/reset-password` | **Preview** | — | Simulated submit; “nothing saved on server” preview copy |

---

## 3. Cross-Cutting Findings

### 3.1 Routes using mock data (no API module)

**Member:** `/feed`, `/store`, `/celebrations`, `/notifications`, `/messages`, `/members`, `/communication`, `/analytics`, `/engagement`  
**Admin:** `/admin/departments`, `/communication`, `/events`, `/community`, `/prayer-requests`, `/counselling`, `/follow-ups`, `/inventory`, `/celebrations`, `/notifications`, `/messages`, `/analytics`, `/reports`

### 3.2 Preview labels (`PreviewBadge` / `PreviewSectionNotice`)

| Mechanism | Where |
|-----------|--------|
| **Sidebar `PreviewBadge`** | Alpha-hidden routes in member + admin sidebars (`alpha-routes.ts`) |
| **`PreviewSectionNotice`** | Dashboard home, profile ministry/skills, admin overview, members, attendance, giving, finance, settings |
| **Inline “Preview:” copy** | Forgot/reset password forms |
| **Settings `preview` prop** | Member settings privacy section |

### 3.3 Hidden routes (alpha mode, default)

**Member alpha-available (8):** dashboard, profile, attendance, giving, settings, prayer-requests, counselling, events  

**Member hidden → redirect dashboard (10):** finance*, feed, store, celebrations, notifications, messages, members, communication, analytics, engagement  
\*finance redirects to giving  

**Admin alpha-available (7):** `/admin`, members, attendance, finance, giving, settings  

**Admin hidden → redirect `/admin` (12):** departments, communication, events, community, prayer-requests, counselling, follow-ups, inventory, celebrations, notifications, messages, analytics, reports  

**Override:** `NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=true` or `NEXT_PUBLIC_ALPHA_MODE=false` exposes all routes.

### 3.4 Routes not linked in navigation

| Route | Linked from |
|-------|-------------|
| `/members` | `primaryNav` constant only — **not imported anywhere** |
| `/finance` | `primaryNav` only — page redirects |
| `/communication` | Quick actions only |
| `/analytics` | Not in sidebar |
| `/engagement` | Quick actions + dashboard feed “view all” |
| `/admin/reports` | Admin sidebar (hidden in alpha) |
| `/admin/departments`, `/community`, `/inventory`, etc. | Admin sidebar when preview routes enabled |

**Member sidebar (13 links):** dashboard, profile, attendance, giving, settings, feed, events, prayer-requests, counselling, store, celebrations, notifications, messages.

### 3.5 APIs in client but not fully wired in UI

| Endpoint module | Endpoints | Gap |
|-----------------|-----------|-----|
| `members.ts` | `GET /members` | Member `/members` page uses mock data |
| `finance.ts` | `GET /finance/me` | Member `/finance` redirects; `FinancePageView` unused |
| `events.ts` | registrations only | No event catalog/list endpoint in client |
| `pledges.ts` | member pledges | Not used on admin giving page |
| `audit-logs.ts` | audit APIs | Only finance admin panel |

### 3.6 Buttons without actions / forms without persistence

| Location | Issue |
|----------|--------|
| **Quick actions (topbar)** | Add Member, Approve Expense, Export Finance Report, Add First-Timer, Invite → `placeholderMessage` toast only |
| **Giving (member)** | Give / Make Payment → local `localHistory` |
| **Community feed** | Posts, likes, comments → React state |
| **Store** | Orders → local state |
| **Members (member)** | Add Member, Export → no handlers |
| **Communication (member)** | Create/Send/Schedule + 4 quick actions → no handlers |
| **Attendance (member)** | Table “View” → no `onClick` |
| **Admin members** | Add / Import / Export → no handlers |
| **Admin partial modules** | Dominant `setFeedback("…when connected")` pattern on CTAs |
| **Forgot / reset password** | Simulated success only |
| **Messages** | No send/reply UI |

**Live persistence today:** login; profile `PATCH /members/me`; preferences `PATCH /members/me/preferences`; prayer/counselling submit (live mode); attendance check-in; pledge create/update; event registration.

---

## 4. Frontend vs Backend Comparison

### 4.1 API inventory (`src/lib/api/`)

| Module | HTTP endpoints | Used by |
|--------|----------------|---------|
| `auth.ts` | `POST /auth/login`, `GET /auth/me` | Login, `AuthProvider` |
| `members.ts` | `GET/PATCH /members/me`, `PATCH /members/me/preferences`, `GET /members/summary`, `GET /members` | Profile, settings, admin members/overview |
| `attendance.ts` | `GET /attendance/me`, `POST /attendance/me/check-in`, `GET /attendance/summary`, `sessions`, `records` | Member + admin attendance |
| `giving.ts` | `GET /giving/me`, statements, receipt, `GET /giving/summary`, `records` (+ finance fallback on 404) | Member giving, admin giving |
| `pledges.ts` | `GET /pledges/me`, `POST /pledges`, `PATCH /pledges/:id` | Member giving |
| `finance.ts` | `GET /finance/me`, `summary`, `transactions` | Orphaned member finance view; admin finance |
| `prayer-requests.ts` | `GET /prayer-requests/me`, `POST /prayer-requests` | Member prayer only |
| `counselling.ts` | `GET /counselling/me`, `POST /counselling/request` | Member counselling only |
| `events.ts` | `GET /events/my-registrations`, `POST /events/:id/register` | Member events |
| `settings.ts` | `GET /settings`, `/settings/church`, `/settings/profile` | Admin settings (read) |
| `audit-logs.ts` | `GET /audit-logs`, `GET /audit-logs/:id`, export | Admin finance |
| `dashboard.ts` | Aggregates members + attendance + finance summaries | Admin overview |

**No client module for:** notifications, messages, feed/community, store, inventory, departments, follow-ups, celebrations, analytics, reports, password reset, admin events/prayer/counselling.

### 4.2 Frontend ahead of backend (UI exists; no API client)

Feed, store, celebrations, notifications, messages, member communication/analytics/engagement, admin departments/community/inventory/celebrations/notifications/messages/analytics/reports/follow-ups/communication, password reset flows (UI only).

### 4.3 Backend ahead of frontend (API client exists; UI mock or missing)

| Backend capability (client) | Frontend gap |
|----------------------------|--------------|
| `GET /members` (list) | Member `/members` mock; admin list partial (no writes) |
| `GET /finance/me` | Route disconnected (redirect) |
| Admin write endpoints (implied missing) | No PATCH/POST for settings, members CRUD, finance journal, attendance sessions |
| Member-scoped prayer/counselling | No admin list/assign APIs in client |
| Giving summary/records | Admin pledges/export not wired |

---

## 5. Completion Matrix

| Module | Frontend complete | Backend complete (client layer) | Gap | Beta readiness |
|--------|-------------------|----------------------------------|-----|----------------|
| **Auth — login** | Yes | Yes | Demo mode; no refresh token UX | **Ready** |
| **Auth — password reset** | Preview UI only | No client API | No `/auth/forgot-password` integration | **Blocked** |
| **Member profile** | Partial | Yes (`/members/me`) | Ministry/skills/security mock | **Needs Work** |
| **Member settings** | Partial | Yes (preferences) | Privacy/security placeholders | **Needs Work** |
| **Dashboard (member)** | Partial | Partial | Most widgets mock | **Needs Work** |
| **Attendance (member)** | Partial | Yes | Insights mock; view action dead | **Needs Work** |
| **Giving (member)** | Partial | Yes | Payment submit not persisted | **Needs Work** |
| **Prayer (member)** | Partial | Yes | No admin moderation UI | **Needs Work** |
| **Counselling (member)** | Partial | Yes | No admin workflow UI | **Needs Work** |
| **Events (member)** | Partial | Partial | Catalog not from API | **Needs Work** |
| **Finance (member)** | Disconnected | Yes (`/finance/me`) | Redirect orphans API view | **Blocked** |
| **Feed / community** | Mock | No | Full stack missing | **Blocked** |
| **Store** | Mock | No | Full stack missing | **Blocked** |
| **Notifications** | Mock | No | Full stack missing | **Blocked** |
| **Messages** | Mock | No | Full stack missing | **Blocked** |
| **Celebrations** | Mock | No | Full stack missing | **Blocked** |
| **Communication (member)** | Mock | No | Full stack missing | **Blocked** |
| **Analytics (member)** | Mock | No | Full stack missing | **Blocked** |
| **Engagement** | Mock | No | Full stack missing | **Blocked** |
| **Members (member view)** | Mock | Partial (`GET /members`) | Wrong data source | **Blocked** |
| **Admin overview** | Partial | Yes (summaries) | Static care/insights cards | **Needs Work** |
| **Admin members** | Partial | Partial (list/summary) | No CRUD writes | **Needs Work** |
| **Admin attendance** | Partial | Yes (read) | Session/record writes UI-only | **Needs Work** |
| **Admin finance** | Partial | Yes (read) | Journal/approve actions mock | **Needs Work** |
| **Admin giving** | Partial | Yes (read) | Export/pledges partial | **Needs Work** |
| **Admin settings** | Partial | Yes (read) | No save APIs called | **Needs Work** |
| **Admin departments** | Mock | No | Full stack missing | **Blocked** |
| **Admin communication** | Mock | No | Full stack missing | **Blocked** |
| **Admin events** | Mock | Partial (member regs only) | Admin event management missing | **Blocked** |
| **Admin community** | Mock | No | Full stack missing | **Blocked** |
| **Admin prayer** | Mock | Partial (member APIs) | Admin endpoints missing | **Blocked** |
| **Admin counselling** | Mock | Partial (member APIs) | Admin endpoints missing | **Blocked** |
| **Admin follow-ups** | Mock | No | Full stack missing | **Blocked** |
| **Admin inventory** | Mock | No | Full stack missing | **Blocked** |
| **Admin celebrations** | Mock | No | Full stack missing | **Blocked** |
| **Admin notifications** | Mock | No | Full stack missing | **Blocked** |
| **Admin messages** | Mock | No | Full stack missing | **Blocked** |
| **Admin analytics** | Mock | No | Full stack missing | **Blocked** |
| **Admin reports** | Mock | Partial (finance reads) | Report generation mock | **Blocked** |

**Counts:** Ready **1** · Needs Work **14** · Blocked **22**

---

## 6. Beta Readiness Classification

### Ready (ship with live API)

- **Login** (`/login`) — `POST /auth/login` + session bootstrap

### Needs Work (alpha-visible; usable with linked member profile)

| Module | Why not Ready |
|--------|----------------|
| Profile, settings | Mock sections; partial writes |
| Dashboard | Mostly decorative widgets |
| Attendance, giving, prayer, counselling, events | Core flows work when linked; gaps in payments, catalog, mock panels |
| Admin overview, members, attendance, finance, giving, settings | Read APIs connected; writes and many panels preview |

### Blocked (mock UI or no API path)

All **Mock** member routes (feed, store, messages, etc.), **finance redirect**, **password reset**, and **12 admin mock modules** (departments through reports except partial reads on finance/giving).

### Recommended beta surface (matches `alpha-routes.ts`)

**Member:** dashboard, profile, attendance, giving, settings, prayer-requests, counselling, events  

**Admin:** overview, members, attendance, finance, giving, settings  

Enable `NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=true` only for internal demos — not production beta.

---

## 7. Navigation & RBAC Notes

- **Leadership console access:** `leadership.access` permission or leadership roles (`leadership-access.ts`).
- **Admin sidebar filtering:** `canAccessAdminPath` + `requiredAny` permissions + alpha availability.
- **Role-path gaps:** departments, community, inventory, celebrations, messages, analytics not in standard admin/finance/leader path lists — effectively **super_admin** or preview mode only.
- **Dead code:** `primaryNav` / `accountNav` in `navigation.ts` unused; `AdminModulePage`, `AdminWorkspaceView`, `FinancePageView` (member) orphaned.

---

## 8. Build Verification

```bash
npm run build
```

| Check | Result |
|-------|--------|
| Compile | ✓ Success |
| TypeScript | ✓ Pass |
| Static pages | ✓ 45 routes generated |
| Exit code | 0 |

---

## 9. Prioritized Gap Backlog

1. **Payment persistence** — member giving submit → API  
2. **Event catalog API** — replace hardcoded `memberEvents`  
3. **Admin write paths** — members CRUD, settings save, attendance session create  
4. **Password reset** — wire forgot/reset to backend  
5. **Reconnect or remove `/finance`** — use `fetchMyFinance` or drop route  
6. **Notifications / messages / feed** — largest engagement gap  
7. **Admin prayer/counselling** — admin list/assign endpoints + UI  
8. **Remove or implement dead actions** — quick actions, communication CTAs, members export  
9. **Align alpha badges with reality** — several “Beta” routes still contain mock panels  

---

## 10. Audit Metadata

| Item | Value |
|------|--------|
| Pages audited | 40 route files + 3 auth |
| API modules | 21 files under `src/lib/api/` |
| Config | `alpha-routes.ts`, `product.ts` |
| Mock libraries | `@/lib/mock-user`, `@/lib/mock-receipts` |
| Backend modified | No (audit only) |
