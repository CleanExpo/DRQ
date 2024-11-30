type Location = string;
type ServiceId = string;
type LocaleCode = 'en-AU' | 'zh';
type CustomerType = 'residential' | 'commercial' | 'self-insured' | 'insurance-clients';
type RoutePath = string;

interface ServiceRoute {
  path: string;
  locations: Location[];
}

interface RouteStructure {
  locales: LocaleCode[];
  services: {
    [key: ServiceId]: ServiceRoute;
  };
  customers: {
    [key in CustomerType]: RoutePath;
  };
  structure: {
    app: {
      '[locale]': {
        'services': {
          '[service]': {
            '[location]': {
              'page.tsx': string;
              'layout.tsx': string;
              'loading.tsx': string;
              'error.tsx': string;
            };
            'page.tsx': string;
            'layout.tsx': string;
          };
          'page.tsx': string;
          'layout.tsx': string;
        };
        'customers': {
          '[type]': {
            'page.tsx': string;
            'layout.tsx': string;
          };
          'page.tsx': string;
          'layout.tsx': string;
        };
        'page.tsx': string;
        'layout.tsx': string;
      };
    };
  };
}

const defaultLocations = [
  'brisbane-cbd',
  'brisbane-city',
  'brisbane-suburbs',
  'inner-brisbane-suburbs',
  'eastern-brisbane-suburbs',
  'western-brisbane-suburbs',
  'south-brisbane-suburbs',
  'ipswich',
  'ipswich-country',
  'scenic-rim',
  'lockyer-valley',
  'toowoomba-range',
  'logan',
  'logan-village',
  'gold-coast',
  'gold-coast-hinterland',
  'redland-shire'
];

export const routeStructure: RouteStructure = {
  locales: ['en-AU', 'zh'],
  
  services: {
    'water-damage-restoration': {
      path: '/[locale]/services/water-damage-restoration',
      locations: defaultLocations
    },
    'storm-damage-restoration': {
      path: '/[locale]/services/storm-damage-restoration',
      locations: defaultLocations
    },
    'flood-damage-restoration': {
      path: '/[locale]/services/flood-damage-restoration',
      locations: defaultLocations
    },
    'mould-remediation': {
      path: '/[locale]/services/mould-remediation',
      locations: defaultLocations
    },
    'sewage-cleanup': {
      path: '/[locale]/services/sewage-cleanup',
      locations: defaultLocations
    }
  },

  customers: {
    residential: '/[locale]/customers/residential',
    commercial: '/[locale]/customers/commercial',
    'self-insured': '/[locale]/customers/self-insured',
    'insurance-clients': '/[locale]/customers/insurance-clients'
  },

  structure: {
    app: {
      '[locale]': {
        'services': {
          '[service]': {
            '[location]': {
              'page.tsx': '// Service location specific page',
              'layout.tsx': '// Service location layout',
              'loading.tsx': '// Loading state',
              'error.tsx': '// Error handling'
            },
            'page.tsx': '// Service main page',
            'layout.tsx': '// Service layout'
          },
          'page.tsx': '// Services overview page',
          'layout.tsx': '// Services layout'
        },
        'customers': {
          '[type]': {
            'page.tsx': '// Customer type specific page',
            'layout.tsx': '// Customer type layout'
          },
          'page.tsx': '// Customers overview page',
          'layout.tsx': '// Customers layout'
        },
        'page.tsx': '// Homepage for locale',
        'layout.tsx': '// Root layout for locale'
      }
    }
  }
};

export const generateStaticPaths = (): string[] => {
  const paths: string[] = [];
  
  routeStructure.locales.forEach(locale => {
    // Service + Location pages
    Object.entries(routeStructure.services).forEach(([service, data]) => {
      // Main service page
      paths.push(`/${locale}/services/${service}`);
      
      // Service location pages
      data.locations.forEach(location => {
        paths.push(`/${locale}/services/${service}/${location}`);
      });
    });

    // Customer type pages
    Object.values(routeStructure.customers).forEach(path => {
      paths.push(path.replace('[locale]', locale));
    });
  });

  return paths;
};

interface PageCount {
  servicePages: number;
  customerPages: number;
  total: number;
}

export const calculateTotalPages = (): PageCount => {
  const locales = routeStructure.locales.length;
  const services = Object.keys(routeStructure.services).length;
  const locations = defaultLocations.length; // Use the constant instead of accessing potentially undefined property
  const customerTypes = Object.keys(routeStructure.customers).length;

  return {
    servicePages: locales * services * locations,
    customerPages: locales * customerTypes,
    total: (locales * services * locations) + (locales * customerTypes)
  };
};

// Calculate and log total pages
const pageCount = calculateTotalPages();
console.log(`Total Pages to Generate: ${pageCount.total}`);
console.log(`- Service Pages: ${pageCount.servicePages}`);
console.log(`- Customer Pages: ${pageCount.customerPages}`);
