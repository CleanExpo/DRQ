"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Phone, MapPin } from "lucide-react"

interface EmergencyResponseProps {
  initialTime: number
}

export function EmergencyResponseTimer({ initialTime }: EmergencyResponseProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Average Response Time</span>
        <span className="text-sm text-muted-foreground">{timeLeft} min</span>
      </div>
      <Progress value={((initialTime - timeLeft) / initialTime) * 100} />
    </div>
  )
}

interface ServiceStat {
  label: string
  value: string
  icon: typeof Clock
}

export function ServiceStats({ stats }: { stats: ServiceStat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white rounded-lg shadow-sm border"
          >
            <Icon className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-sm font-medium text-gray-600">
              {stat.label}
            </div>
            <div className="text-2xl font-bold">
              {stat.value}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export function EmergencyContactButton() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Button
      size="lg"
      className="w-full relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0 flex items-center justify-center bg-red-600"
          >
            <Phone className="h-5 w-5 mr-2" />
            1300 309 361
          </motion.div>
        ) : (
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            Call Now
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
