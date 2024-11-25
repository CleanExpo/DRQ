"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const locationGroups = [
  {
    region: "Brisbane",
    description: "Fast response throughout Greater Brisbane",
    responseTime: "15-30 minutes",
    areas: ["Brisbane CBD", "North Brisbane", "South Brisbane", "East Brisbane", "West Brisbane"]
  },
  {
    region: "Gold Coast",
    description: "Servicing the entire Gold Coast region",
    responseTime: "20-40 minutes",
    areas: ["Gold Coast North", "Gold Coast Central", "Gold Coast South"]
  }
];

export function LocationsHighlight() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Service Areas</h2>
          <p className="text-gray-600">
            Professional disaster recovery services available across South East Queensland
          </p>
        </motion.div>

        {/* Location Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {locationGroups.map((location, index) => (
            <motion.div
              key={location.region}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    {location.region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{location.description}</p>
                  <div className="bg-slate-50 p-4 rounded-lg mb-6">
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold text-blue-500">
                      {location.responseTime}
                    </p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {location.areas.map((area) => (
                      <li key={area} className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="h-4 w-4 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {area}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/locations/${location.region.toLowerCase()}`}>
                    <Button variant="outline" className="w-full group">
                      View Coverage
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/service-areas">
            <Button size="lg">
              Check Your Area Coverage
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
