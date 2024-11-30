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

const mouldService = SERVICES.find(s => s.name === 'Mould Remediation')!;

export const metadata: Metadata = generateServiceMeta({
  title: 'Professional Mould Remediation Services Brisbane | Disaster Recovery QLD',
  description: 'Expert mould detection and removal services in Brisbane. Professional mould remediation, prevention, and air quality testing for homes and businesses.',
  path: mouldService.href,
  imageUrl: '/images/services/mould-remediation.jpg',
  keywords: [
    'mould remediation',
    'mould removal',
    'mould detection',
    'air quality testing',
    'mould prevention',
    'mould inspection',
    'toxic mould removal',
    'mould treatment',
    'mould cleanup Brisbane',
    'professional mould services'
  ]
});

const services = [
  {
    title: "Mould Inspection",
    description: "Comprehensive mould detection and assessment services"
  },
  {
    title: "Air Quality Testing",
    description: "Professional indoor air quality analysis and reporting"
  },
  {
    title: "Safe Mould Removal",
    description: "Expert removal using industry-approved techniques"
  },
  {
    title: "Prevention Services",
    description: "Long-term mould prevention strategies and solutions"
  },
  {
    title: "Structural Treatment",
    description: "Treatment of affected building materials and structures"
  },
  {
    title: "Health Protection",
    description: "Measures to protect occupant health during remediation"
  }
];

const steps = [
  {
    step: "1",
    title: "Inspection",
    description: "Thorough mould detection and assessment"
  },
  {
    step: "2",
    title: "Testing",
    description: "Air quality and surface testing"
  },
  {
    step: "3",
    title: "Remediation",
    description: "Professional mould removal process"
  },
  {
    step: "4",
    title: "Prevention",
    description: "Implementation of preventive measures"
  }
];

const faqs: FAQItem[] = [
  {
    question: "How do you detect hidden mould?",
    answer: "We use advanced moisture meters, thermal imaging, and air quality testing to detect hidden mould in walls, ceilings, and other concealed spaces."
  },
  {
    question: "Is mould remediation safe for occupants?",
    answer: "Yes, we use containment procedures and air filtration to ensure occupant safety. In some cases, temporary relocation may be recommended during treatment."
  },
  {
    question: "How long does mould remediation take?",
    answer: "The timeline varies based on the extent of mould growth, typically 2-5 days for standard remediation and up to 2 weeks for severe cases."
  },
  {
    question: "Do you provide prevention advice?",
    answer: "Yes, we provide detailed recommendations for preventing future mould growth, including moisture control and ventilation improvements."
  }
];

export default function MouldRemediationPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Mould Remediation', url: mouldService.href }
  ];

  return (
    <>
      <SchemaProvider 
        schemas={[
          generateServiceSchema(mouldService),
          generateBreadcrumbSchema(breadcrumbs),
          generateFAQSchema(faqs)
        ]} 
      />
      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <Hero 
          title="Professional Mould Remediation Services"
          description="Expert mould detection, removal, and prevention services for healthier indoor environments"
          primaryButton={{
            text: "Get Expert Help",
            href: "/en-AU/contact"
          }}
          secondaryButton={{
            text: "Contact Us",
            href: "/en-AU/contact"
          }}
        />

        {/* Services Overview */}
        <ServicesOverview 
          title="Our Mould Remediation Services"
          services={services}
        />

        {/* Process Section */}
        <ProcessSteps 
          title="Our Remediation Process"
          steps={steps}
        />

        {/* FAQ Section */}
        <FAQ 
          title="Common Questions About Mould Remediation"
          faqs={faqs}
        />

        {/* Call to Action */}
        <CallToAction 
          title="Need Mould Remediation Services?"
          description="Professional mould removal and prevention services across South East Queensland"
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
