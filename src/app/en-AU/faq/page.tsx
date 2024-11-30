import React from 'react';
import { Metadata } from 'next';
import { CONTACT } from '../../../constants/contact';
import { SchemaProvider } from '../../../components/SchemaProvider';
import { generateOrganizationSchema, generateFAQSchema } from '../../../utils/schema';
import { generateMeta } from '../../../utils/meta';

export const metadata: Metadata = generateMeta({
  title: 'Frequently Asked Questions | Disaster Recovery QLD',
  description: 'Find answers to common questions about our restoration services, emergency response, insurance claims, and more. Professional disaster recovery services in Brisbane.',
  path: '/faq',
  imageUrl: '/images/faq-hero.jpg',
  keywords: [
    'restoration FAQ',
    'disaster recovery questions',
    'emergency service FAQ',
    'water damage FAQ',
    'fire damage FAQ',
    'insurance claims FAQ',
    'restoration process',
    'service coverage',
    'emergency response time',
    'restoration costs'
  ]
});

const faqs = [
  {
    question: "How quickly can you respond to emergencies?",
    answer: "We provide 24/7 emergency response with typical arrival times of 1-2 hours in the Brisbane area. Our team is always ready to respond to urgent situations."
  },
  {
    question: "What areas do you service?",
    answer: "We service Brisbane, Gold Coast, Sunshine Coast, Ipswich, Logan, and surrounding areas in South East Queensland. Contact us to confirm service availability in your area."
  },
  {
    question: "Do you work with insurance companies?",
    answer: "Yes, we work directly with all major insurance companies and can assist with claim documentation, assessment, and processing. We have extensive experience in insurance claim work."
  },
  {
    question: "What types of emergencies do you handle?",
    answer: "We handle water damage, flood recovery, fire damage, mould remediation, sewage cleanup, and commercial restoration services. Our team is equipped to handle various disaster scenarios."
  },
  {
    question: "How much do your services cost?",
    answer: "Costs vary based on the type and extent of damage. We provide detailed quotes after assessment. For insurance work, we can often bill insurance companies directly."
  },
  {
    question: "What should I do in an emergency?",
    answer: "First, ensure everyone's safety and call emergency services if needed. Then contact us immediately at " + CONTACT.PHONE + " for professional restoration services."
  },
  {
    question: "Are your technicians certified?",
    answer: "Yes, our technicians are fully certified and trained in the latest restoration techniques. We maintain all required licenses and certifications."
  },
  {
    question: "Do you provide warranties?",
    answer: "Yes, our services come with guarantees that cannot be excluded under Australian Consumer Law. We stand behind the quality of our work."
  }
];

export default function FAQPage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Schema Provider */}
      <SchemaProvider 
        schemas={[
          generateOrganizationSchema(),
          generateFAQSchema(faqs)
        ]} 
      />

      {/* Hero Section */}
      <section className="bg-blue-900 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-lg">
            Find answers to common questions about our restoration services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h2 
                className="text-xl font-semibold mb-4"
                itemProp="name"
              >
                {faq.question}
              </h2>
              <div
                className="text-gray-600"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div itemProp="text">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="mb-8">
            Contact our team for immediate assistance
          </p>
          <div className="space-y-4">
            <div>
              <p className="font-bold text-xl">
                Call us 24/7 at{' '}
                <a 
                  href={`tel:${CONTACT.PHONE}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {CONTACT.PHONE}
                </a>
              </p>
            </div>
            <div className="space-x-4">
              <a
                href="/en-AU/contact"
                className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/en-AU/emergency"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Emergency Service
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
