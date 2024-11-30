'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Marker {
  position: Coordinates;
  title: string;
  type: 'office' | 'emergency' | 'service';
}

interface RegionMapProps {
  center: Coordinates;
  radius: number;
  markers?: Marker[];
  zoom?: number;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['geometry', 'places']
});

export default function RegionMap({ 
  center, 
  radius, 
  markers = [], 
  zoom = 11 
}: RegionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is missing');
      setError('Map configuration error');
      return;
    }

    loader.load().then((google) => {
      try {
        const mapInstance = new google.maps.Map(mapRef.current!, {
          center,
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        setMap(mapInstance);

        // Create coverage circle
        const coverageCircle = new google.maps.Circle({
          strokeColor: '#1E40AF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
          map: mapInstance,
          center,
          radius: radius * 1000, // Convert km to meters
          clickable: false
        });

        setCircle(coverageCircle);

        // Add markers
        const newMarkers = markers.map(marker => {
          const icon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: marker.type === 'office' ? '#1E40AF' : '#DC2626',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 10
          };

          return new google.maps.Marker({
            position: marker.position,
            map: mapInstance,
            title: marker.title,
            icon,
            animation: google.maps.Animation.DROP
          });
        });

        setMapMarkers(newMarkers);

        // Add click listeners to markers
        newMarkers.forEach((mapMarker, index) => {
          const marker = markers[index];
          mapMarker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-bold">${marker.title}</h3>
                  ${marker.type === 'office' 
                    ? '<p class="text-sm text-gray-600">Main Service Center</p>'
                    : '<p class="text-sm text-red-600">Emergency Response Location</p>'
                  }
                </div>
              `
            });
            infoWindow.open(mapInstance, mapMarker);
          });
        });
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to load map');
      }
    }).catch((err) => {
      console.error('Failed to load Google Maps:', err);
      setError('Failed to load map service');
    });

    return () => {
      // Cleanup markers
      mapMarkers.forEach(marker => marker.setMap(null));
      if (circle) circle.setMap(null);
    };
  }, [center, radius, markers, zoom]);

  // Update circle when radius changes
  useEffect(() => {
    if (circle) {
      circle.setRadius(radius * 1000);
    }
  }, [radius, circle]);

  // Update markers when they change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));

    // Add new markers
    const newMarkers = markers.map(marker => {
      const icon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: marker.type === 'office' ? '#1E40AF' : '#DC2626',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
        scale: 10
      };

      return new google.maps.Marker({
        position: marker.position,
        map,
        title: marker.title,
        icon,
        animation: google.maps.Animation.DROP
      });
    });

    setMapMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, markers]);

  if (error) {
    return (
      <div 
        className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center"
        role="alert"
        aria-label="Map error"
      >
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      role="region"
      aria-label="Service area map"
      data-testid="region-map"
    >
      {/* Loading State */}
      {!map && (
        <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
      )}
    </div>
  );
}
