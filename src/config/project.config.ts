export const projectConfig = {
  framework: 'Next.js 14',
  styling: 'Tailwind CSS',
  deployment: 'Vercel',
  cdn: 'Cloudflare',
  imageOptimization: 'next/image',
  seoFramework: 'next-seo',
  stateManagement: 'zustand',
  testing: 'Jest + React Testing Library'
} as const;

export const performanceTargets = {
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 95
  },
  webVitals: {
    lcp: 2500, // Largest Contentful Paint in ms
    fid: 100,  // First Input Delay in ms
    cls: 0.1   // Cumulative Layout Shift score
  }
} as const;

export const emergencyContact = {
  phone: '1300 309 361',
  hours: {
    start: '00:00',
    end: '23:59'
  },
  available: true,
  responseTime: 'immediate',
  serviceArea: 'Queensland'
} as const;

export const siteMetadata = {
  title: 'Disaster Recovery QLD',
  titleTemplate: '%s | Disaster Recovery QLD',
  baseUrl: 'https://disasterrecoveryqld.au',
  description: 'Professional disaster recovery services across Queensland. Available 24/7 for emergency response.',
  company: {
    name: 'Disaster Recovery QLD',
    legalName: 'Disaster Recovery Queensland Pty Ltd',
    abn: '42633062307',
    address: {
      street: '123 Emergency Lane',
      suburb: 'Brisbane City',
      state: 'Queensland',
      postcode: '4000',
      country: 'Australia'
    },
    email: 'info@disasterrecoveryqld.au',
    phone: '1300 309 361'
  },
  social: {
    facebook: 'https://facebook.com/DisasterRecoveryQLD',
    twitter: '@DisasterRecQLD',
    instagram: '@DisasterRecoveryQLD',
    linkedin: 'https://linkedin.com/company/disaster-recovery-qld'
  },
  seo: {
    defaultLanguage: 'en-AU',
    supportedLanguages: ['en-AU', 'zh', 'vi', 'pa', 'yue', 'es', 'ar', 'it', 'el', 'tl', 'ko'],
    defaultImage: '/images/og-image.jpg',
    googleSiteVerification: 'your-google-site-verification',
    bingWebmasterTools: 'your-bing-webmaster-tools',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  },
  geo: {
    region: 'AU-QLD',
    placename: 'Queensland',
    position: {
      lat: -27.4698,
      lng: 153.0251
    },
    serviceArea: {
      type: 'State',
      name: 'Queensland',
      regions: [
        'Brisbane',
        'Gold Coast',
        'Sunshine Coast',
        'Ipswich',
        'Toowoomba',
        'Cairns',
        'Townsville'
      ]
    }
  },
  business: {
    type: 'EmergencyService',
    openingHours: '24/7',
    priceRange: '$$',
    paymentAccepted: [
      'Cash',
      'Credit Card',
      'EFTPOS',
      'Bank Transfer',
      'Insurance'
    ],
    areaServed: 'Queensland',
    serviceTypes: [
      'Water Damage Restoration',
      'Fire Damage Restoration',
      'Mould Remediation',
      'Storm Damage Repair',
      'Emergency Response'
    ],
    customerService: {
      availableLanguage: [
        'English',
        'Chinese',
        'Vietnamese',
        'Arabic',
        'Korean'
      ],
      contactType: '24/7 Emergency Service'
    }
  }
} as const;

export const analyticsConfig = {
  googleAnalytics: {
    measurementId: 'G-XXXXXXXXXX',
    options: {
      sendPageViews: true,
      excludePaths: ['/api/*']
    }
  },
  performanceMonitoring: {
    webVitals: true,
    customMetrics: {
      ttfb: true,
      fcp: true,
      lcp: true
    }
  }
} as const;
