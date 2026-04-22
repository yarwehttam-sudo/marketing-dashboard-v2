'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { MetricRecord } from '@/lib/airtable';
import DateFilter from '@/components/DateFilter';
import KpiCard from '@/components/KpiCard';
import MetricsChart from '@/components/MetricsChart';
import ExportButton from '@/components/ExportButton';
import ErrorBoundary from '@/components/ErrorBoundary';

type DateRange = {
  startDate: string;
  endDate: string;
};

type Totals = {
  spend: number;
  impressions: number;
  conversions: number;
};

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00');
  return !isNaN(d.getTime());
}

function last30Days(): DateRange {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 30);
  return { startDate: toISODate(start), endDate: toISODate(end) };
}

function priorPeriod(range: DateRange): DateRange {
  const start = new Date(range.startDate + 'T00:00:00');
  const end   = new Date(range.endDate   + 'T00:00:00');
  const days  = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  const priorEnd   = new Date(start);
  priorEnd.setDate(priorEnd.getDate() - 1);
  const priorStart = new Date(priorEnd);
  priorStart.setDate(priorStart.getDate() - days);
  return { startDate: toISODate(priorStart), endDate: toISODate(priorEnd) };
}

function sumTotals(records: MetricRecord[]): Totals {
  return records.reduce(
    (acc, r) => ({
      spend:       acc.spend       + r.spend,
      impressions: acc.impressions + r.impressions,
      conversions: acc.conversions + r.conversions,
    }),
    { spend: 0, impressions: 0, conversions: 0 }
  );
}

function trendPct(current: number, prior: number): number {
  if (prior === 0) return 0;
  return parseFloat((((current - prior) / prior) * 100).toFixed(1));
}

async function fetchMetrics(range: DateRange): Promise<MetricRecord[]> {
  const params = new URLSearchParams({ startDate: range.startDate, endDate: range.endDate });
  const res = await fetch(`/api/metrics?${params.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Failed to load metrics.');
  }
  return res.json();
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-4 sm:flex-row sm:items-start sm:gap-4">
      <span className="shrink-0 text-yellow-500" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 mt-0.5">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </span>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-yellow-800">{message}</p>
        <button
          onClick={onRetry}
          className="w-fit rounded-lg border border-yellow-400 bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-800 transition hover:bg-yellow-200 active:scale-95"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Parse initial date range from URL, fall back to last 30 days if absent/invalid.
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const s = searchParams.get('startDate') ?? '';
    const e = searchParams.get('endDate')   ?? '';
    if (isValidDate(s) && isValidDate(e) && s <= e) {
      return { startDate: s, endDate: e };
    }
    return last30Days();
  });

  const [retryKey, setRetryKey] = useState(0);
  const [data, setData]         = useState<MetricRecord[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [totals, setTotals]     = useState<Totals>({ spend: 0, impressions: 0, conversions: 0 });
  const [trends, setTrends]     = useState<Totals>({ spend: 0, impressions: 0, conversions: 0 });

  // Skip pushing to URL on the very first render — the URL is already correct
  // (either from the address bar params, or we don't want to overwrite a clean /).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate:   dateRange.endDate,
    });
    router.push(`?${params.toString()}`, { scroll: false });
  }, [dateRange, router]);

  // Fetch metrics whenever dateRange or retryKey changes.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const [current, prior] = await Promise.all([
          fetchMetrics(dateRange),
          fetchMetrics(priorPeriod(dateRange)),
        ]);

        if (cancelled) return;

        const currentTotals = sumTotals(current);
        const priorTotals   = sumTotals(prior);

        setData(current);
        setTotals(currentTotals);
        setTrends({
          spend:       trendPct(currentTotals.spend,       priorTotals.spend),
          impressions: trendPct(currentTotals.impressions, priorTotals.impressions),
          conversions: trendPct(currentTotals.conversions, priorTotals.conversions),
        });
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : 'Unable to load metrics right now. Please try again in a moment.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [dateRange, retryKey]);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Client Dashboard</h1>
          <ExportButton data={data} dateRange={dateRange} />
        </div>

        {/* Date filter */}
        <DateFilter
          onFilterChange={setDateRange}
          initialStartDate={dateRange.startDate}
          initialEndDate={dateRange.endDate}
        />

        {/* Error banner */}
        {error && (
          <ErrorBanner
            message="Unable to load metrics right now. Please try again in a moment."
            onRetry={() => setRetryKey((k) => k + 1)}
          />
        )}

        {/* KPI cards */}
        <ErrorBoundary>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard title="Total Spend"  value={totals.spend}       format="currency" trend={trends.spend}       loading={loading} />
            <KpiCard title="Impressions"  value={totals.impressions}  format="number"   trend={trends.impressions}  loading={loading} />
            <KpiCard title="Conversions"  value={totals.conversions}  format="number"   trend={trends.conversions}  loading={loading} />
          </div>
        </ErrorBoundary>

        {/* Chart */}
        <ErrorBoundary>
          <MetricsChart data={data} />
        </ErrorBoundary>

      </div>
    </main>
  );
}
