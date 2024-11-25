'use client';

import { useClient } from '@/components/providers/ClientProvider';

interface EmergencyButtonProps {
  phone: string;
  className?: string;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ phone, className = '' }) => {
  const { handleCall } = useClient();

  return (
    <button
      onClick={() => handleCall(phone)}
      className={`bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors ${className}`}
    >
      {phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
    </button>
  );
};
