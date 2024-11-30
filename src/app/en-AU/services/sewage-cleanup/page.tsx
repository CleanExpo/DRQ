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

const sewageService = SERVICES.find(s => s.name === 'Sewage Cleanup')!;

export const metadata: Metadata = generateServiceMeta({
  title: 'Professional Sewage Cleanup Services Brisbane | Disaster Recovery QLD',
  description: 'Expert sewage cleanup and sanitization services available 24/7. Professional sewage removal, decontamination, and property restoration in Brisbane and surrounding areas.',
  path: sewageService.href,
  imageUrl: '/images/services/sewage-cleanup.jpg',
  keywords: [
    'sewage cleanup',
    'sewage removal',
    'sewage decontamination',
    'sewage sanitization',
    'sewage damage cleanup',
    'emergency sewage services',
    'sewage backup cleanup',
    'biohazard cleanup',
    'sewage restoration Brisbane',
    'professional sewage removal'
  ]
});

const services = [
  {
    title: "Emergency Response",
    description: "Rapid response sewage cleanup and containment"
  },
  {
    title: "Sewage Removal",
    description: "Safe and thorough sewage water extraction"
  },
  {
    title: "Sanitization",
    description: "Professional-grade disinfection and decontamination"
  },
  {
    title: "Odour Treatment",
    description: "Complete odour elimination and air purification"
  },
  {
    title: "Property Protection",
    description: "Prevention of structural damage and cross-contamination"
  },
  {
    title: "Health Safety",
    description: "Compliance with health and safety regulations"
  }
];

const steps = [
  {
    step: "1",
    title: "Assessment",
    description: "Emergency evaluation and safety protocols"
  },
  {
    step: "2",
    title: "Containment",
    description: "Sewage containment and area securing"
  },
  {
    step: "3",
    title: "Removal",
    description: "Professional sewage extraction and cleanup"
  },
  {
    step: "4",
    title: "Sanitization",
    description: "Complete disinfection and restoration"
  }
];

const faqs: FAQItem[] = [
  {
    question: "How quickly can you respond to sewage emergencies?",
    answer: "We provide 24/7 emergency response with typical arrival times of 1-2 hours in the Brisbane area. Immediate response is crucial for health and safety."
  },
  {
    question: "Is sewage cleanup dangerous?",
    answer: "Yes, sewage cleanup can be hazardous due to harmful bacteria and pathogens. Our professionals use proper safety equipment and follow strict protocols to ensure safe cleanup."
  },
  {
    question: "What health risks are associated with sewage?",
    answer: "Sewage can contain harmful bacteria, viruses, and other pathogens that can cause serious illness. Professional cleanup is essential to ensure proper sanitization."
  },
  {
    question: "How long does sewage cleanup take?",
    answer: "The timeline varies based on contamination extent, typically 2-4 days for standard cleanup and up to a week for severe cases requiring extensive sanitization."
  }
];

export default function SewageCleanupPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Sewage Cleanup', url: sewageService.href }
  ];

  return (
    <>
      <SchemaProvider 
        schemas={[
          generateServiceSchema(sewageService),
          generateBreadcrumbSchema(breadcrumbs),
          generateFAQSchema(faqs)
        ]} 
      />
      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <Hero 
          title="Professional Sewage Cleanup Services"
          description="Expert sewage cleanup and sanitization services for safe property restoration"
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
          title="Our Sewage Cleanup Services"
          services={services}
        />

        {/* Process Section */}
        <ProcessSteps 
          title="Our Cleanup Process"
          steps={steps}
        />

        {/* FAQ Section */}
        <FAQ 
          title="Common Questions About Sewage Cleanup"
          faqs={faqs}
        />

        {/* Call to Action */}
        <CallToAction 
          title="Need Emergency Sewage Cleanup?"
          description="Professional sewage cleanup and sanitization services across South East Queensland"
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
