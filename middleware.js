import { NextResponse } from 'next/server'
import { CONTACT } from './src/constants/contact'

// Paths that don't require locale prefix
const PUBLIC_PATHS = [
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/manifest.json',
  '/assets',
  '/images',
]

// Paths that should be blocked from direct access
const BLOCKED_PATHS = [
  '/_next',
  '/api/_internal',
]

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Allow public files without locale
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Block access to internal paths
  if (BLOCKED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/404', request.url))
  }

  // Handle locale routing
  if (!pathname.startsWith('/en-AU') && pathname !== '/') {
    return NextResponse.redirect(new URL(`/en-AU${pathname}`, request.url))
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }

  // Add security headers to response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add business info headers
  response.headers.set('X-Business-Phone', CONTACT.PHONE)
  response.headers.set('X-Business-Email', CONTACT.EMAIL)
  response.headers.set('X-Business-Website', CONTACT.WEBSITE)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ routes that don't start with _internal
     * 2. /_next/ internal routes
     * 3. /_static (static files)
     * 4. /_vercel (deployment files)
     * 5. All files in /public
     */
    '/((?!api/(?!_internal)|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}
