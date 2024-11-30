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

class LoggingService {
  private static instance: LoggingService;
  private logs: Map<string, LogEntry> = new Map();
  private groups: Map<string, LogGroup> = new Map();
  private metrics: LogMetrics;
  private sessionId: string;
  private maxLogAge = 24 * 60 * 60 * 1000; // 24 hours
  private maxLogsPerGroup = 100;

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.sessionId = this.generateSessionId();
    this.setupCleanupInterval();
  }

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private initializeMetrics(): LogMetrics {
    return {
      totalLogs: 0,
      logsByLevel: {},
      topMessages: [],
      logsPerMinute: 0,
      lastUpdate: Date.now()
    };
  }

  private setupCleanupInterval(): void {
    // Clean up old logs every hour
    setInterval(() => this.cleanupOldLogs(), 60 * 60 * 1000);
  }

  private cleanupOldLogs(): void {
    const now = Date.now();
    for (const [id, log] of this.logs) {
      if (now - new Date(log.timestamp).getTime() > this.maxLogAge) {
        this.logs.delete(id);
      }
    }
    this.updateMetrics();
  }

  public debug(message: string, context: Partial<LogEntry['context']> = {}): void {
    this.log('debug', message, context);
  }

  public info(message: string, context: Partial<LogEntry['context']> = {}): void {
    this.log('info', message, context);
  }

  public warn(message: string, context: Partial<LogEntry['context']> = {}): void {
    this.log('warn', message, context);
  }

  public error(message: string, context: Partial<LogEntry['context']> = {}): void {
    this.log('error', message, context);
  }

  private log(
    level: LogEntry['level'],
    message: string,
    context: Partial<LogEntry['context']>
  ): void {
    try {
      const logEntry: LogEntry = {
        id: this.generateId(),
        level,
        message,
        timestamp: new Date().toISOString(),
        context: {
          path: typeof window !== 'undefined' ? window.location.pathname : '',
          sessionId: this.sessionId,
          ...context
        }
      };

      this.logs.set(logEntry.id, logEntry);
      this.groupLog(logEntry);
      this.updateMetrics();
      this.persistLog(logEntry);

      // Console output in development
      if (process.env.NODE_ENV === 'development') {
        const consoleMethod = console[level] || console.log;
        consoleMethod(`[${level.toUpperCase()}] ${message}`, context);
      }
    } catch (error) {
      console.error('Failed to log message', { level, message, error });
    }
  }

  private groupLog(log: LogEntry): void {
    const hash = this.generateLogHash(log);
    const existingGroup = this.groups.get(hash);

    if (existingGroup) {
      existingGroup.count++;
      existingGroup.lastSeen = log.timestamp;
      existingGroup.contexts.unshift(log.context);
      if (existingGroup.contexts.length > this.maxLogsPerGroup) {
        existingGroup.contexts.pop();
      }
    } else {
      const group: LogGroup = {
        id: this.generateId(),
        hash,
        level: log.level,
        message: log.message,
        count: 1,
        firstSeen: log.timestamp,
        lastSeen: log.timestamp,
        contexts: [log.context]
      };
      this.groups.set(hash, group);
    }
  }

  private generateLogHash(log: LogEntry): string {
    // Create a unique hash based on log properties
    const hashInput = `${log.level}:${log.message}`;
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

  private async persistLog(log: LogEntry): Promise<void> {
    try {
      // In production, this would send logs to a logging service
      // For now, we'll just store in localStorage for development
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
        logs.unshift(log);
        if (logs.length > 1000) logs.pop(); // Keep last 1000 logs
        localStorage.setItem('app_logs', JSON.stringify(logs));
      }
    } catch (error) {
      console.error('Failed to persist log', { log, error });
    }
  }

  public async getLogs(
    options: {
      level?: LogEntry['level'];
      search?: string;
      startTime?: string;
      endTime?: string;
      limit?: number;
    } = {}
  ): Promise<LogEntry[]> {
    const logs = Array.from(this.logs.values());
    return logs.filter(log => {
      if (options.level && log.level !== options.level) return false;
      if (options.search && !log.message.toLowerCase().includes(options.search.toLowerCase())) {
        return false;
      }
      if (options.startTime && log.timestamp < options.startTime) return false;
      if (options.endTime && log.timestamp > options.endTime) return false;
      return true;
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, options.limit);
  }

  public async getLogGroups(level?: LogEntry['level']): Promise<LogGroup[]> {
    const groups = Array.from(this.groups.values());
    return level ? groups.filter(group => group.level === level) : groups;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private updateMetrics(): void {
    const logs = Array.from(this.logs.values());
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Calculate logs by level
    const logsByLevel = logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate top messages
    const messageCount = new Map<string, { count: number; level: string; message: string }>();
    logs.forEach(log => {
      const hash = this.generateLogHash(log);
      const existing = messageCount.get(hash);
      if (existing) {
        existing.count++;
      } else {
        messageCount.set(hash, { count: 1, level: log.level, message: log.message });
      }
    });

    const topMessages = Array.from(messageCount.entries())
      .map(([hash, data]) => ({
        hash,
        count: data.count,
        message: data.message,
        level: data.level
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate logs per minute
    const recentLogs = logs.filter(
      log => new Date(log.timestamp).getTime() > oneMinuteAgo
    );

    this.metrics = {
      totalLogs: logs.length,
      logsByLevel,
      topMessages,
      logsPerMinute: recentLogs.length,
      lastUpdate: now
    };
  }

  public getMetrics(): LogMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      recentLogs: await this.getLogs({ limit: 100 }),
      logGroups: await this.getLogGroups(),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }

  public async exportLogs(format: 'json' | 'csv' = 'json'): Promise<string> {
    const logs = await this.getLogs();

    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'path', 'component', 'sessionId'];
      const rows = logs.map(log => [
        log.timestamp,
        log.level,
        log.message,
        log.context.path,
        log.context.component || '',
        log.context.sessionId
      ]);
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    return JSON.stringify(logs, null, 2);
  }
}

export const loggingService = LoggingService.getInstance();
export default LoggingService;
