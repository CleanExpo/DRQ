import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }

  // Extend the window object
  interface Window {
    matchMedia: jest.Mock;
  }

  // Extend the jest namespace
  const jest: {
    fn: () => jest.Mock;
    mock: (moduleName: string, factory?: () => any) => void;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
  };

  // Testing Library types
  interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    wrapper?: React.ComponentType<any>;
  }

  interface CustomRenderResult extends RenderResult {
    user: UserEvent;
  }

  // Mock class types
  interface MockObserver {
    observe: jest.Mock;
    unobserve: jest.Mock;
    disconnect: jest.Mock;
  }
}

export type { CustomRenderOptions, CustomRenderResult };
