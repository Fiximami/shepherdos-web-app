# FaithBaseOS — Controlled Beta Test Plan

**Project:** shepherdos-web-app  
**Phase:** 14E  
**Environment:** `https://app.faithbaseos.com`  
**API:** `https://shepherdos-api.onrender.com`  
**Church slug:** `alpha-grace-church` (configurable)

---

## 1. Test objectives

1. Confirm authentication and session work for member and leader accounts
2. Verify RBAC grants or denies Leadership Console access correctly
3. Validate alpha route gating (visible vs hidden modules)
4. Confirm live read paths for member portal (profile, attendance, giving)
5. Confirm live read paths for Leadership Console (six modules)
6. Verify blocked features are not marketed as live (giving submit, settings toggles, events, prayer, counselling)
7. Document defects and backend gaps before church pilot

---

## 2. Test environment setup

### Required configuration

| Variable | Expected value |
|----------|----------------|
| `NEXT_PUBLIC_ALPHA_MODE` | `true` |
| `NEXT_PUBLIC_SHOW_PREVIEW_ROUTES` | `false` |
| `NEXT_PUBLIC_ENABLE_DEMO_MODE` | `false` |
| `NEXT_PUBLIC_ENABLE_PASSWORD_RESET` | `false` |
| `NEXT_PUBLIC_CHURCH_SLUG` | Matches pilot church |

### Test accounts (request from backend team)

| Account | Role | Linked member | Purpose |
|---------|------|---------------|---------|
| `member-linked@` | `member` | Yes | Primary member journey |
| `member-unlinked@` | `member` | No | Unlinked notice behavior |
| `admin-full@` | `church_admin` | Yes | Full Leadership Console |
| `admin-finance@` | `finance_officer` | Yes | Finance module access |
| `admin-no-perms@` | `pastor` | Yes | Role access, empty `permissions[]` |
| `member-finance-only@` | `member` + `finance:record` | Yes | Must NOT see Leadership Console |

### Browsers

- Chrome (primary)
- Safari or Edge (smoke)
- Mobile viewport 390×844 (sidebar + topbar)

---

## 3. Test suites

### Suite A — Authentication

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| A-01 | Valid login | Enter credentials → submit | Redirect to `/dashboard`; name in topbar | |
| A-02 | Invalid login | Wrong password | Error message; stay on login | |
| A-03 | Session persist | Refresh after login | Remain authenticated | |
| A-04 | Logout | Sign out from user menu | Redirect to `/login`; protected routes blocked | |
| A-05 | Unauthenticated access | Visit `/dashboard` logged out | Redirect to `/login` | |
| A-06 | Demo button absent | Open login in production | No "Try demo" button | |
| A-07 | Password reset hidden | Open login | No forgot-password link | |
| A-08 | Token expiry / 401 | Invalidate token (devtools) | Redirect to login on next API call | |

---

### Suite B — RBAC & Leadership Console access

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| B-01 | Church admin sees button | Login as `admin-full@` | "Leadership Console" button visible | |
| B-02 | Church admin enters admin | Click button → `/admin` | Admin shell loads | |
| B-03 | Member blocked from admin | Login as `member-linked@` → visit `/admin` | Redirect to `/dashboard` | |
| B-04 | Member no button | Login as member | No Leadership Console button | |
| B-05 | `leadership.access` only | Account with permission, `member` role | Button visible; `/admin` accessible | |
| B-06 | Finance perm only | `member-finance-only@` | No button; `/admin` blocked | |
| B-07 | Super admin role | `SUPER_ADMIN` or `super_admin` from API | Button visible; `/admin` accessible | |
| B-08 | Finance nav gating | Admin without finance perms | Finance nav item hidden | |
| B-09 | Finance route guard | Visit `/admin/finance` without perms | Redirect to `/dashboard` | |
| B-10 | Members nav gating | Admin without member perms | Members nav hidden | |

---

### Suite C — Alpha route gating (member)

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| C-01 | Visible routes | Visit each alpha route | Page loads | |
| C-02 | Hidden feed | Visit `/feed` | Redirect to `/dashboard` | |
| C-03 | Hidden events | Visit `/events` | Redirect to `/dashboard` | |
| C-04 | Hidden prayer | Visit `/prayer-requests` | Redirect to `/dashboard` | |
| C-05 | Hidden counselling | Visit `/counselling` | Redirect to `/dashboard` | |
| C-06 | Finance redirect | Visit `/finance` | Redirect to `/giving` | |
| C-07 | Sidebar count | Open sidebar | Exactly 5 items | |
| C-08 | Beta badges | Dashboard, profile, settings | "Beta" badge on nav | |

---

### Suite D — Alpha route gating (admin)

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| D-01 | Visible admin routes | Visit 6 alpha admin routes | Page loads | |
| D-02 | Hidden analytics | Visit `/admin/analytics` | Redirect to `/admin` | |
| D-03 | Hidden events admin | Visit `/admin/events` | Redirect to `/admin` | |
| D-04 | Hidden prayer admin | Visit `/admin/prayer-requests` | Redirect to `/admin` | |
| D-05 | Hidden counselling admin | Visit `/admin/counselling` | Redirect to `/admin` | |

---

