import { logger } from './logger';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://drq.com.au';

// Core pages with their priorities
const CORE_PAGES: SitemapURL[] = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/services', priority: 0.9, changefreq: 'weekly' },
  { loc: '/areas', priority: 0.9, changefreq: 'weekly' },
  { loc: '/contact', priority: 0.8, changefreq: 'monthly' },
  { loc: '/about', priority: 0.8, changefreq: 'monthly' },
  { loc: '/emergency', priority: 0.9, changefreq: 'daily' },
  { loc: '/blog', priority: 0.7, changefreq: 'weekly' },
  { loc: '/gallery', priority: 0.6, changefreq: 'monthly' },
  { loc: '/testimonials', priority: 0.7, changefreq: 'weekly' },
  { loc: '/faq', priority: 0.7, changefreq: 'monthly' },
  { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { loc: '/terms', priority: 0.3, changefreq: 'yearly' }
];

// Service pages
const SERVICE_PAGES: SitemapURL[] = [
  { loc: '/services/water-damage', priority: 0.9, changefreq: 'weekly' },
  { loc: '/services/fire-damage', priority: 0.9, changefreq: 'weekly' },
  { loc: '/services/flood-recovery', priority: 0.9, changefreq: 'weekly' },
  { loc: '/services/mould-remediation', priority: 0.9, changefreq: 'weekly' },
  { loc: '/services/sewage-cleanup', priority: 0.9, changefreq: 'weekly' },
  { loc: '/services/commercial', priority: 0.9, changefreq: 'weekly' }
];

// Service areas
const SERVICE_AREAS: SitemapURL[] = [
  { loc: '/areas/brisbane', priority: 0.8, changefreq: 'monthly' },
  { loc: '/areas/gold-coast', priority: 0.8, changefreq: 'monthly' },
  { loc: '/areas/sunshine-coast', priority: 0.8, changefreq: 'monthly' }
];

function generateSitemapEntry(url: SitemapURL): string {
  const { loc, lastmod, changefreq, priority } = url;
  const fullUrl = `${BASE_URL}${loc}`;
  
  return `
    <url>
      <loc>${fullUrl}</loc>
      ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
      ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
      ${priority ? `<priority>${priority}</priority>` : ''}
    </url>`;
}

export async function generateAndValidateSitemap(): Promise<string> {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // Combine all URLs
    const allUrls = [
      ...CORE_PAGES,
      ...SERVICE_PAGES,
      ...SERVICE_AREAS
    ].map(url => ({
      ...url,
      lastmod: currentDate
    }));

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(generateSitemapEntry).join('')}
</urlset>`;

    // Basic validation
    if (!sitemap.includes('<?xml') || !sitemap.includes('</urlset>')) {
      throw new Error('Invalid sitemap structure');
    }

    logger.info('Sitemap generated successfully', {
      urlCount: allUrls.length,
      timestamp: new Date().toISOString()
    });

    return sitemap;
  } catch (error) {
    logger.error('Failed to generate sitemap:', error);
    throw error;
  }
}

// Function to validate individual URLs
export function validateSitemapUrl(url: SitemapURL): boolean {
  if (!url.loc.startsWith('/')) {
    logger.error('Invalid URL path:', url.loc);
    return false;
  }

  if (url.priority !== undefined && (url.priority < 0 || url.priority > 1)) {
    logger.error('Invalid priority for URL:', url.loc);
    return false;
  }

  if (url.lastmod && isNaN(Date.parse(url.lastmod))) {
    logger.error('Invalid lastmod date for URL:', url.loc);
    return false;
  }

  return true;
}

// Function to get all URLs (useful for testing)
export function getAllUrls(): string[] {
  return [
    ...CORE_PAGES,
    ...SERVICE_PAGES,
    ...SERVICE_AREAS
  ].map(url => url.loc);
}
