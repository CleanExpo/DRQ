const path = require('path')
const { PAGES } = require(path.join(__dirname, '../src/config/pages.js'))

function generateStatusReport() {
  console.log('Page Development Status Report')
  console.log('============================\n')

  const total = Object.keys(PAGES).length
  const developed = Object.values(PAGES).filter(p => p.status === 'developed').length
  const pending = Object.values(PAGES).filter(p => p.status === 'pending').length
  
  const highPriority = Object.values(PAGES).filter(p => p.priority === 'high' && p.status === 'pending').length
  const mediumPriority = Object.values(PAGES).filter(p => p.priority === 'medium' && p.status === 'pending').length
  const lowPriority = Object.values(PAGES).filter(p => p.priority === 'low' && p.status === 'pending').length

  // Overall Progress
  console.log('Overall Progress:')
  console.log(`Total Pages: ${total}`)
  console.log(`Developed: ${developed} (${((developed / total) * 100).toFixed(1)}%)`)
  console.log(`Pending: ${pending} (${((pending / total) * 100).toFixed(1)}%)\n`)

  // Pending Pages by Priority
  console.log('Pending Pages by Priority:')
  console.log(`High Priority: ${highPriority}`)
  console.log(`Medium Priority: ${mediumPriority}`)
  console.log(`Low Priority: ${lowPriority}\n`)

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
  if (highPriority > 0) {
    console.log('\nHigh Priority:')
    Object.values(PAGES)
      .filter(page => page.status === 'pending' && page.priority === 'high')
      .forEach(page => {
        console.log(`❌ ${page.title}`)
        console.log(`   Path: ${page.path}`)
        console.log(`   Required Sections: ${page.requiredSections.join(', ')}\n`)
      })
  }

  // Medium Priority
  if (mediumPriority > 0) {
    console.log('\nMedium Priority:')
    Object.values(PAGES)
      .filter(page => page.status === 'pending' && page.priority === 'medium')
      .forEach(page => {
        console.log(`❌ ${page.title}`)
        console.log(`   Path: ${page.path}`)
        console.log(`   Required Sections: ${page.requiredSections.join(', ')}\n`)
      })
  }

  // Low Priority
  if (lowPriority > 0) {
    console.log('\nLow Priority:')
    Object.values(PAGES)
      .filter(page => page.status === 'pending' && page.priority === 'low')
      .forEach(page => {
        console.log(`❌ ${page.title}`)
        console.log(`   Path: ${page.path}`)
        console.log(`   Required Sections: ${page.requiredSections.join(', ')}\n`)
      })
  }

  // Next Steps
  console.log('\nNext Steps:')
  console.log('1. Complete remaining low priority pages:')
  Object.values(PAGES)
    .filter(page => page.status === 'pending')
    .sort((a, b) => {
      const priorityOrder = { low: 0, medium: 1, high: 2 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    .forEach(page => {
      console.log(`   - ${page.title} (${page.priority} priority)`)
    })
}

generateStatusReport()
