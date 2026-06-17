# Phase 15A — Member Profile & Settings Workflow Completion

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Connect member self-service APIs to profile and settings pages

---

## Summary

Member profile editing and notification preferences are now wired to live backend endpoints. Linked members can update personal contact fields and save notification preferences with validation, loading states, success/error feedback, and unsaved-changes detection.

**Build:** `npm run build` — **passed** (exit 0)

---

## Endpoints used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/members/me` | Preload profile fields and preferences (existing) |
| `PATCH` | `/members/me` | Update email, phone, address, dateOfBirth |
| `PATCH` | `/members/me/preferences` | Update notification preference toggles |

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/api/types.ts` | Added `MemberProfileUpdate`, `MemberPreferences`, `MemberPreferencesUpdate` |
| `src/lib/api/members.ts` | Added `updateMyProfile()`, `updateMyPreferences()`, `extractMemberPreferences()`, `formatDateForInput()` |
| `src/lib/validations/member-profile.ts` | **New** — Zod schema for profile form |
| `src/hooks/use-api-data.ts` | Added `refetch()` to reload data after saves |
| `src/hooks/use-member-profile-fields.ts` | Exposes `preferences`, `refetchProfile` |
| `src/components/shared/form-toast.tsx` | **New** — Success/error feedback banner |
| `src/components/dashboard/profile/profile-edit-form.tsx` | **New** — Editable profile form |
| `src/components/dashboard/profile/profile-page-view.tsx` | Renders form for linked live users |
| `src/components/dashboard/settings/member-preferences-form.tsx` | **New** — Preferences toggles + save |
| `src/components/dashboard/settings/settings-page-view.tsx` | Wired preferences; removed local-only toggles |

---

## Feature completion

### Profile page (`/profile`)

| Requirement | Status |
|-------------|--------|
| Preload existing values | Done — from `/members/me` via `useMemberProfileFields` |
| Editable: phone, address, email, dateOfBirth | Done |
| Validation (Zod) | Done — email, phone min 6, address min 3, valid date |
| Loading state | Done — `Saving…` + disabled inputs |
| Success toast | Done — `FormToast` success variant |
| Error toast | Done — API error message via `FormToast` |
| Optimistic UI update | Done — form resets optimistically; rolls back on error |
| Unsaved changes detection | Done — amber notice + disabled save when unchanged |
| Gated to linked live users | Done — read-only placeholders otherwise |

Read-only fields unchanged: full name, emergency contact, church information, ministry/skills (preview), security placeholder.

### Settings page (`/settings`)

| Requirement | Status |
|-------------|--------|
| Load current values | Done — from `profile.preferences` on `/members/me` |
| `emailNotifications` | Done |
| `smsNotifications` | Done |
| `prayerUpdates` | Done |
| `eventReminders` | Done |
| Save button | Done — `Save preferences` |
| Success feedback | Done |
| Error handling | Done — rollback on failure |
| Saving indicator | Done |
| Disabled during request | Done |
| Unsaved changes detection | Done |

Account section remains read-only (display name, email, phone, branch from profile). Privacy, language, and security sections remain preview placeholders.

---

## API layer

### `updateMyProfile(payload)`

```typescript
PATCH /members/me
Body: { email?, phone?, address?, dateOfBirth? }
Returns: unwrapMemberProfile(response)
```

### `updateMyPreferences(payload)`

```typescript
PATCH /members/me/preferences
Body: { emailNotifications?, smsNotifications?, prayerUpdates?, eventReminders? }
Returns: MemberPreferences (normalized from response)
```

### Preference loading

Preferences are extracted from `GET /members/me` profile payload via `extractMemberPreferences()`, supporting camelCase and snake_case keys.

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run build` | **Pass** — 45 routes, TypeScript clean |
| TypeScript | No errors |
| Linter | No new issues on changed files |

### Manual test checklist (recommended)

| Test | Expected |
|------|----------|
| Linked member opens `/profile` | Form pre-filled from API |
| Save valid profile | Success toast; data persists after refresh |
| Invalid email | Inline validation error |
| API error on save | Error toast; form reverts |
| Linked member opens `/settings` | Toggles match API preferences |
| Toggle + save | Success toast; values persist after refresh |
| Unlinked member | Read-only profile; preferences unavailable message |
| Demo mode | No live API calls (existing `useApiData` gate) |

---

## UX additions

- **FormToast** — inline success (auto-dismiss 4s) and error banners
- **Saving indicators** — spinner + “Saving…” on submit buttons
- **Disabled state** — inputs and buttons disabled while saving
- **Unsaved changes** — “You have unsaved changes” / “All changes saved” copy
- **No visual redesign** — existing card, border, and toggle styling preserved

---

## Remaining gaps

| Gap | Notes |
|-----|-------|
| Full name edit | Not in API scope for this phase |
| Emergency contact edit | Not exposed on `PATCH /members/me` |
| Profile photo upload | Not available |
| Privacy settings | Still preview placeholder |
| Password / security | Still placeholder; reset flow disabled |
| Language / accessibility | Still placeholder |
| Dedicated `GET /members/me/preferences` | Loads via nested profile preferences only |
| Auth session email sync | Updating profile email does not update `/auth/me` session display until re-login |
| Ministry / skills | Still preview mock on profile page |

---

## Beta readiness impact

| Module | Before 15A | After 15A |
|--------|------------|-----------|
| Profile | PARTIAL (read-only) | **READY** (edit for linked members) |
| Settings preferences | BLOCKED | **READY** (save for linked members) |
| Settings privacy/security | BLOCKED | BLOCKED (unchanged) |

---

## Recommended next phase (15B)

1. Sync auth session after profile email update
2. Wire emergency contact if backend adds field support
3. Add privacy preference API when available
4. Remove non-functional attendance leader buttons (from 14E backlog)
