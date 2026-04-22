import { Client } from '@notionhq/client';
import type { UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import type { FirecrawlLogEntry, SalesCRMEnrichmentUpdate } from './firecrawl.types';

export interface LeadInput {
  contactName: string;
  email: string;
  phone?: string;
  address: string;
  zip: string;
  state: string;
  productInterest?: Array<'Solar Panels' | 'Home Battery' | 'EV Charger' | 'Complete Package'>;
  monthlyElectricBill?: number;
}

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is not set');
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2025-09-03',
});

const DATABASE_ID = process.env.NOTION_FIRECRAWL_OPS_DB_ID;

export const SALES_CRM_DATA_SOURCE_ID =
  process.env.NOTION_SALES_CRM_DATA_SOURCE_ID ?? 'a254df33-d6e3-487e-9fc1-ebc6f5059900';

const STATUS_MAP: Record<FirecrawlLogEntry['status'], 'Success' | 'Failed'> = {
  success: 'Success',
  error: 'Failed',
};

export async function logFirecrawlOp(entry: FirecrawlLogEntry): Promise<string | null> {
  if (!DATABASE_ID) {
    console.error('[notion] NOTION_FIRECRAWL_OPS_DB_ID is not set — skipping log');
    return null;
  }

  try {
    const page = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Job: {
          title: [{ text: { content: `${entry.jobType}: ${entry.url}` } }],
        },
        'Job Type': {
          select: { name: entry.jobType },
        },
        'Target URL': {
          url: entry.url,
        },
        'Credits Used': {
          number: entry.creditsUsed,
        },
        Status: {
          select: { name: STATUS_MAP[entry.status] },
        },
        'Result Preview': {
          rich_text: [{ text: { content: entry.resultPreview.slice(0, 200) } }],
        },
        ...(entry.errorMessage
          ? { 'Error Message': { rich_text: [{ text: { content: entry.errorMessage.slice(0, 500) } }] } }
          : {}),
        Endpoint: {
          select: { name: entry.endpoint },
        },
        'Duration (ms)': {
          number: entry.duration,
        },
      },
    });

    const pageUrl = `https://notion.so/${page.id.replace(/-/g, '')}`;
    console.log(`[notion] Firecrawl op logged: ${pageUrl}`);
    return pageUrl;
  } catch (err) {
    console.error('[notion] Failed to log Firecrawl op:', err);
    return null;
  }
}

export async function updateSalesCRMLead(
  pageId: string,
  update: SalesCRMEnrichmentUpdate,
): Promise<string | null> {
  try {
    type NotionProperties = UpdatePageParameters['properties'];
    const properties: NotionProperties = {
      'Enrichment Status': { select: { name: update['Enrichment Status'] } },
      'Enrichment Raw JSON': {
        rich_text: [{ text: { content: update['Enrichment Raw JSON'].slice(0, 2000) } }],
      },
      'Enrichment Source URLs': {
        rich_text: [{ text: { content: update['Enrichment Source URLs'].slice(0, 2000) } }],
      },
    };

    if (update['Home Value Est'] !== null) {
      properties['Home Value Est'] = { number: update['Home Value Est'] };
    }
    if (update['Roof Size Est (sqft)'] !== null) {
      properties['Roof Size Est (sqft)'] = { number: update['Roof Size Est (sqft)'] };
    }
    if (update['Year Built'] !== null) {
      properties['Year Built'] = { number: update['Year Built'] };
    }
    if (update['Roof Orientation'] !== null) {
      properties['Roof Orientation'] = { select: { name: update['Roof Orientation'] } };
    }
    if (update['Avg Utility Bill Est'] !== null) {
      properties['Avg Utility Bill Est'] = { number: update['Avg Utility Bill Est'] };
    }
    if (update['Utility Company'] !== null) {
      properties['Utility Company'] = {
        rich_text: [{ text: { content: update['Utility Company'] } }],
      };
    }
    if (update.Notes) {
      properties['Notes'] = {
        rich_text: [{ text: { content: update.Notes.slice(0, 2000) } }],
      };
    }

    const page = await notion.pages.update({ page_id: pageId, properties });
    const pageUrl = `https://notion.so/${page.id.replace(/-/g, '')}`;
    console.log(`[notion] Sales CRM lead updated: ${pageUrl}`);
    return pageUrl;
  } catch (err) {
    console.error('[notion] Failed to update Sales CRM lead:', err);
    return null;
  }
}

export async function createSalesCRMLead(input: LeadInput): Promise<{ pageId: string; pageUrl: string }> {
  const productOptions = (input.productInterest ?? []).map((name) => ({ name }));

  type NotionProperties = Parameters<typeof notion.pages.create>[0]['properties'];
  const properties: NotionProperties = {
    'Contact Name': { title: [{ text: { content: input.contactName } }] },
    Email: { email: input.email },
    Phone: { phone_number: input.phone ?? null },
    Address: { rich_text: [{ text: { content: input.address } }] },
    'ZIP Code': { rich_text: [{ text: { content: input.zip } }] },
    State: { rich_text: [{ text: { content: input.state } }] },
    'Pipeline Stage': { select: { name: 'New Lead' } },
    'Lead Source': { select: { name: 'Website' } },
    Priority: { select: { name: 'Warm' } },
    'Enrichment Status': { select: { name: 'Pending' } },
    Qualified: { select: { name: 'Pending Review' } },
  };

  if (input.monthlyElectricBill !== undefined) {
    properties['Monthly Electric Bill'] = { number: input.monthlyElectricBill };
  }
  if (productOptions.length > 0) {
    properties['Product Interest'] = { multi_select: productOptions };
  }

  const page = await notion.pages.create({
    parent: { database_id: SALES_CRM_DATA_SOURCE_ID },
    properties,
  });

  const pageId = page.id;
  const pageUrl = `https://notion.so/${pageId.replace(/-/g, '')}`;
  console.log(`[notion] Sales CRM lead created: ${pageUrl}`);
  return { pageId, pageUrl };
}
