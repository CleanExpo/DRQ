import { ServiceType } from './IServiceType';

export interface ServiceRegion {
  id: string;
  name: string;
  suburbs: string[];
  responseTime: string;
  isActive: boolean;
  services: ServiceType[];
  contactNumber: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  postcodes?: string[];
  emergencyInfo?: {
    primaryContact: string;
    secondaryContact?: string;
    afterHours: string;
  };
  coverage?: {
    radius: number; // in kilometers
    boundaries?: string[];
  };
}

export interface ServiceAreaStats {
  totalJobs: number;
  averageResponseTime: string;
  customerSatisfaction: number;
  activeEmergencies: number;
}

export interface IServiceArea {
  // Get all service regions
  getRegions(): ServiceRegion[];
  
  // Get specific region by ID
  getRegion(id: string): ServiceRegion | null;
  
  // Get regions by suburb name
  getRegionBySuburb(suburb: string): ServiceRegion | null;
  
  // Get nearest region by coordinates
  getNearestRegion(lat: number, lng: number): ServiceRegion;
  
  // Check if postcode is serviced
  isServicedPostcode(postcode: string): boolean;
  
  // Get response time estimate for location
  getResponseTimeEstimate(location: string): string | null;
  
  // Get service area statistics
  getAreaStats(regionId: string): Promise<ServiceAreaStats>;
  
  // Subscribe to region updates
  subscribeToUpdates(callback: (regions: ServiceRegion[]) => void): () => void;
}

// Service regions data
export const SERVICE_REGIONS: ServiceRegion[] = [
  {
    id: 'brisbane',
    name: 'Brisbane',
    suburbs: [
      'Brisbane CBD',
      'South Brisbane',
      'West End',
      'Fortitude Valley',
      'New Farm',
      'Teneriffe',
      'Newstead',
      'Hamilton',
      'Ascot',
      'Paddington'
    ],
    responseTime: '30-60 minutes',
    isActive: true,
    services: [],  // Will be populated from SERVICE_TYPES
    contactNumber: '1300 309 361',
    coordinates: {
      lat: -27.4698,
      lng: 153.0251
    },
    description: 'Serving Brisbane and surrounding suburbs with 24/7 emergency response',
    postcodes: ['4000', '4101', '4006', '4005', '4007'],
    emergencyInfo: {
      primaryContact: '1300 309 361',
      afterHours: '1300 309 361'
    },
    coverage: {
      radius: 30,
      boundaries: ['North: Bracken Ridge', 'South: Sunnybank', 'East: Wynnum', 'West: Moggill']
    }
  },
  {
    id: 'gold-coast',
    name: 'Gold Coast',
    suburbs: [
      'Surfers Paradise',
      'Broadbeach',
      'Robina',
      'Southport',
      'Main Beach',
      'Burleigh Heads',
      'Palm Beach',
      'Coolangatta',
      'Nerang',
      'Helensvale'
    ],
    responseTime: '30-60 minutes',
    isActive: true,
    services: [],  // Will be populated from SERVICE_TYPES
    contactNumber: '1300 309 361',
    coordinates: {
      lat: -28.0167,
      lng: 153.4000
    },
    description: 'Complete coverage of Gold Coast region with rapid emergency response',
    postcodes: ['4217', '4218', '4215', '4216', '4226'],
    emergencyInfo: {
      primaryContact: '1300 309 361',
      afterHours: '1300 309 361'
    },
    coverage: {
      radius: 40,
      boundaries: ['North: Yatala', 'South: Coolangatta', 'West: Nerang']
    }
  },
  {
    id: 'sunshine-coast',
    name: 'Sunshine Coast',
    suburbs: [
      'Maroochydore',
      'Caloundra',
      'Noosa',
      'Mooloolaba',
      'Buderim',
      'Kawana Waters',
      'Coolum Beach',
      'Alexandra Headland',
      'Cotton Tree',
      'Sippy Downs'
    ],
    responseTime: '45-90 minutes',
    isActive: true,
    services: [],  // Will be populated from SERVICE_TYPES
    contactNumber: '1300 309 361',
    coordinates: {
      lat: -26.6500,
      lng: 153.0666
    },
    description: 'Servicing the entire Sunshine Coast region with professional restoration services',
    postcodes: ['4557', '4558', '4551', '4556'],
    emergencyInfo: {
      primaryContact: '1300 309 361',
      afterHours: '1300 309 361'
    },
    coverage: {
      radius: 35,
      boundaries: ['North: Noosa', 'South: Caloundra', 'West: Nambour']
    }
  }
];

// Initialize services for each region
import { SERVICE_TYPES } from './IServiceType';
SERVICE_REGIONS.forEach(region => {
  region.services = Object.values(SERVICE_TYPES);
});
