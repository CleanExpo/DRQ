import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

interface PageView {
  id: string;
  path: string;
  title: string;
  referrer?: string;
  timestamp: string;
  duration?: number;
  metadata: {
    locale: string;
    deviceType: string;
    browser: string;
    os: string;
    screenSize: string;
    userId?: string;
    sessionId: string;
  };
}

interface Event {
  id: string;
  type: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
  metadata: {
    path: string;
    locale: string;
    deviceType: string;
    userId?: string;
    sessionId: string;
    customData?: Record<string, any>;
  };
}

interface ErrorEvent {
  id: string;
  type: 'error' | 'exception';
  message: string;
  stack?: string;
  timestamp: string;
  metadata: {
    path: string;
    componentName?: string;
    userId?: string;
    sessionId: string;
    browser: string;
    os: string;
  };
}

interface PerformanceMetric {
  id: string;
  type: 'fcp' | 'lcp' | 'cls' | 'fid' | 'ttfb' | 'custom';
  value: number;
  timestamp: string;
  metadata: {
    path: string;
    deviceType: string;
    connection: string;
    userId?: string;
    sessionId: string;
  };
}

interface AnalyticsMetrics {
  pageViews: {
    total: number;
    unique: number;
    averageDuration: number;
    byPath: Record<string, number>;
    byDevice: Record<string, number>;
    byLocale: Record<string, number>;
  };
  events: {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    byComponent: Record<string, number>;
  };
  performance: {
    averageFCP: number;
    averageLCP: number;
    averageCLS: number;
    averageFID: number;
    averageTTFB: number;
  };
  lastUpdate: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private pageViews: Map<string, PageView> = new Map();
  private events: Map<string, Event> = new Map();
  private errors: Map<string, ErrorEvent> = new Map();
  private performanceMetrics: Map<string, PerformanceMetric> = new Map();
  private metrics: AnalyticsMetrics;
  private observers: ((type: string, data: any) => void)[] = [];
  private sessionId: string;

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.sessionId = this.generateSessionId();
    this.setupPerformanceObserver();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private initializeMetrics(): AnalyticsMetrics {
    return {
      pageViews: {
        total: 0,
        unique: 0,
        averageDuration: 0,
        byPath: {},
        byDevice: {},
        byLocale: {}
      },
      events: {
        total: 0,
        byType: {},
        byCategory: {}
      },
      errors: {
        total: 0,
        byType: {},
        byComponent: {}
      },
      performance: {
        averageFCP: 0,
        averageLCP: 0,
        averageCLS: 0,
        averageFID: 0,
        averageTTFB: 0
      },
      lastUpdate: Date.now()
    };
  }

  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined') return;

