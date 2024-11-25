"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Clock } from "lucide-react"
import { locationStructure } from '@/config/locations'
import { tracking } from '@/lib/tracking'

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Emergency contact tracking
  const handleEmergencyCall = () => {
    const currentLocation = pathname.split('/')[3] || 'general'
    tracking.trackEmergencyContact('phone', currentLocation)
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

      {/* Quick Location Links */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {Object.entries(locationStructure).map(([id, location]) => (
              <Link key={id} href={`/locations/${id}`}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={pathname.includes(`/locations/${id}`) ? 'bg-blue-50 text-blue-700' : ''}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {location.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {children}

      {/* Service Coverage Footer */}
      <div className="bg-gray-50 border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">24/7 Emergency Service</h3>
                    <p className="text-sm text-gray-600">
                      Available all hours, every day of the year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Local Teams</h3>
                    <p className="text-sm text-gray-600">
                      Strategically located for rapid response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Quick Response</h3>
                    <p className="text-sm text-gray-600">
                      15-45 minute average response time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
