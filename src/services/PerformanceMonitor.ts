import { performance } from 'perf_hooks';
import { logger } from '@/utils/logger';
import performanceConfig from '@/config/performance.json';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size?: number;
  type: string;
}

interface PageMetrics {
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  tbt: number;  // Total Blocking Time
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private resourceTimings: ResourceTiming[] = [];
  private config = performanceConfig;
  private observers: any[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    if (typeof window !== 'undefined') {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          this.recordMetric('FID', entry.duration);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Layout Shifts
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        entryList.getEntries().forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        this.recordMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // Resource Timing
      const resourceObserver = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach(entry => {
          this.recordResourceTiming({
            name: entry.name,
            duration: entry.duration,
            size: (entry as any).transferSize,
            type: entry.entryType
          });
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private recordMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now()
    };
    this.metrics.push(metric);
    this.checkThresholds(metric);
  }

  private recordResourceTiming(timing: ResourceTiming): void {
    this.resourceTimings.push(timing);
    this.checkResourceThresholds(timing);
  }

  private checkThresholds(metric: PerformanceMetric): void {
    const threshold = this.config.thresholds.metrics[metric.name.toLowerCase()];
    if (threshold && metric.value > threshold) {
      logger.warn(`Performance threshold exceeded`, {
        metric: metric.name,
        value: metric.value,
        threshold,
        timestamp: new Date(metric.timestamp).toISOString()
      });
    }
  }

  private checkResourceThresholds(timing: ResourceTiming): void {
    const { size, duration, type } = timing;
    const thresholds = this.config.thresholds.size;

    if (size) {
      const maxSize = thresholds[`max${type.charAt(0).toUpperCase() + type.slice(1)}Size`];
      if (maxSize && size > maxSize) {
        logger.warn(`Resource size threshold exceeded`, {
          resource: timing.name,
          size,
          maxSize,
          type
        });
      }
    }

    if (duration > this.config.monitoring.alerts.responseTime.warning) {
      logger.warn(`Resource loading time threshold exceeded`, {
        resource: timing.name,
        duration,
        threshold: this.config.monitoring.alerts.responseTime.warning
      });
    }
  }

  public getMetrics(): PageMetrics {
    const getLatestMetric = (name: string): number => {
      const metrics = this.metrics.filter(m => m.name === name);
      return metrics.length > 0 ? metrics[metrics.length - 1].value : 0;
    };

    return {
      fcp: getLatestMetric('FCP'),
      lcp: getLatestMetric('LCP'),
      fid: getLatestMetric('FID'),
      cls: getLatestMetric('CLS'),
      ttfb: getLatestMetric('TTFB'),
      tbt: getLatestMetric('TBT')
    };
  }

  public getResourceMetrics(): ResourceTiming[] {
    return this.resourceTimings;
  }

  public generateReport(): any {
    const metrics = this.getMetrics();
    const resources = this.getResourceMetrics();
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      resources: {
        total: resources.length,
        byType: this.groupResourcesByType(resources),
        slowest: this.getSlowestResources(resources, 5),
        largest: this.getLargestResources(resources, 5)
      },
      thresholds: {
        exceeded: this.getExceededThresholds(metrics)
      }
    };

    logger.info('Performance report generated', { report });
    return report;
  }

  private groupResourcesByType(resources: ResourceTiming[]): Record<string, number> {
    return resources.reduce((acc, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getSlowestResources(resources: ResourceTiming[], limit: number): ResourceTiming[] {
    return [...resources]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  private getLargestResources(resources: ResourceTiming[], limit: number): ResourceTiming[] {
    return [...resources]
      .filter(r => r.size)
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, limit);
  }

  private getExceededThresholds(metrics: PageMetrics): string[] {
    const exceeded: string[] = [];
    const thresholds = this.config.thresholds.metrics;

    Object.entries(metrics).forEach(([metric, value]) => {
      if (thresholds[metric] && value > thresholds[metric]) {
        exceeded.push(metric);
      }
    });

    return exceeded;
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
    this.resourceTimings = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
export default PerformanceMonitor;
