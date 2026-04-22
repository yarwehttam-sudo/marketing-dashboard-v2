'use client';

import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <dl className="divide-y divide-gray-200 rounded-xl border border-gray-200 overflow-hidden">
      {items.map((item, i) => (
        <div key={i} className="bg-white">
          <dt>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <span>{item.q}</span>
              <svg
                className={`h-5 w-5 shrink-0 text-green-600 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </button>
          </dt>
          {open === i && (
            <dd className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed">
              {item.a}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
