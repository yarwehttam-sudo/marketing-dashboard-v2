export type FirecrawlJobType =
  | 'enrichment'
  | 'incentive'
  | 'competitor'
  | 'denial'
  | 'ev-lead'
  | 'seo'
  | 'test';

export type FirecrawlEndpoint = 'scrape' | 'extract' | 'crawl' | 'map' | 'search';

export interface FirecrawlLogEntry {
  jobType: FirecrawlJobType;
  url: string;
  creditsUsed: number;
  status: 'success' | 'error';
  resultPreview: string;
  errorMessage?: string;
  endpoint: FirecrawlEndpoint;
  duration: number; // ms
  timestamp: string;
}

export interface PropertyEnrichment {
  homeValueEst: number | null;
  roofSizeEstSqft: number | null;
  yearBuilt: number | null;
  roofOrientation: 'South-facing' | 'East/West' | 'North-facing' | 'Mixed' | 'Unknown' | null;
  avgUtilityBillEst: number | null;
  utilityCompany: string | null;
  sourceUrls: string[];
}

// Maps PropertyEnrichment to exact Notion Sales CRM property names
export interface SalesCRMEnrichmentUpdate {
  'Home Value Est': number | null;
  'Roof Size Est (sqft)': number | null;
  'Year Built': number | null;
  'Roof Orientation': 'South-facing' | 'East/West' | 'North-facing' | 'Mixed' | 'Unknown' | null;
  'Avg Utility Bill Est': number | null;
  'Utility Company': string | null;
  'Enrichment Status': 'Pending' | 'In Progress' | 'Complete' | 'Failed' | 'Skipped';
  'Enrichment Raw JSON': string;
  'Enrichment Source URLs': string;
  Notes?: string;
}

export interface UtilityRate {
  incentiveName: string | null;
  incentiveType: string | null;
  amount: number | null;
  amountType: 'flat' | 'percentage' | 'per-kw' | null;
  effectiveDate: string | null;
  expirationDate: string | null;
  federalITCStatus: string | null;
  stateTaxCreditAmount: number | null;
  netMeteringRules: string | null;
  utilityRebateProgram: string | null;
}

export interface CompetitorIntel {
  company: string | null;
  pricingDetails: string | null;
  financingTerms: string | null;
  requiresCreditCheck: boolean | null;
  warrantyLengthYears: number | null;
  promotionalOffers: string | null;
  keyValueProps: string | null;
}

export interface DenialPost {
  isDenialPost: boolean;
  originalPoster: string | null;
  locationState: string | null;
  deniedByCompany: string | null;
  denialReason: string | null;
  postDate: string | null;
  emotionalTone: 'frustrated' | 'resigned' | 'seeking-help' | null;
}

export interface UtahEVLead {
  poster: string | null;
  utahCity: string | null;
  utahZip: string | null;
  evMake: string | null;
  evModel: string | null;
  installationUrgency: 'urgent' | 'soon' | 'researching' | null;
  solarInterest: boolean | null;
}
