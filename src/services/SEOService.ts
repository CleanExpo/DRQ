import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
  media?: string;
  type?: string;
}

interface StructuredData {
  type: string;
  data: Record<string, any>;
}

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  metaTags: MetaTag[];
  linkTags: LinkTag[];
  structuredData?: StructuredData[];
  robots?: string;
  canonical?: string;
  alternates?: Array<{
    href: string;
    hreflang: string;
  }>;
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    image?: string;
    siteName?: string;
    locale?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

interface PageSEO {
  id: string;
  path: string;
  config: SEOConfig;
  metadata: {
    createdAt: string;
    updatedAt: string;
    lastAnalyzed?: string;
    score?: number;
    issues?: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      message: string;
    }>;
  };
}

interface SEOMetrics {
  totalPages: number;
  averageScore: number;
  issuesByType: Record<string, number>;
  issuesBySeverity: Record<string, number>;
  topIssues: Array<{
    type: string;
    count: number;
    severity: string;
  }>;
  lastUpdate: number;
}

class SEOService {
  private static instance: SEOService;
  private pages: Map<string, PageSEO> = new Map();
  private metrics: SEOMetrics;
  private observers: ((type: string, data: any) => void)[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
  }

  public static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  private initializeMetrics(): SEOMetrics {
    return {
      totalPages: 0,
      averageScore: 0,
      issuesByType: {},
      issuesBySeverity: {},
      topIssues: [],
      lastUpdate: Date.now()
    };
  }

  public async getPageSEO(path: string): Promise<PageSEO | null> {
    try {
      const cacheKey = `seo:${path}`;
      const cached = await cacheService.get<PageSEO>(cacheKey);

      if (cached) {
        logger.debug('SEO config loaded from cache', { path });
        return cached;
      }

      const page = this.pages.get(path);
      if (page) {
        await cacheService.set(cacheKey, page, {
          ttl: 3600000, // 1 hour
          type: 'seo'
        });
      }

      return page || null;
    } catch (error) {
      logger.error('Failed to get page SEO', { path, error });
      return null;
    }
  }

