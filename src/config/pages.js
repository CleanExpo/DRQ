const PAGES = {
  home: {
    path: '/en-AU',
    title: 'DRQ - Disaster Recovery Queensland',
    description: 'Professional disaster recovery and restoration services across South East Queensland',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Hero', 'Services', 'CTA', 'Service Areas']
  },
  waterDamage: {
    path: '/en-AU/services/water-damage',
    title: 'Water Damage Restoration Services',
    description: '24/7 emergency water damage restoration services',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Hero', 'Services', 'Process', 'CTA', 'Service Areas']
  },
  floodRecovery: {
    path: '/en-AU/services/flood-recovery',
    title: 'Flood Recovery Services',
    description: 'Professional flood recovery and restoration services',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Hero', 'Services', 'Process', 'CTA', 'Service Areas']
  },
  mouldRemediation: {
    path: '/en-AU/services/mould-remediation',
    title: 'Mould Remediation Services',
    description: 'Expert mould detection and removal services',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Hero', 'Services', 'Process', 'CTA', 'Service Areas']
  },
  fireDamage: {
    path: '/en-AU/services/fire-damage',
    title: 'Fire Damage Restoration',
    description: 'Professional fire and smoke damage restoration',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Hero', 'Services', 'Process', 'CTA', 'Service Areas']
  },
  sewageCleanup: {
    path: '/en-AU/services/sewage-cleanup',
    title: 'Sewage Cleanup Services',
    description: 'Professional sewage cleanup and sanitization',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Hero', 'Services', 'Process', 'CTA', 'Service Areas']
  },
  commercial: {
    path: '/en-AU/services/commercial',
    title: 'Commercial Restoration Services',
    description: 'Professional restoration for commercial properties',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Hero', 'Services', 'Industries', 'Process', 'CTA', 'Service Areas']
  },
  contact: {
    path: '/en-AU/contact',
    title: 'Contact Us',
    description: 'Get in touch with our team',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Contact Form', 'Contact Info', 'Office Hours', 'Map']
  },
  emergency: {
    path: '/en-AU/emergency',
    title: 'Emergency Service',
    description: '24/7 emergency response services',
    status: 'developed',
    priority: 'high',
    requiredSections: ['Emergency Form', 'Phone Number', 'Service Types', 'Service Areas']
  },
  about: {
    path: '/en-AU/about',
    title: 'About Us',
    description: 'Learn about our company and values',
    status: 'developed',
    priority: 'medium',
    requiredSections: ['Company Info', 'Team', 'Values', 'History']
  },
  serviceAreas: {
    path: '/en-AU/service-areas',
    title: 'Service Areas',
    description: 'Areas we service in South East Queensland',
    status: 'developed',
    priority: 'medium',
    requiredSections: ['Area Map', 'Area List', 'Postcode Checker']
  },
  privacy: {
    path: '/en-AU/privacy',
    title: 'Privacy Policy',
    description: 'Our privacy policy',
    status: 'developed',
    priority: 'medium',
    requiredSections: ['Policy Content', 'Last Updated']
  },
  terms: {
    path: '/en-AU/terms',
    title: 'Terms of Service',
    description: 'Our terms of service',
    status: 'developed',
    priority: 'medium',
    requiredSections: ['Terms Content', 'Last Updated']
  },
  faq: {
    path: '/en-AU/faq',
    title: 'Frequently Asked Questions',
    description: 'Common questions about our services',
    status: 'developed',
    priority: 'medium',
    requiredSections: ['FAQ List', 'Categories', 'Search']
  },
  blog: {
    path: '/en-AU/blog',
    title: 'Blog & News',
    description: 'Latest updates and industry insights',
    status: 'developed',
    priority: 'low',
    requiredSections: ['Articles', 'Categories', 'Search']
  },
  testimonials: {
    path: '/en-AU/testimonials',
    title: 'Client Testimonials',
    description: 'What our clients say about us',
    status: 'developed',
    priority: 'low',
    requiredSections: ['Reviews', 'Rating Summary', 'Categories']
  },
  gallery: {
    path: '/en-AU/gallery',
    title: 'Project Gallery',
    description: 'View our completed projects',
    status: 'developed',
    priority: 'low',
    requiredSections: ['Image Gallery', 'Categories', 'Filters']
  }
}

function getPageStatus() {
  const total = Object.keys(PAGES).length
  const developed = Object.values(PAGES).filter(p => p.status === 'developed').length
  const pending = Object.values(PAGES).filter(p => p.status === 'pending').length
  
  const highPriority = Object.values(PAGES).filter(p => p.priority === 'high' && p.status === 'pending').length
  const mediumPriority = Object.values(PAGES).filter(p => p.priority === 'medium' && p.status === 'pending').length
  const lowPriority = Object.values(PAGES).filter(p => p.priority === 'low' && p.status === 'pending').length

  return {
    total,
    developed,
    pending,
    pendingByPriority: {
      high: highPriority,
      medium: mediumPriority,
      low: lowPriority
    }
  }
}

module.exports = { PAGES, getPageStatus }
