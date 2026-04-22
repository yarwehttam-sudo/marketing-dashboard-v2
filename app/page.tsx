import type { Metadata } from 'next';
import HomePageClient from '@/app/components/HomePageClient';

export const metadata: Metadata = {
  title: 'Home Energy Upgrades — No Credit Check | SR Energy',
  description:
    'SR Energy installs Tier 1 solar panels, home batteries, and EV chargers for homeowners across 30+ states — with no credit check required. 13 years of experience. Free quotes.',
  alternates: { canonical: 'https://srenergy.us/' },
  openGraph: {
    title: 'Home Energy Upgrades — No Credit Check | SR Energy',
    description:
      'SR Energy installs Tier 1 solar panels, home batteries, and EV chargers for homeowners across 30+ states — with no credit check required. 13 years of experience. Free quotes.',
    url: 'https://srenergy.us/',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
