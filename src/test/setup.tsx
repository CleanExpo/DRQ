/// <reference path="./jest.d.ts" />
import '@testing-library/jest-dom';
import * as ReactTestingLibrary from '@testing-library/react';
import * as UserEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';

declare global {
  interface Window {
    matchMedia: jest.Mock;
  }
}

// Setup window.matchMedia mock
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Setup IntersectionObserver mock
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation(function(this: any) {
  this.observe = jest.fn();
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
  this.takeRecords = jest.fn().mockReturnValue([]);
});
global.IntersectionObserver = mockIntersectionObserver as any;

// Setup ResizeObserver mock
const mockResizeObserver = jest.fn();
mockResizeObserver.mockImplementation(function(this: any) {
  this.observe = jest.fn();
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
});
global.ResizeObserver = mockResizeObserver as any;

// Custom render function
const customRender = (
  ui: ReactElement,
  options: Omit<ReactTestingLibrary.RenderOptions, 'wrapper'> = {}
) => {
  return {
    ...ReactTestingLibrary.render(ui, options),
    user: UserEvent.default.setup()
  };
};

// Re-export everything
export * from '@testing-library/react';

// Override render method and export custom utilities
export { customRender as render };
export const userEvent = UserEvent.default;
export const screen = ReactTestingLibrary.screen;
export const within = ReactTestingLibrary.within;
export const fireEvent = ReactTestingLibrary.fireEvent;

// Add custom jest matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined;
    return {
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
      pass,
    };
  },
});
