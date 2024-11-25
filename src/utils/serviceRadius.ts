import { calculateServiceRadius, SERVICE_RADIUS, checkServiceCoverage } from '../config/serviceAreas';
import type { ServiceabilityResult, ResponseLevel, ServiceCenter } from '../types/serviceTypes';

export const serviceRadiusUtils = {
  async checkAddressServiceability(address: string): Promise<ServiceabilityResult> {
    try {
      // Convert address to coordinates (you'll need to implement geocoding)
      const coordinates = await geocodeAddress(address);
      
      const nearestCenter = checkServiceCoverage.getNearestServiceCenter(
        coordinates.lat,
        coordinates.lng
      );

      return {
        isServiceable: checkServiceCoverage.isInServiceArea(coordinates.lat, coordinates.lng),
        estimatedResponse: nearestCenter.estimatedResponse,
        distance: nearestCenter.distance,
        nearestCenter: nearestCenter.center
      };
    } catch (error) {
      console.error('Error checking address serviceability:', error);
      throw new Error('Unable to verify address serviceability');
    }
  },

  getResponseLevel(distance: number): ResponseLevel {
    if (distance <= SERVICE_RADIUS.priority) return 'priority';
    if (distance <= SERVICE_RADIUS.standard) return 'standard';
    if (distance <= SERVICE_RADIUS.extended) return 'extended';
    return 'outside';
  },

  getEstimatedArrival(distance: number): string {
    const now = new Date();
    const responseTime = checkServiceCoverage.getEstimatedResponse(distance);
    const arrival = new Date(now.getTime() + responseTime * 60000); // Convert minutes to milliseconds
    
    return arrival.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
};

// Placeholder for geocoding service
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  // TODO: Implement actual geocoding service
  // For now, return Brisbane CBD coordinates as example
  return {
    lat: -27.4698,
    lng: 153.0251
  };
}
