/**
 * 🚫 SHELVED — DO NOT USE — 2026-04-19
 *
 * This module is part of the abandoned Phase 2 lead enrichment pipeline.
 * Diagnostic test (Step 6) proved that property enrichment via Firecrawl
 * does not return usable data from county assessors, Zillow, or utilities.
 *
 * Why: URL-guessing patterns can't reach real parcel/property data on these
 * sources. County assessor pages return search forms, Zillow is JS-rendered
 * and hostile to scrapers, utility rate pages are PDFs.
 *
 * Decision: Property enrichment removed from SREnergy strategy. Sales reps
 * can look up Zillow on mobile during the call instead. Enrichment was not
 * needed for the "no credit check" value proposition anyway.
 *
 * See: docs/decisions/001-enrichment-shelved.md
 *
 * If reviving: scope it to one well-structured public source (DSIRE, US
 * Census API, etc.) — NOT three-source merge across hostile platforms.
 */

/**
 * Utah-only county assessor, utility, and Zillow URL resolvers.
 * Covers Salt Lake County (840–841) and Utah County (843–847).
 * Step 9 will expand this to additional Utah counties and other states.
 */

/**
 * Returns the county assessor search URL for the given ZIP, or null if outside
 * the Utah-only initial scope.
 */
export function resolveCountyAssessorUrl(zip: string): string | null {
  const prefix = parseInt(zip.slice(0, 3), 10);
  if (prefix >= 840 && prefix <= 841) {
    return 'https://slco.org/assessor/new/query/';
  }
  if (prefix >= 843 && prefix <= 847) {
    return 'https://maps.utahcounty.gov/parcel/';
  }
  return null;
}

/**
 * Returns the Rocky Mountain Power rate schedule URL for Utah ZIPs (840–847),
 * or null for non-Utah ZIPs.
 */
export function resolveUtilityRateUrl(zip: string): string | null {
  const prefix = parseInt(zip.slice(0, 3), 10);
  if (prefix >= 840 && prefix <= 847) {
    return 'https://www.rockymountainpower.net/savings-energy-choices/pricing-fees/rate-schedules.html';
  }
  return null;
}

/**
 * Builds a Zillow search URL for a given address and ZIP.
 * Uses Zillow's standard /homes/ search format.
 */
export function buildZillowSearchUrl(address: string, zip: string): string {
  const encoded = address.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  return `https://www.zillow.com/homes/${encoded}-${zip}_rb/`;
}
