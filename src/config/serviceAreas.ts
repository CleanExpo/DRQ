import { DisasterEvent } from '../types/serviceTypes';

interface Region {
  name: string;
  suburbs: string[];
  historicalEvents?: DisasterEvent[];
  primaryServices?: string[];
  responseTimesByService?: {
    [key: string]: string;
  };
}

export interface ServiceArea {
  name: string;
  slug: string;
  regions: Region[];
  coordinates: {
    lat: number;
    lng: number;
  };
  emergencyResponseTime: string;
  serviceRadius: number;
  population?: number;
  primaryHazards?: string[];
  serviceAvailability: {
    standard: boolean;
    emergency: boolean;
    responseTime: {
      emergency: string;
      standard: string;
    };
  };
}

export const serviceAreas: Record<string, ServiceArea> = {
  brisbane: {
    name: "Brisbane",
    slug: "brisbane",
    coordinates: {
      lat: -27.4698,
      lng: 153.0251
    },
    emergencyResponseTime: "30-60 minutes",
    serviceRadius: 50,
    population: 2560720,
    primaryHazards: ["flooding", "storms", "heatwaves"],
    serviceAvailability: {
      standard: true,
      emergency: true,
      responseTime: {
        emergency: "30-60 minutes",
        standard: "Same day"
      }
    },
    regions: [
      {
        name: "Brisbane CBD",
        suburbs: ["City", "Spring Hill", "Fortitude Valley", "South Brisbane", "West End"],
        primaryServices: ["Water Damage", "Storm Response", "Commercial Services"],
        responseTimesByService: {
          "Water Damage": "30 minutes",
          "Fire Damage": "45 minutes",
          "Mould Remediation": "24 hours"
        },
        historicalEvents: [
          {
            date: "2011-01-13",
            type: "flood",
            description: "Major Brisbane River flood affecting CBD and surrounding areas",
            severity: 5
          },
          {
            date: "2022-02-28",
            type: "flood",
            description: "Significant flooding across Brisbane metropolitan area",
            severity: 4
          }
        ]
      },
      {
        name: "North Brisbane",
        suburbs: ["Chermside", "Aspley", "Kedron", "Nundah", "Northgate"],
        primaryServices: ["Residential Services", "Storm Response"],
        responseTimesByService: {
          "Water Damage": "45 minutes",
          "Fire Damage": "45 minutes",
          "Mould Remediation": "24 hours"
        },
        historicalEvents: [
          {
            date: "2022-02-27",
            type: "flood",
            description: "Kedron Brook flooding affecting multiple suburbs",
            severity: 3
          }
        ]
      }
    ]
  },
  goldCoast: {
    name: "Gold Coast",
    slug: "gold-coast",
    coordinates: {
      lat: -28.0167,
      lng: 153.4000
    },
    emergencyResponseTime: "30-60 minutes",
    serviceRadius: 40,
    population: 679127,
    primaryHazards: ["coastal flooding", "storms", "erosion"],
    serviceAvailability: {
      standard: true,
      emergency: true,
      responseTime: {
        emergency: "30-60 minutes",
        standard: "Same day"
      }
    },
    regions: [
      {
        name: "Coastal Strip",
        suburbs: ["Surfers Paradise", "Broadbeach", "Main Beach", "Miami", "Burleigh Heads"],
        primaryServices: ["Water Damage", "Storm Response", "Commercial Services"],
        responseTimesByService: {
          "Water Damage": "30 minutes",
          "Fire Damage": "45 minutes",
          "Mould Remediation": "24 hours"
        },
        historicalEvents: [
          {
            date: "2017-03-31",
            type: "flood",
            description: "Cyclone Debbie aftermath flooding",
            severity: 4
          }
        ]
      }
    ]
  },
  sunshineCoast: {
    name: "Sunshine Coast",
    slug: "sunshine-coast",
    coordinates: {
      lat: -26.6500,
      lng: 153.0666
    },
    emergencyResponseTime: "30-60 minutes",
    serviceRadius: 45,
    population: 351424,
    primaryHazards: ["coastal storms", "flooding", "bushfires"],
    serviceAvailability: {
      standard: true,
      emergency: true,
      responseTime: {
        emergency: "30-60 minutes",
        standard: "Same day"
      }
    },
    regions: [
      {
        name: "Coastal Region",
        suburbs: ["Maroochydore", "Mooloolaba", "Caloundra", "Coolum Beach", "Noosa"],
        primaryServices: ["Water Damage", "Storm Response", "Mould Remediation"],
        responseTimesByService: {
          "Water Damage": "45 minutes",
          "Fire Damage": "45 minutes",
          "Mould Remediation": "24 hours"
        },
        historicalEvents: [
          {
            date: "2022-02-28",
            type: "flood",
            description: "Major flooding affecting Sunshine Coast region",
            severity: 4
          }
        ]
      }
    ]
  },
  cairns: {
    name: "Cairns",
    slug: "cairns",
    coordinates: {
      lat: -16.9186,
      lng: 145.7781
    },
    emergencyResponseTime: "30-60 minutes",
    serviceRadius: 40,
    population: 153952,
    primaryHazards: ["cyclones", "flooding", "storm surge"],
    serviceAvailability: {
      standard: true,
      emergency: true,
      responseTime: {
        emergency: "30-60 minutes",
        standard: "Same day"
      }
    },
    regions: [
      {
        name: "Cairns City",
        suburbs: ["Cairns City", "Portsmith", "Manunda", "Westcourt", "Parramatta Park"],
        primaryServices: ["Cyclone Damage", "Water Damage", "Storm Response"],
        responseTimesByService: {
          "Water Damage": "30 minutes",
          "Storm Damage": "30 minutes",
          "Mould Remediation": "24 hours"
        },
        historicalEvents: [
          {
            date: "2019-01-31",
            type: "flood",
            description: "Monsoon trough causing widespread flooding",
            severity: 4
          }
        ]
      }
    ]
  }
};

export const getServiceArea = (areaSlug: string): ServiceArea | undefined => {
  return serviceAreas[areaSlug];
};

export const getAllServiceAreas = (): ServiceArea[] => {
  return Object.values(serviceAreas);
};

export const getNearestServiceArea = (lat: number, lng: number): ServiceArea => {
  let nearest = Object.values(serviceAreas)[0];
  let shortestDistance = calculateDistance(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);

  Object.values(serviceAreas).forEach(area => {
    const distance = calculateDistance(lat, lng, area.coordinates.lat, area.coordinates.lng);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = area;
    }
  });

  return nearest;
};

export const isWithinServiceArea = (lat: number, lng: number, area: ServiceArea): boolean => {
  const distance = calculateDistance(lat, lng, area.coordinates.lat, area.coordinates.lng);
  return distance <= area.serviceRadius;
};

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value: number): number => {
  return value * Math.PI / 180;
};
