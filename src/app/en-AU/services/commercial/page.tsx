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

const commercialService = SERVICES.find(s => s.name === 'Commercial')!;

export const metadata: Metadata = generateServiceMeta({
  title: 'Commercial Restoration Services Brisbane | Disaster Recovery QLD',
  description: 'Professional commercial property restoration services. Expert disaster recovery solutions for businesses, including water damage, fire damage, and emergency response services.',
  path: commercialService.href,
  imageUrl: '/images/services/commercial.jpg',
  keywords: [
    'commercial restoration',
    'business disaster recovery',
    'commercial property restoration',
    'commercial emergency services',
    'business continuity',
    'commercial water damage',
    'commercial fire damage',
    'industrial restoration',
    'commercial cleanup Brisbane',
    'business property restoration'
  ]
});

const services = [
  {
    title: "Business Continuity",
    description: "Minimize downtime with rapid emergency response and recovery"
  },
  {
    title: "Large-Scale Projects",
    description: "Comprehensive restoration for commercial properties"
  },
  {
    title: "Multi-Site Management",
    description: "Coordinated response across multiple locations"
  },
  {
    title: "Industry Compliance",
    description: "Adherence to commercial regulations and standards"
  },
  {
    title: "Project Management",
    description: "Dedicated commercial project coordination"
  },
  {
    title: "24/7 Emergency Response",
    description: "Round-the-clock commercial emergency services"
  }
];

const steps = [
  {
    step: "1",
    title: "Assessment",
    description: "Comprehensive commercial damage evaluation"
  },
  {
    step: "2",
    title: "Planning",
    description: "Strategic restoration planning"
  },
  {
    step: "3",
    title: "Execution",
    description: "Professional restoration services"
  },
  {
    step: "4",
    title: "Completion",
    description: "Quality assurance and handover"
  }
];

const faqs: FAQItem[] = [
  {
    question: "Do you work with commercial insurance providers?",
    answer: "Yes, we work directly with all major commercial insurance providers and can assist with claim documentation, assessment, and processing."
  },
  {
    question: "Can you handle large commercial properties?",
    answer: "Yes, we have the equipment and expertise to handle large-scale commercial projects, including multi-story buildings and industrial facilities."
  },
  {
    question: "How do you minimize business disruption?",
    answer: "We develop customized work schedules, use containment systems, and implement efficient project management to minimize impact on business operations."
  },
  {
    question: "What commercial sectors do you service?",
    answer: "We service all commercial sectors including retail, office buildings, warehouses, manufacturing facilities, healthcare facilities, and educational institutions."
  }
];

export default function CommercialPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Commercial', url: commercialService.href }
  ];

  return (
    <>
      <SchemaProvider 
        schemas={[
          generateServiceSchema(commercialService),
          generateBreadcrumbSchema(breadcrumbs),
          generateFAQSchema(faqs)
        ]} 
      />
      <div className="flex flex-col gap-12 py-8">
        {/* Hero Section */}
        <Hero 
          title="Commercial Restoration Services"
          description="Professional disaster recovery solutions for businesses and commercial properties"
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
          title="Our Commercial Services"
          services={services}
        />

        {/* Process Section */}
        <ProcessSteps 
          title="Our Commercial Process"
          steps={steps}
        />

        {/* Industries Served */}
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Industries We Serve</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Retail",
                  description: "Shopping centers, stores, and retail outlets"
                },
                {
                  title: "Office Buildings",
                  description: "Corporate offices and commercial spaces"
                },
                {
                  title: "Healthcare",
                  description: "Medical facilities and healthcare centers"
                },
                {
                  title: "Industrial",
                  description: "Manufacturing and industrial facilities"
                },
                {
                  title: "Education",
                  description: "Schools, universities, and educational facilities"
                },
                {
                  title: "Hospitality",
                  description: "Hotels, restaurants, and entertainment venues"
                }
              ].map((industry, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{industry.title}</h3>
                  <p className="text-gray-600">{industry.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ 
          title="Commercial Services FAQ"
          faqs={faqs}
        />

        {/* Call to Action */}
        <CallToAction 
          title="Need Commercial Restoration Services?"
          description="Professional commercial property restoration across South East Queensland"
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
