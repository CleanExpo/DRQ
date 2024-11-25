import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { locationStructure } from '@/config/locations'
import { generateSEO } from '@/lib/seo'
import { tracking } from '@/lib/tracking'

export function generateMetadata(): Metadata {
  return generateSEO({
    title: "Service Areas | Emergency Restoration Services",
    description: "24/7 emergency restoration services across Brisbane, Gold Coast, and surrounding areas. Fast response times and local teams available.",
    path: "/locations",
    type: "website"
  });
}

export default function LocationsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Our Service Areas
        </h1>
        <p className="text-xl text-gray-600">
          24/7 emergency restoration services across South East Queensland
        </p>
      </div>

      {/* Locations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {Object.entries(locationStructure).map(([id, location]) => (
          <Card key={id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>{location.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Service Center */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Service Center</p>
                    <p className="text-sm text-gray-600">{location.serviceCenter}</p>
                  </div>
                </div>

                {/* Response Times */}
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Response Times</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {location.regions.map(region => (
                        <li key={region.id}>
                          {region.name}: {region.responseTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Regions */}
                <div className="space-y-2">
                  {location.regions.map(region => (
                    <Link 
                      key={region.id}
                      href={`/locations/${id}/${region.id}`}
                      onClick={() => tracking.trackServiceArea(region.name, true)}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full justify-between group"
                      >
                        <span>{region.name}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coverage Information */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Coverage Information
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold mb-2">Response Times</h3>
              <p className="text-sm text-gray-600">
                We aim to respond to all emergency calls within 15-45 minutes, depending on your location.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold mb-2">Service Centers</h3>
              <p className="text-sm text-gray-600">
                Strategically located service centers ensure rapid response across South East Queensland.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold mb-2">24/7 Availability</h3>
              <p className="text-sm text-gray-600">
                Our emergency teams are available 24/7, 365 days a year for immediate response.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
