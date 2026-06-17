# Phase 15F — Complete Giving Experience

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** June 2026  
**Scope:** Connect remaining member giving workflows to live backend APIs

---

## Summary

Members can view giving statements, open giving receipts, and manage pledges from `/giving`. Live users use `GET /giving/me/statements`, `GET /giving/:id/receipt`, `POST /pledges`, `GET /pledges/me`, and `PATCH /pledges/:id`. Demo mode retains the existing preview give-now flow, mock receipts, and local pledge samples with no API calls.

**Build:** `npm run build` — **passed** (exit 0)

---

## API routes used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/giving/me` | Existing — personal giving history (unchanged) |
| `GET` | `/giving/me/statements` | Load member giving statements |
| `GET` | `/giving/:id/receipt` | Fetch receipt metadata for a giving record |
| `POST` | `/pledges` | Create pledge (`title`, `amount`, `targetDate`) |
| `GET` | `/pledges/me` | Load member pledges |
| `PATCH` | `/pledges/:id` | Update pledge progress (`paidAmount`) |

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/api/giving.ts` | Added statements + receipt fetchers, mappers, receipt type |
| `src/lib/api/pledges.ts` | **New** — pledge list, create, update, mappers |
| `src/lib/api/types.ts` | Added `ApiGivingStatement`, `ApiGivingReceipt`, `ApiPledge`, `PledgeCreate`, `PledgeUpdate` |
| `src/lib/api/member-scope.ts` | Added `statements`, `givingStatements`, `pledges` to list extraction |
| `src/lib/validations/pledge.ts` | **New** — Zod schemas for pledge create and progress update |
| `src/components/dashboard/giving/member-giving-page-view.tsx` | Statements list, live receipt modal, pledge CRUD, linked gate, demo split |

---

## Feature completion

### Giving statements

| Requirement | Status |
|-------------|--------|
| Load from `GET /giving/me/statements` | Done |
| Display statement period | Done |
| Display total amount | Done |
| Display generated date | Done (formatted) |
| Loading state | Done |
| Empty state | Done |
| Error state | Done |

### Receipts

| Requirement | Status |
|-------------|--------|
| `GET /giving/:id/receipt` | Done |
| View Receipt button | Done — history rows in live mode |
| Receipt modal | Done — reuses existing overlay pattern |
| Display receipt metadata | Done — ID, finance ref, date, amount, category, method, member, church, status |
| Loading / error in modal | Done |

### Pledges

| Requirement | Status |
|-------------|--------|
| `POST /pledges` | Done |
| `GET /pledges/me` | Done |
| `PATCH /pledges/:id` | Done — `paidAmount` progress update |
| Create pledge (title, amount, target date) | Done |
| View pledges | Done — target, paid, balance, progress bar |
| Update pledge progress | Done — per-pledge paid amount + Save |
| Validation (Zod) | Done |
| Loading states | Done |
| Success toasts | Done — `FormToast` |
| Error handling | Done |
| Refresh after create/update | Done — `pledgesQuery.refetch()` |

### Linked member handling

| State | Behavior |
|-------|----------|
| `linked=false` (live) | Shows “Your account is not linked to a member profile.”; give-now, pledge controls, and receipt actions hidden |
| `linked=true` (live) | Full statements, receipts, and pledge workflow |
| Demo mode | Preview give-now, mock receipts, local pledge samples; no API calls |

### Demo mode

Give now form, download receipt buttons, annual statement preview, and demo pledge cards remain local preview behavior.

---

## UX behavior

| Mode | Give now | Statements | Receipts | Pledges |
|------|----------|------------|----------|---------|
| Demo | Local preview submit | Mock download buttons | Preview modal from mock library | Static demo rows |
| Live + linked | Preview submit (payment not wired) | API statement list | API receipt modal | Create, list, update progress |
| Live + unlinked | Hidden | Empty with link guidance | Hidden | Hidden |

Existing card layout, gold accents, history table, and summary cards preserved.

---

## Validation results

| Check | Result |
|-------|--------|
| `npm run build` | **Pass** — 45 routes, TypeScript clean |
| Linter | No new issues on changed files |

### Manual test checklist (recommended)

| Test | Expected |
|------|----------|
| Linked member views statements | Period, total, generated date listed |
| Linked member opens receipt | Modal loads metadata from API |
| Linked member creates pledge | Success toast; list refreshes |
| Linked member updates paid amount | Success toast; progress bar updates |
| Invalid pledge form | Inline validation error |
| Unlinked member | Notice shown; controls hidden |
| Demo mode | Local preview only; no network |
| Empty statements / pledges | Appropriate empty states |

---

## Remaining giving gaps

| Gap | Notes |
|-----|-------|
| Live payment processing | “Give now” still records preview feedback; no `POST /giving` payment endpoint wired |
| Receipt PDF download | Modal shows metadata only; no binary/PDF download |
| Statement PDF download | List display only; no file download endpoint wired |
| Batch receipt download | Demo-only; not connected in live mode |
| Pledge edit (title/date/amount) | PATCH wired for `paidAmount` progress only |
| Pledge delete | No DELETE endpoint wired |
| Admin giving / finance | Leadership pledge and receipt management still preview mock |
| Recurring giving | Not in API contract for this phase |
| Payment provider integration | Mobile money / card checkout not connected |

---

## Beta readiness impact

| Module | Before 15F | After 15F |
|--------|------------|-----------|
| Member giving history | PARTIAL (`/giving/me`) | PARTIAL (unchanged) |
| Member statements | BLOCKED | **READY** (linked members) |
| Member receipts | BLOCKED | **READY** (linked members) |
| Member pledges | BLOCKED | **READY** (linked members) |
| Member payment submit | BLOCKED | BLOCKED (unchanged) |

---

## Recommended next phase

1. Wire live payment submission when `POST /giving` (or payment intent) endpoint is available
2. Add receipt/statement PDF download when backend serves files
3. Connect admin `/admin/giving` to leadership APIs
4. Extend pledge PATCH for title/target date edits if backend supports them
5. Payment provider checkout (mobile money, card) behind give-now form
