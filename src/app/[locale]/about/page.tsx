'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Clock, 
  Phone, 
  Shield, 
  Award, 
  Users, 
  Tool,
  CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Disaster Recovery Queensland',
  description: 'Professional disaster recovery and restoration services across Queensland. Learn about our experience, team, and commitment to excellence.',
  openGraph: {
    title: 'About Us | DRQ',
    description: 'Professional disaster recovery and restoration services across Queensland.',
    url: 'https://drq.com.au/about',
    siteName: 'Disaster Recovery Queensland',
    images: [
      {
        url: '/images/about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'About DRQ'
      }
    ],
    locale: 'en_AU',
    type: 'website',
  }
};

const STATS = [
  {
    label: 'Years Experience',
    value: '15+',
    icon: Clock
  },
  {
    label: 'Emergency Responses',
    value: '10,000+',
    icon: Shield
  },
  {
    label: 'Team Members',
    value: '50+',
    icon: Users
  },
  {
    label: 'Service Areas',
    value: '100+',
    icon: Tool
  }
];

const VALUES = [
  {
    title: '24/7 Emergency Response',
    description: 'Available around the clock for rapid disaster recovery assistance.',
    icon: Clock
  },
  {
    title: 'Professional Excellence',
    description: 'Certified technicians and industry-leading equipment and techniques.',
    icon: Award
  },
  {
    title: 'Customer-First Approach',
    description: 'Dedicated to providing exceptional service and support throughout the recovery process.',
    icon: Users
  },
  {
    title: 'Comprehensive Solutions',
    description: 'Full-service disaster recovery and restoration for any situation.',
    icon: Tool
  }
];

const CERTIFICATIONS = [
  'IICRC Certified Firm',
  'ISO 9001:2015 Certified',
  'WorkCover Queensland Approved',
  'Master Builders Member',
  'Restoration Industry Association Member'
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
            Queensland's trusted disaster recovery specialists since 2008
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div 
                key={index}
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600">
              To provide rapid, professional, and comprehensive disaster recovery services 
              that help Queensland residents and businesses recover from disasters and 
              return to normalcy as quickly as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, index) => (
              <div 
                key={index}
                className="text-center"
                data-testid={`value-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Certifications & Memberships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {CERTIFICATIONS.map((cert, index) => (
              <div 
                key={index}
                className="flex items-center bg-white rounded-lg p-4 shadow-sm"
                data-testid={`certification-${index}`}
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Our Services?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're available 24/7 for emergency response across Queensland.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1300309361"
              className="inline-flex items-center bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-bold"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call 1300 309 361
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-900 transition-colors font-bold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
