/// <reference types="@testing-library/jest-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

interface MediaQueryList {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: () => void;
  removeListener: () => void;
  addEventListener: () => void;
  removeEventListener: () => void;
  dispatchEvent: () => boolean;
}

interface Window {
  matchMedia(query: string): MediaQueryList;
}

declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveStyle(style: Record<string, any>): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveTextContent(text: string | RegExp): R;
  }
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}
