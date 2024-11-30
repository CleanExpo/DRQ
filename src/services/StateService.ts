import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

type StateValue = any;
type StateListener = (value: StateValue, key: string) => void;
type StateSelector<T> = (state: StateValue) => T;

interface StateEntry {
  key: string;
  value: StateValue;
  timestamp: number;
  metadata?: {
    persistent?: boolean;
    scope?: string;
    version?: string;
    dependencies?: string[];
  };
}

interface StateMetrics {
  totalStates: number;
  statesByScope: Record<string, number>;
  updateFrequency: Record<string, number>;
  persistentStates: number;
  lastUpdate: number;
}

class StateService {
  private static instance: StateService;
  private states: Map<string, StateEntry> = new Map();
  private listeners: Map<string, Set<StateListener>> = new Map();
  private metrics: StateMetrics;
  private version = '1.0.0';

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.loadPersistedStates();
  }

  public static getInstance(): StateService {
    if (!StateService.instance) {
      StateService.instance = new StateService();
    }
    return StateService.instance;
  }

  private initializeMetrics(): StateMetrics {
    return {
      totalStates: 0,
      statesByScope: {},
      updateFrequency: {},
      persistentStates: 0,
      lastUpdate: Date.now()
    };
  }

  private async loadPersistedStates(): Promise<void> {
    try {
      const persistedStates = await cacheService.get<Record<string, StateEntry>>('persisted_states');
      if (persistedStates) {
        Object.entries(persistedStates).forEach(([key, entry]) => {
          if (entry.metadata?.version === this.version) {
            this.states.set(key, entry);
          }
        });
      }
      this.updateMetrics();
    } catch (error) {
      logger.error('Failed to load persisted states', { error });
    }
  }

  private async persistStates(): Promise<void> {
    try {
      const persistedStates: Record<string, StateEntry> = {};
      for (const [key, entry] of this.states) {
        if (entry.metadata?.persistent) {
          persistedStates[key] = entry;
        }
      }
      await cacheService.set('persisted_states', persistedStates, {
        type: 'state',
        metadata: { version: this.version }
      });
    } catch (error) {
      logger.error('Failed to persist states', { error });
    }
  }

  public setState(
    key: string,
    value: StateValue,
    metadata?: StateEntry['metadata']
  ): void {
    try {
      const entry: StateEntry = {
        key,
        value,
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          version: this.version
        }
      };

      this.states.set(key, entry);
      this.notifyListeners(key, value);
      this.updateMetrics();

      if (metadata?.persistent) {
        this.persistStates();
      }

      logger.debug('State updated', { key, metadata });
    } catch (error) {
      logger.error('Failed to set state', { key, error });
      throw error;
    }
  }

  public getState<T = StateValue>(key: string): T | null {
    try {
      const entry = this.states.get(key);
      return entry ? entry.value as T : null;
    } catch (error) {
      logger.error('Failed to get state', { key, error });
      return null;
    }
  }

  public select<T>(key: string, selector: StateSelector<T>): T | null {
    try {
      const state = this.getState(key);
      return state ? selector(state) : null;
    } catch (error) {
      logger.error('Failed to select state', { key, error });
      return null;
    }
  }

  public subscribe(key: string, listener: StateListener): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(listener);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  private notifyListeners(key: string, value: StateValue): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(listener => {
        try {
          listener(value, key);
        } catch (error) {
          logger.error('State listener error', { key, error });
        }
      });
    }
  }

  public deleteState(key: string): void {
    try {
      const entry = this.states.get(key);
      if (entry) {
        this.states.delete(key);
        this.notifyListeners(key, undefined);
        this.updateMetrics();

        if (entry.metadata?.persistent) {
          this.persistStates();
        }

        logger.debug('State deleted', { key });
      }
    } catch (error) {
      logger.error('Failed to delete state', { key, error });
      throw error;
    }
  }

  public clearScope(scope: string): void {
    try {
      for (const [key, entry] of this.states) {
        if (entry.metadata?.scope === scope) {
          this.deleteState(key);
        }
      }
      logger.debug('Scope cleared', { scope });
    } catch (error) {
      logger.error('Failed to clear scope', { scope, error });
      throw error;
    }
  }

  public clearAll(): void {
    try {
      this.states.clear();
      this.listeners.clear();
      this.updateMetrics();
      this.persistStates();
      logger.debug('All states cleared');
    } catch (error) {
      logger.error('Failed to clear all states', { error });
      throw error;
    }
  }

  private updateMetrics(): void {
    const statesByScope: Record<string, number> = {};
    const updateFrequency: Record<string, number> = {};
    let persistentStates = 0;

    for (const entry of this.states.values()) {
      const scope = entry.metadata?.scope || 'global';
      statesByScope[scope] = (statesByScope[scope] || 0) + 1;

      if (entry.metadata?.persistent) {
        persistentStates++;
      }

      // Track update frequency in the last hour
      const hourAgo = Date.now() - 3600000;
      if (entry.timestamp > hourAgo) {
        updateFrequency[entry.key] = (updateFrequency[entry.key] || 0) + 1;
      }
    }

    this.metrics = {
      totalStates: this.states.size,
      statesByScope,
      updateFrequency,
      persistentStates,
      lastUpdate: Date.now()
    };
  }

  public getMetrics(): StateMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      states: Array.from(this.states.entries()).map(([key, entry]) => ({
        key,
        scope: entry.metadata?.scope || 'global',
        persistent: entry.metadata?.persistent || false,
        hasListeners: this.listeners.has(key),
        lastUpdated: new Date(entry.timestamp).toISOString()
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }

  // Dependency management
  public getDependencies(key: string): string[] {
    const entry = this.states.get(key);
    return entry?.metadata?.dependencies || [];
  }

  public addDependency(key: string, dependency: string): void {
    const entry = this.states.get(key);
    if (entry) {
      entry.metadata = entry.metadata || {};
      entry.metadata.dependencies = entry.metadata.dependencies || [];
      if (!entry.metadata.dependencies.includes(dependency)) {
        entry.metadata.dependencies.push(dependency);
        this.states.set(key, entry);
      }
    }
  }

  public removeDependency(key: string, dependency: string): void {
    const entry = this.states.get(key);
    if (entry?.metadata?.dependencies) {
      entry.metadata.dependencies = entry.metadata.dependencies.filter(
        dep => dep !== dependency
      );
      this.states.set(key, entry);
    }
  }

  // Batch operations
  public batchUpdate(updates: Array<{ key: string; value: StateValue; metadata?: StateEntry['metadata'] }>): void {
    try {
      updates.forEach(({ key, value, metadata }) => {
        this.setState(key, value, metadata);
      });
    } catch (error) {
      logger.error('Failed to perform batch update', { error });
      throw error;
    }
  }

  // State validation
  public validateState(key: string, validator: (value: StateValue) => boolean): boolean {
    const value = this.getState(key);
    try {
      return validator(value);
    } catch (error) {
      logger.error('State validation failed', { key, error });
      return false;
    }
  }
}

export const stateService = StateService.getInstance();
export default StateService;
