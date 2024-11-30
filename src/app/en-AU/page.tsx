import React from 'react';
import { Metadata } from 'next';
import { ServiceAreas } from '../../components/shared/ServiceAreas';
import { Hero } from '../../components/shared/Hero';
import { CallToAction } from '../../components/shared/CallToAction';
import { ServicesOverview } from '../../components/shared/ServicesOverview';
import { SchemaProvider } from '../../components/SchemaProvider';
import { generateOrganizationSchema, generateLocalBusinessSchema } from '../../utils/schema';
import { generateMeta } from '../../utils/meta';

export const metadata: Metadata = generateMeta({
  title: 'Disaster Recovery QLD | 24/7 Emergency Restoration Services Brisbane',
  description: 'Professional emergency restoration services in Brisbane & South East Queensland. Expert water damage, flood recovery, fire damage, and mould remediation services available 24/7.',
  path: '',
  imageUrl: '/images/hero-home.jpg',
  keywords: [
    'disaster recovery',
    'emergency restoration',
    'water damage restoration',
    'flood recovery',
    'fire damage restoration',
    'mould remediation',
    'sewage cleanup',
    'commercial restoration',
    'property restoration Brisbane',
    'emergency services Queensland',
    '24/7 emergency response',
    'professional restoration services'
  ]
});

const emergencyServices = [
  {
    title: "Water Damage",
    description: "24/7 emergency water damage restoration services for homes and businesses",
    icon: "💧"
  },
  {
    title: "Flood Recovery",
    description: "Professional flood cleanup and property restoration services",
    icon: "🌊"
  },
  {
    title: "Mould Remediation",
    description: "Expert mould detection and removal services",
    icon: "🏠"
  },
  {
    title: "Fire Damage",
    description: "Comprehensive fire and smoke damage restoration",
    icon: "🔥"
  }
];

export default function Home() {
  return (
    <>
      <SchemaProvider 
        schemas={[
          generateOrganizationSchema(),
          generateLocalBusinessSchema()
        ]} 
      />
      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <Hero 
          title="24/7 Emergency Disaster Recovery Services"
          description="Professional water damage restoration services across South East Queensland"
          primaryButton={{
            text: "Emergency Service",
            href: "/en-AU/emergency"
          }}
          secondaryButton={{
            text: "Contact Us",
            href: "/en-AU/contact"
          }}
        />

        {/* Services Section */}
        <ServicesOverview 
          title="Our Emergency Services"
          services={emergencyServices}
          columns={4}
        />

        {/* Call to Action */}
        <CallToAction 
          title="Need Emergency Assistance?"
          description="Our team is available 24/7 for emergency response across South East Queensland"
          buttonText="Contact Us Now"
          buttonHref="/en-AU/contact"
          showPhoneNumber={true}
          isDark={false}
        />

        {/* Service Areas */}
        <ServiceAreas />

        {/* Trust Indicators */}
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">24/7 Emergency Response</h3>
                <p className="text-gray-600">Immediate response when you need it most</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Professional Expertise</h3>
                <p className="text-gray-600">Certified technicians and industry-leading equipment</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">Guaranteed Results</h3>
                <p className="text-gray-600">Satisfaction guaranteed on all our services</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
