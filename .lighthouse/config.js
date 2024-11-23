module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/services/water-damage',
        'http://localhost:3000/services/fire-damage'
      ],
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],

        // PWA optimizations
        'service-worker': 'off',
        'installable-manifest': 'off',

        // SEO optimizations
        'meta-description': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'canonical': 'error',
        'hreflang': 'error',

        // Accessibility
        'color-contrast': 'error',
        'heading-order': 'error',
        'aria-allowed-attr': 'error',
        'html-lang-valid': 'error',

        // Best practices
        'no-document-write': 'error',
        'external-anchors-use-rel-noopener': 'error',
        'password-inputs-can-be-pasted-into': 'error',
        'image-aspect-ratio': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
