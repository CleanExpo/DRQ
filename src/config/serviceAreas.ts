import type { ServiceArea } from '../types/serviceTypes';

// Service radius constants
export const SERVICE_RADIUS = {
  priority: 25, // km
  standard: 50, // km
  extended: 75, // km
  maxResponse: {
    priority: 30, // minutes
    standard: 45, // minutes
    extended: 60  // minutes
  }
};

// Helper function for radius calculations
function toRad(degrees: number): number {
  return degrees * (Math.PI/180);
}

// Service radius calculator
export const calculateServiceRadius = {
  fromPoint: (lat: number, lng: number, targetLat: number, targetLng: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(targetLat - lat);
    const dLng = toRad(targetLng - lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat)) * Math.cos(toRad(targetLat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  },

  isInRange: (
    serviceCenterLat: number, 
    serviceCenterLng: number, 
    targetLat: number, 
    targetLng: number, 
    maxRadius: number
  ): boolean => {
    const distance = calculateServiceRadius.fromPoint(
      serviceCenterLat, 
      serviceCenterLng, 
      targetLat, 
      targetLng
    );
    return distance <= maxRadius;
  }
};

export const serviceAreas: ServiceArea[] = [
  {
    id: 'brisbane-cbd',
    name: 'Brisbane CBD',
    suburbs: [
      'City', 'Spring Hill', 'Fortitude Valley', 'South Brisbane', 
      'West End', 'Petrie Terrace', 'New Farm', 'Teneriffe', 'Newstead',
      'Bowen Hills', 'Herston', 'Kelvin Grove', 'Red Hill', 'Paddington'
    ],
    postCodes: ['4000', '4006', '4059', '4064', '4101', '4102'],
    emergencyInfo: {
      responseTime: '15-30 minutes',
      isAvailable: true,
      phone: '1300 309 361',
      emergencyLevel: 'high'
    },
    serviceCenter: {
      lat: -27.4698,
      lng: 153.0251,
      address: '123 Adelaide St, Brisbane City QLD 4000'
    },
    coverage: {
      primary: ['City Center', 'Inner North', 'Inner South'],
      secondary: ['Inner West', 'Inner East']
    }
  },
  {
    id: 'north-brisbane',
    name: 'North Brisbane',
    suburbs: [
      'Chermside', 'Nundah', 'Aspley', 'Kedron', 'Stafford', 
      'Everton Park', 'Albany Creek', 'Brendale', 'Bracken Ridge', 
      'Brighton', 'Sandgate'
    ],
    postCodes: ['4032', '4034', '4035', '4017', '4018'],
    emergencyInfo: {
      responseTime: '20-40 minutes',
      isAvailable: true,
      phone: '1300 309 361',
      emergencyLevel: 'medium'
    },
    serviceCenter: {
      lat: -27.3853,
      lng: 153.0351,
      address: '456 Gympie Rd, Chermside QLD 4032'
    },
    coverage: {
      primary: ['North Brisbane', 'Northside'],
      secondary: ['Inner North', 'Moreton Bay South']
    }
  }
];

// Coverage checker utility
export const checkServiceCoverage = {
  getEstimatedResponse: (distanceKm: number): number => {
    if (distanceKm <= SERVICE_RADIUS.priority) return SERVICE_RADIUS.maxResponse.priority;
    if (distanceKm <= SERVICE_RADIUS.standard) return SERVICE_RADIUS.maxResponse.standard;
    return SERVICE_RADIUS.maxResponse.extended;
  },

  isInServiceArea: (lat: number, lng: number): boolean => {
    return serviceAreas.some(area => 
      calculateServiceRadius.isInRange(
        area.serviceCenter.lat,
        area.serviceCenter.lng,
        lat,
        lng,
        SERVICE_RADIUS.extended
      )
    );
  },

  getNearestServiceCenter: (lat: number, lng: number) => {
    let nearest = {
      center: serviceAreas[0].serviceCenter,
      distance: Infinity
    };

    serviceAreas.forEach(area => {
      const distance = calculateServiceRadius.fromPoint(
        area.serviceCenter.lat,
        area.serviceCenter.lng,
        lat,
        lng
      );
      
      if (distance < nearest.distance) {
        nearest = {
          center: area.serviceCenter,
          distance
        };
      }
    });

    return {
      ...nearest,
      estimatedResponse: checkServiceCoverage.getEstimatedResponse(nearest.distance)
    };
  }
};
