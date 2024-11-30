declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function initializeMonitoring() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Initialize dataLayer for GTM
  window.dataLayer = window.dataLayer || [];

  // Initialize other monitoring services as needed
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry initialization would go here
  }

  if (process.env.NEW_RELIC_LICENSE_KEY) {
    // New Relic initialization would go here
  }

  if (process.env.LOGROCKET_APP_ID) {
    // LogRocket initialization would go here
  }
}
