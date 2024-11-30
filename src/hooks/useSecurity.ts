import { useState, useEffect, useCallback } from 'react';
import { securityService } from '@/services/SecurityService';
import { logger } from '@/utils/logger';

interface SecurityCheck {
  id: string;
  type: 'ssl' | 'csp' | 'mixed-content' | 'headers' | 'malware';
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: Record<string, any>;
  timestamp: number;
}

interface SecurityMetrics {
  totalChecks: number;
  failedChecks: number;
  warningChecks: number;
  lastCheck: number;
  checksByType: Record<string, number>;
}

interface UseSecurityOptions {
  onSecurityCheck?: (check: SecurityCheck) => void;
  onError?: (error: Error) => void;
}

export function useSecurity(options: UseSecurityOptions = {}) {
  const {
    onSecurityCheck,
    onError
  } = options;

  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>(securityService.getMetrics());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      setMetrics(securityService.getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkSSL = useCallback(async (url: string) => {
    try {
      const check = await securityService.checkSSL(url);
      onSecurityCheck?.(check);
      return check;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('SSL check failed');
      onError?.(err);
      logger.error('SSL check failed', { error });
      throw err;
    }
  }, [onSecurityCheck, onError]);

  const checkCSP = useCallback(async (headers: Record<string, string>) => {
    try {
      const check = await securityService.checkCSP(headers);
      onSecurityCheck?.(check);
      return check;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('CSP check failed');
      onError?.(err);
      logger.error('CSP check failed', { error });
      throw err;
    }
  }, [onSecurityCheck, onError]);

  const checkMixedContent = useCallback(async (html: string) => {
    try {
      const check = await securityService.checkMixedContent(html);
      onSecurityCheck?.(check);
      return check;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Mixed content check failed');
      onError?.(err);
      logger.error('Mixed content check failed', { error });
      throw err;
    }
  }, [onSecurityCheck, onError]);

  const checkSecurityHeaders = useCallback(async (headers: Record<string, string>) => {
    try {
      const check = await securityService.checkSecurityHeaders(headers);
      onSecurityCheck?.(check);
      return check;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Security headers check failed');
      onError?.(err);
      logger.error('Security headers check failed', { error });
      throw err;
    }
  }, [onSecurityCheck, onError]);

  const analyzePage = useCallback(async (url: string, html: string, headers: Record<string, string>) => {
    setIsAnalyzing(true);
    try {
      await securityService.analyzePage(url, html, headers);
      setChecks(securityService.getChecks());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Page analysis failed');
      onError?.(err);
      logger.error('Page analysis failed', { error });
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [onError]);

  const generateReport = useCallback(async () => {
    try {
      return await securityService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onError]);

  const clearChecks = useCallback(() => {
    try {
      securityService.clearChecks();
      setChecks([]);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to clear checks');
      onError?.(err);
      logger.error('Failed to clear checks', { error });
    }
  }, [onError]);

  const getChecksByType = useCallback((type: SecurityCheck['type']) => {
    return checks.filter(check => check.type === type);
  }, [checks]);

  const getChecksByStatus = useCallback((status: SecurityCheck['status']) => {
    return checks.filter(check => check.status === status);
  }, [checks]);

  const getSummary = useCallback(() => {
    return {
      totalChecks: checks.length,
      failedChecks: getChecksByStatus('fail').length,
      warningChecks: getChecksByStatus('warning').length,
      passedChecks: getChecksByStatus('pass').length,
      lastCheck: metrics.lastCheck
    };
  }, [checks, metrics.lastCheck, getChecksByStatus]);

  const formatTimestamp = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  }, []);

  const getStatusColor = useCallback((status: SecurityCheck['status']): string => {
    switch (status) {
      case 'pass':
        return 'green';
      case 'fail':
        return 'red';
      case 'warning':
        return 'yellow';
      default:
        return 'gray';
    }
  }, []);

  return {
    checks,
    metrics,
    isAnalyzing,
    checkSSL,
    checkCSP,
    checkMixedContent,
    checkSecurityHeaders,
    analyzePage,
    generateReport,
    clearChecks,
    getChecksByType,
    getChecksByStatus,
    getSummary,
    formatTimestamp,
    getStatusColor
  };
}

// Example usage:
/*
function SecurityComponent() {
  const {
    checks,
    metrics,
    isAnalyzing,
    analyzePage,
    getSummary
  } = useSecurity({
    onSecurityCheck: (check) => {
      console.log('Security check completed:', check);
    }
  });

  const handleAnalyze = async () => {
    await analyzePage(
      'http://localhost:3002/',
      document.documentElement.outerHTML,
      {
        'content-security-policy': '...',
        'strict-transport-security': '...'
      }
    );
  };

  const summary = getSummary();

  return (
    <div>
      <div>Total Checks: {summary.totalChecks}</div>
      <div>Failed Checks: {summary.failedChecks}</div>
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Security'}
      </button>
    </div>
  );
}
*/
