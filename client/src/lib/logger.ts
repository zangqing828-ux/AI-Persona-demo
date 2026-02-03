/**
 * Professional logging utility
 * Provides environment-aware logging with proper levels and formatting
 */

type LogLevel = 'log' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: Date;
  message: string;
  data?: unknown[];
}

class Logger {
  private isDev = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private shouldLog(level: LogLevel): boolean {
    // Always log errors and warnings
    if (level === 'error' || level === 'warn') return true;

    // Only log debug messages in development
    return this.isDev;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  private addLog(level: LogLevel, message: string, data?: unknown[]): void {
    const entry: LogEntry = {
      level,
      timestamp: new Date(),
      message,
      data,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  log(...args: unknown[]): void {
    if (!this.shouldLog('log')) return;

    const [message, ...data] = args as [string, ...unknown[]];
    console.log(this.formatMessage('log', message), ...data);
    this.addLog('log', message, data);
  }

  warn(...args: unknown[]): void {
    if (!this.shouldLog('warn')) return;

    const [message, ...data] = args as [string, ...unknown[]];
    console.warn(this.formatMessage('warn', message), ...data);
    this.addLog('warn', message, data);
  }

  error(...args: unknown[]): void {
    if (!this.shouldLog('error')) return;

    const [message, ...data] = args as [string, ...unknown[]];
    console.error(this.formatMessage('error', message), ...data);
    this.addLog('error', message, data);
  }

  /**
   * Get all logged entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const logger = new Logger();

// Convenience exports
export const log = (...args: unknown[]) => logger.log(...args);
export const warn = (...args: unknown[]) => logger.warn(...args);
export const error = (...args: unknown[]) => logger.error(...args);
