type CacheOptions = {
  type: string;
  ttl: number;
  useMemoryCache?: boolean;
};

const memoryCache = new Map<string, { data: any; expires: number }>();

export function generateCacheKey(parts: (string | number)[]): string {
  return parts.join(':');
}

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  // Check memory cache first if enabled
  if (options.useMemoryCache) {
    const cached = memoryCache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data as T;
    }
    memoryCache.delete(key);
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in memory cache if enabled
  if (options.useMemoryCache) {
    memoryCache.set(key, {
      data,
      expires: Date.now() + options.ttl
    });
  }

  return data;
}
