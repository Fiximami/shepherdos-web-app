# FaithBaseOS — Church Pilot Checklist

**For:** Pilot church leadership and FaithBaseOS team  
**App URL:** https://app.faithbaseos.com  
**Phase:** Controlled beta (read-focused)

Use this checklist to prepare, launch, and review a single-church pilot. Complete items in order.

---

## Part 1 — Before inviting the church

### FaithBaseOS team

- [ ] Production deploy is live at `app.faithbaseos.com`
- [ ] Vercel env vars set per `docs/VERCEL_PRODUCTION.md`
- [ ] `NEXT_PUBLIC_ENABLE_DEMO_MODE=false` in production
- [ ] `NEXT_PUBLIC_ENABLE_PASSWORD_RESET=false` in production
- [ ] `NEXT_PUBLIC_CHURCH_SLUG` matches pilot church backend record
- [ ] API CORS includes `https://app.faithbaseos.com`
- [ ] `npm run build` passes on deployment branch
- [ ] Beta test plan (`BETA_TEST_PLAN.md`) executed; no P0/P1 defects open

### Backend / API team

- [ ] Pilot church created in API with correct slug
- [ ] Member accounts created and **linked** to member records (`linked: true` on `/members/me`)
- [ ] At least 2–3 members have attendance history in `/attendance/me`
- [ ] At least 2–3 members have giving history in `/giving/me`
- [ ] Leader accounts return leadership role (`church_admin`, `pastor`, etc.) **or** `leadership.access`
- [ ] Leader accounts have granular permissions as needed:
  - [ ] `members:create` or `members:update` (Members module)
  - [ ] `finance:record` or `finance:approve` (Finance module)
- [ ] `GET /auth/me` verified for each pilot account (role + permissions documented)
- [ ] API warmed before first demo (Render cold start)

### Communications

- [ ] Pilot scope document shared with church (what works vs preview)
- [ ] Support contact defined for pilot period
- [ ] Feedback channel defined (form, email, or weekly call)

---

## Part 2 — What to tell the church (scope agreement)

Confirm the church understands:

### Members CAN do in this beta

- [ ] Log in with provided credentials
- [ ] View personal dashboard summaries
- [ ] View profile information (read-only)
- [ ] View personal attendance history
- [ ] View personal giving history
- [ ] Browse settings (preferences are **preview only** — changes are not saved)

### Members CANNOT do yet

- [ ] Pay or submit giving online (form is preview)
- [ ] Download official receipts
- [ ] Edit profile or upload photo
- [ ] Save notification or privacy preferences
- [ ] Check in to services from the app
- [ ] Submit prayer requests (module hidden)
- [ ] Book counselling (module hidden)
- [ ] View or register for events (module hidden)
- [ ] Reset password via app (not enabled)

### Leaders CAN do in this beta

- [ ] Access Leadership Console from member topbar
- [ ] View overview summaries (members, attendance, finance)
- [ ] Browse member list (read-only)
- [ ] View attendance sessions and records (read-only)
- [ ] View finance transactions and summaries (read-only, if permitted)
- [ ] View giving records (read-only)
- [ ] View church settings fields (read-only)

### Leaders CANNOT do yet

- [ ] Add or edit members in the app
- [ ] Approve expenses or record transactions
- [ ] Send announcements or manage communication
- [ ] Manage events, prayer queue, or counselling from admin
- [ ] Export reports or run analytics modules (hidden)
- [ ] Change church branding or role permissions in app

**Church lead signature / acknowledgment:** _________________________ Date: _________

---

## Part 3 — Account setup checklist

| Person | Email | Role | Member linked | Attendance data | Giving data | Leadership access | Delivered credentials |
|--------|-------|------|---------------|-----------------|-------------|-------------------|----------------------|
| Pastor / admin | | church_admin | | n/a | n/a | Yes | [ ] |
| Finance lead | | finance_officer | | n/a | n/a | Yes | [ ] |
| Member 1 | | member | [ ] | [ ] | [ ] | No | [ ] |
| Member 2 | | member | [ ] | [ ] | [ ] | No | [ ] |
| Member 3 | | member | [ ] | [ ] | [ ] | No | [ ] |

### Credential delivery

- [ ] Passwords sent securely (not plain email if avoidable)
- [ ] Church slug communicated if login requires it
- [ ] Login URL: `https://app.faithbaseos.com/login`
- [ ] First-login instructions shared (see Part 4)

---

## Part 4 — Member onboarding script

Share with pilot members:

1. Open **https://app.faithbaseos.com/login**
2. Enter your email and temporary password
3. You will land on **My Dashboard**
4. Use the sidebar:
   - **My Dashboard** — summary of your attendance and giving
   - **My Profile** — your church profile (view only)
   - **Attendance** — your service attendance history
   - **Giving** — your giving history (not online payment yet)
   - **Settings** — account view; preference toggles are preview
