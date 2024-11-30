export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;
  private logBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 1000;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, args);
  }

  public debug(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, args);
    }
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  private log(level: LogLevel, message: string, args: any[]): void {
    const timestamp = this.formatDate(new Date());
    const entry: LogEntry = {
      level,
      message,
      timestamp,
      data: args.length > 0 ? args : undefined
    };

    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console output
    const logFn = this.getConsoleMethod(level);
    const prefix = `[${timestamp}] ${level}:`;

    if (args.length > 0) {
      logFn(prefix, message, ...args);
    } else {
      logFn(prefix, message);
    }

    // In development, also log to browser console if available
    if (this.isDevelopment && typeof window !== 'undefined') {
      this.logToBrowser(entry);
    }
  }

  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.ERROR:
        return console.error;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.DEBUG:
        return console.debug;
      default:
        return console.log;
    }
  }

  private logToBrowser(entry: LogEntry): void {
    const style = this.getBrowserLogStyle(entry.level);
    console.groupCollapsed(
      `%c${entry.timestamp} ${entry.level}`,
      `color: ${style.color}; font-weight: bold;`
    );
    console.log('Message:', entry.message);
    if (entry.data) {
      console.log('Data:', entry.data);
    }
    console.groupEnd();
  }

  private getBrowserLogStyle(level: LogLevel): { color: string } {
    switch (level) {
      case LogLevel.ERROR:
        return { color: '#ff0000' };
      case LogLevel.WARN:
        return { color: '#ffa500' };
      case LogLevel.INFO:
        return { color: '#0000ff' };
      case LogLevel.DEBUG:
        return { color: '#808080' };
    }
  }

  public getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  public clearBuffer(): void {
    this.logBuffer = [];
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
