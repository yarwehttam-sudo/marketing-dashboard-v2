import { NextRequest, NextResponse } from 'next/server';
import { getMetrics } from '@/lib/airtable';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Both startDate and endDate query parameters are required.' },
      { status: 400 }
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json(
      { error: 'startDate and endDate must be valid ISO date strings.' },
      { status: 400 }
    );
  }

  if (start > end) {
    return NextResponse.json(
      { error: 'startDate must not be after endDate.' },
      { status: 400 }
    );
  }

  try {
    const metrics = await getMetrics(startDate, endDate);
    return NextResponse.json(metrics, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : '';

    if (message.includes('AIRTABLE_API_KEY') || message.includes('AIRTABLE_BASE_ID')) {
      return NextResponse.json(
        {
          error: 'The server is not configured. AIRTABLE_API_KEY and AIRTABLE_BASE_ID must be set in .env.local.',
          code: 'MISSING_CREDENTIALS',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch metrics. Please try again later.' },
      { status: 500 }
    );
  }
}
