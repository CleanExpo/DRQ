const path = require('path')
const { PAGES } = require('../config/pages')
const { SERVICES } = require('../constants/services')
const { SERVICE_AREAS } = require('../constants/areas')

function generateSitemap(baseUrl) {
  const urls = []
  const today = new Date().toISOString().split('T')[0]

  // Add all pages from the PAGES config
  Object.values(PAGES).forEach(page => {
    urls.push({
      url: `${baseUrl}${page.path}`,
      lastmod: today,
      changefreq: getChangeFreq(page.path),
      priority: getPriority(page.path)
    })
  })

  // Add any dynamic routes
  SERVICES.forEach(service => {
    urls.push({
      url: `${baseUrl}${service.href}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8
    })
  })

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`

  return xml
}

function getChangeFreq(path) {
  if (path === '/en-AU') return 'daily'
  if (path.includes('/blog')) return 'daily'
  if (path.includes('/emergency')) return 'always'
  if (path.includes('/services/')) return 'weekly'
  if (path.includes('/testimonials')) return 'weekly'
  if (path.includes('/gallery')) return 'weekly'
  if (path.includes('/privacy') || path.includes('/terms')) return 'monthly'
  return 'weekly'
}

function getPriority(path) {
  if (path === '/en-AU') return 1.0
  if (path.includes('/emergency')) return 1.0
  if (path.includes('/services/')) return 0.8
  if (path.includes('/contact')) return 0.8
  if (path.includes('/about')) return 0.7
  if (path.includes('/service-areas')) return 0.7
  if (path.includes('/blog')) return 0.6
  if (path.includes('/testimonials')) return 0.6
  if (path.includes('/gallery')) return 0.6
  if (path.includes('/faq')) return 0.5
  if (path.includes('/privacy') || path.includes('/terms')) return 0.3
  return 0.5
}

function verifyPageConnections() {
  const issues = []
  const appDir = path.join(__dirname, '../app')

  // Check all pages exist
  Object.values(PAGES).forEach(page => {
    const pagePath = path.join(appDir, page.path, 'page.tsx')
    const loadingPath = path.join(appDir, page.path, 'loading.tsx')

    try {
      require.resolve(pagePath)
    } catch (error) {
      issues.push(`Missing page file: ${page.path}/page.tsx`)
    }

    try {
      require.resolve(loadingPath)
    } catch (error) {
      issues.push(`Missing loading state: ${page.path}/loading.tsx`)
    }
  })

  // Check service pages
  SERVICES.forEach(service => {
    const pagePath = path.join(appDir, service.href, 'page.tsx')
    const loadingPath = path.join(appDir, service.href, 'loading.tsx')

    try {
      require.resolve(pagePath)
    } catch (error) {
      issues.push(`Missing service page: ${service.href}/page.tsx`)
    }

    try {
      require.resolve(loadingPath)
    } catch (error) {
      issues.push(`Missing service loading state: ${service.href}/loading.tsx`)
    }
  })

  // Check API endpoints
  const apiEndpoints = [
    '/api/services',
    '/api/areas',
    '/api/emergency',
    '/api/health',
    '/api/sitemap'
  ]

  apiEndpoints.forEach(endpoint => {
    const apiPath = path.join(appDir, endpoint, 'route.js')
    try {
      require.resolve(apiPath)
    } catch (error) {
      issues.push(`Missing API endpoint: ${endpoint}/route.js`)
    }
  })

  return {
    valid: issues.length === 0,
    issues
  }
}

module.exports = {
  generateSitemap,
  verifyPageConnections
}
