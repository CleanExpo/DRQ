"use client"

import { ErrorBoundary } from '@/components/errors/ErrorBoundary'

export function RootErrorBoundary({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary
      error={new Error()}
      reset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  )
}
