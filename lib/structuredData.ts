import type { City, State } from './locations';
import { BUSINESS_INFO } from './businessInfo';

export function buildLocalBusinessSchema(city: City, state: State) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${BUSINESS_INFO.name} — ${city.name}, ${state.name}`,
    email: BUSINESS_INFO.email,
    url: `${BUSINESS_INFO.url}/locations/${state.slug}/${city.slug}/`,
    image: `${BUSINESS_INFO.url}/og-image.jpg`,
    description: `No credit check solar panel installation, battery storage, and EV charger services in ${city.name}, ${state.name}.`,
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: state.abbr,
      addressCountry: 'US',
    },
    priceRange: 'Free quote',
    knowsAbout: [
      'solar panels',
      'home battery storage',
      'EV chargers',
      'no credit check solar financing',
    ],
  };
}

export function buildServiceSchema(service: string, city: City, state: State) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service,
    description: `${service} available in ${city.name}, ${state.name} through SR Energy. No credit check required.`,
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS_INFO.name,
      email: BUSINESS_INFO.email,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    serviceType: service,
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function buildReviewSchema(city: City, state: State) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${BUSINESS_INFO.name} — ${city.name}, ${state.name}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 127,
      bestRating: 5,
    },
  };
}
