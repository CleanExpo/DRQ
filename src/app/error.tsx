'use client';

import { useEffect } from 'react';
import { reportError } from '@/utils/errorHandler';
import { translate } from '@/utils/i18n';
import { trackEmergencyContact } from '@/utils/analytics';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
  locale?: string;
}

export default function ErrorPage({
  error,
  reset,
  locale = 'en-AU'
}: ErrorPageProps) {
  useEffect(() => {
    // Report the error
    reportError(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {translate('error.title', locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {translate('error.description', locale)}
        </p>
        <div className="space-y-4">
          <a
            href="tel:1300309361"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            onClick={() => trackEmergencyContact('form', 'error-page-call')}
          >
            {translate('emergency.call', locale)}: 1300 309 361
          </a>
          <div>
            <button
              onClick={() => reset()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {translate('error.retry', locale)}
            </button>
          </div>
          <div>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {translate('error.home', locale)}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
