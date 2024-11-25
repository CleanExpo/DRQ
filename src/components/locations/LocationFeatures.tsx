import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, MapPin, Phone } from "lucide-react"

interface LocationFeaturesProps {
  location: string;
  responseTime: string;
  serviceCenter: string;
}

export function LocationFeatures({ location, responseTime, serviceCenter }: LocationFeaturesProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="pt-6">
          <Clock className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">24/7 Availability</h3>
          <p className="text-sm text-gray-600">
            Round-the-clock emergency response in {location}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <MapPin className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Local Teams</h3>
          <p className="text-sm text-gray-600">
            Based in {serviceCenter} for rapid response
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Shield className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Licensed & Insured</h3>
          <p className="text-sm text-gray-600">
            Fully certified professional service
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Phone className="h-8 w-8 text-blue-500 mb-4" />
          <h3 className="font-bold mb-2">Quick Response</h3>
          <p className="text-sm text-gray-600">
            Average {responseTime} response time
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
