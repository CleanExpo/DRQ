import { useState, useEffect, useCallback } from 'react';
import { diagnosticService } from '../services/DiagnosticService';
import { logger } from '../utils/logger';

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

interface UseDiagnosticOptions {
  onDiagnosticResult?: (result: DiagnosticResult) => void;
  onPerformanceMetrics?: (metrics: PerformanceMetrics) => void;
  onError?: (error: Error) => void;
  autoCollectMetrics?: boolean;
}

export function useDiagnostic(options: UseDiagnosticOptions = {}) {
  const {
    onDiagnosticResult,
    onPerformanceMetrics,
    onError,
    autoCollectMetrics = true
  } = options;

  const [currentInfo, setCurrentInfo] = useState<DiagnosticInfo | null>(null);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCollectingMetrics, setIsCollectingMetrics] = useState(false);

  useEffect(() => {
    // Update results when diagnostic info changes
    const updateResults = async () => {
      if (currentInfo) {
        try {
          const result = await diagnosticService.analyzeLighthouseError();
          setResults(prev => [...prev, result]);
          onDiagnosticResult?.(result);
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to analyze diagnostics');
          onError?.(err);
          logger.error('Diagnostic analysis failed', { error });
        }
      }
    };

    updateResults();
  }, [currentInfo, onDiagnosticResult, onError]);

  useEffect(() => {
    // Auto-collect performance metrics if enabled
    if (autoCollectMetrics) {
      const collectMetrics = async () => {
        await collectPerformanceMetrics();
      };

      collectMetrics();
    }
  }, [autoCollectMetrics]);

  const setDiagnosticInfo = useCallback((info: DiagnosticInfo) => {
    try {
      diagnosticService.setDiagnosticInfo(info);
      setCurrentInfo(info);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to set diagnostic info');
      onError?.(err);
      logger.error('Failed to set diagnostic info', { error });
    }
  }, [onError]);

  const collectPerformanceMetrics = useCallback(async () => {
    setIsCollectingMetrics(true);
    try {
      const metrics = await diagnosticService.collectPerformanceMetrics();
      if (metrics) {
        setPerformanceMetrics(metrics);
        onPerformanceMetrics?.(metrics);
      }
      return metrics;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to collect performance metrics');
      onError?.(err);
      logger.error('Failed to collect performance metrics', { error });
      throw err;
    } finally {
      setIsCollectingMetrics(false);
    }
  }, [onPerformanceMetrics, onError]);

  const analyzeLighthouseError = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const result = await diagnosticService.analyzeLighthouseError();
      setResults(prev => [...prev, result]);
      onDiagnosticResult?.(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to analyze Lighthouse error');
      onError?.(err);
      logger.error('Failed to analyze Lighthouse error', { error });
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [onDiagnosticResult, onError]);

  const generateReport = useCallback(async () => {
    try {
      return await diagnosticService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Failed to generate report', { error });
      throw err;
    }
  }, [onError]);

  const clearDiagnostics = useCallback(() => {
    try {
      diagnosticService.clearDiagnostics();
      setCurrentInfo(null);
      setResults([]);
      setPerformanceMetrics(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to clear diagnostics');
      onError?.(err);
      logger.error('Failed to clear diagnostics', { error });
    }
  }, [onError]);

  const getResultsByType = useCallback((type: 'error' | 'warning' | 'info') => {
    return results.filter(result => result.type === type);
  }, [results]);

  const getSummary = useCallback(() => {
    return {
      totalErrors: getResultsByType('error').length,
      totalWarnings: getResultsByType('warning').length,
      totalInfos: getResultsByType('info').length,
      lastResult: results[results.length - 1],
      hasActiveErrors: getResultsByType('error').length > 0,
      performanceMetrics: performanceMetrics ? {
        timeToFirstByte: `${performanceMetrics.timeToFirstByte.toFixed(2)}ms`,
        firstContentfulPaint: `${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`,
        largestContentfulPaint: `${performanceMetrics.largestContentfulPaint.toFixed(2)}ms`,
        cumulativeLayoutShift: performanceMetrics.cumulativeLayoutShift.toFixed(3)
      } : null
    };
  }, [results, getResultsByType, performanceMetrics]);

  const formatTimestamp = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  }, []);

  const getErrorSeverity = useCallback((result: DiagnosticResult): string => {
    switch (result.type) {
      case 'error':
        return 'High';
      case 'warning':
        return 'Medium';
      case 'info':
        return 'Low';
      default:
        return 'Unknown';
    }
  }, []);

  return {
    currentInfo,
    results,
    performanceMetrics,
    isAnalyzing,
    isCollectingMetrics,
    setDiagnosticInfo,
    analyzeLighthouseError,
    collectPerformanceMetrics,
    generateReport,
    clearDiagnostics,
    getResultsByType,
    getSummary,
    formatTimestamp,
    getErrorSeverity
  };
}

// Example usage:
/*
function DiagnosticComponent() {
  const {
    currentInfo,
    results,
    performanceMetrics,
    isAnalyzing,
    isCollectingMetrics,
    setDiagnosticInfo,
    analyzeLighthouseError,
    collectPerformanceMetrics,
    getSummary
  } = useDiagnostic({
    onDiagnosticResult: (result) => {
      console.log('New diagnostic result:', result);
    },
    onPerformanceMetrics: (metrics) => {
      console.log('Performance metrics collected:', metrics);
    },
    autoCollectMetrics: true
  });

  useEffect(() => {
    // Set initial diagnostic info
    setDiagnosticInfo({
      version: '12.2.2',
      url: 'http://localhost:3002/',
      error: 'Chrome prevented page load due to an interstitial error.',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
      benchmarkIndex: 4496,
      timestamp: Date.now()
    });
  }, [setDiagnosticInfo]);

  const handleAnalyze = async () => {
    await analyzeLighthouseError();
  };

  const handleCollectMetrics = async () => {
    await collectPerformanceMetrics();
  };

  const summary = getSummary();

  return (
    <div>
      <div>Total Errors: {summary.totalErrors}</div>
      <div>Total Warnings: {summary.totalWarnings}</div>
      {summary.performanceMetrics && (
        <div>
          <h3>Performance Metrics</h3>
          <div>TTFB: {summary.performanceMetrics.timeToFirstByte}</div>
          <div>FCP: {summary.performanceMetrics.firstContentfulPaint}</div>
          <div>LCP: {summary.performanceMetrics.largestContentfulPaint}</div>
          <div>CLS: {summary.performanceMetrics.cumulativeLayoutShift}</div>
        </div>
      )}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Error'}
      </button>
      <button
        onClick={handleCollectMetrics}
        disabled={isCollectingMetrics}
      >
        {isCollectingMetrics ? 'Collecting...' : 'Collect Metrics'}
      </button>
    </div>
  );
}
*/
