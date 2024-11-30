import { SERVICES } from '../src/constants/services'
import { SERVICE_AREAS } from '../src/constants/areas'
import { CONTACT } from '../src/constants/contact'

interface LinkCheck {
  url: string
  source: string
  status: 'ok' | 'error'
  error?: string
}

async function checkLink(url: string, source: string): Promise<LinkCheck> {
  try {
    const response = await fetch(url)
    return {
      url,
      source,
      status: response.ok ? 'ok' : 'error',
      error: response.ok ? undefined : `HTTP ${response.status}`
    }
  } catch (error) {
    return {
      url,
      source,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function verifyLinks() {
  console.log('Starting link verification...\n')
  const checks: LinkCheck[] = []

  // Check service links
  console.log('Checking service links...')
  for (const service of SERVICES) {
    const check = await checkLink(service.href, 'Services')
    checks.push(check)
  }

  // Check social media links
  console.log('\nChecking social media links...')
  for (const [platform, url] of Object.entries(CONTACT.SOCIAL)) {
    const check = await checkLink(url, `Social - ${platform}`)
    checks.push(check)
  }

  // Check common pages
  console.log('\nChecking common pages...')
  const commonPages = [
    '/en-AU',
    '/en-AU/contact',
    '/en-AU/emergency',
    '/en-AU/services'
  ]
  for (const page of commonPages) {
    const check = await checkLink(page, 'Common Pages')
    checks.push(check)
  }

  // Check API endpoints
  console.log('\nChecking API endpoints...')
  const apiEndpoints = [
    '/api/services',
    '/api/areas',
    '/api/emergency',
    '/api/health'
  ]
  for (const endpoint of apiEndpoints) {
    const check = await checkLink(endpoint, 'API')
    checks.push(check)
  }

  // Check postcode endpoints for each area
  console.log('\nChecking postcode endpoints...')
  for (const area of SERVICE_AREAS) {
    const check = await checkLink(`/api/areas/check/4000`, `Postcode - ${area}`)
    checks.push(check)
  }

  // Results
  const failedChecks = checks.filter(check => check.status === 'error')
  
  console.log('\nVerification Results:')
  console.log('--------------------')
  console.log(`Total Links Checked: ${checks.length}`)
  console.log(`Failed Links: ${failedChecks.length}`)

  if (failedChecks.length > 0) {
    console.log('\nFailed Links:')
    failedChecks.forEach(check => {
      console.log(`- ${check.url} (${check.source}): ${check.error}`)
    })
    process.exit(1)
  } else {
    console.log('\n✅ All links are working!')
    process.exit(0)
  }
}

// Run verification
verifyLinks().catch(error => {
  console.error('Link verification failed:', error)
  process.exit(1)
})
