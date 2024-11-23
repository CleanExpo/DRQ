import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reportError, getUserFriendlyMessage } from '../utils/errorHandler';
import { emergencyContact } from '../config/project.config';

interface Props {
  children: ReactNode;
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
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportError(error);
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleHomeNavigation = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              {this.state.error 
                ? getUserFriendlyMessage(this.state.error)
                : "We're sorry, but something went wrong. Please try again or contact support if the problem persists."}
            </p>

            {/* Emergency Contact */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-semibold">
                Call Emergency Line: {emergencyContact.phone}
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div 
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-sm"
                data-testid="error-details"
              >
                <h2 className="font-bold mb-2">Error Details:</h2>
                <p className="text-red-600">{this.state.error.message}</p>
                <p className="text-gray-600 mt-2">{this.state.error.stack}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={this.handleRetry}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleHomeNavigation}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex-1"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
