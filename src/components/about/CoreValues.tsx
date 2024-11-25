"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Users, Award } from "lucide-react"

const VALUES = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Round-the-clock emergency response for when disaster strikes"
  },
  {
    icon: Shield,
    title: "Professional Service",
    description: "Fully certified technicians and industry-leading equipment"
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Focused on minimizing disruption and maximizing satisfaction"
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Industry-leading practices and proven restoration methods"
  }
] as const

export function CoreValues() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {VALUES.map((value, index) => {
        const Icon = value.icon
        return (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <Icon className="h-12 w-12 mb-4 mx-auto text-blue-500" />
              <h3 className="font-bold mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
