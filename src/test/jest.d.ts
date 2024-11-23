/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Mock<T = any, Y extends any[] = any> {
    (...args: Y): T;
    mockImplementation(fn: (...args: Y) => T): this;
    mockReturnValue(value: T): this;
    mockReturnValueOnce(value: T): this;
    mockReset(): void;
    mockClear(): void;
  }

  interface MockInstance<T, Y extends any[]> extends Mock<T, Y> {}

  function fn<T = any, Y extends any[] = any>(): Mock<T, Y>;
  function mock(moduleName: string, factory?: () => any): typeof jest;
  function spyOn<T extends {}, M extends keyof T>(
    object: T,
    method: M
  ): Mock<T[M]>;
}

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }

  const jest: typeof import('jest');
}
