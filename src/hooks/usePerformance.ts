import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { performanceService } from '@/services/PerformanceService';
import { logger } from '@/utils/logger';

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

interface UsePerformanceOptions {
  onMetric?: (metric: PerformanceMetric) => void;
  onIssue?: (issue: PerformanceIssue) => void;
  onError?: (error: Error) => void;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    onMetric,
    onIssue,
    onError
  } = options;

  const pathname = usePathname();
  const [metrics, setMetrics] = useState<PerformanceMetrics>(performanceService.getMetrics());

  useEffect(() => {
    const unsubscribe = performanceService.onPerformanceEvent((type, data) => {
      switch (type) {
        case 'metric:tracked':
          onMetric?.(data);
          break;
        case 'issue:detected':
          onIssue?.(data);
          break;
      }
      setMetrics(performanceService.getMetrics());
    });

    return unsubscribe;
  }, [onMetric, onIssue]);

  const trackMetric = useCallback((
    type: PerformanceMetric['type'],
    value: number,
    metadata: Partial<PerformanceMetric['metadata']> = {}
  ) => {
    try {
      performanceService.trackMetric(type, value, {
        path: pathname || '/',
        ...metadata
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to track metric');
      onError?.(err);
      logger.error('Failed to track metric', { type, value, error });
    }
  }, [pathname, onError]);

  const getScoreColor = useCallback((value: number, threshold: number): string => {
    const ratio = value / threshold;
    if (ratio <= 0.75) return 'green';
    if (ratio <= 1) return 'yellow';
    return 'red';
  }, []);

  const getMetricScore = useCallback((type: keyof PerformanceMetrics['coreWebVitals']): number => {
    const thresholds = {
      fcp: 1800,  // Good < 1.8s
      lcp: 2500,  // Good < 2.5s
      cls: 0.1,   // Good < 0.1
      fid: 100,   // Good < 100ms
      ttfb: 800   // Good < 800ms
    };

    const value = metrics.coreWebVitals[type];
    const threshold = thresholds[type];
    const ratio = value / threshold;
    return Math.max(0, Math.min(100, (1 - ratio) * 100));
  }, [metrics]);

  const formatSize = useCallback((bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }, []);

  const formatDuration = useCallback((ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }, []);

  const generateReport = useCallback(async () => {
    try {
      return await performanceService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onError]);

  return {
    metrics,
    trackMetric,
    getScoreColor,
    getMetricScore,
    formatSize,
    formatDuration,
    generateReport
  };
}

// Example usage:
/*
function PerformanceComponent() {
  const {
    metrics,
    getScoreColor,
    getMetricScore,
    formatSize
  } = usePerformance({
    onMetric: (metric) => {
      console.log('Performance metric:', metric);
    },
    onIssue: (issue) => {
      console.log('Performance issue:', issue);
    }
  });

  return (
    <div>
      <div>
        FCP Score: {getMetricScore('fcp')}%
        <div className={`bg-${getScoreColor(metrics.coreWebVitals.fcp, 1800)}-500`}>
          {metrics.coreWebVitals.fcp}ms
        </div>
      </div>
      <div>
        Total Resources: {formatSize(metrics.resources.totalSize)}
      </div>
      <div>
        Issues: {metrics.issues.total}
      </div>
    </div>
  );
}
*/
