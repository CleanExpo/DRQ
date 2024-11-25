'use client';

import Image from 'next/image';
import { PhoneLink } from '../../common/PhoneLink';

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  emergencyContact: string;
}

export const Hero: React.FC<HeroProps> = ({
  backgroundImage,
  title,
  subtitle,
  emergencyContact
}) => {
  return (
    <div className="relative h-[600px] w-full">
      <Image
        src={backgroundImage}
        alt="Emergency Response Services"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
            {subtitle}
          </p>
          <PhoneLink
            phone={emergencyContact}
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-red-700 transition-colors w-fit"
          >
            Call Now: {emergencyContact.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
          </PhoneLink>
        </div>
      </div>
    </div>
  );
};
