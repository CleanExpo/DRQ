import { generateSitemapXML, generateRobotsTxt } from '../generate-sitemap';
import { SERVICE_TYPES } from '../../services/types/IServiceType';
import { SERVICE_REGIONS } from '../../services/types/IServiceArea';
import { parseStringPromise } from 'xml2js';

describe('Sitemap Generator', () => {
  describe('XML Generation', () => {
    it('should generate valid XML structure', async () => {
      const xml = generateSitemapXML([
        { loc: '/', priority: 1.0, changefreq: 'daily' }
      ]);

      // Parse XML to verify structure
      const result = await parseStringPromise(xml);
      expect(result).toHaveProperty('urlset');
      expect(result.urlset).toHaveProperty('url');
    });

    it('should include all core pages', async () => {
      const xml = generateSitemapXML([
        { loc: '/', priority: 1.0, changefreq: 'daily' },
        { loc: '/services', priority: 0.9, changefreq: 'weekly' },
        { loc: '/areas', priority: 0.9, changefreq: 'weekly' }
      ]);

      const result = await parseStringPromise(xml);
      const urls = result.urlset.url;

      expect(urls).toHaveLength(3);
      expect(urls.map((u: any) => u.loc[0])).toContain('https://drq.com.au/');
      expect(urls.map((u: any) => u.loc[0])).toContain('https://drq.com.au/services');
      expect(urls.map((u: any) => u.loc[0])).toContain('https://drq.com.au/areas');
    });

    it('should include all service pages', async () => {
      const serviceUrls = Object.values(SERVICE_TYPES).map(service => ({
        loc: `/services/${service.slug}`,
        priority: 0.8,
        changefreq: 'weekly' as const
      }));

      const xml = generateSitemapXML(serviceUrls);
      const result = await parseStringPromise(xml);
      const urls = result.urlset.url;

      expect(urls).toHaveLength(Object.keys(SERVICE_TYPES).length);
      
      // Check each service page is included
      Object.values(SERVICE_TYPES).forEach(service => {
        const serviceUrl = `https://drq.com.au/services/${service.slug}`;
        expect(urls.map((u: any) => u.loc[0])).toContain(serviceUrl);
      });
    });

    it('should include all area pages', async () => {
      const areaUrls = SERVICE_REGIONS.map(region => ({
        loc: `/areas/${region.id}`,
        priority: 0.8,
        changefreq: 'weekly' as const
      }));

      const xml = generateSitemapXML(areaUrls);
      const result = await parseStringPromise(xml);
      const urls = result.urlset.url;

      expect(urls).toHaveLength(SERVICE_REGIONS.length);
      
      // Check each area page is included
      SERVICE_REGIONS.forEach(region => {
        const areaUrl = `https://drq.com.au/areas/${region.id}`;
        expect(urls.map((u: any) => u.loc[0])).toContain(areaUrl);
      });
    });

    it('should include correct priorities and change frequencies', async () => {
      const xml = generateSitemapXML([
        { loc: '/', priority: 1.0, changefreq: 'daily' },
        { loc: '/services', priority: 0.9, changefreq: 'weekly' }
      ]);

      const result = await parseStringPromise(xml);
      const urls = result.urlset.url;

      const homePage = urls.find((u: any) => u.loc[0] === 'https://drq.com.au/');
      expect(homePage.priority[0]).toBe('1');
      expect(homePage.changefreq[0]).toBe('daily');

      const servicesPage = urls.find((u: any) => u.loc[0] === 'https://drq.com.au/services');
      expect(servicesPage.priority[0]).toBe('0.9');
      expect(servicesPage.changefreq[0]).toBe('weekly');
    });

    it('should include lastmod dates', async () => {
      const xml = generateSitemapXML([
        { loc: '/', priority: 1.0, changefreq: 'daily' }
      ]);

      const result = await parseStringPromise(xml);
      const url = result.urlset.url[0];

      expect(url.lastmod[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Robots.txt Generation', () => {
    it('should generate valid robots.txt content', () => {
      const robotsTxt = generateRobotsTxt();

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Sitemap: https://drq.com.au/sitemap.xml');
    });

    it('should include proper formatting and comments', () => {
      const robotsTxt = generateRobotsTxt();
      const lines = robotsTxt.split('\n');

      expect(lines[0]).toMatch(/^#/); // Should start with a comment
      expect(lines.some(line => line.trim() === 'User-agent: *')).toBe(true);
      expect(lines.some(line => line.trim() === 'Allow: /')).toBe(true);
      expect(lines.some(line => line.includes('Sitemap:'))).toBe(true);
    });
  });

  describe('URL Validation', () => {
    it('should handle special characters in URLs', async () => {
      const xml = generateSitemapXML([
        { loc: '/services/fire-&-water-damage', priority: 0.8 }
      ]);

      const result = await parseStringPromise(xml);
      const url = result.urlset.url[0].loc[0];
      
      expect(url).toBe('https://drq.com.au/services/fire-&-water-damage');
    });

    it('should handle URLs with query parameters', async () => {
      const xml = generateSitemapXML([
        { loc: '/search?category=emergency', priority: 0.7 }
      ]);

      const result = await parseStringPromise(xml);
      const url = result.urlset.url[0].loc[0];
      
      expect(url).toBe('https://drq.com.au/search?category=emergency');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty URL list', async () => {
      const xml = generateSitemapXML([]);
      const result = await parseStringPromise(xml);
      
      expect(result.urlset).toBeDefined();
      expect(result.urlset.url || []).toHaveLength(0);
    });

    it('should handle missing optional fields', async () => {
      const xml = generateSitemapXML([
        { loc: '/minimal-page' }
      ]);

      const result = await parseStringPromise(xml);
      const url = result.urlset.url[0];
      
      expect(url.loc).toBeDefined();
      expect(url.priority).toBeUndefined();
      expect(url.changefreq).toBeUndefined();
    });

    it('should handle invalid priorities gracefully', async () => {
      const xml = generateSitemapXML([
        { loc: '/', priority: 1.5 } // Invalid priority
      ]);

      const result = await parseStringPromise(xml);
      const url = result.urlset.url[0];
      
      expect(url.priority).toBeUndefined();
    });
  });
});
