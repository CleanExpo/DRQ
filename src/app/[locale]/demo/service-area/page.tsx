"use client";

import { ServiceAreaSelector } from '../../../../components/service-areas/ServiceAreaSelector'
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert"
import { Info } from "lucide-react"

export default function ServiceAreaDemo() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Service Areas</h1>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Coverage Information</AlertTitle>
        <AlertDescription>
          Select your area to see emergency response times and availability.
        </AlertDescription>
      </Alert>

      <div className="mt-8">
        <ServiceAreaSelector />
      </div>
    </div>
  )
}
