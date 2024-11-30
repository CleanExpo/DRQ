import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { StyleProvider } from '@/components/StyleProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://disasterrecoveryqld.au'),
  title: {
    template: '%s | Disaster Recovery QLD',
    default: 'Professional Restoration Services | Disaster Recovery QLD'
  },
  description: 'South East Queensland\'s trusted restoration experts. 24/7 emergency response for water damage, storm damage, flood damage, mould remediation, and sewage cleanup.',
  authors: [{ name: 'Disaster Recovery QLD' }],
  creator: 'Disaster Recovery QLD',
  publisher: 'Disaster Recovery QLD',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://disasterrecoveryqld.au',
    siteName: 'Disaster Recovery QLD',
    title: 'Professional Restoration Services | Disaster Recovery QLD',
    description: 'South East Queensland\'s trusted restoration experts. 24/7 emergency response for property damage restoration.',
    images: [
      {
        url: '/images/water-damage-restoration.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional water damage restoration service in action - emergency water extraction and drying equipment'
      },
      {
        url: '/images/mould-remediation.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional mould remediation service - safe removal of toxic mould from property'
      },
      {
        url: '/images/storm-damage-repair.jpg',
        width: 1200,
        height: 630,
        alt: 'Emergency storm damage repair service - protecting property from water damage after storms'
      },
      {
        url: '/images/sewage-cleanup.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional sewage cleanup and sanitization service - emergency response team in action'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Restoration Services | Disaster Recovery QLD',
    description: 'South East Queensland\'s trusted restoration experts. 24/7 emergency response for property damage restoration.',
    images: [
      {
        url: '/images/water-damage-restoration.jpg',
        alt: 'Professional water damage restoration service in action - emergency water extraction and drying equipment'
      },
      {
        url: '/images/flood-damage-cleanup.jpg',
        alt: 'Emergency flood damage cleanup service - professional water extraction and property restoration'
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'facebook-domain-verification': 'your-facebook-verification-code',
    },
  },
  alternates: {
    canonical: 'https://disasterrecoveryqld.au',
    languages: {
      'en-AU': 'https://disasterrecoveryqld.au/en-AU',
      'zh': 'https://disasterrecoveryqld.au/zh',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
        <StyleProvider>
          {/* Fixed header with backdrop blur */}
          <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
            <Navigation />
          </header>

          {/* Main content with padding to account for fixed header */}
          <main className="flex-grow mt-20">{children}</main>

          {/* Footer with gradient background */}
          <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-auto">
            <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Contact Us
                  </h3>
                  <div>
                    <p className="text-base text-gray-400">
                      24/7 Emergency Response
                    </p>
                    <a 
                      href="tel:1300309361"
                      className="mt-1 text-xl font-semibold text-white hover:text-red-400 transition-colors duration-200"
                    >
                      1300 309 361
                    </a>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Service Areas
                  </h3>
                  <ul className="space-y-3">
                    <li className="text-base text-gray-400 hover:text-white transition-colors duration-200">Brisbane</li>
                    <li className="text-base text-gray-400 hover:text-white transition-colors duration-200">Gold Coast</li>
                    <li className="text-base text-gray-400 hover:text-white transition-colors duration-200">Ipswich</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Certifications
                  </h3>
                  <ul className="space-y-3">
                    <li className="text-base text-gray-400 hover:text-white transition-colors duration-200">IICRC Certified</li>
                    <li className="text-base text-gray-400 hover:text-white transition-colors duration-200">Licensed & Insured</li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-700/50 text-center">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Disaster Recovery QLD. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </StyleProvider>
      </body>
    </html>
  );
}
