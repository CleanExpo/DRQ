const { PAGES } = require('../src/config/pages')
const { SERVICES } = require('../src/constants/services')
const { mainNavigation, footerNavigation } = require('../src/config/navigation')

function verifyLinks() {
  console.log('Link Verification Report')
  console.log('======================\n')

  const issues = []
  const checkedLinks = new Set()

  // Helper to add issues
  const addIssue = (message, location) => {
    issues.push({ message, location })
  }

  // Helper to check if a link exists
  const linkExists = (href) => {
    if (checkedLinks.has(href)) return true
    
    // Check if it's a service page
    const isServicePage = SERVICES.some(service => service.href === href)
    if (isServicePage) {
      checkedLinks.add(href)
      return true
    }

    // Check if it's a defined page
    const isDefinedPage = Object.values(PAGES).some(page => page.path === href)
    if (isDefinedPage) {
      checkedLinks.add(href)
      return true
    }

    return false
  }

  // Check main navigation links
  console.log('Checking Main Navigation...')
  mainNavigation.forEach(item => {
    if (item.type === 'link') {
      if (!linkExists(item.href)) {
        addIssue(`Missing page for link: ${item.href}`, 'Main Navigation')
      }
    } else if (item.type === 'dropdown') {
      item.items?.forEach(subItem => {
        if (!linkExists(subItem.href)) {
          addIssue(`Missing page for dropdown item: ${subItem.href}`, 'Main Navigation')
        }
      })
    }
  })

  // Check footer navigation links
  console.log('Checking Footer Navigation...')
  Object.entries(footerNavigation).forEach(([section, content]) => {
    content.items?.forEach(item => {
      if (item.href && !item.href.startsWith('tel:') && !item.href.startsWith('mailto:')) {
        if (!linkExists(item.href)) {
          addIssue(`Missing page for link: ${item.href}`, `Footer - ${section}`)
        }
      }
    })
  })

  // Check service pages
  console.log('Checking Service Pages...')
  SERVICES.forEach(service => {
    if (!linkExists(service.href)) {
      addIssue(`Missing service page: ${service.href}`, 'Services')
    }
  })

  // Print results
  console.log('\nResults:')
  console.log('--------')
  console.log(`Total Links Checked: ${checkedLinks.size}`)
  console.log(`Issues Found: ${issues.length}\n`)

  if (issues.length > 0) {
    console.log('Issues:')
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.location}] ${issue.message}`)
    })
  } else {
    console.log('✅ All links are valid and pages exist')
  }

  // Print navigation structure
  console.log('\nNavigation Structure:')
  console.log('--------------------')
  console.log('Main Navigation:')
  mainNavigation.forEach(item => {
    if (item.type === 'link') {
      console.log(`  - ${item.title} (${item.href})`)
    } else if (item.type === 'dropdown') {
      console.log(`  - ${item.title}:`)
      item.items?.forEach(subItem => {
        console.log(`    └─ ${subItem.title} (${subItem.href})`)
      })
    }
  })

  console.log('\nFooter Navigation:')
  Object.entries(footerNavigation).forEach(([section, content]) => {
    console.log(`  - ${content.title}:`)
    content.items?.forEach(item => {
      console.log(`    └─ ${item.title}${item.href ? ` (${item.href})` : ''}`)
    })
  })

  // Return status for script exit code
  return issues.length === 0
}

// Run verification
const success = verifyLinks()
process.exit(success ? 0 : 1)
