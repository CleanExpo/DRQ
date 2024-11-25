import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { locationStructure, type LocationId } from '@/config/locations'
import { generateSEO } from '@/lib/seo'
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'
import { RegionFeatures, RegionSuburbs, RegionStats } from '@/components/locations/RegionFeatures'
import { generateLocalBusinessSchema } from '@/lib/schemas'

interface RegionPageProps {
  params: {
    locale: string
    location: string
    region: string
  }
}

function getRegionData(locationId: string, regionId: string) {
  const location = locationStructure[locationId as LocationId];
  if (!location) return null;
  
  const region = location.regions.find(r => r.id === regionId);
  if (!region) return null;

  return { location, region };
}

export async function generateMetadata(
  { params }: RegionPageProps
): Promise<Metadata> {
  const data = getRegionData(params.location, params.region);
  if (!data) return notFound();

  const { location, region } = data;
  
  return generateSEO({
    title: `${region.name} Emergency Services | ${location.name}`,
    description: `24/7 emergency restoration services in ${region.name}. ${region.description} Response time: ${region.responseTime}.`,
    path: `/locations/${params.location}/${params.region}`,
    type: 'website'
  });
}

export default function RegionPage({ params }: RegionPageProps) {
  const data = getRegionData(params.location, params.region);
  if (!data) return notFound();

  const { location, region } = data;

  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView(`/locations/${params.location}/${params.region}`);
    tracking.trackServiceArea(region.name, true);
  }

  // Generate schema
  const schema = generateLocalBusinessSchema(region.name);

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
          {region.name} Emergency Services
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {region.description}
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href={`tel:${location.emergencyContact.replace(/\s/g, '')}`}
            onClick={() => tracking.trackEmergencyContact('phone', region.name)}
          >
            <Button size="lg" className="gap-2">
              <Phone className="h-5 w-5" />
              {location.emergencyContact}
            </Button>
          </a>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => tracking.trackResponseTime(region.name, region.responseTime)}
          >
            Response Time: {region.responseTime}
          </Button>
        </div>
      </div>

      {/* Region Stats */}
      <div className="mb-16">
        <RegionStats region={region} />
      </div>

      {/* Region Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Our Services in {region.name}
        </h2>
        <RegionFeatures 
          region={region}
          serviceCenter={location.serviceCenter}
        />
      </div>

      {/* Service Areas */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Suburbs We Service in {region.name}
        </h2>
        <RegionSuburbs region={region} />
      </div>

      {/* Emergency Contact */}
      <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center">
            Need Emergency Assistance in {region.name}?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Available {location.availability} for rapid emergency response
            </p>
            <a 
              href={`tel:${location.emergencyContact.replace(/\s/g, '')}`}
              onClick={() => tracking.trackEmergencyContact('phone', region.name)}
            >
              <Button size="lg" className="gap-2">
                <Phone className="h-5 w-5" />
                {location.emergencyContact}
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
