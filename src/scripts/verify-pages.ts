import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Type definitions for page groups
type PageGroup = Record<string, string[]>;

// Core functionality pages
const CORE_PAGES: PageGroup = {
  main: [
    'app/[locale]/page.tsx',
    'app/[locale]/__tests__/page.test.tsx'
  ],
  services: [
    'app/[locale]/services/page.tsx',
    'app/[locale]/services/__tests__/page.test.tsx',
    'app/[locale]/services/[serviceId]/page.tsx',
    'app/[locale]/services/[serviceId]/__tests__/page.test.tsx'
  ],
  areas: [
    'app/[locale]/areas/page.tsx',
    'app/[locale]/areas/__tests__/page.test.tsx',
    'app/[locale]/areas/[regionId]/page.tsx',
    'app/[locale]/areas/[regionId]/__tests__/page.test.tsx'
  ],
  emergency: [
    'app/[locale]/emergency/page.tsx',
    'app/[locale]/emergency/__tests__/page.test.tsx'
  ],
  about: [
    'app/[locale]/about/page.tsx',
    'app/[locale]/about/__tests__/page.test.tsx'
  ],
  contact: [
    'app/[locale]/contact/page.tsx',
    'app/[locale]/contact/__tests__/page.test.tsx'
  ]
};

// Content pages (blog, media, etc.)
const CONTENT_PAGES: PageGroup = {
  blog: [
    'app/[locale]/blog/page.tsx',
    'app/[locale]/blog/__tests__/page.test.tsx',
    'app/[locale]/blog/[postId]/page.tsx',
    'app/[locale]/blog/[postId]/__tests__/page.test.tsx'
  ],
  media: [
    'app/[locale]/gallery/page.tsx',
    'app/[locale]/gallery/__tests__/page.test.tsx',
    'app/[locale]/testimonials/page.tsx',
    'app/[locale]/testimonials/__tests__/page.test.tsx'
  ]
};

// Legal and information pages
const INFO_PAGES: PageGroup = {
  legal: [
    'app/[locale]/terms/page.tsx',
    'app/[locale]/terms/__tests__/page.test.tsx',
    'app/[locale]/privacy/page.tsx',
    'app/[locale]/privacy/__tests__/page.test.tsx'
  ],
  help: [
    'app/[locale]/faq/page.tsx',
    'app/[locale]/faq/__tests__/page.test.tsx'
  ]
};

interface PageCheck {
  exists: boolean;
  hasMetadata: boolean;
  hasTests: boolean;
  issues: string[];
}

function checkPage(filePath: string, isTest: boolean = false): PageCheck {
  const fullPath = join(process.cwd(), 'src', filePath);
  const result: PageCheck = {
    exists: existsSync(fullPath),
    hasMetadata: false,
    hasTests: false,
    issues: []
  };

  if (!result.exists) {
    result.issues.push(`File does not exist: ${filePath}`);
    return result;
  }

  try {
    const content = readFileSync(fullPath, 'utf-8');

    if (!isTest) {
      // Check for metadata
      result.hasMetadata = content.includes('export const metadata');
      if (!result.hasMetadata) {
        result.issues.push('Missing metadata export');
      }

      // Check for basic page structure
      if (!content.includes('export default function')) {
        result.issues.push('Missing default export function');
      }
    } else {
      // Check for test structure
      result.hasTests = content.includes('describe(') && content.includes('it(');
      if (!result.hasTests) {
        result.issues.push('Missing test cases');
      }

      // Check for metadata tests
      if (content.includes('metadata') && !content.includes('describe(\'Metadata\'')) {
        result.issues.push('Missing metadata tests');
      }
    }
  } catch (error) {
    result.issues.push(`Error reading file: ${error.message}`);
  }

  return result;
}

function verifyPages() {
  const results: Record<string, Record<string, PageCheck[]>> = {
    core: {},
    content: {},
    info: {}
  };

  // Check core pages
  Object.entries(CORE_PAGES).forEach(([key, files]) => {
    results.core[key] = files.map(file => 
      checkPage(file, file.includes('.test.'))
    );
  });

  // Check content pages
  Object.entries(CONTENT_PAGES).forEach(([key, files]) => {
    results.content[key] = files.map(file => 
      checkPage(file, file.includes('.test.'))
    );
  });

  // Check info pages
  Object.entries(INFO_PAGES).forEach(([key, files]) => {
    results.info[key] = files.map(file => 
      checkPage(file, file.includes('.test.'))
    );
  });

  // Print results
  console.log('\nPage Verification Results:\n');

  let hasIssues = false;

  Object.entries(results).forEach(([category, sections]) => {
    console.log(`\n${category.toUpperCase()} PAGES:`);
    console.log('='.repeat(50));

    Object.entries(sections).forEach(([section, checks]) => {
      console.log(`\n${section}:`);
      checks.forEach((check, index) => {
        const file = category === 'core' 
          ? CORE_PAGES[section][index]
          : category === 'content'
            ? CONTENT_PAGES[section][index]
            : INFO_PAGES[section][index];

        console.log(`\n  ${file}:`);
        console.log(`    Exists: ${check.exists ? '✓' : '✗'}`);
        if (!check.exists) {
          hasIssues = true;
          return;
        }

        if (!file.includes('.test.')) {
          console.log(`    Has Metadata: ${check.hasMetadata ? '✓' : '✗'}`);
          if (!check.hasMetadata) hasIssues = true;
        } else {
          console.log(`    Has Tests: ${check.hasTests ? '✓' : '✗'}`);
          if (!check.hasTests) hasIssues = true;
        }

        if (check.issues.length > 0) {
          hasIssues = true;
          console.log('    Issues:');
          check.issues.forEach(issue => console.log(`      - ${issue}`));
        }
      });
    });
  });

  if (hasIssues) {
    console.log('\n❌ Some pages have issues that need to be addressed.');
    process.exit(1);
  } else {
    console.log('\n✅ All pages verified successfully!');
  }
}

// Export page groups for reuse
export { CORE_PAGES, CONTENT_PAGES, INFO_PAGES };
export type { PageGroup, PageCheck };

// Run verification if this is the main module
if (require.main === module) {
  verifyPages();
}
