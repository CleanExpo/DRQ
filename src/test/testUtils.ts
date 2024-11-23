import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';

// Define custom matcher result type
interface MatcherResult {
  pass: boolean;
  message: () => string;
}

// Custom render function that includes providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Custom user event setup
const setupUserEvent = () => userEvent.setup();

// Test helper to wait for a condition
const waitForCondition = async (condition: () => boolean, timeout = 1000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('Condition not met within timeout');
};

// Mock data generator helpers
const generateMockServicePage = (overrides = {}) => ({
  slug: 'test-service',
  title: 'Test Service',
  metaDescription: 'Test service description',
  heroContent: {
    title: 'Test Hero Title',
    subtitle: 'Test Hero Subtitle',
    backgroundImage: '/test-image.jpg'
  },
  serviceDetails: {
    description: 'Test service details',
    features: ['Feature 1', 'Feature 2'],
    emergencyResponse: true
  },
  locations: [],
  ...overrides
});

const generateMockLocation = (overrides = {}) => ({
  name: 'Test Location',
  slug: 'test-location',
  coordinates: {
    lat: -27.4698,
    lng: 153.0251
  },
  serviceArea: ['Suburb 1', 'Suburb 2'],
  historicalEvents: [],
  ...overrides
});

// Custom matcher types
interface CustomMatchers<R = unknown> {
  toHaveBeenCalledOnce(): R;
  toBeValidServicePage(): R;
  toBeValidLocation(): R;
}

declare global {
  namespace jest {
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

type JestMockFunction = jest.Mock & {
  getMockName(): string;
  mock: {
    calls: any[][];
    instances: any[];
    contexts: any[];
    results: any[];
  };
};

// Custom matchers
const customMatchers = {
  toHaveBeenCalledOnce(received: JestMockFunction): MatcherResult {
    const pass = received.mock.calls.length === 1;
    return {
      pass,
      message: () =>
        pass
          ? 'Expected function not to have been called exactly once'
          : `Expected function to have been called exactly once but it was called ${received.mock.calls.length} times`,
    };
  },
  toBeValidServicePage(received: unknown): MatcherResult {
    const pass = Boolean(
      received &&
      typeof received === 'object' &&
      'slug' in received &&
      'title' in received &&
      'metaDescription' in received &&
      'heroContent' in received &&
      'serviceDetails' in received &&
      'locations' in received
    );

    return {
      pass,
      message: () =>
        pass
          ? 'Expected object not to be a valid ServicePage'
          : 'Expected object to be a valid ServicePage',
    };
  },
  toBeValidLocation(received: unknown): MatcherResult {
    const pass = Boolean(
      received &&
      typeof received === 'object' &&
      'name' in received &&
      'slug' in received &&
      'coordinates' in received &&
      'serviceArea' in received
    );

    return {
      pass,
      message: () =>
        pass
          ? 'Expected object not to be a valid Location'
          : 'Expected object to be a valid Location',
    };
  },
} as const;

// Add custom matchers to Jest
expect.extend(customMatchers);

export {
  customRender as render,
  setupUserEvent,
  waitForCondition,
  generateMockServicePage,
  generateMockLocation,
};
