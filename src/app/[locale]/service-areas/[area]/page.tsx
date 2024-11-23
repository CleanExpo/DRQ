'use client';

import React from 'react';
import { getServiceArea, serviceAreas, getAllServiceAreas } from '../../../../config/serviceAreas';
import { PageSEO } from '../../../../components/seo/PageSEO';
import { Header } from '../../../../components/layout/Header/Header';
import { Hero } from '../../../../components/layout/Hero/Hero';
import { ServicesHighlight } from '../../../../components/sections/ServicesHighlight/ServicesHighlight';
import { emergencyContact, siteMetadata } from '../../../../config/project.config';
import { 
  Locale, 
  getSupportedLocales, 
  isValidLocale, 
  getAlternateLinks 
} from '../../../../config/i18n.config';

interface LocationPageProps {
  params: {
    area: string;
    locale: string;
  };
}

const locationBackgrounds = {
  brisbane: '/images/locations/brisbane-hero.jpg',
  'gold-coast': '/images/locations/gold-coast-hero.jpg',
  'sunshine-coast': '/images/locations/sunshine-coast-hero.jpg',
  cairns: '/images/locations/cairns-hero.jpg'
} as const;

export async function generateStaticParams() {
  const areas = getAllServiceAreas();
  const locales = getSupportedLocales();

  return areas.flatMap(area => 
    locales.map(locale => ({
      area: area.slug,
      locale
    }))
  );
}

export default function LocationPage({ params }: LocationPageProps) {
  const { area, locale: rawLocale } = params;
  const locale = isValidLocale(rawLocale) ? rawLocale : 'en-AU';
  const serviceArea = getServiceArea(area);

  if (!serviceArea) {
    return null; // Will be caught by not-found.tsx
  }

  const heroContent = {
    title: `Emergency Restoration Services in ${serviceArea.name}`,
    subtitle: `24/7 Professional Disaster Recovery Services in ${serviceArea.name} and Surrounding Areas`,
    backgroundImage: locationBackgrounds[area as keyof typeof locationBackgrounds] || locationBackgrounds.brisbane
  };

  const alternateLanguages = getAlternateLinks(`/service-areas/${area}`);

  return (
    <>
      <PageSEO
        title={`Emergency Restoration Services in ${serviceArea.name} | Disaster Recovery QLD`}
        description={`24/7 professional disaster recovery and restoration services in ${serviceArea.name}. Water damage, fire damage, and mould remediation. Response time: ${serviceArea.serviceAvailability.responseTime.emergency}.`}
        canonical={`/service-areas/${area}`}
        alternateLanguages={alternateLanguages}
        pageType="location"
        location={{
          name: serviceArea.name,
          slug: serviceArea.slug,
          coordinates: serviceArea.coordinates,
          serviceArea: serviceArea.regions.flatMap(r => r.suburbs)
        }}
      />

      <Header
        currentLanguage={locale}
        availableLanguages={getSupportedLocales()}
        emergency={{
          phone: emergencyContact.phone,
          available: emergencyContact.available
        }}
      />

      <main className="pt-16">
        <Hero
          backgroundImage={heroContent.backgroundImage}
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          emergencyContact={emergencyContact.phone}
          currentLocation={serviceArea.name}
        />

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg mx-auto">
              {/* Emergency Response Info */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-12" data-testid="emergency-response-section">
                <h2 className="text-2xl font-bold text-red-700 mb-4">
                  Emergency Response Times
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-red-600">Emergency Service</h3>
                    <p className="text-red-700">{serviceArea.serviceAvailability.responseTime.emergency}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-600">Standard Service</h3>
                    <p className="text-red-700">{serviceArea.serviceAvailability.responseTime.standard}</p>
                  </div>
                </div>
              </div>

              {/* Primary Hazards */}
              {serviceArea.primaryHazards && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-12" data-testid="hazards-section">
                  <h2 className="text-2xl font-bold text-yellow-700 mb-4">
                    Common Hazards in {serviceArea.name}
                  </h2>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {serviceArea.primaryHazards.map((hazard, index) => (
                      <li key={index} className="flex items-center text-yellow-700">
                        <span className="mr-2">⚠️</span>
                        {hazard.charAt(0).toUpperCase() + hazard.slice(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Service Areas */}
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Service Areas in {serviceArea.name}
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {serviceArea.regions.map((region, regionIndex) => (
                  <div key={region.name} className="bg-gray-50 p-6 rounded-lg" data-testid={`region-${regionIndex}`}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {region.name}
                    </h3>
                    
                    {/* Primary Services */}
                    {region.primaryServices && (
                      <div className="mb-6" data-testid={`primary-services-${regionIndex}`}>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                          Primary Services
                        </h4>
                        <ul className="grid grid-cols-2 gap-2">
                          {region.primaryServices.map((service, index) => (
                            <li key={index} className="text-gray-600">
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Response Times */}
                    {region.responseTimesByService && (
                      <div className="mb-6" data-testid={`response-times-${regionIndex}`}>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                          Service Response Times
                        </h4>
                        <ul className="space-y-2">
                          {Object.entries(region.responseTimesByService).map(([service, time]) => (
                            <li key={service} className="text-gray-600">
                              {service}: <span className="font-medium">{time}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suburbs */}
                    <div className="mb-6" data-testid={`suburbs-${regionIndex}`}>
                      <h4 className="text-lg font-medium text-gray-700 mb-2">
                        Serving the following suburbs:
                      </h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {region.suburbs.map((suburb, index) => (
                          <li key={index} className="text-gray-600">
                            {suburb}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Historical Events */}
                    {region.historicalEvents && region.historicalEvents.length > 0 && (
                      <div className="mt-4" data-testid={`historical-events-${regionIndex}`}>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                          Recent Events
                        </h4>
                        <ul className="space-y-2">
                          {region.historicalEvents.map((event, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              <span className="font-medium">
                                {new Date(event.date).toLocaleDateString(locale)}
                              </span>
                              : {event.description}
                              <span className="ml-2 text-xs text-gray-500">
                                (Severity: {event.severity}/5)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Our Services in {serviceArea.name}
                </h2>
                <ServicesHighlight locale={locale} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
