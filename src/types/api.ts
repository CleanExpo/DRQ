export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode: number;
  message: string;
}

export interface ServiceArea {
  id: number;
  name: string;
  postcode: string;
  state: string;
  regions?: string[];
  status?: 'active' | 'coming-soon';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  features: string[];
  process: ProcessStep[];
  emergencyInfo: EmergencyInfo;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface EmergencyInfo {
  available: boolean;
  responseTime: string;
  coverage: string;
}

export interface ServiceLocation {
  id: string;
  name: string;
  postcode: string;
  state: string;
  serviceIds: string[];
  status: 'active' | 'coming-soon';
}

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  location: string;
  service?: string;
  message: string;
  emergency: boolean;
}

export interface EmergencyRequest extends ContactRequest {
  priority: 'high' | 'medium' | 'low';
  propertyType: 'residential' | 'commercial';
  damageType: string;
  insuranceCompany?: string;
}
