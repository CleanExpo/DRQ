import { generateAndValidateSitemap, validateSitemapUrl, getAllUrls } from '../sitemap';

describe('Sitemap Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_BASE_URL = 'https://drq.com.au';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateAndValidateSitemap', () => {
    it('should generate valid XML sitemap', async () => {
      const sitemap = await generateAndValidateSitemap();
      
      // Check XML structure
      expect(sitemap).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap).toMatch(/<\/urlset>$/);
      
      // Check core pages
      expect(sitemap).toContain('<loc>https://drq.com.au/</loc>');
      expect(sitemap).toContain('<loc>https://drq.com.au/services</loc>');
      expect(sitemap).toContain('<loc>https://drq.com.au/about</loc>');
      
      // Check service pages
      expect(sitemap).toContain('<loc>https://drq.com.au/services/water-damage</loc>');
      expect(sitemap).toContain('<loc>https://drq.com.au/services/fire-damage</loc>');
      
      // Check area pages
      expect(sitemap).toContain('<loc>https://drq.com.au/areas/brisbane</loc>');
      expect(sitemap).toContain('<loc>https://drq.com.au/areas/gold-coast</loc>');
    });

    it('should include lastmod dates', async () => {
      const sitemap = await generateAndValidateSitemap();
      const today = new Date().toISOString().split('T')[0];
      
      expect(sitemap).toContain(`<lastmod>${today}</lastmod>`);
    });

    it('should include proper priorities', async () => {
      const sitemap = await generateAndValidateSitemap();
      
      // Home page should have highest priority
      expect(sitemap).toContain('<priority>1</priority>');
      
      // Service pages should have high priority
      expect(sitemap).toContain('<priority>0.9</priority>');
      
      // Legal pages should have lower priority
      expect(sitemap).toContain('<priority>0.3</priority>');
    });

    it('should handle missing BASE_URL gracefully', async () => {
      delete process.env.NEXT_PUBLIC_BASE_URL;
      const sitemap = await generateAndValidateSitemap();
      expect(sitemap).toContain('<loc>https://drq.com.au/</loc>');
    });
  });

  describe('validateSitemapUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateSitemapUrl({
        loc: '/services',
        priority: 0.9,
        changefreq: 'weekly'
      })).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateSitemapUrl({
        loc: 'invalid-url',
        priority: 0.9
      })).toBe(false);
    });

    it('should reject invalid priorities', () => {
      expect(validateSitemapUrl({
        loc: '/services',
        priority: 1.5
      })).toBe(false);

      expect(validateSitemapUrl({
        loc: '/services',
        priority: -0.5
      })).toBe(false);
    });

    it('should reject invalid dates', () => {
      expect(validateSitemapUrl({
        loc: '/services',
        lastmod: 'invalid-date'
      })).toBe(false);
    });
  });

  describe('getAllUrls', () => {
    it('should return all defined URLs', () => {
      const urls = getAllUrls();
      
      // Core pages
      expect(urls).toContain('/');
      expect(urls).toContain('/services');
      expect(urls).toContain('/about');
      expect(urls).toContain('/contact');
      
      // Service pages
      expect(urls).toContain('/services/water-damage');
      expect(urls).toContain('/services/fire-damage');
      expect(urls).toContain('/services/flood-recovery');
      expect(urls).toContain('/services/mould-remediation');
      expect(urls).toContain('/services/sewage-cleanup');
      expect(urls).toContain('/services/commercial');
      
      // Area pages
      expect(urls).toContain('/areas/brisbane');
      expect(urls).toContain('/areas/gold-coast');
      expect(urls).toContain('/areas/sunshine-coast');
      
      // Additional pages
      expect(urls).toContain('/blog');
      expect(urls).toContain('/gallery');
      expect(urls).toContain('/testimonials');
      expect(urls).toContain('/faq');
      expect(urls).toContain('/privacy');
      expect(urls).toContain('/terms');
    });

    it('should not have duplicate URLs', () => {
      const urls = getAllUrls();
      const uniqueUrls = new Set(urls);
      expect(urls.length).toBe(uniqueUrls.size);
    });

    it('should have all URLs starting with /', () => {
      const urls = getAllUrls();
      urls.forEach(url => {
        expect(url.startsWith('/')).toBe(true);
      });
    });
  });

  describe('Sitemap Coverage', () => {
    it('should include all required page types', () => {
      const urls = getAllUrls();
      
      // Check page categories
      const hasCorePage = urls.some(url => url === '/');
      const hasServicePage = urls.some(url => url.startsWith('/services/'));
      const hasAreaPage = urls.some(url => url.startsWith('/areas/'));
      const hasLegalPage = urls.some(url => url === '/privacy' || url === '/terms');
      const hasContactPage = urls.some(url => url === '/contact');
      const hasEmergencyPage = urls.some(url => url === '/emergency');
      
      expect(hasCorePage).toBe(true);
      expect(hasServicePage).toBe(true);
      expect(hasAreaPage).toBe(true);
      expect(hasLegalPage).toBe(true);
      expect(hasContactPage).toBe(true);
      expect(hasEmergencyPage).toBe(true);
    });

    it('should have appropriate change frequencies', async () => {
      const sitemap = await generateAndValidateSitemap();
      
      // Emergency pages should update frequently
      expect(sitemap).toContain('<changefreq>daily</changefreq>');
      
      // Service pages should update regularly
      expect(sitemap).toContain('<changefreq>weekly</changefreq>');
      
      // Legal pages should update rarely
      expect(sitemap).toContain('<changefreq>yearly</changefreq>');
    });
  });
});
