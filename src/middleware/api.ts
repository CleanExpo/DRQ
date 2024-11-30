import { ApiError } from '@/config/api';
import { logger, withTiming } from '@/utils/logger';
import { ApiResponse } from '@/types';

// Error handling middleware
export async function withErrorHandling<T>(
  promise: Promise<ApiResponse<T>>,
  errorContext: string
): Promise<ApiResponse<T>> {
  try {
    return await promise;
  } catch (error) {
    logger.error(`${errorContext} failed`, error as Error);

    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError('Network error', 503, 'NETWORK_ERROR');
    }

    // Handle timeout errors
    if (error instanceof Error && error.message === 'Request timeout') {
      throw new ApiError('Request timeout', 408, 'TIMEOUT_ERROR');
    }

    // Handle unknown errors
    throw new ApiError(
      'An unexpected error occurred',
      500,
      'INTERNAL_ERROR'
    );
  }
}

// Rate limiting middleware
const rateLimits = new Map<string, { count: number; timestamp: number }>();

export function withRateLimit(
  endpoint: string,
  limit: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimits.entries()) {
    if (value.timestamp < windowStart) {
      rateLimits.delete(key);
    }
  }

  // Check and update rate limit
  const current = rateLimits.get(endpoint) || { count: 0, timestamp: now };
  
  if (current.timestamp < windowStart) {
    current.count = 1;
    current.timestamp = now;
  } else {
    current.count++;
  }

  rateLimits.set(endpoint, current);

  if (current.count > limit) {
    logger.warn(`Rate limit exceeded for ${endpoint}`, {
      limit,
      windowMs,
      count: current.count
    });
    return false;
  }

  return true;
}

// Request validation middleware
export function validateRequest(
  data: any,
  requiredFields: string[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!data || data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Response sanitization middleware
export function sanitizeResponse<T>(
  response: ApiResponse<T>
): ApiResponse<T> {
  // Remove sensitive information
  const sanitized = { ...response };
  
  if (typeof sanitized.data === 'object' && sanitized.data !== null) {
    const data = { ...sanitized.data as object };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    for (const field of sensitiveFields) {
      delete (data as any)[field];
    }

    sanitized.data = data as T;
  }

  return sanitized;
}

// Combine all middleware
export async function withMiddleware<T>(
  promise: Promise<ApiResponse<T>>,
  options: {
    method: string;
    url: string;
    errorContext: string;
    requestBody?: any;
    requiredFields?: string[];
    rateLimit?: {
      limit: number;
      windowMs: number;
    };
  }
): Promise<ApiResponse<T>> {
  // Check rate limit
  if (options.rateLimit && !withRateLimit(options.url, options.rateLimit.limit, options.rateLimit.windowMs)) {
    throw new ApiError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
  }

  // Validate request if required fields are specified
  if (options.requiredFields && options.requestBody) {
    const { isValid, errors } = validateRequest(options.requestBody, options.requiredFields);
    if (!isValid) {
      throw new ApiError(
        'Validation failed: ' + errors.join(', '),
        400,
        'VALIDATION_ERROR'
      );
    }
  }

  // Apply timing, error handling, and sanitization
  return withErrorHandling(
    withTiming(
      promise,
      options.method,
      options.url,
      options.requestBody
    ),
    options.errorContext
  ).then(sanitizeResponse);
}
