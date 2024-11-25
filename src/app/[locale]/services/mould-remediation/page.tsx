"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ServiceAreaSelector } from '@/components/service-areas/ServiceAreaSelector'
import { 
  Phone, 
  Search, 
  ShieldCheck, 
  Wind, 
  BarChart,
  Clock 
} from "lucide-react"
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'

const services = [
  {
    title: "Mould Inspection",
    description: "Comprehensive mould detection and assessment",
    icon: Search,
    points: [
      "Detailed inspection",
      "Moisture source identification",
      "Hidden mould detection",
      "Risk assessment"
    ]
  },
  {
    title: "Safe Removal",
    description: "Professional mould removal and remediation",
    icon: ShieldCheck,
    points: [
      "Safe containment procedures",
      "Professional removal",
      "Surface treatment",
      "Structural cleaning"
    ]
  },
  {
    title: "Air Quality",
    description: "Indoor air quality testing and improvement",
    icon: Wind,
    points: [
      "Air quality testing",
      "Spore monitoring",
      "Ventilation assessment",
      "HEPA filtration"
    ]
  },
  {
    title: "Prevention",
    description: "Long-term mould prevention strategies",
    icon: BarChart,
    points: [
      "Moisture control",
      "Preventive treatments",
      "Environmental controls",
      "Regular monitoring"
    ]
  }
];

const whyChooseUs = [
  {
    title: "Expert Assessment",
    description: "Professional inspection and testing by qualified technicians"
  },
  {
    title: "Safe & Effective",
    description: "Industry-leading removal methods and safety protocols"
  },
  {
    title: "Long-term Solutions",
    description: "Comprehensive treatment with prevention strategies"
  }
];

const processSteps = [
  {
    step: 1,
    title: "Inspection & Assessment",
    description: "Thorough inspection to identify mould extent and source."
  },
  {
    step: 2,
    title: "Treatment Planning",
    description: "Development of comprehensive remediation strategy."
  },
  {
    step: 3,
    title: "Containment",
    description: "Implementation of proper containment procedures."
  },
  {
    step: 4,
    title: "Remediation",
    description: "Professional removal and surface treatment."
  },
  {
    step: 5,
    title: "Prevention",
    description: "Implementation of preventive measures and recommendations."
  }
];

export default function MouldRemediationPage() {
  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView('/services/mould-remediation');
  }

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', 'mould-remediation');
  };

  const handleInspectionRequest = () => {
    tracking.trackInteraction('inspection-request', 'mould-remediation');
  };

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Professional Mould Remediation
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Expert mould inspection, removal, and prevention services.
          Comprehensive solutions for residential and commercial properties.
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
            onClick={handleInspectionRequest}
          >
            Book Inspection
          </Button>
        </div>
      </div>

      {/* Health Warning Banner */}
      <Card className="bg-amber-50 border-amber-100 mb-12">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-amber-500" />
            <div>
              <h2 className="text-lg font-semibold text-amber-700">
                Don't Delay Mould Treatment
              </h2>
              <p className="text-amber-600">
                Mould can cause serious health issues. Professional assessment available within 24 hours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Icon className="h-12 w-12 text-teal-500 mb-4" />
                <CardTitle>{service.title}</CardTitle>
                <p className="text-gray-600">{service.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span className="text-sm text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Why Choose Us */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Choose Our Mould Remediation Service?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {whyChooseUs.map((item) => (
            <Card key={item.title} className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Our Mould Remediation Process
        </h2>
        <div className="max-w-3xl mx-auto">
          {processSteps.map((step) => (
            <div key={step.step} className="flex gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
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
            Concerned About Mould?
          </h2>
          <p className="text-gray-600 mb-6">
            Get professional assessment and treatment
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
              onClick={handleInspectionRequest}
            >
              Schedule Inspection
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
