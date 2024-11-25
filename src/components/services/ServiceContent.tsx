import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Clock, MapPin, Check } from "lucide-react"
import { Service } from "@/config/services"
import { EmergencyResponseTimer, ServiceStats, EmergencyContactButton } from "./InteractiveFeatures"

interface ServiceContentProps {
  service: Service
}

export function ServiceContent({ service }: ServiceContentProps) {
  const Icon = service.icon
  const stats = [
    {
      label: "Response Time",
      value: "15-30 min",
      icon: Clock
    },
    {
      label: "Service Areas",
      value: "SEQ",
      icon: MapPin
    },
    {
      label: "Availability",
      value: "24/7",
      icon: Clock
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className={`bg-${service.color}-50 rounded-lg p-8`}>
        <div className="max-w-3xl">
          <div className={`inline-flex items-center gap-2 text-${service.color}-600 mb-4`}>
            <Icon className="h-6 w-6" />
            <span className="font-semibold">Professional Service</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {service.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {service.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <EmergencyContactButton />
            <Button variant="outline" size="lg" className="gap-2">
              Request Service
            </Button>
          </div>
        </div>
      </section>

      {/* Service Stats */}
      <ServiceStats stats={stats} />

      {/* Features & Benefits */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Features */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Our Services Include</h2>
            <ul className="space-y-4">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className={`h-5 w-5 text-${service.color}-500 mt-1`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
            <ul className="space-y-4">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Check className={`h-5 w-5 text-${service.color}-500 mt-1`} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Response Time */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Emergency Response Time</h2>
          <EmergencyResponseTimer initialTime={30} />
        </CardContent>
      </Card>
    </div>
  )
}
