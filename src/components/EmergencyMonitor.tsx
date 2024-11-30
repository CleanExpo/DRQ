'use client';

import { useState, useEffect } from 'react';
import { EmergencyService } from '../services/core/EmergencyService';
import { useAriaExpanded } from '../hooks/useAriaExpanded';
import { EmergencyAlert, EmergencySeverity, ServiceArea } from '../services/types/IEmergencyService';

interface EmergencyStats {
  alerts: EmergencyAlert[];
  hasCritical: boolean;
  serviceAreas: ServiceArea[];
  emergencyContact: string;
}

export default function EmergencyMonitor() {
  const [stats, setStats] = useState<EmergencyStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ariaProps = useAriaExpanded(isVisible);

  useEffect(() => {
    const emergencyService = EmergencyService.getInstance();
    let unsubscribe: (() => void) | null = null;

    const initialize = () => {
      try {
        setStats({
          alerts: emergencyService.getCurrentAlerts(),
          hasCritical: emergencyService.hasCriticalAlerts(),
          serviceAreas: emergencyService.getServiceAreas(),
          emergencyContact: emergencyService.getEmergencyContact()
        });

        // Subscribe to alert updates
        unsubscribe = emergencyService.subscribeToAlerts((alerts) => {
          setStats(prev => ({
            ...prev!,
            alerts,
            hasCritical: emergencyService.hasCriticalAlerts()
          }));
        });
      } catch (error) {
        console.error('Failed to initialize EmergencyMonitor:', error);
      }
    };

    initialize();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (!stats || process.env.NODE_ENV === 'production') {
    return null;
  }

  const getSeverityColor = (severity: EmergencySeverity) => {
    switch (severity) {
      case EmergencySeverity.CRITICAL:
        return 'bg-red-500';
      case EmergencySeverity.HIGH:
        return 'bg-orange-500';
      case EmergencySeverity.MEDIUM:
        return 'bg-yellow-500';
      case EmergencySeverity.LOW:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50"
      data-testid="emergency-monitor"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`px-4 py-2 rounded-lg shadow-lg transition-colors ${
          stats.hasCritical 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-gray-800 hover:bg-gray-700'
        } text-white`}
        aria-controls="emergency-stats-panel"
        data-testid="emergency-monitor-toggle"
        {...ariaProps}
      >
        Emergency Monitor {isVisible ? '▼' : '▲'}
      </button>

      {/* Stats Panel */}
      {isVisible && (
        <div
          id="emergency-stats-panel"
          className="mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-96"
          role="region"
          aria-label="Emergency status"
          data-testid="emergency-stats-panel"
        >
          {/* Active Alerts */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Active Alerts</div>
            {stats.alerts.length > 0 ? (
              <ul className="space-y-2" role="list">
                {stats.alerts.map(alert => (
                  <li 
                    key={alert.id}
                    className="p-2 bg-gray-50 rounded"
                    data-testid={`alert-${alert.id}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs text-white ${
                        getSeverityColor(alert.severity)
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    {alert.location && (
                      <p className="text-xs text-gray-600 mt-1">
                        Location: {alert.location}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No active alerts</p>
            )}
          </div>

          {/* Service Areas */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Service Areas</div>
            <ul className="space-y-2" role="list">
              {stats.serviceAreas.map(area => (
                <li 
                  key={area.name}
                  className="flex items-center justify-between text-sm"
                  data-testid={`service-area-${area.name.toLowerCase()}`}
                >
                  <div className="flex items-center">
                    <span 
                      className={`w-2 h-2 rounded-full mr-2 ${
                        area.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{area.name}</span>
                  </div>
                  <span className="text-gray-500">{area.responseTime}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contact */}
          <div className="text-center mt-4">
            <a
              href={`tel:${stats.emergencyContact}`}
              className={`inline-flex items-center px-4 py-2 rounded ${
                stats.hasCritical
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
              data-testid="emergency-contact-button"
            >
              Call Emergency: {stats.emergencyContact}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
