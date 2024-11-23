/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../utils/analytics', () => ({
  trackEmergencyContact: jest.fn()
}));

// Mock translations to return actual text for error messages
jest.mock('../../utils/i18n', () => ({
  translate: (key: string) => {
    const translations: { [key: string]: string } = {
      'error.title': 'Something went wrong',
      'error.description': 'We\'re sorry, but something went wrong. Please try again or contact support if the problem persists.',
      'error.reload': 'Reload Page',
      'error.home': 'Return Home',
      'emergency.call': 'Call Emergency Line'
    };
    return translations[key] || key;
  }
}));

import { ErrorBoundary } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  const originalEnv = process.env.NODE_ENV;
  const ThrowError = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    jest.spyOn(require('../../utils/analytics'), 'trackEmergencyContact').mockClear();
    // Return a function that matches console.error signature
    jest.spyOn(console, 'error').mockImplementation(() => {
      return console.error;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv
    });
  });

  it('should render children when there is no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(container.textContent).toBe('Test content');
  });

  it('should render error UI when there is an error', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(container.textContent).toContain('Something went wrong');
    expect(require('../../utils/analytics').trackEmergencyContact).toHaveBeenCalledWith('form', 'error-boundary-triggered');
  });

  it('should display error details in development mode', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development'
    });

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(container.textContent).toContain('Test error');
  });

  it('should not display error details in production mode', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production'
    });

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(container.textContent).not.toContain('Test error');
  });
});
