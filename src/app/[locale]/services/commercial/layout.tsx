"use client"

import { usePathname } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Building2 } from "lucide-react"
import { tracking } from '@/lib/tracking'
import { isCommercialPath } from '@/config/routes'

interface CommercialLayoutProps {
  children: React.ReactNode;
}

export default function CommercialLayout({ children }: CommercialLayoutProps) {
  const pathname = usePathname()

  const handleEmergencyCall = () => {
    tracking.trackEmergencyContact('phone', 'commercial');
  };

  return (
    <div className="min-h-screen">
      {/* Commercial Services Banner */}
      {isCommercialPath(pathname) && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">
                  Commercial & Industrial Services
                </span>
              </div>
              <a href="tel:1300309361" onClick={handleEmergencyCall}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  1300 309 361
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">
                24/7 Commercial Response
              </p>
              <a href="tel:1300309361" onClick={handleEmergencyCall}>
                <Button size="lg" className="gap-2">
                  <Phone className="h-5 w-5" />
                  1300 309 361
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {children}
    </div>
  )
}
