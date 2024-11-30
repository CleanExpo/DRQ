import { Inter } from 'next/font/google'
import { mainNavigation, footerNavigation } from '../config/navigation'
import { siteMetadata } from '../config/metadata'
import { theme } from '../config/theme'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.title }],
  creator: siteMetadata.title,
  publisher: siteMetadata.title,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: siteMetadata.siteUrl,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" className={inter.className}>
      <body className="min-h-screen bg-white text-neutral-900">
        <div className="flex flex-col min-h-screen">
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary"
          >
            Skip to main content
          </a>

          {/* Header */}
          <header className="sticky top-0 z-40 w-full bg-white shadow-md">
            {/* Emergency Banner */}
            <div className="bg-secondary text-white text-center py-1 px-4">
              <p className="text-sm">
                24/7 Emergency Service - Call{' '}
                <a href="tel:1300309361" className="font-bold hover:underline">
                  1300 309 361
                </a>
              </p>
            </div>

            {/* Main Navigation */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Navigation content will be added here */}
            </nav>
          </header>

          {/* Main Content */}
          <main id="main-content" className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Footer content will be added here */}
            </div>

            {/* Copyright */}
            <div className="border-t border-neutral-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-neutral-400">
                <p>
                  © {new Date().getFullYear()} {siteMetadata.title}. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
