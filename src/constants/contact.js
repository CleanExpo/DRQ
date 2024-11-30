const CONTACT = {
  BUSINESS_NAME: 'Disaster Recovery Qld',
  PHONE: '1300 309 361',
  EMAIL: 'admin@disasterrecoveryqld.au',
  WEBSITE: 'www.disasterrecoveryqld.au',
  ADDRESS: {
    STREET: '123 Main Street',
    SUBURB: 'Brisbane',
    STATE: 'QLD',
    POSTCODE: '4000',
  },
  SOCIAL: {
    FACEBOOK: 'https://facebook.com/disasterrecoveryqld',
    INSTAGRAM: 'https://instagram.com/disasterrecoveryqld',
    LINKEDIN: 'https://linkedin.com/company/disasterrecoveryqld',
  },
  HOURS: {
    EMERGENCY: '24/7 Emergency Service',
    OFFICE: 'Mon-Fri: 8am-5pm',
  },
}

// Freeze the object to prevent modifications
Object.freeze(CONTACT)
Object.freeze(CONTACT.ADDRESS)
Object.freeze(CONTACT.SOCIAL)
Object.freeze(CONTACT.HOURS)

module.exports = { CONTACT }
