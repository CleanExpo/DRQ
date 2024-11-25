"use client"

import { useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle, RefreshCcw } from "lucide-react"
import { tracking } from '@/lib/tracking'

export default function ServiceError({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string }
  reset: () => void
  params: { service: string }
}) {
  useEffect(() => {
    // Log the error
    tracking.trackErrorOccurrence(`service-page-${params.service}`, error.message);
  }, [error, params.service])

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', `${params.service}-error`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Error Message */}
      <Card className="max-w-2xl mx-auto bg-red-50 border-red-100 mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-2">
                We're experiencing technical difficulties
              </h2>
              <p className="text-red-600 mb-4">
                Our team has been notified and is working to resolve the issue. 
                For immediate assistance, please call our service line.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => reset()}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </Button>
                <a href="tel:1300309361" onClick={handleEmergencyCall}>
                  <Button className="gap-2">
                    <Phone className="h-4 w-4" />
                    1300 309 361
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Need Emergency Service?
          </h2>
          <p className="text-gray-600 mb-6">
            Our professional team is available 24/7
          </p>
          <div className="flex justify-center gap-4">
            <a href="tel:1300309361" onClick={handleEmergencyCall}>
              <Button size="lg" className="gap-2">
                <Phone className="h-5 w-5" />
                1300 309 361
              </Button>
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Professional restoration services available 24/7
          </p>
        </CardContent>
      </Card>

      {/* Service Overview */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">
          Our Services Include:
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-600">
          <ul className="space-y-2">
            <li>Water Damage Restoration</li>
            <li>Sewage Cleanup</li>
            <li>Mould Remediation</li>
          </ul>
          <ul className="space-y-2">
            <li>Commercial Services</li>
            <li>Emergency Response</li>
            <li>24/7 Availability</li>
          </ul>
        </div>
      </div>

      {/* Fixed Emergency Contact */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">
                24/7 Emergency Service
              </p>
              <a href="tel:1300309361" onClick={handleEmergencyCall}>
                <Button size="lg" className="gap-2">
                  <Phone className="h-5 w-5" />
                  1300 309 361
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
