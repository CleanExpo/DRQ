import React from 'react'
import { LoadingNav } from '../../../components/shared/LoadingNav'
import { LoadingFooter } from '../../../components/shared/LoadingFooter'
import { LoadingService } from '../../../components/shared/LoadingService'

export default function ServiceLoadingPage() {
  return (
    <>
      <LoadingNav />
      <main className="flex-grow">
        <LoadingService />
      </main>
      <LoadingFooter />
    </>
  )
}
