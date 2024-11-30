import React from 'react'
import { LoadingNav } from '../../components/shared/LoadingNav'
import { LoadingFooter } from '../../components/shared/LoadingFooter'
import { LoadingHome } from '../../components/shared/LoadingHome'

export default function LoadingPage() {
  return (
    <>
      <LoadingNav />
      <main className="flex-grow">
        <LoadingHome />
      </main>
      <LoadingFooter />
    </>
  )
}
