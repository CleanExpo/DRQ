'use client';

import React from 'react';
import { StyledHeading, withStyles } from '@/components/StyleProvider';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <StyledHeading className="mb-8">Terms of Service</StyledHeading>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using Disaster Recovery Queensland's services, you agree to be bound by these Terms of Service. 
            If you disagree with any part of these terms, you may not access our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Services Description</h2>
          <p>
            Disaster Recovery Queensland provides emergency restoration and recovery services, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Water damage restoration</li>
            <li>Flood recovery</li>
            <li>Mould remediation</li>
            <li>Fire damage restoration</li>
            <li>Sewage cleanup</li>
            <li>Commercial restoration services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Service Availability</h2>
          <p>
            We provide 24/7 emergency services across South East Queensland. However, we reserve the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or withdraw services without notice</li>
            <li>Refuse service based on reasonable assessment</li>
            <li>Prioritize emergency cases based on severity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Payment Terms</h2>
          <p>By engaging our services, you agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Pay for services rendered as per agreed quotes</li>
            <li>Cover additional costs approved during service delivery</li>
            <li>Make payments within specified timeframes</li>
            <li>Pay any applicable call-out fees</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Insurance Claims</h2>
          <p>
            While we work with insurance companies, you understand that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Payment responsibility remains with you</li>
            <li>We can assist with insurance documentation</li>
            <li>Insurance coverage depends on your policy</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Liability Limitations</h2>
          <p>
            Our liability is limited to the extent permitted by law. We are not responsible for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Pre-existing damage or conditions</li>
            <li>Unavoidable damage during emergency response</li>
            <li>Delays due to force majeure events</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Your Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate information</li>
            <li>Grant necessary access to affected areas</li>
            <li>Inform us of any hazards or special conditions</li>
            <li>Secure valuables before work commences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
          </p>
          <ul className="list-none pl-6 mb-4">
            <li>Email: admin@disasterrecoveryqld.au</li>
            <li>Phone: 1300 309 361</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
            to our website.
          </p>
          <p className="mt-4">
            Last Updated: {new Date().toLocaleDateString('en-AU')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default withStyles(TermsOfService);
