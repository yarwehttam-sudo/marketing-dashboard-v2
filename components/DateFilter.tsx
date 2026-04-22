'use client';

import { useState, useEffect, useRef } from 'react';

type FilterValues = {
  startDate: string;
  endDate: string;
};

type Props = {
  onFilterChange: (filter: FilterValues) => void;
  initialStartDate?: string;
  initialEndDate?: string;
};

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function DateFilter({ onFilterChange, initialStartDate = '', initialEndDate = '' }: Props) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate]     = useState(initialEndDate);
  const [error, setError]         = useState('');

  // Skip firing onFilterChange on the first render — the parent already
  // has the correct initial value (from URL params or default range).
  const isMounted = useRef(false);

  function validate(start: string, end: string): boolean {
    if (start && end && end < start) {
      setError('End date must be on or after start date.');
      return false;
    }
    setError('');
    return true;
  }

  function apply(start: string, end: string) {
    if (validate(start, end) && start && end) {
      onFilterChange({ startDate: start, endDate: end });
    }
  }

  function handleStartChange(value: string) {
    setStartDate(value);
    validate(value, endDate);
  }

  function handleEndChange(value: string) {
    setEndDate(value);
    validate(startDate, value);
  }

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (startDate && endDate && !error) {
      onFilterChange({ startDate, endDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  function setLast30() {
    const end = today();
    const start = new Date(end);
    start.setDate(start.getDate() - 30);
    const s = toISODate(start);
    const e = toISODate(end);
    setStartDate(s);
    setEndDate(e);
    setError('');
    apply(s, e);
  }

  function setLast90() {
    const end = today();
    const start = new Date(end);
    start.setDate(start.getDate() - 90);
    const s = toISODate(start);
    const e = toISODate(end);
    setStartDate(s);
    setEndDate(e);
    setError('');
    apply(s, e);
  }

  function setThisYear() {
    const end = today();
    const start = new Date(end.getFullYear(), 0, 1);
    const s = toISODate(start);
    const e = toISODate(end);
    setStartDate(s);
    setEndDate(e);
    setError('');
    apply(s, e);
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Quick-select buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { label: 'Last 30 Days', action: setLast30 },
          { label: 'Last 90 Days', action: setLast90 },
          { label: 'This Year',    action: setThisYear },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 active:scale-95"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Date inputs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-gray-500" htmlFor="start-date">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => handleStartChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-gray-500" htmlFor="end-date">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => handleEndChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Inline validation error */}
      {error && (
        <p className="mt-3 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
