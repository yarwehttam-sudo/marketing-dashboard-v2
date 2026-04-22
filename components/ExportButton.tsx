'use client';

import Papa from 'papaparse';
import type { MetricRecord } from '@/lib/airtable';

type Props = {
  data: MetricRecord[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
};

export default function ExportButton({ data, dateRange }: Props) {
  function handleExport() {
    const rows = data.map((record) => ({
      Week:        record.weekStart,
      Spend:       record.spend,
      Impressions: record.impressions,
      Conversions: record.conversions,
    }));

    const csv = Papa.unparse(rows, { header: true });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `metrics-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  const isEmpty = data.length === 0;

  return (
    <button
      onClick={handleExport}
      disabled={isEmpty}
      aria-label="Export filtered metrics as CSV"
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition
        hover:border-gray-400 hover:bg-gray-50
        active:scale-95
        disabled:cursor-not-allowed disabled:opacity-40
        focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
    >
      Export CSV
    </button>
  );
}