  public async setPageSEO(path: string, config: SEOConfig): Promise<PageSEO> {
    try {
      const existingPage = this.pages.get(path);
      const page: PageSEO = {
        id: existingPage?.id || this.generateId(),
        path,
        config,
        metadata: {
          createdAt: existingPage?.metadata.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      this.pages.set(path, page);
      this.updateMetrics();
      this.notifyObservers('seo:updated', page);

      // Invalidate cache
      await cacheService.invalidate(`seo:${path}`);

      logger.debug('SEO config updated', { path });
      return page;
    } catch (error) {
      logger.error('Failed to set page SEO', { path, error });
      throw error;
    }
  }

  public async analyzePage(path: string): Promise<PageSEO> {
    try {
      const page = this.pages.get(path);
      if (!page) {
        throw new Error(`Page not found: ${path}`);
      }

      const issues = this.analyzeConfig(page.config);
      const score = this.calculateScore(issues);

      const analyzedPage: PageSEO = {
        ...page,
        metadata: {
          ...page.metadata,
          lastAnalyzed: new Date().toISOString(),
          score,
          issues
        }
      };

      this.pages.set(path, analyzedPage);
      this.updateMetrics();
      this.notifyObservers('seo:analyzed', analyzedPage);

      logger.debug('SEO analysis completed', { path, score });
      return analyzedPage;
    } catch (error) {
      logger.error('Failed to analyze page', { path, error });
      throw error;
    }
  }

  private analyzeConfig(config: SEOConfig): PageSEO['metadata']['issues'] {
    const issues: PageSEO['metadata']['issues'] = [];

    // Title analysis
    if (!config.title) {
      issues.push({
        type: 'missing_title',
        severity: 'high',
        message: 'Page title is missing'
      });
    } else if (config.title.length < 30 || config.title.length > 60) {
      issues.push({
        type: 'title_length',
        severity: 'medium',
        message: 'Title length should be between 30-60 characters'
      });
    }

    // Description analysis
    if (!config.description) {
      issues.push({
        type: 'missing_description',
        severity: 'high',
        message: 'Meta description is missing'
      });
    } else if (config.description.length < 120 || config.description.length > 160) {
      issues.push({
        type: 'description_length',
        severity: 'medium',
        message: 'Description length should be between 120-160 characters'
      });
    }

    // Keywords analysis
    if (!config.keywords || config.keywords.length === 0) {
      issues.push({
        type: 'missing_keywords',
        severity: 'low',
        message: 'Meta keywords are missing'
      });
    }

    // Open Graph analysis
    if (!config.openGraph) {
      issues.push({
        type: 'missing_og',
        severity: 'medium',
        message: 'Open Graph tags are missing'
      });
    } else {
      if (!config.openGraph.image) {
        issues.push({
          type: 'missing_og_image',
          severity: 'medium',
          message: 'Open Graph image is missing'
        });
      }
    }

    // Twitter Card analysis
    if (!config.twitter) {
      issues.push({
        type: 'missing_twitter',
        severity: 'low',
        message: 'Twitter Card tags are missing'
      });
    }

    // Structured Data analysis
    if (!config.structuredData || config.structuredData.length === 0) {
      issues.push({
        type: 'missing_structured_data',
        severity: 'medium',
        message: 'Structured Data is missing'
      });
    }

    // Canonical URL analysis
    if (!config.canonical) {
      issues.push({
        type: 'missing_canonical',
        severity: 'medium',
        message: 'Canonical URL is missing'
      });
    }

    return issues;
  }

  private calculateScore(issues: PageSEO['metadata']['issues']): number {
    const baseScore = 100;
    const deductions = {
      high: 20,
      medium: 10,
      low: 5
    };

    return issues.reduce((score, issue) => {
      return score - deductions[issue.severity];
    }, baseScore);
  }

  public async generateSitemap(): Promise<string> {
    try {
      const pages = Array.from(this.pages.values());
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${page.path}</loc>
    <lastmod>${page.metadata.updatedAt}</lastmod>
  </url>
  `).join('')}
</urlset>`;

      return sitemap.trim();
    } catch (error) {
      logger.error('Failed to generate sitemap', { error });
      throw error;
    }
  }

  public async generateRobotsTxt(): Promise<string> {
    try {
      return `User-agent: *
Allow: /
Sitemap: /sitemap.xml`;
    } catch (error) {
      logger.error('Failed to generate robots.txt', { error });
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onSEOEvent(callback: (type: string, data: any) => void): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  private notifyObservers(type: string, data: any): void {
    this.observers.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        logger.error('SEO event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const pages = Array.from(this.pages.values());
    const pagesWithIssues = pages.filter(p => p.metadata.issues);

    const issuesByType: Record<string, number> = {};
    const issuesBySeverity: Record<string, number> = {};

    pagesWithIssues.forEach(page => {
      page.metadata.issues?.forEach(issue => {
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
        issuesBySeverity[issue.severity] = (issuesBySeverity[issue.severity] || 0) + 1;
      });
    });

    const topIssues = Object.entries(issuesByType)
      .map(([type, count]) => ({
        type,
        count,
        severity: this.getIssueSeverity(type)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    this.metrics = {
      totalPages: pages.length,
      averageScore: pages.reduce((sum, page) => sum + (page.metadata.score || 0), 0) / pages.length,
      issuesByType,
      issuesBySeverity,
      topIssues,
      lastUpdate: Date.now()
    };
  }

  private getIssueSeverity(type: string): string {
    const severityMap: Record<string, string> = {
      missing_title: 'high',
      missing_description: 'high',
      title_length: 'medium',
      description_length: 'medium',
      missing_og: 'medium',
      missing_structured_data: 'medium',
      missing_canonical: 'medium',
      missing_keywords: 'low',
      missing_twitter: 'low'
    };

    return severityMap[type] || 'medium';
  }

  public getMetrics(): SEOMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      pages: Array.from(this.pages.values()).map(page => ({
        path: page.path,
        score: page.metadata.score,
        issues: page.metadata.issues?.length || 0,
        lastAnalyzed: page.metadata.lastAnalyzed
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const seoService = SEOService.getInstance();
export default SEOService;
