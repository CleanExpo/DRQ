export interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface ServiceDetails {
  description: string;
  features: string[];
  emergencyResponse: boolean;
}

export interface ServicePage {
  slug: string;
  title: string;
  metaDescription: string;
  heroContent: HeroContent;
  serviceDetails: ServiceDetails;
  locations: Location[];
}

export interface Location {
  name: string;
  slug: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  serviceArea: string[];
  historicalEvents?: DisasterEvent[];
}

export interface DisasterEvent {
  date: string;
  type: string;
  description: string;
  severity: number;
}
