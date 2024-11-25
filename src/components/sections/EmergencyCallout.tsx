"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Phone, Clock, MapPin } from "lucide-react"

export function EmergencyCallout() {
  return (
    <section className="py-12 bg-gradient-to-r from-red-50 to-red-100">
      <div className="container mx-auto px-4">
        <Card className="bg-white/50 backdrop-blur border-red-100">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Emergency Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">24/7 Emergency Response</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900">
                Need Immediate Assistance?
              </h2>
              
              <p className="text-gray-600">
                Our emergency response team is available 24/7 for water damage, 
                fire damage, and mould remediation services across Brisbane and 
                Gold Coast.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2">
                  <Phone className="h-5 w-5" />
                  1300 309 361
                </Button>
                <Button variant="outline" size="lg">
                  Request Service
                </Button>
              </div>
            </div>

            {/* Response Times */}
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900">
                Emergency Response Times:
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-medium">Brisbane CBD & Inner Suburbs</div>
                    <div className="text-sm text-gray-600">15-30 minute response</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/80 p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium">Greater Brisbane Area</div>
                    <div className="text-sm text-gray-600">30-45 minute response</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/80 p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-medium">Gold Coast Region</div>
                    <div className="text-sm text-gray-600">45-60 minute response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
