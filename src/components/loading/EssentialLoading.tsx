"use client"

import { Loader2 } from "lucide-react"

export const LoadingStates = {
  // Emergency Contact Loading
  EmergencyButton: () => (
    <div className="animate-pulse flex items-center justify-center h-12 bg-red-100 rounded-md">
      <Loader2 className="h-6 w-6 text-red-600 animate-spin" />
    </div>
  ),

  // Service Area Loading
  ServiceArea: () => (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  ),

  // Navigation Loading
  TopNav: () => (
    <div className="h-1 bg-blue-500 animate-[loading_1s_ease-in-out_infinite]" />
  )
}
