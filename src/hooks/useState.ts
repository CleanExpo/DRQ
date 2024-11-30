import { useState as useReactState, useEffect, useCallback, useMemo } from 'react';
import { stateService } from '@/services/StateService';
import { logger } from '@/utils/logger';

type StateValue = any;
type StateSelector<T> = (state: StateValue) => T;

interface StateMetrics {
  totalStates: number;
  statesByScope: Record<string, number>;
  updateFrequency: Record<string, number>;
  persistentStates: number;
  lastUpdate: number;
}

interface UseStateOptions {
  scope?: string;
  persistent?: boolean;
  dependencies?: string[];
  onUpdate?: (value: StateValue) => void;
  onError?: (error: Error) => void;
}

export function useState<T = StateValue>(
  key: string,
  initialValue?: T,
  options: UseStateOptions = {}
) {
  const {
    scope,
    persistent,
    dependencies,
    onUpdate,
    onError
  } = options;

  const [value, setValue] = useReactState<T | null>(() => {
    const existingValue = stateService.getState<T>(key);
    if (existingValue !== null) {
      return existingValue;
    }
    if (initialValue !== undefined) {
      try {
        stateService.setState(key, initialValue, {
          scope,
          persistent,
          dependencies
        });
        return initialValue;
      } catch (error) {
        logger.error('Failed to set initial state', { key, error });
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const unsubscribe = stateService.subscribe(key, (newValue) => {
      setValue(newValue);
      onUpdate?.(newValue);
    });

    return unsubscribe;
  }, [key, onUpdate]);

  const updateState = useCallback((newValue: T | ((prev: T | null) => T)) => {
    try {
      const resolvedValue = typeof newValue === 'function'
        ? (newValue as Function)(value)
        : newValue;

      stateService.setState(key, resolvedValue, {
        scope,
        persistent,
        dependencies
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to update state');
      onError?.(err);
      logger.error('Failed to update state', { key, error });
    }
  }, [key, value, scope, persistent, dependencies, onError]);

  const deleteState = useCallback(() => {
    try {
      stateService.deleteState(key);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to delete state');
      onError?.(err);
      logger.error('Failed to delete state', { key, error });
    }
  }, [key, onError]);

  const select = useCallback(<S>(selector: StateSelector<S>): S | null => {
    try {
      return stateService.select(key, selector);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to select state');
      onError?.(err);
      logger.error('Failed to select state', { key, error });
      return null;
    }
  }, [key, onError]);

  const validateState = useCallback((validator: (value: T) => boolean): boolean => {
    try {
      return stateService.validateState(key, validator);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to validate state');
      onError?.(err);
      logger.error('Failed to validate state', { key, error });
      return false;
    }
  }, [key, onError]);

  const getDependencies = useCallback((): string[] => {
    try {
      return stateService.getDependencies(key);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get dependencies');
      onError?.(err);
      logger.error('Failed to get dependencies', { key, error });
      return [];
    }
  }, [key, onError]);

  const addDependency = useCallback((dependency: string) => {
    try {
      stateService.addDependency(key, dependency);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to add dependency');
      onError?.(err);
      logger.error('Failed to add dependency', { key, dependency, error });
    }
  }, [key, onError]);

  const removeDependency = useCallback((dependency: string) => {
    try {
      stateService.removeDependency(key, dependency);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to remove dependency');
      onError?.(err);
      logger.error('Failed to remove dependency', { key, dependency, error });
    }
  }, [key, onError]);

  return {
    value,
    setValue: updateState,
    deleteState,
    select,
    validateState,
    getDependencies,
    addDependency,
    removeDependency
  };
}

export function useStateMetrics() {
  const [metrics, setMetrics] = useReactState<StateMetrics>(stateService.getMetrics());

  useEffect(() => {
    // Update metrics every second
    const interval = setInterval(() => {
      setMetrics(stateService.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUpdateFrequency = useCallback((frequency: number): string => {
    if (frequency < 1) return 'rarely';
    if (frequency < 5) return 'occasionally';
    if (frequency < 10) return 'frequently';
    return 'very frequently';
  }, []);

  const generateReport = useCallback(async () => {
    try {
      return await stateService.generateReport();
    } catch (error) {
      logger.error('Failed to generate state report', { error });
      throw error;
    }
  }, []);

  return {
    metrics,
    formatUpdateFrequency,
    generateReport
  };
}

// Example usage:
/*
function StateComponent() {
  const {
    value: count,
    setValue: setCount
  } = useState<number>('counter', 0, {
    scope: 'app',
    persistent: true,
    onUpdate: (value) => {
      console.log('Counter updated:', value);
    }
  });

  const {
    metrics,
    formatUpdateFrequency
  } = useStateMetrics();

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => setCount(prev => (prev || 0) + 1)}>
        Increment
      </button>
      <div>
        Update Frequency: {formatUpdateFrequency(metrics.updateFrequency['counter'] || 0)}
      </div>
    </div>
  );
}
*/
