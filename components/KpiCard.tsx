'use client';

type Props = {
  title: string;
  value: number;
  format: 'currency' | 'number';
  trend: number;
  loading?: boolean;
};

function formatValue(value: number, format: 'currency' | 'number'): string {
  if (format === 'currency') {
    return '$' + Math.round(value).toLocaleString('en-US');
  }

  const abs = Math.abs(value);
  let formatted: string;
  if (abs >= 1_000_000_000) {
    formatted = (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (abs >= 1_000_000) {
    formatted = (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (abs >= 1_000) {
    formatted = (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    formatted = value.toLocaleString('en-US');
  }
  return formatted;
}

function TrendIndicator({ trend }: { trend: number }) {
  if (trend === 0) {
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-gray-400">
        <span>—</span>
        <span>0%</span>
      </span>
    );
  }

  const isPositive = trend > 0;
  const colorClass = isPositive ? 'text-emerald-500' : 'text-red-500';
  const arrow = isPositive ? '↑' : '↓';
  const label = `${isPositive ? '+' : ''}${trend.toFixed(1)}%`;

  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${colorClass}`}>
      <span>{arrow}</span>
      <span>{label}</span>
    </span>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="h-3.5 w-24 animate-pulse rounded-full bg-gray-200" />
      <div className="h-8 w-32 animate-pulse rounded-full bg-gray-200" />
      <div className="h-3.5 w-16 animate-pulse rounded-full bg-gray-200" />
    </div>
  );
}

export default function KpiCard({ title, value, format, trend, loading }: Props) {
  if (loading) return <Skeleton />;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </p>
      <p className="text-3xl font-bold tracking-tight text-gray-900">
        {formatValue(value, format)}
      </p>
      <div className="flex items-center gap-1.5">
        <TrendIndicator trend={trend} />
        <span className="text-xs text-gray-400">vs prior period</span>
      </div>
    </div>
  );
}
