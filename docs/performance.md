# SR Energy — Performance

## Performance Targets

These targets must be met on a mid-range mobile device (or Chrome DevTools → Mobile, Moto G4 throttling) before launch.

| Metric | Target |
|---|---|
| Lighthouse Mobile Score | ≥ 85 |
| LCP (Largest Contentful Paint) | < 2.5 s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| INP (Interaction to Next Paint) | < 200 ms |
| Total page weight (compressed) | < 300 KB |

---

## Benchmark Results

| Date | Page Tested | Mobile Score | LCP | CLS | INP | Notes |
|---|---|---|---|---|---|---|
| — | Pre-launch — not yet measured | — | — | — | — | — |

---

## Optimization Log

| Optimization | Status | Details |
|---|---|---|
| SSG (Static Site Generation) | Done | All 182 pages pre-rendered at build time via `generateStaticParams` |
| Map iframe lazy load | Done | `loading="lazy"` on Google Maps embed in city pages |
| ISR (Incremental Static Regeneration) | Done | `export const revalidate = 86400` on state, city, and TX VPP pages |
| Deferred FaqAccordion | Done | `next/dynamic` with `ssr: false` on city and TX VPP pages |

---

## Next Steps

- [ ] Run Lighthouse after first production deploy
- [ ] Test `/locations/texas/houston` (city page) on mobile — most content-heavy city page
- [ ] Test `/locations/texas/houston/texas-vpp` (TX VPP page) on mobile — ZIP checker adds interactivity weight
- [ ] Record results in the Benchmark Results table above
- [ ] If mobile score < 85: audit heaviest resources in Lighthouse waterfall and address top offenders
