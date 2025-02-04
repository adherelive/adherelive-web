import winston from 'winston';
import 'winston-daily-rotate-file';
import chalk from 'chalk';
import moment from 'moment';
import os from 'os';
import path from 'path';
import { AsyncLocalStorage } from 'async_hooks';

// Initialize AsyncLocalStorage for request tracking
const requestContext = new AsyncLocalStorage();

// Configuration
const CONFIG = {
  environment: process.env.APP_ENV || process.env.NODE_ENV || 'production',
  applicationName: process.env.APP_NAME || 'AdhereLive',
  logDir: process.env.LOG_DIR || 'logs',
  // External logging service configuration
  externalLogging: {
    enabled: process.env.EXTERNAL_LOGGING_ENABLED === 'true',
    host: process.env.EXTERNAL_LOGGING_HOST,
    apiKey: process.env.EXTERNAL_LOGGING_API_KEY,
  }
};

// Add environment checks
const isDevelopment =
    process.env.APP_ENV === 'development' ||
    process.env.NODE_ENV === 'development';

// Custom format for console output
const consoleFormat = winston.format.printf(({ level, message, timestamp, source, requestId }) => {
  const colorizer = {
    debug: chalk.yellow,
    info: chalk.blue,
    warn: chalk.red,
    error: chalk.redBright
  };

  const color = colorizer[level] || chalk.white;
  const reqIdStr = requestId ? ` [${requestId}]` : '';
  return `\n${color(timestamp)} ${color(`( ${source} )`)}${reqIdStr} : ${message}\n`;
});

// Create custom formats
const formats = {
  default: winston.format.combine(
      winston.format.timestamp({
        format: () => moment().format('YYYY-MM-DD HH:mm:ss')
      }),
      winston.format.metadata(),
      consoleFormat
  ),
  json: winston.format.combine(
      winston.format.timestamp({
        format: () => moment().format('YYYY-MM-DD HH:mm:ss')
      }),
      winston.format.json()
  ),
  error: winston.format.combine(
      winston.format.timestamp({
        format: () => moment().format('YYYY-MM-DD HH:mm:ss')
      }),
      winston.format.metadata(),
      winston.format.printf(({ message, timestamp, errorCode, methodName, source, requestId }) => {
        const reqIdStr = requestId ? `\n${chalk.blue('RequestId=')} ${requestId}` : '';
        return `\n\n${chalk.blue(timestamp)}\n` +
            `${chalk.blue('errorCode=')} ${errorCode}\n` +
            `${chalk.blue('Server=')} ${os.hostname()}\n` +
            `${chalk.blue('Application=')} ${CONFIG.applicationName}\n` +
            `${chalk.blue('Source=')} ${source}\n` +
            `${chalk.blue('Method=')} ${methodName}${reqIdStr}\n` +
            `${chalk.blue('Description=')} ${message}\n`;
      })
  )
};

// Custom Transport for External Logging Service
class ExternalLoggingTransport extends winston.Transport {
  constructor(opts) {
    super(opts);
    this.host = CONFIG.externalLogging.host;
    this.apiKey = CONFIG.externalLogging.apiKey;
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (CONFIG.externalLogging.enabled && this.host && this.apiKey) {
      try {
        // Example implementation - replace with your actual external logging service
        await fetch(this.host, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            timestamp: info.timestamp,
            level: info.level,
            message: info.message,
            metadata: info.metadata,
            application: CONFIG.applicationName,
            environment: CONFIG.environment,
            hostname: os.hostname(),
            requestId: info.requestId
          })
        });
      } catch (error) {
        console.error('External logging failed:', error);
      }
    }

    callback();
  }
}

