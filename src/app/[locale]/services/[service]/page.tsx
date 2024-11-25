"use client"

import { notFound } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { ServiceFeatures, ServiceList, ServiceStats } from '@/components/services/ServiceFeatures'
import { ServiceAreaSelector } from '@/components/service-areas/ServiceAreaSelector'
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'
import { serviceStructure, type ServiceId } from '@/config/services'

interface ServicePageProps {
  params: {
    service: string
  }
}

function getServiceData(serviceId: string) {
  return serviceStructure[serviceId as ServiceId] || null;
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = getServiceData(params.service);
  if (!service) return notFound();

  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView(`/services/${params.service}`);
  }

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', params.service);
  };

  const handleServiceRequest = () => {
    tracking.trackInteraction('service-request', params.service);
  };

  // Transform service data for ServiceList component
  const serviceFeatures = service.services.map(subService => ({
    title: subService.name,
    description: subService.description,
    features: [...subService.features] // Spread readonly array into mutable array
  }));

  // Transform service data for ServiceStats component
  const serviceStats = [
    {
      value: '24/7',
      label: 'Availability'
    },
    {
      value: service.services.length.toString(),
      label: 'Services'
    },
    {
      value: service.responseTime.split(' ')[0],
      label: 'Response Time'
    },
    {
      value: '100%',
      label: 'Satisfaction'
    }
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {service.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {service.longDescription}
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

      {/* Service Features */}
      <div className="mb-16">
        <ServiceFeatures serviceName={params.service} />
      </div>

      {/* Service Stats */}
      <div className="mb-16">
        <ServiceStats stats={serviceStats} />
      </div>

      {/* Service List */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Our {service.title} Services
        </h2>
        <ServiceList services={serviceFeatures} />
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
            Need {service.title}?
          </h2>
          <p className="text-gray-600 mb-6">
            {service.emergency 
              ? 'Our team is available 24/7 for immediate response'
              : 'Contact us for professional service'
            }
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
