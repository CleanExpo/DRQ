import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { serviceAreas, SERVICE_RADIUS } from "../../config/serviceAreas"

interface ServiceRadiusMapProps {
  selectedAreaId?: string;
  className?: string;
}

export function ServiceRadiusMap({ selectedAreaId, className }: ServiceRadiusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [circles, setCircles] = useState<google.maps.Circle[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const selectedArea = serviceAreas.find(area => area.id === selectedAreaId);
    const center = selectedArea 
      ? { lat: selectedArea.serviceCenter.lat, lng: selectedArea.serviceCenter.lng }
      : { lat: -27.4698, lng: 153.0251 }; // Brisbane CBD default

    const newMap = new google.maps.Map(mapRef.current, {
      center,
      zoom: 11,
      styles: [/* Add custom map styles here */],
      disableDefaultUI: true,
      zoomControl: true
    });

    setMap(newMap);

    return () => {
      circles.forEach(circle => circle.setMap(null));
    };
  }, [mapRef]);

  useEffect(() => {
    if (!map) return;

    // Clear existing circles
    circles.forEach(circle => circle.setMap(null));
    
    const selectedArea = serviceAreas.find(area => area.id === selectedAreaId);
    if (!selectedArea) return;

    const center = { 
      lat: selectedArea.serviceCenter.lat, 
      lng: selectedArea.serviceCenter.lng 
    };

    const newCircles = [
      new google.maps.Circle({
        map,
        center,
        radius: SERVICE_RADIUS.priority * 1000, // Convert to meters
        fillColor: '#ef4444',
        fillOpacity: 0.1,
        strokeColor: '#ef4444',
        strokeOpacity: 0.8,
        strokeWeight: 1
      }),
      new google.maps.Circle({
        map,
        center,
        radius: SERVICE_RADIUS.standard * 1000,
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.8,
        strokeWeight: 1
      }),
      new google.maps.Circle({
        map,
        center,
        radius: SERVICE_RADIUS.extended * 1000,
        fillColor: '#6b7280',
        fillOpacity: 0.1,
        strokeColor: '#6b7280',
        strokeOpacity: 0.8,
        strokeWeight: 1
      })
    ];

    setCircles(newCircles);
    map.setCenter(center);
  }, [map, selectedAreaId]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Service Coverage
          {selectedAreaId && (
            <Badge variant="outline">
              {serviceAreas.find(area => area.id === selectedAreaId)?.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-[400px] rounded-md"
          style={{ minHeight: '400px' }}
        />
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">Priority ({SERVICE_RADIUS.priority}km)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Standard ({SERVICE_RADIUS.standard}km)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm">Extended ({SERVICE_RADIUS.extended}km)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
