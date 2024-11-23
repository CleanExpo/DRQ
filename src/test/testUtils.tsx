import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() { return true; },
    };
  };
}

// Mock IntersectionObserver
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  } as any;
}

// Mock ResizeObserver
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  } as any;
}

// Export testing utilities
export {
  render,
  screen,
  within,
  fireEvent,
  userEvent
};

// Export type utilities
export type { RenderOptions };
