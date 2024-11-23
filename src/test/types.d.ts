import '@testing-library/jest-dom';
import { ReactElement } from 'react';
import { RenderOptions, RenderResult } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

declare global {
  // Extend Jest matchers
  namespace jest {
    interface Mock<T = any, Y extends any[] = any> {
      (...args: Y): T;
      mockImplementation(fn: (...args: Y) => T): this;
      mockReturnValue(value: T): this;
      mockReturnValueOnce(value: T): this;
      mockReset(): void;
      mockClear(): void;
    }

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
    IntersectionObserver: jest.Mock;
    ResizeObserver: jest.Mock;
  }

  // Declare test utilities
  interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    wrapper?: React.ComponentType;
  }

  interface CustomRenderResult extends RenderResult {
    user: UserEvent;
  }

  type CustomRender = (
    ui: ReactElement,
    options?: CustomRenderOptions
  ) => CustomRenderResult;
}

// Export types
export type { CustomRenderOptions, CustomRenderResult, CustomRender };
