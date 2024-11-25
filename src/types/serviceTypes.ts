export interface EmergencyInfo {
  responseTime: string;
  isAvailable: boolean;
  phone: string;
  emergencyLevel: 'high' | 'medium' | 'low';
}

export interface ServiceCenter {
  lat: number;
  lng: number;
  address: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  suburbs: string[];
  postCodes: string[];
  emergencyInfo: EmergencyInfo;
  serviceCenter: ServiceCenter;
  coverage: {
    primary: string[];
    secondary: string[];
  };
}

export interface ServiceRadiusInfo {
  priority: number;
  standard: number;
  extended: number;
  maxResponse: {
    priority: number;
    standard: number;
    extended: number;
  };
}

export interface ServiceAreaProps {
  areas: ServiceArea[];
  selectedArea?: string;
  onSelect?: (area: string) => void;
  className?: string;
}

export interface ServiceabilityResult {
  isServiceable: boolean;
  estimatedResponse: number;
  distance: number;
  nearestCenter: ServiceCenter;
}

export type ResponseLevel = 'priority' | 'standard' | 'extended' | 'outside';
