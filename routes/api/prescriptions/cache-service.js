// cache-service.js
const Redis = require('ioredis');

class CacheService {
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            // Adding retry strategy for Redis connection
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });
    }

    async getCachedTranslation(key, language) {
        const cacheKey = `translation:${language}:${key}`;
        return await this.redis.get(cacheKey);
    }

    async setCachedTranslation(key, language, translation) {
        const cacheKey = `translation:${language}:${key}`;
        // Cache translations for 24 hours
        await this.redis.set(cacheKey, translation, 'EX', 86400);
    }
}