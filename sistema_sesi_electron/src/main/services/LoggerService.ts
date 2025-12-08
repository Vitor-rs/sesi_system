import { app } from 'electron'

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

class LoggerService {
  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString()
    const dataString = data ? ` | Data: ${JSON.stringify(data)}` : ''
    return `[${timestamp}] [${level}] ${message}${dataString}`
  }

  info(message: string, data?: unknown): void {
    console.log(this.formatMessage(LogLevel.INFO, message, data))
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, data))
  }

  error(message: string, error?: unknown): void {
    const errorString =
      error instanceof Error ? error.stack || error.message : JSON.stringify(error)
    console.error(this.formatMessage(LogLevel.ERROR, message), `\nError Details: ${errorString}`)
  }

  debug(message: string, data?: unknown): void {
    // Only log debug messages in development
    if (!app.isPackaged) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, data))
    }
  }
}

export const logger = new LoggerService()
