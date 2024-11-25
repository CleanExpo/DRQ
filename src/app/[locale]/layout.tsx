"use client"

import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { MainNav } from '@/components/layout/MainNav'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageTransition } from '@/components/motion/PageTransition'
import { EmergencyNav, EmergencyHeader, MobileMenu } from '@/components/navigation/EssentialNav'
import { LoadingStates } from '@/components/loading/EssentialLoading'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          {/* Emergency Header */}
          <EmergencyHeader />
          
          {/* Navigation Bar */}
          <div className="sticky top-0 z-50 bg-white border-b">
            <div className="container mx-auto px-4 flex items-center justify-between h-16">
              {/* Mobile Menu */}
              <MobileMenu />
              
              {/* Main Navigation */}
              <MainNav />
              
              {/* Navigation Progress */}
              <div className="absolute bottom-0 left-0 right-0">
                <LoadingStates.TopNav />
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1">
            <div className="container mx-auto px-4">
              {/* Breadcrumb Navigation */}
              <Breadcrumb />
              
              {/* Page Content */}
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>

          {/* Footer */}
          <Footer />

          {/* Emergency Navigation */}
          <EmergencyNav />
        </div>
      </body>
    </html>
  )
}
