import { type Location } from '@/types/commonTypes';
import { serviceAreas } from '@/config/serviceAreas';

interface SearchResult {
  type: 'service' | 'location' | 'article';
  title: string;
  description: string;
  url: string;
  priority: number;
  relevance: number;
}

interface SearchOptions {
  type?: 'service' | 'location' | 'article';
  location?: string;
  service?: string;
  limit?: number;
}

const services = {
  'water-damage': {
    title: 'Water Damage Restoration',
    description: 'Emergency water extraction and restoration services available 24/7.',
    keywords: ['flood', 'water', 'leak', 'storm', 'extraction', 'drying']
  },
  'fire-damage': {
    title: 'Fire Damage Recovery',
    description: 'Professional fire and smoke damage restoration services.',
    keywords: ['fire', 'smoke', 'burn', 'ash', 'soot', 'restoration']
  },
  'mould-remediation': {
    title: 'Mould Remediation',
    description: 'Expert mould detection and removal services.',
    keywords: ['mould', 'mold', 'fungus', 'spores', 'humidity', 'remediation']
  }
};

function calculateRelevance(query: string, text: string, keywords: string[]): number {
  const queryWords = query.toLowerCase().split(' ');
  let relevance = 0;

  // Check exact matches
  if (text.toLowerCase().includes(query.toLowerCase())) {
    relevance += 10;
  }

  // Check keyword matches
  keywords.forEach(keyword => {
    if (queryWords.includes(keyword.toLowerCase())) {
      relevance += 5;
    }
  });

  // Check partial matches
  queryWords.forEach(word => {
    if (text.toLowerCase().includes(word)) {
      relevance += 2;
    }
  });

  return relevance;
}

export async function search(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const { type, location, service, limit = 10 } = options;

  // Search services
  if (!type || type === 'service') {
    Object.entries(services).forEach(([slug, serviceInfo]) => {
      const relevance = calculateRelevance(
        query,
        `${serviceInfo.title} ${serviceInfo.description}`,
        serviceInfo.keywords
      );

      if (relevance > 0) {
        results.push({
          type: 'service',
          title: serviceInfo.title,
          description: serviceInfo.description,
          url: `/services/${slug}`,
          priority: 10,
          relevance
        });
      }
    });
  }

  // Search locations
  if (!type || type === 'location') {
    Object.entries(serviceAreas).forEach(([slug, area]) => {
      const relevance = calculateRelevance(
        query,
        `${area.name} ${area.regions.map(r => r.name).join(' ')}`,
        area.regions.map(r => r.name)
      );

      if (relevance > 0) {
        results.push({
          type: 'location',
          title: area.name,
          description: `Emergency services available in ${area.name} and surrounding areas`,
          url: `/service-areas/${slug}`,
          priority: 5,
          relevance
        });
      }
    });
  }

  // Sort by relevance and priority
  results.sort((a, b) => {
    if (a.relevance === b.relevance) {
      return b.priority - a.priority;
    }
    return b.relevance - a.relevance;
  });

  return results.slice(0, limit);
}

export function getEmergencyKeywords(): string[] {
  return [
    'emergency',
    'urgent',
    'flood',
    'fire',
    'water',
    'smoke',
    'mould',
    'damage',
    'leak',
    'storm'
  ];
}

export function isEmergencySearch(query: string): boolean {
  const keywords = getEmergencyKeywords();
  const queryWords = query.toLowerCase().split(' ');
  return keywords.some(keyword => queryWords.includes(keyword.toLowerCase()));
}
