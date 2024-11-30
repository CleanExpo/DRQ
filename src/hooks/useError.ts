import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { errorService } from '@/services/ErrorService';
import { logger } from '@/utils/logger';

interface ErrorEvent {
  id: string;
  type: 'runtime' | 'network' | 'api' | 'ui' | 'custom';
  name: string;
  message: string;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: {
    timestamp: string;
    path: string;
    component?: string;
    action?: string;
    userId?: string;
    sessionId: string;
    browser: string;
    os: string;
    customData?: Record<string, any>;
  };
}

interface ErrorGroup {
  id: string;
  hash: string;
  type: ErrorEvent['type'];
  name: string;
  message: string;
  severity: ErrorEvent['severity'];
  count: number;
  firstSeen: string;
  lastSeen: string;
  status: 'active' | 'resolved' | 'ignored';
  metadata: {
    affectedUsers: number;
    affectedSessions: number;
    occurrencesByPath: Record<string, number>;
  };
}

interface ErrorMetrics {
  totalErrors: number;
  activeErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  topErrors: Array<{
    hash: string;
    count: number;
    message: string;
  }>;
  errorRate: number;
  lastUpdate: number;
}

interface UseErrorOptions {
  userId?: string;
  component?: string;
  onError?: (error: ErrorEvent) => void;
  onResolve?: (group: ErrorGroup) => void;
  onIgnore?: (group: ErrorGroup) => void;
}

export function useError(options: UseErrorOptions = {}) {
  const {
    userId,
    component,
    onError,
    onResolve,
    onIgnore
  } = options;

  const pathname = usePathname();
  const [metrics, setMetrics] = useState<ErrorMetrics>(errorService.getMetrics());

  useEffect(() => {
    const unsubscribe = errorService.onErrorEvent((type, data) => {
      switch (type) {
        case 'error:tracked':
          onError?.(data);
          break;
        case 'error:resolved':
          onResolve?.(data);
          break;
        case 'error:ignored':
          onIgnore?.(data);
          break;
      }
      setMetrics(errorService.getMetrics());
    });

    return unsubscribe;
  }, [onError, onResolve, onIgnore]);

  const trackError = useCallback((
    error: Error,
    options: {
      type?: ErrorEvent['type'];
      severity?: ErrorEvent['severity'];
      action?: string;
      customData?: Record<string, any>;
    } = {}
  ) => {
    try {
      errorService.trackError(error, {
        ...options,
        component,
        userId,
        customData: {
          ...options.customData,
          path: pathname
        }
      });
    } catch (trackingError) {
      logger.error('Failed to track error', { error, trackingError });
    }
  }, [component, userId, pathname]);

  const resolveError = useCallback(async (groupId: string) => {
    try {
      await errorService.resolveError(groupId);
    } catch (error) {
      logger.error('Failed to resolve error', { groupId, error });
      throw error;
    }
  }, []);

  const ignoreError = useCallback(async (groupId: string) => {
    try {
      await errorService.ignoreError(groupId);
    } catch (error) {
      logger.error('Failed to ignore error', { groupId, error });
      throw error;
    }
  }, []);

  const getSeverityColor = useCallback((severity: string): string => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  }, []);

  const getTypeIcon = useCallback((type: string): string => {
    switch (type) {
      case 'runtime': return '⚡';
      case 'network': return '🌐';
      case 'api': return '🔌';
      case 'ui': return '🖥️';
      case 'custom': return '🔧';
      default: return '❌';
    }
  }, []);

  const generateReport = useCallback(async () => {
    try {
      return await errorService.generateReport();
    } catch (error) {
      logger.error('Failed to generate report', { error });
      throw error;
    }
  }, []);

  return {
    metrics,
    trackError,
    resolveError,
    ignoreError,
    getSeverityColor,
    getTypeIcon,
    generateReport
  };
}

// Example usage:
/*
function ErrorBoundaryComponent() {
  const {
    metrics,
    trackError,
    getSeverityColor
  } = useError({
    component: 'ErrorBoundary',
    onError: (error) => {
      console.log('Error tracked:', error);
    }
  });

  useEffect(() => {
    const handleError = (error: Error) => {
      trackError(error, {
        type: 'runtime',
        severity: 'high',
        action: 'componentMount'
      });
    };

    try {
      // Component logic that might throw
    } catch (error) {
      handleError(error as Error);
    }
  }, [trackError]);

  return (
    <div>
      <div>Active Errors: {metrics.activeErrors}</div>
      <div>Error Rate: {metrics.errorRate}/hour</div>
      {metrics.topErrors.map(error => (
        <div key={error.hash} className={`text-${getSeverityColor('high')}-600`}>
          {error.message} ({error.count} occurrences)
        </div>
      ))}
    </div>
  );
}
*/
