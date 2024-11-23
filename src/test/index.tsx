import React from 'react';
import { render as rtlRender, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Extend window interface
declare global {
  interface Window {
    matchMedia: (query: string) => {
      matches: boolean;
      media: string;
      onchange: null;
      addListener: jest.Mock;
      removeListener: jest.Mock;
      addEventListener: jest.Mock;
      removeEventListener: jest.Mock;
      dispatchEvent: jest.Mock;
    };
  }
}

// Types
type RenderOptions = Parameters<typeof rtlRender>[1];

// Custom render function
function render(ui: React.ReactElement, options: RenderOptions = {}) {
  return {
    ...rtlRender(ui, { ...options }),
    user: userEvent.setup()
  };
}

// Mock window.matchMedia
if (typeof window !== 'undefined') {
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
}

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

// Export everything
export {
  render,
  screen,
  within,
  fireEvent,
  userEvent
};

// Export types
export type { RenderOptions };
