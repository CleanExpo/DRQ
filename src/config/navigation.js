const { SERVICES } = require('../constants/services')
const { CONTACT } = require('../constants/contact')

const mainNavigation = [
  {
    title: 'Home',
    href: '/en-AU',
    type: 'link'
  },
  {
    title: 'Services',
    type: 'dropdown',
    items: SERVICES.map(service => ({
      title: service.name,
      href: service.href,
      description: service.description
    }))
  },
  {
    title: 'Service Areas',
    href: '/en-AU/service-areas',
    type: 'link'
  },
  {
    title: 'About Us',
    href: '/en-AU/about',
    type: 'link'
  },
  {
    title: 'Contact',
    href: '/en-AU/contact',
    type: 'link'
  },
  {
    title: 'Emergency',
    href: '/en-AU/emergency',
    type: 'button',
    variant: 'emergency'
  }
]

const footerNavigation = {
  company: {
    title: 'Company',
    items: [
      { title: 'About Us', href: '/en-AU/about' },
      { title: 'Service Areas', href: '/en-AU/service-areas' },
      { title: 'Contact', href: '/en-AU/contact' }
    ]
  },
  services: {
    title: 'Services',
    items: SERVICES.map(service => ({
      title: service.name,
      href: service.href
    }))
  },
  resources: {
    title: 'Resources',
    items: [
      { title: 'Blog', href: '/en-AU/blog' },
      { title: 'Gallery', href: '/en-AU/gallery' },
      { title: 'Testimonials', href: '/en-AU/testimonials' },
      { title: 'FAQ', href: '/en-AU/faq' }
    ]
  },
  legal: {
    title: 'Legal',
    items: [
      { title: 'Privacy Policy', href: '/en-AU/privacy' },
      { title: 'Terms of Service', href: '/en-AU/terms' }
    ]
  },
  contact: {
    title: 'Contact Us',
    items: [
      { title: `Call ${CONTACT.PHONE}`, href: `tel:${CONTACT.PHONE}`, icon: 'phone' },
      { title: `Email ${CONTACT.EMAIL}`, href: `mailto:${CONTACT.EMAIL}`, icon: 'email' },
      { title: CONTACT.HOURS.OFFICE, icon: 'clock' },
      { title: CONTACT.HOURS.EMERGENCY, icon: 'emergency' }
    ]
  },
  social: {
    title: 'Follow Us',
    items: [
      { title: 'Facebook', href: CONTACT.SOCIAL.FACEBOOK, icon: 'facebook' },
      { title: 'Instagram', href: CONTACT.SOCIAL.INSTAGRAM, icon: 'instagram' },
      { title: 'LinkedIn', href: CONTACT.SOCIAL.LINKEDIN, icon: 'linkedin' }
    ]
  }
}

// Freeze the objects to prevent modifications
Object.freeze(mainNavigation)
mainNavigation.forEach(item => {
  Object.freeze(item)
  if (item.items) Object.freeze(item.items)
})

Object.freeze(footerNavigation)
Object.values(footerNavigation).forEach(section => {
  Object.freeze(section)
  Object.freeze(section.items)
})

module.exports = {
  mainNavigation,
  footerNavigation
}
