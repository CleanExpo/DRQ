import { PageTemplate } from '@/app/[locale]/template'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ServiceAreaSelector } from "@/components/service-areas"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

interface ServiceTemplateProps {
  params: {
    locale: string
    service: string
  }
  service: {
    title: string
    description: string
    features: string[]
    process: {
      title: string
      steps: string[]
    }[]
  }
}

export function ServiceTemplate({ params, service }: ServiceTemplateProps) {
  const breadcrumbs = [
    { label: 'Services', href: '/services' },
    { label: service.title, href: `/services/${params.service}` }
  ]

  return (
    <PageTemplate
      params={params}
      breadcrumbs={breadcrumbs}
      heading={service.title}
      subheading={service.description}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="process">Our Process</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="process">
              <Card className="p-6">
                {service.process.map((phase, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card className="p-6">
                {/* FAQ content */}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Emergency Service</h2>
            <p className="text-gray-600 mb-4">
              Available 24/7 for urgent {service.title.toLowerCase()} situations.
            </p>
            <Button size="lg" className="w-full gap-2">
              <Phone className="h-5 w-5" />
              1300 309 361
            </Button>
          </Card>

          <ServiceAreaSelector />
        </div>
      </div>
    </PageTemplate>
  )
}
