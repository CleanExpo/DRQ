import { locationStructure } from '@/config/locations'
import { serviceStructure, commercialStructure } from '@/config/services'

// Helper types for navigation items
export interface NavItem {
  title: string
  href: string
  description?: string
}

export interface NavItemWithChildren {
  title: string
  items: NavItem[]
}

export type NavigationItem = NavItem | NavItemWithChildren

export const siteNavigation = {
  mainNav: [
    {
      title: "Services",
      items: Object.entries(serviceStructure).map(([id, service]) => ({
        title: service.title,
        href: `/services/${id}`,
        description: service.description
      }))
    },
    {
      title: "Commercial",
      items: commercialStructure.industries.map(industry => ({
        title: industry.title,
        href: `/services/commercial/${industry.id}`,
        description: `Specialized services for ${industry.title.toLowerCase()}`
      }))
    },
    {
      title: "Locations",
      items: Object.entries(locationStructure).map(([id, location]) => ({
        title: location.name,
        href: `/locations/${id}`,
        description: `Service coverage in ${location.name}`
      }))
    },
    {
      title: "About",
      href: "/about"
    }
  ] as NavigationItem[],

  footerNav: {
    services: Object.entries(serviceStructure).map(([id, service]) => ({
      title: service.title,
      href: `/services/${id}`
    })),
    locations: Object.entries(locationStructure).map(([id, location]) => ({
      title: location.name,
      href: `/locations/${id}`
    })),
    company: [
      { title: "About Us", href: "/about" },
      { title: "Emergency Response", href: "/emergency" },
      { title: "Contact", href: "/contact" }
    ]
  },

  // Utility function to validate all links
  validateLinks: () => {
    const allLinks = new Set<string>()

    // Collect all links from main nav
    siteNavigation.mainNav.forEach(item => {
      if ('href' in item) {
        allLinks.add(item.href)
      }
      if ('items' in item) {
        item.items.forEach(subItem => {
          allLinks.add(subItem.href)
        })
      }
    })

    // Collect all links from footer nav
    Object.values(siteNavigation.footerNav).forEach(section => {
      if (Array.isArray(section)) {
        section.forEach(item => {
          allLinks.add(item.href)
        })
      }
    })

    return Array.from(allLinks)
  }
} as const
