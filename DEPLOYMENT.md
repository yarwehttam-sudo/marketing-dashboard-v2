# SR Energy — Deployment Guide

This guide covers everything needed to deploy the SR Energy site to production on Vercel.

---

## Pre-Launch Checklist

Complete every item before deploying to production.

### NAP & Contact
- [ ] Replace placeholder phone number `(800) 555-0199` in `lib/businessInfo.ts` with the real business phone number
- [ ] Confirm email `JoinUs@SREnergy.US` is active and monitored
- [ ] Confirm domain `srenergy.com` is pointing to Vercel (Step 3 below)

### SEO
- [ ] Verify `app/layout.tsx` does **not** have `robots: { index: false }` — confirmed removed
- [ ] Confirm `metadataBase` in `app/layout.tsx` matches the production domain
- [ ] Run `npm run build` locally — must complete with 0 TypeScript errors
- [ ] Spot-check 3–5 location pages in a browser to confirm titles, descriptions, and breadcrumbs render correctly
- [ ] Validate one city page and one VPP page with Google's Rich Results Test (search.google.com/test/rich-results)

### Content
- [ ] Review all 5 TX VPP city pages — confirm ZIP checker returns results for Houston, San Antonio, Dallas, Austin, Fort Worth
- [ ] Confirm `/get-quote` page exists and the form submits correctly
- [ ] Confirm `/how-it-works` page exists
- [ ] Replace any remaining placeholder copy before going live

---

## Step 1 — Create a Vercel Account

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**.
2. Choose **Continue with GitHub** to link your accounts.

---

## Step 2 — Connect Your GitHub Repository

1. From the Vercel dashboard, click **Add New... → Project**.
2. Under **Import Git Repository**, select this repository.
3. Click **Import**. Vercel detects Next.js automatically — leave all build settings at their defaults.
4. **Do not click Deploy yet** — add environment variables first (Step 3).

---

## Step 3 — Environment Variables

Add these in Vercel under **Settings → Environment Variables** before the first deploy.

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL, e.g. `https://srenergy.com` | Yes |

No server-side secrets are currently required for the location pages. If you add a contact form backend, add those credentials here.

---

## Step 4 — Custom Domain

1. In the Vercel project dashboard, go to **Settings → Domains**.
2. Add `srenergy.com` and `www.srenergy.com`.
3. Update your DNS registrar with the records Vercel provides (usually an A record and a CNAME).
4. Vercel provisions an SSL certificate automatically — this typically takes 5–10 minutes after DNS propagates.

---

## Step 5 — Deploy

1. Click **Deploy** on the Vercel configuration screen.
2. The build runs `npm run build` — 182 static pages will be generated.
3. When complete, Vercel shows a live preview URL. Test it before attaching the custom domain.

---

## Post-Launch Checklist

Complete these within the first 48 hours after going live.

### Search Console
- [ ] Go to [Google Search Console](https://search.google.com/search-console) and add the property `https://srenergy.com`
- [ ] Verify ownership via the HTML tag method (add to `app/layout.tsx` metadata) or DNS TXT record
- [ ] Submit sitemap: paste `https://srenergy.com/sitemap.xml` under **Sitemaps**
- [ ] Check **Coverage** report after 24–48 hours — all 182 pages should show as "Valid"

### Bing Webmaster Tools
- [ ] Add property at [bing.com/webmasters](https://www.bing.com/webmasters)
- [ ] Submit `https://srenergy.com/sitemap.xml`

### Analytics
- [ ] Set up Google Analytics 4 or Plausible and add the tracking snippet to `app/layout.tsx`
- [ ] Confirm events are firing on the `/get-quote` form submission (conversion tracking)

### Core Web Vitals
- [ ] Run Lighthouse on `/locations/texas/houston` in Chrome DevTools (mobile simulation)
- [ ] Targets: mobile score ≥ 85 · LCP < 2.5 s · CLS < 0.1 · FID/INP < 200 ms
- [ ] Run Lighthouse on the homepage as a second benchmark
- [ ] Check real-user CWV data in Search Console → **Core Web Vitals** report after 28 days of traffic

---

## Directory Listing Checklist

Submit NAP to all 13 directories tracked in `docs/directory-listings.md`.

**NAP to use everywhere — must be identical across all listings:**
- **Name:** SR Energy
- **Email:** JoinUs@SREnergy.US
- **Phone:** (800) 555-0199 ← update this before submitting
- **Website:** https://srenergy.com

| Directory | Priority | Notes |
|---|---|---|
| Google Business Profile | Critical | Do this first — drives Google Maps and local pack |
| Bing Places | High | Can auto-import from GBP |
| Apple Maps | High | Reaches all iPhone users |
| Yelp | High | High-authority backlink |
| BBB | Medium | Trust signal for no-credit-check solar |
| Angi / HomeAdvisor | Medium | Lead-gen potential |
| EnergySage | Medium | Solar-specific, high purchase intent |
| Thumbtack | Low | Supplemental lead source |
| Houzz | Low | Home improvement audience |
| Facebook Business | Low | Social proof |
| LinkedIn Company | Low | B2B credibility |
| NextDoor Business | Low | Hyperlocal neighborhoods |

See `docs/directory-listings.md` for submission status, dates, and NAP verification notes.

---

## Performance Budget

These are the minimum targets before launch. Test on a mid-range mobile device (or Chrome DevTools → Mobile, Moto G4 throttling).

| Metric | Target |
|---|---|
| Lighthouse Mobile Score | ≥ 85 |
| LCP (Largest Contentful Paint) | < 2.5 s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| INP (Interaction to Next Paint) | < 200 ms |
| Total page weight (compressed) | < 300 KB |

**How to test:**
1. Run `npm run build && npm start` locally
2. Open Chrome → DevTools → Lighthouse tab
3. Select **Mobile** and **Performance** only
4. Run on `/locations/texas/houston` (most complex page) and `/` (homepage)

---

## Re-Deploying After Changes

Any push to the `main` branch on GitHub triggers an automatic Vercel redeploy. No manual action needed.

To force a redeploy without a code change: Vercel dashboard → **Deployments** → **Redeploy**.
