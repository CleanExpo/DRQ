import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

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

interface ResourceMetric {
  id: string;
  type: 'script' | 'style' | 'image' | 'font' | 'other';
  url: string;
  size: number;
  duration: number;
  timestamp: string;
  metadata: {
    path: string;
    initiatorType: string;
    transferSize: number;
    decodedBodySize: number;
    encodedBodySize: number;
  };
}

interface PerformanceIssue {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  metadata: {
    path: string;
    timestamp: string;
    metric?: string;
    threshold?: number;
    value?: number;
  };
}

interface PerformanceMetrics {
  coreWebVitals: {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
    ttfb: number;
  };
  resources: {
    totalSize: number;
    totalDuration: number;
    byType: Record<string, {
      count: number;
      size: number;
      duration: number;
    }>;
  };
  issues: {
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
  };
  lastUpdate: number;
}

class PerformanceService {
  private static instance: PerformanceService;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private resources: Map<string, ResourceMetric> = new Map();
  private issues: Map<string, PerformanceIssue> = new Map();
  private aggregatedMetrics: PerformanceMetrics;
  private observers: ((type: string, data: any) => void)[] = [];
  private thresholds = {
    fcp: 1800, // Good < 1.8s
    lcp: 2500, // Good < 2.5s
    cls: 0.1,  // Good < 0.1
    fid: 100,  // Good < 100ms
    ttfb: 800  // Good < 800ms
  };

