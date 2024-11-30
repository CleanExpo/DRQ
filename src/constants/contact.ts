interface Address {
  readonly STREET: string;
  readonly SUBURB: string;
  readonly STATE: string;
  readonly POSTCODE: string;
}

interface Social {
  readonly FACEBOOK: string;
  readonly LINKEDIN: string;
  readonly YOUTUBE: string;
  readonly PODCAST: string;
}

interface Hours {
  readonly EMERGENCY: string;
  readonly OFFICE: string;
}

interface Contact {
  readonly BUSINESS_NAME: string;
  readonly PHONE: string;
  readonly EMAIL: string;
  readonly WEBSITE: string;
  readonly ADDRESS: Address;
  readonly SOCIAL: Social;
  readonly HOURS: Hours;
}

export const CONTACT: Contact = {
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
    FACEBOOK: 'https://www.facebook.com/disasterrecoveryau/',
    LINKEDIN: 'https://www.linkedin.com/company/75619799/admin/dashboard/',
    YOUTUBE: 'https://www.youtube.com/watch?v=9gC8xEJJpZM&ab_channel=CARSI',
    PODCAST: 'https://anchor.fm/s/fb3a1a8c/podcast/rss',
  },
  HOURS: {
    EMERGENCY: '24/7 Emergency Service',
    OFFICE: 'Mon-Fri: 8am-5pm',
  },
} as const;
