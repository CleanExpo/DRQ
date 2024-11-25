"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, ArrowRight } from "lucide-react"
import Link from 'next/link'

const locations = [
  {
    region: "Brisbane",
    responseTime: "15-30 minutes",
    mainAreas: ["Brisbane CBD", "North Brisbane", "South Brisbane", "East Brisbane", "West Brisbane"],
    emergencyLevel: "Priority Response",
    color: "blue"
  },
  {
    region: "Gold Coast",
    responseTime: "20-40 minutes",
    mainAreas: ["Southport", "Surfers Paradise", "Broadbeach", "Robina", "Burleigh Heads"],
    emergencyLevel: "Standard Response",
    color: "yellow"
  }
];

export function LocationsOverview() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Service Areas</h2>
          <p className="text-gray-600">
            Fast emergency response available across South East Queensland
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {locations.map((location) => (
            <Card 
              key={location.region}
              className="group hover:shadow-xl transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className={`h-5 w-5 ${location.color === 'blue' ? 'text-blue-500' : 'text-yellow-500'}`} />
                  {location.region}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Response Time */}
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Response Time</div>
                    <div className="text-2xl font-bold text-blue-500">
                      {location.responseTime}
                    </div>
                  </div>
                </div>

                {/* Coverage Areas */}
                <div className="space-y-4 mb-6">
                  <div className="font-medium">Main Coverage Areas:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {location.mainAreas.map((area) => (
                      <div 
                        key={area}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${location.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Level */}
                <div className={`mb-6 p-3 rounded-lg ${
                  location.color === 'blue' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-yellow-50 text-yellow-700'
                } text-sm`}>
                  {location.emergencyLevel}
                </div>

                <Link href={`/locations/${location.region.toLowerCase()}`}>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 transition-colors duration-300"
                  >
                    View Coverage
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Area Checker */}
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">
              Check Your Service Area
            </h3>
            <p className="text-gray-600 mb-6">
              Enter your location to check response times and service availability
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Check Coverage
              </Button>
              <Button variant="outline">
                View All Locations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
