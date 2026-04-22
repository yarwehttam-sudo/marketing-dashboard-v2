# SR Energy — Project Progress

## Completed
**SEO build finalized: 2026-04-05 | Last updated: 2026-04-06**
All items below were completed and verified with a clean `npm run build` (0 errors, 183 static pages).

---

## SEO Infrastructure

- [x] `next.config.mjs` — permanent redirect from `/locations` → `/locations/`
- [x] `app/robots.ts` — allows all paths, disallows `/api/`, `/thank-you`, `/_next/`, includes sitemap URL
- [x] `app/sitemap.ts` — dynamically generates all 174 location URLs plus static routes; correct priorities (homepage 1.0, hub 0.9, states 0.8, cities 0.7, TX VPP 0.6) and changeFreq values
- [x] `lib/locations.ts` — 30-state STATES array with city lists, `avgKwhRate`, `peakSunHours`, `isVppEligible`; `getNearbyStateCities` (rotation-based, guarantees 0 orphans); `getNearbyStates` (geography-based adjacency)
- [x] `lib/structuredData.ts` — exports `buildLocalBusinessSchema`, `buildServiceSchema`, `buildFAQSchema`, `buildBreadcrumbSchema`, `buildReviewSchema`
- [x] `tsconfig.json` — `scripts/` excluded from Next.js type checking

---

## Location Pages

- [x] `app/locations/page.tsx` — hub page; H1 "Solar Installation Locations | SR Energy"; states grid with body copy; TX VPP callout; static metadata with title, description, canonical, openGraph
- [x] `app/locations/[state]/page.tsx` — 30 state pages; H1 interpolated with state name; `generateMetadata` with unique title, description (TX vs non-TX variants), canonical, openGraph; cities grid with intro paragraph; TX-only VPP callout with per-city pill links; FAQ accordion; BreadcrumbList schema + visible `›` breadcrumb nav (Home › State)
- [x] `app/locations/[state]/[city]/page.tsx` — 138 city pages; H1 interpolated with city + state; `generateMetadata` unique per city; visible FAQ accordion; reviews section (3 cards); TX-only VPP callout section; nearby cities with intro copy; JSON-LD: LocalBusiness + FAQPage + AggregateRating + BreadcrumbList; breadcrumb nav (Home › State › City)
- [x] `app/locations/texas/[city]/texas-vpp/page.tsx` — 5 TX VPP pages; green-themed hero; ZIP eligibility checker; program details accordion; benefit icon grid; eligibility checklist; reviews section (3 VPP-specific cards); FAQ accordion; JSON-LD: LocalBusiness + Service + FAQPage + AggregateRating + BreadcrumbList; breadcrumb nav (Home › Texas › City › Texas VPP Program)
- [x] `app/locations/[state]/FaqAccordion.tsx` — `'use client'` accordion component shared across state, city, and VPP pages

---

## Structured Data (JSON-LD)

- [x] `LocalBusiness` schema on all city and TX VPP pages — name, email, url, image, description, areaServed, address, priceRange, knowsAbout
- [x] `Service` schema on TX VPP pages — name, description, provider, areaServed, serviceType
- [x] `FAQPage` schema on all city and TX VPP pages — synced exactly with visible FAQ accordion content
- [x] `AggregateRating` schema on all city and TX VPP pages — ratingValue 4.9, reviewCount 127, bestRating 5
- [x] `BreadcrumbList` schema on state, city, and TX VPP pages — positions, names, and full canonical URLs
- [x] `Service` schema (inline) on state pages — areaServed State, free-quote offer

---

## SEO Metadata

- [x] All page types have exactly one H1
- [x] All page types have unique `title` and `description` — state/city names interpolated, no shared copy
- [x] All page types have `alternates: { canonical }` pointing to the correct absolute URL
- [x] All page types have `openGraph: { title, description, url }`
- [x] Hub page uses extracted constants to avoid string duplication in `openGraph`

---

## Content & Copy

- [x] `lib/vppZipData.ts` — 1,025 Texas ZIP codes mapped to utility (AEP, Oncor, CenterPoint, TNMP) with city and county
- [x] `components/VppZipChecker.tsx` — synchronous ZIP lookup, discriminated-union UI state, color-coded utility badge
- [x] State pages: `buildIntro(state)` — unique paragraph using `avgKwhRate`, `peakSunHours`, city names
- [x] City pages: `buildIntro(city, state)` — unique paragraph; `buildFaq` — 5 questions interpolated with city + state
- [x] TX VPP pages: `buildIntro(city)` — ERCOT/VPP context; `buildVppFaq` — 5 VPP-specific questions
- [x] All pages: heading structure audited — one H1, all sections use H2, no bare-heading sections
- [x] City pages: "About {city}" section — placeholder `[ADD LOCAL LANDMARK]` removed, replaced with generic accurate copy
- [x] All pages: body copy present above every link grid (states grid, cities grid, nearby cities)

