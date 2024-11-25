"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ErrorSuggestionEngine } from '@/lib/errorSuggestions'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Log error to your error reporting service
    console.error('Page Error:', error)
  }, [error])

  // Get route suggestions if it's a navigation error
  const suggestions = ErrorSuggestionEngine.findSimilarRoutes(pathname)
  const errorMessage = ErrorSuggestionEngine.getErrorMessage(pathname)

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong!</h2>
          <p className="text-sm text-red-600">
            {errorMessage}
          </p>
        </div>

        <div className="space-y-4">
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Did you mean:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(suggestion.path)}
                  >
                    {suggestion.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => reset()}>
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
