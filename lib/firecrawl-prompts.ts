import { z } from 'zod';
import type {
  CompetitorIntel,
  DenialPost,
  PropertyEnrichment,
  UtahEVLead,
  UtilityRate,
} from './firecrawl.types';

export interface PromptConfig<T> {
  schema: z.ZodType<T>;
  prompt: string;
  urlPatterns: string[];
}

// ─── Enrichment ───────────────────────────────────────────────────────────────

export const ENRICHMENT_PROMPT: PromptConfig<PropertyEnrichment> = {
  schema: z.object({
    homeValueEst: z.number().nullable(),
    roofSizeEstSqft: z.number().nullable(),
    yearBuilt: z.number().nullable(),
    roofOrientation: z
      .enum(['South-facing', 'East/West', 'North-facing', 'Mixed', 'Unknown'])
      .nullable(),
    avgUtilityBillEst: z.number().nullable(),
    utilityCompany: z.string().nullable(),
    sourceUrls: z.array(z.string()),
  }),
  prompt:
    'Extract property data including estimated home value, roof square footage, year built, ' +
    'roof orientation (best inference from listing photos or description), estimated monthly ' +
    'utility bill for the area, and the local utility company name. Return null for any field ' +
    'that cannot be confidently extracted. Do not guess.',
  urlPatterns: [
    'https://www.zillow.com/homes/*',
    'https://*.utahcounty.gov/assessor/*',
    'https://*.slco.org/assessor/*',
    'https://assessor.utah.gov/*',
  ],
};

// ─── Incentive ────────────────────────────────────────────────────────────────

export const INCENTIVE_PROMPT: PromptConfig<UtilityRate> = {
  schema: z.object({
    incentiveName: z.string().nullable(),
    incentiveType: z.string().nullable(),
    amount: z.number().nullable(),
    amountType: z.enum(['flat', 'percentage', 'per-kw']).nullable(),
    effectiveDate: z.string().nullable(),
    expirationDate: z.string().nullable(),
    federalITCStatus: z.string().nullable(),
    stateTaxCreditAmount: z.number().nullable(),
    netMeteringRules: z.string().nullable(),
    utilityRebateProgram: z.string().nullable(),
  }),
  prompt:
    'Extract current solar incentives, rebates, net metering rules, federal ITC status, ' +
    'state tax credit amounts, and utility-specific rebate programs. Include the effective date ' +
    'and expiration date if listed. Mark fields as null rather than guessing.',
  urlPatterns: [
    'https://www.dsireusa.org/resources/incentives/*',
    'https://energy.utah.gov/*',
    'https://www.rockymountainpower.net/*',
    'https://www.pacificorp.com/*',
  ],
};

// ─── Competitor ───────────────────────────────────────────────────────────────

export const COMPETITOR_PROMPT: PromptConfig<CompetitorIntel> = {
  schema: z.object({
    company: z.string().nullable(),
    pricingDetails: z.string().nullable(),
    financingTerms: z.string().nullable(),
    requiresCreditCheck: z.boolean().nullable(),
    warrantyLengthYears: z.number().nullable(),
    promotionalOffers: z.string().nullable(),
    keyValueProps: z.string().nullable(),
  }),
  prompt:
    'Extract pricing details, financing terms (including any credit check requirements), ' +
    'warranty length, promotional offers, and key value propositions from this solar company ' +
    'landing page. Note specifically: does this competitor require a credit check or hard credit pull?',
  urlPatterns: [
    'https://www.sunrun.com/*',
    'https://us.sunpower.com/*',
    'https://palmettosolar.com/*',
    'https://blueravensolar.com/*',
    'https://www.suntempsolar.com/*',
  ],
};

// ─── Denial ───────────────────────────────────────────────────────────────────

export const DENIAL_PROMPT: PromptConfig<DenialPost> = {
  schema: z.object({
    isDenialPost: z.boolean(),
    originalPoster: z.string().nullable(),
    locationState: z.string().nullable(),
    deniedByCompany: z.string().nullable(),
    denialReason: z.string().nullable(),
    postDate: z.string().nullable(),
    emotionalTone: z.enum(['frustrated', 'resigned', 'seeking-help']).nullable(),
  }),
  prompt:
    'Identify if this post is from someone denied solar financing or rejected by a solar company. ' +
    'Extract: original poster, approximate location/state if mentioned, which company denied them ' +
    '(if named), reason given for denial, post date, and emotional tone (frustrated/resigned/seeking-help). ' +
    'Set isDenialPost to false if the post is not about a financing denial.',
  urlPatterns: [
    'https://www.reddit.com/r/solar/*',
    'https://www.reddit.com/r/SolarDIY/*',
    'https://www.reddit.com/r/personalfinance/*',
    'https://forums.solarpaneltalk.com/*',
  ],
};

// ─── Utah EV Lead ─────────────────────────────────────────────────────────────

export const UTAH_EV_LEAD_PROMPT: PromptConfig<UtahEVLead> = {
  schema: z.object({
    poster: z.string().nullable(),
    utahCity: z.string().nullable(),
    utahZip: z.string().nullable(),
    evMake: z.string().nullable(),
    evModel: z.string().nullable(),
    installationUrgency: z.enum(['urgent', 'soon', 'researching']).nullable(),
    solarInterest: z.boolean().nullable(),
  }),
  prompt:
    'Identify if this post is from a Utah homeowner looking to install an EV charger. ' +
    'Extract: poster, approximate Utah city/ZIP, EV make/model if mentioned, installation ' +
    'timeline urgency (urgent/soon/researching), and any signal of solar interest. ' +
    'Skip posts that are not about EV charger installation requests in Utah.',
  urlPatterns: [
    'https://www.reddit.com/r/Utah/*',
    'https://www.reddit.com/r/SaltLakeCity/*',
    'https://www.ksl.com/classifieds/*',
    'https://www.facebook.com/marketplace/*',
  ],
};
