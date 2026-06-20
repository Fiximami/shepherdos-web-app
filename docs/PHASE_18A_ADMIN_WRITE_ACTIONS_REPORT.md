# Phase 18A — Admin Write Actions Integration Report

**Project:** shepherdos-web-app (FaithBaseOS)  
**Date:** 2026-06-19  
**Scope:** Frontend only — connect admin CTAs to existing backend write routes  
**API base:** `https://shepherdos-api.onrender.com`

---

## Summary

Phase 18A replaced placeholder `setFeedback()` admin actions with real API writes on the five alpha leadership modules: **members**, **attendance**, **finance**, **giving**, and **settings**. Each connected action uses modals, loading states, success/error toasts (`FormToast`), permission checks, and list refetch after success.

Backend routes were verified with unauthenticated probes (401 = route exists). No backend code was modified.

---

## Actions Connected

### `/admin/members`

| Action | API | Permission |
|--------|-----|------------|
| **Add Member** | `POST /members` | `members:create` |
| **Edit Member** (name, phone, branch, status) | `PATCH /members/:id` | `members:update` (row action) |

### `/admin/attendance`

| Action | API | Permission |
|--------|-----|------------|
| **Create Service Session** | `POST /attendance/sessions` | `attendance:record` |
| **Record Attendance** | `POST /attendance/records` | `attendance:record` |
| **Edit session** (name + counts) | `PATCH /attendance/sessions/:id` + `POST /attendance/records` | `attendance:record` |
| **Close session** | `PATCH /attendance/sessions/:id/close` | `attendance:record` |

### `/admin/finance`

| Action | API | Permission |
|--------|-----|------------|
| **Record Income** | `POST /finance/transactions` (`type: income`) | `finance:record` |
| **Record Expense** | `POST /finance/transactions` (`type: expense`) | `finance:record` |
| **View transaction** (live rows) | read + `GET /audit-logs/entity/transaction/:id` | `finance:record` or `finance:approve` |
| **Approve / Reject** (pending status) | `PATCH /finance/transactions/:id/status` | `finance:approve` |

### `/admin/giving`

| Action | API | Permission |
|--------|-----|------------|
| **View giving record** | `GET /giving/:id/receipt` | live data required |
| **Approve / Reject** (pending receipt) | `PATCH /finance/transactions/:id/status` | `finance:approve` |

Giving records often originate from `/giving/records` with finance fallback; approval uses the shared finance status endpoint.

### `/admin/settings`

| Action | API | Permission |
|--------|-----|------------|
| **Save church profile** (name, email, phone, address) | `PATCH /settings/church` | `settings:manage` |
| **Save default currency** | `PATCH /settings/giving` | `settings:manage` |

Admin contact fields remain read-only from `GET /settings/profile`.

---

## Actions Still Preview-Only

| Module | Action | Reason |
|--------|--------|--------|
| Members | Import Members | No bulk import API |
| Members | Export Records | No export API |
| Members | Assign Ministry, Mark Follow-up | No dedicated endpoints (status via Edit Member) |
| Attendance | Smart check-in review buttons | Preview panels only |
| Attendance | Trust scores, absentee mock sections | No backend |
| Finance | Reconcile Account | No reconcile API |
| Finance | Generate Report | No report generation API |
| Finance | Category breakdown, budgets, receipts table | Read/preview UI only |
| Finance | Expense table mock rows | Not from live API |
| Giving | Export Giving Summary | No export API |
| Giving | Pledge tracking, receipt templates | No admin pledge/write APIs on giving module |
| Settings | Category tiles navigation | No sub-route APIs |
| Settings | Logo upload | No upload API |
| Settings | Brand colours | No theme save API |
| Settings | Roles & permissions matrix | No RBAC write API |

---

## Backend Gaps (confirmed missing)

Probed routes returning **404** (do not exist on current API):