    // Observe Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.trackPerformanceMetric(
          entry.name as PerformanceMetric['type'],
          entry.startTime || entry.value
        );
      });
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });
    } catch (error) {
      logger.error('Failed to setup performance observer', { error });
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public trackPageView(
    path: string,
    title: string,
    metadata: Omit<PageView['metadata'], 'sessionId'>
  ): void {
    try {
      const pageView: PageView = {
        id: this.generateId(),
        path,
        title,
        timestamp: new Date().toISOString(),
        metadata: {
          ...metadata,
          sessionId: this.sessionId
        }
      };

      this.pageViews.set(pageView.id, pageView);
      this.updateMetrics();
      this.notifyObservers('pageview:tracked', pageView);

      logger.debug('Page view tracked', { path, title });
    } catch (error) {
      logger.error('Failed to track page view', { path, error });
    }
  }

  public trackEvent(
    type: string,
    category: string,
    action: string,
    metadata: Omit<Event['metadata'], 'sessionId'>
  ): void {
    try {
      const event: Event = {
        id: this.generateId(),
        type,
        category,
        action,
        timestamp: new Date().toISOString(),
        metadata: {
          ...metadata,
          sessionId: this.sessionId
        }
      };

      this.events.set(event.id, event);
      this.updateMetrics();
      this.notifyObservers('event:tracked', event);

      logger.debug('Event tracked', { type, category, action });
    } catch (error) {
      logger.error('Failed to track event', { type, category, action, error });
    }
  }

  public trackError(
    error: Error,
    metadata: Omit<ErrorEvent['metadata'], 'sessionId'>
  ): void {
    try {
      const errorEvent: ErrorEvent = {
        id: this.generateId(),
        type: 'error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        metadata: {
          ...metadata,
          sessionId: this.sessionId
        }
      };

      this.errors.set(errorEvent.id, errorEvent);
      this.updateMetrics();
      this.notifyObservers('error:tracked', errorEvent);

      logger.debug('Error tracked', { message: error.message });
    } catch (error) {
      logger.error('Failed to track error', { error });
    }
  }

  public trackPerformanceMetric(
    type: PerformanceMetric['type'],
    value: number,
    metadata: Partial<Omit<PerformanceMetric['metadata'], 'sessionId'>> = {}
  ): void {
    try {
      const metric: PerformanceMetric = {
        id: this.generateId(),
        type,
        value,
        timestamp: new Date().toISOString(),
        metadata: {
          path: window.location.pathname,
          deviceType: this.getDeviceType(),
          connection: this.getConnectionType(),
          ...metadata,
          sessionId: this.sessionId
        }
      };

      this.performanceMetrics.set(metric.id, metric);
      this.updateMetrics();
      this.notifyObservers('performance:tracked', metric);

      logger.debug('Performance metric tracked', { type, value });
    } catch (error) {
      logger.error('Failed to track performance metric', { type, value, error });
    }
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getConnectionType(): string {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) return 'unknown';
    return (navigator as any).connection?.effectiveType || 'unknown';
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onAnalyticsEvent(callback: (type: string, data: any) => void): () => void {
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
        logger.error('Analytics event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const pageViews = Array.from(this.pageViews.values());
    const events = Array.from(this.events.values());
    const errors = Array.from(this.errors.values());
    const performanceMetrics = Array.from(this.performanceMetrics.values());

    this.metrics = {
      pageViews: {
        total: pageViews.length,
        unique: new Set(pageViews.map(pv => pv.path)).size,
        averageDuration: this.calculateAveragePageDuration(pageViews),
        byPath: this.countByKey(pageViews, 'path'),
        byDevice: this.countByKey(pageViews, 'metadata.deviceType'),
        byLocale: this.countByKey(pageViews, 'metadata.locale')
      },
      events: {
        total: events.length,
        byType: this.countByKey(events, 'type'),
        byCategory: this.countByKey(events, 'category')
      },
      errors: {
        total: errors.length,
        byType: this.countByKey(errors, 'type'),
        byComponent: this.countByKey(errors, 'metadata.componentName')
      },
      performance: {
        averageFCP: this.calculateAverageMetric(performanceMetrics, 'fcp'),
        averageLCP: this.calculateAverageMetric(performanceMetrics, 'lcp'),
        averageCLS: this.calculateAverageMetric(performanceMetrics, 'cls'),
        averageFID: this.calculateAverageMetric(performanceMetrics, 'fid'),
        averageTTFB: this.calculateAverageMetric(performanceMetrics, 'ttfb')
      },
      lastUpdate: Date.now()
    };
  }

  private calculateAveragePageDuration(pageViews: PageView[]): number {
    const viewsWithDuration = pageViews.filter(pv => pv.duration);
    if (viewsWithDuration.length === 0) return 0;
    return viewsWithDuration.reduce((sum, pv) => sum + (pv.duration || 0), 0) / viewsWithDuration.length;
  }

  private calculateAverageMetric(metrics: PerformanceMetric[], type: string): number {
    const typeMetrics = metrics.filter(m => m.type === type);
    if (typeMetrics.length === 0) return 0;
    return typeMetrics.reduce((sum, m) => sum + m.value, 0) / typeMetrics.length;
  }

  private countByKey(array: any[], key: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], item);
      if (value) {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {});
  }

  public getMetrics(): AnalyticsMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      recentPageViews: Array.from(this.pageViews.values())
        .slice(-10)
        .map(pv => ({
          path: pv.path,
          title: pv.title,
          timestamp: pv.timestamp,
          deviceType: pv.metadata.deviceType
        })),
      recentEvents: Array.from(this.events.values())
        .slice(-10)
        .map(e => ({
          type: e.type,
          category: e.category,
          action: e.action,
          timestamp: e.timestamp
        })),
      recentErrors: Array.from(this.errors.values())
        .slice(-10)
        .map(e => ({
          type: e.type,
          message: e.message,
          timestamp: e.timestamp,
          componentName: e.metadata.componentName
        })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const analyticsService = AnalyticsService.getInstance();
export default AnalyticsService;
