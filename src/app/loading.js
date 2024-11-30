import React from 'react'
import { CONTACT } from '../constants/contact'

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 w-full bg-white shadow-md">
        {/* Emergency Banner */}
        <div className="bg-secondary text-white text-center py-1 px-4">
          <p className="text-sm">
            24/7 Emergency Service - Call{' '}
            <a href={`tel:${CONTACT.PHONE}`} className="font-bold hover:underline">
              {CONTACT.PHONE}
            </a>
          </p>
        </div>

        {/* Navigation Skeleton */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center animate-pulse">
            {/* Logo */}
            <div className="h-8 w-32 bg-gray-200 rounded" />

            {/* Nav Items */}
            <div className="hidden md:flex space-x-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
              ))}
            </div>

            {/* Emergency Button */}
            <div className="h-10 w-32 bg-gray-200 rounded" />
          </div>
        </nav>
      </header>

      {/* Main Content Loading Spinner */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-24 bg-gray-700 rounded" />
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 w-32 bg-gray-700 rounded" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Skeleton */}
        <div className="border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="h-4 w-64 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  )
}
