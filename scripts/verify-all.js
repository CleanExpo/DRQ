const { execSync } = require('child_process')
const { CONTACT } = require('../src/constants/contact')

function runVerification() {
  console.log('Complete Site Verification Report')
  console.log('===============================\n')

  const checks = [
    {
      name: 'Page Status',
      command: 'node scripts/check-status.js',
      description: 'Verifying page development status'
    },
    {
      name: 'Links',
      command: 'node scripts/verify-links.js',
      description: 'Verifying site navigation and links'
    },
    {
      name: 'Pages',
      command: 'node scripts/verify-pages.js',
      description: 'Verifying page structure and content'
    },
    {
      name: 'API',
      command: 'node scripts/verify-api.js',
      description: 'Verifying API endpoints'
    }
  ]

  const results = []
  let allPassed = true

  // Print site information
  console.log('Site Information:')
  console.log('----------------')
  console.log(`Business Name: ${CONTACT.BUSINESS_NAME}`)
  console.log(`Website: ${CONTACT.WEBSITE}`)
  console.log(`Phone: ${CONTACT.PHONE}`)
  console.log(`Email: ${CONTACT.EMAIL}\n`)

  // Run each verification check
  for (const check of checks) {
    console.log(`\n${check.description}...`)
    console.log('-'.repeat(check.description.length + 4))
    
    try {
      execSync(check.command, { stdio: 'inherit' })
      results.push({ name: check.name, passed: true })
    } catch (error) {
      results.push({ name: check.name, passed: false })
      allPassed = false
    }
  }

  // Print summary
  console.log('\nVerification Summary:')
  console.log('-------------------')
  results.forEach(result => {
    const status = result.passed ? '✅ Passed' : '❌ Failed'
    console.log(`${result.name}: ${status}`)
  })

  // Print recommendations if there are failures
  if (!allPassed) {
    console.log('\nRecommendations:')
    console.log('---------------')
    console.log('1. Fix any failed verifications noted above')
    console.log('2. Ensure all pages have proper loading states')
    console.log('3. Verify all links in navigation are working')
    console.log('4. Check API endpoints are responding correctly')
    console.log('5. Test all page transitions')
  }

  return allPassed
}

// Run verification
const success = runVerification()
process.exit(success ? 0 : 1)
