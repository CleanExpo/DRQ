import React, { ReactElement, PropsWithChildren } from 'react';
import { render as rtlRender, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Types
interface RenderOptions {
  wrapper?: React.ComponentType;
  [key: string]: any;
}

// Custom render function
function render(ui: ReactElement, options: RenderOptions = {}) {
  const { wrapper: Wrapper = React.Fragment, ...remainingOptions } = options;

  const rendered = rtlRender(ui, {
    wrapper: ({ children }: PropsWithChildren<{}>) => (
      <Wrapper>{children}</Wrapper>
    ),
    ...remainingOptions,
  });

  return {
    ...rendered,
    user: userEvent.setup()
  };
}

// Mock component helper
function createMockComponent(name: string) {
  const Component = ({ children, ...props }: PropsWithChildren<any>) => (
    <div data-testid={`mock-${name}`} {...props}>
      {children}
    </div>
  );
  Component.displayName = name;
  return Component;
}

// Mock Next.js components
const NextImage = createMockComponent('NextImage');
const NextLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
  ({ children, href, ...props }, ref) => (
    <a href={href} ref={ref} {...props}>
      {children}
    </a>
  )
);
NextLink.displayName = 'Link';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | number | string[]): R;
    }
  }
}

// Export everything
export * from '@testing-library/react';
export {
  render as customRender,
  screen,
  within,
  fireEvent,
  userEvent,
  NextImage,
  NextLink,
  createMockComponent
};
