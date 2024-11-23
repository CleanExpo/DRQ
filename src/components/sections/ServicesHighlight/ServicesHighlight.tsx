'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '../../../config/i18n.config';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  features: string[];
}

interface ServicesHighlightProps {
  locale: Locale;
}

interface LocaleContent {
  title: string;
  subtitle: string;
  learnMore: string;
  services: Service[];
}

type TranslationsType = {
  [K in Locale]?: LocaleContent;
};

const defaultContent: LocaleContent = {
  title: 'Our Emergency Services',
  subtitle: 'Professional disaster recovery services available 24/7 across Queensland. Fast response times and expert solutions for any emergency.',
  learnMore: 'Learn More',
  services: [
    {
      id: 'water-damage',
      title: 'Water Damage Restoration',
      description: '24/7 emergency water damage restoration services. Fast response to minimize damage and prevent mould growth.',
      icon: '/icons/water-damage.svg',
      color: '#4285F4',
      path: '/services/water-damage',
      features: [
        'Emergency Water Extraction',
        'Flood Damage Restoration',
        'Moisture Detection & Removal',
        'Structural Drying'
      ]
    },
    {
      id: 'fire-damage',
      title: 'Fire Damage Recovery',
      description: 'Professional fire and smoke damage restoration services. Comprehensive cleanup and restoration solutions.',
      icon: '/icons/fire-damage.svg',
      color: '#EA4335',
      path: '/services/fire-damage',
      features: [
        'Fire Damage Restoration',
        'Smoke Damage Cleanup',
        'Odor Removal',
        'Content Restoration'
      ]
    },
    {
      id: 'mould',
      title: 'Mould Remediation',
      description: 'Expert mould detection and removal services. Prevent health risks and protect your property.',
      icon: '/icons/mould.svg',
      color: '#34A853',
      path: '/services/mould-remediation',
      features: [
        'Mould Inspection',
        'Safe Mould Removal',
        'Prevention Strategies',
        'Air Quality Testing'
      ]
    }
  ]
};

const translations: TranslationsType = {
  'en-AU': defaultContent,
  // Add other language translations here
};

interface ServiceCardProps {
  service: Service;
  learnMoreText: string;
  locale: Locale;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, learnMoreText, locale }) => (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-transform hover:scale-105">
    <div 
      className="h-2" 
      style={{ backgroundColor: service.color }} 
    />
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 mr-4">
          <Image
            src={service.icon}
            alt={service.title}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {service.title}
        </h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        {service.description}
      </p>
      
      <ul className="space-y-2 mb-6">
        {service.features.map((feature, index) => (
          <li 
            key={index}
            className="flex items-center text-gray-700"
          >
            <svg 
              className="w-4 h-4 mr-2 text-green-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      
      <a
        href={`/${locale}${service.path}`}
        className="inline-block w-full text-center py-3 px-6 rounded-md text-white font-medium transition-colors duration-300 hover:opacity-90"
        style={{ backgroundColor: service.color }}
      >
        {learnMoreText}
      </a>
    </div>
  </div>
);

export const ServicesHighlight: React.FC<ServicesHighlightProps> = ({ locale }) => {
  const content = translations[locale] || translations['en-AU'] || defaultContent;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              learnMoreText={content.learnMore}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlight;
