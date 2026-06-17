# Phase 15C — Prayer Request Workflow

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Connect member prayer requests to live backend APIs

---

## Summary

Members can submit prayer requests and view their request history from `/prayer-requests`. Live users use `POST /prayer-requests` and `GET /prayer-requests/me`. Demo mode retains the existing preview experience with local state and visibility controls.

**Build:** `npm run build` — **passed** (exit 0)

---

## API routes used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/prayer-requests/me` | Load member prayer request list |
| `POST` | `/prayer-requests` | Submit new prayer request (`title`, `content`) |

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/api/prayer-requests.ts` | **New** — `fetchMyPrayerRequests()`, `submitPrayerRequest()`, mappers |
| `src/lib/api/types.ts` | Added `ApiPrayerRequest`, `PrayerRequestCreate` |
| `src/lib/api/member-scope.ts` | Added `requests`, `prayerRequests` to list extraction |
| `src/lib/validations/prayer-request.ts` | **New** — Zod schema for title + content |
| `src/components/dashboard/prayer/prayer-requests-page-view.tsx` | Live API workflow, list states, demo split |
| `src/lib/config/alpha-routes.ts` | Added `/prayer-requests` to member alpha routes |

---

## Feature completion

### List requests

| Requirement | Status |
|-------------|--------|
| Load from `GET /prayer-requests/me` | Done |
| Display title | Done |
| Display status | Done |
| Display submitted date | Done (formatted) |
| Loading state | Done |
| Empty state | Done |
| Error state | Done |

### Submit request

| Requirement | Status |
|-------------|--------|
| `POST /prayer-requests` | Done |
| Fields: title, content | Done |
| Validation (Zod) | Done — title min 3, content min 10 |
| Loading state | Done — “Submitting…” |
| Success toast | Done — `FormToast` |
| Error toast | Done |
| Refresh list after success | Done — `prayerQuery.refetch()` |
| Clear form after success | Done |
| Confirmation message | Done |

### Linked member handling

| State | Behavior |
|-------|----------|
| `linked=false` (live) | Shows exact message; submit form hidden |
| `linked=true` (live) | Full submit + list workflow |
| Demo mode | Preview submit with visibility toggles; no API calls |

### Alpha visibility

`/prayer-requests` added to `memberAlphaPaths` so the workflow is reachable in production alpha (removed from `hiddenMemberPaths`).

---

## UX behavior

| Mode | Submit | List | Visibility controls |
|------|--------|------|---------------------|
| Demo | Local state | Demo seed data + new submissions | Yes (preview) |
| Live + linked | API POST | API GET | No (API uses title/content only) |
| Live + unlinked | Hidden | Empty / link message | Hidden |

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run build` | **Pass** — 45 routes, TypeScript clean |
| Linter | No new issues on changed files |

### Manual test checklist (recommended)

| Test | Expected |
|------|----------|
| Linked member submits request | Success toast; form clears; list refreshes |
| Invalid short title/content | Inline validation errors |
| Unlinked member | Notice shown; no submit form |
| Demo mode | Local submit; visibility toggles work; no network |
| Empty list | “No prayer requests yet.” |
| API error on submit | Error toast; form retained |

---

## Remaining prayer gaps

| Gap | Notes |
|-----|-------|
| Visibility / audience selection (live) | Not in API contract for this phase |
| Prayer request detail view | No drill-down on list items |
| Status updates / leader responses | Member cannot see responses yet |
| Admin prayer queue | `/admin/prayer-requests` still preview mock; hidden in alpha |
| Dashboard prayer widget | Still preview mock on `/dashboard` |
| Edit / cancel request | No PATCH/DELETE endpoints wired |
| Push notifications for responses | Depends on `prayerUpdates` preference + backend |

---

## Beta readiness impact

| Module | Before 15C | After 15C |
|--------|------------|-----------|
| Member prayer requests | BLOCKED | **READY** (linked members) |
| Admin prayer management | BLOCKED | BLOCKED (unchanged) |

---

## Recommended next phase (15D)

1. Wire admin `/admin/prayer-requests` to leadership APIs when available
2. Add member view of leader responses / status changes
3. Connect dashboard prayer summary widget to `/prayer-requests/me`
4. Add visibility field to live submit if backend supports it
