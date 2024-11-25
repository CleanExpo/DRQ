"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-1 bg-blue-500 rounded-full max-w-[200px] mx-auto"
        />
      </motion.div>
    </div>
  )
}

export function ContentLoader() {
  return (
    <div className="space-y-4">
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
          transition: { duration: 1.5, repeat: Infinity }
        }}
      >
        <div className="h-8 bg-gray-200 rounded-md w-3/4" />
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mt-2" />
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.5, 1, 0.5],
              transition: { 
                duration: 1.5, 
                repeat: Infinity,
                delay: i * 0.2
              }
            }}
            className="h-32 bg-gray-200 rounded-lg"
          />
        ))}
      </div>
    </div>
  )
}

export function NavigationLoader() {
  return (
    <motion.div 
      className="h-1 bg-blue-500"
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.8 }}
    />
  )
}
