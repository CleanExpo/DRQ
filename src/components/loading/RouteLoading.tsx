"use client"

import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-blue-500 animate-[loading_2s_ease-in-out_infinite]" />
    </div>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    </div>
  )
}
