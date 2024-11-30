import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { seoService } from '@/services/SEOService';
import { logger } from '@/utils/logger';

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

interface UseSEOOptions {
  onUpdate?: (config: SEOConfig) => void;
  onAnalysis?: (page: PageSEO) => void;
  onError?: (error: Error) => void;
}

export function useSEO(options: UseSEOOptions = {}) {
  const {
    onUpdate,
    onAnalysis,
    onError
  } = options;

  const pathname = usePathname();
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null);
  const [metrics, setMetrics] = useState<SEOMetrics>(seoService.getMetrics());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = seoService.onSEOEvent((type, data) => {
      switch (type) {
        case 'seo:updated':
          onUpdate?.(data.config);
          break;
        case 'seo:analyzed':
          onAnalysis?.(data);
          break;
      }
      setMetrics(seoService.getMetrics());
    });

    return unsubscribe;
  }, [onUpdate, onAnalysis]);

  useEffect(() => {
    if (pathname) {
      loadPageSEO(pathname);
    }
  }, [pathname]);

  const loadPageSEO = useCallback(async (path: string) => {
    try {
      setIsLoading(true);
      const page = await seoService.getPageSEO(path);
      setPageSEO(page);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load SEO config');
      onError?.(err);
      logger.error('Failed to load SEO config', { path, error });
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const updateSEO = useCallback(async (config: SEOConfig) => {
    if (!pathname) return;

    try {
      setIsLoading(true);
      const page = await seoService.setPageSEO(pathname, config);
      setPageSEO(page);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update SEO config');
      onError?.(err);
      logger.error('Failed to update SEO config', { error });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pathname, onError]);

  const analyzePage = useCallback(async (path: string = pathname || '') => {
    try {
      setIsLoading(true);
      const page = await seoService.analyzePage(path);
      setPageSEO(page);
      return page;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to analyze page');
      onError?.(err);
      logger.error('Failed to analyze page', { path, error });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pathname, onError]);

  const generateSitemap = useCallback(async () => {
    try {
      return await seoService.generateSitemap();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate sitemap');
      onError?.(err);
      logger.error('Failed to generate sitemap', { error });
      throw err;
    }
  }, [onError]);

  const generateRobotsTxt = useCallback(async () => {
    try {
      return await seoService.generateRobotsTxt();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate robots.txt');
      onError?.(err);
      logger.error('Failed to generate robots.txt', { error });
      throw err;
    }
  }, [onError]);

  const generateReport = useCallback(async () => {
    try {
      return await seoService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onError]);

  return {
    pageSEO,
    metrics,
    isLoading,
    updateSEO,
    analyzePage,
    generateSitemap,
    generateRobotsTxt,
    generateReport
  };
}

// Example usage:
/*
function SEOComponent() {
  const {
    pageSEO,
    metrics,
    isLoading,
    updateSEO,
    analyzePage
  } = useSEO({
    onAnalysis: (page) => {
      console.log('Page analyzed:', page);
    }
  });

  const handleUpdate = async () => {
    try {
      await updateSEO({
        title: 'New Page Title',
        description: 'New page description',
        metaTags: [],
        linkTags: [],
        openGraph: {
          title: 'OG Title',
          description: 'OG Description',
          image: '/og-image.jpg'
        }
      });
    } catch (error) {
      console.error('Failed to update SEO:', error);
    }
  };

  return (
    <div>
      <div>SEO Score: {pageSEO?.metadata.score}</div>
      <div>Average Score: {metrics.averageScore}</div>
      <button onClick={handleUpdate} disabled={isLoading}>
        Update SEO
      </button>
      <button onClick={() => analyzePage()} disabled={isLoading}>
        Analyze Page
      </button>
    </div>
  );
}
*/
