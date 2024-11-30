import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

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

class ErrorService {
  private static instance: ErrorService;
  private errors: Map<string, ErrorEvent> = new Map();
  private groups: Map<string, ErrorGroup> = new Map();
  private metrics: ErrorMetrics;
  private observers: ((type: string, data: any) => void)[] = [];
  private sessionId: string;

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  private initializeMetrics(): ErrorMetrics {
    return {
      totalErrors: 0,
      activeErrors: 0,
      errorsByType: {},
      errorsBySeverity: {},
      topErrors: [],
      errorRate: 0,
      lastUpdate: Date.now()
    };
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle uncaught errors
    window.onerror = (message, source, lineno, colno, error) => {
      this.trackError(error || new Error(String(message)), {
        type: 'runtime',
        severity: 'high'
      });
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason, {
        type: 'runtime',
        severity: 'high'
      });
    });

    // Handle network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.trackError(new Error(`HTTP ${response.status}: ${response.statusText}`), {
            type: 'network',
            severity: 'medium',
            customData: {
              url: args[0],
              status: response.status
            }
          });
        }
        return response;
      } catch (error) {
        this.trackError(error as Error, {
          type: 'network',
          severity: 'high',
          customData: { url: args[0] }
        });
        throw error;
      }
    };
  }

  public trackError(
    error: Error,
    options: {
      type?: ErrorEvent['type'];
      severity?: ErrorEvent['severity'];
      component?: string;
      action?: string;
      userId?: string;
      customData?: Record<string, any>;
    } = {}
  ): void {
    try {
      const errorEvent: ErrorEvent = {
        id: this.generateId(),
        type: options.type || 'runtime',
        name: error.name,
        message: error.message,
        stack: error.stack,
        severity: options.severity || this.calculateSeverity(error),
        metadata: {
          timestamp: new Date().toISOString(),
          path: window.location.pathname,
          component: options.component,
          action: options.action,
          userId: options.userId,
          sessionId: this.sessionId,
          browser: navigator.userAgent,
          os: navigator.platform,
          customData: options.customData
        }
      };

      this.errors.set(errorEvent.id, errorEvent);
      this.groupError(errorEvent);
      this.updateMetrics();
      this.notifyObservers('error:tracked', errorEvent);

      logger.error('Error tracked', { 
        type: errorEvent.type, 
        message: errorEvent.message,
        severity: errorEvent.severity
      });
    } catch (trackingError) {
      logger.error('Failed to track error', { error, trackingError });
    }
  }

  private calculateSeverity(error: Error): ErrorEvent['severity'] {
    // Determine severity based on error type and message
    if (error instanceof TypeError || error instanceof ReferenceError) {
      return 'high';
    }
    if (error instanceof SyntaxError) {
      return 'critical';
    }
    if (error.message.toLowerCase().includes('network')) {
      return 'medium';
    }
    return 'low';
  }

  private groupError(error: ErrorEvent): void {
    const hash = this.generateErrorHash(error);
    const existingGroup = this.groups.get(hash);

    if (existingGroup) {
      existingGroup.count++;
      existingGroup.lastSeen = error.metadata.timestamp;
      existingGroup.metadata.affectedSessions = new Set([
        ...Array.from(this.errors.values())
          .filter(e => this.generateErrorHash(e) === hash)
          .map(e => e.metadata.sessionId)
      ]).size;
      existingGroup.metadata.occurrencesByPath[error.metadata.path] = 
        (existingGroup.metadata.occurrencesByPath[error.metadata.path] || 0) + 1;
    } else {
      const group: ErrorGroup = {
        id: this.generateId(),
        hash,
        type: error.type,
        name: error.name,
        message: error.message,
        severity: error.severity,
        count: 1,
        firstSeen: error.metadata.timestamp,
        lastSeen: error.metadata.timestamp,
        status: 'active',
        metadata: {
          affectedUsers: 1,
          affectedSessions: 1,
          occurrencesByPath: {
            [error.metadata.path]: 1
          }
        }
      };
      this.groups.set(hash, group);
    }
  }

  private generateErrorHash(error: ErrorEvent): string {
    // Create a unique hash based on error properties
    const hashInput = `${error.type}:${error.name}:${error.message}:${error.stack?.split('\n')[1] || ''}`;
    return this.hashString(hashInput);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  public async resolveError(groupId: string): Promise<void> {
    try {
      const group = this.groups.get(groupId);
      if (!group) {
        throw new Error(`Error group not found: ${groupId}`);
      }

      group.status = 'resolved';
      this.updateMetrics();
      this.notifyObservers('error:resolved', group);

      logger.debug('Error resolved', { groupId });
    } catch (error) {
      logger.error('Failed to resolve error', { groupId, error });
      throw error;
    }
  }

  public async ignoreError(groupId: string): Promise<void> {
    try {
      const group = this.groups.get(groupId);
      if (!group) {
        throw new Error(`Error group not found: ${groupId}`);
      }

      group.status = 'ignored';
      this.updateMetrics();
      this.notifyObservers('error:ignored', group);

      logger.debug('Error ignored', { groupId });
    } catch (error) {
      logger.error('Failed to ignore error', { groupId, error });
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public onErrorEvent(callback: (type: string, data: any) => void): () => void {
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
        logger.error('Error event callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    const errors = Array.from(this.errors.values());
    const groups = Array.from(this.groups.values());
    const activeGroups = groups.filter(g => g.status === 'active');

    // Calculate error metrics
    const errorsByType = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topErrors = groups
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(group => ({
        hash: group.hash,
        count: group.count,
        message: group.message
      }));

    this.metrics = {
      totalErrors: errors.length,
      activeErrors: activeGroups.length,
      errorsByType,
      errorsBySeverity,
      topErrors,
      errorRate: this.calculateErrorRate(errors),
      lastUpdate: Date.now()
    };
  }

  private calculateErrorRate(errors: ErrorEvent[]): number {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    const recentErrors = errors.filter(
      error => new Date(error.metadata.timestamp).getTime() > hourAgo
    );
    return recentErrors.length;
  }

  public getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      errorGroups: Array.from(this.groups.values()).map(group => ({
        type: group.type,
        name: group.name,
        message: group.message,
        severity: group.severity,
        count: group.count,
        status: group.status,
        firstSeen: group.firstSeen,
        lastSeen: group.lastSeen,
        affectedUsers: group.metadata.affectedUsers,
        affectedSessions: group.metadata.affectedSessions
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const errorService = ErrorService.getInstance();
export default ErrorService;
