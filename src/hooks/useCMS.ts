import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { cmsService } from '@/services/CMSService';
import { logger } from '@/utils/logger';

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

interface UseCMSOptions {
  locale?: string;
  onContentChange?: (type: string, data: any) => void;
  onError?: (error: Error) => void;
}

export function useCMS(options: UseCMSOptions = {}) {
  const {
    locale = 'en-AU',
    onContentChange,
    onError
  } = options;

  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [metrics, setMetrics] = useState<CMSMetrics>(cmsService.getMetrics());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to content changes
    const unsubscribe = cmsService.onContentChange((type, data) => {
      onContentChange?.(type, data);
      setMetrics(cmsService.getMetrics());

      // Reload current page if it was updated
      if (type === 'page:updated' && data.id === currentPage?.id) {
        loadPage(data.slug);
      }
    });

    return unsubscribe;
  }, [onContentChange, currentPage]);

  useEffect(() => {
    // Load page based on pathname
    if (pathname) {
      const slug = pathname.replace(/^\/[a-z]{2}-[A-Z]{2}\//, '/');
      loadPage(slug);
    }
  }, [pathname, locale]);

  const loadPage = useCallback(async (slug: string) => {
    try {
      setIsLoading(true);
      const page = await cmsService.getPage(slug, locale);
      setCurrentPage(page);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load page');
      onError?.(err);
      logger.error('Failed to load page', { slug, locale, error });
    } finally {
      setIsLoading(false);
    }
  }, [locale, onError]);

  const createPage = useCallback(async (page: Omit<Page, 'id'>) => {
    try {
      setIsLoading(true);
      const newPage = await cmsService.createPage(page);
      setMetrics(cmsService.getMetrics());
      return newPage;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to create page');
      onError?.(err);
      logger.error('Failed to create page', { error });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const updatePage = useCallback(async (id: string, updates: Partial<Page>) => {
    try {
      setIsLoading(true);
      const updatedPage = await cmsService.updatePage(id, updates);
      setMetrics(cmsService.getMetrics());
      return updatedPage;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update page');
      onError?.(err);
      logger.error('Failed to update page', { id, error });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const createBlock = useCallback(async (block: Omit<ContentBlock, 'id'>) => {
    try {
      setIsLoading(true);
      const newBlock = await cmsService.createBlock(block);
      setMetrics(cmsService.getMetrics());
      return newBlock;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to create block');
      onError?.(err);
      logger.error('Failed to create block', { error });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const updateBlock = useCallback(async (id: string, updates: Partial<ContentBlock>) => {
    try {
      setIsLoading(true);
      const updatedBlock = await cmsService.updateBlock(id, updates);
      setMetrics(cmsService.getMetrics());
      return updatedBlock;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update block');
      onError?.(err);
      logger.error('Failed to update block', { id, error });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const publishPage = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const publishedPage = await cmsService.publishPage(id);
      setMetrics(cmsService.getMetrics());
      return publishedPage;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to publish page');
      onError?.(err);
      logger.error('Failed to publish page', { id, error });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const getPagesByLocale = useCallback(async (targetLocale: string = locale) => {
    try {
      return await cmsService.getPagesByLocale(targetLocale);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get pages by locale');
      onError?.(err);
      logger.error('Failed to get pages by locale', { locale: targetLocale, error });
      return [];
    }
  }, [locale, onError]);

  const getPagesByStatus = useCallback(async (status: Page['metadata']['status']) => {
    try {
      return await cmsService.getPagesByStatus(status);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get pages by status');
      onError?.(err);
      logger.error('Failed to get pages by status', { status, error });
      return [];
    }
  }, [onError]);

  const getBlocksByType = useCallback(async (type: ContentBlock['type']) => {
    try {
      return await cmsService.getBlocksByType(type);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get blocks by type');
      onError?.(err);
      logger.error('Failed to get blocks by type', { type, error });
      return [];
    }
  }, [onError]);

  const generateReport = useCallback(async () => {
    try {
      return await cmsService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onError]);

  return {
    currentPage,
    metrics,
    isLoading,
    createPage,
    updatePage,
    publishPage,
    createBlock,
    updateBlock,
    getPagesByLocale,
    getPagesByStatus,
    getBlocksByType,
    generateReport
  };
}

// Example usage:
/*
function MyComponent() {
  const {
    currentPage,
    metrics,
    isLoading,
    createBlock,
    updatePage
  } = useCMS({
    locale: 'en-AU',
    onContentChange: (type, data) => {
      console.log('Content changed:', type, data);
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!currentPage) return <div>Page not found</div>;

  return (
    <div>
      <h1>{currentPage.title}</h1>
      <div>
        {currentPage.blocks.map(block => (
          <ContentBlock key={block.id} block={block} />
        ))}
      </div>
      <div>
        Total Pages: {metrics.totalPages}
        Published Pages: {metrics.publishedPages}
      </div>
    </div>
  );
}
*/
