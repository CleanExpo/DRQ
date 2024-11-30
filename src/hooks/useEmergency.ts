import { useState, useEffect, useCallback } from 'react';
import { EmergencyService } from '@/services/core/EmergencyService';
import type { EmergencyAlert, ServiceArea } from '@/services/types/IEmergencyService';
import { logger } from '@/utils/logger';

interface UseEmergencyState {
  alerts: EmergencyAlert[];
  hasCritical: boolean;
  emergencyContact: string;
  serviceAreas: ServiceArea[];
  loading: boolean;
  error: Error | null;
}

export function useEmergency() {
  const [state, setState] = useState<UseEmergencyState>({
    alerts: [],
    hasCritical: false,
    emergencyContact: '',
    serviceAreas: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const emergencyService = EmergencyService.getInstance();
    let mounted = true;

    const initialize = async () => {
      try {
        if (!mounted) return;

        const alerts = emergencyService.getCurrentAlerts();
        const hasCritical = emergencyService.hasCriticalAlerts();
        const emergencyContact = emergencyService.getEmergencyContact();
        const serviceAreas = emergencyService.getServiceAreas();

        setState({
          alerts,
          hasCritical,
          emergencyContact,
          serviceAreas,
          loading: false,
          error: null
        });
      } catch (error) {
        logger.error('Failed to initialize emergency state:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error as Error
          }));
        }
      }
    };

    // Subscribe to alert updates
    const unsubscribe = emergencyService.subscribeToAlerts((alerts) => {
      if (mounted) {
        setState(prev => ({
          ...prev,
          alerts,
          hasCritical: emergencyService.hasCriticalAlerts()
        }));
      }
    });

    initialize();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Get nearest service area based on location
  const getNearestServiceArea = useCallback((latitude: number, longitude: number): ServiceArea | null => {
    // This is a placeholder implementation
    // In a real app, we would calculate distances to each service area
    return state.serviceAreas[0] || null;
  }, [state.serviceAreas]);

  // Check if a location is within service area
  const isInServiceArea = useCallback((location: string): boolean => {
    return state.serviceAreas.some(area => 
      area.isActive && area.name.toLowerCase().includes(location.toLowerCase())
    );
  }, [state.serviceAreas]);

  // Get response time estimate for a location
  const getResponseTime = useCallback((location: string): string | null => {
    const area = state.serviceAreas.find(area => 
      area.name.toLowerCase().includes(location.toLowerCase())
    );
    return area?.responseTime || null;
  }, [state.serviceAreas]);

  return {
    ...state,
    getNearestServiceArea,
    isInServiceArea,
    getResponseTime
  };
}

// Example usage:
/*
function EmergencyContactButton() {
  const { emergencyContact, hasCritical } = useEmergency();

  return (
    <a
      href={`tel:${emergencyContact}`}
      className={`btn ${hasCritical ? 'btn-red' : 'btn-blue'}`}
    >
      Call Now: {emergencyContact}
    </a>
  );
}

function ServiceAreaCheck() {
  const { isInServiceArea, getResponseTime } = useEmergency();
  const location = 'Brisbane';

  if (!isInServiceArea(location)) {
    return <p>Sorry, we don't currently service this area.</p>;
  }

  const responseTime = getResponseTime(location);
  return (
    <p>Estimated response time in {location}: {responseTime}</p>
  );
}
*/
