import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Clock, ArrowRight } from "lucide-react"
import { locationStructure, type LocationId } from '@/config/locations'
import { generateSEO } from '@/lib/seo'
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'
import { generateLocalBusinessSchema } from '@/lib/schemas'

interface LocationPageProps {
  params: {
    locale: string
    location: string
  }
}

function getLocationData(locationId: string) {
  return locationStructure[locationId as LocationId] || null;
}

export async function generateMetadata(
  { params }: LocationPageProps
): Promise<Metadata> {
  const location = getLocationData(params.location);
  if (!location) return notFound();

  return generateSEO({
    title: `${location.name} Emergency Services | Service Areas`,
    description: `24/7 emergency restoration services in ${location.name}. Local teams available for rapid response. Service center in ${location.serviceCenter}.`,
    path: `/locations/${params.location}`,
    type: 'website'
  });
}

export default function LocationPage({ params }: LocationPageProps) {
  const location = getLocationData(params.location);
  if (!location) return notFound();

  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView(`/locations/${params.location}`);
  }

  // Generate schema
  const schema = generateLocalBusinessSchema(location.name);

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {location.name} Emergency Services
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          24/7 emergency restoration services across {location.name}
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href={`tel:${location.emergencyContact.replace(/\s/g, '')}`}
            onClick={() => tracking.trackEmergencyContact('phone', location.name)}
          >
            <Button size="lg" className="gap-2">
              <Phone className="h-5 w-5" />
              {location.emergencyContact}
            </Button>
          </a>
        </div>
      </div>

      {/* Service Center Info */}
      <Card className="mb-12">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Service Center</h3>
                <p className="text-sm text-gray-600">{location.serviceCenter}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Availability</h3>
                <p className="text-sm text-gray-600">{location.availability}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium mb-1">Emergency Contact</h3>
                <p className="text-sm text-gray-600">{location.emergencyContact}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {location.regions.map((region) => (
          <Card key={region.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>{region.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Response Time */}
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-gray-600">{region.responseTime}</p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-2">
                  {region.features.map((feature, index) => (
                    <p key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {feature}
                    </p>
                  ))}
                </div>

                <Link href={`/locations/${params.location}/${region.id}`}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between group"
                    onClick={() => tracking.trackServiceArea(region.name, true)}
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coverage Map */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Coverage Areas in {location.name}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {location.regions.map((region) => (
            <Card key={region.id}>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2">{region.name}</h3>
                <div className="space-y-1">
                  {region.suburbs.map((suburb) => (
                    <p key={suburb} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {suburb}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
