import { BaseService, RegisterService, ServiceStatus } from '../types/IService';
import { logger } from '@/utils/logger';

export interface ICacheOptions {
  ttl?: number;
  namespace?: string;
}

interface CacheItem<T> {
  value: T;
  expiry: number | null;
  namespace?: string;
}

@RegisterService({
  name: 'CacheService',
  dependencies: []
})
export class CacheService extends BaseService {
  private static instance: CacheService;
  private store: Map<string, CacheItem<any>>;
  private readonly defaultTTL = 3600; // 1 hour in seconds
  private cleanupInterval?: NodeJS.Timeout;

  private constructor() {
    super('CacheService');
    this.store = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  protected async onInitialize(): Promise<void> {
    try {
      logger.info('Initializing CacheService');
      this.startCleanupInterval();
    } catch (error) {
      logger.error('Failed to initialize CacheService:', error);
      throw error;
    }
  }

  protected async onDispose(): Promise<void> {
    try {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }
      this.store.clear();
      logger.info('CacheService disposed');
    } catch (error) {
      logger.error('Failed to dispose CacheService:', error);
      throw error;
    }
  }

  public async set<T>(key: string, value: T, options: ICacheOptions = {}): Promise<void> {
    try {
      if (!this.isInitialized()) {
        throw new Error('CacheService is not initialized');
      }

      const ttl = options.ttl ?? this.defaultTTL;
      const expiry = ttl > 0 ? Date.now() + (ttl * 1000) : null;
      
      const cacheItem: CacheItem<T> = {
        value,
        expiry,
        namespace: options.namespace
      };

      this.store.set(this.getNamespacedKey(key, options.namespace), cacheItem);
      logger.debug(`Cache set: ${key}${options.namespace ? ` (${options.namespace})` : ''}`);
    } catch (error) {
      logger.error('Cache set error:', error);
      throw error;
    }
  }

  public async get<T>(key: string, namespace?: string): Promise<T | null> {
    try {
      if (!this.isInitialized()) {
        throw new Error('CacheService is not initialized');
      }

      const namespacedKey = this.getNamespacedKey(key, namespace);
      const item = this.store.get(namespacedKey);

      if (!item) {
        return null;
      }

      if (item.expiry && Date.now() > item.expiry) {
        this.store.delete(namespacedKey);
        logger.debug(`Cache expired: ${key}${namespace ? ` (${namespace})` : ''}`);
        return null;
      }

      logger.debug(`Cache hit: ${key}${namespace ? ` (${namespace})` : ''}`);
      return item.value as T;
    } catch (error) {
      logger.error('Cache get error:', error);
      throw error;
    }
  }

  public async delete(key: string, namespace?: string): Promise<void> {
    try {
      if (!this.isInitialized()) {
        throw new Error('CacheService is not initialized');
      }

      const namespacedKey = this.getNamespacedKey(key, namespace);
      this.store.delete(namespacedKey);
      logger.debug(`Cache deleted: ${key}${namespace ? ` (${namespace})` : ''}`);
    } catch (error) {
      logger.error('Cache delete error:', error);
      throw error;
    }
  }

  public async clear(namespace?: string): Promise<void> {
    try {
      if (!this.isInitialized()) {
        throw new Error('CacheService is not initialized');
      }

      if (namespace) {
        // Clear only items in the specified namespace
        for (const [key, item] of this.store.entries()) {
          if (item.namespace === namespace) {
            this.store.delete(key);
          }
        }
        logger.debug(`Cache cleared for namespace: ${namespace}`);
      } else {
        // Clear all items
        this.store.clear();
        logger.debug('Cache cleared');
      }
    } catch (error) {
      logger.error('Cache clear error:', error);
      throw error;
    }
  }

  public async has(key: string, namespace?: string): Promise<boolean> {
    try {
      const value = await this.get(key, namespace);
      return value !== null;
    } catch (error) {
      logger.error('Cache has error:', error);
      throw error;
    }
  }

  private getNamespacedKey(key: string, namespace?: string): string {
    return namespace ? `${namespace}:${key}` : key;
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      try {
        const now = Date.now();
        let expiredCount = 0;

        for (const [key, item] of this.store.entries()) {
          if (item.expiry && now > item.expiry) {
            this.store.delete(key);
            expiredCount++;
          }
        }

        if (expiredCount > 0) {
          logger.debug(`Cache cleanup: removed ${expiredCount} expired items`);
        }
      } catch (error) {
        logger.error('Cache cleanup error:', error);
      }
    }, 300000); // Run every 5 minutes
  }

  public getStats(): {
    size: number;
    namespaces: { [key: string]: number };
    status: ServiceStatus;
  } {
    const stats = {
      size: this.store.size,
      namespaces: {} as { [key: string]: number },
      status: this.getStatus()
    };

    // Count items per namespace
    for (const item of this.store.values()) {
      if (item.namespace) {
        stats.namespaces[item.namespace] = (stats.namespaces[item.namespace] || 0) + 1;
      }
    }

    return stats;
  }
}
