"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Wrench, AlertTriangle, Shield } from "lucide-react"
import { serviceStructure } from '@/config/services'
import { tracking } from '@/lib/tracking'

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Emergency contact tracking
  const handleEmergencyCall = () => {
    const currentService = pathname.split('/')[3] || 'general'
    tracking.trackEmergencyContact('phone', currentService)
  }

  return (
    <div className="min-h-screen">
      {/* Emergency Banner */}
      <div className="bg-red-50 py-2 px-4 text-center sticky top-0 z-50 border-b border-red-100">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm text-red-800 hidden md:block">
            24/7 Emergency Service Available
          </p>
          <a 
            href="tel:1300309361"
            onClick={handleEmergencyCall}
            className="text-sm font-semibold text-red-800 hover:text-red-900 flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            1300 309 361
          </a>
          <p className="text-sm text-red-800 hidden md:block">
            Rapid Response Teams
          </p>
        </div>
      </div>

      {/* Service Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {Object.entries(serviceStructure).map(([id, service]) => (
              <Link key={id} href={`/services/${id}`}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={pathname.includes(`/services/${id}`) ? 'bg-blue-50 text-blue-700' : ''}
                >
                  {service.emergency ? (
                    <AlertTriangle className="h-4 w-4 mr-1" />
                  ) : (
                    <Wrench className="h-4 w-4 mr-1" />
                  )}
                  {service.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {children}

      {/* Service Features Footer */}
      <div className="bg-gray-50 border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Emergency Response</h3>
                    <p className="text-sm text-gray-600">
                      24/7 emergency service with rapid response teams
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Licensed & Insured</h3>
                    <p className="text-sm text-gray-600">
                      Fully qualified and certified technicians
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Wrench className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Professional Service</h3>
                    <p className="text-sm text-gray-600">
                      Industry-leading equipment and techniques
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href="tel:1300309361"
          onClick={handleEmergencyCall}
        >
          <Button size="lg" className="rounded-full shadow-lg gap-2">
            <Phone className="h-5 w-5" />
            <span className="hidden sm:inline">1300 309 361</span>
          </Button>
        </a>
      </div>
    </div>
  )
}
