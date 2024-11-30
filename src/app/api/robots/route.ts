import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://disasterrecoveryqld.au';
    
    const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/api/sitemap

# Disallow patterns
Disallow: /api/*
Disallow: /_next/*
Disallow: /static/*
Disallow: /cdn-cgi/*
Disallow: /error
Disallow: /404
Disallow: /500

# Crawl delay
Crawl-delay: 1

# Host
Host: ${baseUrl}

# Additional rules for specific bots
User-agent: GPTBot
Disallow: /private/*
Disallow: /admin/*

User-agent: ChatGPT-User
Disallow: /private/*
Disallow: /admin/*

User-agent: AdsBot-Google
Allow: /

User-agent: Googlebot-Image
Allow: /images/
Allow: /public/images/
Disallow: /private/images/`;

    // Log robots.txt access
    logger.info('Robots.txt served', {
      timestamp: new Date().toISOString(),
      userAgent: headers().get('user-agent')
    });

    // Return robots.txt with proper headers
    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    logger.error('Robots.txt generation failed', error as Error);
    
    return new NextResponse('User-agent: *\nDisallow: /', {
      headers: {
        'Content-Type': 'text/plain',
      },
      status: 500,
    });
  }
}

// Get request headers
function headers() {
  return new Headers({
    'user-agent': 'Mozilla/5.0',
  });
}

// Revalidate robots.txt periodically
export const revalidate = 86400; // 24 hours

// Configure dynamic parameters
export const dynamic = 'force-dynamic';

// Configure runtime
export const runtime = 'nodejs';
