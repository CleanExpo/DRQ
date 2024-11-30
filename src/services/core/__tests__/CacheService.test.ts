import { CacheService } from '../CacheService';
import { ServiceStatus } from '../../types/IService';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(async () => {
    cacheService = CacheService.getInstance();
    await cacheService.initialize();
  });

  afterEach(async () => {
    await cacheService.clear();
    await cacheService.dispose();
  });

  describe('Initialization', () => {
    it('should be a singleton', () => {
      const instance1 = CacheService.getInstance();
      const instance2 = CacheService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should initialize with correct status', () => {
      expect(cacheService.getStatus()).toBe(ServiceStatus.READY);
      expect(cacheService.isInitialized()).toBe(true);
    });
  });

  describe('Basic Operations', () => {
    it('should set and get values', async () => {
      const key = 'test-key';
      const value = { name: 'test' };

      await cacheService.set(key, value);
      const retrieved = await cacheService.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent keys', async () => {
      const value = await cacheService.get('non-existent');
      expect(value).toBeNull();
    });

    it('should delete values', async () => {
      const key = 'test-key';
      const value = 'test-value';

      await cacheService.set(key, value);
      await cacheService.delete(key);
      const retrieved = await cacheService.get(key);

      expect(retrieved).toBeNull();
    });

    it('should clear all values', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');

      await cacheService.clear();

      const value1 = await cacheService.get('key1');
      const value2 = await cacheService.get('key2');

      expect(value1).toBeNull();
      expect(value2).toBeNull();
    });
  });

  describe('TTL Functionality', () => {
    it('should expire items after TTL', async () => {
      const key = 'ttl-test';
      const value = 'test-value';
      const ttl = 1; // 1 second

      await cacheService.set(key, value, { ttl });

      // Value should exist immediately
      let retrieved = await cacheService.get(key);
      expect(retrieved).toBe(value);

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Value should be expired
      retrieved = await cacheService.get(key);
      expect(retrieved).toBeNull();
    });
  });

  describe('Namespace Functionality', () => {
    it('should handle namespaced values', async () => {
      const key = 'test-key';
      const value1 = 'value-ns1';
      const value2 = 'value-ns2';

      await cacheService.set(key, value1, { namespace: 'ns1' });
      await cacheService.set(key, value2, { namespace: 'ns2' });

      const retrieved1 = await cacheService.get(key, 'ns1');
      const retrieved2 = await cacheService.get(key, 'ns2');

      expect(retrieved1).toBe(value1);
      expect(retrieved2).toBe(value2);
    });

    it('should clear namespace-specific values', async () => {
      await cacheService.set('key1', 'value1', { namespace: 'ns1' });
      await cacheService.set('key2', 'value2', { namespace: 'ns1' });
      await cacheService.set('key3', 'value3', { namespace: 'ns2' });

      await cacheService.clear('ns1');

      const value1 = await cacheService.get('key1', 'ns1');
      const value2 = await cacheService.get('key2', 'ns1');
      const value3 = await cacheService.get('key3', 'ns2');

      expect(value1).toBeNull();
      expect(value2).toBeNull();
      expect(value3).toBe('value3');
    });
  });

  describe('Stats', () => {
    it('should provide accurate stats', async () => {
      await cacheService.set('key1', 'value1', { namespace: 'ns1' });
      await cacheService.set('key2', 'value2', { namespace: 'ns1' });
      await cacheService.set('key3', 'value3', { namespace: 'ns2' });

      const stats = cacheService.getStats();

      expect(stats.size).toBe(3);
      expect(stats.namespaces).toEqual({
        ns1: 2,
        ns2: 1
      });
      expect(stats.status).toBe(ServiceStatus.READY);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors when not initialized', async () => {
      await cacheService.dispose();

      await expect(cacheService.set('key', 'value')).rejects.toThrow();
      await expect(cacheService.get('key')).rejects.toThrow();
    });
  });
});
