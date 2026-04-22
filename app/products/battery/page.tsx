import type { Metadata } from 'next';
import BatteryClient from './BatteryClient';

export const metadata: Metadata = {
  title: 'Home Battery Storage | SR Energy',
  description:
    'Keep the lights on when the grid goes out. SR Energy installs home battery systems — no credit check, no solar required. Texas VPP eligible homes get one free.',
  alternates: { canonical: 'https://srenergy.com/products/battery/' },
  openGraph: {
    title: 'Home Battery Storage | SR Energy',
    description:
      'Keep the lights on when the grid goes out. SR Energy installs home battery systems — no credit check, no solar required.',
    url: 'https://srenergy.com/products/battery/',
  },
};

export default function BatteryPage() {
  return <BatteryClient />;
}
