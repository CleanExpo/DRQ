export interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  cta?: {
    text: string;
    link: string;
  };
}

export interface ServiceDetails {
  overview: string;
  features: string[];
  process: {
    title: string;
    steps: string[];
  };
  emergencyResponse: boolean;
}

export interface DisasterEvent {
  date: string;
  type: 'flood' | 'fire' | 'storm';
  description: string;
}

export interface Location {
  name: string;
  slug: string;
  suburbs: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  serviceArea: string[];
  historicalEvents?: DisasterEvent[];
}

export interface ServicePage {
  slug: string;
  title: string;
  metaDescription: string;
  heroContent: HeroContent;
  serviceDetails: ServiceDetails;
  locations: Location[];
}
