import { Service } from '../constants/services';
import { ServiceArea as ImportedServiceArea } from '../constants/areas';

// Re-export ServiceArea type
export type ServiceArea = ImportedServiceArea;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: Service['name'];
  serviceType?: string;
  postcode?: string;
  preferredContact?: 'email' | 'phone';
  urgency?: 'low' | 'medium' | 'high';
  isEmergency?: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email?: string;
  service: Service['name'];
  postcode?: string;
  details?: string;
}

export interface ServiceResponse {
  name: Service['name'];
  href: string;
  description: string;
  features: string[];
  process: {
    step: number;
    title: string;
    description: string;
  }[];
  emergencyInfo: {
    available: boolean;
    responseTime: string;
    coverage: string;
  };
}

export interface AreaResponse {
  name: ServiceArea;
  postcodes: [string, string];
  services: Service['name'][];
  emergencyResponse: {
    available: boolean;
    responseTime: string;
  };
  coverage: {
    residential: boolean;
    commercial: boolean;
    industrial: boolean;
  };
}

export interface PostcodeCheckResponse {
  postcode: string;
  isServiced: boolean;
  areas: ServiceArea[];
}

export interface EmergencyResponse {
  success: boolean;
  message: string;
  requestId: string;
  responseTime: string;
  contact: {
    phone: string;
    email: string;
  };
  nextSteps: string[];
}
