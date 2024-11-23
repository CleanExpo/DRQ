import '@testing-library/jest-dom';
import { render as rtlRender, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

declare global {
  // Extend Window interface
  interface Window {
    matchMedia: jest.Mock;
    IntersectionObserver: jest.Mock;
    ResizeObserver: jest.Mock;
  }
}

// Mock window APIs
const mockMatchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

const mockIntersectionObserver = jest.fn().mockImplementation(function(this: any) {
  this.observe = jest.fn();
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
  this.takeRecords = jest.fn().mockReturnValue([]);
  return this;
});

const mockResizeObserver = jest.fn().mockImplementation(function(this: any) {
  this.observe = jest.fn();
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
  return this;
});

// Setup global mocks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
});

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: mockResizeObserver,
});

// Custom render function
interface RenderOptions extends Omit<Parameters<typeof rtlRender>[1], 'wrapper'> {
  wrapper?: React.ComponentType;
}

function render(ui: ReactElement, options: RenderOptions = {}) {
  return {
    ...rtlRender(ui, { ...options }),
    user: userEvent.setup()
  };
}

// Export testing utilities
export {
  render,
  screen,
  within,
  fireEvent,
  userEvent
};
