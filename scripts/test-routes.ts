import { checkRoutes, validateServiceLinks, validateApiEndpoints } from '../src/utils/routeChecker'

async function testRoutes() {
  console.log('Starting route tests...\n')

  // Test all routes
  console.log('Testing routes...')
  const routeResults = await checkRoutes()
  const failedRoutes = routeResults.filter(r => r.status === 'error')

  console.log(`Total routes tested: ${routeResults.length}`)
  console.log(`Failed routes: ${failedRoutes.length}`)

  if (failedRoutes.length > 0) {
    console.log('\nFailed routes:')
    failedRoutes.forEach(route => {
      console.log(`- ${route.path}: ${route.error}`)
    })
  }

  // Test service links
  console.log('\nValidating service links...')
  const serviceErrors = validateServiceLinks()

  if (serviceErrors.length > 0) {
    console.log('Service link errors:')
    serviceErrors.forEach(error => {
      console.log(`- ${error}`)
    })
  } else {
    console.log('All service links are valid')
  }

  // Test API endpoints
  console.log('\nValidating API endpoints...')
  const apiErrors = await validateApiEndpoints()

  if (apiErrors.length > 0) {
    console.log('API endpoint errors:')
    apiErrors.forEach(error => {
      console.log(`- ${error}`)
    })
  } else {
    console.log('All API endpoints are working')
  }

  // Test specific postcode checks
  console.log('\nTesting postcode checks...')
  const testPostcodes = ['4000', '4220', '4350', '9999']
  
  for (const postcode of testPostcodes) {
    try {
      const response = await fetch(`/api/areas/check/${postcode}`)
      const data = await response.json()
      console.log(`Postcode ${postcode}: ${data.isServiced ? 'Serviced' : 'Not serviced'}`)
      if (data.areas?.length > 0) {
        console.log(`  Areas: ${data.areas.join(', ')}`)
      }
    } catch (error) {
      console.log(`Error checking postcode ${postcode}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Final summary
  const totalErrors = failedRoutes.length + serviceErrors.length + apiErrors.length
  console.log('\nTest Summary:')
  console.log('-------------')
  console.log(`Total Routes: ${routeResults.length}`)
  console.log(`Failed Routes: ${failedRoutes.length}`)
  console.log(`Service Errors: ${serviceErrors.length}`)
  console.log(`API Errors: ${apiErrors.length}`)
  console.log(`Total Errors: ${totalErrors}`)
  
  if (totalErrors === 0) {
    console.log('\n✅ All tests passed!')
    process.exit(0)
  } else {
    console.log('\n❌ Tests failed!')
    process.exit(1)
  }
}

// Run tests
testRoutes().catch(error => {
  console.error('Test script failed:', error)
  process.exit(1)
})
