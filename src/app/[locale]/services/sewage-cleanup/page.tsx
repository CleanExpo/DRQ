"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ServiceAreaSelector } from '@/components/service-areas/ServiceAreaSelector'
import { Phone, ShieldAlert, Droplets, AlertTriangle, Clock } from "lucide-react"
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'

const services = [
  {
    title: "Emergency Sewage Cleanup",
    description: "Professional sewage cleanup and contamination removal",
    icon: ShieldAlert,
    points: [
      "24/7 emergency response",
      "Safe waste removal",
      "Contamination containment",
      "Flood backup cleanup"
    ]
  },
  {
    title: "Professional Sanitization",
    description: "Complete sanitization and disinfection services",
    icon: Droplets,
    points: [
      "Hospital-grade disinfection",
      "Odour elimination",
      "Surface treatment",
      "Air purification"
    ]
  },
  {
    title: "Health & Safety",
    description: "Comprehensive health and safety protocols",
    icon: AlertTriangle,
    points: [
      "Safety assessments",
      "Protective equipment",
      "Containment procedures",
      "Environmental monitoring"
    ]
  }
];

const processSteps = [
  {
    step: 1,
    title: "Initial Assessment",
    description: "Thorough evaluation of contamination and safety risks."
  },
  {
    step: 2,
    title: "Area Containment",
    description: "Securing the area to prevent cross-contamination."
  },
  {
    step: 3,
    title: "Waste Removal",
    description: "Safe removal of contaminated water and materials."
  },
  {
    step: 4,
    title: "Sanitization",
    description: "Complete disinfection and decontamination process."
  },
  {
    step: 5,
    title: "Restoration",
    description: "Restoration of affected areas to safe, pre-damage condition."
  }
];

export default function SewageCleanupPage() {
  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView('/services/sewage-cleanup');
  }

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', 'sewage-cleanup');
  };

  const handleQuoteRequest = () => {
    tracking.trackInteraction('quote-request', 'sewage-cleanup');
  };

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Professional Sewage Cleanup Services
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Expert sewage cleanup and sanitization services available 24/7.
          Safe, thorough, and professional service guaranteed.
        </p>
        <div className="flex justify-center gap-4">
          <a href="tel:1300309361" onClick={handleEmergencyCall}>
            <Button size="lg" className="gap-2">
              <Phone className="h-5 w-5" />
              1300 309 361
            </Button>
          </a>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleQuoteRequest}
          >
            Request Service
          </Button>
        </div>
      </div>

      {/* Emergency Banner */}
      <Card className="bg-red-50 border-red-100 mb-12">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="text-lg font-semibold text-red-700">
                Immediate Response Available
              </h2>
              <p className="text-red-600">
                Fast response for sewage emergencies
              </p>
            </div>
          </div>
          <a href="tel:1300309361" onClick={handleEmergencyCall}>
            <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
              <Phone className="h-5 w-5" />
              Call Now
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Icon className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>{service.title}</CardTitle>
                <p className="text-gray-600">{service.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Our Sewage Cleanup Process
        </h2>
        <div className="max-w-3xl mx-auto">
          {processSteps.map((step) => (
            <div key={step.step} className="flex gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                {step.step}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Area Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Service Areas
        </h2>
        <ServiceAreaSelector />
      </div>

      {/* Call to Action */}
      <Card className="bg-gray-50 border-gray-100">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Need Emergency Sewage Cleanup?
          </h2>
          <p className="text-gray-600 mb-6">
            Our professional team is ready to help 24/7
          </p>
          <div className="flex justify-center gap-4">
            <a href="tel:1300309361" onClick={handleEmergencyCall}>
              <Button size="lg" className="gap-2">
                <Phone className="h-5 w-5" />
                1300 309 361
              </Button>
            </a>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleQuoteRequest}
            >
              Request Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
