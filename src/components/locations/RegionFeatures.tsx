"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, MapPin, Phone, CheckCircle } from "lucide-react"
import { tracking } from "@/lib/tracking"
import { type Region } from "@/config/locations"

interface RegionFeaturesProps {
  region: Region
  serviceCenter: string
}

export function RegionFeatures({ region, serviceCenter }: RegionFeaturesProps) {
  // Track when response time is viewed
  const handleResponseTimeView = () => {
    tracking.trackResponseTime(region.name, region.responseTime);
  };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Response Time */}
      <Card className="hover:shadow-lg transition-all duration-300" onMouseEnter={handleResponseTimeView}>
        <CardContent className="pt-6">
          <Clock className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Response Time</h3>
          <p className="text-sm text-gray-600">
            Average {region.responseTime} in {region.name}
          </p>
        </CardContent>
      </Card>

      {/* Local Teams */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <MapPin className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Local Teams</h3>
          <p className="text-sm text-gray-600">
            Based in {serviceCenter} for rapid response
          </p>
        </CardContent>
      </Card>

      {/* Service Features */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <Shield className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Service Features</h3>
          <ul className="space-y-1">
            {region.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Coverage Area */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <Phone className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Coverage Area</h3>
          <p className="text-sm text-gray-600">
            Servicing {region.suburbs.length} suburbs in {region.name}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function RegionSuburbs({ region }: { region: Region }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {region.suburbs.map((suburb) => (
        <Card key={suburb} className="hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{suburb}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Response Time: {region.responseTime}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function RegionStats({ region }: { region: Region }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-6">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">{region.suburbs.length}</div>
        <div className="text-sm text-gray-600">Suburbs Covered</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">{region.responseTime.split('-')[0]}</div>
        <div className="text-sm text-gray-600">Min Response</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">24/7</div>
        <div className="text-sm text-gray-600">Availability</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">{region.features.length}</div>
        <div className="text-sm text-gray-600">Key Features</div>
      </div>
    </div>
  )
}
