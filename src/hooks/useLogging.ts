import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { loggingService } from '@/services/LoggingService';

interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context: {
    path: string;
    component?: string;
    action?: string;
    userId?: string;
    sessionId: string;
    data?: Record<string, any>;
  };
}

interface LogGroup {
  id: string;
  hash: string;
  level: LogEntry['level'];
  message: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  contexts: Array<LogEntry['context']>;
}

interface LogMetrics {
  totalLogs: number;
  logsByLevel: Record<string, number>;
  topMessages: Array<{
    hash: string;
    count: number;
    message: string;
    level: string;
  }>;
  logsPerMinute: number;
  lastUpdate: number;
}

interface UseLoggingOptions {
  component?: string;
  userId?: string;
  onLog?: (log: LogEntry) => void;
}

export function useLogging(options: UseLoggingOptions = {}) {
  const {
    component,
    userId,
    onLog
  } = options;

  const pathname = usePathname();
  const [metrics, setMetrics] = useState<LogMetrics>(loggingService.getMetrics());
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Update recent logs every 5 seconds
    const interval = setInterval(async () => {
      const logs = await loggingService.getLogs({ limit: 50 });
      setRecentLogs(logs);
      setMetrics(loggingService.getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createLogContext = useCallback((
    action?: string,
    data?: Record<string, any>
  ) => ({
    path: pathname || '',
    component,
    action,
    userId,
    data
  }), [pathname, component, userId]);

  const debug = useCallback((
    message: string,
    action?: string,
    data?: Record<string, any>
  ) => {
    const context = createLogContext(action, data);
    loggingService.debug(message, context);
    onLog?.({
      id: '',
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      context
    });
  }, [createLogContext, onLog]);

  const info = useCallback((
    message: string,
    action?: string,
    data?: Record<string, any>
  ) => {
    const context = createLogContext(action, data);
    loggingService.info(message, context);
    onLog?.({
      id: '',
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context
    });
  }, [createLogContext, onLog]);

  const warn = useCallback((
    message: string,
    action?: string,
    data?: Record<string, any>
  ) => {
    const context = createLogContext(action, data);
    loggingService.warn(message, context);
    onLog?.({
      id: '',
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      context
    });
  }, [createLogContext, onLog]);

  const error = useCallback((
    message: string,
    action?: string,
    data?: Record<string, any>
  ) => {
    const context = createLogContext(action, data);
    loggingService.error(message, context);
    onLog?.({
      id: '',
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context
    });
  }, [createLogContext, onLog]);

  const getLevelColor = useCallback((level: string): string => {
    switch (level) {
      case 'error': return 'red';
      case 'warn': return 'yellow';
      case 'info': return 'blue';
      case 'debug': return 'gray';
      default: return 'gray';
    }
  }, []);

  const getLevelIcon = useCallback((level: string): string => {
    switch (level) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  }, []);

  const generateReport = useCallback(async () => {
    try {
      return await loggingService.generateReport();
    } catch (error) {
      console.error('Failed to generate report', error);
      throw error;
    }
  }, []);

  const exportLogs = useCallback(async (format: 'json' | 'csv' = 'json') => {
    try {
      return await loggingService.exportLogs(format);
    } catch (error) {
      console.error('Failed to export logs', error);
      throw error;
    }
  }, []);

  return {
    metrics,
    recentLogs,
    debug,
    info,
    warn,
    error,
    getLevelColor,
    getLevelIcon,
    generateReport,
    exportLogs
  };
}

// Example usage:
/*
function LoggingComponent() {
  const {
    metrics,
    recentLogs,
    info,
    error,
    getLevelColor
  } = useLogging({
    component: 'LoggingComponent',
    onLog: (log) => {
      console.log('New log:', log);
    }
  });

  useEffect(() => {
    info('Component mounted', 'mount');

    return () => {
      info('Component unmounted', 'unmount');
    };
  }, [info]);

  const handleError = () => {
    error('Something went wrong', 'action', {
      details: 'Additional error details'
    });
  };

  return (
    <div>
      <div>Total Logs: {metrics.totalLogs}</div>
      <div>Logs per minute: {metrics.logsPerMinute}</div>
      <div className="space-y-2">
        {recentLogs.map(log => (
          <div 
            key={log.id}
            className={`text-${getLevelColor(log.level)}-600`}
          >
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
*/