---

## Link Graph & Internal Linking

- [x] `scripts/audit-links.ts` — models full internal link graph; orphan detection; missing reciprocal report; outputs `scripts/link-audit-report.md`
- [x] 0 orphan pages — rotation-based `getNearbyStateCities` guarantees every city receives exactly 3 inbound sibling links
- [x] Hub → all state pages; state pages → hub + all their cities; city pages → hub + state + 3 siblings (+ TX VPP if eligible); TX VPP pages → hub + TX state + parent city + all other TX VPP cities

---

## Docs

- [x] `docs/keyword-strategy.md` — 20 keyword patterns, 30-state priority matrix, Build First top 10, competitor gap analysis, 10 blog post titles

---

## Critical Fixes

- [x] Removed `robots: { index: false, follow: false }` from `app/layout.tsx` — was blocking all pages from Google indexing
- [x] Added `metadataBase` to `app/layout.tsx` — required for canonical and openGraph URLs to resolve correctly
- [x] Updated title template to `"%s | SR Energy"` in root layout for correct page title composition
- [x] Rebranded header from "Performance Dashboard" to SR Energy with logo link and Free Quote CTA

---

## S9 — Performance Optimization

- [x] SSG confirmed in place across all location page types
- [x] Map iframe has `loading="lazy"` on city pages
- [x] ISR added to city, state, and TX VPP pages — `revalidate: 86400` (24 hours)
- [x] `FaqAccordion` deferred with `next/dynamic` `ssr: false` on city and TX VPP pages
- [x] State page FAQ left as static import intentionally to preserve SSR for FAQ structured data
- [x] Created `docs/performance.md` with targets, benchmark table, optimization log, and next steps

---

## S10 — NAP Consistency & Directory Listings

- [x] Created `lib/businessInfo.ts` as single source of truth for name, email, phone, url, tagline, founded, experience
- [x] Updated `lib/structuredData.ts` to use `BUSINESS_INFO` instead of hardcoded strings
- [x] Updated `app/locations/page.tsx` to use `BUSINESS_INFO` email and added `tel:` click-to-call phone link
- [x] Added `tel:` click-to-call phone link to city page bottom CTA using `BUSINESS_INFO.phone`
- [x] Added `tel:` click-to-call phone link to TX VPP page bottom CTA using `BUSINESS_INFO.phone`
- [x] Created `docs/directory-listings.md` with tracking table for 13 directories
- [x] Rewrote `DEPLOYMENT.md` for SR Energy with pre-launch checklist, Vercel steps, env vars, post-launch checklist, and performance budget targets

---

## Contact Page

- [x] `app/contact/page.tsx` exists
- [x] Imports `BUSINESS_INFO` from `lib/businessInfo.ts` for all phone and email values — no hardcoded strings
- [x] Dark hero section (`bg-gray-900`) with H1 "Contact SR Energy"
- [x] Contact cards section — phone card with `tel:` link, email card with `mailto:` link, hours/response time card
- [x] Contact form with full name, phone, email, subject, message, SMS consent checkbox, and submit button
- [x] Bottom CTA section with `bg-gray-900` pattern, phone CTA button, and email link
- [x] Static `metadata` export with title, description, and canonical URL (`https://srenergy.us/contact/`)
- [x] `/contact/` in `app/sitemap.ts` with `priority: 0.8` and `changeFrequency: 'weekly'`
- [x] Build: 0 errors, 183 static pages (182 location pages + `/contact`)

---

## Session — 2026-04-06

- [x] Completed S9 — Performance Optimization (ISR, deferred FaqAccordion, performance.md)
- [x] Completed S10 — NAP Consistency (businessInfo.ts, tel: links on all location CTAs, directory-listings.md, DEPLOYMENT.md)
- [x] Created `app/contact/page.tsx` — hero, contact cards, form with SMS consent, bottom CTA
- [x] Updated `lib/businessInfo.ts` — added `phoneTel`, `emailHref`, `hours`; set real phone `(385) 535-5433`
- [x] Added `/contact/` to `app/sitemap.ts` with priority 0.8
- [x] Confirmed production domain `srenergy.us` — updated `BASE_URL` in `app/sitemap.ts`
- [x] Committed all work to git — commit `06ba839` (push pending credentials)
- [x] Build clean: 0 errors, 183 static pages

---

## Next Up

- [x] Replace placeholder phone number in `lib/businessInfo.ts` with real number before launch
- [x] Complete S9 — ISR, deferred component loading, next/image, Lighthouse benchmarking, performance budget doc
- [x] Verify production domain — confirmed `srenergy.us`; updated `BASE_URL` in `app/sitemap.ts` and canonical in `app/contact/page.tsx`
- [ ] Submit sitemap to Google Search Console after deploy
- [ ] Work through `docs/directory-listings.md` and submit to all 13 directories
- [ ] Deploy to Vercel following `DEPLOYMENT.md`
