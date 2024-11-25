"use client"

import { useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle, RefreshCcw } from "lucide-react"
import { tracking } from '@/lib/tracking'

export default function MouldRemediationError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error
    tracking.trackErrorOccurrence('mould-remediation-page', error.message);
  }, [error])

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', 'mould-remediation-error');
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
                For immediate mould assessment, please call our service line.
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

      {/* Contact Information */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Need Mould Inspection?
          </h2>
          <p className="text-gray-600 mb-6">
            Our professional team is ready to help with your mould concerns
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
            Professional mould inspection and remediation services
          </p>
        </CardContent>
      </Card>

      {/* Basic Service Information */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">
          Our Mould Remediation Services Include:
        </h3>
        <ul className="text-gray-600 space-y-2">
          <li>Professional Mould Inspection</li>
          <li>Safe Mould Removal</li>
          <li>Air Quality Testing</li>
          <li>Prevention Strategies</li>
          <li>Health & Safety Protocols</li>
        </ul>
      </div>
    </div>
  )
}
