import React from 'react';
import { Metadata } from 'next';
import { Hero } from '../../../components/shared/Hero';
import { CallToAction } from '../../../components/shared/CallToAction';
import { ServiceAreas } from '../../../components/shared/ServiceAreas';
import { SchemaProvider } from '../../../components/SchemaProvider';
import { generateOrganizationSchema } from '../../../utils/schema';
import { generateMeta } from '../../../utils/meta';
import { CONTACT } from '../../../constants/contact';

export const metadata: Metadata = generateMeta({
  title: 'About Disaster Recovery QLD | Professional Restoration Services',
  description: 'Learn about Disaster Recovery QLD, your trusted emergency restoration experts in Brisbane. Professional, experienced team providing 24/7 disaster recovery services.',
  path: '/about',
  imageUrl: '/images/about-hero.jpg',
  keywords: [
    'about DRQ',
    'restoration company',
    'disaster recovery experts',
    'professional restoration team',
    'emergency services Brisbane',
    'restoration experience',
    'certified technicians',
    'restoration company history',
    'Brisbane restoration experts',
    'trusted restoration service'
  ]
});

const values = [
  {
    title: "24/7 Availability",
    description: "Always ready to respond to emergencies, day or night"
  },
  {
    title: "Professional Excellence",
    description: "Certified technicians with extensive industry experience"
  },
  {
    title: "Customer Focus",
    description: "Dedicated to exceeding client expectations"
  },
  {
    title: "Advanced Technology",
    description: "Using the latest equipment and techniques"
  },
  {
    title: "Safety First",
    description: "Prioritizing safety in all restoration projects"
  },
  {
    title: "Environmental Responsibility",
    description: "Eco-friendly practices and sustainable solutions"
  }
];

const certifications = [
  {
    title: "IICRC Certified",
    description: "Institute of Inspection Cleaning and Restoration Certification"
  },
  {
    title: "Licensed & Insured",
    description: "Fully licensed restoration contractor in Queensland"
  },
  {
    title: "Work Health & Safety",
    description: "Compliant with Australian safety standards"
  }
];

export default function AboutPage() {
  return (
    <>
      <SchemaProvider 
        schemas={[
          generateOrganizationSchema()
        ]} 
      />
      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <Hero 
          title="About Disaster Recovery QLD"
          description="Your trusted partner in professional restoration services"
          primaryButton={{
            text: "Contact Us",
            href: "/en-AU/contact"
          }}
          secondaryButton={{
            text: "Our Services",
            href: "/en-AU/services"
          }}
        />

        {/* Company Overview */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <p className="text-lg mb-6">
              Disaster Recovery QLD was founded with a mission to provide professional, reliable restoration services to property owners across South East Queensland. With years of experience and a dedicated team of certified technicians, we've become a trusted name in emergency restoration services.
            </p>
            <p className="text-lg">
              Our commitment to excellence, 24/7 availability, and use of advanced restoration techniques has helped countless property owners recover from water damage, fire damage, and other disasters.
            </p>
          </div>
        </section>

        {/* Company Values */}
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <div 
                  key={index}
                  className="text-center p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
                  <p className="text-gray-600">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <p className="text-lg mb-6">
              Available 24/7 for emergency restoration services
            </p>
            <div className="space-y-4">
              <p>
                <strong>Phone:</strong>{' '}
                <a href={`tel:${CONTACT.PHONE}`} className="text-blue-600 hover:text-blue-800">
                  {CONTACT.PHONE}
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${CONTACT.EMAIL}`} className="text-blue-600 hover:text-blue-800">
                  {CONTACT.EMAIL}
                </a>
              </p>
              <p>
                <strong>Address:</strong><br />
                {CONTACT.ADDRESS.STREET}<br />
                {CONTACT.ADDRESS.SUBURB}, {CONTACT.ADDRESS.STATE} {CONTACT.ADDRESS.POSTCODE}
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CallToAction 
          title="Need Emergency Restoration Services?"
          description="Our team is available 24/7 for emergency response across South East Queensland"
          buttonText="Contact Us Now"
          buttonHref="/en-AU/contact"
          showPhoneNumber={true}
          isDark={true}
        />

        {/* Service Areas */}
        <ServiceAreas />
      </div>
    </>
  );
}
