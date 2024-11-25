"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  ShoppingBag, 
  Hospital, 
  GraduationCap,
  Factory,
  Building, // Changed from Buildings
  Phone 
} from "lucide-react"
import Link from 'next/link'
import { tracking } from '@/lib/tracking'
import { analytics } from '@/lib/analytics'
import { routes } from '@/config/routes'

const industries = [
  {
    title: "Office Buildings",
    icon: Building2,
    href: routes.services.commercial.industries.office,
    description: "Comprehensive restoration services for office buildings and corporate spaces.",
    features: [
      "24/7 Emergency Response",
      "Minimal Business Disruption",
      "Full Documentation",
      "Insurance Liaison"
    ]
  },
  {
    title: "Retail Spaces",
    icon: ShoppingBag,
    href: routes.services.commercial.industries.retail,
    description: "Specialized solutions for retail locations and shopping centers.",
    features: [
      "After-hours Service",
      "Stock Protection",
      "Rapid Reopening",
      "Brand Protection"
    ]
  },
  {
    title: "Healthcare Facilities",
    icon: Hospital,
    href: routes.services.commercial.industries.healthcare,
    description: "Expert services for hospitals and medical facilities.",
    features: [
      "Sterile Environment",
      "Code Compliance",
      "Infection Control",
      "Patient Safety"
    ]
  },
  {
    title: "Educational Institutions",
    icon: GraduationCap,
    href: routes.services.commercial.industries.education,
    description: "Restoration services for schools and educational facilities.",
    features: [
      "Holiday Period Work",
      "Safety Protocols",
      "Budget Planning",
      "Prevention Programs"
    ]
  },
  {
    title: "Industrial Facilities",
    icon: Factory,
    href: routes.services.commercial.industries.industrial,
    description: "Solutions for manufacturing and industrial spaces.",
    features: [
      "Equipment Protection",
      "Environmental Compliance",
      "Production Line Safety",
      "Workflow Integration"
    ]
  },
  {
    title: "Strata Properties",
    icon: Building, // Changed from Buildings
    href: routes.services.commercial.industries.strata,
    description: "Specialized services for strata and multi-unit properties.",
    features: [
      "Common Area Management",
      "Body Corporate Liaison",
      "Resident Communication",
      "Preventive Maintenance"
    ]
  }
];

export default function CommercialPage() {
  // Track page view
  if (typeof window !== 'undefined') {
    analytics.trackPageView('/services/commercial');
  }

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', 'commercial');
  };

  const handleIndustryClick = (industry: string) => {
    tracking.trackInteraction('industry-selection', industry);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Commercial Restoration Services
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional restoration solutions for businesses across South East Queensland.
          24/7 emergency response available.
        </p>
        <a href="tel:1300309361" onClick={handleEmergencyCall}>
          <Button size="lg" className="gap-2">
            <Phone className="h-5 w-5" />
            1300 309 361
          </Button>
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {industries.map((industry) => {
          const Icon = industry.icon;
          return (
            <Link 
              href={industry.href} 
              key={industry.title}
              onClick={() => handleIndustryClick(industry.title)}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Icon className="h-12 w-12 text-blue-500 mb-4" />
                  <CardTitle>{industry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{industry.description}</p>
                  <ul className="space-y-2">
                    {industry.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Commercial Service Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Choose Our Commercial Services?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "24/7 Priority Response",
              description: "Dedicated commercial response team available around the clock"
            },
            {
              title: "Business Continuity",
              description: "Minimizing disruption to your operations is our priority"
            },
            {
              title: "Industry Compliance",
              description: "Meeting all relevant industry standards and regulations"
            }
          ].map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
