"use client"

import { useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle, RefreshCcw, Building2 } from "lucide-react"
import { tracking } from '@/lib/tracking'

export default function IndustryError({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string }
  reset: () => void
  params: { industry: string }
}) {
  useEffect(() => {
    // Log the error
    tracking.trackErrorOccurrence(`commercial-${params.industry}-page`, error.message);
  }, [error, params.industry])

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', `commercial-${params.industry}-error`);
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
                For immediate commercial assistance, please call our priority line.
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

      {/* Commercial Contact */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Commercial Services Support
          </h2>
          <p className="text-gray-600 mb-6">
            Our commercial response team is available 24/7
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
            Priority response for all commercial clients
          </p>
        </CardContent>
      </Card>

      {/* Service Overview */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">
          Our Commercial Services Include:
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-600">
          <ul className="space-y-2">
            <li>Office Buildings</li>
            <li>Retail Spaces</li>
            <li>Healthcare Facilities</li>
          </ul>
          <ul className="space-y-2">
            <li>Educational Institutions</li>
            <li>Industrial Facilities</li>
            <li>Strata Properties</li>
          </ul>
        </div>
      </div>

      {/* Fixed Emergency Contact */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">
                24/7 Commercial Response
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
