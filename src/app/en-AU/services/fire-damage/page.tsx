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

const fireDamageService = SERVICES.find(s => s.name === 'Fire Damage')!;

export const metadata: Metadata = generateServiceMeta({
  title: 'Fire Damage Restoration Services Brisbane | Disaster Recovery QLD',
  description: 'Professional fire and smoke damage restoration services available 24/7. Expert cleanup, odour removal, and property restoration in Brisbane and surrounding areas.',
  path: fireDamageService.href,
  imageUrl: '/images/services/fire-damage.jpg',
  keywords: [
    'fire damage restoration',
    'smoke damage cleanup',
    'fire damage repair',
    'smoke odour removal',
    'fire restoration services',
    'emergency fire cleanup',
    'fire damage assessment',
    'property restoration',
    'fire damage Brisbane',
    'smoke damage remediation'
  ]
});

const services = [
  {
    title: "Fire Damage Assessment",
    description: "Comprehensive evaluation of fire and smoke damage"
  },
  {
    title: "Emergency Board-Up",
    description: "Immediate property security and protection services"
  },
  {
    title: "Smoke Removal",
    description: "Professional smoke and soot cleanup services"
  },
  {
    title: "Odour Control",
    description: "Advanced techniques for complete odour elimination"
  },
  {
    title: "Content Restoration",
    description: "Specialized cleaning of fire-damaged belongings"
  },
  {
    title: "Structural Repairs",
    description: "Complete restoration of fire-damaged structures"
  }
];

const steps = [
  {
    step: "1",
    title: "Emergency Response",
    description: "Immediate assessment and property securing"
  },
  {
    step: "2",
    title: "Damage Assessment",
    description: "Detailed inspection and documentation"
  },
  {
    step: "3",
    title: "Cleanup & Removal",
    description: "Smoke, soot, and debris removal"
  },
  {
    step: "4",
    title: "Restoration",
    description: "Complete property rehabilitation"
  }
];

const faqs: FAQItem[] = [
  {
    question: "How quickly can you respond to fire damage?",
    answer: "We provide 24/7 emergency response with typical arrival times of 1-2 hours in the Brisbane area. Immediate response is crucial for minimizing secondary damage."
  },
  {
    question: "Can smoke odour be completely removed?",
    answer: "Yes, using professional-grade equipment and specialized techniques, we can completely eliminate smoke odours from your property and belongings."
  },
  {
    question: "Do you work with insurance for fire damage claims?",
    answer: "Yes, we work directly with all major insurance companies and can assist with the entire claims process, including detailed documentation and damage assessment."
  },
  {
    question: "How long does fire damage restoration take?",
    answer: "The timeline varies based on damage severity, typically 1-2 weeks for minor damage and 2-6 months for major fire damage restoration projects."
  }
];

export default function FireDamagePage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Fire Damage', url: fireDamageService.href }
  ];

  return (
    <>
      <SchemaProvider 
        schemas={[
          generateServiceSchema(fireDamageService),
          generateBreadcrumbSchema(breadcrumbs),
          generateFAQSchema(faqs)
        ]} 
      />
      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <Hero 
          title="Professional Fire Damage Restoration"
          description="Expert fire and smoke damage restoration services for residential and commercial properties"
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
          title="Our Fire Damage Services"
          services={services}
        />

        {/* Process Section */}
        <ProcessSteps 
          title="Our Restoration Process"
          steps={steps}
        />

        {/* FAQ Section */}
        <FAQ 
          title="Common Questions About Fire Damage Restoration"
          faqs={faqs}
        />

        {/* Call to Action */}
        <CallToAction 
          title="Need Fire Damage Restoration?"
          description="Professional fire and smoke damage restoration services across South East Queensland"
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
