'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Disaster Recovery Queensland',
  description: 'Learn how DRQ collects, uses, and protects your personal information. Read our privacy policy and data protection practices.',
  openGraph: {
    title: 'Privacy Policy | DRQ',
    description: 'Learn how we protect your privacy and handle your data.',
    url: 'https://drq.com.au/privacy',
    siteName: 'Disaster Recovery Queensland',
    locale: 'en_AU',
    type: 'website',
  }
};

const LAST_UPDATED = '2024-01-15';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
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
              Disaster Recovery Queensland Pty Ltd ("DRQ", "we", "us", or "our") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We collect the following types of personal information:</p>
            <ul>
              <li>Name and contact details</li>
              <li>Property address and access information</li>
              <li>Insurance policy details</li>
              <li>Payment information</li>
              <li>Photos and videos of damaged property</li>
              <li>Communication records</li>
            </ul>

            <h3>2.2 Technical Information</h3>
            <p>When you use our website, we may collect:</p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and settings</li>
              <li>Website usage data</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <h3>3.1 Primary Purposes</h3>
            <p>We use your information to:</p>
            <ul>
              <li>Provide emergency response and restoration services</li>
              <li>Process insurance claims</li>
              <li>Communicate about service delivery</li>
              <li>Send service updates and notifications</li>
              <li>Process payments</li>
              <li>Improve our services</li>
            </ul>

            <h3>3.2 Marketing Communications</h3>
            <p>
              With your consent, we may send you:
            </p>
            <ul>
              <li>Service newsletters and updates</li>
              <li>Maintenance reminders</li>
              <li>Emergency preparedness information</li>
              <li>Promotional offers</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <h3>4.1 Third-Party Service Providers</h3>
            <p>We may share information with:</p>
            <ul>
              <li>Insurance companies (with your consent)</li>
              <li>Payment processors</li>
              <li>Communication service providers</li>
              <li>Cloud storage providers</li>
              <li>Professional service providers</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>
              We may disclose information when required by law or to:
            </p>
            <ul>
              <li>Comply with legal obligations</li>
              <li>Protect our rights and property</li>
              <li>Prevent fraud or abuse</li>
              <li>Ensure the safety of our customers and employees</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information, including:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure data storage systems</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>Staff training on data protection</li>
            </ul>

            <h2>6. Cookie Policy</h2>
            <h3>6.1 What Are Cookies</h3>
            <p>
              Cookies are small text files stored on your device that help us improve website functionality and user experience.
            </p>

            <h3>6.2 Types of Cookies We Use</h3>
            <ul>
              <li>Essential cookies for website operation</li>
              <li>Analytics cookies to understand usage</li>
              <li>Functionality cookies for user preferences</li>
              <li>Marketing cookies for relevant advertising</li>
            </ul>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
              <li>Lodge a complaint with privacy regulators</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 18. We do not knowingly collect information from children under 18. If you believe we have collected information from a child, please contact us immediately.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred and processed in countries outside Australia. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>10. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Significant changes will be notified via email or website notice. Continued use of our services constitutes acceptance of updated policy.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              For privacy-related inquiries or to exercise your rights, contact our Privacy Officer:
            </p>
            <ul>
              <li>Email: privacy@disasterrecoveryqld.au</li>
              <li>Phone: 1300 309 361</li>
              <li>Mail: Privacy Officer, PO Box 1234, Brisbane QLD 4000</li>
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
                  href="/terms"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Terms of Service
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
