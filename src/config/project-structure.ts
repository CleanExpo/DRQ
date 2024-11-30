/**
 * Project Structure Configuration
 * 
 * This file defines the core structure of the DRQ Website project,
 * organizing components, pages, and utilities into logical groups.
 */

/** Navigation related components */
export const navigationComponents = {
  /** Core navigation components */
  components: [
    'components/layout/Navigation.tsx',         // Main navigation with mobile support
    'components/navigation/ServiceAreaDropdown.tsx' // Service area dropdown with accessibility
  ]
} as const;

/** Core layout components */
export const layoutComponents = {
  /** Essential layout building blocks */
  core: [
    'components/layout/Header.tsx' // Main header with emergency contact
  ]
} as const;

/** Utility files and tools */
export const utilityFiles = {
  /** Development and maintenance tools */
  tools: [
    'utils/logger.ts',        // Application-wide logging utility
    'scripts/verify-pages.ts' // Page structure verification tool
  ]
} as const;

/** Content pages */
export const contentPages = {
  /** Blog related pages */
  blog: [
    'app/[locale]/blog/page.tsx',
    'app/[locale]/blog/__tests__/page.test.tsx',
    'app/[locale]/blog/[postId]/page.tsx',
    'app/[locale]/blog/[postId]/__tests__/page.test.tsx'
  ],
  /** Media pages */
  gallery: [
    'app/[locale]/gallery/page.tsx',
    'app/[locale]/gallery/__tests__/page.test.tsx'
  ],
  /** Customer feedback pages */
  testimonials: [
    'app/[locale]/testimonials/page.tsx',
    'app/[locale]/testimonials/__tests__/page.test.tsx'
  ]
} as const;

/** Legal and informational pages */
export const infoPages = {
  /** Legal documentation */
  legal: [
    'app/[locale]/privacy/page.tsx',
    'app/[locale]/privacy/__tests__/page.test.tsx',
    'app/[locale]/terms/page.tsx',
    'app/[locale]/terms/__tests__/page.test.tsx'
  ],
  /** Help and support */
  faq: [
    'app/[locale]/faq/page.tsx',
    'app/[locale]/faq/__tests__/page.test.tsx'
  ]
} as const;

/** Type definitions for project structure */
export type ComponentGroup = typeof navigationComponents | typeof layoutComponents;
export type PageGroup = typeof contentPages | typeof infoPages;
export type UtilityGroup = typeof utilityFiles;

/** Helper function to get all file paths */
export function getAllPaths(): string[] {
  const groups = [
    navigationComponents,
    layoutComponents,
    utilityFiles,
    contentPages,
    infoPages
  ];
  
  return groups.flatMap(group => 
    Object.values(group).flatMap(files => 
      Array.isArray(files) ? files : Object.values(files)
    )
  );
}
