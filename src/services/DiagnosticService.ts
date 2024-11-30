interface DiagnosticInfo {
  version: string;
  url: string;
  error: string;
  userAgent: string;
  benchmarkIndex: number;
  timestamp: number;
}

interface DiagnosticResult {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
}

interface PerformanceMetrics {
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  domInteractive: number;
  domComplete: number;
  resourceLoadTimes: Record<string, number>;
}

class DiagnosticService {
  private static instance: DiagnosticService;
  private diagnostics: Map<string, DiagnosticResult[]> = new Map();
  private currentInfo: DiagnosticInfo | null = null;
  private performanceMetrics: Map<string, PerformanceMetrics[]> = new Map();

  private constructor() {}

  public static getInstance(): DiagnosticService {
    if (!DiagnosticService.instance) {
      DiagnosticService.instance = new DiagnosticService();
    }
    return DiagnosticService.instance;
  }

  public setDiagnosticInfo(info: DiagnosticInfo): void {
    this.currentInfo = info;
    console.log('Diagnostic Info Set:', {
      version: info.version,
      url: info.url,
      error: info.error,
      benchmarkIndex: info.benchmarkIndex
    });
  }

  public getDiagnosticInfo(): DiagnosticInfo | null {
    return this.currentInfo;
  }

  public addDiagnosticResult(result: DiagnosticResult): void {
    const url = this.currentInfo?.url || 'unknown';
    if (!this.diagnostics.has(url)) {
      this.diagnostics.set(url, []);
    }
    this.diagnostics.get(url)?.push(result);
  }

  public getDiagnosticResults(url?: string): DiagnosticResult[] {
    if (url) {
      return this.diagnostics.get(url) || [];
    }
    return Array.from(this.diagnostics.values()).flat();
  }

  public async collectPerformanceMetrics(): Promise<PerformanceMetrics | null> {
    if (typeof window === 'undefined') return null;

    const url = this.currentInfo?.url || window.location.href;
    const metrics: PerformanceMetrics = {
      timeToFirstByte: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      domInteractive: 0,
      domComplete: 0,
      resourceLoadTimes: {}
    };

    // Collect Navigation Timing metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.timeToFirstByte = navigation.responseStart - navigation.requestStart;
      metrics.domInteractive = navigation.domInteractive;
      metrics.domComplete = navigation.domComplete;
    }

    // Collect Paint Timing metrics
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    });

    // Collect Layout Shift Score
    if ('layoutShift' in performance) {
      let cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        metrics.cumulativeLayoutShift = cls;
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // Collect Resource Timing metrics
    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
      metrics.resourceLoadTimes[resource.name] = resource.duration;
    });

    // Store metrics
    if (!this.performanceMetrics.has(url)) {
      this.performanceMetrics.set(url, []);
    }
    this.performanceMetrics.get(url)?.push(metrics);

    // Analyze metrics and add diagnostic results if needed
    this.analyzePerformanceMetrics(metrics);

    return metrics;
  }

  private analyzePerformanceMetrics(metrics: PerformanceMetrics): void {
    // Analyze Time to First Byte
    if (metrics.timeToFirstByte > 600) {
      this.addDiagnosticResult({
        type: 'warning',
        code: 'HIGH_TTFB',
        message: 'Time to First Byte is higher than recommended',
        details: {
          current: metrics.timeToFirstByte,
          threshold: 600,
          recommendation: 'Consider optimizing server response time or using a CDN'
        },
        timestamp: Date.now()
      });
    }

    // Analyze First Contentful Paint
    if (metrics.firstContentfulPaint > 2000) {
      this.addDiagnosticResult({
        type: 'warning',
        code: 'HIGH_FCP',
        message: 'First Contentful Paint is slower than recommended',
        details: {
          current: metrics.firstContentfulPaint,
          threshold: 2000,
          recommendation: 'Optimize critical rendering path and reduce render-blocking resources'
        },
        timestamp: Date.now()
      });
    }

    // Analyze Cumulative Layout Shift
    if (metrics.cumulativeLayoutShift > 0.1) {
      this.addDiagnosticResult({
        type: 'warning',
        code: 'HIGH_CLS',
        message: 'High Cumulative Layout Shift detected',
        details: {
          current: metrics.cumulativeLayoutShift,
          threshold: 0.1,
          recommendation: 'Ensure elements maintain their position during page load'
        },
        timestamp: Date.now()
      });
    }
  }

  public async analyzeLighthouseError(): Promise<DiagnosticResult> {
    if (!this.currentInfo) {
      return {
        type: 'error',
        code: 'NO_DIAGNOSTIC_INFO',
        message: 'No diagnostic information available',
        timestamp: Date.now()
      };
    }

    // Analyze the Chrome interstitial error
    if (this.currentInfo.error.includes('interstitial error')) {
      const result: DiagnosticResult = {
        type: 'error',
        code: 'CHROME_INTERSTITIAL',
        message: 'Chrome prevented page load due to security concerns',
        details: {
          lighthouse: {
            version: this.currentInfo.version,
            benchmarkIndex: this.currentInfo.benchmarkIndex
          },
          possibleCauses: [
            'Invalid SSL certificate',
            'Mixed content issues',
            'Security policy violations',
            'Content Security Policy violations',
            'Malware detection'
          ],
          recommendations: [
            'Verify SSL certificate configuration',
            'Check for mixed content (HTTP/HTTPS)',
            'Review Content Security Policy',
            'Scan for malware',
            'Check security headers'
          ]
        },
        timestamp: Date.now()
      };

      this.addDiagnosticResult(result);
      return result;
    }

    return {
      type: 'error',
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error occurred',
      details: {
        originalError: this.currentInfo.error
      },
      timestamp: Date.now()
    };
  }

  public async generateReport(): Promise<string> {
    const report = {
      diagnosticInfo: this.currentInfo,
      results: Array.from(this.diagnostics.entries()).map(([url, results]) => ({
        url,
        results: results.map(result => ({
          ...result,
          timestamp: new Date(result.timestamp).toISOString()
        }))
      })),
      performanceMetrics: Array.from(this.performanceMetrics.entries()).map(([url, metrics]) => ({
        url,
        metrics
      })),
      summary: {
        totalErrors: this.getDiagnosticResults().filter(r => r.type === 'error').length,
        totalWarnings: this.getDiagnosticResults().filter(r => r.type === 'warning').length,
        totalInfos: this.getDiagnosticResults().filter(r => r.type === 'info').length,
        averageMetrics: this.calculateAverageMetrics()
      },
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }

  private calculateAverageMetrics(): Partial<PerformanceMetrics> {
    const allMetrics = Array.from(this.performanceMetrics.values()).flat();
    if (allMetrics.length === 0) return {};

    return {
      timeToFirstByte: this.average(allMetrics.map(m => m.timeToFirstByte)),
      firstContentfulPaint: this.average(allMetrics.map(m => m.firstContentfulPaint)),
      largestContentfulPaint: this.average(allMetrics.map(m => m.largestContentfulPaint)),
      firstInputDelay: this.average(allMetrics.map(m => m.firstInputDelay)),
      cumulativeLayoutShift: this.average(allMetrics.map(m => m.cumulativeLayoutShift))
    };
  }

  private average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  public clearDiagnostics(): void {
    this.diagnostics.clear();
    this.performanceMetrics.clear();
    this.currentInfo = null;
  }
}

export const diagnosticService = DiagnosticService.getInstance();
export default DiagnosticService;
