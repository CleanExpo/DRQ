import { SitemapEntry } from './schema';

const generateSitemapXml = (entries: SitemapEntry[]): string => {
  const items = entries.map(entry => `
    <url>
      <loc>${entry.url}</loc>
      ${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ''}
      ${entry.changeFreq ? `<changefreq>${entry.changeFreq}</changefreq>` : ''}
      ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${items}
    </urlset>`;
};

export const getSitemapEntries = async (): Promise<SitemapEntry[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://disasterrecoveryqld.au';
  
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFreq: 'daily',
      priority: 1.0
    }
  ];
};

export { generateSitemapXml };
