import winston from 'winston';
import 'winston-daily-rotate-file';
import chalk from 'chalk';
import moment from 'moment';
import os from 'os';
import path from 'path';
import { AsyncLocalStorage } from 'async_hooks';

// Trace context management
class TraceContext {
  static TRACE_HEADERS = [
    'x-request-id',
    'x-correlation-id',
    'x-b3-traceid',
    'x-b3-spanid',
    'x-b3-parentspanid',
    'traceparent',
    'tracestate',
    'uber-trace-id',
    'sw8',
    'baggage'
  ];

  constructor() {
    this.traceId = '';
    this.spanId = '';
    this.parentId = '';
    this.sampled = '1';
    this.baggage = new Map();
  }

  static fromHeaders(headers) {
    const context = new TraceContext();

    // Extract W3C Trace Context
    const traceParent = headers['traceparent'];
    if (traceParent) {
      const [version, traceId, spanId, flags] = traceParent.split('-');
      context.traceId = traceId;
      context.spanId = spanId;
      context.sampled = flags[0];
    }

    // Extract B3 headers (Zipkin format)
    context.traceId = headers['x-b3-traceid'] || context.traceId;
    context.spanId = headers['x-b3-spanid'] || context.spanId;
    context.parentId = headers['x-b3-parentspanid'] || '';

    // Extract baggage items
    const baggage = headers['baggage'];
    if (baggage) {
      baggage.split(',').forEach(item => {
        const [key, value] = item.trim().split('=');
        context.baggage.set(key, value);
      });
    }

    return context;
  }

  toHeaders() {
    const headers = {};

    // W3C Trace Context
    if (this.traceId && this.spanId) {
      headers['traceparent'] = `00-${this.traceId}-${this.spanId}-0${this.sampled}`;
    }

    // B3 Headers
    if (this.traceId) headers['x-b3-traceid'] = this.traceId;
    if (this.spanId) headers['x-b3-spanid'] = this.spanId;
    if (this.parentId) headers['x-b3-parentspanid'] = this.parentId;

    // Baggage
    if (this.baggage.size > 0) {
      headers['baggage'] = Array.from(this.baggage.entries())
          .map(([key, value]) => `${key}=${value}`)
          .join(',');
    }

    return headers;
  }

  generateNextSpan() {
    const nextContext = new TraceContext();
    nextContext.traceId = this.traceId;
    nextContext.parentId = this.spanId;
    nextContext.spanId = generateSpanId();
    nextContext.sampled = this.sampled;
    nextContext.baggage = new Map(this.baggage);
    return nextContext;
  }
}