### Suite E — Member Portal

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| E-01 | Dashboard live data | Login linked member | Attendance/giving summaries not `—` | |
| E-02 | Dashboard preview widgets | Scroll dashboard | Preview notices on events/prayer/feed | |
| E-03 | Profile identity | Open `/profile` | Name, email, branch from API | |
| E-04 | Profile preview sections | Ministry + skills | Preview badges visible | |
| E-05 | Unlinked notice | Login unlinked member | `MemberLinkedNotice` on key pages | |
| E-06 | Profile read-only | Attempt to edit fields | No edit controls | |

---

### Suite F — Attendance

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| F-01 | Summary cards | Open `/attendance` linked | Week/month counts from API | |
| F-02 | History table | View sessions | Rows from `/attendance/me` | |
| F-03 | Unlinked empty | Unlinked member | Empty table + notice | |
| F-04 | Leader buttons | Click "Record Attendance" | No action / no API call | |
| F-05 | Insights preview | Scroll to insights | Preview notice present | |
| F-06 | No check-in | Search page for check-in | No working check-in on this page | |

---

### Suite G — Giving

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| G-01 | History from API | Open `/giving` linked | Table rows from `/giving/me` | |
| G-02 | Give now preview | Submit give form | Preview message; no payment API | |
| G-03 | Receipt preview | Open receipt modal | Mock receipt displays | |
| G-04 | Download receipt | Click download | Preview feedback string only | |
| G-05 | Pledge preview | View pledge section | Preview badge + notice | |
| G-06 | Finance not in nav | Check sidebar | No Finance link | |

---

### Suite H — Settings

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| H-01 | Identity display | Open `/settings` | Fields from `/members/me` | |
| H-02 | Toggle preview | Toggle notification pref | UI changes; Preview badge on section | |
| H-03 | Toggle not persisted | Refresh page | Toggle resets to default | |
| H-04 | No password change | Security section | No working password flow | |

---

### Suite I — Events (blocked / regression)

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| I-01 | Route blocked in alpha | Visit `/events` in prod config | Redirect to `/dashboard` | |
| I-02 | Preview mode only | Set `SHOW_PREVIEW_ROUTES=true` locally | Page loads with mock events | |
| I-03 | Check-in local only | Check in on events page (dev) | Data in localStorage only | |

---

### Suite J — Prayer (blocked / regression)

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| J-01 | Route blocked | Visit `/prayer-requests` | Redirect to `/dashboard` | |
| J-02 | Preview mode only | Enable preview routes locally | Submit adds local row only | |

---

### Suite K — Counselling (blocked / regression)

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| K-01 | Route blocked | Visit `/counselling` | Redirect to `/dashboard` | |
| K-02 | Preview mode only | Enable preview routes locally | Mock booking table only | |

---

### Suite L — Leadership Console (live reads)

| ID | Test case | Steps | Expected | Status |
|----|-----------|-------|----------|--------|
| L-01 | Overview summaries | Open `/admin` | Summary cards load (not all `—`) | |
| L-02 | Members list | Open `/admin/members` | Member rows from API | |
| L-03 | Attendance data | Open `/admin/attendance` | Sessions/records or summary | |
| L-04 | Finance data | Open `/admin/finance` (with perms) | Transactions or summary | |
| L-05 | Giving data | Open `/admin/giving` | Records or summary | |
| L-06 | Settings data | Open `/admin/settings` | Church/profile fields | |
| L-07 | No write persistence | Attempt create member | Placeholder only; no API POST | |
| L-08 | Return to member | Click "Return to Member Dashboard" | Navigates to `/dashboard` | |

---

## 4. Non-functional checks

| ID | Area | Check |
|----|------|-------|
| NF-01 | Performance | Login → dashboard < 5s (allow Render cold start) |
| NF-02 | Mobile | Sidebar opens; nav usable on phone |
| NF-03 | Loading states | API pages show loading notice |
| NF-04 | Error states | Disconnect API → graceful error message |
| NF-05 | Branding | Church name/logo from session |
| NF-06 | robots | `/robots.txt` disallows app paths |

---

## 5. Defect severity

| Severity | Definition | Beta gate |
|----------|------------|-----------|
| **P0** | Cannot login; data leak; wrong user data shown | Block release |
| **P1** | Leadership Console inaccessible for admin; all member data empty for linked users | Block release |
| **P2** | Misleading UI (looks live but isn't); broken nav | Fix or document |
| **P3** | Cosmetic; preview label missing | Fix when convenient |

---

## 6. Sign-off criteria

Beta test passes when:

- [ ] All Suite A tests pass (A-01 through A-08)
- [ ] All Suite B tests pass for pilot account types
- [ ] All Suite C and D route gating tests pass
- [ ] Suite E, F, G, H pass for **linked member** account
- [ ] Suite I, J, K confirm **BLOCKED** in production alpha
- [ ] Suite L passes for **admin** account with appropriate permissions
- [ ] No open P0 or P1 defects
- [ ] Pilot scope document shared with church (see `CHURCH_PILOT_CHECKLIST.md`)

---

## 7. Test execution log

| Date | Tester | Build / commit | Pass | Fail | Notes |
|------|--------|----------------|------|------|-------|
| | | | | | |

---

## 8. Known limitations (do not file as defects)

1. Giving submit, receipts, pledges — preview only
2. Settings toggles — not persisted
3. Events, prayer, counselling — intentionally hidden
4. Attendance leader header buttons — non-functional
5. Admin modules beyond six alpha routes — hidden
6. No admin write operations in frontend
7. Password reset disabled
