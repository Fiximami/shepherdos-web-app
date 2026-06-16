# Vercel — Production Environment Setup (Phase 13C)

Use this guide when configuring the **FaithBaseOS** web app (`shepherdos-web-app`) on Vercel for alpha deployment at **`https://app.faithbaseos.com`**.

This phase is **environment configuration only** — no smoke tests are required before moving on.

---

## 1. Repository & production branch

| Item | Current value | Recommendation |
|------|---------------|----------------|
| GitHub remote | `https://github.com/Fiximami/shepherdos-web-app.git` | Connect this repo in Vercel |
| Active branch | `setup/webapp-foundation` | Use as **Production Branch** until `main` is updated |
| Future production branch | `main` | Switch Vercel Production Branch after merge |

**Vercel → Project → Settings → Git → Production Branch**

- **Now:** `setup/webapp-foundation`
- **After merge:** `main`

Preview deployments can remain enabled for other branches; only Production must use the hardened env block below.

---

## 2. Build & deploy settings

Vercel auto-detects Next.js. Confirm:

| Setting | Value |
|---------|--------|
| Framework Preset | Next.js |
| Root Directory | `.` (repo root) |
| Build Command | `npm run build` (default) |
| Output Directory | *(Next.js default — do not override)* |
| Install Command | `npm install` (default) |
| Node.js Version | 20.x (recommended) |

No `vercel.json` is required for this project.

---

## 3. Custom domain & app URL

| Domain | Role |
|--------|------|
| `app.faithbaseos.com` | **Production** custom domain for this app |
| `*.vercel.app` | Vercel default (use for pre-domain smoke tests) |
| `faithbaseos.com` | Marketing site — **do not** point at this repo for launch |

**Vercel → Project → Settings → Domains**

1. Add `app.faithbaseos.com`
2. Copy the Vercel DNS target (CNAME)
3. In Namecheap: `CNAME` host `app` → Vercel target
4. Wait for SSL (automatic)

**`NEXT_PUBLIC_APP_URL` must match the production domain:**

```env
NEXT_PUBLIC_APP_URL=https://app.faithbaseos.com
```

Used for metadata `metadataBase` and canonical context — not for API calls.

---

## 4. Environment variables (Production)

Set in **Vercel → Project → Settings → Environment Variables**.  
Scope: **Production** only (unless noted).

Copy this block exactly for alpha:

```env
NEXT_PUBLIC_API_BASE_URL=https://shepherdos-api.onrender.com
NEXT_PUBLIC_CHURCH_SLUG=alpha-grace-church
NEXT_PUBLIC_PRODUCT_NAME=FaithBaseOS
NEXT_PUBLIC_PRODUCT_TAGLINE=Church operations, cared for well.
NEXT_PUBLIC_APP_URL=https://app.faithbaseos.com
NEXT_PUBLIC_ALPHA_MODE=true
NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=false
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
NEXT_PUBLIC_ENABLE_PASSWORD_RESET=false
```

### Variable reference

| Variable | Production value | Purpose |
|----------|------------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://shepherdos-api.onrender.com` | Render API (until `api.faithbaseos.com`) |
| `NEXT_PUBLIC_CHURCH_SLUG` | `alpha-grace-church` | Prefills church code on login |
| `NEXT_PUBLIC_PRODUCT_NAME` | `FaithBaseOS` | UI branding & metadata |
| `NEXT_PUBLIC_PRODUCT_TAGLINE` | `Church operations, cared for well.` | Auth & layout copy |
| `NEXT_PUBLIC_APP_URL` | `https://app.faithbaseos.com` | Metadata base URL |
| `NEXT_PUBLIC_ALPHA_MODE` | `true` | Hide unfinished routes |
| `NEXT_PUBLIC_SHOW_PREVIEW_ROUTES` | `false` | No preview modules in nav |
| `NEXT_PUBLIC_ENABLE_DEMO_MODE` | `false` | **Demo login disabled** |
| `NEXT_PUBLIC_ENABLE_PASSWORD_RESET` | `false` | Hide forgot/reset password |

All variables are `NEXT_PUBLIC_*` — they are embedded at **build time**. After changing Production env vars, **redeploy** (or push a commit) for changes to take effect.

---

## 5. Demo mode — confirmed disabled

Production demo is off when **both** are true:

1. `NEXT_PUBLIC_ENABLE_DEMO_MODE=false` on Vercel Production
2. Vercel runs `next build` with `NODE_ENV=production`

Code behavior (`src/lib/config/product.ts`):

- `isDemoModeAllowed()` → `false` when env is `false` or unset in production builds
- Login **“Continue to Demo Dashboard”** button is hidden
- Existing demo sessions are cleared on refresh

**Do not** set `NEXT_PUBLIC_ENABLE_DEMO_MODE=true` on Production.

### Preview / local environments (optional)

| Environment | `ENABLE_DEMO_MODE` | `SHOW_PREVIEW_ROUTES` |
|-------------|--------------------|------------------------|
| **Production** | `false` | `false` |
| **Preview** (PR deploys) | `false` recommended | `false` recommended |
| **Local** (`.env.local`) | `true` optional | `true` optional |

---

## 6. Preview & development env (optional)

For Vercel **Preview** deployments (pull requests), either:

- Omit variables (code defaults are safe: alpha on, demo off), or
- Duplicate Production values for consistent behavior

For **local development**, use `.env.local` (not committed):

```env
NEXT_PUBLIC_API_BASE_URL=https://shepherdos-api.onrender.com
NEXT_PUBLIC_CHURCH_SLUG=alpha-grace-church
NEXT_PUBLIC_SHOW_PREVIEW_ROUTES=true
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

---

## 7. Render CORS (backend — required for deploy)

On the Render API service, allow:

```
https://app.faithbaseos.com
https://<project-name>.vercel.app
http://localhost:3000
```

Without this, login and `/auth/me` will fail from the Vercel origin.

---

## 8. `.env.example` confirmation

The committed `.env.example` matches the Production block above and is the source of truth for:

- Variable names
- Production-safe defaults (`ENABLE_DEMO_MODE=false`, `ALPHA_MODE=true`, etc.)
- Comments for local overrides

**Local `.env.local`** currently has API URL + church slug only — correct for dev; production flags inherit from build defaults or Vercel overrides.

---

## 9. Vercel setup checklist (manual)

- [ ] Import `Fiximami/shepherdos-web-app` into Vercel
- [ ] Set Production Branch → `setup/webapp-foundation` (or `main` after merge)
- [ ] Paste Production environment variables (§4)
- [ ] Confirm `NEXT_PUBLIC_ENABLE_DEMO_MODE=false`
- [ ] Confirm `NEXT_PUBLIC_APP_URL=https://app.faithbaseos.com`
- [ ] Add custom domain `app.faithbaseos.com`
- [ ] Configure Namecheap DNS CNAME for `app`
- [ ] Update Render CORS for `app.faithbaseos.com`
- [ ] Trigger production deploy after env vars are saved
- [ ] *(Next phase)* Smoke test login on `app.faithbaseos.com`

---

## 10. Suggested commit message (if docs committed)

```
docs: add Vercel production environment setup for FaithBaseOS alpha.

Document production branch, env var block, app URL, and demo mode
disabled settings for app.faithbaseos.com deployment.
```

---

## Related docs

- [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md) — route policy, alpha modules, smoke tests
- [.env.example](../.env.example) — committed env template
