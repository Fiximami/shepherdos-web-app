# Phase 15D — Counselling Workflow

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Connect member counselling requests to live backend APIs

---

## Summary

Members can submit counselling requests and view their request history from `/counselling`. Live users use `POST /counselling/request` and `GET /counselling/me`. Demo mode retains the existing preview booking form with local state.

**Build:** `npm run build` — **passed** (exit 0)

---

## API routes used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/counselling/me` | Load member counselling request list |
| `POST` | `/counselling/request` | Submit new request (`category`, `title`, `description`) |

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/api/counselling.ts` | **New** — `fetchMyCounsellingRequests()`, `submitCounsellingRequest()`, mappers |
| `src/lib/api/types.ts` | Added `ApiCounsellingRequest`, `CounsellingRequestCreate` |
| `src/lib/api/member-scope.ts` | Added `counselling`, `counsellingRequests` to list extraction |
| `src/lib/validations/counselling-request.ts` | **New** — Zod schema for category, title, description |
| `src/components/dashboard/counselling/counselling-page-view.tsx` | Live API workflow, list states, demo split |
| `src/lib/config/alpha-routes.ts` | Added `/counselling` to member alpha routes |

---

## Feature completion

### List requests

| Requirement | Status |
|-------------|--------|
| Load from `GET /counselling/me` | Done |
| Display category | Done |
| Display status | Done |
| Display submitted date | Done (formatted) |
| Loading state | Done |
| Empty state | Done |
| Error state | Done |

### Submit request

| Requirement | Status |
|-------------|--------|
| `POST /counselling/request` | Done |
| Fields: category, title, description | Done |
| Validation (Zod) | Done |
| Loading state | Done — “Submitting…” |
| Success toast | Done — `FormToast` |
| Error toast | Done |
| Refresh list after success | Done — `counsellingQuery.refetch()` |
| Clear form after success | Done |
| Confirmation message | Done |

### Linked member handling

| State | Behavior |
|-------|----------|
| `linked=false` (live) | Shows exact message; submit form hidden |
| `linked=true` (live) | Full submit + list workflow |
| Demo mode | Preview booking form with date/time/counsellor fields; no API calls |

### Alpha visibility

`/counselling` added to `memberAlphaPaths` so the workflow is reachable in production alpha.

---

## UX behavior

| Mode | Submit form | List |
|------|-------------|------|
| Demo | Full preview booking form (type, counsellor, date, time, urgency, note) | Table with type, date/time, counsellor, status |
| Live + linked | Category, title, description + consent notice | Table with category, submitted date, status |
| Live + unlinked | Hidden | Empty / link message |

Existing card layout, sidebar guidance, and confidentiality notes preserved.

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
| Invalid short title/description | Inline validation errors |
| Unlinked member | Notice shown; no submit form |
| Demo mode | Local submit with preview fields; no network |
| Empty list | “No counselling requests yet.” |
| API error on submit | Error toast; form retained |

---

## Remaining counselling gaps

| Gap | Notes |
|-----|-------|
| Preferred date/time (live) | Not in API contract for this phase |
| Counsellor type / urgency (live) | Demo preview only |
| Assigned counsellor display (live) | Not returned in list fields wired |
| Request detail view | No drill-down on list rows |
| Admin counselling queue | `/admin/counselling` still preview mock; hidden in alpha |
| Session scheduling / notifications | No member-facing booking confirmation flow |
| Edit / cancel request | No PATCH/DELETE endpoints wired |

---

## Beta readiness impact

| Module | Before 15D | After 15D |
|--------|------------|-----------|
| Member counselling | BLOCKED | **READY** (linked members) |
| Admin counselling | BLOCKED | BLOCKED (unchanged) |

---

## Recommended next phase (15E)

1. Wire admin `/admin/counselling` to leadership APIs when available
2. Add preferred scheduling fields to live submit if backend supports them
3. Show assigned counsellor and session date when API returns them
4. Member notifications when request status changes
