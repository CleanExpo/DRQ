'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronUp, 
  Phone,
  Clock,
  DollarSign,
  Shield,
  MapPin,
  AlertTriangle,
  FileText,
  Tool
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ | Disaster Recovery Queensland',
  description: 'Frequently asked questions about our disaster recovery services. Learn about our emergency response, coverage areas, and restoration process.',
  openGraph: {
    title: 'FAQ | DRQ',
    description: 'Find answers to common questions about our disaster recovery services.',
    url: 'https://drq.com.au/faq',
    siteName: 'Disaster Recovery Queensland',
    images: [
      {
        url: '/images/faq-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DRQ FAQ'
      }
    ],
    locale: 'en_AU',
    type: 'website',
  }
};

interface FAQCategory {
  id: string;
  title: string;
  icon: any;
  questions: {
    id: string;
    question: string;
    answer: string;
  }[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'emergency',
    title: 'Emergency Response',
    icon: AlertTriangle,
    questions: [
      {
        id: 'response-time',
        question: 'How quickly can you respond to emergencies?',
        answer: 'We provide 24/7 emergency response with typical arrival times of 1-2 hours in metropolitan areas. Response times may vary based on location and current emergency volume.'
      },
      {
        id: 'what-to-do',
        question: 'What should I do while waiting for your team?',
        answer: 'If safe, turn off the main water supply for water damage, ensure everyone is evacuated for fire damage, and document the damage with photos. Do not enter unsafe structures or attempt repairs that could be dangerous.'
      },
      {
        id: 'after-hours',
        question: 'Do you charge extra for after-hours service?',
        answer: 'No, we charge the same rates 24/7 for emergency services. Our priority is providing immediate assistance when you need it most.'
      }
    ]
  },
  {
    id: 'services',
    title: 'Our Services',
    icon: Tool,
    questions: [
      {
        id: 'services-offered',
        question: 'What types of damage do you handle?',
        answer: 'We handle water damage, fire & smoke damage, flood recovery, mould remediation, storm damage, and sewage cleanup. We also provide commercial disaster recovery services.'
      },
      {
        id: 'equipment',
        question: 'What equipment do you use?',
        answer: 'We use professional-grade water extraction equipment, industrial dehumidifiers, air movers, thermal imaging cameras, and specialized cleaning solutions certified by IICRC standards.'
      },
      {
        id: 'guarantee',
        question: 'Do you guarantee your work?',
        answer: 'Yes, all our restoration work comes with a satisfaction guarantee. We follow industry best practices and won't consider the job complete until you're satisfied.'
      }
    ]
  },
  {
    id: 'insurance',
    title: 'Insurance & Claims',
    icon: FileText,
    questions: [
      {
        id: 'insurance-process',
        question: 'Do you work with insurance companies?',
        answer: 'Yes, we work directly with all major insurance companies and can help manage your claim from start to finish. We provide detailed documentation and evidence to support your claim.'
      },
      {
        id: 'cost-coverage',
        question: 'What costs are typically covered by insurance?',
        answer: 'Most insurance policies cover sudden and accidental water damage, fire damage, and storm damage. Coverage varies by policy, so we recommend checking with your provider.'
      },
      {
        id: 'documentation',
        question: 'What documentation do you provide?',
        answer: 'We provide detailed reports including initial assessment, photos, moisture readings, scope of work, and completion certificates. All documentation meets insurance industry standards.'
      }
    ]
  },
  {
    id: 'coverage',
    title: 'Service Areas',
    icon: MapPin,
    questions: [
      {
        id: 'areas-covered',
        question: 'Which areas do you service?',
        answer: 'We service Brisbane, Gold Coast, Sunshine Coast, and surrounding regions. Our coverage radius extends up to 100km from our service centers.'
      },
      {
        id: 'response-zones',
        question: 'Do response times vary by location?',
        answer: 'Yes, response times typically range from 30-90 minutes in metropolitan areas and up to 2-3 hours in outer regions. We'll provide an accurate ETA when you call.'
      },
      {
        id: 'multiple-locations',
        question: 'Can you handle multiple locations?',
        answer: 'Yes, we have multiple teams and service centers allowing us to handle concurrent emergencies across different locations.'
      }
    ]
  },
  {
    id: 'costs',
    title: 'Pricing & Payments',
    icon: DollarSign,
    questions: [
      {
        id: 'cost-estimate',
        question: 'How do you determine costs?',
        answer: 'Costs are based on the extent of damage, required services, and materials needed. We provide detailed quotes before beginning work and update you if additional work is needed.'
      },
      {
        id: 'payment-options',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, direct bank transfers, and insurance direct billing. Payment plans can be arranged for larger projects.'
      },
      {
        id: 'insurance-excess',
        question: 'Do I need to pay the insurance excess?',
        answer: 'Yes, if claiming through insurance, you'll need to pay your policy excess. We can often include this in your initial payment to simplify the process.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string | null>('emergency');
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Find answers to common questions about our disaster recovery services
          </p>
        </div>
      </div>

      {/* Quick Contact */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-600">
                Need immediate assistance?
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="tel:1300309361"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call 1300 309 361
              </a>
              <span className="text-gray-400">|</span>
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {FAQ_CATEGORIES.map(category => (
            <div 
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-expanded={openCategory === category.id}
              >
                <div className="flex items-center">
                  <category.icon className="w-5 h-5 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    {category.title}
                  </h2>
                </div>
                {openCategory === category.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Questions */}
              {openCategory === category.id && (
                <div className="p-6 space-y-4">
                  {category.questions.map(question => (
                    <div key={question.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => toggleQuestion(question.id)}
                        className="w-full text-left flex items-center justify-between py-2"
                        aria-expanded={openQuestions.includes(question.id)}
                      >
                        <h3 className="text-lg font-medium text-gray-900 pr-8">
                          {question.question}
                        </h3>
                        {openQuestions.includes(question.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {openQuestions.includes(question.id) && (
                        <div className="mt-2 text-gray-600">
                          {question.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help. Contact us for immediate assistance or to learn more about our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1300309361"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
