import { useState, useEffect, useCallback } from 'react';
import { diagnosticAlertService } from '../services/DiagnosticAlertService';

interface AlertConfig {
  type: 'performance' | 'security' | 'error';
  severity: 'info' | 'warning' | 'error';
  threshold?: number;
  message: string;
  enabled: boolean;
}

interface Alert {
  id: string;
  type: 'performance' | 'security' | 'error';
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
  details?: Record<string, any>;
}

interface UseDiagnosticAlertOptions {
  onAlert?: (alert: Alert) => void;
  onError?: (error: Error) => void;
}

export function useDiagnosticAlert(options: UseDiagnosticAlertOptions = {}) {
  const { onAlert, onError } = options;

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [configs, setConfigs] = useState<Map<string, AlertConfig>>(new Map());

  useEffect(() => {
    // Initialize configs
    setConfigs(diagnosticAlertService.getAlertConfigs());

    // Add alert handler
    const handleAlert = (alert: Alert) => {
      setAlerts(prev => [alert, ...prev]);
      onAlert?.(alert);
    };

    diagnosticAlertService.addHandler(handleAlert);

    return () => {
      diagnosticAlertService.removeHandler(handleAlert);
    };
  }, [onAlert]);

  const addAlertConfig = useCallback((config: AlertConfig) => {
    try {
      diagnosticAlertService.addAlertConfig(config);
      setConfigs(diagnosticAlertService.getAlertConfigs());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to add alert config');
      onError?.(err);
      console.error('Failed to add alert config:', error);
    }
  }, [onError]);

  const removeAlertConfig = useCallback((id: string) => {
    try {
      diagnosticAlertService.removeAlertConfig(id);
      setConfigs(diagnosticAlertService.getAlertConfigs());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to remove alert config');
      onError?.(err);
      console.error('Failed to remove alert config:', error);
    }
  }, [onError]);

  const updateAlertConfig = useCallback((id: string, config: Partial<AlertConfig>) => {
    try {
      diagnosticAlertService.updateAlertConfig(id, config);
      setConfigs(diagnosticAlertService.getAlertConfigs());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update alert config');
      onError?.(err);
      console.error('Failed to update alert config:', error);
    }
  }, [onError]);

  const clearAlerts = useCallback(() => {
    try {
      diagnosticAlertService.clearAlertHistory();
      setAlerts([]);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to clear alerts');
      onError?.(err);
      console.error('Failed to clear alerts:', error);
    }
  }, [onError]);

  const checkPerformanceMetrics = useCallback((metrics: Record<string, number>) => {
    try {
      diagnosticAlertService.checkPerformanceMetrics(metrics);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to check performance metrics');
      onError?.(err);
      console.error('Failed to check performance metrics:', error);
    }
  }, [onError]);

  const checkSecurityIssue = useCallback((issue: { severity: string; message: string; details?: any }) => {
    try {
      diagnosticAlertService.checkSecurityIssue(issue);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to check security issue');
      onError?.(err);
      console.error('Failed to check security issue:', error);
    }
  }, [onError]);

  const checkError = useCallback((error: Error & { severity?: 'info' | 'warning' | 'error' }) => {
    try {
      diagnosticAlertService.checkError(error);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check error');
      onError?.(error);
      console.error('Failed to check error:', err);
    }
  }, [onError]);

  const getAlertsByType = useCallback((type: 'performance' | 'security' | 'error') => {
    return alerts.filter(alert => alert.type === type);
  }, [alerts]);

  const getAlertsBySeverity = useCallback((severity: 'info' | 'warning' | 'error') => {
    return alerts.filter(alert => alert.severity === severity);
  }, [alerts]);

  const getActiveConfigs = useCallback(() => {
    return Array.from(configs.entries())
      .filter(([_, config]) => config.enabled)
      .map(([id, config]) => ({ id, ...config }));
  }, [configs]);

  const formatAlertTimestamp = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  }, []);

  return {
    alerts,
    configs,
    addAlertConfig,
    removeAlertConfig,
    updateAlertConfig,
    clearAlerts,
    checkPerformanceMetrics,
    checkSecurityIssue,
    checkError,
    getAlertsByType,
    getAlertsBySeverity,
    getActiveConfigs,
    formatAlertTimestamp
  };
}

export default useDiagnosticAlert;
