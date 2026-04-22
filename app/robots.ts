import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/thank-you', '/_next/'],
    },
    sitemap: 'https://srenergy.com/sitemap.xml',
  };
}
