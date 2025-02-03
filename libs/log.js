import chalk from "chalk";
import moment from "moment";
import os from "os";

// Configuration
const CONFIG = {
  environment: process.env.APP_ENV || process.env.NODE_ENV || 'production',
  applicationName: process.env.APP_NAME || 'AdhereLive'
};

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

// Store original console methods
const originalConsole = {
  log: console.log.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console)
};

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
    originalConsole.log(
        `${this._dashString}\n${this.getLogDate()} [${chalk.yellow(this.source)}]\n\nMESSAGE: ${formattedMsg}\n`,
        ...args
    );
  }

  // Modified info method
  info(msg) {
    if (!this.shouldLog(LOG_LEVELS.info)) return;

    originalConsole.log(
        `\n${chalk.blue(this.getLogDate())} ${chalk.blue(
            `( ${this.source} )`
        )} : ${msg}\n`
    );
  }

  // Modified warn method
  warn(msg) {
    if (!this.shouldLog(LOG_LEVELS.warn)) return;

    originalConsole.log(
        `\n${chalk.red(this.getLogDate())} ${chalk.red(
            `( ${this.source} )`
        )} : ${msg}\n`
    );
  }

  // Keep error logging always active
  error(msg) {
    originalConsole.log(
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

    originalConsole.log(
        `${this.source} ${this.getLogDate()}\n\n${msg} ->\n\n${data}\n`
    );
  }

  // Keep error logging  implementation as-is (always active)
  errLog(errorCode, methodName, description) {
    const serverName = os.hostname();
    const logDate = this.getLogDate();
    const errLog = `\n\n${chalk.blue(logDate)}\n` +
        `${chalk.blue('errorCode=')} ${errorCode}\n` +
        `${chalk.blue('Server=')} ${serverName}\n` +
        `${chalk.blue('Application=')} ${CONFIG.applicationName}\n` +
        `${chalk.blue('Source=')} ${this.source}\n` +
        `${chalk.blue('Method=')} ${methodName}\n` +
        `${chalk.blue('Description=')} ${description}\n`;

    originalConsole.error(errLog);
    throw new Error(description);
  }
}

// Create a global logger instance
const globalLogger = new Log('global');

// Safe console.log override for development
if (isDevelopment) {
  console.log = (...args) => {
    try {
      const stack = new Error().stack;
      const callerFile = stack.split('\n')[2].match(/\((.*):\d+:\d+\)/)?.[1] || 'unknown';
      const logger = new Log(callerFile);
      logger.debug(...args);
    } catch (error) {
      // Fallback to original console.log if something goes wrong
      originalConsole.log(...args);
    }
  };
}

// Export factory function for specific file loggers
export const createLogger = (filename) => new Log(filename);

// Export convenience methods using the global logger
export const debug = (...args) => globalLogger.debug(...args);
export const info = (...args) => globalLogger.info(...args);
export const warn = (...args) => globalLogger.warn(...args);
export const error = (...args) => globalLogger.error(...args);

// Export the global logger instance
export const logger = globalLogger;

// Default export for backward compatibility
export default createLogger;