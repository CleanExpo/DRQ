import { cache } from './cache';

interface StyleCacheItem {
  styles: string;
  hash: string;
  timestamp: number;
}

export class StyleCache {
  private static CACHE_PREFIX = 'style:';
  private static TTL = 3600; // 1 hour in seconds

  static async get(key: string): Promise<StyleCacheItem | null> {
    const cacheKey = this.CACHE_PREFIX + key;
    return await cache.get(cacheKey);
  }

  static async set(key: string, styles: string, hash: string): Promise<void> {
    const cacheKey = this.CACHE_PREFIX + key;
    const cacheItem: StyleCacheItem = {
      styles,
      hash,
      timestamp: Date.now(),
    };
    await cache.set(cacheKey, cacheItem, this.TTL);
  }

  static async invalidate(key: string): Promise<void> {
    const cacheKey = this.CACHE_PREFIX + key;
    await cache.delete(cacheKey);
  }

  static async invalidateAll(): Promise<void> {
    await cache.clear();
  }

  static generateHash(styles: string): string {
    // Simple hash function for style content
    let hash = 0;
    for (let i = 0; i < styles.length; i++) {
      const char = styles.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  static isStale(cacheItem: StyleCacheItem): boolean {
    const now = Date.now();
    const age = now - cacheItem.timestamp;
    return age > this.TTL * 1000;
  }
}

// Initialize cache cleanup on server
if (typeof window === 'undefined') {
  // Cleanup stale cache entries every hour
  setInterval(async () => {
    try {
      await cache.cleanup();
    } catch (error) {
      console.error('Style cache cleanup failed:', error);
    }
  }, 3600000);
}
