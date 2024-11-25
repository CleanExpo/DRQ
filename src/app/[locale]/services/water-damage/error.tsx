"use client"

import { useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, AlertTriangle, RefreshCcw } from "lucide-react"
import { tracking } from '@/lib/tracking'

export default function WaterDamageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error
    tracking.trackErrorOccurrence('water-damage-page', error.message);
  }, [error])

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', 'water-damage-error');
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
                For immediate assistance, please call our emergency line.
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
            Need Emergency Water Damage Restoration?
          </h2>
          <p className="text-gray-600 mb-6">
            Don't wait - our team is available 24/7 for immediate response
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
            Available 24/7 for emergency water damage restoration
          </p>
        </CardContent>
      </Card>

      {/* Basic Service Information */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">
          Our Water Damage Services Include:
        </h3>
        <ul className="text-gray-600 space-y-2">
          <li>Emergency Water Extraction</li>
          <li>Flood Cleanup</li>
          <li>Structural Drying</li>
          <li>Contents Restoration</li>
          <li>24/7 Emergency Response</li>
        </ul>
      </div>
    </div>
  )
}
