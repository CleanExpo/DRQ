"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Droplets, Flame, Bug } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "Water Damage",
    description: "Emergency water extraction, flood cleanup, and structural drying services.",
    icon: Droplets,
    href: "/services/water-damage",
    color: "text-blue-500",
    features: [
      "24/7 Emergency Response",
      "Flood Cleanup",
      "Structural Drying",
      "Moisture Detection"
    ]
  },
  {
    title: "Fire Damage",
    description: "Professional fire and smoke damage restoration and cleanup services.",
    icon: Flame,
    href: "/services/fire-damage",
    color: "text-red-500",
    features: [
      "Fire Damage Restoration",
      "Smoke Removal",
      "Odour Control",
      "Content Cleaning"
    ]
  },
  {
    title: "Mould Remediation",
    description: "Expert mould detection, removal, and prevention services.",
    icon: Bug,
    href: "/services/mould-remediation",
    color: "text-green-500",
    features: [
      "Mould Inspection",
      "Safe Removal",
      "Prevention",
      "Air Quality Testing"
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export function ServicesHighlight() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Emergency Restoration Services
          </motion.h2>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Professional disaster recovery services available 24/7 across South East Queensland.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            
            return (
              <motion.div key={service.title} variants={cardVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className={`h-8 w-8 ${service.color} mb-2`} />
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <svg
                            className={`h-4 w-4 ${service.color}`}
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
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={service.href}>
                      <Button variant="outline" className="w-full group">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/services">
            <Button size="lg">
              View All Services
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
