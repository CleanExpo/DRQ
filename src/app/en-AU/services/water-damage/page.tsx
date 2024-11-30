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

const waterDamageService = SERVICES.find(s => s.name === 'Water Damage')!;

export const metadata: Metadata = generateServiceMeta({
  title: 'Water Damage Restoration Services Brisbane | Disaster Recovery QLD',
  description: 'Professional water damage restoration services available 24/7. Expert water extraction, structural drying, and property restoration in Brisbane and surrounding areas.',
  path: waterDamageService.href,
  imageUrl: '/images/services/water-damage.jpg',
  keywords: [
    'water damage restoration',
    'water extraction',
    'flood damage',
    'structural drying',
    'moisture detection',
    'burst pipes',
    'water leaks',
    'property restoration',
    'emergency water removal',
    'water damage repair'
  ]
});

const services = [
  {
    title: "Flood Damage Cleanup",
    description: "Professional flood water removal and property restoration services"
  },
  {
    title: "Burst Pipe Repairs",
    description: "Emergency response for burst pipes and water leaks"
  },
  {
    title: "Storm Damage",
    description: "Comprehensive storm and water damage restoration"
  },
  {
    title: "Structural Drying",
    description: "Professional grade equipment for thorough structural drying"
  },
  {
    title: "Moisture Detection",
    description: "Advanced technology to detect hidden moisture and prevent mould"
  },
  {
    title: "Content Restoration",
    description: "Salvage and restore water-damaged belongings"
  }
];

const steps = [
  {
    step: "1",
    title: "Emergency Response",
    description: "24/7 rapid response to minimize water damage"
  },
  {
    step: "2",
    title: "Assessment",
    description: "Thorough inspection and damage assessment"
  },
  {
    step: "3",
    title: "Water Removal",
    description: "Professional water extraction and drying"
  },
  {
    step: "4",
    title: "Restoration",
    description: "Complete property restoration and repairs"
  }
];

const faqs: FAQItem[] = [
  {
    question: "How quickly can you respond to water damage emergencies?",
    answer: "We provide 24/7 emergency response with typical arrival times of 1-2 hours in the Brisbane area."
  },
  {
    question: "What areas do you service for water damage restoration?",
    answer: "We service Brisbane, Gold Coast, Ipswich, Logan, and surrounding areas in South East Queensland."
  },
  {
    question: "Do you work with insurance companies?",
    answer: "Yes, we work directly with all major insurance companies and can assist with your claim process."
  },
  {
    question: "How long does water damage restoration take?",
    answer: "The timeline varies depending on damage severity, typically 3-5 days for standard water damage and up to 2 weeks for severe cases."
  }
];

export default function WaterDamagePage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Water Damage', url: waterDamageService.href }
  ];

  return (
    <>
      <SchemaProvider 
        schemas={[
          generateServiceSchema(waterDamageService),
          generateBreadcrumbSchema(breadcrumbs),
          generateFAQSchema(faqs)
        ]} 
      />
      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <Hero 
          title="Professional Water Damage Restoration"
          description="24/7 emergency water damage restoration services for residential and commercial properties"
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
          title="Our Water Damage Services"
          services={services}
        />

        {/* Process Section */}
        <ProcessSteps 
          title="Our Restoration Process"
          steps={steps}
        />

        {/* FAQ Section */}
        <FAQ 
          title="Common Questions About Water Damage"
          faqs={faqs}
        />

        {/* Call to Action */}
        <CallToAction 
          title="Need Emergency Water Damage Services?"
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
