'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { MetricRecord } from '@/lib/airtable';

type Props = {
  data: MetricRecord[];
};

const LINES = [
  { key: 'spend',       label: 'Spend',       color: '#1A56DB', yAxisId: 'left'  },
  { key: 'impressions', label: 'Impressions',  color: '#7C3AED', yAxisId: 'right' },
  { key: 'conversions', label: 'Conversions',  color: '#059669', yAxisId: 'right' },
] as const;

type LineKey = (typeof LINES)[number]['key'];

function formatCurrency(value: number): string {
  return '$' + Math.round(value).toLocaleString('en-US');
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1_000)     return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return value.toLocaleString('en-US');
}

function formatXAxis(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type TooltipPayloadEntry = {
  name: string;
  value: number;
  color: string;
  dataKey: string;
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg text-sm">
      <p className="mb-2 font-semibold text-gray-700">{label ? formatXAxis(label) : ''}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </span>
          <span className="font-medium text-gray-900">
            {entry.dataKey === 'spend'
              ? formatCurrency(entry.value)
              : entry.value.toLocaleString('en-US')}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({
  hidden,
  onToggle,
}: {
  hidden: Set<LineKey>;
  onToggle: (key: LineKey) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-2">
      {LINES.map(({ key, label, color }) => {
        const isHidden = hidden.has(key);
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className="flex items-center gap-1.5 text-sm transition"
            style={{ opacity: isHidden ? 0.35 : 1 }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-600">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function MetricsChart({ data }: Props) {
  const [hidden, setHidden] = useState<Set<LineKey>>(new Set());

  function toggleLine(key: LineKey) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">Weekly Performance</h2>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          No data for this date range.
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

              <XAxis
                dataKey="weekStart"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                yAxisId="left"
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={72}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatCompact}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={56}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend content={() => <CustomLegend hidden={hidden} onToggle={toggleLine} />} />

              {LINES.map(({ key, label, color, yAxisId }) => (
                <Line
                  key={key}
                  yAxisId={yAxisId}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  hide={hidden.has(key)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          <CustomLegend hidden={hidden} onToggle={toggleLine} />
        </>
      )}
    </div>
  );
}
