import { Metadata } from 'next'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FadeInStagger, FadeIn } from '@/components/motion/AnimatedElements'
import { ServiceHeaderLoading, ServiceContentLoading } from '@/components/loading/ServiceLoading'
import { ResponseTimer, EmergencyContact } from '@/components/interactive/ServiceElements'
import services from '@/config/services'

export const metadata: Metadata = {
  title: 'Residential Water Damage Restoration | Disaster Recovery QLD',
  description: 'Professional water damage restoration services for homes and residential properties in Brisbane & Gold Coast.',
}

const residentialServices = [
  {
    title: 'Flood Cleanup',
    description: 'Complete flood water removal and cleanup services for residential properties.',
    features: [
      'Water extraction',
      'Structural drying',
      'Content restoration',
      'Dehumidification'
    ]
  },
  {
    title: 'Burst Pipe Response',
    description: 'Emergency response for burst pipes and plumbing failures.',
    features: [
      'Rapid response',
      'Water damage control',
      'Pipe repair coordination',
      'Property protection'
    ]
  },
  {
    title: 'Storm Damage',
    description: 'Comprehensive storm and rain damage restoration services.',
    features: [
      'Emergency boarding',
      'Water extraction',
      'Structural drying',
      'Content protection'
    ]
  }
]

export default function WaterDamageResidentialPage() {
  const service = services['water-damage']
  const Icon = service.icon

  return (
    <main className="container mx-auto px-4 py-12">
      <Suspense fallback={<ServiceHeaderLoading />}>
        <FadeIn>
          <div className="inline-flex items-center gap-2 text-blue-600 mb-4">
            <Icon className="h-6 w-6" />
            <span className="font-semibold">Residential Services</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Residential Water Damage Restoration</h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional water damage restoration services for homes and residential properties.
            Fast response times and expert solutions for all types of water damage.
          </p>
        </FadeIn>
      </Suspense>

      <div className="mt-12">
        <Suspense fallback={<ServiceContentLoading />}>
          <FadeInStagger>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Residential Services */}
                <div className="grid gap-8 mb-12">
                  {residentialServices.map((item, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                        <p className="text-gray-600">{item.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid md:grid-cols-2 gap-4">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Benefits */}
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold">Why Choose Us</h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid md:grid-cols-2 gap-4">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <FadeIn delay={0.2}>
                  <EmergencyContact />
                </FadeIn>
                <FadeIn delay={0.4}>
                  <ResponseTimer initialMinutes={30} />
                </FadeIn>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
                    <ul className="space-y-2">
                      {['Brisbane CBD', 'North Brisbane', 'South Brisbane', 'Gold Coast'].map((area) => (
                        <li key={area} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </FadeInStagger>
        </Suspense>
      </div>
    </main>
  )
}
