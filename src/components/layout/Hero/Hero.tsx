'use client';

import React from 'react';
import Image from 'next/image';
import { emergencyContact } from '../../../config/project.config';

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  emergencyContact: string;
  currentLocation?: string;
}

const heroStyles = {
  overlay: "absolute inset-0 bg-black/50",
  heading: "text-4xl md:text-6xl font-bold text-white mb-4",
  subheading: "text-xl md:text-2xl text-white/90 mb-8",
  cta: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-md text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
};

export const Hero: React.FC<HeroProps> = ({
  backgroundImage,
  title,
  subtitle,
  emergencyContact,
  currentLocation
}) => {
  const handleLearnMoreClick = () => {
    const element = document.getElementById('service-details');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={90}
        />
        <div className={heroStyles.overlay} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full">
          <div className="max-w-3xl">
            {currentLocation && (
              <div className="text-white/80 text-lg mb-2">
                Serving {currentLocation}
              </div>
            )}
            <h1 className={heroStyles.heading}>
              {title}
            </h1>
            <p className={heroStyles.subheading}>
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${emergencyContact}`}
                className={heroStyles.cta}
              >
                Call Now: {emergencyContact}
              </a>
              <button
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-md text-lg font-medium transition-all duration-300 backdrop-blur-sm"
                onClick={handleLearnMoreClick}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Available Badge */}
      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
        24/7 Emergency Service Available
      </div>
    </div>
  );
};

export default Hero;
