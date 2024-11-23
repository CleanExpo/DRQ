'use client';

import React from 'react';
import { trackEmergencyContact } from '@/utils/analytics';

interface EmergencyContactProps {
  phone: string;
  available: boolean;
}

export const EmergencyContact: React.FC<EmergencyContactProps> = ({
  phone,
  available = true
}) => {
  const handleClick = () => {
    trackEmergencyContact('header', 'click');
  };

  const formattedPhone = phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');

  return (
    <div className="flex items-center">
      <a
        href={`tel:${phone}`}
        onClick={handleClick}
        className={`
          inline-flex items-center px-4 py-2 rounded-full
          ${available 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-gray-200 text-gray-600 pointer-events-none'}
          transition-colors duration-200
        `}
        role="button"
        aria-label={`${available ? 'Call emergency number' : 'Emergency line currently unavailable'}: ${formattedPhone}`}
      >
        <svg
          className="w-4 h-4 mr-2"
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
        <span className="font-medium">{formattedPhone}</span>
      </a>
      {!available && (
        <span 
          className="ml-2 text-sm text-gray-500"
          role="status"
        >
          Currently unavailable
        </span>
      )}
    </div>
  );
};
