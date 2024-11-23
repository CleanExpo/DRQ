import { ServicePage, Location, DisasterEvent } from '../types/serviceTypes';
import { serviceAreas, ServiceArea } from '../config/serviceAreas';
import { Locale, formatDate } from '../config/i18n.config';
import { siteMetadata } from '../config/project.config';

interface ContentTemplate {
  service: string;
  location: string;
  historicalEvents: DisasterEvent[];
  localFactors: string[];
  locale: Locale;
}

interface GeneratedContent {
  title: string;
  metaDescription: string;
  heroContent: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  mainContent: {
    introduction: string;
    serviceDescription: string;
    localRelevance: string;
    emergencyInfo: string;
    hazardInfo?: string;
    responseTimeInfo: string;
  };
  sections: {
    primaryHazards?: string[];
    responseTimesByService?: Record<string, string>;
    historicalEvents?: DisasterEvent[];
    suburbs: string[];
  };
}

interface ServiceContent {
  title: string;
  description: string;
  features: string[];
  hazardSpecificInfo?: Record<string, string>;
  responseTimeRanges: {
    emergency: string;
    standard: string;
  };
}

interface LocaleContent {
  waterDamage: ServiceContent;
  fireDamage: ServiceContent;
  mould: ServiceContent;
  stormDamage: ServiceContent;
}

type TranslationsType = {
  [K in Locale]: LocaleContent;
};

const serviceBackgrounds = {
  'water-damage': '/images/services/water-damage-hero.jpg',
  'fire-damage': '/images/services/fire-damage-hero.jpg',
  'mould': '/images/services/mould-hero.jpg',
  'storm-damage': '/images/services/storm-damage-hero.jpg'
} as const;

const defaultTranslation: LocaleContent = {
  waterDamage: {
    title: 'Water Damage Restoration',
    description: 'Professional water damage restoration services including flood cleanup, water extraction, and structural drying.',
    features: [
      'Emergency water extraction',
      'Flood damage restoration',
      'Structural drying',
      'Moisture detection',
      'Mould prevention'
    ],
    hazardSpecificInfo: {
      flooding: 'Specialized flood response and mitigation services',
      storms: 'Storm surge and heavy rainfall damage management',
      cyclones: 'Cyclone-related water damage restoration'
    },
    responseTimeRanges: {
      emergency: '30-60 minutes',
      standard: 'Same day'
    }
  },
  fireDamage: {
    title: 'Fire Damage Recovery',
    description: 'Complete fire and smoke damage restoration services including cleanup, odor removal, and structural repairs.',
    features: [
      'Fire damage restoration',
      'Smoke damage cleanup',
      'Odor removal',
      'Content restoration',
      'Structural repairs'
    ],
    hazardSpecificInfo: {
      bushfires: 'Bushfire damage restoration expertise',
      heatwaves: 'Fire risk mitigation during extreme heat'
    },
    responseTimeRanges: {
      emergency: '30-60 minutes',
      standard: 'Same day'
    }
  },
  mould: {
    title: 'Mould Remediation',
    description: 'Professional mould removal and remediation services to ensure a healthy living environment.',
    features: [
      'Mould inspection',
      'Safe mould removal',
      'Prevention strategies',
      'Air quality testing',
      'Structural repairs'
    ],
    hazardSpecificInfo: {
      flooding: 'Post-flood mould prevention and treatment',
      storms: 'Storm-related moisture and mould management'
    },
    responseTimeRanges: {
      emergency: '24 hours',
      standard: '2-3 days'
    }
  },
  stormDamage: {
    title: 'Storm Damage Restoration',
    description: 'Comprehensive storm damage repair and restoration services for all types of storm-related damage.',
    features: [
      'Emergency storm response',
      'Structural damage repair',
      'Water damage mitigation',
      'Debris removal',
      'Temporary protection'
    ],
    hazardSpecificInfo: {
      cyclones: 'Cyclone damage restoration expertise',
      storms: 'Severe storm damage recovery',
      flooding: 'Storm-related flooding response'
    },
    responseTimeRanges: {
      emergency: '30-60 minutes',
      standard: 'Same day'
    }
  }
};

// Initialize translations with default English content for all locales
const translations: Partial<TranslationsType> = {
  'en-AU': defaultTranslation
};

