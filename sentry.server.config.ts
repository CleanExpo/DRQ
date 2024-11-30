// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';

Sentry.init({
  dsn: SENTRY_DSN,

  // Set environment
  environment: process.env.NODE_ENV || 'development',
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Configure allowed domains for tracing
  tracePropagationTargets: [
    'localhost',
    'disasterrecoveryqld.au',
    /^https:\/\/[^/]*\.disasterrecoveryqld\.au/,
  ],

  // Set maxValueLength to avoid oversized payloads
  maxValueLength: 1000,

  // Enable request data capture
  includeLocalVariables: true,

  // Attach server name
  serverName: process.env.NEXT_PUBLIC_SITE_URL || 'disasterrecoveryqld.au',
});
