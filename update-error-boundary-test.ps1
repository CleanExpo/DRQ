# update-error-boundary-test.ps1

$testFile = "src\components\__tests__\ErrorBoundary.test.tsx"

$newContent = @'
/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../utils/analytics', () => ({
  trackEmergencyContact: jest.fn()
}));

jest.mock('../../utils/i18n', () => ({
  translate: (key: string) => key
}));

import { ErrorBoundary } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  const originalEnv = process.env.NODE_ENV;
  const ThrowError = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    jest.spyOn(require('../../utils/analytics'), 'trackEmergencyContact').mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
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
    expect(require('../../utils/analytics').trackEmergencyContact).toHaveBeenCalled();
  });
});