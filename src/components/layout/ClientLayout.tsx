'use client';

import React from 'react';
import { Header } from './Header';
import { ErrorBoundary } from '../errors/ErrorBoundary';
import type { Locale } from '@/config/i18n.config';

interface ClientLayoutProps {
  children: React.ReactNode;
  locale: Locale;
}

export function ClientLayout({ children, locale }: ClientLayoutProps) {
  return (
    <>
      <ErrorBoundary>
        <Header currentLanguage={locale} />
      </ErrorBoundary>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </>
  );
}
