"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, Award, Phone, CheckCircle } from "lucide-react"
import { tracking } from '@/lib/tracking'

interface ServiceFeaturesProps {
  serviceName?: string;
}

export function ServiceFeatures({ serviceName }: ServiceFeaturesProps) {
  const features = [
    {
      icon: Clock,
      title: "24/7 Response",
      description: "Available around the clock for emergencies"
    },
    {
      icon: Shield,
      title: "Licensed & Insured",
      description: "Fully certified professional service"
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "Satisfaction guaranteed on all work"
    },
    {
      icon: Phone,
      title: "Fast Response",
      description: "15-30 minute response times"
    }
  ];

  const handleFeatureView = (feature: string) => {
    if (serviceName) {
      tracking.trackInteraction('feature-view', `${serviceName}-${feature}`);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Card 
            key={feature.title} 
            className="hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => handleFeatureView(feature.title)}
          >
            <CardContent className="p-4 text-center">
              <Icon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface ServiceListProps {
  services: {
    title: string;
    description: string;
    features: string[];
  }[];
  accentColor?: string;
}

export function ServiceList({ services, accentColor = 'blue' }: ServiceListProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => (
        <Card key={service.title} className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>{service.title}</CardTitle>
            <p className="text-gray-600">{service.description}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface ServiceStatProps {
  stats: Array<{
    value: string;
    label: string;
  }>;
}

export function ServiceStats({ stats }: ServiceStatProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-6">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

interface ServiceProcessProps {
  steps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  accentColor?: string;
}

export function ServiceProcess({ steps, accentColor = 'blue' }: ServiceProcessProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {steps.map((step) => (
        <div key={step.step} className="flex gap-4 mb-6">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${accentColor}-100 text-${accentColor}-600 flex items-center justify-center font-bold`}>
            {step.step}
          </div>
          <div>
            <h3 className="font-semibold mb-1">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

interface ServiceGridProps {
  services: Array<{
    title: string;
    description: string;
    icon: any;
    points: string[];
  }>;
  accentColor?: string;
}

export function ServiceGrid({ services, accentColor = 'blue' }: ServiceGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => {
        const Icon = service.icon;
        return (
          <Card key={service.title} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="pt-6">
              <Icon className={`h-12 w-12 text-${accentColor}-500 mb-4`} />
              <h3 className="font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full bg-${accentColor}-500`} />
                    <span className="text-sm text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
