import React from 'react';
import { Hero } from '../shared/Hero';
import { ServiceAreas } from '../shared/ServiceAreas';
import { CallToAction } from '../shared/CallToAction';

interface LocationProps {
  location: {
    name: string;
    description?: string;
  };
}

export default function LocationPage({ location }: LocationProps) {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <Hero 
        title={`Emergency Restoration Services in ${location.name}`}
        description={location.description || `Professional disaster recovery and restoration services available 24/7 in ${location.name}`}
        primaryButton={{
          text: "Get Emergency Help",
          href: "/en-AU/contact"
        }}
        secondaryButton={{
          text: "Contact Us",
          href: "/en-AU/contact"
        }}
      />

      {/* Service Areas */}
      <ServiceAreas />

      {/* Call to Action */}
      <CallToAction 
        title={`Need Emergency Services in ${location.name}?`}
        description="Our team is available 24/7 for emergency response"
        buttonText="Contact Us Now"
        buttonHref="/en-AU/contact"
        showPhoneNumber={true}
        isDark={true}
      />
    </div>
  );
}
