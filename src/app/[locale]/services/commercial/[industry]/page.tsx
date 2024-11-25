"use client"

import { notFound } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Building2 } from "lucide-react"
import { ServiceAreaSelector } from '@/components/service-areas/ServiceAreaSelector'
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'
import { commercialStructure, type CommercialId } from '@/config/services'

interface IndustryPageProps {
  params: {
    industry: string
  }
}

// Validate and get industry data
function getIndustryData(industryId: string) {
  const industry = commercialStructure[industryId as CommercialId]
  if (!industry) return null
  return industry
}

export default function IndustryPage({ params }: IndustryPageProps) {
  const industry = getIndustryData(params.industry)
  if (!industry) return notFound()

  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView(`/services/commercial/${params.industry}`)
  }

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', `commercial-${params.industry}`)
  }

  const handleServiceRequest = () => {
    tracking.trackInteraction('service-request', `commercial-${params.industry}`)
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {industry.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {industry.description}
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
          Industry-Specific Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {industry.features.map((feature, index) => (
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
            Need Commercial Services?
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
