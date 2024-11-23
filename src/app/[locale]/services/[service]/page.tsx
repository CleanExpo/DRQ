import React from 'react';
import { generateServicePageContent } from '../../../../utils/contentGenerator';
import { getServiceArea, getAllServiceAreas } from '../../../../config/serviceAreas';
import { PageSEO } from '../../../../components/seo/PageSEO';
import { Header } from '../../../../components/layout/Header/Header';
import { Hero } from '../../../../components/layout/Hero/Hero';
import { emergencyContact } from '../../../../config/project.config';
import { 
  Locale, 
  getSupportedLocales, 
  isValidLocale, 
  getAlternateLinks 
} from '../../../../config/i18n.config';

interface ServicePageProps {
  params: {
    service: string;
    locale: string;
  };
}

export async function generateStaticParams() {
  const services = ['water-damage', 'fire-damage', 'mould'];
  const locales = getSupportedLocales();
  const serviceAreas = getAllServiceAreas();
  
  return services.flatMap(service => 
    locales.flatMap(locale => 
      serviceAreas.map(area => ({
        service,
        locale,
        area: area.name.toLowerCase()
      }))
    )
  );
}

export default function ServicePage({ params }: ServicePageProps) {
  const { service, locale: rawLocale } = params;
  const locale = isValidLocale(rawLocale) ? rawLocale : 'en-AU';
  const serviceAreas = getAllServiceAreas();
  
  // Generate content for each service area
  const areaContents = serviceAreas.map(area => {
    const pageContent = generateServicePageContent(
      service,
      area.name,
      area.regions[0].historicalEvents,
      locale
    );
    return {
      area: area.name,
      content: pageContent
    };
  });

  const alternateLanguages = getAlternateLinks(`/services/${service}`);

  return (
    <>
      {areaContents.map(({ area, content: pageContent }) => (
        <div key={area} className="mb-16">
          <PageSEO
            title={pageContent.title}
            description={pageContent.metaDescription}
            canonical={`/services/${service}`}
            servicePage={pageContent}
            location={pageContent.locations[0]}
            alternateLanguages={alternateLanguages}
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
              backgroundImage={pageContent.heroContent.backgroundImage}
              title={pageContent.heroContent.title}
              subtitle={pageContent.heroContent.subtitle}
              emergencyContact={emergencyContact.phone}
              currentLocation={area}
            />

            <section className="py-16 bg-white" id={`service-details-${area.toLowerCase()}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose prose-lg mx-auto">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {pageContent.serviceDetails.description}
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Our Services Include:
                      </h3>
                      <ul className="space-y-2">
                        {pageContent.serviceDetails.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Service Area Coverage
                      </h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-700 mb-4">
                          We provide {pageContent.title} services across {area} including:
                        </p>
                        <ul className="grid grid-cols-2 gap-2">
                          {pageContent.locations[0].serviceArea.slice(0, 6).map((suburb, index) => (
                            <li key={index} className="text-gray-600">
                              {suburb}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      ))}
    </>
  );
}
