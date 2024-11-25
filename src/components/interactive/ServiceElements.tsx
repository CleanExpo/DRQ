"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Phone, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Loader2 
} from "lucide-react"

interface ResponseTimerProps {
  initialMinutes: number
  onComplete?: () => void
}

export function ResponseTimer({ initialMinutes, onComplete }: ResponseTimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes)
  const [loading, setLoading] = useState(false)

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-full" />
      </div>
    )
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {minutes > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-4xl font-bold text-blue-500"
          >
            {minutes}:00
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-2 text-sm text-gray-600">
        Estimated response time
      </div>
    </div>
  )
}

export function EmergencyContact() {
  const [isLoading, setIsLoading] = useState(false)
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false)

  const handleEmergencyClick = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowEmergencyInfo(true)
    setIsLoading(false)
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <AnimatePresence>
          {showEmergencyInfo ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                Emergency services dispatched
              </Alert>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button 
          className="w-full relative"
          onClick={handleEmergencyClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency Service
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export function LocationSelector() {
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Your Location</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Brisbane CBD', 'North Brisbane', 'South Brisbane', 'Gold Coast'].map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedLocation(location)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {location}
              </Button>
            ))}
          </div>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-600"
            >
              Selected area: {selectedLocation}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
