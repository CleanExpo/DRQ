import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { SERVICE_TYPES } from '../services/types/IServiceType';
import { SERVICE_REGIONS } from '../services/types/IServiceArea';

const BASE_URL = 'https://drq.com.au';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

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

function generateServiceURLs(): SitemapURL[] {
  return Object.values(SERVICE_TYPES).map(service => ({
    loc: `/services/${service.slug}`,
    priority: 0.8,
    changefreq: 'weekly'
  }));
}

function generateAreaURLs(): SitemapURL[] {
  return SERVICE_REGIONS.map(region => ({
    loc: `/areas/${region.id}`,
    priority: 0.8,
    changefreq: 'weekly'
  }));
}

function generateSitemapXML(urls: SitemapURL[]): string {
  const currentDate = new Date().toISOString().split('T')[0];

  const urlElements = urls.map(url => `
    <url>
      <loc>${BASE_URL}${url.loc}</loc>
      <lastmod>${currentDate}</lastmod>
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
      ${url.priority ? `<priority>${url.priority}</priority>` : ''}
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlElements}
</urlset>`;
}

function generateRobotsTxt(): string {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml`;
}

function main() {
  try {
    // Generate all URLs
    const allUrls = [
      ...CORE_PAGES,
      ...generateServiceURLs(),
      ...generateAreaURLs()
    ];

    // Generate sitemap XML
    const sitemapXML = generateSitemapXML(allUrls);
    const publicDir = resolve(process.cwd(), 'public');
    
    // Write sitemap.xml
    writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemapXML);
    console.log('✅ Generated sitemap.xml');

    // Write robots.txt
    const robotsTxt = generateRobotsTxt();
    writeFileSync(resolve(publicDir, 'robots.txt'), robotsTxt);
    console.log('✅ Generated robots.txt');

    // Generate URL report
    const report = `
Site URLs Report
===============

Total URLs: ${allUrls.length}

Core Pages: ${CORE_PAGES.length}
Service Pages: ${Object.keys(SERVICE_TYPES).length}
Area Pages: ${SERVICE_REGIONS.length}

High Priority (0.8-1.0): ${allUrls.filter(url => url.priority && url.priority >= 0.8).length}
Medium Priority (0.5-0.7): ${allUrls.filter(url => url.priority && url.priority >= 0.5 && url.priority < 0.8).length}
Low Priority (<0.5): ${allUrls.filter(url => url.priority && url.priority < 0.5).length}

Daily Updates: ${allUrls.filter(url => url.changefreq === 'daily').length}
Weekly Updates: ${allUrls.filter(url => url.changefreq === 'weekly').length}
Monthly Updates: ${allUrls.filter(url => url.changefreq === 'monthly').length}
Yearly Updates: ${allUrls.filter(url => url.changefreq === 'yearly').length}

Generated: ${new Date().toISOString()}
    `;

    writeFileSync(resolve(process.cwd(), 'sitemap-report.txt'), report);
    console.log('✅ Generated sitemap report');

    // Validate URLs
    const invalidUrls = allUrls.filter(url => !url.loc.startsWith('/'));
    if (invalidUrls.length > 0) {
      console.error('❌ Found invalid URLs:', invalidUrls);
      process.exit(1);
    }

    console.log('✅ All URLs validated');
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { generateSitemapXML, generateRobotsTxt };
