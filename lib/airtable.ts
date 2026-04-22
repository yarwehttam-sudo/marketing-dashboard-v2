import 'server-only';

export type MetricRecord = {
  weekStart: string;
  spend: number;
  impressions: number;
  conversions: number;
};

type AirtableField = {
  week_start: string;
  spend: number;
  impressions: number;
  conversions: number;
};

type AirtableRecord = {
  id: string;
  fields: AirtableField;
};

type AirtableResponse = {
  records: AirtableRecord[];
  offset?: string;
};

export async function getMetrics(
  startDate: string,
  endDate: string
): Promise<MetricRecord[]> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error(
      'Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables.'
    );
  }

  const filterByFormula = `AND(
    IS_AFTER({week_start}, DATEADD("${startDate}", -1, 'days')),
    IS_BEFORE({week_start}, DATEADD("${endDate}", 1, 'days'))
  )`;

  const params = new URLSearchParams({
    filterByFormula,
    'sort[0][field]': 'week_start',
    'sort[0][direction]': 'asc',
  });

  const url = `https://api.airtable.com/v0/${baseId}/WeeklyMetrics?${params.toString()}`;

  const records: MetricRecord[] = [];
  let offset: string | undefined;

  do {
    const pageUrl = offset
      ? `${url}&offset=${offset}`
      : url;

    const res = await fetch(pageUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Airtable API error ${res.status}: ${error}`);
    }

    const data: AirtableResponse = await res.json();

    for (const record of data.records) {
      records.push({
        weekStart: record.fields.week_start,
        spend: record.fields.spend ?? 0,
        impressions: record.fields.impressions ?? 0,
        conversions: record.fields.conversions ?? 0,
      });
    }

    offset = data.offset;
  } while (offset);

  return records;
}
