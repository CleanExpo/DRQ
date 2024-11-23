import '@testing-library/jest-dom';
import { RenderResult } from '@testing-library/react';
import type { Metric } from 'web-vitals';

declare global {
  const describe: (name: string, fn: () => void) => void;
  const it: (name: string, fn: () => void | Promise<void>) => void;
  const test: (name: string, fn: () => void | Promise<void>) => void;
  const expect: jest.Expect;
  const beforeEach: (fn: () => void) => void;
  const afterEach: (fn: () => void) => void;
  const jest: jest.Jest;

  namespace jest {
    interface Jest {
      fn: () => jest.Mock;
      mock: (moduleName: string, factory?: () => any) => void;
      clearAllMocks: () => void;
      useFakeTimers: () => void;
      useRealTimers: () => void;
      advanceTimersByTime: (msToRun: number) => void;
      spyOn: (object: any, method: string) => jest.SpyInstance;
      restoreAllMocks: () => void;
    }

    interface Expect {
      <T = any>(actual: T): jest.Matchers<T>;
      objectContaining(expected: any): any;
    }

    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalled(): R;
      toHaveLength(length: number): R;
      toBe(expected: any): R;
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeLessThan(expected: number): R;
      not: jest.Matchers<R>;
    }

    interface Mock<T = any, Y extends any[] = any> {
      (...args: Y): T;
      mockClear(): void;
      mockReset(): void;
      mockImplementation(fn: (...args: Y) => T): Mock<T, Y>;
      mockReturnValue(value: T): Mock<T, Y>;
      mockReturnValueOnce(value: T): Mock<T, Y>;
    }

    interface SpyInstance<T = any> extends Mock<T> {
      mockRestore(): void;
    }
  }

  // React Testing Library Types
  interface RenderOptions {
    container?: HTMLElement;
    baseElement?: HTMLElement;
    hydrate?: boolean;
    wrapper?: React.ComponentType<any>;
  }

  interface RenderResult {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: (baseElement?: HTMLElement | DocumentFragment) => void;
    rerender: (ui: React.ReactElement) => void;
    unmount: () => void;
    asFragment: () => DocumentFragment;
  }

  // Extend NodeJS.Process
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }

  // Web Vitals Types
  interface BaseMetric {
    delta: number;
    id: string;
    entries: PerformanceEntry[];
    navigationType?: string;
    rating?: 'good' | 'needs-improvement' | 'poor';
  }

  interface CLSMetric extends BaseMetric {
    name: 'CLS';
    value: number;
  }

  interface FCPMetric extends BaseMetric {
    name: 'FCP';
    value: number;
  }

  interface FIDMetric extends BaseMetric {
    name: 'FID';
    value: number;
  }

  interface LCPMetric extends BaseMetric {
    name: 'LCP';
    value: number;
  }

  interface TTFBMetric extends BaseMetric {
    name: 'TTFB';
    value: number;
  }

  type WebVitalsMetric = CLSMetric | FCPMetric | FIDMetric | LCPMetric | TTFBMetric;
}
