/// <reference types="@testing-library/jest-dom" />

import { ReactElement } from 'react';
import * as React from 'react';
import * as RTL from '@testing-library/react';
import * as JestDom from '@testing-library/jest-dom';
import * as UserEvent from '@testing-library/user-event';

// Re-export everything
export * from '@testing-library/react';
export * from '@testing-library/jest-dom';
export { default as userEvent } from '@testing-library/user-event';

// Types
export interface RenderOptions extends Omit<RTL.RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType;
}

// Custom render function
function render(
  ui: ReactElement,
  { wrapper: Wrapper = React.Fragment, ...options }: RenderOptions = {}
) {
  return {
    ...RTL.render(ui, {
      wrapper: ({ children }) => <Wrapper>{children}</Wrapper>,
      ...options,
    }),
    user: UserEvent.default.setup()
  };
}

// Mock component helper
function createMockComponent(name: string) {
  const Component = ({ children, ...props }: any) => (
    <div data-testid={`mock-${name}`} {...props}>
      {children}
    </div>
  );
  Component.displayName = name;
  return Component;
}

// Mock Next.js components
jest.mock('next/image', () => createMockComponent('NextImage'));
jest.mock('next/link', () => {
  return React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
    ({ children, href, ...props }, ref) => (
      <a href={href} ref={ref} {...props}>
        {children}
      </a>
    )
  );
});

// Export custom utilities
export {
  render,
  createMockComponent
};
