'use client';

import { trackEmergencyContact } from '../../../utils/analytics';

interface EmergencyContactProps {
  phone: string;
}

export const EmergencyContact = ({ phone }: EmergencyContactProps) => {
  const handleClick = () => {
    trackEmergencyContact('header', 'phone');
  };

  return (
    <a
      href={`tel:${phone}`}
      onClick={handleClick}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      {phone}
    </a>
  );
};

export default EmergencyContact;
