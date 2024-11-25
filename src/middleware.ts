import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import i18nConfig, { Locale } from './config/i18n.config'

/**
 * Middleware function to handle locale-based routing
 * Redirects to default locale if no locale is present in the URL
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Debug: Log current request path
  console.log('[Middleware] Processing request for path:', pathname)

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale: Locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Debug: Log locale check result
  console.log('[Middleware] Path missing locale:', pathnameIsMissingLocale)

  if (pathnameIsMissingLocale) {
    const locale = i18nConfig.defaultLocale
    
    // Construct new URL, handling root path specially
    const newUrl = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    )

    // Debug: Log redirect URL
    console.log('[Middleware] Redirecting to:', newUrl.toString())

    return NextResponse.redirect(newUrl)
  }

  // Debug: Log when request is allowed to continue
  console.log('[Middleware] Request has locale, continuing...')
  return NextResponse.next()
}

// Configure which paths should be handled by middleware
export const config = {
  matcher: [
    // Exclude certain paths from locale handling
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ]
}
