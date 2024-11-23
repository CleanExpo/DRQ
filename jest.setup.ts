import './src/test/setup';
import './src/test/testUtils';

// Additional global test configuration
beforeAll(() => {
  // Reset mocks before all tests
  jest.resetModules();
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.clearAllTimers();
  jest.clearAllMocks();
});

afterAll(() => {
  // Clean up after all tests
  jest.resetModules();
});

// Global test environment configuration
global.ResizeObserver = require('./src/test/setup').MockResizeObserver;
global.IntersectionObserver = require('./src/test/setup').MockIntersectionObserver;

// Suppress specific console messages during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Warning: React.createElement'))
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('componentWillReceiveProps')
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};

// Add custom environment variables for testing
process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS = 'G-TEST123456';
process.env.NEXT_PUBLIC_ANALYTICS_ID = 'test-analytics-id';
