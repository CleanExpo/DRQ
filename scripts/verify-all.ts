import { checkRoutes, validateServiceLinks, validateApiEndpoints } from '../src/utils/routeChecker'
import { SERVICES } from '../src/constants/services'
import { SERVICE_AREAS } from '../src/constants/areas'

interface VerificationResult {
  category: string
  total: number
  passed: number
  failed: number
  errors: string[]
}

async function runVerification() {
  console.log('Starting comprehensive verification...\n')
  const results: VerificationResult[] = []

  // Check routes
  console.log('Checking routes...')
  const routeResults = await checkRoutes()
  const failedRoutes = routeResults.filter(r => r.status === 'error')
  results.push({
    category: 'Routes',
    total: routeResults.length,
    passed: routeResults.length - failedRoutes.length,
    failed: failedRoutes.length,
    errors: failedRoutes.map(r => `${r.path}: ${r.error}`)
  })

  // Check service links
  console.log('\nChecking service links...')
  const serviceErrors = validateServiceLinks()
  results.push({
    category: 'Service Links',
    total: SERVICES.length,
    passed: SERVICES.length - serviceErrors.length,
    failed: serviceErrors.length,
    errors: serviceErrors
  })

  // Check API endpoints
  console.log('\nChecking API endpoints...')
  const apiErrors = await validateApiEndpoints()
  const apiEndpoints = ['/api/services', '/api/areas', '/api/emergency', '/api/health']
  results.push({
    category: 'API Endpoints',
    total: apiEndpoints.length,
    passed: apiEndpoints.length - apiErrors.length,
    failed: apiErrors.length,
    errors: apiErrors
  })

  // Check service areas
  console.log('\nChecking service areas...')
  const areaErrors: string[] = []
  for (const area of SERVICE_AREAS) {
    try {
      const response = await fetch(`/api/areas/check/4000`)
      if (!response.ok) {
        areaErrors.push(`Failed to check area ${area}: HTTP ${response.status}`)
      }
    } catch (error) {
      areaErrors.push(`Error checking area ${area}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  results.push({
    category: 'Service Areas',
    total: SERVICE_AREAS.length,
    passed: SERVICE_AREAS.length - areaErrors.length,
    failed: areaErrors.length,
    errors: areaErrors
  })

  // Print results
  console.log('\nVerification Results:')
  console.log('====================')
  
  let totalTests = 0
  let totalPassed = 0
  let totalFailed = 0

  results.forEach(result => {
    console.log(`\n${result.category}:`)
    console.log(`  Total: ${result.total}`)
    console.log(`  Passed: ${result.passed}`)
    console.log(`  Failed: ${result.failed}`)
    
    if (result.failed > 0) {
      console.log('  Errors:')
      result.errors.forEach(error => {
        console.log(`    - ${error}`)
      })
    }

    totalTests += result.total
    totalPassed += result.passed
    totalFailed += result.failed
  })

  // Print summary
  console.log('\nOverall Summary:')
  console.log('===============')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Total Passed: ${totalPassed}`)
  console.log(`Total Failed: ${totalFailed}`)
  console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(2)}%`)

  if (totalFailed > 0) {
    console.log('\n❌ Verification failed!')
    process.exit(1)
  } else {
    console.log('\n✅ All verifications passed!')
    process.exit(0)
  }
}

// Run verification
runVerification().catch(error => {
  console.error('Verification script failed:', error)
  process.exit(1)
})
