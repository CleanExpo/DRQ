import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { services } from '@/config/services';
import { getServiceImages } from '@/utils/pexels';
import { ServiceImage } from '@/components/ServiceImage';

export const metadata: Metadata = {
  title: 'Disaster Recovery QLD | 24/7 Emergency Restoration Services',
  description: 'Professional restoration services in South East Queensland. Water damage, storm damage, flood damage, mould remediation, and sewage cleanup. Available 24/7 for emergencies.',
};

// Revalidate the page every 24 hours
export const revalidate = 86400;

async function getHeroImage() {
  try {
    const images = await getServiceImages('emergency restoration service', 1);
    return images[0];
  } catch (error) {
    console.error('Error fetching hero image:', error);
    return null;
  }
}

export default async function HomePage() {
  const heroImage = await getHeroImage();

  return (
    <main className="min-h-screen">
      {/* Hero Section with improved gradient */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 w-full h-full">
          <ServiceImage
            photo={heroImage}
            alt="Emergency Restoration Services"
            priority={true}
            sizes="100vw"
            className="h-[90vh]"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/75 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
              24/7 Emergency Restoration Services
            </h1>
            <p className="mt-8 text-xl text-gray-100 leading-relaxed drop-shadow">
              Professional restoration services in South East Queensland. Fast response, certified technicians, and comprehensive solutions for all your emergency needs.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="tel:1300309361"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200"
              >
                Emergency Call: 1300 309 361
              </a>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-blue-900 transform hover:scale-105 transition-all duration-200"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with gradient cards */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Our Emergency Services
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Professional restoration services for any emergency situation
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                    {service.name}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {service.shortDescription}
                  </p>
                  <div className="mt-6 flex items-center text-red-600">
                    <span className="font-medium">Learn more</span>
                    <svg
                      className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with gradient cards */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Why Choose Us
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: '24/7 Emergency Response',
                description: 'Available around the clock for any emergency situation',
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Certified Technicians',
                description: 'Highly trained and certified restoration experts',
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: 'Advanced Equipment',
                description: 'Using the latest technology and professional equipment',
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section with gradient badges */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Service Areas
            </h2>
            <p className="mt-6 text-xl text-gray-600">
              Serving South East Queensland with fast, reliable service
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {[
              'Brisbane',
              'Gold Coast',
              'Ipswich',
              'Logan',
              'Redland Shire'
            ].map((area) => (
              <span
                key={area}
                className="inline-flex items-center px-6 py-3 rounded-full text-base font-medium bg-gradient-to-r from-red-50 to-red-100 text-red-800 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with improved gradient */}
      <section className="bg-gradient-to-br from-red-700 via-red-600 to-red-700">
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-white">
              Need Emergency Assistance?
            </h2>
            <p className="mt-6 text-xl text-red-100">
              Our team is available 24/7 for emergency response
            </p>
            <div className="mt-10">
              <a
                href="tel:1300309361"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Call Now: 1300 309 361
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
