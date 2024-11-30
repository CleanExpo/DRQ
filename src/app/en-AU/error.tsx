'use client'

import React from 'react'
import ErrorBoundary from '../../components/shared/ErrorBoundary'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorBoundary error={error} reset={reset} />
}
