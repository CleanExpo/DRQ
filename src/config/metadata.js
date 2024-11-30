const { CONTACT } = require('../constants/contact')

const isDevelopment = process.env.NODE_ENV === 'development'
const baseUrl = isDevelopment ? 'http://localhost:3002' : `https://${CONTACT.WEBSITE}`

const siteMetadata = {
  title: CONTACT.BUSINESS_NAME,
  description: 'Professional disaster recovery and restoration services across South East Queensland',
  siteUrl: baseUrl,
  phone: CONTACT.PHONE,
  email: CONTACT.EMAIL,
  address: `${CONTACT.ADDRESS.STREET}, ${CONTACT.ADDRESS.SUBURB}, ${CONTACT.ADDRESS.STATE} ${CONTACT.ADDRESS.POSTCODE}`,
  openingHours: {
    emergency: CONTACT.HOURS.EMERGENCY,
    office: CONTACT.HOURS.OFFICE
  },
  social: {
    facebook: CONTACT.SOCIAL.FACEBOOK,
    instagram: CONTACT.SOCIAL.INSTAGRAM,
    linkedin: CONTACT.SOCIAL.LINKEDIN
  },
  locale: 'en-AU',
  type: 'website',
  keywords: [
    'disaster recovery',
    'water damage',
    'flood recovery',
    'mould remediation',
    'fire damage',
    'sewage cleanup',
    'commercial restoration',
    'emergency services',
    'Queensland',
    'Brisbane',
    'Gold Coast',
    'property restoration'
  ],
  openGraph: {
    title: CONTACT.BUSINESS_NAME,
    description: 'Professional disaster recovery and restoration services across South East Queensland',
    url: baseUrl,
    siteName: CONTACT.BUSINESS_NAME,
    locale: 'en-AU',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Disaster Recovery Queensland'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@DisasterRecoveryQLD',
    creator: '@DisasterRecoveryQLD'
  }
}

// Freeze the object to prevent modifications
Object.freeze(siteMetadata)
Object.freeze(siteMetadata.openingHours)
Object.freeze(siteMetadata.social)
Object.freeze(siteMetadata.openGraph)
Object.freeze(siteMetadata.twitter)

module.exports = { siteMetadata }
