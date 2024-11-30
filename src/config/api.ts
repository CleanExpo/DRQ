Can you make sureimport { ApiResponse } from '@/types';
import { withMiddleware } from '@/middleware/api';
import { logger } from '@/utils/logger';

// Environment-specific configurations
const ENV = {
  development: {
    baseUrl: 'http://localhost:3002',
    apiVersion: 'v1',
    timeout: 5000,
    rateLimit: {
      limit: 100,
      windowMs: 60000 // 1 minute
    }
  },
  production: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.disasterrecoveryqld.au',
    apiVersion: 'v1',
    timeout: 10000,
    rateLimit: {
      limit: 50,
      windowMs: 60000 // 1 minute
    }
  },
  test: {
    baseUrl: 'http://localhost:3002',
    apiVersion: 'v1',
    timeout: 1000,
    rateLimit: {
      limit: 1000,
      windowMs: 60000 // 1 minute
    }
  },
};

// Get current environment
const getEnvironment = () => {
  return (process.env.NODE_ENV || 'development') as keyof typeof ENV;
};

// Get environment config
const getConfig = () => {
  return ENV[getEnvironment()];
};

// API endpoints
export const ENDPOINTS = {
  serviceAreas: '/api/service-areas',
  contact: '/api/contact',
  emergency: '/api/emergency',
  sitemap: '/api/sitemap',
  cache: '/api/cache',
} as const;

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request options type
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: any;
  timeout?: number;
  requiredFields?: string[];
  errorContext?: string;
  skipRateLimit?: boolean;
}

// API client configuration
const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
};

// Main API client
export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const config = getConfig();
    const url = `${config.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    const errorContext = options.errorContext || `${method} ${endpoint}`;

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...(options.body && { body: JSON.stringify(options.body) }),
    };

    logger.debug('API Request', {
      url,
      method,
      headers: requestOptions.headers,
      body: options.body
    });

    const fetchPromise = fetch(url, requestOptions)
      .then(async response => {
        const data = await response.json();
        return {
          data: data.data,
          statusCode: response.status,
          message: data.message,
        } as ApiResponse<T>;
      });

    return withMiddleware(fetchPromise, {
      method,
      url,
      errorContext,
      requestBody: options.body,
      requiredFields: options.requiredFields,
      ...(!options.skipRateLimit && { rateLimit: config.rateLimit })
    });
  },

  // Convenience methods
  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  async post<T>(
    endpoint: string,
    data: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data,
      requiredFields: options.requiredFields
    });
  },

  async put<T>(
    endpoint: string,
    data: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
      requiredFields: options.requiredFields
    });
  },

  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  // Utility methods
  getEndpointUrl(endpoint: string): string {
    const config = getConfig();
    return `${config.baseUrl}${endpoint}`;
  },

  getHeaders(): HeadersInit {
    return {
      ...defaultHeaders,
    };
  }
};

// Export configuration
export const apiConfig = {
  getEnvironment,
  getConfig,
  ENDPOINTS,
};