// Helper functions for trace ID generation
function generateTraceId() {
  return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

function generateSpanId() {
  return Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// Enhanced Configuration with validation
const CONFIG = {
  environment: process.env.APP_ENV || process.env.NODE_ENV || 'production',
  applicationName: process.env.APP_NAME || 'AdhereLive',
  logDir: process.env.LOG_DIR || 'logs',
  maxLogSize: process.env.MAX_LOG_SIZE || '20m',
  maxLogFiles: process.env.MAX_LOG_FILES || '14d',
  logLevel: process.env.LOG_LEVEL || 'info',
  // Structured logging configuration
  structuredLogging: {
    enabled: process.env.STRUCTURED_LOGGING === 'true',
    format: process.env.STRUCTURED_FORMAT || 'json'
  },
  // Error tracking configuration
  errorTracking: {
    captureStackTrace: true,
    stackTraceLimit: 10,
    includeMetadata: true
  },
  // Rate limiting configuration
  rateLimiting: {
    enabled: true,
    maxLogs: 1000,
    windowMs: 60000, // 1 minute
  },
  // Sampling configuration for high-volume logs
  sampling: {
    enabled: process.env.LOG_SAMPLING_ENABLED === 'true',
    rate: parseFloat(process.env.LOG_SAMPLING_RATE || '0.1') // 10% by default
  },
  // Distributed tracing configuration
  tracing: {
    enabled: process.env.TRACING_ENABLED === 'true',
    serviceName: process.env.SERVICE_NAME || 'unknown-service',
    serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    // Sampling specific to traces
    samplingRate: parseFloat(process.env.TRACE_SAMPLING_RATE || '1.0'),
    // External trace collector configuration
    collector: {
      enabled: process.env.TRACE_COLLECTOR_ENABLED === 'true',
      endpoint: process.env.TRACE_COLLECTOR_ENDPOINT,
      headers: JSON.parse(process.env.TRACE_COLLECTOR_HEADERS || '{}')
    }
  }
};

// Enhanced request context
class LogContext {
  constructor() {
    this.storage = new AsyncLocalStorage();
    this.contextData = new Map();
  }

  set(key, value) {
    const store = this.storage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get(key) {
    const store = this.storage.getStore();
    return store ? store.get(key) : undefined;
  }

  getAll() {
    const store = this.storage.getStore();
    return store ? Object.fromEntries(store) : {};
  }

  run(context, callback) {
    return this.storage.run(new Map(Object.entries(context)), callback);
  }
}

const logContext = new LogContext();

// Enhanced error handling
class LoggingError extends Error {
  constructor(message, code, metadata = {}) {
    super(message);
    this.name = 'LoggingError';
    this.code = code;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
  }
}

// Rate limiting implementation
class RateLimiter {
  constructor(options) {
    this.windowMs = options.windowMs;
    this.maxLogs = options.maxLogs;
    this.logs = new Map();
  }

  shouldLog(source) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Clean old entries
    for (const [key, timestamp] of this.logs.entries()) {
      if (timestamp < windowStart) {
        this.logs.delete(key);
      }
    }

    const count = [...this.logs.values()].filter(timestamp => timestamp > windowStart).length;

    if (count >= this.maxLogs) {
      return false;
    }

    this.logs.set(`${source}-${now}`, now);
    return true;
  }
}

// Enhanced WinstonLogger class
class EnhancedWinstonLogger {
  constructor(filename) {
    this.source = filename;
    this.rateLimiter = new RateLimiter(CONFIG.rateLimiting);
    this._setupLogger();
    this._setupErrorHandling();
  }

  _setupLogger() {
    // Enhanced format with more context
    const enhancedFormat = winston.format.combine(
        winston.format.timestamp({
          format: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        }),
        winston.format.errors({ stack: true }),
        winston.format.metadata({
          fillWith: ['timestamp', 'level', 'message', 'source', ...Object.keys(logContext.getAll())]
        }),
        winston.format.printf(this._createLogFormatter())
    );

    const transports = this._createTransports();

    this.logger = winston.createLogger({
      level: CONFIG.logLevel,
      format: enhancedFormat,
      defaultMeta: { source: this.source },
      transports
    });
  }

  _createLogFormatter() {
    return (info) => {
      const {
        level,
        message,
        timestamp,
        source,
        metadata = {},
        stack
      } = info;

      const context = logContext.getAll();
      const contextStr = Object.entries(context)
          .map(([key, value]) => `[${key}=${value}]`)
          .join(' ');

      // Safely handle undefined level
      const levelStr = level ? level.toUpperCase() : 'UNKNOWN';

      const baseLog = `${timestamp} [${levelStr}] [${source}] ${contextStr}: ${message}`;

      if (stack) {
        return `${baseLog}\n${stack}`;
      }

      if (Object.keys(metadata).length > 0) {
        return `${baseLog}\n${JSON.stringify(metadata, null, 2)}`;
      }

      return baseLog;
    };
  }

  _createTransports() {
    const transports = [];

    // Console transport with enhanced formatting
    transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(this._createLogFormatter())
          )
        })
    );

    // File transport with rotation
    if (!this._isDevelopment()) {
      transports.push(
          new winston.transports.DailyRotateFile({
            dirname: CONFIG.logDir,
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: CONFIG.maxLogSize,
            maxFiles: CONFIG.maxLogFiles,
            format: winston.format.json()
          })
      );
    }

    return transports;
  }

  _setupErrorHandling() {
    process.on('uncaughtException', (error) => {
      this.error('Uncaught Exception', { error, stack: error.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      this.error('Unhandled Rejection', { reason, promise });
    });
  }

  _isDevelopment() {
    return CONFIG.environment === 'development';
  }

  _shouldSample() {
    if (!CONFIG.sampling.enabled) return true;
    return Math.random() < CONFIG.sampling.rate;
  }

  _enrichMetadata(metadata = {}) {
    return {
      ...metadata,
      hostname: os.hostname(),
      pid: process.pid,
      ...logContext.getAll()
    };
  }

  debug(message, metadata = {}) {
    if (!this._shouldSample()) return;
    if (!this.rateLimiter.shouldLog(this.source)) {
      this.warn('Rate limit exceeded for debug logs', { source: this.source });
      return;
    }

    const formattedMessage = message === undefined ? 'No message provided' :
        (typeof message === 'object' ? JSON.stringify(message, null, 2) : message);

    const enrichedMetadata = {
      ...this._enrichMetadata(metadata),
      source: this.source || 'Unknown Source',
      requestId: logContext.get('requestId')
    };

    this.logger.debug(formattedMessage, enrichedMetadata);
  }

  info(message, metadata = {}) {
    if (!this._shouldSample()) return;
    this.logger.info(message, this._enrichMetadata(metadata));
  }

  warn(message, metadata = {}) {
    this.logger.warn(message, this._enrichMetadata(metadata));
  }

  error(message, metadata = {}) {
    if (metadata.error instanceof Error) {
      metadata.stack = metadata.error.stack;
      metadata.errorMessage = metadata.error.message;
    }

    this.logger.error(message, this._enrichMetadata(metadata));
  }

  // New method for structured logging
  structured(level, message, data = {}) {
    if (!CONFIG.structuredLogging.enabled) return;

    const structuredLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context: logContext.getAll(),
      source: this.source,
      environment: CONFIG.environment
    };

    this.logger.log(level, JSON.stringify(structuredLog));
  }

  // New method for performance logging
  performance(label, durationMs, metadata = {}) {
    this.info(`Performance: ${label}`, {
      ...metadata,
      duration_ms: durationMs,
      type: 'performance'
    });
  }

  // New method for audit logging
  audit(action, details = {}) {
    this.info(`Audit: ${action}`, {
      ...details,
      type: 'audit',
      timestamp: new Date().toISOString(),
      user: logContext.get('userId')
    });
  }

  // Trace-specific logging method
  trace(message, span = {}, metadata = {}) {
    if (!CONFIG.tracing.enabled) return;

    const context = logContext.getAll();
    const traceData = {
      trace_id: context.traceId,
      span_id: context.spanId,
      parent_id: context.parentId,
      ...span,
      ...metadata
    };

    this.structured('trace', message, traceData);

    // Send to trace collector if configured
    if (CONFIG.tracing.collector.enabled) {
      this._sendToCollector(traceData).catch(err => {
        this.error('Failed to send trace to collector', { error: err });
      });
    }
  }

  async _sendToCollector(traceData) {
    if (!CONFIG.tracing.collector.endpoint) return;

    const payload = {
      ...traceData,
      service: CONFIG.tracing.serviceName,
      version: CONFIG.tracing.serviceVersion,
      environment: CONFIG.tracing.environment,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(CONFIG.tracing.collector.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...CONFIG.tracing.collector.headers
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw new LoggingError('Trace collector error', 'TRACE_COLLECTOR_ERROR', {
        error: error.message,
        endpoint: CONFIG.tracing.collector.endpoint
      });
    }
  }
}

// Middleware for request tracking
export const requestMiddleware = (req, res, next) => {
  const startTime = Date.now();

  try {
    // Extract or create trace context
    let traceContext = TraceContext.fromHeaders(req.headers);

    // If no existing trace context, create a new one
    if (!traceContext.traceId) {
      traceContext = new TraceContext();
      traceContext.traceId = generateTraceId();
      traceContext.spanId = generateSpanId();
    }

    // Create child span for this request
    const requestSpan = traceContext.generateNextSpan();

    const context = {
      traceId: requestSpan.traceId,
      spanId: requestSpan.spanId,
      parentId: requestSpan.parentId,
      requestId: req.headers['x-request-id'] || requestSpan.spanId,
      method: req.method,
      path: req.path,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
      baggage: Object.fromEntries(requestSpan.baggage)
    };

    // Set response headers for distributed tracing
    const traceHeaders = requestSpan.toHeaders();
    Object.entries(traceHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Also set traditional correlation headers for backward compatibility
    res.setHeader('X-Request-ID', context.requestId);
    res.setHeader('X-Correlation-ID', context.requestId);
    logContext.run(context, () => {
      // Start span timing
      const spanStartTime = process.hrtime();

      // Capture response timing and details
      res.on('finish', () => {
        try {
          const [seconds, nanoseconds] = process.hrtime(spanStartTime);
          const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

          const logger = new EnhancedWinstonLogger('request-logger');
          logger.info('Request completed', {
            statusCode: res.statusCode,
            duration,
            ...context
          });
        } catch (error) {
          console.error('Error in request finish handler:', error);
        }
      });

      next();
    });
  } catch (error) {
    console.error('Error in request middleware:', error);
    next(error);
  }
};

// Export factory function
export const createLogger = (filename) => new EnhancedWinstonLogger(filename);

// Export context utilities
export const setLogContext = (key, value) => logContext.set(key, value);
export const getLogContext = (key) => logContext.get(key);
export const getTraceContext = () => {
  const context = logContext.getAll();
  return {
    traceId: context.traceId,
    spanId: context.spanId,
    parentId: context.parentId,
    baggage: context.baggage
  };
};

// Create a global logger instance
const globalLogger = new EnhancedWinstonLogger('global');

// Export convenience methods using the global logger
export const debug = (...args) => globalLogger.debug(...args);
export const info = (...args) => globalLogger.info(...args);
export const warn = (...args) => globalLogger.warn(...args);
export const error = (...args) => globalLogger.error(...args);
export const performance = (...args) => globalLogger.performance(...args);
export const audit = (...args) => globalLogger.audit(...args);
export const structured = (...args) => globalLogger.structured(...args);
export const trace = (...args) => globalLogger.trace(...args);

// Export the global logger instance
export const logger = globalLogger;

// Default export
export default createLogger;