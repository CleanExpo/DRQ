import '@testing-library/jest-dom';

// Declare global types
declare global {
  // Extend Jest matchers
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }

  // Extend Window interface
  interface Window {
    matchMedia: jest.Mock;
  }

  // Declare jest as a global variable
  const jest: typeof import('@jest/globals').jest;
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn();

  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
    this.takeRecords = jest.fn().mockReturnValue([]);
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();

  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver
});

// Export test utilities
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export * from '@testing-library/jest-dom';
