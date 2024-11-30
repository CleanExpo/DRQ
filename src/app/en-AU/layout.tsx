import React from 'react'
import { Metadata } from 'next'
import { siteMetadata } from '../../config/metadata'
import { Navigation } from '../../components/shared/Navigation'
import { Footer } from '../../components/shared/Footer'

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    ...siteMetadata.openGraph,
    locale: 'en_AU',
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
    languages: {
      'en-AU': '/en-AU',
    },
  },
}

interface LocaleLayoutProps {
  children: React.ReactNode
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  )
}
