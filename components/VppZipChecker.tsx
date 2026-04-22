'use client';

import { useState } from 'react';
import { checkVppEligibility, VPP_UTILITY_COLORS } from '@/lib/vppZipData';

type UiState =
  | { status: 'idle' }
  | { status: 'invalid' }
  | { status: 'ineligible' }
  | { status: 'eligible'; utility: string; city: string; county: string };

export default function VppZipChecker({ citySlug }: { citySlug: string }) {
  const [zip, setZip] = useState('');
  const [uiState, setUiState] = useState<UiState>({ status: 'idle' });

  function handleCheck() {
    const trimmed = zip.trim();
    if (!/^\d{5}$/.test(trimmed)) {
      setUiState({ status: 'invalid' });
      return;
    }
    const result = checkVppEligibility(trimmed);
    if (result.eligible) {
      setUiState({
        status: 'eligible',
        utility: result.utility,
        city: result.city,
        county: result.county,
      });
    } else {
      setUiState({ status: 'ineligible' });
    }
  }

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 sm:px-8">
      <p className="mb-5 text-sm text-green-800">
        Enter your ZIP code to see if your address falls within an ERCOT-connected service
        territory covered by the Texas VPP program.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor="vpp-zip" className="sr-only">ZIP code</label>
          <input
            id="vpp-zip"
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
              if (uiState.status !== 'idle') setUiState({ status: 'idle' });
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="ZIP code (e.g. 77001)"
            className="w-full rounded-lg border border-green-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {uiState.status === 'invalid' && (
            <p className="mt-1.5 text-xs text-red-600">Please enter a valid 5-digit ZIP code.</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleCheck}
          className="shrink-0 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-500 transition-colors"
        >
          Check Eligibility
        </button>
      </div>

      {uiState.status === 'eligible' && (
        <div className="mt-5 rounded-xl border border-green-300 bg-white px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-green-900">
                Great news — ZIP {zip} looks eligible for the Texas VPP program!
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: VPP_UTILITY_COLORS[uiState.utility] ?? '#22C55E' }}
                >
                  {uiState.utility}
                </span>
                {uiState.city && (
                  <span className="text-xs text-gray-500">
                    {uiState.city}{uiState.county ? `, ${uiState.county} County` : ''}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-gray-600">
                A certified SR Energy advisor will confirm final eligibility based on your
                utility provider and property details. No credit check required.
              </p>
              <a
                href={`/get-quote?product=texas-vpp&state=TX&city=${citySlug}&zip=${zip}`}
                className="mt-3 inline-block rounded-lg bg-green-600 px-5 py-2 text-xs font-semibold text-white hover:bg-green-500 transition-colors"
              >
                Claim My Free Battery →
              </a>
            </div>
          </div>
        </div>
      )}

      {uiState.status === 'ineligible' && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-900">
            ZIP {zip} may be outside our current Texas VPP service area.
          </p>
          <p className="mt-1 text-xs text-gray-600">
            The program covers homes served by AEP, Oncor, CenterPoint, and TNMP. Contact us
            and we&apos;ll check if an expansion covers your address.
          </p>
          <a
            href={`/get-quote?product=texas-vpp&state=TX&city=${citySlug}&zip=${zip}`}
            className="mt-3 inline-block text-xs font-medium text-amber-700 hover:underline"
          >
            Contact us anyway →
          </a>
        </div>
      )}
    </div>
  );
}