const getServiceSpecificContent = (service: string, locale: Locale = 'en-AU'): ServiceContent => {
  const content = translations[locale] || translations['en-AU'] || defaultTranslation;
  const serviceMap = {
    'water-damage': content.waterDamage,
    'fire-damage': content.fireDamage,
    'mould': content.mould,
    'storm-damage': content.stormDamage
  } as const;

  return serviceMap[service as keyof typeof serviceMap] || serviceMap['water-damage'];
};

const generateHazardInfo = (area: ServiceArea, service: string, locale: Locale): string => {
  const serviceContent = getServiceSpecificContent(service, locale);
  const relevantHazards = area.primaryHazards?.filter(hazard => 
    serviceContent.hazardSpecificInfo?.[hazard]
  ) || [];

  if (relevantHazards.length === 0) return '';

  const hazardInfos = relevantHazards.map(hazard => 
    serviceContent.hazardSpecificInfo?.[hazard]
  ).filter(Boolean);

  return hazardInfos.join('. ') + '.';
};

const generateResponseTimeInfo = (area: ServiceArea, service: string, locale: Locale): string => {
  const serviceContent = getServiceSpecificContent(service, locale);
  const { emergency, standard } = serviceContent.responseTimeRanges;

  return `Our ${service} emergency response time in ${area.name} is typically ${emergency} for urgent situations, and ${standard} for standard service requests. We maintain multiple response units across ${area.name} to ensure rapid deployment.`;
};

const formatHistoricalEvents = (events: DisasterEvent[], locale: Locale): string => {
  if (events.length === 0) return '';

  const recentEvents = events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return recentEvents
    .map(event => `${formatDate(event.date, locale)} - ${event.description} (Severity: ${event.severity}/5)`)
    .join('. ');
};

export const generateLocationContent = (template: ContentTemplate): GeneratedContent => {
  const serviceContent = getServiceSpecificContent(template.service, template.locale);
  const area = serviceAreas[template.location.toLowerCase()];
  const historicalContext = formatHistoricalEvents(template.historicalEvents, template.locale);
  const hazardInfo = generateHazardInfo(area, template.service, template.locale);
  const responseTimeInfo = generateResponseTimeInfo(area, template.service, template.locale);

  return {
    title: `${serviceContent.title} in ${template.location}`,
    metaDescription: `Professional ${template.service} services in ${template.location}. 24/7 emergency response with ${area.serviceAvailability.responseTime.emergency} response times. Local experts with extensive experience.`,
    heroContent: {
      title: `${serviceContent.title} in ${template.location}`,
      subtitle: `24/7 Emergency ${template.service} Services with ${area.serviceAvailability.responseTime.emergency} Response Times`,
      backgroundImage: serviceBackgrounds[template.service as keyof typeof serviceBackgrounds]
    },
    mainContent: {
      introduction: `Looking for professional ${template.service} services in ${template.location}? Our expert team provides rapid response and comprehensive solutions for all ${template.service} emergencies.`,
      serviceDescription: serviceContent.description,
      localRelevance: `With extensive experience serving the ${template.location} area, we understand the unique challenges posed by local conditions and building structures. ${historicalContext ? `Our team has responded to major incidents including ${historicalContext}.` : ''}`,
      emergencyInfo: `For ${template.location} residents, we provide 24/7 emergency response with typical arrival times of ${area.serviceAvailability.responseTime.emergency}.`,
      hazardInfo,
      responseTimeInfo
    },
    sections: {
      primaryHazards: area.primaryHazards,
      responseTimesByService: area.regions[0]?.responseTimesByService,
      historicalEvents: template.historicalEvents,
      suburbs: area.regions.flatMap(r => r.suburbs)
    }
  };
};

export const generateServicePageContent = (
  service: string,
  location: string,
  historicalEvents: DisasterEvent[] = [],
  locale: Locale = 'en-AU'
): ServicePage => {
  const content = generateLocationContent({
    service,
    location,
    historicalEvents,
    localFactors: [],
    locale
  });

  return {
    slug: `${service}-${location.toLowerCase()}`,
    title: content.title,
    metaDescription: content.metaDescription,
    heroContent: content.heroContent,
    serviceDetails: {
      description: content.mainContent.serviceDescription,
      features: getServiceSpecificContent(service, locale).features,
      emergencyResponse: true
    },
    locations: [
      {
        name: location,
        slug: location.toLowerCase(),
        coordinates: serviceAreas[location.toLowerCase()]?.coordinates || {
          lat: -27.4698,
          lng: 153.0251
        },
        serviceArea: content.sections.suburbs,
        historicalEvents
      }
    ]
  };
};