5. If you see a **“profile not linked”** notice, contact the church office — your account needs to be linked in the system
6. **Do not expect** prayer requests, events, counselling, or online giving in this beta

---

## Part 5 — Leader onboarding script

Share with pilot leaders:

1. Log in as above
2. Click **Leadership Console** in the top bar
3. Available modules in this beta:
   - **Overview** — church snapshot
   - **Members** — member list (view)
   - **Attendance** — sessions and records (view)
   - **Finance** — transactions (view, if your role includes finance access)
   - **Giving Management** — giving records (view)
   - **System Settings** — church settings (view)
4. Use **Return to Member Dashboard** to switch back to member view
5. Hidden modules (Events, Prayer, Analytics, etc.) are not part of this pilot — do not expect them in navigation

---

## Part 6 — Pilot week schedule

| Day | Activity | Owner |
|-----|----------|-------|
| Day 0 | Accounts created; checklist Part 1 complete | FaithBaseOS |
| Day 1 | Leader onboarding call (30 min) | FaithBaseOS + pastor |
| Day 2 | Member credentials distributed | Church admin |
| Day 3–7 | Members log in and explore | Members |
| Day 7 | Leader check-in: data accuracy | Pastor + FaithBaseOS |
| Day 14 | Mid-pilot feedback collection | FaithBaseOS |
| Day 21 | Pilot review meeting | All |
| Day 28 | Go / no-go for expanded beta | FaithBaseOS |

---

## Part 7 — Feedback questions (week 1)

Ask members:

1. Could you log in without help?
2. Did your name and church appear correctly?
3. Did attendance history look accurate?
4. Did giving history look accurate?
5. Was anything confusing or missing?
6. Did you try to give online? What happened?

Ask leaders:

1. Could you access Leadership Console?
2. Did summary numbers match your expectations?
3. Was the member list useful?
4. What did you try to do that the app could not do?
5. What is the single most important feature to add next?

---

## Part 8 — Data accuracy review

During pilot week, verify with church records:

| Data point | API source | Accurate? | Notes |
|------------|------------|-----------|-------|
| Member name | `/members/me` | [ ] | |
| Branch / status | `/members/me` | [ ] | |
| Attendance this month | `/attendance/me` | [ ] | |
| Giving this month | `/giving/me` | [ ] | |
| Member count (admin) | `/members/summary` | [ ] | |
| Finance total (admin) | `/finance/summary` | [ ] | |

---

## Part 9 — Issue triage during pilot

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| "Profile not linked" notice | `linked: false` on `/members/me` | Backend link member to user |
| All values show `—` | API error or empty data | Check network tab; verify API data |
| No Leadership Console button | Role not leadership; missing `leadership.access` | Fix `/auth/me` role |
| `/admin` redirects to dashboard | RBAC block | Verify role and permissions |
| Finance nav missing | No `finance:record` or `finance:approve` | Add permission or use finance officer account |
| Login fails | Wrong slug / password / CORS | Check env and API logs |
| Slow first load | Render cold start | Retry; consider uptime ping |

---

## Part 10 — Pilot completion criteria

Pilot is **successful** if:

- [ ] ≥ 70% of invited members log in at least once
- [ ] No P0 data accuracy issues unresolved
- [ ] Leaders confirm overview data is directionally correct
- [ ] Feedback collected from ≥ 1 leader and ≥ 3 members
- [ ] Scope violations documented (features users expected but are blocked)

Pilot is **not ready to expand** if:

- [ ] Linked members consistently see empty data
- [ ] Leaders cannot access Leadership Console
- [ ] Church expects online giving or prayer in this phase

---

## Part 11 — Post-pilot decisions

| Decision | Options | Date | Owner |
|----------|---------|------|-------|
| Continue pilot | Same church, another 4 weeks | | |
| Expand users | More members same church | | |
| Phase 15 priority | Giving POST vs settings vs events | | |
| Marketing | Update website beta claims | | |

---

## Quick reference

| Item | Value |
|------|-------|
| App | https://app.faithbaseos.com |
| Login | /login |
| Member routes | Dashboard, Profile, Attendance, Giving, Settings |
| Admin entry | Leadership Console button → /admin |
| Support | _[fill in]_ |
| Pilot church | _[fill in]_ |
| Pilot dates | _[fill in]_ |

---

## Related documents

- [BETA_READINESS_REPORT.md](./BETA_READINESS_REPORT.md) — feature status (READY / PARTIAL / BLOCKED)
- [BETA_TEST_PLAN.md](./BETA_TEST_PLAN.md) — QA test cases
- [PHASE_14A_ALIGNMENT_REPORT.md](./PHASE_14A_ALIGNMENT_REPORT.md) — RBAC and finance/giving alignment
- [VERCEL_PRODUCTION.md](./VERCEL_PRODUCTION.md) — deployment configuration
