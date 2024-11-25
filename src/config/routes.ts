export const routes = {
  services: {
    water: {
      main: '/services/water-damage',
      residential: '/services/water-damage/residential',
      commercial: '/services/water-damage/commercial',
      slug: 'water-damage'
    },
    sewage: {
      main: '/services/sewage-cleanup',
      residential: '/services/sewage-cleanup/residential',
      commercial: '/services/sewage-cleanup/commercial',
      slug: 'sewage-cleanup'
    },
    mould: {
      main: '/services/mould-remediation',
      residential: '/services/mould-remediation/residential',
      commercial: '/services/mould-remediation/commercial',
      slug: 'mould-remediation'
    },
    commercial: {
      main: '/services/commercial',
      industries: {
        office: '/services/commercial/office-buildings',
        retail: '/services/commercial/retail-spaces',
        healthcare: '/services/commercial/healthcare',
        education: '/services/commercial/education',
        industrial: '/services/commercial/industrial',
        strata: '/services/commercial/strata'
      }
    }
  },
  locations: {
    main: {
      path: '/locations'
    },
    brisbane: {
      main: '/locations/brisbane',
      cbd: '/locations/brisbane/cbd',
      north: '/locations/brisbane/north',
      south: '/locations/brisbane/south',
      east: '/locations/brisbane/east',
      west: '/locations/brisbane/west'
    },
    goldCoast: {
      main: '/locations/gold-coast',
      central: '/locations/gold-coast/central',
      north: '/locations/gold-coast/north',
      south: '/locations/gold-coast/south'
    },
    ipswich: {
      main: '/locations/ipswich',
      city: '/locations/ipswich/city',
      country: '/locations/ipswich/country'
    },
    logan: {
      main: '/locations/logan'
    }
  },
  about: '/about',
  contact: '/contact',
  emergency: '/emergency'
} as const;

// Helper functions for navigation
export function getServicePath(service: keyof typeof routes.services) {
  return routes.services[service].main;
}

export function getLocationPath(location: keyof Omit<typeof routes.locations, 'main'>) {
  return routes.locations[location].main;
}

export function getCommercialPath(industry: keyof typeof routes.services.commercial.industries) {
  return routes.services.commercial.industries[industry];
}

// Type exports
export type ServiceRoutes = typeof routes.services;
export type LocationRoutes = typeof routes.locations;
export type CommercialIndustries = keyof typeof routes.services.commercial.industries;

// Additional helper functions
export function isServiceRoute(path: string): boolean {
  return path.startsWith('/services/');
}

export function isLocationRoute(path: string): boolean {
  return path.startsWith('/locations/');
}

export function getServiceSlug(path: string): string | null {
  const match = path.match(/^\/services\/([^\/]+)/);
  return match ? match[1] : null;
}

export function getLocationSlug(path: string): string | null {
  const match = path.match(/^\/locations\/([^\/]+)/);
  return match ? match[1] : null;
}

export function getBreadcrumbItems(path: string) {
  const segments = path.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    return {
      label: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path
    };
  });
}

// Navigation type guards
export function isMainLocationPath(path: string): boolean {
  return path === routes.locations.main.path;
}

export function isMainServicePath(path: string): boolean {
  return Object.values(routes.services).some(service => 'main' in service && service.main === path);
}

export function isCommercialPath(path: string): boolean {
  return path.startsWith(routes.services.commercial.main);
}

// Route type utilities
export type ServicePath = typeof routes.services[keyof typeof routes.services]['main'];
export type LocationPath = typeof routes.locations[Exclude<keyof typeof routes.locations, 'main'>]['main'];
export type CommercialPath = typeof routes.services.commercial.industries[keyof typeof routes.services.commercial.industries];