| Expected capability | Probed path | Status |
|--------------------|-------------|--------|
| Direct transaction PATCH | `PATCH /finance/transactions/:id` | 404 |
| Approve via sub-path | `POST /finance/transactions/:id/approve` | 404 |
| Giving record approve | `PATCH /giving/records/:id` | 404 |
| Root settings PATCH | `PATCH /settings` | 404 |
| Church currency sub-path | `PATCH /settings/church/currency` | 404 |

**Available** (401 without auth):

- `POST /members`, `PATCH /members/:id`
- `POST /attendance/sessions`, `PATCH /attendance/sessions/:id`, `PATCH .../close`, `POST /attendance/records`
- `POST /finance/transactions`, `PATCH /finance/transactions/:id/status`
- `PATCH /settings/church`, `PATCH /settings/giving`
- `GET /giving/:id/receipt` (existing client)

---

## Files Changed

### API layer

| File | Change |
|------|--------|
| `src/lib/api/normalize.ts` | Added `unwrapApiEntity()` |
| `src/lib/api/types.ts` | Write payload types |
| `src/lib/api/members.ts` | `createMember`, `updateMember` |
| `src/lib/api/attendance.ts` | `createAttendanceSession`, `updateAttendanceSession`, `closeAttendanceSession`, `recordAttendance` |
| `src/lib/api/finance.ts` | `createFinanceTransaction`, `updateFinanceTransactionStatus` |
| `src/lib/api/settings.ts` | `fetchGivingSettings`, `updateChurchSettings`, `updateGivingSettings` |

### New components

| File | Purpose |
|------|---------|
| `src/components/admin/shared/admin-modal.tsx` | Shared modal shell |
| `src/components/admin/actions/member-action-dialogs.tsx` | Create / edit member |
| `src/components/admin/actions/attendance-action-dialogs.tsx` | Session + record dialogs |
| `src/components/admin/actions/finance-action-dialogs.tsx` | Create transaction + detail/approve |
| `src/components/admin/actions/giving-record-dialog.tsx` | Receipt view + approve |
| `src/components/admin/actions/church-settings-form.tsx` | Church + giving settings save |

### Admin pages

| File | Change |
|------|--------|
| `src/app/(admin)/admin/members/page.tsx` | Wired create/edit dialogs |
| `src/app/(admin)/admin/attendance/page.tsx` | Wired session/record/close actions |
| `src/app/(admin)/admin/finance/page.tsx` | Wired income/expense + transaction detail |
| `src/app/(admin)/admin/giving/page.tsx` | Wired record view + approve |
| `src/app/(admin)/admin/settings/page.tsx` | Editable church/giving settings form |

---

## Permissions

Existing RBAC helpers unchanged:

- `members:create` / `members:update` — member writes
- `attendance:record` — attendance writes
- `finance:record` — create transactions
- `finance:approve` — approve/reject status updates (finance + giving)
- `settings:manage` — save church and giving settings

Buttons are hidden when the session user lacks the required permission.

---

## UX Patterns

- **Modal forms** for create/edit flows (`AdminModal`)
- **Loading** — submit buttons show spinner + disabled state
- **Success toast** — `FormToast` success variant, auto-dismiss, then close modal
- **Error toast** — `FormToast` error variant with API message via `getApiErrorMessage()`
- **Refetch** — `useApiData().refetch()` on summary/list queries after successful writes

---

## Build Verification

```bash
npm run build
```

| Check | Result |
|-------|--------|
| Compile | ✓ Success |
| TypeScript | ✓ Pass |
| Static routes | ✓ 45 generated |
| Exit code | 0 |

---

## Recommended Follow-Up

1. Bulk member import/export APIs
2. Finance reconcile + PDF/CSV report generation
3. Admin giving pledge management endpoints
4. Settings logo upload + theme/branding PATCH
5. Dedicated giving approve endpoint if finance status coupling is insufficient
6. Wire mock expense approval rows to live `/finance/transactions` when expense type filtering is available
