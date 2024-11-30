import { PAGES, getPageStatus } from '../src/config/pages'

function generateStatusReport() {
  console.log('Page Development Status Report')
  console.log('============================\n')

  const status = getPageStatus()

  // Overall Progress
  console.log('Overall Progress:')
  console.log(`Total Pages: ${status.total}`)
  console.log(`Developed: ${status.developed} (${((status.developed / status.total) * 100).toFixed(1)}%)`)
  console.log(`Pending: ${status.pending} (${((status.pending / status.total) * 100).toFixed(1)}%)\n`)

  // Pending Pages by Priority
  console.log('Pending Pages by Priority:')
  console.log(`High Priority: ${status.pendingByPriority.high}`)
  console.log(`Medium Priority: ${status.pendingByPriority.medium}`)
  console.log(`Low Priority: ${status.pendingByPriority.low}\n`)

  // Developed Pages
  console.log('Developed Pages:')
  Object.values(PAGES)
    .filter(page => page.status === 'developed')
    .forEach(page => {
      console.log(`✅ ${page.title}`)
      console.log(`   Path: ${page.path}`)
      console.log(`   Sections: ${page.requiredSections.join(', ')}\n`)
    })

  // Pending Pages
  console.log('Pending Pages:')
  console.log('-------------')
  
  // High Priority
  console.log('\nHigh Priority:')
  Object.values(PAGES)
    .filter(page => page.status === 'pending' && page.priority === 'high')
    .forEach(page => {
      console.log(`❌ ${page.title}`)
      console.log(`   Path: ${page.path}`)
      console.log(`   Required Sections: ${page.requiredSections.join(', ')}\n`)
    })

  // Medium Priority
  console.log('\nMedium Priority:')
  Object.values(PAGES)
    .filter(page => page.status === 'pending' && page.priority === 'medium')
    .forEach(page => {
      console.log(`❌ ${page.title}`)
      console.log(`   Path: ${page.path}`)
      console.log(`   Required Sections: ${page.requiredSections.join(', ')}\n`)
    })

  // Low Priority
  console.log('\nLow Priority:')
  Object.values(PAGES)
    .filter(page => page.status === 'pending' && page.priority === 'low')
    .forEach(page => {
      console.log(`❌ ${page.title}`)
      console.log(`   Path: ${page.path}`)
      console.log(`   Required Sections: ${page.requiredSections.join(', ')}\n`)
    })

  // Next Steps
  console.log('\nRecommended Next Steps:')
  console.log('1. Develop high priority pages first:')
  Object.values(PAGES)
    .filter(page => page.status === 'pending' && page.priority === 'high')
    .forEach(page => {
      console.log(`   - ${page.title} (${page.path})`)
    })

  console.log('\n2. Then proceed with medium priority pages:')
  Object.values(PAGES)
    .filter(page => page.status === 'pending' && page.priority === 'medium')
    .forEach(page => {
      console.log(`   - ${page.title} (${page.path})`)
    })

  console.log('\n3. Finally, complete low priority pages:')
  Object.values(PAGES)
    .filter(page => page.status === 'pending' && page.priority === 'low')
    .forEach(page => {
      console.log(`   - ${page.title} (${page.path})`)
    })
}

// Run report
generateStatusReport()
