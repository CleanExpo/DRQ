// Common Types
export type Locale = 'en-AU';

// Component Props Types
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// Service Types
export interface ServiceArea {
  id: number;
  name: string;
  postcode: string;
  suburb?: string;
  state?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  slug: string;
  features?: string[];
  benefits?: string[];
  process?: ProcessStep[];
  faqs?: FAQ[];
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode: number;
  message?: string;
}

// Cache Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
}

// Style Types
export interface StyleConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      base: string;
      heading: string;
      subheading: string;
    };
    lineHeight: {
      normal: string;
      relaxed: string;
      loose: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// SEO Types
export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    type?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
  };
}

// Contact Types
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  message: string;
  serviceType?: string;
  location?: string;
  emergency?: boolean;
}

// Error Types
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

// Navigation Types
export interface NavItem {
  href: string;
  label: string;
  icon?: string;
  children?: NavItem[];
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  options?: Array<{
    value: string;
    label: string;
  }>;
  validation?: {
    pattern?: string;
    message?: string;
    minLength?: number;
    maxLength?: number;
  };
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  accent: string;
}

// Analytics Types
export interface PageView {
  path: string;
  timestamp: number;
  referrer?: string;
  userAgent?: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
