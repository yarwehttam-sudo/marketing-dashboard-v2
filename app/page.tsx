'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MetricRecord } from '@/lib/airtable';
import DateFilter from '@/components/DateFilter';
import KpiCard from '@/components/KpiCard';
import MetricsChart from '@/components/MetricsChart';
import ExportButton from '@/components/ExportButton';
import ErrorBoundary from '@/components/ErrorBoundary';

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function defaultDateRange() {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 90);
  return { startDate: toISODate(start), endDate: toISODate(end) };
}

function computeKpis(records: MetricRecord[]) {
  const totalSpend = records.reduce((sum, r) => sum + r.spend, 0);
  const totalImpressions = records.reduce((sum, r) => sum + r.impressions, 0);
  const totalConversions = records.reduce((sum, r) => sum + r.conversions, 0);
  const cpl = totalConversions > 0 ? totalSpend / totalConversions : 0;
  return { totalSpend, totalImpressions, totalConversions, cpl };
}

export default function DashboardPage() {
  const defaults = defaultDateRange();
  const [dateRange, setDateRange] = useState(defaults);
  const [records, setRecords] = useState<MetricRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/metrics?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data: MetricRecord[] = await res.json();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(dateRange.startDate, dateRange.endDate);
  }, []);

  function handleFilterChange(range: { startDate: string; endDate: string }) {
    setDateRange(range);
    fetchMetrics(range.startDate, range.endDate);
  }

  const { totalSpend, totalImpressions, totalConversions, cpl } = computeKpis(records);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Marketing Dashboard</h1>
        <p className="text-sm text-gray-500">Weekly spend, impressions, and conversions from Airtable.</p>
      </div>

      <div className="mb-6">
        <DateFilter
          onFilterChange={handleFilterChange}
          initialStartDate={dateRange.startDate}
          initialEndDate={dateRange.endDate}
        />
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard title="Total Spend"       value={totalSpend}       format="currency" trend={0} loading={loading} />
        <KpiCard title="Impressions"       value={totalImpressions} format="number"   trend={0} loading={loading} />
        <KpiCard title="Conversions"       value={totalConversions} format="number"   trend={0} loading={loading} />
        <KpiCard title="Cost per Lead"     value={cpl}              format="currency" trend={0} loading={loading} />
      </div>

      <div className="mb-4">
        <ErrorBoundary>
          <MetricsChart data={records} />
        </ErrorBoundary>
      </div>

      <div className="flex justify-end">
        <ExportButton data={records} dateRange={dateRange} />
      </div>
    </main>
  );
}
