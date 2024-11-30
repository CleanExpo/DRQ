'use client';

import React from 'react';
import { StyledHeading, withStyles } from '@/components/StyleProvider';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <StyledHeading className="mb-8">Privacy Policy</StyledHeading>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p>
            At Disaster Recovery Queensland, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
          <p>We may collect personal information that you provide to us, including but not limited to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and contact information</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Address and location details</li>
            <li>Emergency service requirements</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Usage Information</h3>
          <p>We may also collect information about how you use our website:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Log and usage data</li>
            <li>Device information</li>
            <li>Location data</li>
            <li>Cookie data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information. 
            However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Request transfer of your information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul className="list-none pl-6 mb-4">
            <li>Email: admin@disasterrecoveryqld.au</li>
            <li>Phone: 1300 309 361</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          <p className="mt-4">
            Last Updated: {new Date().toLocaleDateString('en-AU')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default withStyles(PrivacyPolicy);
