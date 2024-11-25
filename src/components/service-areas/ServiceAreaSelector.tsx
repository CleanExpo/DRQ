"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, CheckCircle, XCircle } from "lucide-react"
import { isSuburbServiced, getResponseTime } from '@/config/locations'
import { tracking } from '@/lib/tracking'

export function ServiceAreaSelector() {
  const [suburb, setSuburb] = useState('')
  const [searchResult, setSearchResult] = useState<{
    serviced: boolean
    responseTime?: string | null
  } | null>(null)

  const handleCheck = () => {
    if (!suburb) return

    const result = isSuburbServiced(suburb)
    const responseTime = result.serviced ? getResponseTime(suburb) : null

    setSearchResult({
      serviced: result.serviced,
      responseTime
    })

    // Track the search
    tracking.trackServiceArea(suburb, result.serviced)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter your suburb"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleCheck}>
              Check Coverage
            </Button>
          </div>

          {/* Search Result */}
          {searchResult && (
            <div className={`p-4 rounded-lg ${
              searchResult.serviced ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-start gap-3">
                {searchResult.serviced ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-green-800">
                        We service {suburb}!
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-green-700">
                        <Clock className="h-4 w-4" />
                        <span>Response Time: {searchResult.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-green-700">
                        <MapPin className="h-4 w-4" />
                        <span>Local teams available</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-red-800">
                        Sorry, we don't currently service {suburb}
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        Please contact us to discuss your options or check another suburb.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="text-sm text-gray-600">
            Popular areas:
            <div className="flex flex-wrap gap-2 mt-2">
              {['Brisbane CBD', 'Gold Coast', 'Ipswich', 'Logan'].map((area) => (
                <Button
                  key={area}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSuburb(area)
                    handleCheck()
                  }}
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
