import chalk from "chalk";
import moment from "moment";
import os from "os";

// Add environment checks
const isDevelopment =
    process.env.APP_ENV === 'Development' ||
    process.env.NODE_ENV === 'development';

// Define log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

// Override console.log in development
if (isDevelopment) {
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    const stack = new Error().stack;
    const callerFile = stack.split('\n')[2].match(/\((.*):\d+:\d+\)/)?.[1] || 'unknown';
    const logger = new Log(callerFile);
    logger.debug(...args);
  };
}

/**
 * Structured Output:
 * Log.debug/info provides consistent formatting with:
 * - Timestamps
 * - Source file identification
 * - Color coding (using chalk)
 * - Log level categorization
 *
 * Production Safety:
 * console.log statements remain in your production code unless manually removed
 * Your Log class automatically filters debug/info logs in production
 * Error logs always show regardless of environment
 *
 * Use log levels appropriately:
 * - debug: Detailed information for debugging
 * - info: General operational information
 * - warn: Warning messages for potential issues
 * - error: Error conditions that need attention
 *
 * In production:
 * - debug and info logs are automatically filtered out
 * - warnings and errors will still show
 * - No performance impact from disabled logs
 *
 * Example Use:
 * import { createLogger } from '../libs/log';
 * const Log = createLogger('UserService.js');
 *
 * Log.debug('Processing user data');
 */
class Log {
  constructor(filename) {
    this.source = filename;
    this._dashString = '-'.repeat(106);
    // Set log level from environment
    this.logLevel = isDevelopment ? LOG_LEVELS.debug : LOG_LEVELS.warn;
  }

  // Add level checking method
  shouldLog(level) {
    return level <= this.logLevel;
  }

  // Get the current time for the log information to be recorded
  getLogDate() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  // Modified debug method with environment check
  debug(msg, ...args) {
    if (!this.shouldLog(LOG_LEVELS.debug)) return;

    const formattedMsg = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg;
    console.log(
        `${this._dashString}\n${this.getLogDate()} [${chalk.yellow(this.source)}]\n\nMESSAGE: ${formattedMsg}\n`,
        ...args
    );
  }

  // Modified info method
  info(msg) {
    // In production (when not in development), logs are automatically filtered based on severity
    if (!this.shouldLog(LOG_LEVELS.info)) return;

    console.log(
        `\n${chalk.blue(this.getLogDate())} ${chalk.blue(
            `( ${this.source} )`
        )} : ${msg}\n`
    );
  }

  // Modified warn method
  warn(msg) {
    if (!this.shouldLog(LOG_LEVELS.warn)) return;

    console.log(
        `\n${chalk.red(this.getLogDate())} ${chalk.red(
            `( ${this.source} )`
        )} : ${msg}\n`
    );
  }

  // Keep error logging always active
  error(msg) {
    console.log(
        `\n${chalk.redBright(this.getLogDate())} ${chalk.redBright(
            `( ${this.source} )`
        )} : ${msg}\n`
    );
  }

  // Add production-safe object inspection
  objectInfo(msg, obj) {
    if (!this.shouldLog(LOG_LEVELS.debug)) return;

    const data = Object.entries(obj)
        .map(([key, value]) => {
          const stringValue = typeof value === 'object'
              ? JSON.stringify(value, null, 2)
              : value;
          return `${key} : ${stringValue}`;
        })
        .join("\n");

    console.log(
        `${this.source} ${this.getLogDate()}\n\n${msg} ->\n\n${data}\n`
    );
  }

  // Keep error logging as-is (always active)
  errLog(errorCode, methodName, description) {
    // ... existing implementation ...
  }
}

// Create a global logger instance
export const logger = new Log('global');

// Export factory function for specific file loggers
export const createLogger = (filename) => new Log(filename);

// Export convenience methods
export const debug = (...args) => logger.debug(...args);
export const info = (...args) => logger.info(...args);
export const warn = (...args) => logger.warn(...args);
export const error = (...args) => logger.error(...args);