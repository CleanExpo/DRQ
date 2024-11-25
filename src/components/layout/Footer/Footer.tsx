'use client';

import { emergencyContact } from '@/config/project.config';
import { PhoneLink } from '@/components/common/PhoneLink';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Disaster Recovery QLD. Available 24/7.
          </p>
          <PhoneLink
            phone={emergencyContact.phone}
            className="text-red-400 hover:text-red-300 font-semibold mt-2 block"
          >
            Emergency: {emergencyContact.phone}
          </PhoneLink>
        </div>
      </div>
    </footer>
  );
};
