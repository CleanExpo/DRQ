'use client';

import React from 'react';
import Image from 'next/image';
import { trackEmergencyContact } from '@/utils/analytics';

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  emergencyContact: string;
  currentLocation?: string;
}

export const Hero: React.FC<HeroProps> = ({
  backgroundImage,
  title,
  subtitle,
  emergencyContact,
  currentLocation
}) => {
  const handleEmergencyClick = () => {
    trackEmergencyContact('banner', 'click');
  };

  return (
    <div className="relative h-[600px] w-full">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
        role="presentation"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full">
          {currentLocation && (
            <p className="text-lg text-white/90 mb-2">
              Serving {currentLocation}
            </p>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`tel:${emergencyContact}`}
              onClick={handleEmergencyClick}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Now: {emergencyContact}
            </a>
            
            <button
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full backdrop-blur-sm transition-colors duration-200"
              onClick={() => {
                const element = document.getElementById('services');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Services
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
