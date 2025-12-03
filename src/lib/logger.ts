/**
 * Centralized logging utility
 * Provides structured logging with different levels and environment-aware output
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Format log message with context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Debug level logging (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage("info", message, context));
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("warn", message, context));
  }

  /**
   * Error level logging
   * Always logs to console and can be extended to send to error monitoring service
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      }),
    };

    console.error(this.formatMessage("error", message, errorContext));

    // TODO: Send to error monitoring service (e.g., Sentry)
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(error, { extra: context });
    // }
  }

  /**
   * Log AI agent activity
   */
  agent(message: string, context?: LogContext): void {
    const agentMessage = `[Lumina AI] ${message}`;
    this.info(agentMessage, context);
  }

  /**
   * Log database queries (development only)
   */
  database(query: string, duration?: number): void {
    if (this.isDevelopment) {
      this.debug("Database query", { query, duration });
    }
  }

  /**
   * Log API requests
   */
  api(method: string, path: string, status: number, duration?: number): void {
    const level = status >= 400 ? "warn" : "info";
    this[level](`API ${method} ${path}`, { status, duration });
  }
}

// Export singleton instance
export const logger = new Logger();
