import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'form' | 'gallery' | 'testimonial';
  content: any;
  metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    author?: string;
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'published' | 'archived';
    locale: string;
    version: number;
  };
}

interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  template: string;
  blocks: ContentBlock[];
  metadata: {
    seo: {
      title?: string;
      description?: string;
      keywords?: string[];
      canonical?: string;
      ogImage?: string;
    };
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    locale: string;
    version: number;
  };
}

interface CMSMetrics {
  totalPages: number;
  totalBlocks: number;
  publishedPages: number;
  draftPages: number;
  lastUpdate: number;
  contentByType: Record<string, number>;
  contentByLocale: Record<string, number>;
}

class CMSService {
  private static instance: CMSService;
  private pages: Map<string, Page> = new Map();
  private blocks: Map<string, ContentBlock> = new Map();
  private metrics: CMSMetrics;
  private observers: ((type: string, data: any) => void)[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
  }

  public static getInstance(): CMSService {
    if (!CMSService.instance) {
      CMSService.instance = new CMSService();
    }
    return CMSService.instance;
  }

  private initializeMetrics(): CMSMetrics {
    return {
      totalPages: 0,
      totalBlocks: 0,
      publishedPages: 0,
      draftPages: 0,
      lastUpdate: Date.now(),
      contentByType: {},
      contentByLocale: {}
    };
  }

  public async getPage(slug: string, locale: string = 'en-AU'): Promise<Page | null> {
    try {
      const cacheKey = `page:${locale}:${slug}`;
      const cached = await cacheService.get<Page>(cacheKey);

      if (cached) {
        logger.debug('Page loaded from cache', { slug, locale });
        return cached;
      }

      const page = this.pages.get(`${locale}:${slug}`);
      if (page) {
        await cacheService.set(cacheKey, page, {
          ttl: 3600000, // 1 hour
          type: 'page'
        });
      }

      return page || null;
    } catch (error) {
      logger.error('Failed to get page', { slug, locale, error });
      return null;
    }
  }

  public async createPage(page: Omit<Page, 'id'>): Promise<Page> {
    try {
      const id = this.generateId();
      const newPage: Page = {
        ...page,
        id,
        metadata: {
          ...page.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1
        }
      };

      this.pages.set(`${page.metadata.locale}:${page.slug}`, newPage);
      this.updateMetrics();
      this.notifyObservers('page:created', newPage);

      logger.debug('Page created', { id, slug: page.slug });
      return newPage;
    } catch (error) {
      logger.error('Failed to create page', { error });
      throw error;
    }
  }

  public async updatePage(id: string, updates: Partial<Page>): Promise<Page> {
    try {
      const page = Array.from(this.pages.values()).find(p => p.id === id);
      if (!page) {
        throw new Error(`Page not found: ${id}`);
      }

      const updatedPage: Page = {
        ...page,
        ...updates,
        metadata: {
          ...page.metadata,
          ...updates.metadata,
          updatedAt: new Date().toISOString(),
          version: page.metadata.version + 1
        }
      };

      this.pages.set(`${updatedPage.metadata.locale}:${updatedPage.slug}`, updatedPage);
      this.updateMetrics();
      this.notifyObservers('page:updated', updatedPage);

      // Invalidate cache
      await cacheService.invalidate(`page:${page.metadata.locale}:${page.slug}`);

      logger.debug('Page updated', { id });
      return updatedPage;
    } catch (error) {
      logger.error('Failed to update page', { id, error });
      throw error;
    }
  }

  public async createBlock(block: Omit<ContentBlock, 'id'>): Promise<ContentBlock> {
    try {
      const id = this.generateId();
      const newBlock: ContentBlock = {
        ...block,
        id,
        metadata: {
          ...block.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1
        }
      };

      this.blocks.set(id, newBlock);
      this.updateMetrics();
      this.notifyObservers('block:created', newBlock);

      logger.debug('Block created', { id, type: block.type });
      return newBlock;
    } catch (error) {
      logger.error('Failed to create block', { error });
      throw error;
    }
  }

  public async updateBlock(id: string, updates: Partial<ContentBlock>): Promise<ContentBlock> {
    try {
      const block = this.blocks.get(id);
      if (!block) {
        throw new Error(`Block not found: ${id}`);
      }

      const updatedBlock: ContentBlock = {
        ...block,
        ...updates,
        metadata: {
          ...block.metadata,
          ...updates.metadata,
          updatedAt: new Date().toISOString(),
          version: block.metadata.version + 1
        }
      };

      this.blocks.set(id, updatedBlock);
      this.updateMetrics();
      this.notifyObservers('block:updated', updatedBlock);

      logger.debug('Block updated', { id });
      return updatedBlock;
    } catch (error) {
      logger.error('Failed to update block', { id, error });
      throw error;
    }
  }

  public async publishPage(id: string): Promise<Page> {
    try {
      const page = Array.from(this.pages.values()).find(p => p.id === id);
      if (!page) {
        throw new Error(`Page not found: ${id}`);
      }

      const publishedPage = await this.updatePage(id, {
        metadata: {
          ...page.metadata,
          status: 'published',
          publishedAt: new Date().toISOString()
        }
      });

      this.notifyObservers('page:published', publishedPage);
      return publishedPage;
    } catch (error) {
      logger.error('Failed to publish page', { id, error });
      throw error;
    }
  }

  public async getPagesByLocale(locale: string): Promise<Page[]> {
    return Array.from(this.pages.values()).filter(
      page => page.metadata.locale === locale
    );
  }

  public async getPagesByStatus(status: Page['metadata']['status']): Promise<Page[]> {
    return Array.from(this.pages.values()).filter(
      page => page.metadata.status === status
    );
  }

  public async getBlocksByType(type: ContentBlock['type']): Promise<ContentBlock[]> {
    return Array.from(this.blocks.values()).filter(
      block => block.type === type
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onContentChange(callback: (type: string, data: any) => void): () => void {
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
        logger.error('Content change callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const pages = Array.from(this.pages.values());
    const blocks = Array.from(this.blocks.values());

    this.metrics = {
      totalPages: pages.length,
      totalBlocks: blocks.length,
      publishedPages: pages.filter(p => p.metadata.status === 'published').length,
      draftPages: pages.filter(p => p.metadata.status === 'draft').length,
      lastUpdate: Date.now(),
      contentByType: blocks.reduce((acc, block) => {
        acc[block.type] = (acc[block.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      contentByLocale: pages.reduce((acc, page) => {
        acc[page.metadata.locale] = (acc[page.metadata.locale] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  public getMetrics(): CMSMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      pages: Array.from(this.pages.values()).map(page => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        status: page.metadata.status,
        locale: page.metadata.locale,
        updatedAt: page.metadata.updatedAt
      })),
      blocks: Array.from(this.blocks.values()).map(block => ({
        id: block.id,
        type: block.type,
        status: block.metadata.status,
        locale: block.metadata.locale,
        updatedAt: block.metadata.updatedAt
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const cmsService = CMSService.getInstance();
export default CMSService;
