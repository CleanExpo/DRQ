import { BaseDocument } from '@/services/database';

export interface Service extends BaseDocument {
  title: string;
  slug: string;
  description: string;
  content: string;
  active: boolean;
  order: number;
}

export interface User extends BaseDocument {
  email: string;
  name: string;
  role: 'admin' | 'user';
  active: boolean;
}

export interface Enquiry extends BaseDocument {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'inProgress' | 'completed';
  postcode: string;
}

export interface ServiceArea extends BaseDocument {
  postcode: string;
  suburb: string;
  state: string;
  active: boolean;
  services: string[]; // Array of service slugs
}

export interface Contact extends BaseDocument {
  type: 'phone' | 'email' | 'address';
  value: string;
  description?: string;
  active: boolean;
}

export interface SiteConfig extends BaseDocument {
  key: string;
  value: any;
  description?: string;
  lastUpdated: Date;
}

// Collection names as constants to avoid typos
export const COLLECTIONS = {
  USERS: 'users',
  SERVICES: 'services',
  ENQUIRIES: 'enquiries',
  SERVICE_AREAS: 'serviceAreas',
  CONTACTS: 'contacts',
  SITE_CONFIG: 'siteConfig',
} as const;

// Type for collection names
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// Input types for creation
export type CreateServiceInput = Pick<Service, 'title' | 'slug' | 'description' | 'content'> & {
  active?: boolean;
  order?: number;
};
