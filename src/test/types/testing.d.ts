import '@testing-library/jest-dom';
import { ReactElement } from 'react';
import { RenderOptions as RTLRenderOptions, RenderResult } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

declare global {
  interface MediaQueryList {
    matches: boolean;
    media: string;
    onchange: null;
    addListener: jest.Mock;
    removeListener: jest.Mock;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    dispatchEvent: jest.Mock;
  }

  interface Window {
    matchMedia(query: string): MediaQueryList;
  }

  // Extend Jest matchers
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
}

export interface CustomRenderOptions extends Omit<RTLRenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType;
}

export interface CustomRenderResult extends RenderResult {
  user: UserEvent;
}

export type CustomRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => CustomRenderResult;
