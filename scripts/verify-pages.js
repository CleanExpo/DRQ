const { verifyPageConnections } = require('../src/utils/sitemap')
const { PAGES } = require('../src/config/pages')
const { SERVICES } = require('../src/constants/services')

function generateConnectionReport() {
  console.log('Page Connection Verification Report')
  console.log('=================================\n')

  // Verify page connections
  const { valid, issues } = verifyPageConnections()

  // Print overall status
  console.log('Overall Status:', valid ? '✅ All pages connected' : '❌ Issues found')
  console.log(`Total Pages: ${Object.keys(PAGES).length}`)
  console.log(`Service Pages: ${SERVICES.length}`)
  console.log(`Total Issues: ${issues.length}\n`)

  // Print any issues
  if (issues.length > 0) {
    console.log('Issues Found:')
    console.log('-------------')
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`)
    })
    console.log('')
  }

  // Print page structure
  console.log('Page Structure:')
  console.log('--------------')
  
  // Group pages by section
  const sections = {
    'Core Pages': Object.values(PAGES).filter(p => p.priority === 'high'),
    'Service Pages': SERVICES,
    'Business Pages': Object.values(PAGES).filter(p => p.priority === 'medium'),
    'Content Pages': Object.values(PAGES).filter(p => p.priority === 'low')
  }

  // Print each section
  Object.entries(sections).forEach(([section, pages]) => {
    console.log(`\n${section}:`)
    pages.forEach(page => {
      const path = 'href' in page ? page.href : page.path
      const title = 'name' in page ? page.name : page.title
      console.log(`  ${valid ? '✅' : '❓'} ${title}`)
      console.log(`     Path: ${path}`)
    })
  })

  // Print navigation structure
  console.log('\nNavigation Structure:')
  console.log('--------------------')
  console.log('Main Navigation:')
  console.log('  - Home')
  console.log('  - Services')
  SERVICES.forEach(service => {
    console.log(`    └─ ${service.name}`)
  })
  console.log('  - Service Areas')
  console.log('  - About Us')
  console.log('  - Contact')
  console.log('  - Emergency Service')

  console.log('\nFooter Navigation:')
  console.log('  - Company')
  console.log('    └─ About Us')
  console.log('    └─ Service Areas')
  console.log('    └─ Contact')
  console.log('  - Services')
  SERVICES.forEach(service => {
    console.log(`    └─ ${service.name}`)
  })
  console.log('  - Resources')
  console.log('    └─ Blog')
  console.log('    └─ Gallery')
  console.log('    └─ Testimonials')
  console.log('    └─ FAQ')
  console.log('  - Legal')
  console.log('    └─ Privacy Policy')
  console.log('    └─ Terms of Service')

  // Print recommendations
  if (!valid) {
    console.log('\nRecommendations:')
    console.log('---------------')
    console.log('1. Fix any missing page files')
    console.log('2. Ensure all loading states are present')
    console.log('3. Verify all links in navigation')
    console.log('4. Check API endpoints for each interactive page')
    console.log('5. Test all page transitions')
  }

  // Return status for script exit code
  return valid ? 0 : 1
}

// Run report
const exitCode = generateConnectionReport()
process.exit(exitCode)
