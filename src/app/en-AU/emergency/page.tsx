import React from 'react';
import { Metadata } from 'next';
import { CONTACT } from '../../../constants/contact';
import { SERVICES } from '../../../constants/services';
import { SchemaProvider } from '../../../components/SchemaProvider';
import { generateOrganizationSchema, generateServiceSchema } from '../../../utils/schema';
import { generateMeta } from '../../../utils/meta';

export const metadata: Metadata = generateMeta({
  title: '24/7 Emergency Restoration Services Brisbane | Disaster Recovery QLD',
  description: 'Immediate emergency restoration services available 24/7 in Brisbane. Expert response for water damage, fire damage, flood recovery, and more. Call now for rapid emergency assistance.',
  path: '/emergency',
  imageUrl: '/images/emergency-hero.jpg',
  keywords: [
    'emergency restoration',
    '24/7 emergency service',
    'emergency water damage',
    'emergency fire damage',
    'flood emergency',
    'disaster response',
    'emergency cleanup',
    'rapid response',
    'emergency property restoration',
    'urgent restoration service'
  ]
});

export default function EmergencyPage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Schema Provider */}
      <SchemaProvider 
        schemas={[
          generateOrganizationSchema(),
          generateServiceSchema({
            name: 'Emergency Restoration Services',
            description: '24/7 emergency restoration services for water damage, fire damage, and flood recovery',
            href: '/emergency'
          })
        ]} 
      />

      {/* Hero Section */}
      <section className="bg-red-600 text-white px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            24/7 Emergency Service
          </h1>
          <p className="text-xl mb-8">
            Immediate response for all emergency restoration services
          </p>
          <div className="text-3xl font-bold">
            Call Now:{' '}
            <a 
              href={`tel:${CONTACT.PHONE}`} 
              className="hover:underline"
              aria-label="Emergency phone number"
            >
              {CONTACT.PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Emergency Form */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Request Emergency Service</h2>
            <form className="space-y-4" aria-label="Emergency service request form">
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
                <label htmlFor="service" className="block text-gray-700 mb-2">Service Type *</label>
                <select 
                  id="service"
                  className="w-full p-2 border rounded-lg" 
                  required
                  aria-required="true"
                  aria-label="Select emergency service type"
                >
                  <option value="">Select service type</option>
                  {SERVICES.map((service) => (
                    <option key={service.href} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="postcode" className="block text-gray-700 mb-2">Postcode</label>
                <input
                  id="postcode"
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your postcode"
                  aria-label="Your postcode"
                />
              </div>
              <div>
                <label htmlFor="details" className="block text-gray-700 mb-2">Emergency Details *</label>
                <textarea
                  id="details"
                  className="w-full p-2 border rounded-lg h-32"
                  placeholder="Describe your emergency"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                aria-label="Submit emergency service request"
              >
                Submit Emergency Request
              </button>
            </form>
          </div>

          {/* Emergency Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Emergency Response</h2>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-bold text-red-700 mb-2">Call Us First</h3>
                  <p className="text-red-600">
                    For fastest response, call us directly at{' '}
                    <a 
                      href={`tel:${CONTACT.PHONE}`}
                      className="font-bold hover:underline"
                      aria-label="Emergency contact number"
                    >
                      {CONTACT.PHONE}
                    </a>
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-700 mb-2">24/7 Service</h3>
                  <p className="text-blue-600">
                    {CONTACT.HOURS.EMERGENCY}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Emergency Services</h3>
              <ul className="space-y-2" aria-label="Available emergency services">
                {SERVICES.map((service) => (
                  <li key={service.href} className="flex items-center">
                    <span className="mr-2" aria-hidden="true">•</span>
                    {service.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Service Areas</h3>
              <p className="mb-2">We provide 24/7 emergency response across:</p>
              <ul className="space-y-1">
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

      {/* Safety Tips */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Emergency Safety Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Water Damage</h3>
              <ul className="space-y-2">
                <li>• Turn off water supply if possible</li>
                <li>• Switch off electricity in affected areas</li>
                <li>• Move valuable items to higher ground</li>
                <li>• Document damage with photos</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Fire Damage</h3>
              <ul className="space-y-2">
                <li>• Evacuate immediately</li>
                <li>• Call emergency services (000)</li>
                <li>• Do not re-enter the building</li>
                <li>• Wait for professional assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
