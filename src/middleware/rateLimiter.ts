import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../utils/logger';

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100     // 100 requests per minute
};

const productionConfig: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 500     // Higher limit for production
};

const getClientIp = (request: NextRequest): string => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return 'unknown-ip';
};

export function createRateLimiter(config?: Partial<RateLimitConfig>) {
  const finalConfig: RateLimitConfig = {
    ...defaultConfig,
    ...(process.env.NODE_ENV === 'production' ? productionConfig : {}),
    ...config
  };

  return async function rateLimiter(request: NextRequest) {
    try {
      // Skip rate limiting for health checks
      if (request.nextUrl.pathname.startsWith('/api/health')) {
        return NextResponse.next();
      }

      const clientIp = getClientIp(request);
      const now = Date.now();
      const clientData = rateLimit.get(clientIp);

      // Clean up expired entries
      if (clientData && now > clientData.resetTime) {
        rateLimit.delete(clientIp);
      }

      // Initialize or get client's rate limit data
      const currentData = rateLimit.get(clientIp) || {
        count: 0,
        resetTime: now + finalConfig.windowMs
      };

      // Check if limit is exceeded
      if (currentData.count >= finalConfig.maxRequests) {
        logger.warn(`Rate limit exceeded for IP: ${clientIp}`);
        return NextResponse.json(
          {
            error: 'Too Many Requests',
            message: 'Rate limit exceeded',
            retryAfter: Math.ceil((currentData.resetTime - now) / 1000)
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((currentData.resetTime - now) / 1000).toString(),
              'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': Math.ceil(currentData.resetTime / 1000).toString()
            }
          }
        );
      }

      // Update rate limit data
      currentData.count++;
      rateLimit.set(clientIp, currentData);

      // Add rate limit headers to response
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', finalConfig.maxRequests.toString());
      response.headers.set(
        'X-RateLimit-Remaining',
        (finalConfig.maxRequests - currentData.count).toString()
      );
      response.headers.set(
        'X-RateLimit-Reset',
        Math.ceil(currentData.resetTime / 1000).toString()
      );

      return response;
    } catch (error) {
      logger.error('Rate limiter error:', error);
      return NextResponse.next();
    }
  };
}

// Clean up expired rate limit entries periodically
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimit.entries()) {
    if (now > data.resetTime) {
      rateLimit.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);
