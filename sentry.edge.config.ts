// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';

Sentry.init({
  dsn: SENTRY_DSN,

  // Set environment
  environment: process.env.NODE_ENV || 'development',
  
  // Adjust sampling rate for edge functions
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Configure allowed domains for tracing
  tracePropagationTargets: [
    'localhost',
    'disasterrecoveryqld.au',
    /^https:\/\/[^/]*\.disasterrecoveryqld\.au/,
  ],

  // Edge-specific settings
  enableTracing: true,
  
  // Set maxValueLength to avoid oversized payloads in edge functions
  maxValueLength: 1000,
});
