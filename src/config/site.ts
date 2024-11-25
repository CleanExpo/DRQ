export const siteConfig = {
  name: "Disaster Recovery QLD",
  description: "24/7 Emergency restoration services across South East Queensland",
  mainNav: [
    {
      title: "Services",
      items: [
        {
          title: "Water Damage",
          href: "/services/water-damage",
          description: "Emergency water damage restoration and flood cleanup services."
        },
        {
          title: "Fire Damage",
          href: "/services/fire-damage",
          description: "Professional fire and smoke damage restoration services."
        },
        {
          title: "Mould Remediation",
          href: "/services/mould-remediation",
          description: "Expert mould removal and remediation services."
        }
      ]
    },
    {
      title: "Locations",
      items: [
        {
          title: "Brisbane",
          href: "/locations/brisbane",
          description: "Serving Greater Brisbane and surrounding areas."
        },
        {
          title: "Gold Coast",
          href: "/locations/gold-coast",
          description: "Coverage across the Gold Coast region."
        }
      ]
    }
  ],
  links: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com"
  },
  contact: {
    phone: "1300 309 361",
    email: "info@disasterrecoveryqld.au",
    address: "Brisbane, QLD 4000"
  }
}

export type SiteConfig = typeof siteConfig
