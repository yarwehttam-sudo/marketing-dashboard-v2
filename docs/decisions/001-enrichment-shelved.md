# Decision 001: Property Enrichment Shelved

**Date:** 2026-04-19
**Status:** Decided — implemented
**Author:** Matthew (with Claude review)

## Context

Phase 2 of the SREnergy Firecrawl build (Steps 5-8) was lead enrichment: take a homeowner's address from a new lead, scrape three sources (county assessor, Zillow, utility company), and merge the results to populate the Sales CRM with property details (home value, roof size, year built, utility company, average bill).

The pitch: when a sales rep called the lead, they'd already have full context.

## Test (Step 6)

Built the full pipeline (Step 5: API route, Promise.allSettled merge logic, /extract calls). Ran a real diagnostic against Matthew's actual Utah home address.

### Results
- **County assessor (slco.org):** Returned the search page, not parcel data. URL-guessing pattern doesn't lead to actual records.
- **Zillow:** JS-rendered, hostile to scrapers. Even when page loaded, /extract returned nothing.
- **Rocky Mountain Power:** Returned a rate schedule directory PDF, not customer-facing data.

**Cost:** 18 Firecrawl credits.
**Useful fields extracted:** ZERO.

## Decision

Phase 2 (Steps 5-8) is shelved entirely.

## Why

1. Three-source merge against hostile platforms doesn't work as imagined. URL-guessing can't reach real data behind search forms, JS-only render walls, or PDF directories.
2. Even if we fixed source 1, the enrichment data isn't actually needed for the "no credit check, 30+ states" value proposition. The sales motion doesn't require it.
3. A sales rep can look up Zillow on their phone in 10 seconds during the call. Building infrastructure to automate this is over-engineering.
4. Spending 50+ more credits to keep iterating on this approach has zero strategic upside.

## What Was Kept

- Step 1-4 foundation (Firecrawl client, prompt library, Notion ops DB, Sales CRM schema upgrade) — all reusable for Phase 3 and beyond
- Step 5 code (pipeline.ts, utah-lookup.ts, enrich-lead route) — kept on disk with SHELVED headers, NOT called from anywhere
- Step 6 diagnostic — archived to scripts/archive/enrichment-diagnostic.ts for reference

## What Changed

- Steps 7 + 8 were removed from the build sequence entirely
- Pivoted to Step 9 (State Incentive Crawler) as the next phase

## Lessons For Future Phases

- **Test against ONE well-structured source first** before building merge logic across three hostile ones
- **Government data sources (DSIRE, state energy offices) are designed to be scraped** — much higher confidence
- **The right question is "does this enrichment change the sales motion?"** not "can we technically scrape this?"
- Phase 3 (Step 9) targets DSIRE specifically because it's a public structured database, not a hostile platform
