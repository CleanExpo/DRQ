"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ServiceAreaSelector } from '@/components/service-areas/ServiceAreaSelector'
import { Phone, Droplets, Fan, Clock, Shield } from "lucide-react"
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'

const services = [
  {
    title: "Emergency Water Extraction",
    description: "Rapid response water removal using industrial-grade equipment",
    icon: Droplets,
    points: [
      "24/7 emergency response",
      "Industrial-grade extractors",
      "Flood water removal",
      "Sewage backup cleanup"
    ]
  },
  {
    title: "Structural Drying",
    description: "Complete structural drying and dehumidification",
    icon: Fan,
    points: [
      "Advanced drying equipment",
      "Moisture monitoring",
      "Thermal imaging",
      "Comprehensive drying plans"
    ]
  },
  {
    title: "Contents Restoration",
    description: "Professional restoration of water-damaged contents",
    icon: Shield,
    points: [
      "Document recovery",
      "Electronics restoration",
      "Furniture drying",
      "Personal item recovery"
    ]
  }
];

const processSteps = [
  {
    step: 1,
    title: "Emergency Response",
    description: "Rapid arrival and immediate water extraction to prevent further damage."
  },
  {
    step: 2,
    title: "Assessment & Planning",
    description: "Thorough damage assessment and development of restoration plan."
  },
  {
    step: 3,
    title: "Water Extraction",
    description: "Professional-grade equipment used for complete water removal."
  },
  {
    step: 4,
    title: "Drying & Dehumidification",
    description: "Strategic placement of drying equipment with moisture monitoring."
  },
  {
    step: 5,
    title: "Restoration & Repairs",
    description: "Complete restoration of affected areas to pre-damage condition."
  }
];

export default function WaterDamagePage() {
  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView('/services/water-damage');
  }

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', 'water-damage');
  };

  const handleQuoteRequest = () => {
    tracking.trackInteraction('quote-request', 'water-damage');
  };

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Water Damage Restoration
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional water damage restoration services available 24/7. 
          Fast response times across Brisbane and Gold Coast.
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

      {/* Emergency Response Banner */}
      <Card className="bg-red-50 border-red-100 mb-12">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="text-lg font-semibold text-red-700">
                24/7 Emergency Response
              </h2>
              <p className="text-red-600">
                15-30 minute response time for emergency water damage
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
                <Icon className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>{service.title}</CardTitle>
                <p className="text-gray-600">{service.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
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
          Our Water Damage Restoration Process
        </h2>
        <div className="max-w-3xl mx-auto">
          {processSteps.map((step) => (
            <div key={step.step} className="flex gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
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
          Check Your Service Area
        </h2>
        <ServiceAreaSelector />
      </div>

      {/* Call to Action */}
      <Card className="bg-gray-50 border-gray-100">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Need Emergency Water Damage Restoration?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is available 24/7 for immediate response
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
