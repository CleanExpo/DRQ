import React from 'react';
import { Metadata } from 'next';
import { CONTACT } from '../../../constants/contact';
import { SchemaProvider } from '../../../components/SchemaProvider';
import { generateOrganizationSchema, generateLocalBusinessSchema } from '../../../utils/schema';
import { generateMeta } from '../../../utils/meta';

export const metadata: Metadata = generateMeta({
  title: 'Contact Disaster Recovery QLD | 24/7 Emergency Response',
  description: 'Contact our emergency restoration team available 24/7. Professional disaster recovery services in Brisbane and South East Queensland. Immediate response for water damage, fire damage, and flood recovery.',
  path: '/contact',
  imageUrl: '/images/contact-hero.jpg',
  keywords: [
    'contact DRQ',
    'emergency contact',
    'restoration services contact',
    '24/7 emergency response',
    'disaster recovery contact',
    'Brisbane restoration contact',
    'emergency restoration help',
    'property restoration contact',
    'emergency cleanup contact',
    'Queensland restoration services'
  ]
});

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Schema Provider */}
      <SchemaProvider 
        schemas={[
          generateOrganizationSchema(),
          generateLocalBusinessSchema()
        ]} 
      />

      {/* Hero Section */}
      <section className="bg-blue-900 text-white px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl mb-8">
            Get in touch with our team for professional disaster recovery services
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">Name *</label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your name"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email *</label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your email"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">Phone *</label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your phone number"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">Message *</label>
                <textarea
                  id="message"
                  className="w-full p-2 border rounded-lg h-32"
                  placeholder="Your message"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors"
                aria-label="Send message"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Emergency Response</h3>
                  <p className="text-red-600 font-bold text-xl">
                    <a href={`tel:${CONTACT.PHONE}`} aria-label="Emergency phone number">
                      {CONTACT.PHONE}
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Available 24/7 for emergencies</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <p>
                    <a 
                      href={`mailto:${CONTACT.EMAIL}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {CONTACT.EMAIL}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Location</h3>
                  <address className="not-italic">
                    {CONTACT.ADDRESS.STREET}<br />
                    {CONTACT.ADDRESS.SUBURB}, {CONTACT.ADDRESS.STATE} {CONTACT.ADDRESS.POSTCODE}
                  </address>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Office Hours</h3>
              <p>{CONTACT.HOURS.OFFICE}</p>
              <p className="mt-2 text-red-600 font-semibold">
                {CONTACT.HOURS.EMERGENCY}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Service Areas</h3>
              <p>
                We provide emergency restoration services across South East Queensland, including:
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Brisbane</li>
                <li>• Gold Coast</li>
                <li>• Sunshine Coast</li>
                <li>• Ipswich</li>
                <li>• Logan</li>
                <li>• Redlands</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Location</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            {/* Replace with actual map implementation */}
            <div className="bg-gray-200 w-full h-[400px] flex items-center justify-center">
              <p>Map placeholder - Integration pending</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
