"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock, MapPin } from "lucide-react"
import { locationStructure } from '@/config/locations'

interface SuburbResult {
  found: boolean;
  region?: string;
  location?: string;
  responseTime?: string;
  suburbs?: string[];
}

export function SuburbChecker() {
  const [searchTerm, setSearchTerm] = useState('')
  const [result, setResult] = useState<SuburbResult | null>(null)

  const checkSuburb = (suburb: string) => {
    let found = false;
    let resultData: SuburbResult = { found: false };

    for (const [locationId, location] of Object.entries(locationStructure)) {
      for (const region of location.regions) {
        if (region.suburbs.some(s => s.toLowerCase() === suburb.toLowerCase())) {
          found = true;
          resultData = {
            found: true,
            region: region.name,
            location: location.name,
            responseTime: region.responseTime,
            suburbs: [...region.suburbs] // Spread the readonly array into a new mutable array
          };
          break;
        }
      }
      if (found) break;
    }

    setResult(resultData);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Enter your suburb..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              checkSuburb(searchTerm);
            }
          }}
        />
      </div>
      <Button 
        className="w-full"
        onClick={() => checkSuburb(searchTerm)}
      >
        Check Coverage
      </Button>

      {result && (
        <Card className={result.found ? 'border-green-500' : 'border-red-500'}>
          <CardContent className="pt-6">
            {result.found ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-500">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Service Available</span>
                </div>
                <div>
                  <p className="font-medium">{result.location}</p>
                  <p className="text-sm text-gray-600">{result.region}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Response Time: {result.responseTime}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-red-500">
                <p className="font-medium">Suburb not found in coverage area</p>
                <p className="text-sm mt-2">
                  Please contact us to discuss service availability
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