class WinstonLogger {
  constructor(filename) {
    this.source = filename;
    this._dashString = '-'.repeat(106);

    // Set up file transport options
    const fileTransportOptions = {
      dirname: CONFIG.logDir,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: formats.json
    };

    // Create transports array
    const transports = [
      new winston.transports.Console({
        format: formats.default
      })
    ];

    // Add file transports in production
    if (!isDevelopment) {
      // Combined logs
      transports.push(
          new winston.transports.DailyRotateFile({
            ...fileTransportOptions,
            filename: 'combined-%DATE%.log'
          })
      );

      // Error logs
      transports.push(
          new winston.transports.DailyRotateFile({
            ...fileTransportOptions,
            filename: 'error-%DATE%.log',
            level: 'error'
          })
      );
    }

    // Add external logging transport if enabled
    if (CONFIG.externalLogging.enabled) {
      transports.push(new ExternalLoggingTransport());
    }

    // Create the logger instance
    this.logger = winston.createLogger({
      level: isDevelopment ? 'debug' : 'warn',
      defaultMeta: { source: filename },
      transports
    });

    // Create error logger instance
    this.errorLogger = winston.createLogger({
      level: 'error',
      defaultMeta: { source: filename },
      transports: [
        new winston.transports.Console({
          format: formats.error
        }),
        ...((!isDevelopment) ? [
          new winston.transports.DailyRotateFile({
            ...fileTransportOptions,
            filename: 'error-details-%DATE%.log'
          })
        ] : [])
      ]
    });
  }

  // Helper method to get request ID from context
  getRequestId() {
    const store = requestContext.getStore();
    return store?.requestId;
  }

  // Helper method to add request ID to metadata
  addRequestId(metadata = {}) {
    const requestId = this.getRequestId();
    return requestId ? { ...metadata, requestId } : metadata;
  }

  debug(msg, ...args) {
    const formattedMsg = typeof msg === 'object' ?
        JSON.stringify(msg, null, 2) : msg;
    this.logger.debug(
        `${this._dashString}\nMESSAGE: ${formattedMsg}`,
        this.addRequestId(),
        ...args
    );
  }

  info(msg, metadata = {}) {
    this.logger.info(msg, this.addRequestId(metadata));
  }

  warn(msg, metadata = {}) {
    this.logger.warn(msg, this.addRequestId(metadata));
  }

  error(msg, metadata = {}) {
    this.logger.error(msg, this.addRequestId(metadata));
  }

  objectInfo(msg, obj) {
    if (!isDevelopment) return;

    const data = Object.entries(obj)
        .map(([key, value]) => {
          const stringValue = typeof value === 'object' ?
              JSON.stringify(value, null, 2) : value;
          return `${key} : ${stringValue}`;
        })
        .join("\n");

    this.logger.debug(`${msg} ->\n\n${data}`, this.addRequestId());
  }

  errLog(errorCode, methodName, description) {
    this.errorLogger.error(description, this.addRequestId({
      errorCode,
      methodName
    }));
    throw new Error(description);
  }
}

// Create a global logger instance
const globalLogger = new WinstonLogger('global');

// Safe console.log override for development
if (isDevelopment) {
  console.log = (...args) => {
    try {
      const stack = new Error().stack;
      const callerFile = stack.split('\n')[2].match(/\((.*):\d+:\d+\)/)?.[1] || 'unknown';
      const logger = new WinstonLogger(callerFile);
      logger.debug(...args);
    } catch (error) {
      // Fallback to original console.log if something goes wrong
      console.error('Logging error: ', error);
    }
  };
}

// Middleware for Express to add request ID tracking
export const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] ||
      req.headers['x-correlation-id'] ||
      `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  requestContext.run(new Map().set('requestId', requestId), () => {
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    next();
  });
};

// Export factory function for specific file loggers
export const createLogger = (filename) => new WinstonLogger(filename);

// Export convenience methods using the global logger
export const debug = (...args) => globalLogger.debug(...args);
export const info = (...args) => globalLogger.info(...args);
export const warn = (...args) => globalLogger.warn(...args);
export const error = (...args) => globalLogger.error(...args);

// Export the global logger instance
export const logger = globalLogger;

// Default export for backward compatibility
export default createLogger;