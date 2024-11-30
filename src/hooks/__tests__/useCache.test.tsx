import { renderHook, act } from '@testing-library/react';
import { useCache } from '../useCache';
import { CacheService } from '@/services/core/CacheService';

// Mock CacheService
jest.mock('@/services/core/CacheService', () => {
  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    getInstance: jest.fn()
  };
  return {
    CacheService: {
      getInstance: () => mockCacheService
    }
  };
});

describe('useCache', () => {
  const mockCacheService = CacheService.getInstance();
  const testKey = 'test-key';
  const testData = { id: 1, name: 'Test Data' };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockCacheService.get as jest.Mock).mockResolvedValue(null);
    (mockCacheService.set as jest.Mock).mockResolvedValue(undefined);
    (mockCacheService.delete as jest.Mock).mockResolvedValue(undefined);
  });

  it('should initialize with null data and loading state', () => {
    const { result } = renderHook(() => useCache(testKey));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch data from cache on mount', async () => {
    (mockCacheService.get as jest.Mock).mockResolvedValue(testData);

    const { result } = renderHook(() => useCache(testKey));

    // Wait for the initial fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(testData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockCacheService.get).toHaveBeenCalledWith(testKey, undefined);
  });

  it('should set data in cache', async () => {
    const { result } = renderHook(() => useCache(testKey));

    await act(async () => {
      await result.current.setCache(testData);
    });

    expect(result.current.data).toEqual(testData);
    expect(mockCacheService.set).toHaveBeenCalledWith(testKey, testData, {
      namespace: undefined,
      ttl: undefined
    });
  });

  it('should clear data from cache', async () => {
    const { result } = renderHook(() => useCache(testKey));

    await act(async () => {
      await result.current.clearCache();
    });

    expect(result.current.data).toBeNull();
    expect(mockCacheService.delete).toHaveBeenCalledWith(testKey, undefined);
  });

  it('should refresh cache data', async () => {
    (mockCacheService.get as jest.Mock).mockResolvedValue(testData);

    const { result } = renderHook(() => useCache(testKey));

    await act(async () => {
      await result.current.refreshCache();
    });

    expect(result.current.data).toEqual(testData);
    expect(mockCacheService.get).toHaveBeenCalledWith(testKey, undefined);
  });

  it('should handle namespace option', async () => {
    const namespace = 'test-namespace';
    const { result } = renderHook(() => useCache(testKey, { namespace }));

    await act(async () => {
      await result.current.setCache(testData);
    });

    expect(mockCacheService.set).toHaveBeenCalledWith(testKey, testData, {
      namespace,
      ttl: undefined
    });
  });

  it('should handle ttl option', async () => {
    const ttl = 3600;
    const { result } = renderHook(() => useCache(testKey, { ttl }));

    await act(async () => {
      await result.current.setCache(testData);
    });

    expect(mockCacheService.set).toHaveBeenCalledWith(testKey, testData, {
      namespace: undefined,
      ttl
    });
  });

  it('should handle errors', async () => {
    const testError = new Error('Test error');
    (mockCacheService.get as jest.Mock).mockRejectedValue(testError);

    const onError = jest.fn();
    const { result } = renderHook(() => useCache(testKey, { onError }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toEqual(testError);
    expect(onError).toHaveBeenCalledWith(testError);
  });

  it('should update data when key changes', async () => {
    const newKey = 'new-key';
    const newData = { id: 2, name: 'New Data' };

    (mockCacheService.get as jest.Mock)
      .mockResolvedValueOnce(testData)
      .mockResolvedValueOnce(newData);

    const { result, rerender } = renderHook(
      ({ key }) => useCache(key),
      { initialProps: { key: testKey } }
    );

    // Wait for initial data
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(testData);

    // Change the key
    rerender({ key: newKey });

    // Wait for new data
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(newData);
    expect(mockCacheService.get).toHaveBeenCalledWith(newKey, undefined);
  });
});
