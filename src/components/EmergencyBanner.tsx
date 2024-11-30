'use client';

import { useState, useEffect } from 'react';
import { useEmergency } from '../hooks/useEmergency';
import { EmergencySeverity } from '../services/types/IEmergencyService';
import { Phone, AlertTriangle, X, MapPin, Clock } from 'lucide-react';

export default function EmergencyBanner() {
  const {
    alerts,
    hasCritical,
    emergencyContact,
    loading,
    error
  } = useEmergency();

  const [isExpanded, setIsExpanded] = useState(hasCritical);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  // Auto-rotate through alerts
  useEffect(() => {
    if (alerts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAlertIndex(current => 
        current === alerts.length - 1 ? 0 : current + 1
      );
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [alerts.length]);

  if (loading) {
    return (
      <div 
        data-testid="loading-skeleton"
        className="h-12 bg-gray-100 animate-pulse" 
      />
    );
  }

  if (error || alerts.length === 0) {
    return null;
  }

  const getSeverityStyles = (severity: EmergencySeverity) => {
    switch (severity) {
      case EmergencySeverity.CRITICAL:
        return 'bg-red-600 text-white hover:bg-red-700';
      case EmergencySeverity.HIGH:
        return 'bg-orange-500 text-white hover:bg-orange-600';
      case EmergencySeverity.MEDIUM:
        return 'bg-yellow-500 text-black hover:bg-yellow-600';
      case EmergencySeverity.LOW:
        return 'bg-blue-500 text-white hover:bg-blue-600';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const currentAlert = alerts[currentAlertIndex];

  return (
    <div 
      data-testid="emergency-banner"
      className={`transition-all duration-300 ${getSeverityStyles(currentAlert.severity)}`}
    >
      {/* Collapsed View */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium" data-testid="alert-message">
              {currentAlert.message}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`tel:${emergencyContact}`}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              data-testid="contact-number"
            >
              <Phone className="w-4 h-4" />
              <span className="font-bold">{emergencyContact}</span>
            </a>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:opacity-80 transition-opacity"
              aria-label={isExpanded ? 'Show less' : 'Show more'}
              data-testid="toggle-expand"
            >
              {isExpanded ? (
                <X className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="pb-4 space-y-4" data-testid="expanded-content">
            {/* Alert Details */}
            <div className="bg-black/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Emergency Alert Details:</h3>
              <div className="space-y-2">
                {currentAlert.location && (
                  <div className="flex items-center space-x-2" data-testid="alert-location">
                    <MapPin className="w-4 h-4" />
                    <span>{currentAlert.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2" data-testid="alert-timestamp">
                  <Clock className="w-4 h-4" />
                  <span>
                    Posted: {new Date(currentAlert.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Alert Navigation */}
            {alerts.length > 1 && (
              <div className="flex justify-center space-x-2" data-testid="alert-navigation">
                {alerts.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all
                      ${index === currentAlertIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'}`}
                    onClick={() => setCurrentAlertIndex(index)}
                    aria-label={`View alert ${index + 1}`}
                    data-testid={`alert-indicator-${index}`}
                  />
                ))}
              </div>
            )}

            {/* Emergency Contact Button */}
            <div className="text-center">
              <a
                href={`tel:${emergencyContact}`}
                className="inline-flex items-center space-x-2 bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                data-testid="emergency-call-button"
              >
                <Phone className="w-5 h-5" />
                <span>Call Emergency Response</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
