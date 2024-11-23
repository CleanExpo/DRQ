import { ServicePage, Location } from '../types/serviceTypes';

interface EmergencyEvent {
  type: 'flood' | 'fire' | 'storm' | 'other';
  severity: 1 | 2 | 3 | 4 | 5;
  location: Location;
  description: string;
  timestamp: number;
  affectedAreas: string[];
}

interface TrafficThreshold {
  warning: number;
  critical: number;
  emergency: number;
}

const trafficThresholds: TrafficThreshold = {
  warning: 1000,    // requests per minute
  critical: 2000,   // requests per minute
  emergency: 3000   // requests per minute
};

export const emergencyProtocol = {
  // Traffic management
  handleHighTraffic: (currentTraffic: number) => {
    if (currentTraffic >= trafficThresholds.emergency) {
      return {
        action: 'emergency',
        measures: [
          'activate_cdn_failover',
          'enable_aggressive_caching',
          'defer_non_critical_resources',
          'activate_static_fallback'
        ]
      };
    }
    if (currentTraffic >= trafficThresholds.critical) {
      return {
        action: 'critical',
        measures: [
          'increase_cdn_caching',
          'reduce_image_quality',
          'disable_non_essential_features'
        ]
      };
    }
    if (currentTraffic >= trafficThresholds.warning) {
      return {
        action: 'warning',
        measures: [
          'increase_caching',
          'optimize_images',
          'prepare_scaling'
        ]
      };
    }
    return {
      action: 'normal',
      measures: []
    };
  },

  // Cache management
  updateCacheStrategy: (trafficLevel: keyof TrafficThreshold) => ({
    'warning': {
      maxAge: 60 * 5,        // 5 minutes
      staleWhileRevalidate: 60
    },
    'critical': {
      maxAge: 60 * 15,       // 15 minutes
      staleWhileRevalidate: 60 * 5
    },
    'emergency': {
      maxAge: 60 * 30,       // 30 minutes
      staleWhileRevalidate: 60 * 10
    }
  }[trafficLevel]),

  // Emergency content updates
  updateEmergencyContent: async (event: EmergencyEvent) => {
    const updates = {
      global: {
        banner: {
          type: event.type,
          message: `Emergency ${event.type} alert for ${event.location.name}. Call 1300 309 361 for immediate assistance.`,
          severity: event.severity
        },
        affectedAreas: event.affectedAreas,
        timestamp: event.timestamp
      },
      location: {
        name: event.location.name,
        warning: `Active ${event.type} emergency in ${event.location.name}. Emergency response teams are operating in the area.`,
        responseTime: '15-30 minutes',
        priority: 'critical'
      }
    };

    // Update relevant service pages
    const serviceUpdates = {
      [`services/${event.type}`]: {
        heroContent: {
          title: `Emergency ${event.type} Response in ${event.location.name}`,
          subtitle: `Immediate assistance available. Call now.`,
          priority: true
        }
      }
    };

    return {
      updates,
      serviceUpdates,
      timestamp: Date.now(),
      expiresIn: 60 * 15 // 15 minutes
    };
  },

  // Scale infrastructure
  scaleInfrastructure: (trafficLevel: keyof TrafficThreshold) => ({
    'warning': {
      instances: 2,
      cacheNodes: 2,
      priority: 'high'
    },
    'critical': {
      instances: 4,
      cacheNodes: 4,
      priority: 'critical'
    },
    'emergency': {
      instances: 8,
      cacheNodes: 8,
      priority: 'emergency'
    }
  }[trafficLevel]),

  // Monitor system health
  checkSystemHealth: () => ({
    cdn: {
      status: 'operational',
      latency: 50,  // ms
      errorRate: 0.01
    },
    api: {
      status: 'operational',
      responseTime: 100,  // ms
      errorRate: 0.02
    },
    database: {
      status: 'operational',
      connections: 100,
      queryTime: 20  // ms
    }
  })
};

export default emergencyProtocol;
