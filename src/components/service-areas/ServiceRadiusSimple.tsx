import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { serviceAreas, SERVICE_RADIUS } from "@/config/serviceAreas"
import { Clock, MapPin, Phone, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ServiceArea } from "@/types/serviceTypes"

interface ServiceRadiusSimpleProps {
  selectedAreaId?: string;
  className?: string;
}

export function ServiceRadiusSimple({ selectedAreaId, className }: ServiceRadiusSimpleProps) {
  const [activeTab, setActiveTab] = useState('coverage')
  const selectedArea = serviceAreas.find(area => area.id === selectedAreaId);

  const renderCoverageZone = (
    title: string,
    distance: string,
    responseTime: string,
    variant: 'destructive' | 'default' | 'secondary',
    bgColor: string
  ) => (
    <div className="relative">
      <div className={`w-full h-auto rounded-lg border p-4 ${bgColor}`}>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{distance}</p>
            </div>
            <Badge variant={variant}>{responseTime}</Badge>
          </div>
          {selectedArea && variant === 'destructive' && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Priority Response Available</AlertTitle>
              <AlertDescription>
                This area qualifies for rapid emergency response.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );

  const renderAreaDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>Response Time: {selectedArea?.emergencyInfo.responseTime}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>Coverage: {selectedArea?.coverage.primary.length} primary areas</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <a 
          href={`tel:${selectedArea?.emergencyInfo.phone}`}
          className="text-primary hover:underline"
        >
          {selectedArea?.emergencyInfo.phone}
        </a>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Service Coverage
          {selectedArea && (
            <Badge variant="outline">
              {selectedArea.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="coverage" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="coverage">Coverage Zones</TabsTrigger>
            <TabsTrigger value="details">Area Details</TabsTrigger>
          </TabsList>

          <TabsContent value="coverage" className="space-y-4">
            {renderCoverageZone(
              'Priority Response Zone',
              `0-${SERVICE_RADIUS.priority}km`,
              '15-30 min response',
              'destructive',
              'bg-red-50'
            )}
            {renderCoverageZone(
              'Standard Response Zone',
              `${SERVICE_RADIUS.priority}-${SERVICE_RADIUS.standard}km`,
              '30-45 min response',
              'default',
              'bg-blue-50'
            )}
            {renderCoverageZone(
              'Extended Response Zone',
              `${SERVICE_RADIUS.standard}-${SERVICE_RADIUS.extended}km`,
              '45-60 min response',
              'secondary',
              'bg-gray-50'
            )}
          </TabsContent>

          <TabsContent value="details">
            {selectedArea ? (
              <div className="space-y-6">
                {renderAreaDetails()}
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Covered Suburbs</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedArea.suburbs.map(suburb => (
                      <Badge 
                        key={suburb} 
                        variant="outline"
                        className="justify-start"
                      >
                        {suburb}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Alert>
                <AlertTitle>No Area Selected</AlertTitle>
                <AlertDescription>
                  Please select a service area to view details.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
