import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsService } from '@/services/AnalyticsService';
import { logger } from '@/utils/logger';

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

interface UseAnalyticsOptions {
  userId?: string;
  locale?: string;
  onEvent?: (type: string, data: any) => void;
  onError?: (error: Error) => void;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    userId,
    locale = 'en-AU',
    onEvent,
    onError
  } = options;

  const pathname = usePathname();
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(analyticsService.getMetrics());

  useEffect(() => {
    const unsubscribe = analyticsService.onAnalyticsEvent((type, data) => {
      onEvent?.(type, data);
      setMetrics(analyticsService.getMetrics());
    });

    return unsubscribe;
  }, [onEvent]);

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, document.title);
    }
  }, [pathname]);

  const getDeviceMetadata = useCallback(() => {
    return {
      locale,
      deviceType: analyticsService['getDeviceType'](),
      browser: navigator.userAgent,
      os: navigator.platform,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      userId,
    };
  }, [locale, userId]);

  const trackPageView = useCallback((path: string, title: string) => {
    try {
      analyticsService.trackPageView(path, title, {
        ...getDeviceMetadata(),
        referrer: document.referrer
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to track page view');
      onError?.(err);
      logger.error('Failed to track page view', { path, error });
    }
  }, [getDeviceMetadata, onError]);

  const trackEvent = useCallback((
    type: string,
    category: string,
    action: string,
    customData?: Record<string, any>
  ) => {
    try {
      analyticsService.trackEvent(type, category, action, {
        path: pathname || '/',
        ...getDeviceMetadata(),
        customData
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to track event');
      onError?.(err);
      logger.error('Failed to track event', { type, category, action, error });
    }
  }, [pathname, getDeviceMetadata, onError]);

  const trackError = useCallback((
    error: Error,
    componentName?: string
  ) => {
    try {
      analyticsService.trackError(error, {
        path: pathname || '/',
        componentName,
        ...getDeviceMetadata()
      });
    } catch (trackError) {
      const err = trackError instanceof Error ? trackError : new Error('Failed to track error');
      onError?.(err);
      logger.error('Failed to track error', { error, trackError });
    }
  }, [pathname, getDeviceMetadata, onError]);

  const trackPerformanceMetric = useCallback((
    type: PerformanceMetric['type'],
    value: number,
    customMetadata?: Record<string, any>
  ) => {
    try {
      analyticsService.trackPerformanceMetric(type, value, {
        ...getDeviceMetadata(),
        ...customMetadata
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to track performance metric');
      onError?.(err);
      logger.error('Failed to track performance metric', { type, value, error });
    }
  }, [getDeviceMetadata, onError]);

  const generateReport = useCallback(async () => {
    try {
      return await analyticsService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onError]);

  return {
    metrics,
    trackPageView,
    trackEvent,
    trackError,
    trackPerformanceMetric,
    generateReport
  };
}

// Example usage:
/*
function AnalyticsComponent() {
  const {
    metrics,
    trackEvent,
    trackError
  } = useAnalytics({
    userId: 'user123',
    onEvent: (type, data) => {
      console.log('Analytics event:', type, data);
    }
  });

  const handleClick = () => {
    trackEvent('click', 'button', 'submit-form', {
      formId: 'contact-form'
    });
  };

  const handleError = (error: Error) => {
    trackError(error, 'AnalyticsComponent');
  };

  return (
    <div>
      <div>Page Views: {metrics.pageViews.total}</div>
      <button onClick={handleClick}>
        Track Click Event
      </button>
      <button onClick={() => handleError(new Error('Test error'))}>
        Track Error
      </button>
    </div>
  );
}
*/
