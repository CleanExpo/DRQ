import type { Metadata } from 'next';
import { ClientHeader } from '../components/layout/Header/ClientHeader';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { reportWebVitals } from '../utils/webVitals';
import { Locale, getSupportedLocales } from '../config/i18n.config';
import { emergencyContact } from '../config/project.config';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Disaster Recovery QLD',
    default: 'Disaster Recovery QLD - Emergency Response Services'
  },
  description: 'Professional Emergency Response for Water, Fire, and Mould Damage. Available 24/7 across South East Queensland.',
  metadataBase: new URL('https://disasterrecoveryqld.au'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Disaster Recovery QLD',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export default function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  return (
    <html lang={locale}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance observer setup
              let script = document.createElement('script');
              script.src = 'https://unpkg.com/web-vitals/dist/web-vitals.iife.js';
              script.async = true;
              script.onload = function() {
                // Initialize web vitals reporting
                webVitals.getCLS((m) => window.reportWebVitals(m));
                webVitals.getFCP((m) => window.reportWebVitals(m));
                webVitals.getFID((m) => window.reportWebVitals(m));
                webVitals.getLCP((m) => window.reportWebVitals(m));
                webVitals.getTTFB((m) => window.reportWebVitals(m));
              };
              document.head.appendChild(script);
            `
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-inter">
        <ErrorBoundary locale={locale}>
          <ClientHeader 
            currentLanguage={locale}
            availableLanguages={getSupportedLocales()}
            emergency={{
              phone: emergencyContact.phone,
              available: emergencyContact.available
            }}
          />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center">
                <p className="text-sm">
                  © {new Date().getFullYear()} Disaster Recovery QLD. Available 24/7.
                </p>
                <a
                  href={`tel:${emergencyContact.phone}`}
                  className="text-red-400 hover:text-red-300 font-semibold mt-2 block"
                >
                  Emergency: {emergencyContact.phone}
                </a>
              </div>
            </div>
          </footer>
        </ErrorBoundary>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.reportWebVitals = ${reportWebVitals.toString()}
            `
          }}
        />
      </body>
    </html>
  );
}
