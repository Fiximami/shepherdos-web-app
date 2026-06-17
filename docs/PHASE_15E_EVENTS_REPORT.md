# Phase 15E — Events Registration Workflow

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Connect member event registration to live backend APIs

---

## Summary

Members can register for events and view their registration history from `/events`. Live users use `POST /events/:id/register` and `GET /events/my-registrations`. Demo mode retains the existing preview browse UI with local registration state and no API calls.

**Build:** `npm run build` — **passed** (exit 0)

---

## API routes used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/events/my-registrations` | Load member event registration list |
| `POST` | `/events/:id/register` | Register for an event by ID |

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/api/events.ts` | **New** — `fetchMyEventRegistrations()`, `registerForEvent()`, mappers, date formatter |
| `src/lib/api/types.ts` | Added `ApiEventRegistration`, `EventRegistrationResult` |
| `src/lib/api/member-scope.ts` | Added `registrations`, `eventRegistrations` to list extraction |
| `src/components/dashboard/events/events-page-view.tsx` | Live registration workflow, my registrations list, linked gate, demo split |
| `src/lib/config/alpha-routes.ts` | Added `/events` to `memberAlphaPaths`; removed from `hiddenMemberPaths` |

---

## Feature completion

### My registrations

| Requirement | Status |
|-------------|--------|
| Load from `GET /events/my-registrations` | Done |
| Display event name | Done |
| Display event date | Done (formatted) |
| Display registration status | Done |
| Loading state | Done |
| Empty state | Done |
| Error state | Done |

### Event registration

| Requirement | Status |
|-------------|--------|
| `POST /events/:id/register` | Done |
| Register button | Done |
| Loading state | Done — “Registering…” with spinner |
| Success toast | Done — `FormToast` |
| Error toast | Done |
| Duplicate registration prevention | Done — disabled when already registered or in-flight |
| Refresh list after success | Done — `registrationsQuery.refetch()` |
| Update button state | Done — shows “Registered” after success |
| Confirmation message | Done — success toast from API message |

### Linked member handling

| State | Behavior |
|-------|----------|
| `linked=false` (live) | Shows “Your account is not linked to a member profile.”; register buttons hidden |
| `linked=true` (live) | Full register + list workflow |
| Demo mode | Local registration state; no API calls |

### Demo mode

Preview browse cards, calendar, smart check-in, and trust score remain unchanged. Registration uses local `demoRegisteredIds` state only.

### Alpha visibility

`/events` added to `memberAlphaPaths` so the workflow is reachable in production alpha.

---

## UX behavior

| Mode | Register controls | My registrations |
|------|-------------------|------------------|
| Demo | Local register buttons on featured + list events | Local registered events from mock catalog |
| Live + linked | API-backed register with loading/disabled states | API list with name, date, status |
| Live + unlinked | Hidden | Empty state with link guidance |

Existing card layout, calendar preview, featured event hero, and smart attendance check-in preserved.

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run build` | **Pass** — TypeScript clean, `/events` route generated |
| Linter | No new issues on changed files |

### Manual test checklist (recommended)

| Test | Expected |
|------|----------|
| Linked member registers for event | Success toast; button shows “Registered”; list refreshes |
| Duplicate register attempt | Button disabled; no second POST |
| Unlinked member | Notice shown; no register buttons |
| Demo mode | Local register; no network requests |
| Empty registrations | “No registrations yet.” |
| API error on register | Error toast; button re-enabled |
| API error on list load | Error state in My registrations card |

---

## Remaining event gaps

| Gap | Notes |
|-----|-------|
| Event browse catalog (live) | Browse list still uses mock `memberEvents` until `GET /events` (or equivalent) is wired |
| Event ID alignment | Register POST uses mock event IDs in browse UI; backend must expose matching IDs for live registration to succeed end-to-end |
| Unregister / cancel | No DELETE endpoint wired |
| Registration capacity / waitlist | Not in API contract for this phase |
| Event detail page | No drill-down route; inline cards only |
| Admin events management | `/admin/events` still preview mock; hidden in alpha |
| Smart check-in (live) | Still local preview via `smart-attendance-storage`; separate from registration API |
| Calendar sync | “Add to calendar” remains preview feedback only |
| Event reminders | Preference exists in settings; not tied to registration confirmation flow |

---

## Beta readiness impact

| Module | Before 15E | After 15E |
|--------|------------|-----------|
| Member event registration | BLOCKED | **READY** (linked members; browse catalog still mock) |
| Admin events | BLOCKED | BLOCKED (unchanged) |

---

## Recommended next phase

1. Wire `GET /events` (or church event feed) so browse cards use live event IDs and metadata
2. Connect admin `/admin/events` to leadership APIs when available
3. Add unregister flow if backend supports it
4. Align smart check-in with server attendance when event check-in API is available
5. Surface registration confirmation in notifications / event reminders
