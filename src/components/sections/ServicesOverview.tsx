"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from "lucide-react"
import Link from 'next/link'
import services from '@/config/services'

export function ServicesOverview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600">
            Professional restoration services available 24/7 across South East Queensland.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(services).map(([slug, service]) => {
            const Icon = service.icon;
            const serviceFeatures = service.categories.residential.services.slice(0, 3);
            
            return (
              <Card 
                key={slug} 
                className="relative overflow-hidden group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`absolute right-0 top-0 w-32 h-32 rounded-bl-full opacity-10 bg-${service.color}-50`} />
                <CardHeader>
                  <Icon className={`h-12 w-12 text-${service.color}-500 mb-4`} />
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {serviceFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <svg
                          className={`h-4 w-4 text-${service.color}-500`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${slug}`}>
                    <Button 
                      variant="outline" 
                      className="w-full group transform transition-all duration-300 hover:scale-[1.02]"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  )
}
