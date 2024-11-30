module.exports = {
  // Branch configurations
  branches: {
    main: {
      env: 'production',
      url: 'https://disasterrecoveryqld.au',
      autoMerge: ['hotfix/*'],
      buildCommand: 'npm run build',
      requiredChecks: ['tests', 'linting', 'build'],
    },
    develop: {
      env: 'development',
      url: 'https://dev.disasterrecoveryqld.au',
      autoMerge: ['feature/*'],
      buildCommand: 'npm run build:dev',
      requiredChecks: ['tests', 'linting'],
    },
    'feature/ui-enhancements': {
      env: 'development',
      url: 'https://ui.dev.disasterrecoveryqld.au',
      baseBranch: 'develop',
      buildCommand: 'npm run build:dev',
      requiredChecks: ['tests', 'linting'],
    },
    'feature/backend-data': {
      env: 'development',
      url: 'https://api.dev.disasterrecoveryqld.au',
      baseBranch: 'develop',
      buildCommand: 'npm run build:dev',
      requiredChecks: ['tests', 'linting'],
    },
    'hotfix/*': {
      env: 'production',
      baseBranch: 'main',
      buildCommand: 'npm run build',
      requiredChecks: ['tests', 'linting', 'build'],
      autoMerge: true,
    },
  },

  // Environment configurations
  environments: {
    production: {
      nodeEnv: 'production',
      envFile: '.env.production',
      buildOptimization: true,
      sourceMaps: false,
      caching: true,
    },
    development: {
      nodeEnv: 'development',
      envFile: '.env.development',
      buildOptimization: false,
      sourceMaps: true,
      caching: false,
    },
  },

  // Build configurations
  build: {
    outputDir: 'dist',
    assets: {
      images: {
        optimization: true,
        formats: ['webp', 'avif'],
      },
      styles: {
        minify: true,
        purge: true,
      },
    },
    cache: {
      enabled: true,
      directory: '.next/cache',
    },
  },

  // Deployment hooks
  hooks: {
    preBuild: [
      'npm install',
      'npm run lint',
      'npm run test',
    ],
    postBuild: [
      'npm run cleanup',
    ],
    preDeployment: [
      'npm run db:backup',
      'npm run cache:clear',
    ],
    postDeployment: [
      'npm run cache:warm',
      'npm run monitoring:notify',
    ],
  },

  // Monitoring and alerts
  monitoring: {
    enabled: true,
    endpoints: [
      {
        url: '/api/health',
        method: 'GET',
        expectedStatus: 200,
        interval: '5m',
      },
      {
        url: '/api/status',
        method: 'GET',
        expectedStatus: 200,
        interval: '15m',
      },
    ],
    alerts: {
      email: ['admin@disasterrecoveryqld.au'],
      slack: process.env.SLACK_WEBHOOK_URL,
    },
  },

  // Rollback configuration
  rollback: {
    enabled: true,
    maxAttempts: 3,
    triggers: {
      healthCheck: true,
      errorRate: 0.05,
      responseTime: 2000,
    },
  },

  // Performance thresholds
  performance: {
    pageLoadTime: 3000,
    firstContentfulPaint: 1500,
    largestContentfulPaint: 2500,
    timeToInteractive: 3500,
    cumulativeLayoutShift: 0.1,
  },
};
