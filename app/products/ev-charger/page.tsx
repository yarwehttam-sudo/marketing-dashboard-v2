import type { Metadata } from 'next';
import EvChargerClient from './EvChargerClient';

export const metadata: Metadata = {
  title: 'Home EV Charger Installation | SR Energy',
  description:
    'SR Energy installs Level 2 home EV chargers — certified electricians, permits handled, compatible with all major EV brands. No credit check required.',
  alternates: { canonical: 'https://srenergy.com/products/ev-charger/' },
  openGraph: {
    title: 'Home EV Charger Installation | SR Energy',
    description:
      'SR Energy installs Level 2 home EV chargers — certified electricians, permits handled, compatible with all major EV brands.',
    url: 'https://srenergy.com/products/ev-charger/',
  },
};

export default function EvChargerPage() {
  return <EvChargerClient />;
}