  private constructor() {
    this.aggregatedMetrics = this.initializeMetrics();
    this.setupPerformanceObserver();
  }

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      coreWebVitals: {
        fcp: 0,
        lcp: 0,
        cls: 0,
        fid: 0,
        ttfb: 0
      },
      resources: {
        totalSize: 0,
        totalDuration: 0,
        byType: {}
      },
      issues: {
        total: 0,
        bySeverity: {},
        byType: {}
      },
      lastUpdate: Date.now()
    };
  }

  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined') return;

    try {
      // Core Web Vitals observer
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.trackMetric(
            entry.name as PerformanceMetric['type'],
            entry.startTime || entry.value
          );
        });
      });

      observer.observe({ 
        entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
      });

      // Resource timing observer
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.trackResource(entry as PerformanceResourceTiming);
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

      // Navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.trackMetric('ttfb', (entry as PerformanceNavigationTiming).responseStart);
          }
        });
      });

      navigationObserver.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      logger.error('Failed to setup performance observer', { error });
    }
  }

  public trackMetric(
    type: PerformanceMetric['type'],
    value: number,
    metadata: Partial<PerformanceMetric['metadata']> = {}
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
          sessionId: this.generateSessionId(),
          ...metadata
        }
      };

      this.metrics.set(metric.id, metric);
      this.analyzeMetric(metric);
      this.updateAggregatedMetrics();
      this.notifyObservers('metric:tracked', metric);

      logger.debug('Performance metric tracked', { type, value });
    } catch (error) {
      logger.error('Failed to track metric', { type, value, error });
    }
  }

  private trackResource(entry: PerformanceResourceTiming): void {
    try {
      const resource: ResourceMetric = {
        id: this.generateId(),
        type: this.getResourceType(entry.initiatorType),
        url: entry.name,
        size: entry.decodedBodySize,
        duration: entry.duration,
        timestamp: new Date().toISOString(),
        metadata: {
          path: window.location.pathname,
          initiatorType: entry.initiatorType,
          transferSize: entry.transferSize,
          decodedBodySize: entry.decodedBodySize,
          encodedBodySize: entry.encodedBodySize
        }
      };

      this.resources.set(resource.id, resource);
      this.analyzeResource(resource);
      this.updateAggregatedMetrics();
      this.notifyObservers('resource:tracked', resource);

      logger.debug('Resource tracked', { url: resource.url, duration: resource.duration });
    } catch (error) {
      logger.error('Failed to track resource', { error });
    }
  }

  private analyzeMetric(metric: PerformanceMetric): void {
    const threshold = this.thresholds[metric.type as keyof typeof this.thresholds];
    if (!threshold) return;

    if (metric.value > threshold) {
      const severity = this.calculateSeverity(metric.value, threshold);
      const issue: PerformanceIssue = {
        id: this.generateId(),
        type: `high_${metric.type}`,
        severity,
        message: `${metric.type.toUpperCase()} is too high`,
        suggestion: `Optimize ${metric.type.toUpperCase()} to be under ${threshold}ms`,
        metadata: {
          path: metric.metadata.path,
          timestamp: new Date().toISOString(),
          metric: metric.type,
          threshold,
          value: metric.value
        }
      };

      this.issues.set(issue.id, issue);
      this.notifyObservers('issue:detected', issue);
    }
  }

  private analyzeResource(resource: ResourceMetric): void {
    // Size threshold in bytes (1MB)
    const SIZE_THRESHOLD = 1024 * 1024;
    // Duration threshold in ms (1s)
    const DURATION_THRESHOLD = 1000;

    if (resource.size > SIZE_THRESHOLD) {
      const issue: PerformanceIssue = {
        id: this.generateId(),
        type: 'large_resource',
        severity: 'high',
        message: `Large ${resource.type} resource detected`,
        suggestion: 'Optimize resource size through compression and minification',
        metadata: {
          path: resource.metadata.path,
          timestamp: new Date().toISOString(),
          value: resource.size,
          threshold: SIZE_THRESHOLD
        }
      };

      this.issues.set(issue.id, issue);
      this.notifyObservers('issue:detected', issue);
    }

    if (resource.duration > DURATION_THRESHOLD) {
      const issue: PerformanceIssue = {
        id: this.generateId(),
        type: 'slow_resource',
        severity: 'medium',
        message: `Slow loading ${resource.type} resource detected`,
        suggestion: 'Optimize resource loading through caching and CDN usage',
        metadata: {
          path: resource.metadata.path,
          timestamp: new Date().toISOString(),
          value: resource.duration,
          threshold: DURATION_THRESHOLD
        }
      };

      this.issues.set(issue.id, issue);
      this.notifyObservers('issue:detected', issue);
    }
  }

  private calculateSeverity(value: number, threshold: number): PerformanceIssue['severity'] {
    const ratio = value / threshold;
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }

  private getResourceType(initiatorType: string): ResourceMetric['type'] {
    switch (initiatorType) {
      case 'script': return 'script';
      case 'css': return 'style';
      case 'img': return 'image';
      case 'font': return 'font';
      default: return 'other';
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

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onPerformanceEvent(callback: (type: string, data: any) => void): () => void {
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
        logger.error('Performance event callback failed', { error });
      }
    });
  }

  private updateAggregatedMetrics(): void {
    const metrics = Array.from(this.metrics.values());
    const resources = Array.from(this.resources.values());
    const issues = Array.from(this.issues.values());

    // Calculate average for each core web vital
    const coreWebVitals = {
      fcp: this.calculateAverage(metrics, 'fcp'),
      lcp: this.calculateAverage(metrics, 'lcp'),
      cls: this.calculateAverage(metrics, 'cls'),
      fid: this.calculateAverage(metrics, 'fid'),
      ttfb: this.calculateAverage(metrics, 'ttfb')
    };

    // Calculate resource metrics
    const resourceMetrics = {
      totalSize: resources.reduce((sum, r) => sum + r.size, 0),
      totalDuration: resources.reduce((sum, r) => sum + r.duration, 0),
      byType: this.aggregateResourcesByType(resources)
    };

    // Calculate issue metrics
    const issueMetrics = {
      total: issues.length,
      bySeverity: this.countBySeverity(issues),
      byType: this.countByType(issues)
    };

    this.aggregatedMetrics = {
      coreWebVitals,
      resources: resourceMetrics,
      issues: issueMetrics,
      lastUpdate: Date.now()
    };
  }

  private calculateAverage(metrics: PerformanceMetric[], type: string): number {
    const typeMetrics = metrics.filter(m => m.type === type);
    if (typeMetrics.length === 0) return 0;
    return typeMetrics.reduce((sum, m) => sum + m.value, 0) / typeMetrics.length;
  }

  private aggregateResourcesByType(resources: ResourceMetric[]): Record<string, {
    count: number;
    size: number;
    duration: number;
  }> {
    return resources.reduce((acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = { count: 0, size: 0, duration: 0 };
      }
      acc[resource.type].count++;
      acc[resource.type].size += resource.size;
      acc[resource.type].duration += resource.duration;
      return acc;
    }, {} as Record<string, { count: number; size: number; duration: number; }>);
  }

  private countBySeverity(issues: PerformanceIssue[]): Record<string, number> {
    return issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private countByType(issues: PerformanceIssue[]): Record<string, number> {
    return issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.aggregatedMetrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.aggregatedMetrics,
      recentIssues: Array.from(this.issues.values())
        .sort((a, b) => new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime())
        .slice(0, 10),
      resourceStats: {
        totalResources: this.resources.size,
        totalSize: this.aggregatedMetrics.resources.totalSize,
        averageDuration: this.aggregatedMetrics.resources.totalDuration / this.resources.size
      },
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const performanceService = PerformanceService.getInstance();
export default PerformanceService;
