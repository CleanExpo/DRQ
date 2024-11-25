import { PageTemplate } from '@/app/[locale]/template'
import { Card } from "@/components/ui/card"

interface LocationTemplateProps {
  params: {
    locale: string
    location: string
  }
  location: {
    title: string
    description: string
    suburbs: string[]
    responseTime: string
  }
}

export function LocationTemplate({ params, location }: LocationTemplateProps) {
  const breadcrumbs = [
    { label: 'Locations', href: '/locations' },
    { label: location.title, href: `/locations/${params.location}` }
  ]

  return (
    <PageTemplate
      params={params}
      breadcrumbs={breadcrumbs}
      heading={`${location.title} Emergency Services`}
      subheading={location.description}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Location specific content */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Response Time</h2>
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {location.responseTime}
            </div>
            <p className="text-gray-600">
              Fast emergency response available 24/7
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Service Area</h2>
            <div className="grid grid-cols-2 gap-2">
              {location.suburbs.map((suburb) => (
                <div key={suburb} className="text-sm text-gray-600">
                  {suburb}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageTemplate>
  )
}
