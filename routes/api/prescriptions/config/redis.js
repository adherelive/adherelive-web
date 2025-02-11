import { createLogger } from "../../../../libs/logger";

const Redis = require('ioredis');

const logger = createLogger("PRESCRIPTION API");

class RedisClient {
    constructor() {
        this.client = null;
        this.retryCount = 0;
        this.maxRetries = 5;
        this.retryDelay = 1000; // Start with 1 second delay
    }

    async connect() {
        try {
            if (this.client) {
                return this.client;
            }

            this.client = new Redis(process.env.REDIS_URL, {
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    // Exponential backoff with maximum delay of 30 seconds
                    const delay = Math.min(times * 1000, 30000);
                    logger.info(`Retrying Redis connection in ${delay}ms...`);
                    return delay;
                },
                reconnectOnError: (err) => {
                    logger.error('Redis connection error:', err);
                    return true; // Always try to reconnect
                }
            });

            // Handle connection events
            this.client.on('connect', () => {
                logger.info('Successfully connected to Redis');
                this.retryCount = 0; // Reset retry count on successful connection
            });

            this.client.on('error', (error) => {
                logger.error('Redis error:', error);
                this.handleConnectionError(error);
            });

            return this.client;
        } catch (error) {
            logger.error('Error creating Redis client:', error);
            throw error;
        }
    }

    async handleConnectionError(error) {
        if (this.retryCount >= this.maxRetries) {
            logger.error('Max Redis connection retries reached. Using fallback mechanism...');
            this.initializeFallbackCache();
            return;
        }

        this.retryCount++;
        const delay = Math.min(Math.pow(2, this.retryCount) * this.retryDelay, 30000);

        logger.info(`Attempting Redis reconnection ${this.retryCount}/${this.maxRetries} in ${delay}ms...`);

        setTimeout(async () => {
            try {
                await this.connect();
            } catch (error) {
                logger.error('Redis reconnection attempt failed:', error);
            }
        }, delay);
    }

    initializeFallbackCache() {
        // Implement in-memory cache as fallback
        const NodeCache = require('node-cache');
        this.fallbackCache = new NodeCache({ stdTTL: 3600 });
        logger.info('Initialized fallback in-memory cache');
    }

    async get(key) {
        try {
            if (this.fallbackCache) {
                return this.fallbackCache.get(key);
            }
            return await this.client.get(key);
        } catch (error) {
            logger.error('Error getting from Redis:', error);
            return null;
        }
    }

    async set(key, value, ttl = 3600) {
        try {
            if (this.fallbackCache) {
                return this.fallbackCache.set(key, value, ttl);
            }
            return await this.client.set(key, value, 'EX', ttl);
        } catch (error) {
            logger.error('Error setting in Redis:', error);
            return false;
        }
    }
}

module.exports = new RedisClient();
