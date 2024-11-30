import React from 'react';
import { Metadata } from 'next';
import { ServiceAreas } from '../../../../components/shared/ServiceAreas';
import { Hero } from '../../../../components/shared/Hero';
import { CallToAction } from '../../../../components/shared/CallToAction';
import { ProcessSteps } from '../../../../components/shared/ProcessSteps';
import { ServicesOverview } from '../../../../components/shared/ServicesOverview';
import { FAQ, FAQItem } from '../../../../components/shared/FAQ';
import { SchemaProvider } from '../../../../components/SchemaProvider';
import { generateServiceSchema, generateBreadcrumbSchema, generateFAQSchema } from '../../../../utils/schema';
import { generateServiceMeta } from '../../../../utils/meta';
import { SERVICES } from '../../../../constants/services';

const floodRecoveryService = SERVICES.find(s => s.name === 'Flood Recovery')!;

export const metadata: Metadata = generateServiceMeta({
  title: 'Flood Recovery & Cleanup Services Brisbane | Disaster Recovery QLD',
  description: 'Expert flood recovery and cleanup services available 24/7. Professional flood damage restoration, water extraction, and property rehabilitation in Brisbane and surrounding areas.',
  path: floodRecoveryService.href,
  imageUrl: '/images/services/flood-recovery.jpg',
  keywords: [
    'flood recovery',
    'flood cleanup',
    'flood damage restoration',
    'flood water removal',
    'property rehabilitation',
    'flood damage repair',
    'flood emergency response',
    'flood damage assessment',
    'flood restoration Brisbane',
    'flood cleanup Queensland'
  ]
});

const services = [
  {
    title: "Emergency Flood Response",
    description: "Rapid response flood water extraction and damage control"
  },
  {
    title: "Property Assessment",
    description: "Comprehensive flood damage assessment and documentation"
  },
  {
    title: "Water Extraction",
    description: "Industrial-grade equipment for efficient water removal"
  },
  {
    title: "Sanitization",
    description: "Professional cleaning and disinfection of affected areas"
  },
  {
    title: "Content Recovery",
    description: "Salvage and restoration of flood-damaged belongings"
  },
  {
    title: "Structural Rehabilitation",
    description: "Complete structural drying and restoration services"
  }
];

const steps = [
  {
    step: "1",
    title: "Emergency Response",
    description: "Immediate response to minimize flood damage"
  },
  {
    step: "2",
    title: "Water Removal",
    description: "Professional flood water extraction"
  },
  {
    step: "3",
    title: "Drying & Dehumidification",
    description: "Complete structural drying process"
  },
  {
    step: "4",
    title: "Restoration",
    description: "Property rehabilitation and repairs"
  }
];

const faqs: FAQItem[] = [
  {
    question: "How quickly can you respond to flood emergencies?",
    answer: "We provide 24/7 emergency flood response with typical arrival times of 1-2 hours in the Brisbane area."
  },
  {
    question: "What should I do while waiting for flood recovery services?",
    answer: "If safe, turn off electricity, move valuable items to higher ground, and document damage with photos. Do not enter deeply flooded areas."
  },
  {
    question: "Do you handle insurance claims for flood damage?",
    answer: "Yes, we work directly with all major insurance companies and can assist with flood damage claim documentation and processing."
  },
  {
    question: "How long does flood recovery typically take?",
    answer: "Recovery time varies based on flood severity, typically 5-7 days for moderate flooding and 2-4 weeks for severe cases."
  }
];

export default function FloodRecoveryPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Flood Recovery', url: floodRecoveryService.href }
  ];

  return (
    <>
      <SchemaProvider 
        schemas={[
          generateServiceSchema(floodRecoveryService),
          generateBreadcrumbSchema(breadcrumbs),
          generateFAQSchema(faqs)
        ]} 
      />
      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <Hero 
          title="Professional Flood Recovery Services"
          description="Expert flood damage restoration and cleanup services for residential and commercial properties"
          primaryButton={{
            text: "Get Emergency Help",
            href: "/en-AU/contact"
          }}
          secondaryButton={{
            text: "Contact Us",
            href: "/en-AU/contact"
          }}
        />

        {/* Services Overview */}
        <ServicesOverview 
          title="Our Flood Recovery Services"
          services={services}
        />

        {/* Process Section */}
        <ProcessSteps 
          title="Our Recovery Process"
          steps={steps}
        />

        {/* FAQ Section */}
        <FAQ 
          title="Common Questions About Flood Recovery"
          faqs={faqs}
        />

        {/* Call to Action */}
        <CallToAction 
          title="Need Emergency Flood Recovery?"
          description="Our team is available 24/7 for emergency flood response across South East Queensland"
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
