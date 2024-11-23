interface CachedResult {
  results: any[];
  timestamp: number;
}

const cache = new Map<string, CachedResult>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function getCachedResults(key: string): any[] | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cached.results;
}

export function cacheResults(key: string, results: any[]): void {
  cache.set(key, {
    results,
    timestamp: Date.now(),
  });
}

export function generateCacheKey(query: string, options: Record<string, any> = {}): string {
  return `${query}:${JSON.stringify(options)}`;
}

export function clearCache(): void {
  cache.clear();
}
