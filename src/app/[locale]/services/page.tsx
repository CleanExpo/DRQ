import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle, Wrench, ArrowRight } from "lucide-react"
import { serviceStructure } from '@/config/services'
import { generateSEO } from '@/lib/seo'
import { tracking } from '@/lib/tracking'

export function generateMetadata(): Metadata {
  return generateSEO({
    title: "Emergency Restoration Services | Professional Cleaning & Restoration",
    description: "Professional restoration services including water damage restoration, sewage cleanup, and mould remediation. Available 24/7 for emergencies.",
    path: "/services",
    type: "website"
  });
}

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Our Services
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional restoration services with 24/7 emergency response
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="tel:1300309361"
            onClick={() => tracking.trackEmergencyContact('phone', 'services-page')}
          >
            <Button size="lg" className="gap-2">
              <Phone className="h-5 w-5" />
              1300 309 361
            </Button>
          </a>
        </div>
      </div>

      {/* Emergency Services */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Emergency Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(serviceStructure)
            .filter(([_, service]) => service.emergency)
            .map(([id, service]) => (
              <Card key={id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {service.shortDescription}
                  </p>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Response Time: {service.responseTime}
                    </div>
                    <Link href={`/services/${id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between group"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Professional Services */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Professional Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(serviceStructure)
            .filter(([_, service]) => !service.emergency)
            .map(([id, service]) => (
              <Card key={id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-500" />
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {service.shortDescription}
                  </p>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Response Time: {service.responseTime}
                    </div>
                    <Link href={`/services/${id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between group"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Service Features */}
      <div className="grid md:grid-cols-3 gap-6 bg-gray-50 rounded-lg p-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2">24/7 Emergency Response</h3>
            <p className="text-sm text-gray-600">
              Available around the clock for emergency situations with rapid response teams.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2">Professional Teams</h3>
            <p className="text-sm text-gray-600">
              Fully licensed and insured technicians with extensive experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2">Service Guarantee</h3>
            <p className="text-sm text-gray-600">
              100% satisfaction guarantee on all our restoration services.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
