import type { Metadata } from 'next';
import SolarClient from './SolarClient';

export const metadata: Metadata = {
  title: 'Solar Panels — No Credit Check | SR Energy',
  description:
    'SR Energy installs Tier 1 solar panels with no credit check required. Free site assessment, permits handled, professional installation — start saving from day one.',
  alternates: { canonical: 'https://srenergy.com/products/solar/' },
  openGraph: {
    title: 'Solar Panels — No Credit Check | SR Energy',
    description:
      'SR Energy installs Tier 1 solar panels with no credit check required. Free site assessment, permits handled, professional installation.',
    url: 'https://srenergy.com/products/solar/',
  },
};

export default function SolarPage() {
  return <SolarClient />;
}
