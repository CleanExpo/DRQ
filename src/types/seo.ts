export interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface ServiceLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ServiceInfo {
  name: string;
  slug: string;
  location: ServiceLocation;
}

export interface PageSEOProps {
  title: string;
  description: string;
  canonical: string;
  url: string;
  locale: string;
  alternateLanguages?: Record<string, string>;
  openGraph?: {
    title: string;
    description: string;
    url: string;
    images: OpenGraphImage[];
  };
  service?: ServiceInfo;
}

export interface SchemaContext {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: any;
}
