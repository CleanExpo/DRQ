import { logger } from '../utils/logger';

interface CacheStore {
  [key: string]: {
    value: any;
    expiry: number | null;
  };
}

class CacheService {
  private static instance: CacheService;
  private store: CacheStore = {};
  private readonly defaultTTL = 3600; // 1 hour in seconds

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const expiry = ttl ? Date.now() + (ttl * 1000) : null;
      this.store[key] = { value, expiry };
      logger.debug(`Cache set: ${key}`);
    } catch (error) {
      logger.error('Cache set error:', error);
      throw error;
    }
  }

  public async get(key: string): Promise<any | null> {
    try {
      const item = this.store[key];
      if (!item) return null;

      if (item.expiry && Date.now() > item.expiry) {
        delete this.store[key];
        logger.debug(`Cache expired: ${key}`);
        return null;
      }

      logger.debug(`Cache hit: ${key}`);
      return item.value;
    } catch (error) {
      logger.error('Cache get error:', error);
      throw error;
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      delete this.store[key];
      logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      logger.error('Cache delete error:', error);
      throw error;
    }
  }

  public async clear(): Promise<void> {
    try {
      this.store = {};
      logger.debug('Cache cleared');
    } catch (error) {
      logger.error('Cache clear error:', error);
      throw error;
    }
  }

  public async has(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null;
    } catch (error) {
      logger.error('Cache has error:', error);
      throw error;
    }
  }

  // Cleanup expired items periodically
  private startCleanupInterval() {
    setInterval(() => {
      try {
        const now = Date.now();
        Object.keys(this.store).forEach(key => {
          const item = this.store[key];
          if (item.expiry && now > item.expiry) {
            delete this.store[key];
            logger.debug(`Cache cleanup: ${key}`);
          }
        });
      } catch (error) {
        logger.error('Cache cleanup error:', error);
      }
    }, 300000); // Run every 5 minutes
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();
