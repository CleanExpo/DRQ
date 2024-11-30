'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Disaster Recovery Queensland',
  description: 'Terms and conditions for using DRQ services. Read our service terms, privacy policy, and legal information.',
  openGraph: {
    title: 'Terms of Service | DRQ',
    description: 'Terms and conditions for DRQ services.',
    url: 'https://drq.com.au/terms',
    siteName: 'Disaster Recovery Queensland',
    locale: 'en_AU',
    type: 'website',
  }
};

const LAST_UPDATED = '2024-01-15';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-white/90">
              Last Updated: {new Date(LAST_UPDATED).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2>1. Introduction</h2>
            <p>
              These Terms of Service ("Terms") govern your use of services provided by Disaster Recovery Queensland Pty Ltd ("DRQ", "we", "us", or "our"). By using our services, you agree to these Terms. Please read them carefully.
            </p>

            <h2>2. Service Terms</h2>
            <h3>2.1 Service Availability</h3>
            <p>
              We provide 24/7 emergency response services across Queensland. However, response times may vary based on location, current demand, and weather conditions. We reserve the right to prioritize emergency calls based on severity and risk.
            </p>

            <h3>2.2 Service Quality</h3>
            <p>
              We strive to provide high-quality restoration services following industry best practices and standards. All work is performed by qualified technicians using professional-grade equipment and materials.
            </p>

            <h3>2.3 Estimates and Quotes</h3>
            <p>
              Initial estimates are provided based on visible damage and standard industry costs. Final costs may vary if additional damage is discovered during the restoration process. We will communicate any significant changes promptly.
            </p>

            <h2>3. Customer Responsibilities</h2>
            <h3>3.1 Access and Information</h3>
            <p>
              Customers must provide:
            </p>
            <ul>
              <li>Safe access to the affected property</li>
              <li>Accurate information about the damage</li>
              <li>Relevant insurance information if applicable</li>
              <li>Timely communication regarding any concerns</li>
            </ul>

            <h3>3.2 Payment Terms</h3>
            <p>
              Payment terms vary based on service type and insurance coverage. For insurance claims, customers are responsible for any excess payments and uncovered costs. Direct billing requires payment within agreed terms.
            </p>

            <h2>4. Insurance and Liability</h2>
            <h3>4.1 Insurance Coverage</h3>
            <p>
              We maintain comprehensive public liability and professional indemnity insurance. However, this does not cover customer property insurance or excess payments.
            </p>

            <h3>4.2 Limitation of Liability</h3>
            <p>
              Our liability is limited to the extent permitted by law. We are not responsible for:
            </p>
            <ul>
              <li>Pre-existing damage or conditions</li>
              <li>Damage caused by delayed response due to factors outside our control</li>
              <li>Consequential losses</li>
              <li>Issues arising from customer-provided incorrect information</li>
            </ul>

            <h2>5. Privacy and Data</h2>
            <p>
              We collect and handle personal information in accordance with our Privacy Policy. This includes contact details, property information, and insurance details. For complete information about data handling, please refer to our{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>.
            </p>

            <h2>6. Cancellation and Termination</h2>
            <h3>6.1 Service Cancellation</h3>
            <p>
              Emergency service cancellations may incur a call-out fee. Non-emergency service cancellations require 24 hours notice to avoid charges.
            </p>

            <h3>6.2 Service Termination</h3>
            <p>
              We reserve the right to terminate services if:
            </p>
            <ul>
              <li>Safety concerns exist</li>
              <li>Required access is not provided</li>
              <li>Payment terms are not met</li>
              <li>Customer behavior is inappropriate or threatening</li>
            </ul>

            <h2>7. Dispute Resolution</h2>
            <p>
              Any disputes will be handled through:
            </p>
            <ol>
              <li>Direct communication with our customer service team</li>
              <li>Formal written complaint process</li>
              <li>Independent mediation if necessary</li>
              <li>Relevant legal proceedings as a last resort</li>
            </ol>

            <h2>8. Changes to Terms</h2>
            <p>
              We may update these Terms periodically. Significant changes will be communicated via email or website notifications. Continued use of our services constitutes acceptance of updated Terms.
            </p>

            <h2>9. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us:
            </p>
            <ul>
              <li>Phone: 1300 309 361</li>
              <li>Email: legal@disasterrecoveryqld.au</li>
              <li>Mail: PO Box 1234, Brisbane QLD 4000</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Related Information
            </h2>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
