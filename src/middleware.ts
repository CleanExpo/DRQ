import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { languages, defaultLanguage } from './config/languages';

const PUBLIC_FILE = /\.(.*)$/;

function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
  
  return header
    .split(',')
    .map(lang => lang.split(';')[0].trim())
    .filter(Boolean);
}

function getLocale(request: NextRequest): string {
  // Check if the URL already has a locale
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = pathname.split('/')[1];
  if (languages.some(lang => lang.code === pathnameLocale)) {
    return pathnameLocale;
  }

  // Get locale from cookie if available
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie?.value && languages.some(lang => lang.code === localeCookie.value)) {
    return localeCookie.value;
  }

  // Parse Accept-Language header
  const acceptLanguages = parseAcceptLanguage(
    request.headers.get('accept-language')
  );

  // Find first matching language
  const matchedLanguage = acceptLanguages.find(lang => 
    languages.some(supportedLang => 
      supportedLang.code.toLowerCase().startsWith(lang.toLowerCase())
    )
  );

  if (matchedLanguage) {
    const supportedLang = languages.find(lang => 
      lang.code.toLowerCase().startsWith(matchedLanguage.toLowerCase())
    );
    if (supportedLang) {
      return supportedLang.code;
    }
  }

  return defaultLanguage;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public files and API routes
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Get the locale
  const locale = getLocale(request);
  const pathnameLocale = pathname.split('/')[1];

  // Check if the URL already has a valid locale
  if (languages.some(lang => lang.code === pathnameLocale)) {
    // URL already has valid locale, continue
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale);
    return response;
  }

  // Redirect to URL with locale
  const newUrl = new URL(
    `/${locale}${pathname === '/' ? '' : pathname}`,
    request.url
  );

  // Copy search params
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  response.cookies.set('NEXT_LOCALE', locale);

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: Skip all files in the public folder
    '/((?!public).*)'
  ],
};
