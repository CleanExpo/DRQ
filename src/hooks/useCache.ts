import { useState, useEffect, useCallback } from 'react';
import { CacheService } from '@/services/core/CacheService';
import { logger } from '@/utils/logger';

interface UseCacheOptions {
  namespace?: string;
  ttl?: number;
  onError?: (error: Error) => void;
}

export function useCache<T>(key: string, options: UseCacheOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheService = CacheService.getInstance();

  const fetchFromCache = useCallback(async () => {
    try {
      setLoading(true);
      const cachedData = await cacheService.get<T>(key, options.namespace);
      setData(cachedData);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      logger.error(`Cache fetch error for key ${key}:`, error);
    } finally {
      setLoading(false);
    }
  }, [key, options.namespace]);

  const setCache = useCallback(async (value: T) => {
    try {
      await cacheService.set(key, value, {
        namespace: options.namespace,
        ttl: options.ttl
      });
      setData(value);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }, [key, options.namespace, options.ttl]);

  const clearCache = useCallback(async () => {
    try {
      await cacheService.delete(key, options.namespace);
      setData(null);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      logger.error(`Cache clear error for key ${key}:`, error);
    }
  }, [key, options.namespace]);

  const refreshCache = useCallback(async () => {
    await fetchFromCache();
  }, [fetchFromCache]);

  useEffect(() => {
    fetchFromCache();
  }, [fetchFromCache]);

  return {
    data,
    loading,
    error,
    setCache,
    clearCache,
    refreshCache
  };
}

// Example usage:
/*
function MyComponent() {
  const { 
    data: userData,
    loading,
    error,
    setCache: setUserData,
    clearCache: clearUserData,
    refreshCache: refreshUserData
  } = useCache<UserData>('user-profile', {
    namespace: 'users',
    ttl: 3600, // 1 hour
    onError: (error) => console.error('Cache error:', error)
  });

  // Use the cached data
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!userData) return <div>No data</div>;

  return (
    <div>
      <h1>{userData.name}</h1>
      <button onClick={() => setUserData({ ...userData, updated: true })}>
        Update Cache
      </button>
      <button onClick={clearUserData}>Clear Cache</button>
      <button onClick={refreshUserData}>Refresh Cache</button>
    </div>
  );
}
*/
