import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight } from "lucide-react"
import Link from 'next/link'

interface IndustryCardProps {
  title: string
  services: readonly string[]
  href: string
}

export function IndustryCard({ title, services, href }: IndustryCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <Building2 className="h-8 w-8 text-blue-500 mb-2" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {services.slice(0, 3).map((service, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="h-4 w-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {service}
            </li>
          ))}
        </ul>
        <Link href={href}>
          <Button variant="outline" className="w-full group">
            Learn More
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
