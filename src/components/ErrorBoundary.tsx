'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reportError, getUserFriendlyMessage } from '../utils/errorHandler';
import { emergencyContact } from '../config/project.config';

interface Props {
  children: ReactNode;
  locale: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportError(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const friendlyMessage = getUserFriendlyMessage(this.state.error?.message || '', this.props.locale);
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Oops! Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {friendlyMessage}
              </p>
            </div>
            <div className="mt-8">
              <p className="text-sm text-gray-500">
                Need immediate assistance?
              </p>
              <a
                href={`tel:${emergencyContact.phone}`}
                className="mt-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Call {emergencyContact.phone}
              </a>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-blue-600 hover:text-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
