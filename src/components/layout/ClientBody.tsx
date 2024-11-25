'use client';

import { ReactNode } from 'react';
import { ClientHeader } from './Header/ClientHeader';
import { Footer } from './Footer/Footer';
import { ErrorBoundary } from '../ErrorBoundary';
import { Locale, getSupportedLocales } from '@/config/i18n.config';
import { emergencyContact } from '@/config/project.config';

interface ClientBodyProps {
  children: ReactNode;
  locale: Locale;
}

export const ClientBody: React.FC<ClientBodyProps> = ({ children, locale }) => {
  return (
    <div className="min-h-screen flex flex-col font-inter">
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
        <Footer />
      </ErrorBoundary>
    </div>
  );
};
