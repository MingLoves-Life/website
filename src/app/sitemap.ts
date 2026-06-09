import type { MetadataRoute } from 'next';

const BASE_URL = process.env.SITE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'zh'];
  const routes = ['', '/book'];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );
}
