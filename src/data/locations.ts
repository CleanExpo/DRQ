export interface ServiceArea {
  id: string;
  name: string;
  suburbs: string[];
}

export interface LocationService {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  status: 'active' | 'coming-soon';
  serviceAreas: ServiceArea[];
  services: LocationService[];
  metaData: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const locations: Location[] = [
  {
    id: 'brisbane',
    slug: 'brisbane',
    name: 'Brisbane',
    description: 'Servicing Brisbane and surrounding areas',
    image: 'https://placehold.co/600x400/007bff/ffffff?text=Brisbane',
    status: 'active',
    serviceAreas: [
      {
        id: 'brisbane-cbd',
        name: 'Brisbane CBD',
        suburbs: ['Brisbane City', 'Spring Hill', 'Fortitude Valley']
      },
      {
        id: 'north-brisbane',
        name: 'North Brisbane',
        suburbs: ['Chermside', 'Aspley', 'Kedron', 'Nundah']
      },
      {
        id: 'south-brisbane',
        name: 'South Brisbane',
        suburbs: ['South Bank', 'West End', 'Woolloongabba']
      },
      {
        id: 'east-brisbane',
        name: 'East Brisbane',
        suburbs: ['Bulimba', 'Hawthorne', 'Morningside']
      },
      {
        id: 'west-brisbane',
        name: 'West Brisbane',
        suburbs: ['Toowong', 'Indooroopilly', 'St Lucia']
      }
    ],
    services: [
      {
        id: 'water-damage',
        title: 'Water Damage Restoration',
        description: '24/7 emergency water damage restoration services',
        image: 'https://placehold.co/800x600/007bff/ffffff?text=Water+Damage',
        features: [
          'Emergency water extraction',
          'Structural drying',
          'Moisture detection',
          'Mould prevention'
        ]
      },
      {
        id: 'fire-damage',
        title: 'Fire Damage Recovery',
        description: 'Professional fire and smoke damage restoration',
        image: 'https://placehold.co/800x600/007bff/ffffff?text=Fire+Damage',
        features: [
          'Smoke damage cleanup',
          'Structural restoration',
          'Content cleaning',
          'Odor removal'
        ]
      },
      {
        id: 'mould-remediation',
        title: 'Mould Remediation',
        description: 'Expert mould removal and prevention services',
        image: 'https://placehold.co/800x600/007bff/ffffff?text=Mould+Remediation',
        features: [
          'Mould inspection',
          'Safe removal',
          'Prevention treatment',
          'Air quality testing'
        ]
      }
    ],
    metaData: {
      title: 'Emergency Restoration Services Brisbane | DRQ',
      description: 'Professional disaster recovery and restoration services in Brisbane. 24/7 emergency response for water damage, fire damage, and mould remediation.',
      keywords: ['Brisbane', 'restoration', 'water damage', 'fire damage', 'mould removal']
    }
  },
  {
    id: 'gold-coast',
    slug: 'gold-coast',
    name: 'Gold Coast',
    description: 'Coming soon - Gold Coast and surrounding areas',
    image: 'https://placehold.co/600x400/007bff/ffffff?text=Gold+Coast',
    status: 'coming-soon',
    serviceAreas: [],
    services: [],
    metaData: {
      title: 'Gold Coast Restoration Services Coming Soon | DRQ',
      description: 'Professional disaster recovery and restoration services coming soon to Gold Coast.',
      keywords: ['Gold Coast', 'restoration', 'coming soon']
    }
  },
  {
    id: 'ipswich',
    slug: 'ipswich',
    name: 'Ipswich',
    description: 'Coming soon - Ipswich and surrounding areas',
    image: 'https://placehold.co/600x400/007bff/ffffff?text=Ipswich',
    status: 'coming-soon',
    serviceAreas: [],
    services: [],
    metaData: {
      title: 'Ipswich Restoration Services Coming Soon | DRQ',
      description: 'Professional disaster recovery and restoration services coming soon to Ipswich.',
      keywords: ['Ipswich', 'restoration', 'coming soon']
    }
  },
  {
    id: 'logan',
    slug: 'logan',
    name: 'Logan',
    description: 'Coming soon - Logan and surrounding areas',
    image: 'https://placehold.co/600x400/007bff/ffffff?text=Logan',
    status: 'coming-soon',
    serviceAreas: [],
    services: [],
    metaData: {
      title: 'Logan Restoration Services Coming Soon | DRQ',
      description: 'Professional disaster recovery and restoration services coming soon to Logan.',
      keywords: ['Logan', 'restoration', 'coming soon']
    }
  }
];

export function getLocation(slug: string): Location | undefined {
  return locations.find(location => location.slug === slug);
}

export function getActiveLocations(): Location[] {
  return locations.filter(location => location.status === 'active');
}

export function getComingSoonLocations(): Location[] {
  return locations.filter(location => location.status === 'coming-soon');
}
