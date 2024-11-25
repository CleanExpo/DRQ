"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Building2 } from "lucide-react"
import { ServiceAreaSelector } from '@/components/service-areas/ServiceAreaSelector'
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'
import { serviceStructure, commercialServices } from '@/config/services'

export default function WaterDamageCommercialPage() {
  const service = serviceStructure.waterDamage
  const commercialService = commercialServices.waterDamage

  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView('/services/water-damage/commercial')
  }

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', 'water-damage-commercial')
  }

  const handleServiceRequest = () => {
    tracking.trackInteraction('service-request', 'water-damage-commercial')
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {commercialService.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {commercialService.description}
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
            onClick={handleServiceRequest}
          >
            Request Service
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Commercial Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {commercialService.features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-gray-600">{feature}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Response Time Section */}
      <Card className="mb-16 bg-blue-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-700">
                Priority Response for Commercial Clients
              </h2>
              <p className="text-blue-600">
                {service.responseTime} average response time for commercial emergencies
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
            Need Commercial Water Damage Services?
          </h2>
          <p className="text-gray-600 mb-6">
            Our professional team is ready to help
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
              onClick={handleServiceRequest}
            >
              Request Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
